define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    Validation = require('core/util/validation'),
    defaults = {
      id: null,
      label: '',
      value: null,
      defaultValue: null,
      disabled: false,
      required: false,
      hasError: false,
      errors: [],
      classes: [],
      validation: null
    };

  return class FieldModel extends Model {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      config.data.validation = config.data.validation || {};
      if (config.data.required) {
        config.data.validation.required = {
          test: "exists",
          errorMessage: `${config.data.label} required.`
        };
      }
      super(config);
    }

    enable() {
      this.set('disabled', false);
    }

    disable() {
      this.set('disabled', true);
    }

    value() {
      if (Utils.exists(this.get('value'))) {
        return this.get('value');
      } else {
        return this.get('defaultValue');
      }
    }

    validate() {
      let tests = [];
      let val = this.value();
      for (let test in this.get('validation')) {
        let spec = this.get(`validation.${test}`);
        let testName = spec.test || test;
        if (Validation[testName]) {
          tests.push(Validation[testName](val, spec));
        } else {
          return Promise.reject(`Validation "${testName}" could not be found.`)
        }
      }
      return Promise.all(tests).then((results) => {
        let isValid = true;
        let errors = [];
        for (let result of results) {
          if (!result.isValid) {
            isValid = false;
          }
          if (result.error) {
            errors.push(result.error);
          }
        }
        this.set('errors', errors);
        this.set('isValid', isValid);

        return {
          id: this.get('id'),
          isValid: isValid,
          errors: errors
        }
      });
    }
  }
});