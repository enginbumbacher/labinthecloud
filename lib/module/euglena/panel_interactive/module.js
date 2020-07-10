import Module from 'core/app/module';
import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import LayoutPanel from 'layout/panel/panel';

export default class InteractivePanelModule extends Module {
  constructor(ctx) {
    super(ctx);
    Utils.bindMethods(this, ['_hookLayoutPanels']);
    this.panel = LayoutPanel.create({ id: "interactive", app: this.context.app });
  }

  init() {
    HM.hook('Layout.Panels', this._hookLayoutPanels)
    return Promise.resolve(true);
  }

  _hookLayoutPanels(list, meta) {
    if (meta.app == this.context.app) {
      list.push({
        weight: 0,
        panel: this.panel
      });
    }
    return list;
  }

  run() {
    this.panel.build();
  }

  destroy() {
    HM.unhook('Layout.Panels', this._hookLayoutPanels)
    return Promise.all([
      this.panel.destroy(),
      super.destroy()
    ])
  }
}
