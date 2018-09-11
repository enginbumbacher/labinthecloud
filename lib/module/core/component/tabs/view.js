import DomView from 'core/view/dom_view';
import Utils from 'core/util/utils';
import Template from './tabs.html';

import './style.scss';

export default class TabsView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);

    Utils.bindMethods(this, ['_onModelChange'])

    this._tabs = [];
    this._page = null;

    this._renderTabs(model);
    this._renderPage(model);
    model.addEventListener('Model.Change', this._onModelChange);
  }

  _onModelChange(evt) {
    const model = evt.currentTarget;
    if (evt.data.path == "currentIndex") {
      this._renderPage(model);
    } else if (evt.data.path == "tabs") {
      this._renderTabs(model);
      this._renderPage(model);
    }
  }

  _renderTabs(model) {
    while (this._tabs.length) {
      this.removeChild(this._tabs.pop());
    }
    model.get('tabs').forEach((tab, ind) => {
      let t = tab.tab();
      this._tabs.push(t);
      this.addChild(t, ".tabs__tabs");
    });
  }

  _renderPage(model) {
    if (this._page) this.removeChild(this._page);
    if (model.currentTab()) {
      this._page = model.currentTab().view();
      this.addChild(this._page, ".tabs__page")
    }
  }
}
