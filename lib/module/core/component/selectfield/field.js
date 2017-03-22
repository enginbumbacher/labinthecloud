define((require) => {
  const BaseField = require('core/component/form/field/field'),
    Model = require('./model'),
    View = require('./view');

  class SelectField extends BaseField {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);
    }

    addOption(opt) {
      this._model.addOption(opt);
    }

    removeOption(id) {
      this._model.removeOption(id);
    }

    clearOptions() {
      this._model.clearOptions();
    }

    getOptions() {
      return this._model.get('options');
    }
  }

  SelectField.create = (data) => {
    return new SelectField({ modelData: data });
  }
  
  return SelectField;
});