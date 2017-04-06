'use strict';

function _transform_rotate_x(theta, vector) {
  return {
    x: vector.x,
    y: Math.cos(theta) * vector.y - Math.sin(theta) * vector.z,
    z: Math.sin(theta) * vector.y + Math.cos(theta) * vector.z
  }
}
function _transform_rotate_y(theta, vector) {
  return {
    x: Math.cos(theta) * vector.x - Math.sin(theta) * vector.z,
    y: vector.y,
    z: Math.sin(theta) * vector.x + Math.cos(theta) * vector.z
  }
}
function _transform_rotate_z(theta, vector) {
  return {
    x: Math.cos(theta) * vector.x - Math.sin(theta) * vector.y,
    y: Math.sin(theta) * vector.x + Math.sin(theta) * vector.y,
    z: vector.z
  }
}

module.exports = {
  dot: (a, b) => {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },
  transform_roll_pitch_yaw: (roll, pitch, yaw, vector) => {
    let out = _transform_rotate_x(roll, vector);
    out = _transform_rotate_y(pitch, out);
    out = _transform_rotate_z(yaw, out);
    return out;
  },
  lightsFromTime: (experiment, time) => {
    let blockTime = 0;
    let light = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    for (const block of experiment.configuration) {
      if (time > blockTime && time <= blockTime + block.duration) {
        ['top', 'right', 'bottom', 'left'].forEach((key) => {
          light[key] = block[key];
        })
        break;
      }
      blockTime += block.duration;
    }
    return light;
  }
}