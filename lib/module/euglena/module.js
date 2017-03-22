define((require) => {
  const Module = require('core/app/module')
    , Globals = require('core/model/globals')
    ;

  return class EuglenaModule extends Module {
    constructor() {
      super();
    }

    run() {
      Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
    }
  }
});