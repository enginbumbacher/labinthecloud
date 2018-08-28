import Model from 'core/model/model';
import Utils from 'core/util/utils';
const defaults = {
  id: '',
  label: ''
};

export default class FormActionModel extends Model {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }
}
