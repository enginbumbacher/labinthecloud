define((require) => {
  const BaseModel = require('modules/form/fields/base/model'),
    Utils = require('core/util/utils'),
    defaults = {
      prefix: '',
      postfix: ''
    };

  return class TextFieldModel extends BaseModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults)
      super(config);
    }
  };
});
