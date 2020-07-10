import BaseField from 'core/component/form/field/field';
import Model from './model';
import View from './view';

class TextAreaField extends BaseField {
  constructor(settings = {}) {
    settings.viewClass = settings.viewClass || View;
    settings.modelClass = settings.modelClass || Model;
    super(settings);
  }
}

TextAreaField.create = (data) => {
  return new TextAreaField({ modelData: data });
}

export default TextAreaField;
