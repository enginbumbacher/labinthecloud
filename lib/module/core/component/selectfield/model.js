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

    addOption(opt) {
      // note that this overwrites an option label if the value already exists.
      const options = this.get('options');
      options[opt.value] = opt.label;
      this.set('options', options, true);
    }

    removeOption(id) {
      const options = this.get('options');
      delete options[id];
      this.set('options', options, true);
    }

    clearOptions() {
      this.set('options', {}, true);
      this.set('value', null);
    }
  }
});