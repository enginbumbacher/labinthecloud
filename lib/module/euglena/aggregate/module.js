define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Module = require('core/app/module'),
    AggregateDataTab = require('./tab/tab');

  class AggregateDataModule extends Module {
    constructor() {
      super();
      if (Globals.get('AppConfig.aggregate')) {
        Utils.bindMethods(this, ['_onPhaseChange', '_onExperimentCountChange'])
        this.tab = new AggregateDataTab();
        Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
        Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange)
      }
    }

    run() {
      if (this.tab) Globals.get('Layout').getPanel('result').addContent(this.tab.view())
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "login") {
        this.tab.hide();
      }
    }

    _onExperimentCountChange(evt) {
      if (evt.data.count && !evt.data.old) {
        this.tab.show();
      } else if (!evt.data.count) {
        this.tab.hide();
      }
    }
  }

  return AggregateDataModule;
})