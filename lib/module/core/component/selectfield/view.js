define((require) => {
  const BaseFieldView = require('core/component/form/field/view'),
    OptionView = require('./optionview'),
    Utils = require('core/util/utils'),
    Template = require('text!./selectfield.html')
  ;

  return class SelectFieldView extends BaseFieldView {
    constructor(model, tmpl) {
      super(model, tmpl ? tmpl : Template);
      Utils.bindMethods(this, ['_onFieldChange', '_onModelChange']);

      this._options = {}
      this._render(model);

      this.$el.find(".selectfield__select").on('change', this._onFieldChange)
    }

    _onModelChange(evt) {
      super._onModelChange(evt);
      this._render(evt.currentTarget);
    }

    _onFieldChange(jqevt) {
      this.dispatchEvent('Field.ValueChange', {
        value: this.$el.find(".selectfield__select").val()
      });
    }

    disable() {
      this.$el.find('.selectfield__select').prop('disabled', true)
    }

    enable() {
      this.$el.find('.selectfield__select').prop('disabled', false)
    }

    focus() {
      this.$el.find('.selectfield__select').focus();
    }

    _render(model) {
      this.$el.find('.selectfield__label').html(model.get('label'));
      for (let optId in this._options) {
        if (!Object.keys(this._options).includes(optId)) {
          this.removeChild(this._options[optId]);
          delete this._options[optId];
        }
      }
      for (let id in model.get('options')) {
        let label = model.get('options')[id];
        if (!this._options[id]) {
          this._options[id] = new OptionView({
            id: id,
            label: label,
            selected: model.value() == id
          });
          this.addChild(this._options[id], ".selectfield__select");
        } else {
          this._options[id].select(model.value() == id);
        }
      }
      if (model.get('disabled')) {
        this.disable();
      } else {
        this.enable();
      }
    }
  };
});
