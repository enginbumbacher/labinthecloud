/*

*/
define((require) => {
  const EventDispatcher = require('core/event/dispatcher'),
    Utils = require('core/util/utils'),
    defaults = {
      modelClass: null,
      viewClass: null,
      modelData: {}
    };

  return class Controller extends EventDispatcher {
    constructor(settings) {
      super();
      let config = Utils.ensureDefaults(settings, defaults);
      if (config.modelClass) this._model = new config.modelClass({ data: config.modelData });
      if (config.viewClass) this._view = new config.viewClass(this._model);
    }

    view() {
      return this._view;
    }
  }
});