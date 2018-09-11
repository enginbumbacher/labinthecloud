import EventDispatcher from 'core/event/dispatcher';
import Utils from 'core/util/utils';
import * as THREE from 'three';
import HM from 'core/event/hook_manager';

export default class EuglenaView extends EventDispatcher {
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
