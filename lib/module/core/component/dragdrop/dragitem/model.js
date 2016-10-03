define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    defaults = {
      id: 0,
      selected: false,
      trigger: ".dragitem__grip"
    }

  return class DragItemModel extends Model {
    constructor(settings = {}) {
      settings.data.id = settings.data.id || Utils.guid4();
      settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
      super(settings);
    }
  }
});