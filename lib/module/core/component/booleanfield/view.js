import DomView from "core/view/dom_view";
import Template from "./field.html";

export default class BooleanFieldView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);

    this._render(model);
    model.addEventListener('Model.Change', this._onModelChange);
    this.$dom().find('booleanfield-checkbox').on('change', this._onFieldChange);
  }

  _onFieldChange(jqevt) {
    this.dispatchEvent('Field.ValueChange', {
      value: this.$dom().find('.booleanfield-checkbox').is(":checked")
    })
  }

  _onModelChange(evt) {
    this._render(evt.currentTarget);
  }

  _render(model) {
    this.$dom().find('.booleanfield-label').html(model.get('label'));
    this.$dom().find('.booleanfield-checkbox').prop('checked', model.value());
  }

  focus() {
    this.$dom().find('.booleanfield-checkbox').focus();
  }
}