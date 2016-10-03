define((require) => {
  const FieldView = require('core/component/form/field/view'),
    Template = require('text!./button.html');
  require('link!./style.css');

  return class ButtonFieldView extends FieldView {
    constructor(model, tmpl) {
      super(model, tmpl ? tmpl : Template);

      this._onClick = this._onClick.bind(this);
      this.focus = this.focus.bind(this);
      
      this.$el.find('.button').html(model.get('label'));
      this._eventName = model.get('eventName');
      this._eventData = model.get('eventData');
      this.$el.find('.button').on('click', this._onClick);
      this._killNative = model.get("killNativeEvent");

      if (model.get('style') != "button") {
        this.$el.addClass(model.get('style'));
      }
    }

    focus() {
      this.$el.find('.button').focus();
    }

    enable() {
      this.$el.find('.button').prop('disabled', false);
    }

    disable() {
      this.$el.find('.button').prop('disabled', true);
    }

    _onClick(jqevt) {
      this.dispatchEvent(this._eventName, this._eventData, true);
      if (this._killNative) return false;
    }
  };
});