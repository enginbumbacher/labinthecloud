define((require) => {
  const BaseModel = require('core/model/model'),
    Utils = require('core/util/utils'),

    defaults = {
      id: null,
      title: '',
      content: null,
      selected: false
    };

  return class TabModel extends BaseModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      if (!config.data.id) config.data.id = Utils.guid4();
      super(config);
    }
  }
})