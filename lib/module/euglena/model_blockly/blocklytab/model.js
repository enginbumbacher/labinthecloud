import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Model from 'core/model/model';
import Palette from 'core/util/palette';
const defaults = {
  datasets: {},
  open: false
};

export default class ModelingDataModel extends Model {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }

  toggle() {
    this.set('open', !this.get('open'))
    return Promise.resolve(true)
  }

  getDisplayState() {
    const state = {};
    return state;
  }
}
