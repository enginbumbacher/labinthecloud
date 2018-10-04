import Module from 'core/app/module';
import HM from 'core/event/hook_manager';
import Tabs from 'core/component/tabs/tabs';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import LocalModal from 'core/component/localmodal/localmodal';

import './style.scss';

export default class InteractiveTabsModule extends Module {
  constructor(ctx) {
    super(ctx);
    Utils.bindMethods(this, ['_onPhaseChange', '_onTabRequest', '_onDisableRequest', '_onEnableRequest','_toggleTabs']);

    this._tabs = Tabs.create({});
    this._modal = LocalModal.create({});
    Globals.set('InteractiveModal', this._modal);
    Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
    Globals.get('Relay').addEventListener('InteractiveTabs.TabRequest', this._onTabRequest)
    Globals.get('Relay').addEventListener('InteractiveTabs.DisableRequest', this._onDisableRequest)
    Globals.get('Relay').addEventListener('InteractiveTabs.EnableRequest', this._onEnableRequest)
    Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', this._onTabRequest)
    Globals.get('Relay').addEventListener('Notifications.Add',this._onDisableRequest);
    Globals.get('Relay').addEventListener('Notifications.Remove',this._onEnableRequest);

    Globals.get('Relay').addEventListener('InteractiveTabs.Toggle', this._toggleTabs);
  }

  init() {
    return Promise.resolve(true);
  }

  run() {
    const tabs = HM.invoke('InteractiveTabs.ListTabs', []);
    tabs.forEach((tabConf, ind) => {
      this._tabs.buildTab(tabConf);
    });
    Globals.get(`${this.context.app}.Layout`).getPanel('interactive').addContent(this._modal.view());
    this._tabs.addEventListener('Tab.Change', this._onTabChange)
  }

  _onPhaseChange(evt) {
    if (evt.data.phase != 'login' && evt.data.phase != "login_attempted") {
      Globals.get(`${this.context.app}.Layout`).getPanel('interactive').addContent(this._tabs.view(), 0);
    } else {
      Globals.get(`${this.context.app}.Layout`).getPanel('interactive').removeContent(this._tabs.view());
      this._tabs.selectTab(this._tabs.getTabs()[0].id());
    }
  }

  _onTabChange(evt) {
    Globals.get('Relay').dispatchEvent('InteractiveTabs.TabChange', {
      tab: evt.data.tab
    });
    Globals.get('Logger').log({
      type: 'tab_change',
      category: 'app',
      data: {
        tab: evt.data.tab.id()
      }
    })
  }

  _onTabRequest(evt) {
    if (evt.data.tabType) {
      const tab = this._tabs._model._data.tabs.filter((tab) => { return tab._model._data.tabType == evt.data.tabType})[0];
      this._tabs.selectTab(tab._model._data.id);
    } else {
      this._tabs.selectTab(evt.data.tabId);
    }
  }

  _onDisableRequest(evt) {
    if (evt.data.app == this.context.app)
      this._tabs.disableTab(evt.data.tabId);
  }
  _onEnableRequest(evt) {
    if (evt.data.app == this.context.app)
      this._tabs.enableTab(evt.data.tabId);
  }

  _toggleTabs(evt) {
    if (evt.data.hideTab) {
      document.getElementsByClassName('panel__interactive')[0].style.display='none';
    } else {
      document.getElementsByClassName('panel__interactive')[0].style.display='block';
    }
  }

  destroy() {
    this._tabs.removeEventListener('Tab.Change', this._onTabChange)
    Globals.get('Relay').removeEventListener('AppPhase.Change', this._onPhaseChange);
    Globals.get('Relay').removeEventListener('InteractiveTabs.TabRequest', this._onTabRequest)
    Globals.get('Relay').removeEventListener('InteractiveTabs.DisableRequest', this._onDisableRequest)
    Globals.get('Relay').removeEventListener('InteractiveTabs.EnableRequest', this._onEnableRequest)
    Globals.get('Relay').removeEventListener('ModelingTab.ToggleRequest', this._onTabRequest)
    Globals.get('Relay').removeEventListener('Notifications.Add',this._onDisableRequest);
    Globals.get('Relay').removeEventListener('Notifications.Remove',this._onEnableRequest);
    Globals.get('Relay').removeEventListener('InteractiveTabs.Toggle', this._toggleTabs);
    Globals.set('InteractiveModal', null);

    return Promise.all([this._tabs.destroy(), this._modal.destroy(), super.destroy()])
  }
}
