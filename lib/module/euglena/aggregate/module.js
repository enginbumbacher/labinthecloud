define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Module = require('core/app/module'),
    AggregateDataTab = require('./tab/tab');

  class AggregateDataModule extends Module {
    constructor() {
      super();
      if (Globals.get('AppConfig.aggregate')) this.tab = new AggregateDataTab();
    }

    run() {
      if (this.tab) Globals.get('Layout').getPanel('result').addContent(this.tab.view())
    }
  }

  return AggregateDataModule;
})