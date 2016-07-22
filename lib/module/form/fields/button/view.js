define((require) => {
  const FieldView = require('module/form/fields/base/view'),
    Template = require('text!./button.html');
  require('link!./style.css');

  return class ButtonFieldView extends FieldView {
    constructor(model, tmpl) {
      super(model, tmpl ? tmpl : Template);

      this._onClick = this._onClick.bind(this);
      
      this.$el.find('button').click(this._onClick);
    }

    render(model) {
      this.$el.find("button")
        .text(model.get('label'))
        .val(model.get('value'))
        .addClass(model.get('class'))
    }

    disable() {
      this.$el.find('button').prop('disabled', true);
    }

    enable() {
      this.$el.find('button').prop('disabled', false);
    }

    _onClick(jqevt) {
      this.dispatchEvent('Button.Clicked', {});
      return false;
    }
  };
});