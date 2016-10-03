define((require) => {
  const EventDispatcher = require('core/event/dispatcher'),
    Utils = require('core/util/utils');

  return class Module extends EventDispatcher {
    load() {
      Utils.promiseRequire(this.listPreload())
        .then((loaded) => this.handlePreload.apply(null, loaded));
    }

    listPreload() {
      return []
    }

    handlePreload() {}

    init() {
      return Promise.resolve(true)
    }

    run() {}
  };
});