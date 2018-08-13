import Model from 'core/model/model';
import Utils from 'core/util/utils';
const defaults = {
  open: false,
  contents: ""
};

export default class HelpModel extends Model {
  constructor(data) {
    super(Utils.ensureDefaults(data, defaults));
  }

  show() {
    this.set('open', true);
  }
  hide() {
    this.set('open', false);
  }
  toggle() {
    this.set('open', !this.get('open'));
  }
}
