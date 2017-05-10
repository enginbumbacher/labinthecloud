define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')
  
  const Model = require('core/model/model'),
    defaults = {
      duration: 0,
      lights: {
        top: [],
        bottom: [],
        left: [],
        right: []
      }
    }

  return class LightGridModel extends Model {
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
  }
})