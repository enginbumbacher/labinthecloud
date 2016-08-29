define((require) => {
  const Module = require('core/app/module'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    LightDisplay = require('euglena/component/lightdisplay/lightdisplay')
  ;

  return class ResultModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onPhaseChange', '_onDryRunRequest', '_onDryRunStopRequest', '_onServerResults']);

      this._lightDisplay = new LightDisplay();
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
      Globals.get('Relay').addEventListener('Results.DryRunRequest', this._onDryRunRequest);
      Globals.get('Relay').addEventListener('Results.DryRunStopRequest', this._onDryRunStopRequest);
      Globals.get('Relay').addEventListener('ExperimentServer.Results', this._onServerResults);
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "experiment") {
        Globals.get('Layout.panels.main').addChild(this._lightDisplay.view());
      } else {
        Globals.get('Layout.panels.main').removeChild(this._lightDisplay.view());
      }
    }

    _onDryRunRequest(evt) {
      this._lightDisplay.run(evt.data.lights);
    }

    _onDryRunStopRequest(evt) {
      this._lightDisplay.stop();
    }

    _onServerResults(evt) {
      console.log(evt.data);
    }
  }
})