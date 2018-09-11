import DomView from 'core/view/dom_view';
import Utils from 'core/util/utils';
import Template from './panel.html';

export default class LayoutPanelView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onModelChange']);

    this.$el.addClass(`panel__${model.get('id')}`)
    model.addEventListener('Model.Change', this._onModelChange);
  }

  _onModelChange(evt) {
    if (evt.data.path == "contents") {
      this._render(evt.currentTarget);
    }
  }

  _render(model) {
    while (this._children.length) {
      this.removeChild(this._children[0]);
    }
    model.get('contents').forEach((cont, ind) => {
      this.addChild(cont);
    })
  }
}
