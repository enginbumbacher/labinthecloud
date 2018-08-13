import BaseField from 'core/component/form/field/field';
import View from './view';
import Model from './model';

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

export default ButtonField;
