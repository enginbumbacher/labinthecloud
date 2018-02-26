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
      Template = require('text!./symselectfield.html');

  require('link!./style.css');

  return function (_BaseFieldView) {
    _inherits(SymSelectFieldView, _BaseFieldView);

    function SymSelectFieldView(model, tmpl) {
      _classCallCheck(this, SymSelectFieldView);

      var _this = _possibleConstructorReturn(this, (SymSelectFieldView.__proto__ || Object.getPrototypeOf(SymSelectFieldView)).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onFieldChange', '_onModelChange', '_onChecked']);

      _this._options = {};
      if (model.get('color')) _this.$el.find('.symselectfield__label').css('color', model.get('color'));
      //if (model.get('inverse_order')) { this.$el.find(".symselectfield__label").remove().insertAfter(this.$el.find(".symselectfield__select"));}

      if (!model.get('includeVariation')) {
        _this.$el.find(".symselectfield__variation").remove();
        if (!model.get('id').match('variation')) {
          _this.$el.find(".symselectfield__select").css({ 'margin-right': 'calc(0.5rem + 150px)' });
        } else {
          _this.$el.find(".symselectfield__select").css({ 'margin-right': 'auto' });
          _this.$el.find(".symselectfield__label").css({ 'flex-grow': '0' });
        }
      } else {
        _this.$el.find('.symselectfield__checkbox').on('click', _this._onChecked);
      }

      _this._render(model);

      _this.$el.find(".symselectfield__select").on('change', _this._onFieldChange);
      _this.$el.find(".symselectfield__select").css({ 'font-size': '12px' });
      return _this;
    }

    _createClass(SymSelectFieldView, [{
      key: '_onChecked',
      value: function _onChecked(jqevt) {
        this.dispatchEvent('SymSelectField.ChangeRequest', {
          value: this.$el.find('.symselectfield__checkbox').prop('checked')
        });
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(SymSelectFieldView.prototype.__proto__ || Object.getPrototypeOf(SymSelectFieldView.prototype), '_onModelChange', this).call(this, evt);
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
          value: this.$el.find(".symselectfield__select").val()
        });
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.symselectfield__select').prop('disabled', true);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.symselectfield__select').prop('disabled', false);
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.$el.find('.symselectfield__select').focus();
      }
    }, {
      key: '_render',
      value: function _render(model) {
        this.$el.find('.symselectfield__label').html(model.get('label'));
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
            this.addChild(this._options[id], ".symselectfield__select");
          } else {
            var modelValue = model.value().qualitativeValue;
            this._options[id].select(modelValue == id);
            if (this.$el.find('.symselectfield__checkbox')) {
              this.$el.find('.symselectfield__checkbox').prop('checked', model.value().variation);
            }
          }
        }
        if (model.get('disabled')) {
          this.disable();
        } else {
          this.enable();
        }
      }
    }]);

    return SymSelectFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiZ2V0IiwiJGVsIiwiZmluZCIsImNzcyIsInJlbW92ZSIsIm1hdGNoIiwib24iLCJfb25DaGVja2VkIiwiX3JlbmRlciIsIl9vbkZpZWxkQ2hhbmdlIiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwidmFsdWUiLCJwcm9wIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmb3JFYWNoIiwib3B0IiwiaW5jbHVkZXMiLCJpZCIsImRpc2FibGUiLCJoaWRlIiwic2hvdyIsImVuYWJsZSIsImN1cnJlbnRUYXJnZXQiLCJ2YWwiLCJmb2N1cyIsImh0bWwiLCJvcHRJZCIsImtleXMiLCJyZW1vdmVDaGlsZCIsImxhYmVsIiwic2VsZWN0ZWQiLCJhZGRDaGlsZCIsIm1vZGVsVmFsdWUiLCJxdWFsaXRhdGl2ZVZhbHVlIiwic2VsZWN0IiwidmFyaWF0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsZ0JBQWdCRCxRQUFRLGdDQUFSLENBQXRCO0FBQUEsTUFDRUUsYUFBYUYsUUFBUSxjQUFSLENBRGY7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxXQUFXSixRQUFRLDRCQUFSLENBSGI7O0FBTUFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxnQ0FBWUssS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSwwSUFDakJELEtBRGlCLEVBQ1ZDLE9BQU9BLElBQVAsR0FBY0YsUUFESjs7QUFFdkJELFlBQU1JLFdBQU4sUUFBd0IsQ0FB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ckMsUUFBTCxDQUFjdUIsRUFBZCxDQUFkLEVBQWlDLHlCQUFqQztBQUNELFdBUEQsTUFPTztBQUNMLGdCQUFJZSxhQUFhekMsTUFBTWdCLEtBQU4sR0FBYzBCLGdCQUEvQjtBQUNBLGlCQUFLdkMsUUFBTCxDQUFjdUIsRUFBZCxFQUFrQmlCLE1BQWxCLENBQXlCRixjQUFjZixFQUF2QztBQUNBLGdCQUFJLEtBQUtyQixHQUFMLENBQVNDLElBQVQsQ0FBYywyQkFBZCxDQUFKLEVBQWdEO0FBQzlDLG1CQUFLRCxHQUFMLENBQVNDLElBQVQsQ0FBYywyQkFBZCxFQUEyQ1csSUFBM0MsQ0FBZ0QsU0FBaEQsRUFBMkRqQixNQUFNZ0IsS0FBTixHQUFjNEIsU0FBekU7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxZQUFJNUMsTUFBTUksR0FBTixDQUFVLFVBQVYsQ0FBSixFQUEyQjtBQUN6QixlQUFLdUIsT0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtHLE1BQUw7QUFDRDtBQUNGO0FBbEdIOztBQUFBO0FBQUEsSUFBd0NsQyxhQUF4QztBQW9HRCxDQTdHRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc3ltc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgT3B0aW9uVmlldyA9IHJlcXVpcmUoJy4vb3B0aW9udmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc3ltc2VsZWN0ZmllbGQuaHRtbCcpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFN5bVNlbGVjdEZpZWxkVmlldyBleHRlbmRzIEJhc2VGaWVsZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCA/IHRtcGwgOiBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkZpZWxkQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJywgJ19vbkNoZWNrZWQnXSk7XG5cbiAgICAgIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgICAgaWYgKG1vZGVsLmdldCgnY29sb3InKSkgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19sYWJlbCcpLmNzcygnY29sb3InLCBtb2RlbC5nZXQoJ2NvbG9yJykpO1xuICAgICAgLy9pZiAobW9kZWwuZ2V0KCdpbnZlcnNlX29yZGVyJykpIHsgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fbGFiZWxcIikucmVtb3ZlKCkuaW5zZXJ0QWZ0ZXIodGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpKTt9XG5cbiAgICAgIGlmICghbW9kZWwuZ2V0KCdpbmNsdWRlVmFyaWF0aW9uJykpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fdmFyaWF0aW9uXCIpLnJlbW92ZSgpO1xuICAgICAgICBpZiAoIShtb2RlbC5nZXQoJ2lkJykubWF0Y2goJ3ZhcmlhdGlvbicpKSkgeyB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIikuY3NzKHsnbWFyZ2luLXJpZ2h0JzogJ2NhbGMoMC41cmVtICsgMTUwcHgpJ30pOyB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5jc3MoeydtYXJnaW4tcmlnaHQnOiAnYXV0byd9KTtcbiAgICAgICAgICB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19sYWJlbFwiKS5jc3MoeydmbGV4LWdyb3cnOiAnMCd9KTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX2NoZWNrYm94Jykub24oJ2NsaWNrJywgdGhpcy5fb25DaGVja2VkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcmVuZGVyKG1vZGVsKTtcblxuICAgICAgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLm9uKCdjaGFuZ2UnLCB0aGlzLl9vbkZpZWxkQ2hhbmdlKVxuICAgICAgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLmNzcyh7J2ZvbnQtc2l6ZSc6JzEycHgnfSlcbiAgICB9XG5cbiAgICBfb25DaGVja2VkKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1N5bVNlbGVjdEZpZWxkLkNoYW5nZVJlcXVlc3QnLCB7XG4gICAgICAgIHZhbHVlOiB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX2NoZWNrYm94JykucHJvcCgnY2hlY2tlZCcpXG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgc3VwZXIuX29uTW9kZWxDaGFuZ2UoZXZ0KTtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09ICdkaXNhYmxlZE9wdGlvbnMnKSB7XG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5fb3B0aW9ucykuZm9yRWFjaCgob3B0KSA9PiB7XG4gICAgICAgICAgaWYgKGV2dC5kYXRhLnZhbHVlLmluY2x1ZGVzKG9wdC5pZCgpKSkge1xuICAgICAgICAgICAgb3B0LmRpc2FibGUoKTtcbiAgICAgICAgICAgIG9wdC5oaWRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wdC5zaG93KCk7XG4gICAgICAgICAgICBvcHQuZW5hYmxlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25GaWVsZENoYW5nZShqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5WYWx1ZUNoYW5nZScsIHtcbiAgICAgICAgdmFsdWU6IHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS52YWwoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0JykuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKG1vZGVsKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX2xhYmVsJykuaHRtbChtb2RlbC5nZXQoJ2xhYmVsJykpO1xuICAgICAgZm9yIChsZXQgb3B0SWQgaW4gdGhpcy5fb3B0aW9ucykge1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKG1vZGVsLmdldCgnb3B0aW9ucycpKS5pbmNsdWRlcyhvcHRJZCkpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX29wdGlvbnNbb3B0SWRdKTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fb3B0aW9uc1tvcHRJZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGlkIGluIG1vZGVsLmdldCgnb3B0aW9ucycpKSB7XG4gICAgICAgIGxldCBsYWJlbCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zW2lkXSkge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdID0gbmV3IE9wdGlvblZpZXcoe1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG1vZGVsLnZhbHVlKCkgPT0gaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX29wdGlvbnNbaWRdLCBcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0gbW9kZWwudmFsdWUoKS5xdWFsaXRhdGl2ZVZhbHVlO1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdLnNlbGVjdChtb2RlbFZhbHVlID09IGlkKTtcbiAgICAgICAgICBpZiAodGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19jaGVja2JveCcpKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX2NoZWNrYm94JykucHJvcCgnY2hlY2tlZCcsIG1vZGVsLnZhbHVlKCkudmFyaWF0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn0pO1xuIl19
