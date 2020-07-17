import Module from 'core/app/module';
import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import LayoutPanel from 'layout/panel/panel';

export default class InteractivePanelModule extends Module {
  constructor() {
    super();
    Utils.bindMethods(this, ['_hookLayoutPanels']);
    this.panel = LayoutPanel.create({ id: "interactive" });
  }

  init() {
    HM.hook('Layout.Panels', this._hookLayoutPanels)
    return Promise.resolve(true);
  }

  _hookLayoutPanels(list, meta) {
    list.push({
      weight: 0,
      panel: this.panel
    });
    return list;
  }

  run() {
    this.panel.build();
  }
}
