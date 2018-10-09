'use strict';

var EuglenaUtils = require('./utils.js');
//var THREE = process.cwd() + "/lib/thirdparty/three/three.min.js";
var THREE = require('./three.min.js');

var EuglenaBody = require('./body_configurations.js');

var testCode = false;

var onlyPositiveLightChange = true; // if yaw can be changed only when the light difference is positive.

module.exports = {
  initialize: (config) => {
    config.track.mech = {
      euglenaBody:  new EuglenaBody.EuglenaBody(config.model.configuration,JSON.parse(config.model.sensorConfigJSON))
    }
  },

  update: (config) => {

    //var EugBody = new EuglenaBody.EuglenaBody(config.track.blockly.euglenaBody);
    var EugBody = config.track.mech.euglenaBody; //new EuglenaBody.EuglenaBody(config.model.configuration);
    if (config.frame == 1) { EugBody.constructBody(); }
    let tmp_euglena = EugBody.body;

    // initialize the array of lights to average over
    var lightArray = [0];
    var shock = EugBody.shock;

    // initialize array of reactions that is needed to implement reaction delays
    var prevReactions = [];
    var activationThreshold_prev = null;

    if (testCode) {
      config.last.x = 0
      config.last.y = 0
      config.last.z = 0
    }

    // Set orientation of Euglena
    // Local z - axis = forward direction
    // Local y - axis = eye
    if (config.frame == 1) {

      if (testCode) {
        config.last.roll = 0;
        config.last.yaw = 0;
      }

      // In first frame, orientation is in XY plane
      let v_head = new THREE.Vector3(1,0,0);
      v_head.applyAxisAngle(new THREE.Vector3(0,0,1), config.last.yaw);
      EuglenaUtils.setDirection(v_head,tmp_euglena);
      tmp_euglena.rotateZ(config.last.roll);
      tmp_euglena.position.set(config.track.x, config.track.y, config.track.z);

      activationThreshold_prev = EugBody.activationThreshold_default;
      if (EugBody.adapt.mode.match('shock')) {
        shock.mode = true;
        shock.state = false;
        shock.counter = null;
      } // Is shock reaction enabled?

    } else {
      let prev_Euler = new THREE.Euler(config.last.roll,config.last.pitch,config.last.yaw,'XYZ');
      tmp_euglena.setRotationFromEuler(prev_Euler);

      lightArray = config.last.lightArray;
      prevReactions = config.last.prevReactions;
      activationThreshold_prev = config.last.activationThreshold;
      if (EugBody.adapt.mode.match('shock')) { shock = config.last.shock; }
    }

    tmp_euglena.position.set(config.last.x, config.last.y, config.last.z);    // Set position of Euglena

    tmp_euglena.updateMatrixWorld();

    /* ********* Calculate the light for each light sensor *********
    If sensors have no orientation, they are sensitive to light from any direction.
    If sensors have orientation, they must have a Math.PI field
    If orientation is given, we take into account only light that falls into the visual field.
    If there is no light, ignore.
    */
    var sensorIntensities = [];
    if (Object.keys(config.lights).length) {
      sensorIntensities = EugBody.lightSensors.map((lightSensor,ind) => {
        var sensorOrientation = lightSensor.getOrientation()
        if(sensorOrientation.length){
          var v_sensor = new THREE.Vector3(sensorOrientation.x, sensorOrientation.y, sensorOrientation.z);
          tmp_euglena.localToWorld(v_sensor);
          v_sensor.subVectors(v_sensor,tmp_euglena.position);
          v_sensor.normalize();

          return EuglenaUtils.calculateSensorIntensity(config.lights, EugBody.defaults, tmp_euglena, lightSensor, v_sensor)
        } else {
          return EuglenaUtils.calculateSensorIntensity(config.lights, EugBody.defaults, tmp_euglena, lightSensor, [])
        }
      });
    } else {
      sensorIntensities = [0];
    }

//    if (!config.last.lights) { console.log(config.lights) }
//    else if ( config.last.lights.top != config.lights.top || config.last.lights.right != config.lights.right || config.last.lights.bottom != config.lights.bottom || config.last.lights.left != config.lights.left ) {
//      console.log(config.lights)
//    }
    // Store the sensorIntensities in lightArray
    // Average for 2 sensors, or actual value for 1 sensor
    // Alternatively choose the max of 2 sensors

    if (lightArray.length == Math.round(EugBody.light.memory * config.result.fps) ) {
      lightArray.splice(0,1);
    }
    var sensorIntensitiesAvg = sensorIntensities.reduce(function(a, b) { return a + b });
    lightArray.push(sensorIntensitiesAvg / sensorIntensities.length);

    var lightInfo = { currentLevel: sensorIntensities }

    if (sensorIntensities.length == 2) {
      // sort sensors based on which one is where
      if(EugBody.lightSensors.length >2) console.log("there are more than 2 sensors.");
      // substract the righ from the left eye
      var sensorOrder = ((EugBody.lightSensors[1].getPosition3D()).y - (EugBody.lightSensors[0].getPosition3D()).y) > 0 ? [1,0] : [0,1];
      var sensorDiff = (sensorOrder.map((v,ind) => {return sensorIntensities[v]})).reduce(function(a, b) { return a - b });
      lightInfo['diffBtwSensors'] = sensorDiff;
    }

    /* ********* Initialize parameters relevant for reaction ********* */
    const dT = 1 / config.result.fps;

    var fw_speed = 0;
    var roll_speed = 0;
    var delta_yaw = 0;

    fw_speed = EugBody.fw_speed;
    roll_speed = EugBody.roll_speed;
    var reactionStrength = 0;
    var lightDiff = 0;

    var turnDirection = EugBody.turn.direction_default;
    var rotationDir = 0;
    if (EugBody.lightSensors.length) {
      if (EugBody.lightSensors[0].field == 2*Math.PI) {
        rotationDir = EugBody.lightSensors[0].position.y ? EugBody.lightSensors[0].position.y : [-1,1][Math.random()*2|0]; // turn in random direction if sensor in middle
      } else {
        rotationDir = EugBody.lightSensors[0].orientation.y;
      }
      if (EugBody.lightSensors.length > 1) {
        rotationDir = (sensorIntensities[1] - sensorIntensities[0]) < 0 ? EugBody.lightSensors[1].position.y : EugBody.lightSensors[0].position.y;
      }
    }


    /* ********* Create all the adaptation information *********
    Calculate the adaptation level C (adaptLevel) and the differences in light to adaptation level (diffNowAdapt):
    Adaptation level C(t) = average over the previous detected light intensities I_(t-n), ..., I_(t-1)
    If the adaptation level was modeled as the charge / discharge of a capacitor,
    C_t(tt) = C_(t-1) + (I_t - C_(t-1)) * (1 - exp(-tt / tau_c)), then the change in adaptation level is
    dC_t/dt = (1 / tau_c) * (I_t - C_(t-1)) * exp(-tt / tau_c), and hence proportional to (I_t - C_(t-1)) = dI_t
    */

    /*
    There are multiple possible ways in which adaptation could occur:
    1. Continuous gradual adaptation: The activation threshold adapts continuously to whatever level of the light there is. When the light is dimmer than the current
       activation threshold by a certain amount, then it gets back to normal at a faster rate than the adaptation rate.
    2. Adaptation under shock: When the light intensity is bigger than the current activation threshold by a certain amount, the Euglena enters shock mode and is sort of
       locked into a state of turning. During this time, the activation level adapts to the light level. Under shock, it moves in one direction, but then it can flip the direction of rotation. As soon as the difference between the two is smaller than a certain value
       the Euglena is in a functional mode again, i.e. it can respond again properly. The Euglena can also get functional again immediately when the perceived light intensity is
       smaller than the current activation threshold by a certain amount, and the activation threshold adapts at a faster rate than the adaptation rate.
    3. While the adaptation to stronger light is like in 1 or 2, when the light then suddenly drops to a much lower level than the current activation threshold, then the Euglena is
       in some form of positive shock, similar to how the eye has to gain some sensitivity again when it goes from a bright to a dark room (see Diehn).
    */

    var turnModality = 'globalAxis';

    var activationThreshold_default = EugBody.activationThreshold_default;
    var activationThreshold_current = activationThreshold_prev;

    // calculate the backgroundLight after updating the lightArray, to enable immediate reaction to the new light intensity.
    var backgroundLight = {
      average: lightArray.reduce(function(a, b) { return a + b }) / lightArray.length,
      max: lightArray.reduce(function(a, b) { return Math.max(a, b); }),
    }

    let tmpArray = lightArray.map(elem => elem.toFixed(2));
//    console.log('backgroundLight ' + backgroundLight['average'].toFixed(2) + ' ' + backgroundLight['max'].toFixed(2) + ' ' + tmpArray)

     // 'state' - true, false or 'reset'; 'counter' - integer; 'duration' - integer; 'turnDirection' - -1 or 1
    var adapt = { modificationFactor: 1, speed: EugBody.adapt.speed, adaptedRange: EugBody.adapt.adaptedRange, direction: 'average' }

    var diffBackgroundToActThresh = backgroundLight['average'] - activationThreshold_prev; // sensorIntensities.reduce(function(a, b) { return Math.max(a, b)})
    if (EugBody.adapt.mode != 'adapt_shock' && diffBackgroundToActThresh > EugBody.adapt.thresholdSwitch) {
      turnModality = 'localAxis';
      reactionStrength = EugBody.adapt.reactionStrengthSwitch;
    }

    if (!EugBody.adapt.mode.match('null|0')) {

      // If activationThreshold has to increase away from the EugBody.activationThreshold_default, use speed config.result.fps / EugBody.adapt_speed
      // If activationThreshold adapts towards the EugBody.activationThreshold_default, use speed modified by EugBody.adapt_acceleration
      // If activationThreshold has to decrease away from the EugBody.activationThreshold_default, use speed modified by EugBody.adapt_deceleration

      if (activationThreshold_prev > activationThreshold_default && diffBackgroundToActThresh > 0) { adapt.modificationFactor = 1; }
      else if (Math.sign(activationThreshold_prev - activationThreshold_default)*Math.sign(diffBackgroundToActThresh) == -1) { adapt.modificationFactor = EugBody.adapt.acceleration; }
      else if (activationThreshold_prev < activationThreshold_default && diffBackgroundToActThresh < 0) { adapt.modificationFactor = EugBody.adapt.deceleration; }

      if (backgroundLight['average'] - activationThreshold_default > EugBody.adapt.thresholdSwitch) { adapt.direction = 'max' }
      else { adapt.direction = 'average' }

      var diffBackgroundToActThresh = backgroundLight[adapt.direction] - activationThreshold_prev; // sensorIntensities.reduce(function(a, b) { return Math.max(a, b)})

      // console.log('frame ' + config.frame + ' bckgrnd ' + backgroundLight[adapt.direction].toFixed(2) + ' threshold ' + activationThreshold_prev.toFixed(2) + ' shock threshold ' + shock.startThreshold)

      if (shock.mode && !shock.state && diffBackgroundToActThresh > shock.startThreshold) { // get into shock

        shock['state'] = true;
        shock['counter'] = 0;
        shock['duration'] = Math.round(EugBody.shock.durationFactor * (1 + diffBackgroundToActThresh - shock.startThreshold));
        shock['turnDirection'] = [-1,1][Math.random()*2|0]; // Randomly assign a turn direction
        shock['aggregationType'] = 'max';

        // console.log('frame ' + config.frame + ' duration ' + shock.duration + ' bckgrnd ' + backgroundLight[adapt.direction].toFixed(2) + ' threshold ' + activationThreshold_prev.toFixed(2))

      } else if (shock.mode && shock.state==true && (shock.counter == shock.duration || diffBackgroundToActThresh < shock.stopThreshold || Math.abs(diffBackgroundToActThresh) < Math.min(shock.startThreshold,adapt.adaptedRange) ) ) { // stop shock
        // Reset from shock when shock duration is over, when the light dropped significantly, or when the adaptation level has reached the margin around the backgroundLight.
        // console.log('frame ' + config.frame + ' shock resets ' + shock.duration)
        // console.log('reason for reset ' + (shock.counter == shock.duration) + ' ' + (diffBackgroundToActThresh < shock.stopThreshold) + ' ' + (Math.abs(diffBackgroundToActThresh) < Math.min(shock.startThreshold,adapt.adaptedRange)) )
        shock['state'] = 'reset';
        shock['counter'] = 0;
        shock['duration'] = 0;
      }

      if (shock.mode && shock.state == true) { // continue to be shocked, increase counter, modify adaptation speed, fix turning angle and direction
        // console.log('frame ' + config.frame + ' bckgrnd ' + backgroundLight[adapt.direction].toFixed(2) + ' adapt ' + activationThreshold_current.toFixed(2) + ' shocked')
        shock['counter'] += 1;
        turnDirection = shock.turnDirection;
        reactionStrength = shock.reactionStrength;
        turnModality = 'localAxis';
      } else if (shock.mode && shock.state === 'reset' && shock.counter < shock.resetDuration) {
        // console.log('frame ' + config.frame + ' bckgrnd ' + backgroundLight[adapt.direction].toFixed(2) + ' adapt ' + activationThreshold_current.toFixed(2) + ' shock reset ' + shock.counter)
        reactionStrength = 0;
        shock.counter += 1;
      } else if (shock.mode && shock.state) {
        // console.log('frame ' + config.frame + ' bckgrnd ' + backgroundLight[adapt.direction].toFixed(2) + ' adapt ' + activationThreshold_current.toFixed(2) + ' shock stop')
        shock.state = false;
        shock.counter = 0;
      }

      // Do the continuous adaptation
      // Translate adaptation speed in seconds in to number of frames
      // if (diffBackgroundToActThresh > 0) {
        activationThreshold_current = Math.max(EugBody.adapt.thresholdMin, activationThreshold_prev + dT / adapt.speed * adapt.modificationFactor * diffBackgroundToActThresh);
      // } else {
      //   // console.log('here')
      //   activationThreshold_current = activationThreshold_default;
      // }
    }

    /* ********* Act on the processing of light information ********* */
    // calculate activation_signal
    var signal_intensity = 0;
    if (!EugBody.adapt) { // if Euglena does not adapt to light
      signal_intensity = (EugBody.lightSensors.length>1) ? lightInfo.diffBtwSensors : lightInfo.currentLevel[0];
    } else {
      signal_intensity = (EugBody.lightSensors.length>1) ? lightInfo.diffBtwSensors : lightInfo.currentLevel[0];
    }
    var activation_signal = signal_intensity - activationThreshold_current;

    if ((EugBody.lightSensors.length>1 && activation_signal > EugBody.activation_min) ||
    (EugBody.lightSensors.length == 1 && activation_signal > EugBody.activation_min)) {
      if (!(reactionStrength)) { reactionStrength = EugBody.reactionStrength; }
      //console.log(shock.state);
      if (shock.state) { lightDiff = reactionStrength; }
      else {
        if (EugBody.turn.amount === 'amount_proportional') { lightDiff = activation_signal * reactionStrength; } // If turn proportional to activation_signal
        else if (EugBody.turn.amount === 'amount_constant') { lightDiff = reactionStrength; }
        //console.log('frame ' + config.frame + ' proportional ' + (activation_signal*reactionStrength).toFixed(2) + ' constant ' + reactionStrength )
      }
      if (lightDiff == 0) { lightDiff = 0.2 * reactionStrength }
      delta_yaw += rotationDir * turnDirection * Math.abs(lightDiff) * dT;
    }

    //console.log('frame ' + config.frame + ' signal ' + signal_intensity.toFixed(2) + ' bckgrnd avg ' + backgroundLight['average'].toFixed(2)  + ' bckgrnd max ' + backgroundLight['max'].toFixed(2) + ' diff ' + (backgroundLight['average']  - backgroundLight['max']).toFixed(2) + ' threshold ' + activationThreshold_current.toFixed(2) + ' direction ' + adapt.direction)


    // console.log('frame ' + config.frame + ' threshold ' + activationThreshold_current.toFixed(2) + ' bckgrnd ' + backgroundLight[adapt.direction].toFixed(2) + ' light ' + signal_intensity.toFixed(2) + ' signalStrength ' + activation_signal.toFixed(2) + ' reaction_strength ' + reactionStrength.toFixed(2) + ' delta_yaw ' + delta_yaw.toFixed(2) + ' modificationFactor ' + adapt.modificationFactor)

    //console.log('bckgrnd ' + backgroundLight[adapt.direction] + ' adapt ' + activationThreshold_current + ' signal ' + activation_signal)

    //console.log((dT / adapt.speed * adapt.modificationFactor).toFixed(2) + ' ' + activationThreshold_current.toFixed(2) + ' ' + backgroundLight['max'].toFixed(2) + ' ' + signal_intensity.toFixed(2))

    /*
    Pseud-Code for generating a delay in reaction:
    Create an array of the light information required.
    Each time, pass the light information of the current instance to that array (from mech.js to here).
    Depending on the distance of the eye to the flagellum, use a fixed offset in the light array for the value of light to be passed to the update function in mech.js
    If the distance of the flagellum to the eye is 0, then do the processing immediately within the update function.
    */

    // Store delta_yaw in prevReactions
    var current_delta_yaw = 0;
    if (EugBody.signalDuration == 0) {
      current_delta_yaw = delta_yaw;
    } else if (prevReactions.length == EugBody.signalDuration * config.result.fps) {
      current_delta_yaw = prevReactions.splice(0,1)[0];
      prevReactions.push(delta_yaw);
    } else {
      prevReactions.push(delta_yaw);
    }

    // Turn randomly left or right
    current_delta_yaw += EugBody.turn.random * [-1,1][Math.random()*2|0]*Math.random() * config.resetRandom * dT;

    if (EugBody.turn.forward || Math.abs(current_delta_yaw)<EugBody.defaults.yaw_min * dT) { // MAKE IT BASED ON WHAT THEY SEE, NOT THE DELTA_YAW
      tmp_euglena.translateZ(fw_speed * dT);
    } else if (!EugBody.turn.forward && Math.abs(current_delta_yaw)>EugBody.defaults.yaw_min * dT){
      tmp_euglena.translateZ(fw_speed/10 * dT);
    }

    //console.log('frame ' + config.frame + ' delta_yaw ' + current_delta_yaw.toFixed(2) + ' signal ' + signal_intensity.toFixed(2) + ' threshold ' + activationThreshold_current.toFixed(2))

    // Create a wiggle if there is 1 sensor, and otherwise just do the normal roll
    //if (sensorIntensities.length == 1) {
    if (Math.abs(current_delta_yaw)<EugBody.defaults.yaw_min * dT) { // Create wiggle by rotation on a cone // MAKE IT BASED ON WHAT THEY SEE, NOT THE DELTA_YAW
      var rot_axis = new THREE.Vector3(0, Math.sin(config.wiggleRandom), Math.cos(config.wiggleRandom));
      tmp_euglena.rotateOnAxis(rot_axis, roll_speed * dT);
    } else { // Roll around the local z-axis (i.e. head)
      tmp_euglena.rotateZ(roll_speed * dT);
    }
    //} else {
    //  tmp_euglena.rotateZ(roll_speed * dT);
    //}

    // NEXT STEPS:
    // 1. Create the block that calculates by how much the Euglena will yaw.
    // 2. Create the block for doing random variations.
    turnModality = (EugBody.lightSensors.length>1) ? 'localAxis' : turnModality;
    turnModality = (!roll_speed) ? 'localAxis' : turnModality;
    if (turnModality === 'localAxis') {
      tmp_euglena.rotateX(current_delta_yaw);
    } else {
      tmp_euglena.rotateOnAxis(new THREE.Vector3(0,1,0), -current_delta_yaw);
    }

/*
    var flipRotationDir = 1;
    var lightDiff = 0;
    if (sensorIntensities.length == 1) {
      flipRotationDir = EugBody.lightSensors[0].flipRotationDir;
      lightDiff = ( onlyPositiveLightChange && lightInfo.diffNowToAdaptLevel < 0 ? 0 : lightInfo.diffNowToAdaptLevel )
    } else {
      lightDiff = lightInfo.diffBtwSensors;
    }
    var delta_yaw = flipRotationDir * (EugBody.reactionStrength * lightDiff) * dT;

    //delta_yaw = 0

    //var delta_yaw = (EugBody.reactionStrength * lightInfo.diffNowToAdaptLevel) * dT;
    const delta_roll = EugBody.spin_speed * dT;

    // Translate forward in head direction *** REMINDER: local z axis is pointing "forward", i.e. in getWorldDirection()
    //tmp_euglena.translateZ(config.track.blockly.v * dT);
    tmp_euglena.translateZ(EugBody.fw_speed * dT);
    //tmp_euglena.translateZ(0);

    // Yaw around the local x-axis, which is orthogonal to the head-eye plane (spanned by the local z and y axes).
//    delta_yaw += config.resetRandom * dT;
    tmp_euglena.rotateX(delta_yaw);
*/


    // Restrict Euglena z position to 0
    tmp_euglena.position.z = 0;

    //euglena.updateMatrix();
    tmp_euglena.updateMatrixWorld();

    var tmp_Euler = new THREE.Euler();
    tmp_Euler.setFromQuaternion(tmp_euglena.quaternion,'XYZ');

    const out = {
      time: config.frame * dT,
      roll: tmp_Euler.x,
      pitch: tmp_Euler.y,
      yaw: tmp_Euler.z,
      x: tmp_euglena.position.x,
      y: tmp_euglena.position.y,
      z: tmp_euglena.position.z,
      lightArray: lightArray,
      prevReactions: prevReactions,
      activationThreshold: activationThreshold_current,
      shock: shock,
      lights: config.lights
    }

    return out;
  }
}

/*
TO DO:
GET THE EUGLENA TO CORRECT z-coordinate if they point up or down.
*/
