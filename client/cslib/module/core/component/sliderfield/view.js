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
          Globals.get('Logger').log({
            type: "videoSlider",
            category: "results",
            data: 'startSlider'
          });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkZpZWxkVmlldyIsIlRlbXBsYXRlIiwiRG9tVmlldyIsIiQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImZpbmQiLCJvbiIsIl9zdGFydERyYWciLCJfb25JbnB1dENoYW5nZSIsImF0dHIiLCJtaW4iLCJnZXQiLCJtYXgiLCJzdGVwIiwid2luZG93IiwiX2RyYWciLCJfc3RvcERyYWciLCJyZW5kZXIiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwiY3NzIiwibGVmdCIsImZpcnN0Iiwid2lkdGgiLCJsYXN0IiwidmFsIiwidmFsdWUiLCJodG1sIiwicHJvcCIsImpxZXZ0IiwiX2RyYWdnaW5nIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsInN0b3BQcm9wYWdhdGlvbiIsImNvbnRyb2wiLCJzaXplIiwiJGRvbSIsIm9mZnNldCIsInBvcyIsIm1vdXNlVG91Y2hQb3NpdGlvbiIsIngiLCJkaXNwYXRjaEV2ZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxZQUFZSixRQUFRLGdDQUFSLENBQWxCO0FBQUEsTUFDRUssV0FBV0wsUUFBUSx5QkFBUixDQURiO0FBQUEsTUFFRU0sVUFBVU4sUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFHRU8sSUFBSVAsUUFBUSxRQUFSLENBSE47O0FBS0FBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSw2QkFBWVEsS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFB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O0FBcEZIOztBQUFBO0FBQUEsSUFBcUM1QixTQUFyQztBQXNGRCxDQWxHRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc2xpZGVyZmllbGQuaHRtbCcpLFxuICAgIERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBTbGlkZXJGaWVsZFZpZXcgZXh0ZW5kcyBGaWVsZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25Nb2RlbENoYW5nZScsICdfc3RhcnREcmFnJywgJ19kcmFnJywgJ19zdG9wRHJhZycsICdfb25JbnB1dENoYW5nZSdcbiAgICAgIF0pXG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXJmaWVsZF9fY29udHJvbCcpLm9uKCdtb3VzZWRvd24nLCB0aGlzLl9zdGFydERyYWcpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19pbnB1dCcpLm9uKCdjaGFuZ2UgYmx1cicsIHRoaXMuX29uSW5wdXRDaGFuZ2UpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19pbnB1dCcpLmF0dHIoe1xuICAgICAgICBtaW46IG1vZGVsLmdldCgnbWluJyksXG4gICAgICAgIG1heDogbW9kZWwuZ2V0KCdtYXgnKSxcbiAgICAgICAgc3RlcDogKG1vZGVsLmdldCgnbWF4JykgLSBtb2RlbC5nZXQoJ21pbicpKSAvIG1vZGVsLmdldCgnc3RlcHMnKVxuICAgICAgfSlcbiAgICAgICQod2luZG93KS5vbignbW91c2Vtb3ZlJywgdGhpcy5fZHJhZyk7XG4gICAgICAkKHdpbmRvdykub24oJ21vdXNldXAnLCB0aGlzLl9zdG9wRHJhZyk7XG4gICAgICB0aGlzLnJlbmRlcihtb2RlbCk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgICAgdGhpcy5yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgIH1cblxuICAgIHJlbmRlcihtb2RlbCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19jb250cm9sJykuY3NzKHtcbiAgICAgICAgbGVmdDogYCR7bW9kZWwuZ2V0KCd1bml0VmFsdWUnKSAqIDEwMH0lYFxuICAgICAgfSlcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXJmaWVsZF9fc3BhbicpLmZpcnN0KCkuY3NzKHtcbiAgICAgICAgd2lkdGg6IGAke21vZGVsLmdldCgndW5pdFZhbHVlJykgKiAxMDB9JWAsXG4gICAgICAgIGxlZnQ6IGAwJWBcbiAgICAgIH0pO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19zcGFuJykubGFzdCgpLmNzcyh7XG4gICAgICAgIHdpZHRoOiBgJHsoMSAtIG1vZGVsLmdldCgndW5pdFZhbHVlJykpICogMTAwfSVgLFxuICAgICAgICBsZWZ0OiBgJHttb2RlbC5nZXQoJ3VuaXRWYWx1ZScpICogMTAwfSVgXG4gICAgICB9KTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXJmaWVsZF9faW5wdXQnKS52YWwobW9kZWwudmFsdWUoKSk7XG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2xhYmVsJykpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19sYWJlbCcpLmh0bWwobW9kZWwuZ2V0KCdsYWJlbCcpKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2hlbHAnKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuc2xpZGVyZmllbGRfX2hlbHAnKS5odG1sKG1vZGVsLmdldCgnaGVscCcpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXJmaWVsZF9faW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIG1vZGVsLmdldCgnZGlzYWJsZWQnKSk7XG4gICAgfVxuXG4gICAgX3N0YXJ0RHJhZyhqcWV2dCkge1xuICAgICAgaWYgKCF0aGlzLl9kcmFnZ2luZykge1xuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcInZpZGVvU2xpZGVyXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgIGRhdGE6ICdzdGFydFNsaWRlcidcbiAgICAgICAgfSk7XG4gICAgICAgIGpxZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBsZXQgY29udHJvbDtcbiAgICAgICAgdGhpcy5fZHJhZ2dpbmcgPSBqcWV2dC5jdXJyZW50VGFyZ2V0O1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2RyYWcoanFldnQpIHtcbiAgICAgIGlmICh0aGlzLl9kcmFnZ2luZykge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy4kZG9tKCkuZmluZCgnLnNsaWRlcmZpZWxkX190cmFjaycpLndpZHRoKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuJGRvbSgpLmZpbmQoJy5zbGlkZXJmaWVsZF9fdHJhY2snKS5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICBjb25zdCBwb3MgPSBVdGlscy5tb3VzZVRvdWNoUG9zaXRpb24oanFldnQpO1xuICAgICAgICBjb25zdCB2YWwgPSAocG9zLnggLSBvZmZzZXQpIC8gc2l6ZTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdTbGlkZXJGaWVsZC5Vbml0Q2hhbmdlUmVxdWVzdCcsIHtcbiAgICAgICAgICB2YWx1ZTogdmFsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX3N0b3BEcmFnKGpxZXZ0KSB7XG4gICAgICBpZih0aGlzLl9kcmFnZ2luZykge1xuICAgICAgICB0aGlzLl9kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1NsaWRlckZpZWxkLlN0b3BEcmFnJywge30pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uSW5wdXRDaGFuZ2UoanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnU2xpZGVyRmllbGQuQ2hhbmdlUmVxdWVzdCcsIHtcbiAgICAgICAgdmFsdWU6ICQoanFldnQuY3VycmVudFRhcmdldCkudmFsKClcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KVxuIl19
