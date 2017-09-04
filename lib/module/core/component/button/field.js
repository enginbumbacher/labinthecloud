define((require) => {
  const BaseField = require('core/component/form/field/field'),
    View = require('./view'),
    Model = require('./model');

  class ButtonField extends BaseField {
    constructor(settings) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);
    }

    id() {
      return this._model.get('id');
    }

    trigger() {
      this._view._onClick(null);
    }

    setLabel(label) {
      this._model.set('label', label);
    }
  }

  ButtonField.create = (data) => {
    return new ButtonField({ modelData: data });
  }

  return ButtonField;
})
