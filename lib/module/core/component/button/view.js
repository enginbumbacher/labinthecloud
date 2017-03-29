define((require) => {
  const FieldView = require('core/component/form/field/view'),
    Template = require('text!./button.html'),
    Utils = require('core/util/utils');

  require('link!./style.css');

  return class ButtonFieldView extends FieldView {
    constructor(model, tmpl) {
      super(model, tmpl ? tmpl : Template);
      Utils.bindMethods(this, ['_onModelChange', '_onClick', 'focus']);
      
      this.$el.find('.button').html(model.get('label'));
      this._eventName = model.get('eventName');
      this._eventData = model.get('eventData');
      this.$el.find('.button').on('click', this._onClick);
      this._killNative = model.get("killNativeEvent");

      if (model.get('style') != "button") {
        this.$el.addClass(model.get('style'));
      }
      model.addEventListener('Model.Change', this._onModelChange);
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

    _onModelChange(evt) {
      switch (evt.data.path) {
        case "label":
          this.$el.find('.button').html(evt.data.value);
        break;
        case "disabled":
          if (evt.data.value) {
            this.disable();
          } else {
            this.enable();
          }
        break;
      }
    }
  };
});