define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const FieldView = require('core/component/form/field/view'),
    Template = require('text!./sliderfield.html'),
    DomView = require('core/view/dom_view'),
    $ = require('jquery');

  require('link!./style.css');

  return class SliderFieldView extends FieldView {
    constructor(model, tmpl) {
      super(model, tmpl || Template);
      Utils.bindMethods(this, [
        '_onModelChange', '_startDrag', '_drag', '_stopDrag', '_onInputChange'
      ])

      this.$el.find('.sliderfield__control').on('mousedown', this._startDrag);
      this.$el.find('.sliderfield__input').on('change blur', this._onInputChange);
      this.$el.find('.sliderfield__input').attr({
        min: model.get('min'),
        max: model.get('max'),
        step: (model.get('max') - model.get('min')) / model.get('steps')
      })
      $(window).on('mousemove', this._drag);
      $(window).on('mouseup', this._stopDrag);
      this.render(model);
    }

    _onModelChange(evt) {
      super._onModelChange(evt);
      this.render(evt.currentTarget);
    }

    render(model) {
      this.$el.find('.sliderfield__control').css({
        left: `${model.get('unitValue') * 100}%`
      })
      this.$el.find('.sliderfield__span').first().css({
        width: `${model.get('unitValue') * 100}%`,
        left: `0%`
      });
      this.$el.find('.sliderfield__span').last().css({
        width: `${(1 - model.get('unitValue')) * 100}%`,
        left: `${model.get('unitValue') * 100}%`
      });
      this.$el.find('.sliderfield__input').val(model.value());

      if (model.get('label')) {
        this.$el.find('.sliderfield__label').html(model.get('label'));
      }
      if (model.get('help')) {
        this.$el.find('.sliderfield__help').html(model.get('help'));
      }
      this.$el.find('.sliderfield__input').prop('disabled', model.get('disabled'));
    }

    _startDrag(jqevt) {
      if (!this._dragging) {
        Globals.get('Logger').log({
          type: "videoSlider",
          category: "results",
          data: 'startSlider'
        });
        jqevt.stopPropagation();
        let control;
        this._dragging = jqevt.currentTarget;
        return false;
      }
    }

    _drag(jqevt) {
      if (this._dragging) {
        const size = this.$dom().find('.sliderfield__track').width();
        const offset = this.$dom().find('.sliderfield__track').offset().left;
        const pos = Utils.mouseTouchPosition(jqevt);
        const val = (pos.x - offset) / size;
        this.dispatchEvent('SliderField.UnitChangeRequest', {
          value: val
        })
      }
    }

    _stopDrag(jqevt) {
      if(this._dragging) {
        this._dragging = false;
        this.dispatchEvent('SliderField.StopDrag', {})
      }
    }

    _onInputChange(jqevt) {
      this.dispatchEvent('SliderField.ChangeRequest', {
        value: $(jqevt.currentTarget).val()
      })
    }
  }
})
