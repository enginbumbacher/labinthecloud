define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    defaults = {
      id: '',
      fields: [],
      buttons: [],
      classes: []
    };

  return class FormModel extends Model {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    getValue() {
      let val = {};
      for (let field of this.get('fields')) {
        val[field.id()] = field.value();
      }
      return val;
    }
  };
});