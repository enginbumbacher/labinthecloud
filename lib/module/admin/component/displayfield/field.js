import Field from 'core/component/form/field/field';
import Model from './model';
import View from './view';

class DisplayField extends Field {
  constructor(conf) {
    conf.modelClass = conf.modelClass || Model;
    conf.viewClass = conf.viewClass || View;
    super(conf);
  }
}

DisplayField.create = (data = {}) => {
  return new DataField({ modelData: data });
}

export default DisplayField;