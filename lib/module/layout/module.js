define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    DomView = require('core/view/dom_view');

  return class LayoutModule extends Module {
    constructor() {
      super();

      Globals.set('Layout', this);
      this._panels = {};
    }

    run() {
      let specs = [];
      HM.invoke('Layout.Panels', specs);
      specs.sort((a, b) => {
        return a.weight - b.weight;
      });
      specs.forEach((spec, ind) => {
        const panel = spec.panel;
        this._panels[panel.id()] = panel;
        Globals.get('App.view').addChild(panel.view());
      })
    }

    getPanel(id) {
      return this._panels[id];
    }
  }
});