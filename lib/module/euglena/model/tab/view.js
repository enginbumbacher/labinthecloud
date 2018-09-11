import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import DomView from 'core/view/dom_view';
import Template from './tab.html';

export default class ModelTabView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
  }
}
