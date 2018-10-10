import FieldView from 'core/component/form/field/view';
import Template from './displayfield.html';

export default class DisplayFieldView extends FieldView {
  constructor(model, tmpl) {
    super(model, tmpl || Template);

    this._render(model);
  }

  _onModelChange(evt) {
    super._onModelChange(evt);
    if (evt.data.path == 'value') {
      this._render(evt.currentTarget);
    }
  }

  _render(model) {
    model.getLabel().then((label) => {
      this.$el.find('.displayfield__field').html(label);
    })

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
}