define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),

    defaults = {
      K: 0.001,
      v: 20,
      omega: 1
    }
  ;

  return class ComponentManagerModel extends Model {
    constructor(conf) {
      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      super(conf);
    }
  }
})