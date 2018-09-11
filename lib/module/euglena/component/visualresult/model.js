import Model from 'core/model/model';
import Utils from 'core/util/utils';
import EugUtils from 'euglena/utils';

const defaults = {
  width: 500,
  height: 375,
  lightData: []
};

export default class VisualResultModel extends Model {
  constructor(config = {}) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config)
  }

  getLightState(time) {
    return EugUtils.getLightState(this.get('lightData'), time);
  }
}
