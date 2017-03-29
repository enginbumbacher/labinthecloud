define((require) => {
  const Module = require('core/app/module'),
    HM = require('core/event/hook_manager'),
    Tabs = require('core/component/tabs/tabs'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals');

  return class InteractiveTabsModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onPhaseChange']);

      this._tabs = Tabs.create({});
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

    }

    _onPhaseChange(evt) {
      if (evt.data.phase != 'login') {
        Globals.get('Layout').getPanel('interactive').addContent(this._tabs.view());
      } else {
        Globals.get('Layout').getPanel('interactive').removeContent(this._tabs.view());
      }
    }
  }
})