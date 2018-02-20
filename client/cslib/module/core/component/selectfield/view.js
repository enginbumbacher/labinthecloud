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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiZ2V0IiwiJGVsIiwiZmluZCIsImNzcyIsIl9yZW5kZXIiLCJvbiIsIl9vbkZpZWxkQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmb3JFYWNoIiwib3B0IiwidmFsdWUiLCJpbmNsdWRlcyIsImlkIiwiZGlzYWJsZSIsImhpZGUiLCJzaG93IiwiZW5hYmxlIiwiY3VycmVudFRhcmdldCIsImpxZXZ0IiwiZGlzcGF0Y2hFdmVudCIsInZhbCIsInByb3AiLCJmb2N1cyIsImh0bWwiLCJvcHRJZCIsImtleXMiLCJyZW1vdmVDaGlsZCIsImxhYmVsIiwic2VsZWN0ZWQiLCJhZGRDaGlsZCIsInNlbGVjdCIsIm1hdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsZ0JBQWdCRCxRQUFRLGdDQUFSLENBQXRCO0FBQUEsTUFDRUUsYUFBYUYsUUFBUSxjQUFSLENBRGY7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxXQUFXSixRQUFRLHlCQUFSLENBSGI7O0FBTUE7QUFBQTs7QUFDRSw2QkFBWUssS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxvSUFDakJELEtBRGlCLEVBQ1ZDLE9BQU9BLElBQVAsR0FBY0YsUUFESjs7QUFFdkJELFlBQU1JLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQixnQkFBbkIsQ0FBeEI7O0FBRUEsWUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLFVBQUlILE1BQU1JLEdBQU4sQ0FBVSxPQUFW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Q2UscUJBQU9BLEtBRjBCO0FBR2pDQyx3QkFBVXBDLE1BQU1rQixLQUFOLE1BQWlCRTtBQUhNLGFBQWYsQ0FBcEI7QUFLQSxpQkFBS2lCLFFBQUwsQ0FBYyxLQUFLbEMsUUFBTCxDQUFjaUIsRUFBZCxDQUFkLEVBQWlDLHNCQUFqQztBQUNELFdBUEQsTUFPTztBQUNMLGlCQUFLakIsUUFBTCxDQUFjaUIsRUFBZCxFQUFrQmtCLE1BQWxCLENBQXlCdEMsTUFBTWtCLEtBQU4sTUFBaUJFLEVBQTFDO0FBQ0Q7O0FBRUQsY0FBSUEsR0FBR21CLEtBQUgsQ0FBUyxnQkFBVCxDQUFKLEVBQWdDO0FBQzlCLGlCQUFLbEMsR0FBTCxDQUFTQyxJQUFULENBQWMsa0JBQWtCYyxFQUFsQixHQUF1QixHQUFyQyxFQUEwQ1MsSUFBMUMsQ0FBK0MsVUFBL0MsRUFBMkQsSUFBM0Q7QUFDRDtBQUNGO0FBQ0QsWUFBSTdCLE1BQU1JLEdBQU4sQ0FBVSxVQUFWLENBQUosRUFBMkI7QUFDekIsZUFBS2lCLE9BQUw7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLRyxNQUFMO0FBQ0Q7QUFDRjtBQWhGSDs7QUFBQTtBQUFBLElBQXFDNUIsYUFBckM7QUFrRkQsQ0F6RkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQmFzZUZpZWxkVmlldyA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvdmlldycpLFxuICAgIE9wdGlvblZpZXcgPSByZXF1aXJlKCcuL29wdGlvbnZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3NlbGVjdGZpZWxkLmh0bWwnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIFNlbGVjdEZpZWxkVmlldyBleHRlbmRzIEJhc2VGaWVsZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCA/IHRtcGwgOiBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkZpZWxkQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLl9vcHRpb25zID0ge31cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2NvbG9yJykpIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fbGFiZWwnKS5jc3MoJ2NvbG9yJywgbW9kZWwuZ2V0KCdjb2xvcicpKTtcbiAgICAgIC8vaWYgKG1vZGVsLmdldCgnaW52ZXJzZV9vcmRlcicpKSB7IHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX2xhYmVsXCIpLnJlbW92ZSgpLmluc2VydEFmdGVyKHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKSk7fVxuXG4gICAgICB0aGlzLl9yZW5kZXIobW9kZWwpO1xuXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIikub24oJ2NoYW5nZScsIHRoaXMuX29uRmllbGRDaGFuZ2UpXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIikuY3NzKHsnZm9udC1zaXplJzonMTJweCd9KVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgc3VwZXIuX29uTW9kZWxDaGFuZ2UoZXZ0KTtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09ICdkaXNhYmxlZE9wdGlvbnMnKSB7XG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5fb3B0aW9ucykuZm9yRWFjaCgob3B0KSA9PiB7XG4gICAgICAgICAgaWYgKGV2dC5kYXRhLnZhbHVlLmluY2x1ZGVzKG9wdC5pZCgpKSkge1xuICAgICAgICAgICAgb3B0LmRpc2FibGUoKTtcbiAgICAgICAgICAgIG9wdC5oaWRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9wdC5zaG93KCk7XG4gICAgICAgICAgICBvcHQuZW5hYmxlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25GaWVsZENoYW5nZShqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5WYWx1ZUNoYW5nZScsIHtcbiAgICAgICAgdmFsdWU6IHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS52YWwoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fc2VsZWN0JykuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKG1vZGVsKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX2xhYmVsJykuaHRtbChtb2RlbC5nZXQoJ2xhYmVsJykpO1xuICAgICAgZm9yIChsZXQgb3B0SWQgaW4gdGhpcy5fb3B0aW9ucykge1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKG1vZGVsLmdldCgnb3B0aW9ucycpKS5pbmNsdWRlcyhvcHRJZCkpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX29wdGlvbnNbb3B0SWRdKTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fb3B0aW9uc1tvcHRJZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGlkIGluIG1vZGVsLmdldCgnb3B0aW9ucycpKSB7XG4gICAgICAgIGxldCBsYWJlbCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zW2lkXSkge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdID0gbmV3IE9wdGlvblZpZXcoe1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG1vZGVsLnZhbHVlKCkgPT0gaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX29wdGlvbnNbaWRdLCBcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdLnNlbGVjdChtb2RlbC52YWx1ZSgpID09IGlkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGlkLm1hdGNoKCdkZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgdGhpcy4kZWwuZmluZChcIm9wdGlvblt2YWx1ZT1cIiArIGlkICsgJ10nKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiJdfQ==
