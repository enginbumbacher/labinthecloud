define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),

    defaults = {
      width: 200,
      height: 200
    }
  ;

  return class LightDisplayModel extends Model {
    constructor(config = {}) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }
  }
})
