define((require) => {
  const BaseFieldView = require('core/component/form/field/view'),
    OptionView = require('./optionview'),
    Utils = require('core/util/utils'),
    Template = require('text!./symselectfield.html')
  ;

  require('link!./style.css');

  return class SymSelectFieldView extends BaseFieldView {
    constructor(model, tmpl) {
      super(model, tmpl ? tmpl : Template);
      Utils.bindMethods(this, ['_onFieldChange', '_onModelChange', '_onChecked']);

      this._options = {}
      if (model.get('color')) this.$el.find('.symselectfield__label').css('color', model.get('color'));
      //if (model.get('inverse_order')) { this.$el.find(".symselectfield__label").remove().insertAfter(this.$el.find(".symselectfield__select"));}

      if (!model.get('includeVariation')) {
        this.$el.find(".symselectfield__variation").remove();
        if (!(model.get('id').match('variation'))) { this.$el.find(".symselectfield__select").css({'margin-right': 'calc(0.5rem + 150px)'}); }
        else {
          this.$el.find(".symselectfield__select").css({'margin-right': 'auto'});
          this.$el.find(".symselectfield__label").css({'flex-grow': '0'});
        }

      } else {
        this.$el.find('.symselectfield__checkbox').on('click', this._onChecked);
      }

      this._render(model);

      this.$el.find(".symselectfield__select").on('change', this._onFieldChange)
      this.$el.find(".symselectfield__select").css({'font-size':'12px'})
    }

    _onChecked(jqevt) {
      this.dispatchEvent('SymSelectField.ChangeRequest', {
        value: this.$el.find('.symselectfield__checkbox').prop('checked')
      })
    }

    _onModelChange(evt) {
      super._onModelChange(evt);
      if (evt.data.path == 'disabledOptions') {
        Object.values(this._options).forEach((opt) => {
          if (evt.data.value.includes(opt.id())) {
            opt.disable();
            opt.hide();
          } else {
            opt.show();
            opt.enable();
          }
        })
      } else {
        this._render(evt.currentTarget);
      }
    }

    _onFieldChange(jqevt) {
      this.dispatchEvent('Field.ValueChange', {
        value: this.$el.find(".symselectfield__select").val()
      });
    }

    disable() {
      this.$el.find('.symselectfield__select').prop('disabled', true)
    }

    enable() {
      this.$el.find('.symselectfield__select').prop('disabled', false)
    }

    focus() {
      this.$el.find('.symselectfield__select').focus();
    }

    _render(model) {
      this.$el.find('.symselectfield__label').html(model.get('label'));
      for (let optId in this._options) {
        if (!Object.keys(model.get('options')).includes(optId)) {
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
          this.addChild(this._options[id], ".symselectfield__select");
        } else {
          var modelValue = model.value().qualitativeValue;
          this._options[id].select(modelValue == id);
          if (this.$el.find('.symselectfield__checkbox')) {
            this.$el.find('.symselectfield__checkbox').prop('checked', model.value().variation);
          }
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
