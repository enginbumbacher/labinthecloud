'use strict';

var EuglenaUtils = require('./utils.js');
//var THREE = process.cwd() + "/lib/thirdparty/three/three.min.js";
var THREE = require('./three.min.js');

var EuglenaBody = require('./body_configurations.js');

module.exports = {
  initialize: (config) => {
    config.track.blockly = { // Calculate the parameters
      euglenaBody:  config.model.configuration
    }
  },

  update: (config) => {
    //var EugBody = new EuglenaBody.EuglenaBody(config.track.blockly.euglenaBody);
    var EugBody = new EuglenaBody.EuglenaBody(config.model.configuration);

    // *** Place and orient the Euglena body ***
    EugBody.constructBody();
    //let tmp_euglena = EugBody.body;
    let tmp_euglena = new THREE.Object3D();

    // initialize the array of lights to average over
    var prevIntensities = [];

    // Set orientation of Euglena
    // Local z - axis = forward direction
    // Local y - axis = eye
    if (config.frame == 1) {
      // In first frame, orientation is in XY plane
      let v_head = new THREE.Vector3(1,0,0);
      v_head.applyAxisAngle(new THREE.Vector3(0,0,1), config.last.yaw);
      EuglenaUtils.setDirection(v_head,tmp_euglena);
      tmp_euglena.rotateZ(config.last.roll);
      tmp_euglena.position.set(config.track.x, config.track.y, config.track.z);

    } else {
      let prev_Euler = new THREE.Euler(config.last.roll,config.last.pitch,config.last.yaw,'XYZ');
      tmp_euglena.setRotationFromEuler(prev_Euler);

      prevIntensities = config.last.prevIntensities;
    }

    tmp_euglena.position.set(config.last.x, config.last.y, config.last.z);    // Set position of Euglena
    tmp_euglena.updateMatrixWorld();

//***********************************************

var v_eye = tmp_euglena.localToWorld(new THREE.Vector3(0,1,0));
v_eye.subVectors(v_eye,tmp_euglena.position);

let intensity = 0;
let net_yaw = 0;
for (let k in config.lights) {
  let v_light = new THREE.Vector3(0,0,0);
  switch (k) {
    case "left":
      v_light.x = -1;
      break;
    case "right":
      v_light.x = 1;
      break;
    case "top":
      v_light.y = 1;
      break;
    case "bottom":
      v_light.y = -1;
      break;
  }

  let intensity_theta = Math.acos(v_light.dot(v_eye));
  let intensity_light = Math.cos(intensity_theta) * config.lights[k] / 100;
  if (Math.cos(intensity_theta) >= 0 && intensity_light > 0) {
    intensity += intensity_light;
    net_yaw += intensity_light;
  }
}
intensity *= net_yaw > 0 ? 1 : -1;









//***********************************************
/*
    // *** Calculate the light for each light sensor ***
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

          return EuglenaUtils.calculateSensorIntensity(config.lights, EugBody.defaults, tmp_euglena, lightSensor.getPosition3D(), v_sensor)
        } else {
          return EuglenaUtils.calculateSensorIntensity(config.lights, EugBody.defaults, tmp_euglena, lightSensor.getPosition3D(), [])
        }
      });
    } else {
      sensorIntensities = [0];
    }
*/
    /* TO DO WITH INTRODUCTION OF BLOCKLY CODE
   Calculate the averaging window for prevLight, which depends on both EugBody.defaults.adapt_memory
   and the rotation speed:
   Set the window such that it spans every value the Euglena has seen within a rotation of Math.PI.
   So, if there is a rotation set, then the window has to be calculated anew. Otherwise, if there is no
   rotation set, we choose the standard window size defaults.adapt_memory.
    */

    // Store the sensorIntensities in prevIntensities
    // Average for 2 sensors, or actual value for 1 sensor
    // Alternatively choose the max of 2 sensors
//    if (prevIntensities.length == EugBody.defaults.adapt_memory) {
//      prevIntensities.splice(0,1);
//    }
//    var sensorIntensitiesAvg = sensorIntensities.reduce(function(a, b) { return a + b });
//    prevIntensities.push(sensorIntensitiesAvg / sensorIntensities.length);

    /* Calculate the adaptation level C (adaptLevel) and the differences in light to adaptation level (diffNowAdapt):
    Adaptation level C(t) = average over the previous detected light intensities I_(t-n), ..., I_(t-1)
    If the adaptation level was modeled as the charge / discharge of a capacitor,
    C_t(tt) = C_(t-1) + (I_t - C_(t-1)) * (1 - exp(-tt / tau_c)), then the change in adaptation level is
    dC_t/dt = (1 / tau_c) * (I_t - C_(t-1)) * exp(-tt / tau_c), and hence proportional to (I_t - C_(t-1)) = dI_t
    */
//    var lightInfo = {
//      adaptLevel: prevIntensities.reduce(function(a, b) { return a + b }) / prevIntensities.length,
//      diffNowToAdaptLevel: sensorIntensities.reduce(function(a, b) { return Math.max(a, b)}) - config.last.adaptLevel
//    }

    // *** Process the information and generate the output parameters ***
    const dT = 1 / config.result.fps;

    /* *** Apply transformations to Euglena body ***
    Instead of generating the javacode in blockly directly, I could just store a string of keywords, each
    keyword corresponding to a chunk of javascript code that I have stored somewhere here, and that I could
    pull from. I will limit the use of many blocks to one instantiation! That way I only have to look at ordering...
    Alternatively: I will write all the code here, and then can store it in pieces in blockly, with the
    corresponding keywords, etc.
    */
    //config.model.jsCode
//    var customLightThreshold = null;

    // Translate forward in head direction *** REMINDER: local z axis is pointing "forward", i.e. in getWorldDirection()
    tmp_euglena.translateZ(config.track.blockly.v * dT);

  //  if (lightInfo.diffNowToAdaptLevel > (customLightThreshold? customLightThreshold : EugBody.defaults.activation_threshold)) {
//    var delta_yaw = (config.track.blockly.k * lightInfo.diffNowToAdaptLevel) * dT;
    var delta_yaw = (config.track.blockly.k * intensity) * dT;

    const delta_roll = config.track.blockly.omega * dT;

    const yaw_min = 0.3 * dT; //config.params.k / 20.0; // restrict the minimum possible yaw rotation to 0.01 instead of 0
    if (Math.abs(delta_yaw)<yaw_min) {
      // Create wiggle by rotation on a cone
      var rot_axis = new THREE.Vector3(0, Math.sin(config.wiggleRandom), Math.cos(config.wiggleRandom));
      tmp_euglena.rotateOnAxis(rot_axis, delta_roll);

    } else {

      // Roll around the local z-axis (i.e. head)
      tmp_euglena.rotateZ(delta_roll);
    }

    delta_yaw += config.resetRandom * dT;

    // Yaw around the local x-axis, which is orthogonal to the head-eye plane (spanned by the local z and y axes).
    tmp_euglena.rotateX(-delta_yaw);

    // Restrict Euglena z position to 0
    tmp_euglena.position.z = 0;

    //euglena.updateMatrix();
    tmp_euglena.updateMatrixWorld();
    //}

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
      //prevIntensities: prevIntensities,
      //adaptLevel: lightInfo.adaptLevel
    }

    return out;
  }
}
