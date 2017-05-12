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

    getAbleOptions() {
      return this._model.listAbleOptions()
    }

    disableOption(id) {
      this._model.disableOption(id);
    }

    enableOption(id) {
      this._model.enableOption(id);
    }

    selectFirstAble() {
      const able = this._model.listAbleOptions();
      if (!able.includes(this.value())) {
        this.setValue(able[0]);
      }
    }
  }

  SelectField.create = (data) => {
    return new SelectField({ modelData: data });
  }
  
  return SelectField;
});