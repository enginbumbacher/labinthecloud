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
      Globals.get('Layout').getPanel('result').addContent(this.help.view());
    }
  };
})