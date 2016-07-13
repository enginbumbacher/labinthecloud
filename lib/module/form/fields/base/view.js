define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./field.html');

  return class FieldView extends DomView {
    constructor(model, tmpl) {
      super(tmpl ? tmpl : Template);

      model.addEventListener('Model.Change', this.onModelChange);
      this.render(model);
    }

    onModelChange(evt) {
      switch (evt.data.path) {
        case "value":
          this.render(evt.currentTarget);
          break;
        case "disabled":
          if (evt.data.value) {
            this.disable()
          } else {
            this.enable()
          }
          break;
      }
    }

    render(model) {
      this.$el.find('.label').text(model.get('label'));
      this.setFieldValue(model);
    }

    setFieldValue(model) {
      this.$el.find('input').val(model.get('value'));
    }

    disable() {}

    enable() {}
  }
});