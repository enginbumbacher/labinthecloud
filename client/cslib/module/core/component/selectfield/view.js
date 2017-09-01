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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiX3JlbmRlciIsIiRlbCIsImZpbmQiLCJvbiIsIl9vbkZpZWxkQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmb3JFYWNoIiwib3B0IiwidmFsdWUiLCJpbmNsdWRlcyIsImlkIiwiZGlzYWJsZSIsImVuYWJsZSIsImN1cnJlbnRUYXJnZXQiLCJqcWV2dCIsImRpc3BhdGNoRXZlbnQiLCJ2YWwiLCJwcm9wIiwiZm9jdXMiLCJodG1sIiwiZ2V0Iiwib3B0SWQiLCJrZXlzIiwicmVtb3ZlQ2hpbGQiLCJsYWJlbCIsInNlbGVjdGVkIiwiYWRkQ2hpbGQiLCJzZWxlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxnQkFBZ0JELFFBQVEsZ0NBQVIsQ0FBdEI7QUFBQSxNQUNFRSxhQUFhRixRQUFRLGNBQVIsQ0FEZjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjtBQUFBLE1BR0VJLFdBQVdKLFFBQVEseUJBQVIsQ0FIYjs7QUFNQTtBQUFBOztBQUNFLDZCQUFZSyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkQsS0FEaUIsRUFDVkMsT0FBT0EsSUFBUCxHQUFjRixRQURKOztBQUV2QkQsWUFBTUksV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLGdCQUFuQixDQUF4Qjs7QUFFQSxZQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsWUFBS0MsT0FBTCxDQUFhSixLQUFiOztBQUVBLFlBQUtLLEdBQUwsQ0FBU0MsSUFBVCxDQUFj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T0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtDLE1BQUw7QUFDRDtBQUNGO0FBdEVIOztBQUFBO0FBQUEsSUFBcUN4QixhQUFyQztBQXdFRCxDQS9FRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgT3B0aW9uVmlldyA9IHJlcXVpcmUoJy4vb3B0aW9udmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc2VsZWN0ZmllbGQuaHRtbCcpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgU2VsZWN0RmllbGRWaWV3IGV4dGVuZHMgQmFzZUZpZWxkVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKG1vZGVsLCB0bXBsID8gdG1wbCA6IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRmllbGRDaGFuZ2UnLCAnX29uTW9kZWxDaGFuZ2UnXSk7XG5cbiAgICAgIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgICAgdGhpcy5fcmVuZGVyKG1vZGVsKTtcblxuICAgICAgdGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLm9uKCdjaGFuZ2UnLCB0aGlzLl9vbkZpZWxkQ2hhbmdlKVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgc3VwZXIuX29uTW9kZWxDaGFuZ2UoZXZ0KTtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09ICdkaXNhYmxlZE9wdGlvbnMnKSB7XG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5fb3B0aW9ucykuZm9yRWFjaCgob3B0KSA9PiB7XG4gICAgICAgICAgaWYgKGV2dC5kYXRhLnZhbHVlLmluY2x1ZGVzKG9wdC5pZCgpKSkge1xuICAgICAgICAgICAgb3B0LmRpc2FibGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0LmVuYWJsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcihldnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRmllbGRDaGFuZ2UoanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRmllbGQuVmFsdWVDaGFuZ2UnLCB7XG4gICAgICAgIHZhbHVlOiB0aGlzLiRlbC5maW5kKFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIikudmFsKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgfVxuXG4gICAgZm9jdXMoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX3NlbGVjdCcpLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgX3JlbmRlcihtb2RlbCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19sYWJlbCcpLmh0bWwobW9kZWwuZ2V0KCdsYWJlbCcpKTtcbiAgICAgIGZvciAobGV0IG9wdElkIGluIHRoaXMuX29wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyhtb2RlbC5nZXQoJ29wdGlvbnMnKSkuaW5jbHVkZXMob3B0SWQpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLl9vcHRpb25zW29wdElkXSk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX29wdGlvbnNbb3B0SWRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpZCBpbiBtb2RlbC5nZXQoJ29wdGlvbnMnKSkge1xuICAgICAgICBsZXQgbGFiZWwgPSBtb2RlbC5nZXQoJ29wdGlvbnMnKVtpZF07XG4gICAgICAgIGlmICghdGhpcy5fb3B0aW9uc1tpZF0pIHtcbiAgICAgICAgICB0aGlzLl9vcHRpb25zW2lkXSA9IG5ldyBPcHRpb25WaWV3KHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIHNlbGVjdGVkOiBtb2RlbC52YWx1ZSgpID09IGlkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9vcHRpb25zW2lkXSwgXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9vcHRpb25zW2lkXS5zZWxlY3QobW9kZWwudmFsdWUoKSA9PSBpZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn0pO1xuIl19
