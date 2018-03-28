define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    EugUtils = require('euglena/utils'),

    defaults = {
      width: 500,
      height: 375,
      lightData: []
    };

  return class VisualResultModel extends Model {
    constructor(config = {}) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config)
    }

    getLightState(time) {
      return EugUtils.getLightState(this.get('lightData'), time);
    }
  }
})
