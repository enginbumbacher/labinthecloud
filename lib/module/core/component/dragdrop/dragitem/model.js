import Model from 'core/model/model';
import Utils from 'core/util/utils';

const defaults = {
    id: 0,
    selected: false,
    trigger: ".dragitem__grip"
  }

export default class DragItemModel extends Model {
  constructor(settings = {}) {
    settings.data.id = settings.data.id || Utils.guid4();
    settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
    super(settings);
  }
}
