define((require) => {
  const BaseFieldView = require('modules/form/fields/base/view'),
    Template = require('text!./numberfield.html'),
    Utils = require('core/util/utils');

  return class NumberFieldView extends BaseFieldView {
    constructor(model, tmpl) {
      super(model, tmpl ? tmpl : Template);

      this.$el.find(".field-prefix").html(model.get('prefix'))
      this.$el.find(".field-postfix").html(model.get('postfix'))
      if (Utils.exists(model.get('min'))) {
        this.$el.find("input.numberfield").attr("min", model.get('min'));
      }
      if (Utils.exists(model.get('max'))) {
        this.$el.find("input.numberfield").attr("max", model.get('max'));
      }

      this.$el.find("input.numberfield").on('change', this._onFieldChange);
    }

    disable() {
      this.$el.find('input.numberfield').prop('disabled', true)
    }

    enable() {
      this.$el.find('input.numberfield').prop('disabled', false)
    }

    _onFieldChange(jqevt) {
      this.dispatchEvent('NumberField.RequestValueChange', {
        value: parseFloat(this.$el.find("input.numberfield").val())
      });
    }
  };
})