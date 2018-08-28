import Model from 'core/model/model';
import Utils from 'core/util/utils';

const defaults = {
  runTime: 0,
  video: null
};

export default class VideoDisplayModel extends Model {
  constructor(config = {}) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }
}
