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
        this._dragging = null;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkZpZWxkVmlldyIsIlRlbXBsYXRlIiwiRG9tVmlldyIsIiQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImZpbmQiLCJvbiIsIl9zdGFydERyYWciLCJfb25JbnB1dENoYW5nZSIsImF0dHIiLCJtaW4iLCJnZXQiLCJtYXgiLCJzdGVwIiwid2luZG93IiwiX2RyYWciLCJfc3RvcERyYWciLCJyZW5kZXIiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwiY3NzIiwibGVmdCIsImZpcnN0Iiwid2lkdGgiLCJsYXN0IiwidmFsIiwidmFsdWUiLCJodG1sIiwicHJvcCIsImpxZXZ0IiwiX2RyYWdnaW5nIiwic3RvcFByb3BhZ2F0aW9uIiwiY29udHJvbCIsInNpemUiLCIkZG9tIiwib2Zmc2V0IiwicG9zIiwibW91c2VUb3VjaFBvc2l0aW9uIiwieCIsImRpc3BhdGNoRXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsZ0NBQVIsQ0FBbEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHlCQUFSLENBRGI7QUFBQSxNQUVFTSxVQUFVTixRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUdFTyxJQUFJUCxRQUFRLFFBQVIsQ0FITjs7QUFLQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDZCQUFZUSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkQsS0FEaUIsRUFDVkMsUUFBUUosUUFE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TjtBQUNBLGNBQUlDLGdCQUFKO0FBQ0EsZUFBS0YsU0FBTCxHQUFpQkQsTUFBTVYsYUFBdkI7QUFDQSxpQkFBTyxLQUFQO0FBQ0Q7QUFDRjtBQXRESDtBQUFBO0FBQUEsNEJBd0RRVSxLQXhEUixFQXdEZTtBQUNYLFlBQUksS0FBS0MsU0FBVCxFQUFvQjtBQUNsQixjQUFNRyxPQUFPLEtBQUtDLElBQUwsR0FBWTdCLElBQVosQ0FBaUIscUJBQWpCLEVBQXdDa0IsS0FBeEMsRUFBYjtBQUNBLGNBQU1ZLFNBQVMsS0FBS0QsSUFBTCxHQUFZN0IsSUFBWixDQUFpQixxQkFBakIsRUFBd0M4QixNQUF4QyxHQUFpRGQsSUFBaEU7QUFDQSxjQUFNZSxNQUFNekMsTUFBTTBDLGtCQUFOLENBQXlCUixLQUF6QixDQUFaO0FBQ0EsY0FBTUosTUFBTSxDQUFDVyxJQUFJRSxDQUFKLEdBQVFILE1BQVQsSUFBbUJGLElBQS9CO0FBQ0EsZUFBS00sYUFBTCxDQUFtQiwrQkFBbkIsRUFBb0Q7QUFDbERiLG1CQUFPRDtBQUQyQyxXQUFwRDtBQUdEO0FBQ0Y7QUFsRUg7QUFBQTtBQUFBLGdDQW9FWUksS0FwRVosRUFvRW1CO0FBQ2YsYUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNEO0FBdEVIO0FBQUE7QUFBQSxxQ0F3RWlCRCxLQXhFakIsRUF3RXdCO0FBQ3BCLGFBQUtVLGFBQUwsQ0FBbUIsMkJBQW5CLEVBQWdEO0FBQzlDYixpQkFBTzFCLEVBQUU2QixNQUFNVixhQUFSLEVBQXVCTSxHQUF2QjtBQUR1QyxTQUFoRDtBQUdEO0FBNUVIOztBQUFBO0FBQUEsSUFBcUM1QixTQUFyQztBQThFRCxDQTFGRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc2xpZGVyZmllbGQuaHRtbCcpLFxuICAgIERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBTbGlkZXJGaWVsZFZpZXcgZXh0ZW5kcyBGaWVsZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25Nb2RlbENoYW5nZScsICdfc3RhcnREcmFnJywgJ19kcmFnJywgJ19zdG9wRHJhZycsICdfb25JbnB1dENoYW5nZSdcbiAgICAgIF0pXG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXJmaWVsZF9fY29udHJvbCcpLm9uKCdtb3VzZWRvd24nLCB0aGlzLl9zdGFydERyYWcpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19pbnB1dCcpLm9uKCdjaGFuZ2UgYmx1cicsIHRoaXMuX29uSW5wdXRDaGFuZ2UpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19pbnB1dCcpLmF0dHIoe1xuICAgICAgICBtaW46IG1vZGVsLmdldCgnbWluJyksXG4gICAgICAgIG1heDogbW9kZWwuZ2V0KCdtYXgnKSxcbiAgICAgICAgc3RlcDogKG1vZGVsLmdldCgnbWF4JykgLSBtb2RlbC5nZXQoJ21pbicpKSAvIG1vZGVsLmdldCgnc3RlcHMnKVxuICAgICAgfSlcbiAgICAgICQod2luZG93KS5vbignbW91c2Vtb3ZlJywgdGhpcy5fZHJhZyk7XG4gICAgICAkKHdpbmRvdykub24oJ21vdXNldXAnLCB0aGlzLl9zdG9wRHJhZyk7XG4gICAgICB0aGlzLnJlbmRlcihtb2RlbCk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgICAgdGhpcy5yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgIH1cblxuICAgIHJlbmRlcihtb2RlbCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19jb250cm9sJykuY3NzKHtcbiAgICAgICAgbGVmdDogYCR7bW9kZWwuZ2V0KCd1bml0VmFsdWUnKSAqIDEwMH0lYFxuICAgICAgfSlcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXJmaWVsZF9fc3BhbicpLmZpcnN0KCkuY3NzKHtcbiAgICAgICAgd2lkdGg6IGAke21vZGVsLmdldCgndW5pdFZhbHVlJykgKiAxMDB9JWAsXG4gICAgICAgIGxlZnQ6IGAwJWBcbiAgICAgIH0pO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19zcGFuJykubGFzdCgpLmNzcyh7XG4gICAgICAgIHdpZHRoOiBgJHsoMSAtIG1vZGVsLmdldCgndW5pdFZhbHVlJykpICogMTAwfSVgLFxuICAgICAgICBsZWZ0OiBgJHttb2RlbC5nZXQoJ3VuaXRWYWx1ZScpICogMTAwfSVgXG4gICAgICB9KTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXJmaWVsZF9faW5wdXQnKS52YWwobW9kZWwudmFsdWUoKSk7XG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2xhYmVsJykpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnNsaWRlcmZpZWxkX19sYWJlbCcpLmh0bWwobW9kZWwuZ2V0KCdsYWJlbCcpKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2hlbHAnKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuc2xpZGVyZmllbGRfX2hlbHAnKS5odG1sKG1vZGVsLmdldCgnaGVscCcpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zbGlkZXJmaWVsZF9faW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIG1vZGVsLmdldCgnZGlzYWJsZWQnKSk7XG4gICAgfVxuXG4gICAgX3N0YXJ0RHJhZyhqcWV2dCkge1xuICAgICAgaWYgKCF0aGlzLl9kcmFnZ2luZykge1xuICAgICAgICBqcWV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgbGV0IGNvbnRyb2w7XG4gICAgICAgIHRoaXMuX2RyYWdnaW5nID0ganFldnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9kcmFnKGpxZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fZHJhZ2dpbmcpIHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuJGRvbSgpLmZpbmQoJy5zbGlkZXJmaWVsZF9fdHJhY2snKS53aWR0aCgpO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSB0aGlzLiRkb20oKS5maW5kKCcuc2xpZGVyZmllbGRfX3RyYWNrJykub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgY29uc3QgcG9zID0gVXRpbHMubW91c2VUb3VjaFBvc2l0aW9uKGpxZXZ0KTtcbiAgICAgICAgY29uc3QgdmFsID0gKHBvcy54IC0gb2Zmc2V0KSAvIHNpemU7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnU2xpZGVyRmllbGQuVW5pdENoYW5nZVJlcXVlc3QnLCB7XG4gICAgICAgICAgdmFsdWU6IHZhbFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9zdG9wRHJhZyhqcWV2dCkge1xuICAgICAgdGhpcy5fZHJhZ2dpbmcgPSBudWxsO1xuICAgIH1cblxuICAgIF9vbklucHV0Q2hhbmdlKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1NsaWRlckZpZWxkLkNoYW5nZVJlcXVlc3QnLCB7XG4gICAgICAgIHZhbHVlOiAkKGpxZXZ0LmN1cnJlbnRUYXJnZXQpLnZhbCgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxufSkiXX0=
