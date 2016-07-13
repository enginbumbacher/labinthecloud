define((require) => {
  const BaseField = require('modules/form/fields/base/field'),
    Model = require('./model'),
    View = require('./view');

  class TextField extends BaseField {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);

      this._view.addEventListener('TextField.RequestValueChange', this._onValueChangeRequest);
    }

    _onValueChangeRequest(evt) {
      if (!this._model.get('disabled'))
        this._model.set('value', evt.data.value);
    }
  }

  TextField.create = (data) => {
    return new TextField({ modelData: data });
  }
  
  return TextField;
});