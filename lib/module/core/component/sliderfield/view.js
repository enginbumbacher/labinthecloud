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
        '_onModelChange', '_startDrag', '_drag', '_stopDrag'
      ])

      this._controls = [];
      this._spans = [];
      $(window).on('mousemove', this._drag);
      $(window).on('mouseup', this._stopDrag);
      this.updateControls(model);
      this.render(model);
    }

    _onModelChange(evt) {
      super._onModelChange(evt);
      switch (evt.data.path) {
        case "unitValue":
          if (evt.data.value.length != this._controls.length) this.updateControls(evt.currentTarget);
          this.render(evt.currentTarget);
        break;
        default:
          this.render(evt.currentTarget);
        break;
      }
    }

    updateControls(model) {
      let control, span;
      while (this._controls.length) {
        control = this._controls.pop();
        control.$dom().off('mousedown', this._startDrag);
        this.removeChild(this._controls.pop());
      }
      while (this._spans.length) {
        this._removeChild(this._spans.pop());
      }
      for (let i = model.get('unitValue').length; i; i--) {
        control = new DomView(`<div class="sliderfield__control"></div>`);
        control.$dom().on('mousedown', this._startDrag);
        span = new DomView(`<div class="sliderfield__span"></div>`);
        this._controls.push(control);
        this._spans.push(span);
        this.addChild(span, '.sliderfield__track');
        this.addChild(control, '.sliderfield__controls');
      }
      span = new DomView(`<div class="sliderfield__span"></div>`);
      this._spans.push(span);
      this.addChild(span, '.sliderfield__track');
    }

    render(model) {
      let last = 0;
      model.unitValue().forEach((uv, ind) => {
        this._controls[ind].$dom().css({
          left: `${uv * 100}%`
        })
        this._spans[ind].$dom().css({
          width: `${(uv - last) * 100}%`,
          left: `${last * 100}%`
        })
        last = uv;
      })
      this._spans[this._spans.length - 1].$dom().css({
        width: `${(1 - last) * 100}%`,
        left: `${last * 100}%`
      });

      if (model.get('label')) {
        this.$el.find('.sliderfield__label').html(model.get('label'));
      }
      if (model.get('help')) {
        this.$el.find('.sliderfield__help').html(model.get('help'));
      }
    }

    _startDrag(jqevt) {
      if (!this._dragging) {
        jqevt.stopPropagation();
        let control;
        this._controls.forEach((c, ind) => {
          if (c.dom() == jqevt.currentTarget) {
            control = c;
          }
        })
        this._dragging = {
          mouseStart: {
            x: jqevt.pageX,
            y: jqevt.pageY
          },
          controlStart: {
            x: control.$dom().offset().left,
            y: control.$dom().offset().top
          },
          control: control
        }
        return false;
      }
    }

    _drag(jqevt) {
      if (this._dragging) {
        const size = this.$dom().find('.sliderfield__track').width();
        const offset = this.$dom().find('.sliderfield__track').offset().left;
        const pos = Utils.mouseTouchPosition(jqevt);
        const val = (pos.x - offset) / size;
        this.dispatchEvent('SliderField.ChangeRequest', {
          value: val,
          index: this._controls.indexOf(this._dragging.control)
        })
      }
    }

    _stopDrag(jqevt) {
      this._dragging = null;
    }
  }
})