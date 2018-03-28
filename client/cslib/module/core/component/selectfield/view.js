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
      if (model.get('min_width')) _this.$el.find('.selectfield__select').css('min-width', model.get('min_width'));
      //if (model.get('inverse_order')) { this.$el.find(".selectfield__label").remove().insertAfter(this.$el.find(".selectfield__select"));}

      _this._render(model);

      _this.$el.find(".selectfield__select").on('change', _this._onFieldChange);
      _this.$el.find(".selectfield__select").css({ 'font-size': '12px' });
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
              opt.hide();
            } else {
              opt.show();
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

          if (id.match('default_choice')) {
            this.$el.find("option[value=" + id + ']').prop('disabled', true);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiZ2V0IiwiJGVsIiwiZmluZCIsImNzcyIsIl9yZW5kZXIiLCJvbiIsIl9vbkZpZWxkQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmb3JFYWNoIiwib3B0IiwidmFsdWUiLCJpbmNsdWRlcyIsImlkIiwiZGlzYWJsZSIsImhpZGUiLCJzaG93IiwiZW5hYmxlIiwiY3VycmVudFRhcmdldCIsImpxZXZ0IiwiZGlzcGF0Y2hFdmVudCIsInZhbCIsInByb3AiLCJmb2N1cyIsImh0bWwiLCJvcHRJZCIsImtleXMiLCJyZW1vdmVDaGlsZCIsImxhYmVsIiwic2VsZWN0ZWQiLCJhZGRDaGlsZCIsInNlbGVjdCIsIm1hdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsZ0JBQWdCRCxRQUFRLGdDQUFSLENBQXRCO0FBQUEsTUFDRUUsYUFBYUYsUUFBUSxjQUFSLENBRGY7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxXQUFXSixRQUFRLHlCQUFSLENBSGI7O0FBTUE7QUFBQTs7QUFDRSw2QkFBWUssS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxvSUFDakJELEtBRGlCLEVBQ1ZDLE9BQU9BLElBQVAsR0FBY0YsUUFESjs7QUFFdkJELFlBQU1JLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQixnQkFBbkIsQ0FBeEI7O0FBRUEsWUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLFVBQUlILE1BQU1JLEdBQU4sQ0FBVSxPQUFW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QUFyQixDQUFaO0FBQ0EsY0FBSSxDQUFDLEtBQUtqQixRQUFMLENBQWNpQixFQUFkLENBQUwsRUFBd0I7QUFDdEIsaUJBQUtqQixRQUFMLENBQWNpQixFQUFkLElBQW9CLElBQUl2QixVQUFKLENBQWU7QUFDakN1QixrQkFBSUEsRUFENkI7QUFFakNlLHFCQUFPQSxLQUYwQjtBQUdqQ0Msd0JBQVVwQyxNQUFNa0IsS0FBTixNQUFpQkU7QUFITSxhQUFmLENBQXBCO0FBS0EsaUJBQUtpQixRQUFMLENBQWMsS0FBS2xDLFFBQUwsQ0FBY2lCLEVBQWQsQ0FBZCxFQUFpQyxzQkFBakM7QUFDRCxXQVBELE1BT087QUFDTCxpQkFBS2pCLFFBQUwsQ0FBY2lCLEVBQWQsRUFBa0JrQixNQUFsQixDQUF5QnRDLE1BQU1rQixLQUFOLE1BQWlCRSxFQUExQztBQUNEOztBQUVELGNBQUlBLEdBQUdtQixLQUFILENBQVMsZ0JBQVQsQ0FBSixFQUFnQztBQUM5QixpQkFBS2xDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGtCQUFrQmMsRUFBbEIsR0FBdUIsR0FBckMsRUFBMENTLElBQTFDLENBQStDLFVBQS9DLEVBQTJELElBQTNEO0FBQ0Q7QUFDRjtBQUNELFlBQUk3QixNQUFNSSxHQUFOLENBQVUsVUFBVixDQUFKLEVBQTJCO0FBQ3pCLGVBQUtpQixPQUFMO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBS0csTUFBTDtBQUNEO0FBQ0Y7QUFqRkg7O0FBQUE7QUFBQSxJQUFxQzVCLGFBQXJDO0FBbUZELENBMUZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEJhc2VGaWVsZFZpZXcgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL3ZpZXcnKSxcbiAgICBPcHRpb25WaWV3ID0gcmVxdWlyZSgnLi9vcHRpb252aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9zZWxlY3RmaWVsZC5odG1sJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBTZWxlY3RGaWVsZFZpZXcgZXh0ZW5kcyBCYXNlRmllbGRWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIobW9kZWwsIHRtcGwgPyB0bXBsIDogVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25GaWVsZENoYW5nZScsICdfb25Nb2RlbENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdjb2xvcicpKSB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX2xhYmVsJykuY3NzKCdjb2xvcicsIG1vZGVsLmdldCgnY29sb3InKSk7XG4gICAgICBpZiAobW9kZWwuZ2V0KCdtaW5fd2lkdGgnKSkgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5jc3MoJ21pbi13aWR0aCcsbW9kZWwuZ2V0KCdtaW5fd2lkdGgnKSk7XG4gICAgICAvL2lmIChtb2RlbC5nZXQoJ2ludmVyc2Vfb3JkZXInKSkgeyB0aGlzLiRlbC5maW5kKFwiLnNlbGVjdGZpZWxkX19sYWJlbFwiKS5yZW1vdmUoKS5pbnNlcnRBZnRlcih0aGlzLiRlbC5maW5kKFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIikpO31cblxuICAgICAgdGhpcy5fcmVuZGVyKG1vZGVsKTtcblxuICAgICAgdGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLm9uKCdjaGFuZ2UnLCB0aGlzLl9vbkZpZWxkQ2hhbmdlKVxuICAgICAgdGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLmNzcyh7J2ZvbnQtc2l6ZSc6JzEycHgnfSlcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN1cGVyLl9vbk1vZGVsQ2hhbmdlKGV2dCk7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSAnZGlzYWJsZWRPcHRpb25zJykge1xuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuX29wdGlvbnMpLmZvckVhY2goKG9wdCkgPT4ge1xuICAgICAgICAgIGlmIChldnQuZGF0YS52YWx1ZS5pbmNsdWRlcyhvcHQuaWQoKSkpIHtcbiAgICAgICAgICAgIG9wdC5kaXNhYmxlKCk7XG4gICAgICAgICAgICBvcHQuaGlkZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHQuc2hvdygpO1xuICAgICAgICAgICAgb3B0LmVuYWJsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcihldnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRmllbGRDaGFuZ2UoanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRmllbGQuVmFsdWVDaGFuZ2UnLCB7XG4gICAgICAgIHZhbHVlOiB0aGlzLiRlbC5maW5kKFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIikudmFsKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgfVxuXG4gICAgZm9jdXMoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX3NlbGVjdCcpLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgX3JlbmRlcihtb2RlbCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19sYWJlbCcpLmh0bWwobW9kZWwuZ2V0KCdsYWJlbCcpKTtcbiAgICAgIGZvciAobGV0IG9wdElkIGluIHRoaXMuX29wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyhtb2RlbC5nZXQoJ29wdGlvbnMnKSkuaW5jbHVkZXMob3B0SWQpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLl9vcHRpb25zW29wdElkXSk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX29wdGlvbnNbb3B0SWRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpZCBpbiBtb2RlbC5nZXQoJ29wdGlvbnMnKSkge1xuICAgICAgICBsZXQgbGFiZWwgPSBtb2RlbC5nZXQoJ29wdGlvbnMnKVtpZF07XG4gICAgICAgIGlmICghdGhpcy5fb3B0aW9uc1tpZF0pIHtcbiAgICAgICAgICB0aGlzLl9vcHRpb25zW2lkXSA9IG5ldyBPcHRpb25WaWV3KHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIHNlbGVjdGVkOiBtb2RlbC52YWx1ZSgpID09IGlkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9vcHRpb25zW2lkXSwgXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9vcHRpb25zW2lkXS5zZWxlY3QobW9kZWwudmFsdWUoKSA9PSBpZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaWQubWF0Y2goJ2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICB0aGlzLiRlbC5maW5kKFwib3B0aW9uW3ZhbHVlPVwiICsgaWQgKyAnXScpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn0pO1xuIl19
