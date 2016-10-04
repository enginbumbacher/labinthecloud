define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),

    defaults = {
      K: 0.001,
      K_delta: 0.0002,
      v: 20,
      v_delta: 4,
      omega: 1,
      omega_delta: 0.2,
      randomness: 0
    }
  ;

  return class ComponentManagerModel extends Model {
    constructor(conf) {
      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      super(conf);
    }
  }
})