import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Model from 'core/model/model';
const defaults = {
  id: null,
  color: 0x2222ff
};

export default class ModelTabModel extends Model {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }
}
