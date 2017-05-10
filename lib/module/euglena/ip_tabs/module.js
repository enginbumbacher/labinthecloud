define((require) => {
  const Module = require('core/app/module'),
    HM = require('core/event/hook_manager'),
    Tabs = require('core/component/tabs/tabs'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    LocalModal = require('core/component/localmodal/localmodal');

  require('link!./style.css');

  return class InteractiveTabsModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onPhaseChange']);

      this._tabs = Tabs.create({});
      this._modal = LocalModal.create({});
      Globals.set('InteractiveModal', this._modal);
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
    }

    init() {
      return Promise.resolve(true);
    }

    run() {
      const tabs = HM.invoke('InteractiveTabs.ListTabs', []);
      tabs.forEach((tabConf, ind) => {
        this._tabs.buildTab(tabConf);
      });
      Globals.get('Layout').getPanel('interactive').addContent(this._modal.view());
    }

    _onPhaseChange(evt) {
      if (evt.data.phase != 'login') {
        Globals.get('Layout').getPanel('interactive').addContent(this._tabs.view(), 0);
      } else {
        Globals.get('Layout').getPanel('interactive').removeContent(this._tabs.view());
      }
    }
  }
})