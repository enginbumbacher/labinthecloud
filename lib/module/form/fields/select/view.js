define((require) => {
  const BaseFieldView = require('modules/form/fields/base/view'),
    Template = require('text!./selectfield.html');

  return class SelectFieldView extends BaseFieldView {
    constructor(model, tmpl) {
      super(model, tmpl ? tmpl : Template);

      this.$el.find(".selectfield").on('change', this._onFieldChange)
    }

    disable() {
      this.$el.find('.selectfield').prop('disabled', true)
    }

    enable() {
      this.$el.find('.selectfield').prop('disabled', false)
    }

    render(model) {
      this.$el.find('option').remove()
      for (let optKey in model.get('options')) {
        let opt = model.get('options').optKey;
        this.$el.find('.selectfield').append(`<option value='${opt.value}'>${opt.label}</option>`)
      }
      super.render(model);
    }

    setFieldValue(model) {
      this.$el.find('.selectfield option').removeProp("selected")
      this.$el.find(`.selectfield option[val='${model.get('value')}']`).prop("selected", true)
    }

    _onFieldChange(jqevt) {
      this.dispatchEvent('SelectField.RequestValueChange', {
        value: this.$el.find(".selectfield").val()
      });
    }
  };
});
