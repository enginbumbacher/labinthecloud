define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),

    defaults = {
      lightData: [],
      video: null,
      runTime: 0,
      fps: 0
    }
  ;

  return class LightDisplayModel extends Model {
    constructor(config = {}) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
      Utils.bindMethods(this, ['_onTick']);
    }

    start() {
      this.dispatchEvent('LightDisplay.PlayRequest');
    }

    _onTick(evt) {
      let blockTime = 0;
      const light = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      for (const block of this.get('lightData')) {
        if (evt.data.videoTime > blockTime && evt.data.videoTime <= blockTime + block.duration) {
          ['top', 'right', 'bottom', 'left'].forEach((key) => {
            light[key] = block[key];
          })
          break;
        }
        blockTime += block.duration;
      }
      this.dispatchEvent('LightDisplay.Tock', {
        time: evt.data.videoTime,
        light: light
      })
    }

    stop() {
      this.dispatchEvent('LightDisplay.StopRequest');
    }

    reset() {
      for (let key in defaults) {
        this.set(key, defaults[key]);
      }
      this.dispatchEvent('LightDisplay.Tock', {
        time: 0,
        light: {
          top: 100,
          right: 100,
          bottom: 100,
          left: 100
        }
      })
    }
  }
})