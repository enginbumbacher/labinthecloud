import BaseModel from 'core/component/form/field/model';
import Utils from 'core/util/utils';
const defaults = {
  options: {},
  disabledOptions: [],
  multiple: false
};

export default class SelectFieldModel extends BaseModel {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config)
    if (!Utils.exists(this.value())) {
      this.set('value', Object.keys(this.get('options'))[0]);
    }
  }

  value() {
    let val = super.value();
    if (this.get('multiple')) {
      val = Utils.ensureArray(val);
    }
    return val;
  }

  addOption(opt) {
    // note that this overwrites an option label if the value already exists.
    const options = this.get('options');
    options[opt.value] = opt.label;
    this.set('options', options, true);
  }

  removeOption(id) {
    const options = this.get('options');
    delete options[id];
    this.set('options', options, true);
  }

  clearOptions() {
    this.set('options', {}, true);
    this.set('value', null);
  }

  disableOption(id) {
    const opts = this.get('options')
    const disabled = this.get('disabledOptions')
    if (opts[id] !== undefined && !disabled.includes(id)) {
      disabled.push(id);
      this.set('disabledOptions', disabled);
    }
  }

  enableOption(id) {
    const opts = this.get('options')
    const disabled = this.get('disabledOptions')
    if (opts[id] !== undefined && disabled.includes(id)) {
      disabled.splice(disabled.indexOf(id), 1);
      this.set('disabledOptions', disabled);
    }
  }

  listAbleOptions() {
    const opts = Object.keys(this.get('options'));
    const disabled = this.get('disabledOptions')
    const able = []
    opts.forEach((opt) => {
      if (!disabled.includes(opt)) able.push(opt)
    })
    return able;
  }

  getSelectedLabel() {
    return this.get('options')[this.value()];
  }
}
