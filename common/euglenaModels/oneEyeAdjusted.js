'use strict';

var EuglenaUtils = require('./utils.js');
var THREE = process.cwd() + "/lib/thirdparty/three/three.min.js";


module.exports = {
  initialize: (config) => {
    config.track.oneEye = {
      k: config.model.configuration.k + (Math.random() * 2 - 1) * config.model.configuration.k_delta,
      v: config.model.configuration.v + (Math.random() * 2 - 1) * config.model.configuration.v_delta,
      omega: config.model.configuration.omega + (Math.random() * 2 - 1) * config.model.configuration.omega_delta,
    }
  },

  update: (config) => {

    let tmp_euglena = new THREE.Object3D();

    // position Euglena in xy plane in first frame
    if (config.frame == 1) {
      let v_head = new THREE.Vector3(1,0,0);
      v_head.applyAxisAngle(new THREE.Vector3(0,0,1), config.last.yaw);
      EuglenaUtils.setDirection(v_head,tmp_euglena);
      tmp_euglena.rotateZ(config.last.roll);

    } else {

      let prev_Euler = new THREE.Euler(config.last.roll,config.last.pitch,config.last.yaw,'XYZ');
      tmp_euglena.setRotationFromEuler(prev_Euler);
      tmp_euglena.position.set(config.last.x, config.last.y, config.last.z);
    }

    tmp_euglena.updateMatrixWorld();
    let v_eye = tmp_euglena.localToWorld(new THREE.Vector3(0,1,0));
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

    const dT = 1 / config.result.fps;
    const yaw_min = 0; //config.params.k / 20.0; // restrict the minimum possible yaw rotation to 0.01 instead of 0

    const delta_yaw = Math.sign((config.params.k * intensity) * dT) * Math.max(Math.abs((config.params.k * intensity) * dT), yaw_min);
    delta_yaw += (Math.random() * 2 - 1) * config.model.configuration.randomness * Math.PI) * dT; // Randomize
    const delta_roll = config.params.omega * dT;

    // Translate forward in head direction *** REMINDER: local z axis is pointing "forward", i.e. in getWorldDirection()
    tmp_euglena.translateZ(config.params.v * dT);

    // Roll around the local z-axis (i.e. head)
    tmp_euglena.rotateZ(delta_roll);

    // Yaw around the local x-axis, which is orthogonal to the head-eye plane (spanned by the local z and y axes).
    tmp_euglena.rotateX(delta_yaw);

    // Restrict Euglena z position to 0
    tmp_euglena.position.z = 0;

    //euglena.updateMatrix();
    tmp_euglena.updateMatrixWorld();

    const tmp_Euler = new THREE.Euler();
    tmp_Euler.setFromQuaternion(tmp_euglena.quaternion,'XYZ');

    const out = {
      time: config.frame * dT,
      roll: tmp_Euler.x,
      pitch: tmp_Euler.y,
      yaw: tmp_Euler.z,
      x: tmp_euglena.position.x,
      y: tmp_euglena.position.y,
      z: tmp_euglena.position.z
    }
    
    return out;
  }
}
