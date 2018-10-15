import BaseModel from 'core/component/form/field/model';
import Utils from 'core/util/utils';
const defaults = {
  placeholder: null,
  changeEvents: 'change blur',
  enterSubmit: false
};

export default class TextAreaFieldModel extends BaseModel {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults)
    super(config);
  }
};
