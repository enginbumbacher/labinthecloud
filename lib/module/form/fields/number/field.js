define((require) => {
  const BaseField = require('module/form/fields/base/field'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils');

  class NumberField extends BaseField {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);

      this._view.addEventListener('NumberField.RequestValueChange', this._onValueChangeRequest);
    }

    _onValueChangeRequest(evt) {
      if (!this._model.get('disabled')) {
        let val = evt.data.value;

        if (Utils.exists(this._model.get('min')) && val < this._model.get('min'))
          val = Math.max(this._model.get('min'), val);

        if (Utils.exists(this._model.get('max')) && val > this._model.get('max'))
          val = Math.min(this._model.get('max'), val);

        this._model.set('value', val);
      }
    }
  }

  NumberField.create = (data) => {
    return new NumberField({ modelData: data });
  };

  return NumberField;
});