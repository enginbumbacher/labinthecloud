import BaseModel from 'core/component/form/field/model';
import Utils from 'core/util/utils';

const defaults = {
  prefix: '',
  postfix: '',
  min: null,
  max: null,
  placeholder: null,
  type: 'float',
  changeEvents: 'change blur',
  validation: {
    _number: {
      test: 'numeric',
      errorMessage: 'Please provide a valid number'
    }
  }
};

export default class NumberFieldModel extends BaseModel {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }
}
