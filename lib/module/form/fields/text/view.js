define((require) => {
  const BaseFieldView = require('module/form/fields/base/view'),
    Template = require('text!./textfield.html');

  return class TextFieldView extends BaseFieldView {
    constructor(model, tmpl) {
      super(model, tmpl ? tmpl : Template);

      this._onFieldChange = this._onFieldChange.bind(this);

      this.$el.find(".field-prefix").html(model.get('prefix'));
      this.$el.find(".field-postfix").html(model.get('postfix'));
      if (model.get('placeholder')) {
        this.$el.find("input.textfield").attr('placeholder', model.get('placeholder'));
      }

      this.$el.find("input.textfield").on('change', this._onFieldChange)
    }

    disable() {
      this.$el.find('input.textfield').prop('disabled', true)
    }

    enable() {
      this.$el.find('input.textfield').prop('disabled', false)
    }

    _onFieldChange(jqevt) {
      this.dispatchEvent('TextField.RequestValueChange', { value: this.$el.find("input.textfield").val() });
    }
  };
});
