define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),

    defaults = {
      width: 400,
      height: 300,
      lightData: []
    };

  return class VisualResultModel extends Model {
    constructor(config = {}) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config)
    }

    getLightState(time) {
      let blockTime = 0;
      const light = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      for (const block of this.get('lightData')) {
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
})