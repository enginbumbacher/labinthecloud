define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),

    defaults = {
      runTime: 0,
      video: null
    };

  return class VideoDisplayModel extends Model {
    constructor(config = {}) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }
  }
})