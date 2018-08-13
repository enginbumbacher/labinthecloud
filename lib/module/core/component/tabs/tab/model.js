import BaseModel from 'core/model/model';
import Utils from 'core/util/utils';

const defaults = {
  id: null,
  title: '',
  content: null,
  selected: false,
  disabled: false
};

export default class TabModel extends BaseModel {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    if (!config.data.id) config.data.id = Utils.guid4();
    super(config);
  }
}
