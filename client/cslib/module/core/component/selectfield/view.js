'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseFieldView = require('core/component/form/field/view'),
      OptionView = require('./optionview'),
      Utils = require('core/util/utils'),
      Template = require('text!./selectfield.html');

  return function (_BaseFieldView) {
    _inherits(SelectFieldView, _BaseFieldView);

    function SelectFieldView(model, tmpl) {
      _classCallCheck(this, SelectFieldView);

      var _this = _possibleConstructorReturn(this, (SelectFieldView.__proto__ || Object.getPrototypeOf(SelectFieldView)).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onFieldChange', '_onModelChange']);

      _this._options = {};
      if (model.get('color')) _this.$el.find('.selectfield__label').css('color', model.get('color'));
      if (model.get('inverse_order')) {
        _this.$el.find(".selectfield__label").remove().insertAfter(_this.$el.find(".selectfield__select"));
      }

      _this._render(model);

      _this.$el.find(".selectfield__select").on('change', _this._onFieldChange);
      return _this;
    }

    _createClass(SelectFieldView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(SelectFieldView.prototype.__proto__ || Object.getPrototypeOf(SelectFieldView.prototype), '_onModelChange', this).call(this, evt);
        if (evt.data.path == 'disabledOptions') {
          Object.values(this._options).forEach(function (opt) {
            if (evt.data.value.includes(opt.id())) {
              opt.disable();
            } else {
              opt.enable();
            }
          });
        } else {
          this._render(evt.currentTarget);
        }
      }
    }, {
      key: '_onFieldChange',
      value: function _onFieldChange(jqevt) {
        this.dispatchEvent('Field.ValueChange', {
          value: this.$el.find(".selectfield__select").val()
        });
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.selectfield__select').prop('disabled', true);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.selectfield__select').prop('disabled', false);
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.$el.find('.selectfield__select').focus();
      }
    }, {
      key: '_render',
      value: function _render(model) {
        this.$el.find('.selectfield__label').html(model.get('label'));
        for (var optId in this._options) {
          if (!Object.keys(model.get('options')).includes(optId)) {
            this.removeChild(this._options[optId]);
            delete this._options[optId];
          }
        }
        for (var id in model.get('options')) {
          var label = model.get('options')[id];
          if (!this._options[id]) {
            this._options[id] = new OptionView({
              id: id,
              label: label,
              selected: model.value() == id
            });
            this.addChild(this._options[id], ".selectfield__select");
          } else {
            this._options[id].select(model.value() == id);
          }
        }
        if (model.get('disabled')) {
          this.disable();
        } else {
          this.enable();
        }
      }
    }]);

    return SelectFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiZ2V0IiwiJGVsIiwiZmluZCIsImNzcyIsInJlbW92ZSIsImluc2VydEFmdGVyIiwiX3JlbmRlciIsIm9uIiwiX29uRmllbGRDaGFuZ2UiLCJldnQiLCJkYXRhIiwicGF0aCIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJvcHQiLCJ2YWx1ZSIsImluY2x1ZGVzIiwiaWQiLCJkaXNhYmxlIiwiZW5hYmxlIiwiY3VycmVudFRhcmdldCIsImpxZXZ0IiwiZGlzcGF0Y2hFdmVudCIsInZhbCIsInByb3AiLCJmb2N1cyIsImh0bWwiLCJvcHRJZCIsImtleXMiLCJyZW1vdmVDaGlsZCIsImxhYmVsIiwic2VsZWN0ZWQiLCJhZGRDaGlsZCIsInNlbGVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGdCQUFnQkQsUUFBUSxnQ0FBUixDQUF0QjtBQUFBLE1BQ0VFLGFBQWFGLFFBQVEsY0FBUixDQURmO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksV0FBV0osUUFBUSx5QkFBUixDQUhiOztBQU1BO0FBQUE7O0FBQ0UsNkJBQVlLLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsb0lBQ2pCRCxLQURpQixFQUNWQyxPQUFPQSxJQUFQLEdBQWNGLFFBREo7O0FBRXZCRCxZQUFNSSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsZ0JBQW5CLENBQXhCOztBQUVBLFlBQUtDLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxVQUFJSCxNQUFNSSxHQUFOLENBQVUsT0FB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QUFJekIsVUFBSixDQUFlO0FBQ2pDeUIsa0JBQUlBLEVBRDZCO0FBRWpDYSxxQkFBT0EsS0FGMEI7QUFHakNDLHdCQUFVcEMsTUFBTW9CLEtBQU4sTUFBaUJFO0FBSE0sYUFBZixDQUFwQjtBQUtBLGlCQUFLZSxRQUFMLENBQWMsS0FBS2xDLFFBQUwsQ0FBY21CLEVBQWQsQ0FBZCxFQUFpQyxzQkFBakM7QUFDRCxXQVBELE1BT087QUFDTCxpQkFBS25CLFFBQUwsQ0FBY21CLEVBQWQsRUFBa0JnQixNQUFsQixDQUF5QnRDLE1BQU1vQixLQUFOLE1BQWlCRSxFQUExQztBQUNEO0FBQ0Y7QUFDRCxZQUFJdEIsTUFBTUksR0FBTixDQUFVLFVBQVYsQ0FBSixFQUEyQjtBQUN6QixlQUFLbUIsT0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtDLE1BQUw7QUFDRDtBQUNGO0FBekVIOztBQUFBO0FBQUEsSUFBcUM1QixhQUFyQztBQTJFRCxDQWxGRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgT3B0aW9uVmlldyA9IHJlcXVpcmUoJy4vb3B0aW9udmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc2VsZWN0ZmllbGQuaHRtbCcpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgU2VsZWN0RmllbGRWaWV3IGV4dGVuZHMgQmFzZUZpZWxkVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKG1vZGVsLCB0bXBsID8gdG1wbCA6IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRmllbGRDaGFuZ2UnLCAnX29uTW9kZWxDaGFuZ2UnXSk7XG5cbiAgICAgIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgICAgaWYgKG1vZGVsLmdldCgnY29sb3InKSkgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19sYWJlbCcpLmNzcygnY29sb3InLCBtb2RlbC5nZXQoJ2NvbG9yJykpO1xuICAgICAgaWYgKG1vZGVsLmdldCgnaW52ZXJzZV9vcmRlcicpKSB7IHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX2xhYmVsXCIpLnJlbW92ZSgpLmluc2VydEFmdGVyKHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKSk7fVxuXG4gICAgICB0aGlzLl9yZW5kZXIobW9kZWwpO1xuXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIikub24oJ2NoYW5nZScsIHRoaXMuX29uRmllbGRDaGFuZ2UpXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gJ2Rpc2FibGVkT3B0aW9ucycpIHtcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9vcHRpb25zKS5mb3JFYWNoKChvcHQpID0+IHtcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUuaW5jbHVkZXMob3B0LmlkKCkpKSB7XG4gICAgICAgICAgICBvcHQuZGlzYWJsZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHQuZW5hYmxlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25GaWVsZENoYW5nZShqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5WYWx1ZUNoYW5nZScsIHtcbiAgICAgICAgdmFsdWU6IHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS52YWwoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fc2VsZWN0JykuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKG1vZGVsKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX2xhYmVsJykuaHRtbChtb2RlbC5nZXQoJ2xhYmVsJykpO1xuICAgICAgZm9yIChsZXQgb3B0SWQgaW4gdGhpcy5fb3B0aW9ucykge1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKG1vZGVsLmdldCgnb3B0aW9ucycpKS5pbmNsdWRlcyhvcHRJZCkpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX29wdGlvbnNbb3B0SWRdKTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fb3B0aW9uc1tvcHRJZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGlkIGluIG1vZGVsLmdldCgnb3B0aW9ucycpKSB7XG4gICAgICAgIGxldCBsYWJlbCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zW2lkXSkge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdID0gbmV3IE9wdGlvblZpZXcoe1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG1vZGVsLnZhbHVlKCkgPT0gaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX29wdGlvbnNbaWRdLCBcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdLnNlbGVjdChtb2RlbC52YWx1ZSgpID09IGlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1vZGVsLmdldCgnZGlzYWJsZWQnKSkge1xuICAgICAgICB0aGlzLmRpc2FibGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
