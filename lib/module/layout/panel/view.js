define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),
    Template = require('text!./panel.html');

  return class LayoutPanelView extends DomView {
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
})