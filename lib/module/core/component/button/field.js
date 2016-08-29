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
      console.log('api trigger');
      this._view._onClick(null);
    }
  }

  ButtonField.create = (data) => {
    return new ButtonField({ modelData: data });
  }

  return ButtonField;
})