define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals');

  return class SetupModule extends Module {
    constructor() {
      super();
      this._onPhaseChange = this._onPhaseChange.bind(this);
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "setup") {
        Globals.get('Relay').dispatchEvent('Help.Hide', {});
      }
    }
  }
})