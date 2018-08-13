import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import Model from 'core/model/model';
const defaults = {
  id: null,
  alive: false,
  type: 'note',
  message: '',
  autoExpire: null,
  expireLabel: 'OK',
  classes: []
};

export default class NoteModel extends Model {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
    if (!this.get('id')) this.set('id', Utils.guid4());
    this.get('classes').push(`note__${this.get('type')}`);
  }
}
