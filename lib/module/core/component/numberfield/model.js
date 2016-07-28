define((require) => {
  const BaseModel = require('core/component/form/field/model'),
    Utils = require('core/util/utils'),
    defaults = {
      prefix: '',
      postfix: '',
      min: null,
      max: null
    };

  return class NumberFieldModel extends BaseModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }
  }
});