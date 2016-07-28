define((require) => {
  const BaseModel = require('core/component/form/field/model'),
    Utils = require('core/util/utils'),
    defaults = {
      placeholder: null,
      password: false,
      changeEvents: 'change blur'
    };

  return class TextFieldModel extends BaseModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults)
      super(config);
    }
  };
});
