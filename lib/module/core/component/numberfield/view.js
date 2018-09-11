import BaseFieldView from 'core/component/form/field/view';
import Template from './numberfield.html';
import Utils from 'core/util/utils';

export default class NumberFieldView extends BaseFieldView {
  constructor(model, tmpl) {
    super(model, tmpl ? tmpl : Template);
    Utils.bindMethods(this, ['_onFieldChange', '_onModelChange']);

    this.renderModel(model);
    this.$el.find('.numberfield__field').on(model.get('changeEvents'), this._onFieldChange)
    model.addEventListener('Model.Change', this._onModelChange);
  }

  renderModel(model) {
    this.$el.find('.numberfield__field').attr('id', model.get('id'));
    this.$el.find('.numberfield__field').attr('value', model.value());

    if (model.get('placeholder')) {
      this.$el.find('.numberfield__field').attr('placeholder', model.get('placeholder'));
    }
    this.$el.find('.numberfield__field').prop('disabled', model.get('disabled'));
    if (model.get('min')) {
      this.$el.find('.numberfield__field').prop('min', model.get('min'));
    }
    if (model.get('max')) {
      this.$el.find('.numberfield__field').prop('max', model.get('max'));
    }
    if (model.get('label')) {
      this.$el.find('.numberfield__label').html(model.get('label'));
    }
    if (model.get('help')) {
      this.$el.find('.numberfield__help').html(model.get('help'));
    }
  }
  _onModelChange(evt) {
    this.renderModel(evt.currentTarget);
  }

  _onFieldChange(jqevt) {
    this.dispatchEvent('Field.ValueChange', {
      value: parseFloat(this.$el.find(".numberfield__field").val())
    });
  }
  focus() {
    this.$el.find(".numberfield__field").focus();
  }
};
