import Field from "core/component/form/field/field";
import Utils from "core/util/utils";

import View from './view';

class ColorField extends Field {
  constructor(conf) {
    conf.viewClass = conf.viewClass || View;
    super(conf);
  }

  value() {
    let value = super.value();
    return value ? value : "#000000";
  }
}

ColorField.create = (data = {}) => {
  return new ColorField({ modelData: data })
}

export default ColorField;