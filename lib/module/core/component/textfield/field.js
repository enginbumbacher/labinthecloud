import BaseField from 'core/component/form/field/field';
import Model from './model';
import View from './view';

class TextField extends BaseField {
  constructor(settings = {}) {
    settings.viewClass = settings.viewClass || View;
    settings.modelClass = settings.modelClass || Model;
    super(settings);
  }
}

TextField.create = (data) => {
  return new TextField({ modelData: data });
}

export default TextField;
