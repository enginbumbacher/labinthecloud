define((require) => {
  const Module = require('core/app/module'),
    HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils'),
    LayoutPanel = require('module/layout/panel/panel');

  return class InteractivePanelModule extends Module {
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
})