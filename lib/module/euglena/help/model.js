define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    defaults = {
      open: false,
      contents: ""
    };

  return class HelpModel extends Model {
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
});