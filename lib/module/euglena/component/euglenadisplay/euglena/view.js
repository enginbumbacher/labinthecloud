define((require) => {
  const EventDispatcher = require('core/event/dispatcher'),
    Utils = require('core/util/utils'),
    THREE = require('three'),
    HM = require('core/event/hook_manager');

  return class EuglenaView extends EventDispatcher {
    constructor(model) {
      super();
      this._three = HM.invoke('Euglena.3dView', null, { config: model.get('config'), color: model.get("color") })
    }

    threeObject() {
      return this._three;
    }

    update(state) {
      this._three.position.set(state.position.x, state.position.y, state.position.z);

      let prev_Euler = new THREE.Euler(state.roll,state.pitch,state.yaw,'XYZ');
      this._three.setRotationFromEuler(prev_Euler);
    }
  }
})
