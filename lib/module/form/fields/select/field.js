define((require) => {
  const BaseField = require('module/form/fields/base/field'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils');

  class SelectField extends BaseField {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);

      if (!Utils.exists(this._model.get('value')) && Utils.exists(this._model.get('options')) && this._model.get('options').length)
        this._model.set('value', this._model.get('options')[0].value);
      this._view.addEventListener('SelectField.RequestValueChange', this._onValueChangeRequest);
    }

    _onValueChangeRequest(evt) {
      if (!this._model.get('disabled'))
        this._model.set('value', evt.data.value);
    }
  }

  SelectField.create = (data) => {
    return new SelectField({ modelData: data });
  }
  
  return SelectField;
});