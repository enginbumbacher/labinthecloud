import FieldModel from 'core/component/form/field/model';
import Utils from 'core/util/utils';

const defaults = {
  labelFn: null
}

export default class DisplayFieldModel extends FieldModel {
  constructor(conf) {
    conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
    super(conf);
  }

  getLabel() {
    let fn = this.get('labelFn');
    if (fn) {
      return fn(this.value())
    } else {
      return Promise.resolve(this.value());
    }
  }
}