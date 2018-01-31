'use strict';

var EuglenaUtils = require('./utils.js');
//var THREE = process.cwd() + "/lib/thirdparty/three/three.min.js";
var THREE = require('./three.min.js');

var EuglenaBody = require('./body_configurations.js');

var testCode = false;

var onlyPositiveLightChange = true; // if yaw can be changed only when the light difference is positive.

module.exports = {
  initialize: (config) => {
    config.track.blockly = {
      euglenaBody:  new EuglenaBody.EuglenaBody(config.model.configuration,JSON.parse(config.model.bodyConfigJSON))
    }
  },

  update: (config) => {

    //var EugBody = new EuglenaBody.EuglenaBody(config.track.blockly.euglenaBody);
    var EugBody = config.track.blockly.euglenaBody; //new EuglenaBody.EuglenaBody(config.model.configuration);
    if (config.frame == 1) { EugBody.constructBody(); }
    let tmp_euglena = EugBody.body;

    // initialize the array of lights to average over
    var prevIntensities = [];

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

      config.last.adaptLevel = 0;

    } else {
      let prev_Euler = new THREE.Euler(config.last.roll,config.last.pitch,config.last.yaw,'XYZ');
      tmp_euglena.setRotationFromEuler(prev_Euler);

      prevIntensities = config.last.prevIntensities;
    }

    tmp_euglena.position.set(config.last.x, config.last.y, config.last.z);    // Set position of Euglena

    tmp_euglena.updateMatrixWorld();


    // ********* Calculate the light for each light sensor *********
    // If sensors have no orientation, they are sensitive to light from any direction.
    // If sensors have orientation, they must have a Math.PI field
    // If orientation is given, we take into account only light that falls into the visual field.
    // If there is no light, ignore.
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
    // Store the sensorIntensities in prevIntensities
    // Average for 2 sensors, or actual value for 1 sensor
    // Alternatively choose the max of 2 sensors
    if (prevIntensities.length == EugBody.defaults.memory_duration) {
      prevIntensities.splice(0,1);
    }
    var sensorIntensitiesAvg = sensorIntensities.reduce(function(a, b) { return a + b });
    prevIntensities.push(sensorIntensitiesAvg / sensorIntensities.length);

    /* ********* Create all the light-related information *********
    Calculate the adaptation level C (adaptLevel) and the differences in light to adaptation level (diffNowAdapt):
    Adaptation level C(t) = average over the previous detected light intensities I_(t-n), ..., I_(t-1)
    If the adaptation level was modeled as the charge / discharge of a capacitor,
    C_t(tt) = C_(t-1) + (I_t - C_(t-1)) * (1 - exp(-tt / tau_c)), then the change in adaptation level is
    dC_t/dt = (1 / tau_c) * (I_t - C_(t-1)) * exp(-tt / tau_c), and hence proportional to (I_t - C_(t-1)) = dI_t
    */
    var lightInfo = {
      currentLevel: sensorIntensities,
      adaptLevel: prevIntensities.reduce(function(a, b) { return a + b }) / prevIntensities.length,
      diffNowToAdaptLevel: sensorIntensities.reduce(function(a, b) { return Math.max(a, b)}) - config.last.adaptLevel
    }
    if (sensorIntensities.length == 2) {
      // sort sensors based on which one is where
      if(EugBody.lightSensors.length >2) console.log("there are more than 2 sensors.");
      // substract the left from the right eye
      var sensorOrder = ((EugBody.lightSensors[1].getPosition3D()).y - (EugBody.lightSensors[0].getPosition3D()).y) > 0 ? [0,1] : [1,0];
      var lightDiff = (sensorOrder.map((v,ind) => {return sensorIntensities[v]})).reduce(function(a, b) { return a - b });
      lightInfo['diffBtwSensors'] = lightDiff;
    }

    /* ********* Integrate the blockly code *********
    Evaluate the code to process the light information and create the variables necessary for reaction
    */
    const dT = 1 / config.result.fps;

    var fw_speed = EugBody.fw_speed;
    var roll_speed = EugBody.roll_speed;
    var delta_yaw = 0;
    var state = '';

    var blockly_code = config.model.jsCode;
    try {
      eval(blockly_code);
    } catch (error) {
      console.log(error);
    }

    /* ********* Act on the processing of light information
    From the blockly code, we get 1. fw_speed, 2. rot_speed, 3. delta_yaw, 4. state variables
    */

    tmp_euglena.translateZ(fw_speed * dT);

    // Create a wiggle if there is 1 sensor, and otherwise just do the normal roll
    if (sensorIntensities.length == 1) {
      if (Math.abs(delta_yaw)<EugBody.defaults.yaw_min * dT) { // Create wiggle by rotation on a cone
        var rot_axis = new THREE.Vector3(0, Math.sin(config.wiggleRandom), Math.cos(config.wiggleRandom));
        tmp_euglena.rotateOnAxis(rot_axis, roll_speed * dT);
      } else { // Roll around the local z-axis (i.e. head)
        tmp_euglena.rotateZ(roll_speed * dT);
      }
    } else {
      tmp_euglena.rotateZ(roll_speed * dT);
    }

    // NEXT STEPS:
    // 1. Create the block that calculates by how much the Euglena will yaw.
    // 2. Create the block for doing random variations.
    tmp_euglena.rotateX(delta_yaw);

/*
    var flipRotationDir = 1;
    var lightDiff = 0;
    if (sensorIntensities.length == 1) {
      flipRotationDir = EugBody.lightSensors[0].flipRotationDir;
      lightDiff = ( onlyPositiveLightChange && lightInfo.diffNowToAdaptLevel < 0 ? 0 : lightInfo.diffNowToAdaptLevel )
    } else {
      lightDiff = lightInfo.diffBtwSensors;
    }
    var delta_yaw = flipRotationDir * (EugBody.reaction_strength * lightDiff) * dT;

    //delta_yaw = 0

    //var delta_yaw = (EugBody.reaction_strength * lightInfo.diffNowToAdaptLevel) * dT;
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
      prevIntensities: prevIntensities,
      adaptLevel: lightInfo.adaptLevel,
      lights: config.lights
    }

    return out;
  }
}
