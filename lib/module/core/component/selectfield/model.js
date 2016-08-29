define((require) => {
  const BaseModel = require('core/component/form/field/model'),
    Utils = require('core/util/utils'),
    defaults = {
      options: {}
    };

  return class SelectFieldModel extends BaseModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config)
      if (!Utils.exists(this.get('value'))) {
        this.set('value', Object.keys(this.get('options'))[0]);
      }
    }
  }
});