define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    ExperimentForm = require('./form/form'),
    Utils = require('core/util/utils'),
    LightDisplay = require('euglena/component/lightdisplay/lightdisplay')
  ;

  return class ExperimentModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_hookInteractiveTabs', '_onRunRequest']);
      
      this._form = new ExperimentForm();
      this._form.view().addEventListener('Experiment.DryRun', this._onDryRunRequest);
      this._form.view().addEventListener('Experiment.Submit', this._onRunRequest);

      HM.hook('InteractiveTabs.ListTabs', this._hookInteractiveTabs, 10);
    }

    _hookInteractiveTabs(list, meta) {
      list.push({
        id: "experiment",
        title: "Experiment",
        content: this._form.view()
      });
      return list;
    }

    _onRunRequest(evt) {
      Globals.get('Relay').dispatchEvent('Results.DryRunStopRequest');
      Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentRequest', this._form.export());
    }
  }
})