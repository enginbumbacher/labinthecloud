import FieldModel from "core/component/form/field/model";
import Utils from "core/util/utils";

const defaults = {
  currentFieldId: null,
  fields: []
}

export default class ProxyFieldModel extends FieldModel {
  constructor(conf) {
    conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
    super(conf);
  }

  getFieldById(id) {
    if (!id) return null;
    let candidates = this.get('fields').filter(field => field.id() == id);
    if (candidates.length) return candidates[0];
    return null;
  }

  getCurrentField() {
    return this.getFieldById(this.get('currentFieldId'));
  }
}