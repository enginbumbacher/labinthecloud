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
      console.log(model.get('color'));
      if (model.get('color')) _this.$el.find('.selectfield__label').css('color', model.get('color'));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiY29uc29sZSIsImxvZyIsImdldCIsIiRlbCIsImZpbmQiLCJjc3MiLCJfcmVuZGVyIiwib24iLCJfb25GaWVsZENoYW5nZSIsImV2dCIsImRhdGEiLCJwYXRoIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsIm9wdCIsInZhbHVlIiwiaW5jbHVkZXMiLCJpZCIsImRpc2FibGUiLCJlbmFibGUiLCJjdXJyZW50VGFyZ2V0IiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwidmFsIiwicHJvcCIsImZvY3VzIiwiaHRtbCIsIm9wdElkIiwia2V5cyIsInJlbW92ZUNoaWxkIiwibGFiZWwiLCJzZWxlY3RlZCIsImFkZENoaWxkIiwic2VsZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsZ0JBQWdCRCxRQUFRLGdDQUFSLENBQXRCO0FBQUEsTUFDRUUsYUFBYUYsUUFBUSxjQUFSLENBRGY7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxXQUFXSixRQUFRLHlCQUFSLENBSGI7O0FBTUE7QUFBQTs7QUFDRSw2QkFBWUssS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxvSUFDakJELEtBRGlCLEVBQ1ZDLE9BQU9BLElBQVAsR0FBY0YsUUFESjs7QUFFdkJELFlBQU1JLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQixnQkFBbkIsQ0FBeEI7O0FBRUEsWUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBQyxjQUFRQyxHQUFSLENBQVlMLE1BQU1NLEdBQU4sQ0FB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LFFBQUwsQ0FBYyxLQUFLbEMsUUFBTCxDQUFjbUIsRUFBZCxDQUFkLEVBQWlDLHNCQUFqQztBQUNELFdBUEQsTUFPTztBQUNMLGlCQUFLbkIsUUFBTCxDQUFjbUIsRUFBZCxFQUFrQmdCLE1BQWxCLENBQXlCdEMsTUFBTW9CLEtBQU4sTUFBaUJFLEVBQTFDO0FBQ0Q7QUFDRjtBQUNELFlBQUl0QixNQUFNTSxHQUFOLENBQVUsVUFBVixDQUFKLEVBQTJCO0FBQ3pCLGVBQUtpQixPQUFMO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBS0MsTUFBTDtBQUNEO0FBQ0Y7QUF6RUg7O0FBQUE7QUFBQSxJQUFxQzVCLGFBQXJDO0FBMkVELENBbEZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEJhc2VGaWVsZFZpZXcgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL3ZpZXcnKSxcbiAgICBPcHRpb25WaWV3ID0gcmVxdWlyZSgnLi9vcHRpb252aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9zZWxlY3RmaWVsZC5odG1sJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBTZWxlY3RGaWVsZFZpZXcgZXh0ZW5kcyBCYXNlRmllbGRWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIobW9kZWwsIHRtcGwgPyB0bXBsIDogVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25GaWVsZENoYW5nZScsICdfb25Nb2RlbENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgICBjb25zb2xlLmxvZyhtb2RlbC5nZXQoJ2NvbG9yJykpXG4gICAgICBpZiAobW9kZWwuZ2V0KCdjb2xvcicpKSB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX2xhYmVsJykuY3NzKCdjb2xvcicsIG1vZGVsLmdldCgnY29sb3InKSk7XG5cbiAgICAgIHRoaXMuX3JlbmRlcihtb2RlbCk7XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5vbignY2hhbmdlJywgdGhpcy5fb25GaWVsZENoYW5nZSlcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN1cGVyLl9vbk1vZGVsQ2hhbmdlKGV2dCk7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSAnZGlzYWJsZWRPcHRpb25zJykge1xuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuX29wdGlvbnMpLmZvckVhY2goKG9wdCkgPT4ge1xuICAgICAgICAgIGlmIChldnQuZGF0YS52YWx1ZS5pbmNsdWRlcyhvcHQuaWQoKSkpIHtcbiAgICAgICAgICAgIG9wdC5kaXNhYmxlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wdC5lbmFibGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkZpZWxkQ2hhbmdlKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLlZhbHVlQ2hhbmdlJywge1xuICAgICAgICB2YWx1ZTogdGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLnZhbCgpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5mb2N1cygpO1xuICAgIH1cblxuICAgIF9yZW5kZXIobW9kZWwpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fbGFiZWwnKS5odG1sKG1vZGVsLmdldCgnbGFiZWwnKSk7XG4gICAgICBmb3IgKGxldCBvcHRJZCBpbiB0aGlzLl9vcHRpb25zKSB7XG4gICAgICAgIGlmICghT2JqZWN0LmtleXMobW9kZWwuZ2V0KCdvcHRpb25zJykpLmluY2x1ZGVzKG9wdElkKSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5fb3B0aW9uc1tvcHRJZF0pO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vcHRpb25zW29wdElkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaWQgaW4gbW9kZWwuZ2V0KCdvcHRpb25zJykpIHtcbiAgICAgICAgbGV0IGxhYmVsID0gbW9kZWwuZ2V0KCdvcHRpb25zJylbaWRdO1xuICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnNbaWRdKSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0gPSBuZXcgT3B0aW9uVmlldyh7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICBzZWxlY3RlZDogbW9kZWwudmFsdWUoKSA9PSBpZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fb3B0aW9uc1tpZF0sIFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0uc2VsZWN0KG1vZGVsLnZhbHVlKCkgPT0gaWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiJdfQ==
