import Model from 'core/model/model';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

const defaults = {
  reactionStrength: 0.001,
  reactionStrength_delta: 0.0002,
  v: 20,
  v_delta: 4,
  roll: 1,
  roll_delta: 0.2,
  opacity: 0.5,
  opacity_delta: 0.1,
  randomness: 0
};

export default class ComponentManagerModel extends Model {
  constructor(conf) {
    conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
    super(conf);
  }
}
