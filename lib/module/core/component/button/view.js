import FieldView from 'core/component/form/field/view';
import Template from './button.html';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

import './style.scss';

export default class ButtonFieldView extends FieldView {
  constructor(model, tmpl) {
    super(model, tmpl ? tmpl : Template);
    Utils.bindMethods(this, ['_onModelChange', '_onClick', 'focus']);

    this.$el.find('.button').html(model.get('label'));
    this._eventName = model.get('eventName');
    this._eventData = model.get('eventData');
    if(model.get('eventStyle')) { this._eventStyle = model.get('eventStyle');} // Necessary for synching both videos in modelComparison mode
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
    if (this._eventStyle) { Globals.get('Relay').dispatchEvent(this._eventName, this._eventData, true); }
    else { this.dispatchEvent(this._eventName, this._eventData, true); }
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
