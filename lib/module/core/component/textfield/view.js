import BaseFieldView from 'core/component/form/field/view';
import Template from './textfield.html';

import "./style.scss";

export default class TextFieldView extends BaseFieldView {
  constructor(model, tmpl) {
    super(model, tmpl ? tmpl : Template);

    this._onModelChange = this._onModelChange.bind(this);
    this._onFieldChange = this._onFieldChange.bind(this);
    this._onKeyup = this._onKeyup.bind(this);

    this.render(model);
    this.$el.find('.textfield__field').on(model.get('changeEvents'), this._onFieldChange);
    this.$el.find('.textfield__field').on('keyup', this._onKeyup);
  }

  _onModelChange(evt) {
    super._onModelChange(evt);
    this.render(evt.currentTarget);
  }
  _onFieldChange(jqevt) {
    this.dispatchEvent('Field.ValueChange', {
      value: this.$el.find('.textfield__field').val()
    });
  }
  _onKeyup(jqevt) {
    if (jqevt.keyCode == 13) { //return
      this.dispatchEvent('Form.SubmitRequest', {}, true);
    }
  }

  disable() {
    this.$el.find('.textfield__field').prop('disabled', true)
  }

  enable() {
    this.$el.find('.textfield__field').prop('disabled', false)
  }

  focus() {
    this.$el.find('.textfield__field').focus();
  }

  render(model) {
    this.$el.find('.textfield__field').attr('id', model.get('id'));
    this.$el.find('.textfield__field').val(model.value());

    if (model.get('password'))    this.$el.find('.textfield__field').attr('type', 'password');
    if (model.get('placeholder')) this.$el.find('.textfield__field').attr('placeholder', model.get('placeholder'));
    if (model.get('disabled'))    this.$el.find('.textfield__field').prop('disabled', model.get('disabled'));
    if (model.get('label'))       this.$el.find('.textfield__label').html(model.get('label'));
    if (model.get('help'))        this.$el.find('.textfield__help').html(model.get('help'));

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
};
