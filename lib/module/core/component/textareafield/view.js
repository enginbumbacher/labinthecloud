import BaseFieldView from 'core/component/form/field/view';
import Template from './textareafield.html';
import Utils from 'core/util/utils';

// import "./style.scss";

export default class TextAreaFieldView extends BaseFieldView {
  constructor(model, tmpl) {
    super(model, tmpl ? tmpl : Template);

    Utils.bindMethods(this, ['_onFieldChange'])

    this.render(model);
    this.$el.find('.textareafield__field').on(model.get('changeEvents'), this._onFieldChange);
    this.$el.find('.textareafield__field').on('keyup', this._onKeyup);
  }

  _onModelChange(evt) {
    super._onModelChange(evt);
    this.render(evt.currentTarget);
  }
  _onFieldChange(jqevt) {
    this.dispatchEvent('Field.ValueChange', {
      value: this.$el.find('.textareafield__field').val()
    });
  }

  disable() {
    this.$el.find('.textareafield__field').prop('disabled', true)
  }

  enable() {
    this.$el.find('.textareafield__field').prop('disabled', false)
  }

  focus() {
    this.$el.find('.textareafield__field').focus();
  }

  render(model) {
    this.$el.find('.textareafield__field').attr('id', model.get('id'));
    this.$el.find('.textareafield__field').val(model.value());

    if (model.get('placeholder')) this.$el.find('.textareafield__field').attr('placeholder', model.get('placeholder'));
    if (model.get('disabled'))    this.$el.find('.textareafield__field').prop('disabled', model.get('disabled'));
    if (model.get('label'))       this.$el.find('.textareafield__label').html(model.get('label'));
    if (model.get('help'))        this.$el.find('.textareafield__help').html(model.get('help'));

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
