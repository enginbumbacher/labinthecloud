'use strict';

var THREE = require('./three.min.js');

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
    y: Math.sin(theta) * vector.x + Math.cos(theta) * vector.y,
    z: vector.z
  }
}
function _precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
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
  },
  setDirection: (newDir, euglena) => {
    let headDir = new THREE.Vector3();
    headDir.addVectors(newDir, euglena.position);
    euglena.lookAt(headDir);
  },
  setRandomAngleMatrix: function(numrows, numcols, angleMax, angleMin, randomness) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
        var columns = [];
        var initial = [-1,1][Math.random()*2|0] * (angleMax* Math.random() - angleMin) * randomness * Math.PI;
        for (var j = 0; j < numcols; ++j) {
            columns[j] = initial / numcols;
        }
        arr[i] = columns;
    }
    return arr;
  },
  calculateSensorIntensity(lights, defaults, eugBody, sensor, sensorDirWorld) {

    let intensity = 0;

    for (let k in lights) {
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

      // Determine whether perceived intensity should be calculated
      v_light.normalize();
      let calc_light = false;
      var cos_light_sensor = null;
      if (sensorDirWorld.length) {
        cos_light_sensor = v_light.dot(sensorDirWorld);
        if (cos_light_sensor >= 0 ) { calc_light = true; }
      } else {
        calc_light = true;
      }

      // Calculate the perceived light intensity
      if (calc_light && lights[k]>0) {

        if (!eugBody.children[0].material.opacity) { // if the body is fully transparent
          if (sensorDirWorld.length) { // if there is a directed sensor
            let intensity_light = cos_light_sensor * lights[k] / 100;
            if (intensity_light > 0) {
              intensity += intensity_light;
            }
          } else { // if there is no directed sensor
            intensity += lights[k] / 100;
          }
        } else if (eugBody.children[0].material.opacity == 1) { // if the body is fully intransparent
          intensity += 0;
        } else { // if the body is partially transparent

          let sensorPositionLocal = sensor.getPosition3D();
          let sensorMaxDistance = sensor.getMaxDistance();

          // Calculate the path of light through the body, using raycasting
          var sensorPositionWorld = new THREE.Vector3(sensorPositionLocal.x, sensorPositionLocal.y, sensorPositionLocal.z);
          eugBody.localToWorld(sensorPositionWorld);

          var ray = new THREE.Raycaster(sensorPositionWorld, v_light);
          var rayIntersects = ray.intersectObjects(eugBody.children, true);
          if (!rayIntersects[0]) { console.log('we have a problem'); }
          else {
            var lightInBody = new THREE.Vector3(0,0,0);
            //lightInBody.subVectors(rayIntersects[0].point,sensorPositionWorld);
            //var lightLength = lightInBody.length();
            var lightLength = rayIntersects[0].distance;

            var factorLightLength = 0;
            var opacity = defaults.opacity_factor * eugBody.children[0].material.opacity
            if (opacity * lightLength / sensorMaxDistance <= 1) {
              factorLightLength = Math.cos(opacity * lightLength / sensorMaxDistance * Math.PI / 2);
            }
          }

          // Calculate the perceived intensity of light for the corresponding sensor
          var curr_intensity = 0;
          if (sensorDirWorld.length) { // if there is a directed sensor
            curr_intensity = lights[k] / 100 * factorLightLength * cos_light_sensor;
          } else { // if there is no directed sensor
            curr_intensity = lights[k] / 100 * factorLightLength;
          }

          intensity += curr_intensity;

        }
      }
      /* OLD MODEL
      -----------------------------------------------------------------------------------
      var k1 = 1 + 3 / (1 + Math.exp(-(10 * eugBody.children[0].material.opacity - 5)));
      var k2 = 4.5 / (1 + Math.exp(-(10 * (1 - eugBody.children[0].material.opacity) - 5)));
      var reduceIntensity = 1 / (1 + Math.exp(-k1 * (10 * lightLengthProp - k2)))
      intensity += (lights[k] / 100)  * (1 - Math.min(reduceIntensity, 1));
      */
    }

    return intensity
  }
}
