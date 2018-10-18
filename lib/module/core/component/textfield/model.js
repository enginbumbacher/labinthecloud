import BaseModel from 'core/component/form/field/model';
import Utils from 'core/util/utils';
const defaults = {
  placeholder: null,
  password: false,
  changeEvents: 'change blur',
  prefix: null,
  suffix: null
};

export default class TextFieldModel extends BaseModel {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults)
    super(config);
  }
};
