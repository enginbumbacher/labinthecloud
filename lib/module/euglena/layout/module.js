define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals'),
    DomView = require('core/view/dom_view');

  return class EuglenaLayoutModule extends Module {
    constructor() {
      super();
      this.panels = {
        left: new DomView("<div class='panel panel-left'></div>"),
        main: new DomView("<div class='panel panel-main'></div>")
      };
      Globals.set('Layout', this);
    }

    run() {
      Globals.get('App.view').addChild(this.panels.left);
      Globals.get('App.view').addChild(this.panels.main);
    }
  }
});