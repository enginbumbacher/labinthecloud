define((require) => {
  const BaseModel = require('module/form/fields/base/model'),
    Utils = require('core/util/utils'),
    defaults = {
      prefix: '',
      postfix: '',
      placeholder: ''
    };

  return class TextFieldModel extends BaseModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults)
      super(config);
    }
  };
});
