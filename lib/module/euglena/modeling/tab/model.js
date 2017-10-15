define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Model = require('core/model/model'),
    defaults = {
      datasets: {},
      open: false
    },
    Palette = require('core/util/palette')

  return class ModelingDataModel extends Model {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    toggle() {
      this.set('open', !this.get('open'))
    }

    getDisplayState() {
      const state = {};
      return state;
    }
  }
})
