import Field from "core/component/form/field/field";
import View from "./view";

class BooleanField extends Field {
  constructor(conf = {}) {
    conf.viewClass = conf.viewClass || View;
    super(conf)
  }
}

BooleanField.create = (data = {}) => {
  return new BooleanField({ modelData: data });
}

export default BooleanField;