define((require) => {
  const Module = require('core/app/module'),
    Help = require('./help'),
    Globals = require('core/model/globals');

  return class HelpModule extends Module {
    constructor() {
      super();
      this.help = new Help();
    }

    run() {
      // console.log(Globals.get('Layout.panels.main'));
      Globals.get('Layout.panels.main').addChild(this.help.view());
    }
  };
})