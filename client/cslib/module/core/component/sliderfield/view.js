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
      Template = require('text!./sliderfield.html'),
      DomView = require('core/view/dom_view'),
      $ = require('jquery');

  require('link!./style.css');

  return function (_FieldView) {
    _inherits(SliderFieldView, _FieldView);

    function SliderFieldView(model, tmpl) {
      _classCallCheck(this, SliderFieldView);

      var _this = _possibleConstructorReturn(this, (SliderFieldView.__proto__ || Object.getPrototypeOf(SliderFieldView)).call(this, model, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange', '_startDrag', '_drag', '_stopDrag', '_onInputChange']);

      _this.$el.find('.sliderfield__control').on('mousedown', _this._startDrag);
      _this.$el.find('.sliderfield__input').on('change blur', _this._onInputChange);
      _this.$el.find('.sliderfield__input').attr({
        min: model.get('min'),
        max: model.get('max'),
        step: (model.get('max') - model.get('min')) / model.get('steps')
      });
      $(window).on('mousemove', _this._drag);
      $(window).on('mouseup', _this._stopDrag);
      _this.render(model);
      return _this;
    }

    _createClass(SliderFieldView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(SliderFieldView.prototype.__proto__ || Object.getPrototypeOf(SliderFieldView.prototype), '_onModelChange', this).call(this, evt);
        this.render(evt.currentTarget);
      }
    }, {
      key: 'render',
      value: function render(model) {
        this.$el.find('.sliderfield__control').css({
          left: model.get('unitValue') * 100 + '%'
        });
        this.$el.find('.sliderfield__span').first().css({
          width: model.get('unitValue') * 100 + '%',
          left: '0%'
        });
        this.$el.find('.sliderfield__span').last().css({
          width: (1 - model.get('unitValue')) * 100 + '%',
          left: model.get('unitValue') * 100 + '%'
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
    }, {
      key: '_startDrag',
      value: function _startDrag(jqevt) {
        if (!this._dragging) {
          jqevt.stopPropagation();
          var control = void 0;
          this._dragging = jqevt.currentTarget;
          return false;
        }
      }
    }, {
      key: '_drag',
      value: function _drag(jqevt) {
        if (this._dragging) {
          var size = this.$dom().find('.sliderfield__track').width();
          var offset = this.$dom().find('.sliderfield__track').offset().left;
          var pos = Utils.mouseTouchPosition(jqevt);
          var val = (pos.x - offset) / size;
          this.dispatchEvent('SliderField.UnitChangeRequest', {
            value: val
          });
        }
      }
    }, {
      key: '_stopDrag',
      value: function _stopDrag(jqevt) {
        if (this._dragging) {
          this._dragging = false;
          this.dispatchEvent('SliderField.StopDrag', {});
        }
      }
    }, {
      key: '_onInputChange',
      value: function _onInputChange(jqevt) {
        this.dispatchEvent('SliderField.ChangeRequest', {
          value: $(jqevt.currentTarget).val()
        });
      }
    }]);

    return SliderFieldView;
  }(FieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkZpZWxkVmlldyIsIlRlbXBsYXRlIiwiRG9tVmlldyIsIiQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImZpbmQiLCJvbiIsIl9zdGFydERyYWciLCJfb25JbnB1dENoYW5nZSIsImF0dHIiLCJtaW4iLCJnZXQiLCJtYXgiLCJzdGVwIiwid2luZG93IiwiX2RyYWciLCJfc3RvcERyYWciLCJyZW5kZXIiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwiY3NzIiwibGVmdCIsImZpcnN0Iiwid2lkdGgiLCJsYXN0IiwidmFsIiwidmFsdWUiLCJodG1sIiwicHJvcCIsImpxZXZ0IiwiX2RyYWdnaW5nIiwic3RvcFByb3BhZ2F0aW9uIiwiY29udHJvbCIsInNpemUiLCIkZG9tIiwib2Zmc2V0IiwicG9zIiwibW91c2VUb3VjaFBvc2l0aW9uIiwieCIsImRpc3BhdGNoRXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsZ0NBQVIsQ0FBbEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHlCQUFSLENBRGI7QUFBQSxNQUVFTSxVQUFVTixRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUdFTyxJQUFJUCxRQUFRLFFBQVIsQ0FITjs7QUFLQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDZCQUFZUSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkQsS0FEaUIsRUFDVkMsUUFBUUosUUFERTs7QUFFdkJILFlBQU1RLFdBQU4sUUFBd0IsQ0FDdEIsZ0JBRHNCLEVBQ0osWUFESSxFQUNVLE9BRFYsRUFDbUIsV0FEbkIsRUFDZ0MsZ0JBRGhDLENBQXhCOztBQUlBLFlBQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHVCQUFkLEVBQXVDQyxFQUF2QyxDQUEwQyxXQUExQyxFQUF1RCxNQUFLQyxVQUE1RDtBQUNBLFlBQUtILEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDQyxFQUFyQyxDQUF3QyxhQUF4QyxFQUF1RCxNQUFLRSxjQUE1RDtBQUNBLFlBQUtKLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDSSxJQUFyQyxDQUEwQztBQUN4Q0MsYUFBS1QsTUFBTVUsR0FBTixDQUFVLEtBQVYsQ0FEbUM7QUFFeENDLGFBQUtYLE1BQU1VLEdBQU4sQ0FBVSxLQUFWLENBRm1DO0FBR3hDRSxjQUFNLENBQUNaLE1BQU1VLEdBQU4sQ0FBVSxLQUFWLElBQW1CVixNQUFNVSxHQUFOLENBQVUsS0FBVixDQUFwQixJQUF3Q1YsTUFBTVUsR0FBTixDQUFVLE9BQVY7QUFITixPQUExQztBQUtBWCxRQUFFYyxNQUFGLEVBQVVSLEVBQVYsQ0FBYSxXQUFiLEVBQTBCLE1BQUtTLEtBQS9CO0FBQ0FmLFFBQUVjLE1BQUYsRUFBVVIsRUFBVixDQUFhLFNBQWIsRUFBd0IsTUFBS1UsU0FBN0I7QUFDQSxZQUFLQyxNQUFMLENBQVloQixLQUFaO0FBZnVCO0FBZ0J4Qjs7QUFqQkg7QUFBQTtBQUFBLHFDQW1CaUJpQixHQW5CakIsRUFtQnNCO0FBQ2xCLHlJQUFxQkEsR0FBckI7QUFDQSxhQUFLRCxNQUFMLENBQVlDLElBQUlDLGFBQWhCO0FBQ0Q7QUF0Qkg7QUFBQTtBQUFBLDZCQXdCU2xCLEtBeEJULEVBd0JnQjtBQUNaLGFBQUtHLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHVCQUFkLEVBQXVDZSxHQUF2QyxDQUEyQztBQUN6Q0MsZ0JBQVNwQixNQUFNVSxHQUFOLENBQVUsV0FBVixJQUF5QixHQUFsQztBQUR5QyxTQUEzQztBQUdBLGFBQUtQLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLG9CQUFkLEVBQW9DaUIsS0FBcEMsR0FBNENGLEdBQTVDLENBQWdEO0FBQzlDRyxpQkFBVXRCLE1BQU1VLEdBQU4sQ0FBVSxXQUFWLElBQXlCLEdBQW5DLE1BRDhDO0FBRTlDVTtBQUY4QyxTQUFoRDtBQUlBLGFBQUtqQixHQUFMLENBQVNDLElBQVQsQ0FBYyxvQkFBZCxFQUFvQ21CLElBQXBDLEdBQTJDSixHQUEzQyxDQUErQztBQUM3Q0csaUJBQVUsQ0FBQyxJQUFJdEIsTUFBTVUsR0FBTixDQUFVLFdBQVYsQ0FBTCxJQUErQixHQUF6QyxNQUQ2QztBQUU3Q1UsZ0JBQVNwQixNQUFNVSxHQUFOLENBQVUsV0FBVixJQUF5QixHQUFsQztBQUY2QyxTQUEvQztBQUlBLGFBQUtQLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDb0IsR0FBckMsQ0FBeUN4QixNQUFNeUIsS0FBTixFQUF6Qzs7QUFFQSxZQUFJekIsTUFBTVUsR0FBTixDQUFVLE9BQVYsQ0FBSixFQUF3QjtBQUN0QixlQUFLUCxHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQ3NCLElBQXJDLENBQTBDMUIsTUFBTVUsR0FBTixDQUFVLE9BQVYsQ0FBMUM7QUFDRDtBQUNELFlBQUlWLE1BQU1VLEdBQU4sQ0FBVSxNQUFWLENBQUosRUFBdUI7QUFDckIsZUFBS1AsR0FBTCxDQUFTQyxJQUFULENBQWMsb0JBQWQsRUFBb0NzQixJQUFwQyxDQUF5QzFCLE1BQU1VLEdBQU4sQ0FBVSxNQUFWLENBQXpDO0FBQ0Q7QUFDRCxhQUFLUCxHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQ3VCLElBQXJDLENBQTBDLFVBQTFDLEVBQXNEM0IsTUFBTVUsR0FBTixDQUFVLFVBQVYsQ0FBdEQ7QUFDRDtBQTdDSDtBQUFBO0FBQUEsaUNBK0Nha0IsS0EvQ2IsRUErQ29CO0FBQ2hCLFlBQUksQ0FBQyxLQUFLQyxTQUFWLEVBQXFCO0FBQ25CRCxnQkFBTUUsZUFBTjtBQUNBLGNBQUlDLGdCQUFKO0FBQ0EsZUFBS0YsU0FBTCxHQUFpQkQsTUFBTVYsYUFBdkI7QUFDQSxpQkFBTyxLQUFQO0FBQ0Q7QUFDRjtBQXRESDtBQUFBO0FBQUEsNEJBd0RRVSxLQXhEUixFQXdEZTtBQUNYLFlBQUksS0FBS0MsU0FBVCxFQUFvQjtBQUNsQixjQUFNRyxPQUFPLEtBQUtDLElBQUwsR0FBWTdCLElBQVosQ0FBaUIscUJBQWpCLEVBQXdDa0IsS0FBeEMsRUFBYjtBQUNBLGNBQU1ZLFNBQVMsS0FBS0QsSUFBTCxHQUFZN0IsSUFBWixDQUFpQixxQkFBakIsRUFBd0M4QixNQUF4QyxHQUFpRGQsSUFBaEU7QUFDQSxjQUFNZSxNQUFNekMsTUFBTTBDLGtCQUFOLENBQXlCUixLQUF6QixDQUFaO0FBQ0EsY0FBTUosTUFBTSxDQUFDVyxJQUFJRSxDQUFKLEdBQVFILE1BQVQsSUFBbUJGLElBQS9CO0FBQ0EsZUFBS00sYUFBTCxDQUFtQiwrQkFBbkIsRUFBb0Q7QUFDbERiLG1CQUFPRDtBQUQyQyxXQUFwRDtBQUdEO0FBQ0Y7QUFsRUg7QUFBQTtBQUFBLGdDQW9FWUksS0FwRVosRUFvRW1CO0FBQ2YsWUFBRyxLQUFLQyxTQUFSLEVBQW1CO0FBQ2pCLGVBQUtBLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxlQUFLUyxhQUFMLENBQW1CLHNCQUFuQixFQUEyQyxFQUEzQztBQUNEO0FBQ0Y7QUF6RUg7QUFBQTtBQUFBLHFDQTJFaUJWLEtBM0VqQixFQTJFd0I7QUFDcEIsYUFBS1UsYUFBTCxDQUFtQiwyQkFBbkIsRUFBZ0Q7QUFDOUNiLGlCQUFPMUIsRUFBRTZCLE1BQU1WLGFBQVIsRUFBdUJNLEdBQXZCO0FBRHVDLFNBQWhEO0FBR0Q7QUEvRUg7O0FBQUE7QUFBQSxJQUFxQzVCLFNBQXJDO0FBaUZELENBN0ZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBGaWVsZFZpZXcgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9zbGlkZXJmaWVsZC5odG1sJyksXG4gICAgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFNsaWRlckZpZWxkVmlldyBleHRlbmRzIEZpZWxkVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKG1vZGVsLCB0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vbk1vZGVsQ2hhbmdlJywgJ19zdGFydERyYWcnLCAnX2RyYWcnLCAnX3N0b3BEcmFnJywgJ19vbklucHV0Q2hhbmdlJ1xuICAgICAgXSlcblxuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19jb250cm9sJykub24oJ21vdXNlZG93bicsIHRoaXMuX3N0YXJ0RHJhZyk7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2xpZGVyZmllbGRfX2lucHV0Jykub24oJ2NoYW5nZSBibHVyJywgdGhpcy5fb25JbnB1dENoYW5nZSk7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2xpZGVyZmllbGRfX2lucHV0JykuYXR0cih7XG4gICAgICAgIG1pbjogbW9kZWwuZ2V0KCdtaW4nKSxcbiAgICAgICAgbWF4OiBtb2RlbC5nZXQoJ21heCcpLFxuICAgICAgICBzdGVwOiAobW9kZWwuZ2V0KCdtYXgnKSAtIG1vZGVsLmdldCgnbWluJykpIC8gbW9kZWwuZ2V0KCdzdGVwcycpXG4gICAgICB9KVxuICAgICAgJCh3aW5kb3cpLm9uKCdtb3VzZW1vdmUnLCB0aGlzLl9kcmFnKTtcbiAgICAgICQod2luZG93KS5vbignbW91c2V1cCcsIHRoaXMuX3N0b3BEcmFnKTtcbiAgICAgIHRoaXMucmVuZGVyKG1vZGVsKTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN1cGVyLl9vbk1vZGVsQ2hhbmdlKGV2dCk7XG4gICAgICB0aGlzLnJlbmRlcihldnQuY3VycmVudFRhcmdldCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKG1vZGVsKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2xpZGVyZmllbGRfX2NvbnRyb2wnKS5jc3Moe1xuICAgICAgICBsZWZ0OiBgJHttb2RlbC5nZXQoJ3VuaXRWYWx1ZScpICogMTAwfSVgXG4gICAgICB9KVxuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19zcGFuJykuZmlyc3QoKS5jc3Moe1xuICAgICAgICB3aWR0aDogYCR7bW9kZWwuZ2V0KCd1bml0VmFsdWUnKSAqIDEwMH0lYCxcbiAgICAgICAgbGVmdDogYDAlYFxuICAgICAgfSk7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2xpZGVyZmllbGRfX3NwYW4nKS5sYXN0KCkuY3NzKHtcbiAgICAgICAgd2lkdGg6IGAkeygxIC0gbW9kZWwuZ2V0KCd1bml0VmFsdWUnKSkgKiAxMDB9JWAsXG4gICAgICAgIGxlZnQ6IGAke21vZGVsLmdldCgndW5pdFZhbHVlJykgKiAxMDB9JWBcbiAgICAgIH0pO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19pbnB1dCcpLnZhbChtb2RlbC52YWx1ZSgpKTtcblxuICAgICAgaWYgKG1vZGVsLmdldCgnbGFiZWwnKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuc2xpZGVyZmllbGRfX2xhYmVsJykuaHRtbChtb2RlbC5nZXQoJ2xhYmVsJykpO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGVsLmdldCgnaGVscCcpKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXJmaWVsZF9faGVscCcpLmh0bWwobW9kZWwuZ2V0KCdoZWxwJykpO1xuICAgICAgfVxuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19pbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgbW9kZWwuZ2V0KCdkaXNhYmxlZCcpKTtcbiAgICB9XG5cbiAgICBfc3RhcnREcmFnKGpxZXZ0KSB7XG4gICAgICBpZiAoIXRoaXMuX2RyYWdnaW5nKSB7XG4gICAgICAgIGpxZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBsZXQgY29udHJvbDtcbiAgICAgICAgdGhpcy5fZHJhZ2dpbmcgPSBqcWV2dC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2RyYWcoanFldnQpIHtcbiAgICAgIGlmICh0aGlzLl9kcmFnZ2luZykge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy4kZG9tKCkuZmluZCgnLnNsaWRlcmZpZWxkX190cmFjaycpLndpZHRoKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuJGRvbSgpLmZpbmQoJy5zbGlkZXJmaWVsZF9fdHJhY2snKS5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICBjb25zdCBwb3MgPSBVdGlscy5tb3VzZVRvdWNoUG9zaXRpb24oanFldnQpO1xuICAgICAgICBjb25zdCB2YWwgPSAocG9zLnggLSBvZmZzZXQpIC8gc2l6ZTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdTbGlkZXJGaWVsZC5Vbml0Q2hhbmdlUmVxdWVzdCcsIHtcbiAgICAgICAgICB2YWx1ZTogdmFsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX3N0b3BEcmFnKGpxZXZ0KSB7XG4gICAgICBpZih0aGlzLl9kcmFnZ2luZykge1xuICAgICAgICB0aGlzLl9kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1NsaWRlckZpZWxkLlN0b3BEcmFnJywge30pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uSW5wdXRDaGFuZ2UoanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnU2xpZGVyRmllbGQuQ2hhbmdlUmVxdWVzdCcsIHtcbiAgICAgICAgdmFsdWU6ICQoanFldnQuY3VycmVudFRhcmdldCkudmFsKClcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KVxuIl19
