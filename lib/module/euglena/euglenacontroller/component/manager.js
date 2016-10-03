define((require) => {
  const Controller = require('core/controller/controller'),
    Utils = require('core/util/utils'),
    Model = require('./model'),
    THREE = require('three'),
    Globals = require('core/model/globals')
  ;

  class ComponentManager extends Controller {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      super(settings);
    }

    update(state) {
      let out = {
        position: {
          x: state.position.x,
          y: state.position.y,
          z: state.position.z
        },
        dYaw: 0,
        dRoll: 0
      };

      out.dRoll = this._model.get('omega') * state.dT;
      let v_eye = state.object.getObjectByName('base').localToWorld(new THREE.Vector3(0, 1, 0))
        .sub(state.object.localToWorld(new THREE.Vector3(0,0,0)))
        .normalize();
      let v_head = state.object.localToWorld(new THREE.Vector3(1, 0, 0))
        .sub(state.object.localToWorld(new THREE.Vector3(0,0,0)))
        .normalize();

      let intensity = 0;
      let net_angle = 0;
      for (let k in state.lights) {
        let v_light = new THREE.Vector3();
        switch (k) {
          case "left":
            v_light.set(-1, 0, 0);
            break;
          case "right":
            v_light.set(1, 0, 0);
            break;
          case "top":
            v_light.set(0, 1, 0);
            break;
          case "bottom":
            v_light.set(0, -1, 0);
            break;
        }
        v_light.normalize();
        let intensity_theta = Math.acos(v_eye.dot(v_light));
        let intensity_light = Math.cos(intensity_theta) * state.lights[k];
        let head_theta = Math.acos(v_head.dot(v_light));
        if (Math.cos(intensity_theta) >= 0 && intensity_light > 0) {
          let parity = Math.sign(v_head.x * v_light.y - v_head.y * v_light.x);
          intensity += intensity_light;
          net_angle += intensity_light * parity;
        }
      }
      intensity *= net_angle > 0 ? -1 : 1;
      out.dYaw = this._model.get('K') * intensity;
      out.position.x = state.position.x + Math.cos(state.yaw + out.dYaw) * this._model.get('v') * state.dT;
      out.position.y = state.position.y + Math.sin(state.yaw + out.dYaw) * this._model.get('v') * state.dT;

      return out;
    }

    setModelData(data) {
      for (let k in data) {
        this._model.set(k, data[k]);
      }
    }
  }

  return new ComponentManager();
})