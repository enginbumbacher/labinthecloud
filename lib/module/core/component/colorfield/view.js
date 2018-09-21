import FieldView from "core/component/form/field/view";
import Utils from "core/util/utils";

import Template from "./colorfield.html";

export default class ColorFieldView extends FieldView {
  constructor(model, tmpl) {
    super(model, tmpl || Template);
    Utils.bindMethods(this, ['_onFieldChange'])
    this.$dom().find('.colorfield__input').on('change', this._onFieldChange);

    this.render(model);
  }

  _onModelChange(evt) {
    super._onModelChange(evt);
    this.render(evt.currentTarget);
  }

  render(model) {
    this.$dom().find('.colorfield__input').val(model.value());
    this.$el.find('.colorfield__input').attr('id', model.get('id'));

    if (model.get('disabled'))    this.$el.find('.colorfield__input').prop('disabled', model.get('disabled'));
    if (model.get('label'))       this.$el.find('.colorfield__label').html(model.get('label'));
    if (model.get('help'))        this.$el.find('.colorfield__help').html(model.get('help'));

    let errors = model.get('errors');
    if (errors.length) {
      let errStr = errors.map((err) => `<p class="field__error">${err}</p>`).join('');
      this.$el.find(".field__errors").html(errStr).show();
      this.$el.addClass("component__field__error");
    } else {
      this.$el.removeClass("component__field__error");
      this.$el.find(".field__errors").html("").hide();
    }

  }

  _onFieldChange(jqevt) {
    this.dispatchEvent('Field.ValueChange', {
      value: this.$dom().find('.colorfield__input').val()
    })
  }

  disable() {
    this.$el.find('.colorfield__input').prop('disabled', true)
  }

  enable() {
    this.$el.find('.colorfield__input').prop('disabled', false)
  }

  focus() {
    this.$el.find('.colorfield__input').focus();
  }
}