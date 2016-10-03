define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals'),
    ExperimentForm = require('./form/form'),
    Utils = require('core/util/utils'),
    LightDisplay = require('euglena/component/lightdisplay/lightdisplay')
  ;

  return class SetupModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onPhaseChange', '_onDryRunRequest', '_onRunRequest']);
      
      this._form = new ExperimentForm();
      this._form.view().addEventListener('Experiment.DryRun', this._onDryRunRequest);
      this._form.view().addEventListener('Experiment.Submit', this._onRunRequest);

      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "experiment") {
        Globals.get('Relay').dispatchEvent('Help.Hide', {});
        Globals.get('Layout.panels.left').addChild(this._form.view());
      } else {
        Globals.get('Layout.panels.left').removeChild(this._form.view());
      }
    }

    _onDryRunRequest(evt) {
      Globals.get('Relay').dispatchEvent('Results.DryRunRequest', this._form.export());
    }

    _onRunRequest(evt) {
      Globals.get('Relay').dispatchEvent('Results.DryRunStopRequest');
      Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentRequest', this._form.export());
    }
  }
})