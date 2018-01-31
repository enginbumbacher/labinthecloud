define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const FieldView = require('core/component/form/field/view'),
    Template = require('text!./symsliderfield.html'),
    $ = require('jquery');

  require('link!./style.css');

  return class SymmetricSliderFieldView extends FieldView {
    constructor(model, tmpl) {
      super(model, tmpl || Template);
      Utils.bindMethods(this, [
        '_onModelChange', '_startDrag', '_drag', '_stopDrag',
        '_onBaseInputChange', '_onDeltaInputChange'
      ])
      $(window).on('mousemove', this._drag);
      $(window).on('mouseup', this._stopDrag);
      this.$el.find('.symsliderfield__control').on('mousedown', this._startDrag);
      this.$el.find('.symsliderfield__input__base').attr({
        min: model.get('min'),
        max: model.get('max'),
        step: (model.get('max') - model.get('min')) / model.get('steps')
      });
      this.$el.find('.symsliderfield__input__delta').attr({
        min: 0,
        max: model.get('max') - model.get('min'),
        step: (model.get('max') - model.get('min')) / model.get('steps')
      });
      this.$el.find('.symsliderfield__input__base').on('change blur', this._onBaseInputChange);
      this.$el.find('.symsliderfield__input__delta').on('change blur', this._onDeltaInputChange);

      if (model.get('color')) this.$el.find('.symsliderfield__label').css('color', model.get('color'));
      this.render(model);
    }

    _onModelChange(evt) {
      super._onModelChange(evt);
      this.render(evt.currentTarget);
    }

    render(model) {
      let last = 0;
      this.$el.find('.symsliderfield__control__base').css({
        left: `${model.get('unitValue') * 100}%`
      });
      this.$el.find('.symsliderfield__control__delta_min').css({
        left: `${(model.get('unitValue') - model.get('deltaUnitValue')) * 100}%`
      });
      this.$el.find('.symsliderfield__control__delta_max').css({
        left: `${(model.get('unitValue') + model.get('deltaUnitValue')) * 100}%`
      });
      this.$el.find('.symsliderfield__span').each((ind, elem) => {
        switch (ind) {
          case 0:
            $(elem).css({
              width: `${(model.get('unitValue') - model.get('deltaUnitValue')) * 100}%`,
              left: `0%`
            });
          break;
          case 1:
            $(elem).css({
              width: `${model.get('deltaUnitValue') * 100}%`,
              left: `${(model.get('unitValue') - model.get('deltaUnitValue')) * 100}%`
            });
          break;
          case 2:
            $(elem).css({
              width: `${model.get('deltaUnitValue') * 100}%`,
              left: `${model.get('unitValue') * 100}%`
            });
          break;
          case 3:
            $(elem).css({
              width: `${(1 - (model.get('unitValue') + model.get('deltaUnitValue'))) * 100}%`,
              left: `${(model.get('unitValue') + model.get('deltaUnitValue')) * 100}%`
            });
          break;
        }
      })

      this.$el.find('.symsliderfield__input__base').val(model.value().base)
      this.$el.find('.symsliderfield__input__delta').val(model.value().delta)

      if (model.get('label')) {
        this.$el.find('.symsliderfield__label').html(model.get('label'));
      }
      if (model.get('help')) {
        this.$el.find('.symsliderfield__help').html(model.get('help'));
      }

      this.$el.find('.symsliderfield__input__base').prop('disabled', model.get('disabled'))
      this.$el.find('.symsliderfield__input__delta').prop('disabled', model.get('disabled'))
    }

    _startDrag(jqevt) {
      if (!this._dragging) {
        jqevt.stopPropagation();
        this._dragging = $(jqevt.currentTarget);
        return false;
      }
    }

    _drag(jqevt) {
      if (this._dragging) {
        const size = this.$dom().find('.symsliderfield__track').width();
        const offset = this.$dom().find('.symsliderfield__track').offset().left;
        const pos = Utils.mouseTouchPosition(jqevt);
        const val = (pos.x - offset) / size;

        if (this._dragging.hasClass('symsliderfield__control__base')) {
          this.dispatchEvent('SymSliderField.UnitChangeRequest', {
            value: val,
            property: 'base'
          })
        } else if (this._dragging.hasClass('symsliderfield__control__delta_min')) {
          this.dispatchEvent('SymSliderField.UnitChangeRequest', {
            offset: val,
            property: 'delta'
          })
        } else if (this._dragging.hasClass('symsliderfield__control__delta_max')) {
          this.dispatchEvent('SymSliderField.UnitChangeRequest', {
            offset: val,
            property: 'delta'
          })
        }
      }
    }

    _stopDrag(jqevt) {
      this._dragging = null;
    }

    _onBaseInputChange(jqevt) {
      this.dispatchEvent('SymSliderField.ChangeRequest', {
        property: 'base',
        value: this.$el.find('.symsliderfield__input__base').val()
      })
    }
    _onDeltaInputChange(jqevt) {
      this.dispatchEvent('SymSliderField.ChangeRequest', {
        property: 'delta',
        value: this.$el.find('.symsliderfield__input__delta').val()
      })
    }
  }
});
