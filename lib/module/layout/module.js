import Module from 'core/app/module';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import DomView from 'core/view/dom_view';

export default class LayoutModule extends Module {
  constructor(context) {
    super(context);

    Globals.set(`${context.app}.Layout`, this);
    this._panels = {};
  }

  run() {
    let specs = [];
    HM.invoke('Layout.Panels', specs, this.context);
    specs.sort((a, b) => {
      return a.weight - b.weight;
    });
    specs.forEach((spec, ind) => {
      const panel = spec.panel;
      this._panels[panel.id()] = panel;
      Globals.get(`${this.context.app}.App.view`).addChild(panel.view());
    })
  }

  getPanel(id) {
    return this._panels[id];
  }

  destroy() {
    this._panels = {};
    Globals.set(`${this.context.app}.Layout`, null);
    return Promise.all(Object.values(this._panels).map((panel) => panel.destroy()));
  }
}
