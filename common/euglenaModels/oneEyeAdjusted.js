'use strict';

var EuglenaUtils = require('./utils.js');

module.exports = {
  initialize: (config) => {
    config.track.oneEye = {
      k: config.model.configuration.k + (Math.random() * 2 - 1) * config.model.configuration.k_delta,
      v: config.model.configuration.v + (Math.random() * 2 - 1) * config.model.configuration.v_delta,
      omega: config.model.configuration.omega + (Math.random() * 2 - 1) * config.model.configuration.omega_delta,
    }
  },

  update: (config) => {
    const v_eye = EuglenaUtils.transform_roll_pitch_yaw(config.last.roll, 0, config.last.yaw, { x: 0, y: 1, z: 0 });
    const v_head = EuglenaUtils.transform_roll_pitch_yaw(config.last.roll, 0, config.last.yaw, { x: 1, y: 0, z: 0 });

    let intensity = 0;
    let net_yaw = 0;
    for (let k in config.lights) {
      let v_light = { x: 0, y: 0, z: 0 };
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

      let intensity_theta = Math.acos(EuglenaUtils.dot(v_eye, v_light));
      let intensity_light = Math.cos(intensity_theta) * config.lights[k] / 100;
      if (Math.cos(intensity_theta) >= 0 && intensity_light > 0) {
        let parity = Math.sign(v_head.x * v_light.y - v_head.y * v_light.x);
        intensity += intensity_light;
        net_yaw += intensity_light * parity;
      }
    }
    intensity *= net_yaw > 0 ? 1 : -1;

    const dT = 1 / config.result.fps;
    const out = {
      time: config.frame * dT,
      yaw: config.last.yaw + (config.track.oneEye.k * intensity + (Math.random() * 2 - 1) * config.model.configuration.randomness * Math.PI) * dT,
      roll: config.last.roll + config.track.oneEye.omega * dT
    }
    out.x = config.last.x + Math.cos(out.yaw) * config.track.oneEye.v * dT
    out.y = config.last.y + Math.sin(out.yaw) * config.track.oneEye.v * dT

    return out;
  }
}
