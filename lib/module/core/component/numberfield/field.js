import BaseField from 'core/component/form/field/field';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';

class NumberField extends BaseField {
  constructor(settings = {}) {
    settings.viewClass = settings.viewClass || View;
    settings.modelClass = settings.modelClass || Model;
    super(settings);
  }
}

NumberField.create = (data) => {
  return new NumberField({ modelData: data });
};

export default NumberField;
