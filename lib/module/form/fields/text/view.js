define((require) => {
  const BaseFieldView = require('modules/form/fields/base/view'),
    Template = require('text!./textfield.html');

  return class TextFieldView extends BaseFieldView {
    constructor(model, tmpl) {
      super(model, tmpl ? tmpl : Template);

      this.$el.find(".field-prefix").html(model.get('prefix'))
      this.$el.find(".field-postfix").html(model.get('postfix'))

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
