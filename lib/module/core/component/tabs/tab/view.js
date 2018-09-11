import DomView from 'core/view/dom_view';
import Utils from 'core/util/utils';
import Template from './tab_page.html';

export default class TabPageView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    this.addChild(model.get('content'));
  }
}
