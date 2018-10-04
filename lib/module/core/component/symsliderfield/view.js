import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import FieldView from 'core/component/form/field/view';
import Template from './symsliderfield.html';
import $ from 'jquery';

import './style.scss';

export default class SymmetricSliderFieldView extends FieldView {
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

    this._addVariationPopUp(model);

    if (model.get('color')) this.$el.find('.symsliderfield__label').css('color', model.get('color'));
    if (model.get('min_width')) this.$el.find('.symsliderfield__content').css('min-width',model.get('min_width'));
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
      $(this).find('.variation__popup').css({display:'inline-block'});
    },
    function(){
      $(this).find('.variation__popup').css({'display':'none'});
    });
  }
}
