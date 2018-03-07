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
      Utils.bindMethods(this, ['_onFieldChange', '_onModelChange','_addVariationPopUp','_onVariationChange']);

      this._options = {}
      this._varOptions = {};
      if (model.get('color')) this.$el.find('.symselectfield__label').css('color', model.get('color'));
      //if (model.get('inverse_order')) { this.$el.find(".symselectfield__label").remove().insertAfter(this.$el.find(".symselectfield__select"));}

      if (!Object.keys(model.get('varOptions')).length) {
        this.variation = false;
        this.$el.find(".symselectfield__variation").remove();
        this.$el.find(".symselectfield__select").css({'margin-right': 'calc(0.5rem + 160px)'});

      } else {
        this.variation = true;
        this._addVariationPopUp(model);
        this.$el.find(".variation__select").on('change', this._onVariationChange)
      }

      this._render(model);

      this.$el.find(".symselectfield__select").on('change', this._onFieldChange)
      this.$el.find(".symselectfield__select").css({'font-size':'12px'})
    }

    _onVariationChange(jqevt) {
      this.dispatchEvent('SymSelectField.ChangeRequest', {
        value: this.$el.find('.variation__select').val()
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
      if (this.variation) {
        this.$el.find('.variation_select').prop('disabled', true)
      }
    }

    enable() {
      this.$el.find('.symselectfield__select').prop('disabled', false)
      if (this.variation) {
        this.$el.find('.variation_select').prop('disabled', false)
      }
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
        }
      }

      if (this.variation) {
        for (let optId in this._varOptions) {
          if (!Object.keys(model.get('varOptions')).includes(optId)) {
            this.removeChild(this._varOptions[optId]);
            delete this._varOptions[optId];
          }
        }
        for (let id in model.get('varOptions')) {
          let label = model.get('varOptions')[id];
          if (!this._varOptions[id]) {
            this._varOptions[id] = new OptionView({
              id: id,
              label: label,
              selected: model.value().variation == id
            });
            this.addChild(this._varOptions[id], ".variation__select");
          } else {
            var modelValue = 'variation_' + model.value().variation * 100;
            this._varOptions[id].select(modelValue == id);
          }
        }
      }
      if (model.get('disabled')) {
        this.disable();
      } else {
        this.enable();
      }
    }

    _addVariationPopUp(model) {
      var description_style = {
        'display': 'none',
        'position': 'absolute',
        'min-width': '150px',
        'max-width': '300px',
        'min-height': '25px',
        'background-color': 'white',
        'border': '1px solid black',
        'opacity': '0.95',
        'z-index': '10',
        'text-align': 'left',
        'font-size': '12px',
        'padding': '5px'
      }

      let popup_message = 'Variation means that some models can have a ' + model.get('label').toLowerCase() + ' that is different from the average value you picked. The bigger the variation the bigger the possible differences from the average.';
      this.$el.find('.variation__popup').html(popup_message);


      this.$el.find('.variation__description').hover( function(e) {
                                      let posX = $(this).find('.variation__popup').position().left;
                                      let posY = $(this).find('.variation__popup').position().top;
                                      let height = $(this).find('.variation__popup').height();
                                      let width = $(this).find('.variation__popup').width();
                                      $(this).find('.variation__popup').css({display:'inline-block',
                                                                            left: posX - 0.6*width,
                                                                            top: posY - 1.1*height});
                                    },
                                    function(){
                                      $(this).find('.variation__popup').css({'display':'none'});
                                    }
                                  );
    }
  };
});
