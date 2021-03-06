import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Model from 'core/model/model';

const defaults = {
  duration: 0,
  lights: {
    top: [],
    bottom: [],
    left: [],
    right: []
  }
}

export default class LightGridModel extends Model {
  constructor(conf) {
    conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
    super(conf);
  }

  update(lights) {
    const parsed = {
      top: [],
      bottom: [],
      left: [],
      right: []
    }
    let duration = 0;
    lights.forEach((spec) => {
      duration += spec.duration;
      for (let key in parsed) {
        parsed[key].push({ intensity: spec[key], duration: spec.duration })
      }
    })

    this.set('duration', duration);
    this.set('lights', parsed);
  }

  reset() {
    this.set('lights', {
      top: [],
      bottom: [],
      left: [],
      right: []
    })
  }
}
