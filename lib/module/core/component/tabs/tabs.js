import Component from 'core/component/component';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import Tab from './tab/tab';

class Tabs extends Component {
  constructor(settings) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);

    Utils.bindMethods(this, ['_onTabSelected', '_onModelChange'])

    this.view().addEventListener('Tab.Selected', this._onTabSelected)
    this._model.addEventListener('Model.Change', this._onModelChange)
  }

  addTab(tab) {
    this._model.addTab(tab);
  }

  buildTab(config) {
    this.addTab(Tab.create(config));
  }

  removeTab(id) {
    this._model.removeTab(id)
  }

  selectTab(id) {
    this._model.selectTab(id);
  }

  getTabs() {
    return this._model.get('tabs');
  }

  disableTab(id) {
    this._model.disableTab(id);
  }

  enableTab(id) {
    this._model.enableTab(id);
  }

  _onTabSelected(evt) {
    const tabs = this.getTabs()
    const tab = tabs.filter((tab) => { return tab._model._data.id == evt.data.id})[0];
    if (tab != this._model.currentTab()) {
      Globals.get('Relay').dispatchEvent('Tab.Change', {
          tabId: evt.data.id,
          tabType: tab._model._data.tabType
      })
    }

    if (this._active) this._model.selectTab(evt.data.id);
  }

  _onModelChange(evt) {
    if (evt.data.path == "currentIndex") {
      this.dispatchEvent('Tab.Change', {
        tab: this._model.currentTab()
      })
    }
  }
};

Tabs.create = (config = {}) => {
  return new Tabs({ modelData: config })
}

export default Tabs;
