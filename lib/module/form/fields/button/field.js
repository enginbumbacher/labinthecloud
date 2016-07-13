define((require) => {
  const BaseField = require('modules/form/fields/base/field'),
    View = require('./view'),
    Model = require('./model');

  class ButtonField extends BaseField {
    constructor(settings) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);

      this._view.addEventListener('Button.Clicked', this._onClick);
    }

    _onClick(evt) {
      if (this.isActive())
        this.view().dispatchEvent(this._model.get('event'), {}, true);
    }
  }

  ButtonField.create = (data) => {
    return new ButtonField({ modelData: data });
  }

  return ButtonField;
})