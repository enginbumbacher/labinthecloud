import Model from 'core/model/model';
import Utils from 'core/util/utils';

const defaults = {
  width: 200,
  height: 200
};

export default class LightDisplayModel extends Model {
  constructor(config = {}) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }
}
