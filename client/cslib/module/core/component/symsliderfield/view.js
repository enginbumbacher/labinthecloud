'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var FieldView = require('core/component/form/field/view'),
      Template = require('text!./symsliderfield.html'),
      $ = require('jquery');

  require('link!./style.css');

  return function (_FieldView) {
    _inherits(SymmetricSliderFieldView, _FieldView);

    function SymmetricSliderFieldView(model, tmpl) {
      _classCallCheck(this, SymmetricSliderFieldView);

      var _this = _possibleConstructorReturn(this, (SymmetricSliderFieldView.__proto__ || Object.getPrototypeOf(SymmetricSliderFieldView)).call(this, model, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange', '_startDrag', '_drag', '_stopDrag', '_onBaseInputChange', '_onDeltaInputChange']);
      $(window).on('mousemove', _this._drag);
      $(window).on('mouseup', _this._stopDrag);
      _this.$el.find('.symsliderfield__control').on('mousedown', _this._startDrag);
      _this.$el.find('.symsliderfield__input__base').attr({
        min: model.get('min'),
        max: model.get('max'),
        step: (model.get('max') - model.get('min')) / model.get('steps')
      });
      _this.$el.find('.symsliderfield__input__delta').attr({
        min: 0,
        max: model.get('max') - model.get('min'),
        step: (model.get('max') - model.get('min')) / model.get('steps')
      });
      _this.$el.find('.symsliderfield__input__base').on('change blur', _this._onBaseInputChange);
      _this.$el.find('.symsliderfield__input__delta').on('change blur', _this._onDeltaInputChange);

      _this.render(model);
      return _this;
    }

    _createClass(SymmetricSliderFieldView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(SymmetricSliderFieldView.prototype.__proto__ || Object.getPrototypeOf(SymmetricSliderFieldView.prototype), '_onModelChange', this).call(this, evt);
        this.render(evt.currentTarget);
      }
    }, {
      key: 'render',
      value: function render(model) {
        var last = 0;
        this.$el.find('.symsliderfield__control__base').css({
          left: model.get('unitValue') * 100 + '%'
        });
        this.$el.find('.symsliderfield__control__delta_min').css({
          left: (model.get('unitValue') - model.get('deltaUnitValue')) * 100 + '%'
        });
        this.$el.find('.symsliderfield__control__delta_max').css({
          left: (model.get('unitValue') + model.get('deltaUnitValue')) * 100 + '%'
        });
        this.$el.find('.symsliderfield__span').each(function (ind, elem) {
          switch (ind) {
            case 0:
              $(elem).css({
                width: (model.get('unitValue') - model.get('deltaUnitValue')) * 100 + '%',
                left: '0%'
              });
              break;
            case 1:
              $(elem).css({
                width: model.get('deltaUnitValue') * 100 + '%',
                left: (model.get('unitValue') - model.get('deltaUnitValue')) * 100 + '%'
              });
              break;
            case 2:
              $(elem).css({
                width: model.get('deltaUnitValue') * 100 + '%',
                left: model.get('unitValue') * 100 + '%'
              });
              break;
            case 3:
              $(elem).css({
                width: (1 - (model.get('unitValue') + model.get('deltaUnitValue'))) * 100 + '%',
                left: (model.get('unitValue') + model.get('deltaUnitValue')) * 100 + '%'
              });
              break;
          }
        });

        this.$el.find('.symsliderfield__input__base').val(model.value().base);
        this.$el.find('.symsliderfield__input__delta').val(model.value().delta);

        if (model.get('label')) {
          this.$el.find('.symsliderfield__label').html(model.get('label'));
        }
        if (model.get('help')) {
          this.$el.find('.symsliderfield__help').html(model.get('help'));
        }

        this.$el.find('.symsliderfield__input__base').prop('disabled', model.get('disabled'));
        this.$el.find('.symsliderfield__input__delta').prop('disabled', model.get('disabled'));
      }
    }, {
      key: '_startDrag',
      value: function _startDrag(jqevt) {
        if (!this._dragging) {
          jqevt.stopPropagation();
          this._dragging = $(jqevt.currentTarget);
          return false;
        }
      }
    }, {
      key: '_drag',
      value: function _drag(jqevt) {
        if (this._dragging) {
          var size = this.$dom().find('.symsliderfield__track').width();
          var offset = this.$dom().find('.symsliderfield__track').offset().left;
          var pos = Utils.mouseTouchPosition(jqevt);
          var val = (pos.x - offset) / size;

          if (this._dragging.hasClass('symsliderfield__control__base')) {
            this.dispatchEvent('SymSliderField.UnitChangeRequest', {
              value: val,
              property: 'base'
            });
          } else if (this._dragging.hasClass('symsliderfield__control__delta_min')) {
            this.dispatchEvent('SymSliderField.UnitChangeRequest', {
              offset: val,
              property: 'delta'
            });
          } else if (this._dragging.hasClass('symsliderfield__control__delta_max')) {
            this.dispatchEvent('SymSliderField.UnitChangeRequest', {
              offset: val,
              property: 'delta'
            });
          }
        }
      }
    }, {
      key: '_stopDrag',
      value: function _stopDrag(jqevt) {
        this._dragging = null;
      }
    }, {
      key: '_onBaseInputChange',
      value: function _onBaseInputChange(jqevt) {
        this.dispatchEvent('SymSliderField.ChangeRequest', {
          property: 'base',
          value: this.$el.find('.symsliderfield__input__base').val()
        });
      }
    }, {
      key: '_onDeltaInputChange',
      value: function _onDeltaInputChange(jqevt) {
        this.dispatchEvent('SymSliderField.ChangeRequest', {
          property: 'delta',
          value: this.$el.find('.symsliderfield__input__delta').val()
        });
      }
    }]);

    return SymmetricSliderFieldView;
  }(FieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkZpZWxkVmlldyIsIlRlbXBsYXRlIiwiJCIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwid2luZG93Iiwib24iLCJfZHJhZyIsIl9zdG9wRHJhZyIsIiRlbCIsImZpbmQiLCJfc3RhcnREcmFnIiwiYXR0ciIsIm1pbiIsImdldCIsIm1heCIsInN0ZXAiLCJfb25CYXNlSW5wdXRDaGFuZ2UiLCJfb25EZWx0YUlucHV0Q2hhbmdlIiwicmVuZGVyIiwiZXZ0IiwiY3VycmVudFRhcmdldCIsImxhc3QiLCJjc3MiLCJsZWZ0IiwiZWFjaCIsImluZCIsImVsZW0iLCJ3aWR0aCIsInZhbCIsInZhbHVlIiwiYmFzZSIsImRlbHRhIiwiaHRtbCIsInByb3AiLCJqcWV2dCIsIl9kcmFnZ2luZyIsInN0b3BQcm9wYWdhdGlvbiIsInNpemUiLCIkZG9tIiwib2Zmc2V0IiwicG9zIiwibW91c2VUb3VjaFBvc2l0aW9uIiwieCIsImhhc0NsYXNzIiwiZGlzcGF0Y2hFdmVudCIsInByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxZQUFZSixRQUFRLGdDQUFSLENBQWxCO0FBQUEsTUFDRUssV0FBV0wsUUFBUSw0QkFBUixDQURiO0FBQUEsTUFFRU0sSUFBSU4sUUFBUSxRQUFSLENBRk47O0FBSUFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxzQ0FBWU8sS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxzSkFD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YywrQkFBZCxFQUErQ21CLEdBQS9DO0FBRjBDLFNBQW5EO0FBSUQ7QUF0SUg7O0FBQUE7QUFBQSxJQUE4QzlCLFNBQTlDO0FBd0lELENBbkpEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBGaWVsZFZpZXcgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9zeW1zbGlkZXJmaWVsZC5odG1sJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgU3ltbWV0cmljU2xpZGVyRmllbGRWaWV3IGV4dGVuZHMgRmllbGRWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIobW9kZWwsIHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uTW9kZWxDaGFuZ2UnLCAnX3N0YXJ0RHJhZycsICdfZHJhZycsICdfc3RvcERyYWcnLFxuICAgICAgICAnX29uQmFzZUlucHV0Q2hhbmdlJywgJ19vbkRlbHRhSW5wdXRDaGFuZ2UnXG4gICAgICBdKVxuICAgICAgJCh3aW5kb3cpLm9uKCdtb3VzZW1vdmUnLCB0aGlzLl9kcmFnKTtcbiAgICAgICQod2luZG93KS5vbignbW91c2V1cCcsIHRoaXMuX3N0b3BEcmFnKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zbGlkZXJmaWVsZF9fY29udHJvbCcpLm9uKCdtb3VzZWRvd24nLCB0aGlzLl9zdGFydERyYWcpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNsaWRlcmZpZWxkX19pbnB1dF9fYmFzZScpLmF0dHIoe1xuICAgICAgICBtaW46IG1vZGVsLmdldCgnbWluJyksXG4gICAgICAgIG1heDogbW9kZWwuZ2V0KCdtYXgnKSxcbiAgICAgICAgc3RlcDogKG1vZGVsLmdldCgnbWF4JykgLSBtb2RlbC5nZXQoJ21pbicpKSAvIG1vZGVsLmdldCgnc3RlcHMnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2xpZGVyZmllbGRfX2lucHV0X19kZWx0YScpLmF0dHIoe1xuICAgICAgICBtaW46IDAsXG4gICAgICAgIG1heDogbW9kZWwuZ2V0KCdtYXgnKSAtIG1vZGVsLmdldCgnbWluJyksXG4gICAgICAgIHN0ZXA6IChtb2RlbC5nZXQoJ21heCcpIC0gbW9kZWwuZ2V0KCdtaW4nKSkgLyBtb2RlbC5nZXQoJ3N0ZXBzJylcbiAgICAgIH0pO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNsaWRlcmZpZWxkX19pbnB1dF9fYmFzZScpLm9uKCdjaGFuZ2UgYmx1cicsIHRoaXMuX29uQmFzZUlucHV0Q2hhbmdlKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zbGlkZXJmaWVsZF9faW5wdXRfX2RlbHRhJykub24oJ2NoYW5nZSBibHVyJywgdGhpcy5fb25EZWx0YUlucHV0Q2hhbmdlKTtcblxuICAgICAgdGhpcy5yZW5kZXIobW9kZWwpO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgc3VwZXIuX29uTW9kZWxDaGFuZ2UoZXZ0KTtcbiAgICAgIHRoaXMucmVuZGVyKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICB9XG5cbiAgICByZW5kZXIobW9kZWwpIHtcbiAgICAgIGxldCBsYXN0ID0gMDtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zbGlkZXJmaWVsZF9fY29udHJvbF9fYmFzZScpLmNzcyh7XG4gICAgICAgIGxlZnQ6IGAke21vZGVsLmdldCgndW5pdFZhbHVlJykgKiAxMDB9JWBcbiAgICAgIH0pO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNsaWRlcmZpZWxkX19jb250cm9sX19kZWx0YV9taW4nKS5jc3Moe1xuICAgICAgICBsZWZ0OiBgJHsobW9kZWwuZ2V0KCd1bml0VmFsdWUnKSAtIG1vZGVsLmdldCgnZGVsdGFVbml0VmFsdWUnKSkgKiAxMDB9JWBcbiAgICAgIH0pO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNsaWRlcmZpZWxkX19jb250cm9sX19kZWx0YV9tYXgnKS5jc3Moe1xuICAgICAgICBsZWZ0OiBgJHsobW9kZWwuZ2V0KCd1bml0VmFsdWUnKSArIG1vZGVsLmdldCgnZGVsdGFVbml0VmFsdWUnKSkgKiAxMDB9JWBcbiAgICAgIH0pO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNsaWRlcmZpZWxkX19zcGFuJykuZWFjaCgoaW5kLCBlbGVtKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoaW5kKSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgJChlbGVtKS5jc3Moe1xuICAgICAgICAgICAgICB3aWR0aDogYCR7KG1vZGVsLmdldCgndW5pdFZhbHVlJykgLSBtb2RlbC5nZXQoJ2RlbHRhVW5pdFZhbHVlJykpICogMTAwfSVgLFxuICAgICAgICAgICAgICBsZWZ0OiBgMCVgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAkKGVsZW0pLmNzcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiBgJHttb2RlbC5nZXQoJ2RlbHRhVW5pdFZhbHVlJykgKiAxMDB9JWAsXG4gICAgICAgICAgICAgIGxlZnQ6IGAkeyhtb2RlbC5nZXQoJ3VuaXRWYWx1ZScpIC0gbW9kZWwuZ2V0KCdkZWx0YVVuaXRWYWx1ZScpKSAqIDEwMH0lYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgJChlbGVtKS5jc3Moe1xuICAgICAgICAgICAgICB3aWR0aDogYCR7bW9kZWwuZ2V0KCdkZWx0YVVuaXRWYWx1ZScpICogMTAwfSVgLFxuICAgICAgICAgICAgICBsZWZ0OiBgJHttb2RlbC5nZXQoJ3VuaXRWYWx1ZScpICogMTAwfSVgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAkKGVsZW0pLmNzcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiBgJHsoMSAtIChtb2RlbC5nZXQoJ3VuaXRWYWx1ZScpICsgbW9kZWwuZ2V0KCdkZWx0YVVuaXRWYWx1ZScpKSkgKiAxMDB9JWAsXG4gICAgICAgICAgICAgIGxlZnQ6IGAkeyhtb2RlbC5nZXQoJ3VuaXRWYWx1ZScpICsgbW9kZWwuZ2V0KCdkZWx0YVVuaXRWYWx1ZScpKSAqIDEwMH0lYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zbGlkZXJmaWVsZF9faW5wdXRfX2Jhc2UnKS52YWwobW9kZWwudmFsdWUoKS5iYXNlKVxuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNsaWRlcmZpZWxkX19pbnB1dF9fZGVsdGEnKS52YWwobW9kZWwudmFsdWUoKS5kZWx0YSlcblxuICAgICAgaWYgKG1vZGVsLmdldCgnbGFiZWwnKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2xpZGVyZmllbGRfX2xhYmVsJykuaHRtbChtb2RlbC5nZXQoJ2xhYmVsJykpO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGVsLmdldCgnaGVscCcpKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zbGlkZXJmaWVsZF9faGVscCcpLmh0bWwobW9kZWwuZ2V0KCdoZWxwJykpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2xpZGVyZmllbGRfX2lucHV0X19iYXNlJykucHJvcCgnZGlzYWJsZWQnLCBtb2RlbC5nZXQoJ2Rpc2FibGVkJykpXG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2xpZGVyZmllbGRfX2lucHV0X19kZWx0YScpLnByb3AoJ2Rpc2FibGVkJywgbW9kZWwuZ2V0KCdkaXNhYmxlZCcpKVxuICAgIH1cblxuICAgIF9zdGFydERyYWcoanFldnQpIHtcbiAgICAgIGlmICghdGhpcy5fZHJhZ2dpbmcpIHtcbiAgICAgICAganFldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuX2RyYWdnaW5nID0gJChqcWV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9kcmFnKGpxZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fZHJhZ2dpbmcpIHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuJGRvbSgpLmZpbmQoJy5zeW1zbGlkZXJmaWVsZF9fdHJhY2snKS53aWR0aCgpO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSB0aGlzLiRkb20oKS5maW5kKCcuc3ltc2xpZGVyZmllbGRfX3RyYWNrJykub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgY29uc3QgcG9zID0gVXRpbHMubW91c2VUb3VjaFBvc2l0aW9uKGpxZXZ0KTtcbiAgICAgICAgY29uc3QgdmFsID0gKHBvcy54IC0gb2Zmc2V0KSAvIHNpemU7XG5cbiAgICAgICAgaWYgKHRoaXMuX2RyYWdnaW5nLmhhc0NsYXNzKCdzeW1zbGlkZXJmaWVsZF9fY29udHJvbF9fYmFzZScpKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdTeW1TbGlkZXJGaWVsZC5Vbml0Q2hhbmdlUmVxdWVzdCcsIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWwsXG4gICAgICAgICAgICBwcm9wZXJ0eTogJ2Jhc2UnXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9kcmFnZ2luZy5oYXNDbGFzcygnc3ltc2xpZGVyZmllbGRfX2NvbnRyb2xfX2RlbHRhX21pbicpKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdTeW1TbGlkZXJGaWVsZC5Vbml0Q2hhbmdlUmVxdWVzdCcsIHtcbiAgICAgICAgICAgIG9mZnNldDogdmFsLFxuICAgICAgICAgICAgcHJvcGVydHk6ICdkZWx0YSdcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2RyYWdnaW5nLmhhc0NsYXNzKCdzeW1zbGlkZXJmaWVsZF9fY29udHJvbF9fZGVsdGFfbWF4JykpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1N5bVNsaWRlckZpZWxkLlVuaXRDaGFuZ2VSZXF1ZXN0Jywge1xuICAgICAgICAgICAgb2Zmc2V0OiB2YWwsXG4gICAgICAgICAgICBwcm9wZXJ0eTogJ2RlbHRhJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc3RvcERyYWcoanFldnQpIHtcbiAgICAgIHRoaXMuX2RyYWdnaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBfb25CYXNlSW5wdXRDaGFuZ2UoanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnU3ltU2xpZGVyRmllbGQuQ2hhbmdlUmVxdWVzdCcsIHtcbiAgICAgICAgcHJvcGVydHk6ICdiYXNlJyxcbiAgICAgICAgdmFsdWU6IHRoaXMuJGVsLmZpbmQoJy5zeW1zbGlkZXJmaWVsZF9faW5wdXRfX2Jhc2UnKS52YWwoKVxuICAgICAgfSlcbiAgICB9XG4gICAgX29uRGVsdGFJbnB1dENoYW5nZShqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdTeW1TbGlkZXJGaWVsZC5DaGFuZ2VSZXF1ZXN0Jywge1xuICAgICAgICBwcm9wZXJ0eTogJ2RlbHRhJyxcbiAgICAgICAgdmFsdWU6IHRoaXMuJGVsLmZpbmQoJy5zeW1zbGlkZXJmaWVsZF9faW5wdXRfX2RlbHRhJykudmFsKClcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KTsiXX0=
