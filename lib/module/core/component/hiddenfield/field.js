import Field from 'core/component/form/field/field';

import View from './view';

class HiddenField extends Field {
  constructor(conf) {
    conf.viewClass = conf.viewClass || View;
    super(conf);
  }
}

HiddenField.create = (data = {}) => {
  return new HiddenField({ modelData: data })
}

export default HiddenField;