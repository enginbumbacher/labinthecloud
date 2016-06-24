define((require) => {
  const Application = require('core/app/application'),
    HM = require('core/event/hook_manager'),
    Globals = require('core/model/globals');

  return class Main extends Application {
    constructor(domRoot) {
      super(domRoot);

      HM.hook('Application.Modules', (set) => {
        // set.add(module);
      });
    }
  }
});