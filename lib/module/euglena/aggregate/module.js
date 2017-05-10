define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Module = require('core/app/module'),
    AggregateDataTab = require('./tab/tab');

  class AggregateDataModule extends Module {
    constructor() {
      super();
      this.tab = new AggregateDataTab();
    }

    run() {
      Globals.get('Layout').getPanel('result').addContent(this.tab.view())
      // Globals.get('App.view').addChild(this.tab.view());
    }
  }

  return AggregateDataModule;
})