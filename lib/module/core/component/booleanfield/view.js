import FieldView from "core/component/form/field/view";
import Template from "./field.html";
import Utils from "core/util/utils";

export default class BooleanFieldView extends FieldView {
  constructor(model, tmpl) {
    super(model, tmpl || Template);
    Utils.bindMethods(this, ['_onFieldChange']);

    this.render(model);
    this.$dom().find('.booleanfield__checkbox').on('change', this._onFieldChange);
  }

  _onFieldChange(jqevt) {
    this.dispatchEvent('Field.ValueChange', {
      value: this.$dom().find('.booleanfield__checkbox').is(":checked")
    })
  }

  _onModelChange(evt) {
    super._onModelChange(evt);
    this.render(evt.currentTarget);
  }

  render(model) {
    this.$dom().find('.booleanfield__label').html(model.get('label'));
    this.$dom().find('.booleanfield__checkbox').prop('checked', model.value());
  }

  focus() {
    this.$dom().find('.booleanfield__checkbox').focus();
  }
}