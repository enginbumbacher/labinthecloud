import Module from 'core/app/module';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import LayoutPanel from 'layout/panel/panel';

export default class ResultPanelModule extends Module {
  constructor() {
    super();
    Utils.bindMethods(this, ['_hookLayoutPanels']);
    this.panel = LayoutPanel.create({ id: "result" });
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
