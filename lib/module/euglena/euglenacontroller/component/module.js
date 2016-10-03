define((require) => {
  const Module = require('core/app/module'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    Manager = require('./manager')
  ;

  return class ComponentEuglenaControllerModule extends Module {
    constructor() {
      super();

      HM.hook('Euglena.Manager', (spec) => {
        Manager.setModelData(Globals.get('AppConfig.managers.component'));
        spec.candidates.push(Manager);
        spec.manager = Manager;
        return spec;
      });
    }
  }
})