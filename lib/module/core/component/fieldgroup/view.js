import DomView from 'core/view/dom_view';
import Template from './fieldgroup.html';
import Utils from "core/util/utils";

export default class FieldGroupView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onModelChange', '_onCollapseToggle'])
    // this._onModelChange = this._onModelChange.bind(this);

    model.addEventListener('Model.Change', this._onModelChange);
    this._fieldViews = [];
    this.renderModel(model);
    if (model.get('collapsible')) {
      this.$dom().find('> .field__label').on('click', this._onCollapseToggle)
    }
  }

  _onModelChange(evt) {
    this.renderModel(evt.currentTarget);
  }

  _onCollapseToggle(jqevt) {
    this.dispatchEvent('FieldGroup.CollapseToggle', {});
    // this.$dom().toggleClass('fieldgroup__collapsed');
  }

  renderModel(model) {
    while (this._fieldViews.length) {
      this.removeChild(this._fieldViews.pop());
    }
    
    for (let field of model.get('fields')) {
      this._fieldViews.push(field.view());
      this.addChild(field.view(), '.fieldgroup__fields');
    }

    if (model.get('label') && model.get('showLabel')) this.$el.find('> .field__label').html(model.get('label'));
    if (model.get('help')) this.$el.find('> .field__help').html(model.get('help'));
    if (model.get('collapsible')) this.$dom().addClass('fieldgroup__collapsible');
    this.$dom().toggleClass('fieldgroup__collapsed', model.get('collapsed'));

    let errors = model.get('errors');
    if (errors.length) {
      let errStr = errors.map((err) => `<p class="field__error">${err}</p>`).join('');
      this.$el.find("> .field__errors").html(errStr).show();
      this.$el.addClass("component__field__error");
    } else {
      this.$el.removeClass("component__field__error");
      this.$el.find("> .field__errors").html("").hide();
    }
  }

  focus() {
    if (this._fieldViews.length) {
      this._fieldViews[0].focus()
    }
  }
};
