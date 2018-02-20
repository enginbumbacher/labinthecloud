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
        if (!(model.get('id') === 'variation')) {
          _this.$el.find(".symselectfield__select").css({ 'margin-right': 'calc(0.5rem + 120px)' });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiZ2V0IiwiJGVsIiwiZmluZCIsImNzcyIsInJlbW92ZSIsIm9uIiwiX29uQ2hlY2tlZCIsIl9yZW5kZXIiLCJfb25GaWVsZENoYW5nZSIsImpxZXZ0IiwiZGlzcGF0Y2hFdmVudCIsInZhbHVlIiwicHJvcCIsImV2dCIsImRhdGEiLCJwYXRoIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsIm9wdCIsImluY2x1ZGVzIiwiaWQiLCJkaXNhYmxlIiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJjdXJyZW50VGFyZ2V0IiwidmFsIiwiZm9jdXMiLCJodG1sIiwib3B0SWQiLCJrZXlzIiwicmVtb3ZlQ2hpbGQiLCJsYWJlbCIsInNlbGVjdGVkIiwiYWRkQ2hpbGQiLCJtb2RlbFZhbHVlIiwicXVhbGl0YXRpdmVWYWx1ZSIsInNlbGVjdCIsInZhcmlhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGdCQUFnQkQsUUFBUSxnQ0FBUixDQUF0QjtBQUFBLE1BQ0VFLGFBQWFGLFFBQVEsY0FBUixDQURmO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksV0FBV0osUUFBUSw0QkFBUixDQUhiOztBQU1BQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UsZ0NBQVlLLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsMElBQ2pCRCxLQURpQixFQUNWQyxPQUFPQSxJQUFQLEdBQWNGLFFBREo7O0FBRXZCRCxZQUFNSSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsZ0JBQW5CLEVBQXFDLFlBQXJDLENBQXhCOztBQUVBLFlBQUtDLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxVQUFJSCxNQUFNSSxHQUFOLENBQVUsT0FBVixDQUFKLEVBQXdCLE1BQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHdCQUFkLEVBQXdDQyxHQUF4QyxDQUE0QyxPQUE1QyxFQUFxRFAsTUFBTUksR0FBTixDQUFVLE9BQVYsQ0FBckQ7QUFDeEI7O0FBRUEsVUFBSSxDQUFDSixNQUFNSSxHQUFOLENBQVUsa0JBQVYsQ0FBTCxFQUFvQztBQUNsQyxjQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyw0QkFBZCxFQUE0Q0UsTUFBNUM7QUFDQSxZQUFJLEVBQUVSLE1BQU1JLEdBQU4sQ0FBVSxJQUFWLE1BQWtCLFdBQXBCLENBQUosRUFBc0M7QUFBRSxnQkFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNDLEdBQXpDLENBQTZDLEVBQUMsZ0JBQWdCLHNCQUFqQixFQUE3QztBQUF5RixTQUFqSSxNQUNLO0FBQ0gsZ0JBQUtGLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDQyxHQUF6QyxDQUE2QyxFQUFDLGdCQUFnQixNQUFqQixFQUE3QztBQUNBLGdCQUFLRixHQUFMLENBQVNDLElBQVQsQ0FBYyx3QkFBZCxFQUF3Q0MsR0FBeEMsQ0FBNEMsRUFBQyxhQUFhLEdBQWQsRUFBNUM7QUFDRDtBQUVGLE9BUkQsTUFRTztBQUNMLGNBQUtGLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLDJCQUFkLEVBQTJDRyxFQUEzQyxDQUE4QyxPQUE5QyxFQUF1RCxNQUFLQyxVQUE1RDtBQUNEOztBQUVELFlBQUtDLE9BQUwsQ0FBYVgsS0FBYjs7QUFFQSxZQUFLSyxHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q0csRUFBekMsQ0FBNEMsUUFBNUMsRUFBc0QsTUFBS0csY0FBM0Q7QUFDQSxZQUFLUCxHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q0MsR0FBekMsQ0FBNkMsRUFBQyxhQUFZLE1BQWIsRUFBN0M7QUF2QnVCO0FBd0J4Qjs7QUF6Qkg7QUFBQTtBQUFBLGlDQTJCYU0sS0EzQmIsRUEyQm9CO0FBQ2hCLGFBQUtDLGFBQUwsQ0FBbUIsOEJBQW5CLEVBQW1EO0FBQ2pEQyxpQkFBTyxLQUFLVixHQUFMLENBQVNDLElBQVQsQ0FBYywyQkFBZCxFQUEyQ1UsSUFBM0MsQ0FBZ0QsU0FBaEQ7QUFEMEMsU0FBbkQ7QUFHRDtBQS9CSDtBQUFBO0FBQUEscUNBaUNpQkMsR0FqQ2pCLEVBaUNzQjtBQUNsQiwrSUFBcUJBLEdBQXJCO0FBQ0EsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxJQUFULElBQWlCLGlCQUFyQixFQUF3QztBQUN0Q0MsaUJBQU9DLE1BQVAsQ0FBYyxLQUFLbEIsUUFBbkIsRUFBNkJtQixPQUE3QixDQUFxQyxVQUFDQyxHQUFELEVBQVM7QUFDNUMsZ0JBQUlOLElBQUlDLElBQUosQ0FBU0gsS0FBVCxDQUFlUyxRQUFmLENBQXdCRCxJQUFJRSxFQUFKLEVBQXhCLENBQUosRUFBdUM7QUFDckNGLGtCQUFJRyxPQUFKO0FBQ0FILGtCQUFJSSxJQUFKO0FBQ0QsYUFIRCxNQUdPO0FBQ0xKLGtCQUFJSyxJQUFKO0FBQ0FMLGtCQUFJTSxNQUFKO0FBQ0Q7QUFDRixXQVJEO0FBU0QsU0FWRCxNQVVPO0FBQ0wsZUFBS2xCLE9BQUwsQ0FBYU0sSUFBSWEsYUFBakI7QUFDRDtBQUNGO0FBaERIO0FBQUE7QUFBQSxxQ0FrRGlCakIsS0FsRGpCLEVBa0R3QjtBQUNwQixhQUFLQyxhQUFMLENBQW1CLG1CQUFuQixFQUF3QztBQUN0Q0MsaUJBQU8sS0FBS1YsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUN5QixHQUF6QztBQUQrQixTQUF4QztBQUdEO0FBdERIO0FBQUE7QUFBQSxnQ0F3RFk7QUFDUixhQUFLMUIsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNVLElBQXpDLENBQThDLFVBQTlDLEVBQTBELElBQTFEO0FBQ0Q7QUExREg7QUFBQTtBQUFBLCtCQTREVztBQUNQLGFBQUtYLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDVSxJQUF6QyxDQUE4QyxVQUE5QyxFQUEwRCxLQUExRDtBQUNEO0FBOURIO0FBQUE7QUFBQSw4QkFnRVU7QUFDTixhQUFLWCxHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5QzBCLEtBQXpDO0FBQ0Q7QUFsRUg7QUFBQTtBQUFBLDhCQW9FVWhDLEtBcEVWLEVBb0VpQjtBQUNiLGFBQUtLLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHdCQUFkLEVBQXdDMkIsSUFBeEMsQ0FBNkNqQyxNQUFNSSxHQUFOLENBQVUsT0FBVixDQUE3QztBQUNBLGFBQUssSUFBSThCLEtBQVQsSUFBa0IsS0FBSy9CLFFBQXZCLEVBQWlDO0FBQy9CLGNBQUksQ0FBQ2lCLE9BQU9lLElBQVAsQ0FBWW5DLE1BQU1JLEdBQU4sQ0FBVSxTQUFWLENBQVosRUFBa0NvQixRQUFsQyxDQUEyQ1UsS0FBM0MsQ0FBTCxFQUF3RDtBQUN0RCxpQkFBS0UsV0FBTCxDQUFpQixLQUFLakMsUUFBTCxDQUFjK0IsS0FBZCxDQUFqQjtBQUNBLG1CQUFPLEtBQUsvQixRQUFMLENBQWMrQixLQUFkLENBQVA7QUFDRDtBQUNGO0FBQ0QsYUFBSyxJQUFJVCxFQUFULElBQWV6QixNQUFNSSxHQUFOLENBQVUsU0FBVixDQUFmLEVBQXFDO0FBQ25DLGNBQUlpQyxRQUFRckMsTUFBTUksR0FBTixDQUFVLFNBQVYsRUFBcUJxQixFQUFyQixDQUFaO0FBQ0EsY0FBSSxDQUFDLEtBQUt0QixRQUFMLENBQWNzQixFQUFkLENBQUwsRUFBd0I7QUFDdEIsaUJBQUt0QixRQUFMLENBQWNzQixFQUFkLElBQW9CLElBQUk1QixVQUFKLENBQWU7QUFDakM0QixrQkFBSUEsRUFENkI7QUFFakNZLHFCQUFPQSxLQUYwQjtBQUdqQ0Msd0JBQVV0QyxNQUFNZSxLQUFOLE1BQWlCVTtBQUhNLGFBQWYsQ0FBcEI7QUFLQSxpQkFBS2MsUUFBTCxDQUFjLEtBQUtwQyxRQUFMLENBQWNzQixFQUFkLENBQWQsRUFBaUMseUJBQWpDO0FBQ0QsV0FQRCxNQU9PO0FBQ0wsZ0JBQUllLGFBQWF4QyxNQUFNZSxLQUFOLEdBQWMwQixnQkFBL0I7QUFDQSxpQkFBS3RDLFFBQUwsQ0FBY3NCLEVBQWQsRUFBa0JpQixNQUFsQixDQUF5QkYsY0FBY2YsRUFBdkM7QUFDQSxnQkFBSSxLQUFLcEIsR0FBTCxDQUFTQyxJQUFULENBQWMsMkJBQWQsQ0FBSixFQUFnRDtBQUM5QyxtQkFBS0QsR0FBTCxDQUFTQyxJQUFULENBQWMsMkJBQWQsRUFBMkNVLElBQTNDLENBQWdELFNBQWhELEVBQTJEaEIsTUFBTWUsS0FBTixHQUFjNEIsU0FBekU7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxZQUFJM0MsTUFBTUksR0FBTixDQUFVLFVBQVYsQ0FBSixFQUEyQjtBQUN6QixlQUFLc0IsT0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtHLE1BQUw7QUFDRDtBQUNGO0FBbEdIOztBQUFBO0FBQUEsSUFBd0NqQyxhQUF4QztBQW9HRCxDQTdHRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc3ltc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgT3B0aW9uVmlldyA9IHJlcXVpcmUoJy4vb3B0aW9udmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc3ltc2VsZWN0ZmllbGQuaHRtbCcpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFN5bVNlbGVjdEZpZWxkVmlldyBleHRlbmRzIEJhc2VGaWVsZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCA/IHRtcGwgOiBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkZpZWxkQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJywgJ19vbkNoZWNrZWQnXSk7XG5cbiAgICAgIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgICAgaWYgKG1vZGVsLmdldCgnY29sb3InKSkgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19sYWJlbCcpLmNzcygnY29sb3InLCBtb2RlbC5nZXQoJ2NvbG9yJykpO1xuICAgICAgLy9pZiAobW9kZWwuZ2V0KCdpbnZlcnNlX29yZGVyJykpIHsgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fbGFiZWxcIikucmVtb3ZlKCkuaW5zZXJ0QWZ0ZXIodGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpKTt9XG5cbiAgICAgIGlmICghbW9kZWwuZ2V0KCdpbmNsdWRlVmFyaWF0aW9uJykpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fdmFyaWF0aW9uXCIpLnJlbW92ZSgpO1xuICAgICAgICBpZiAoIShtb2RlbC5nZXQoJ2lkJyk9PT0ndmFyaWF0aW9uJykpIHsgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLmNzcyh7J21hcmdpbi1yaWdodCc6ICdjYWxjKDAuNXJlbSArIDEyMHB4KSd9KTsgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIikuY3NzKHsnbWFyZ2luLXJpZ2h0JzogJ2F1dG8nfSk7XG4gICAgICAgICAgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fbGFiZWxcIikuY3NzKHsnZmxleC1ncm93JzogJzAnfSk7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19jaGVja2JveCcpLm9uKCdjbGljaycsIHRoaXMuX29uQ2hlY2tlZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlbmRlcihtb2RlbCk7XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5vbignY2hhbmdlJywgdGhpcy5fb25GaWVsZENoYW5nZSlcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5jc3Moeydmb250LXNpemUnOicxMnB4J30pXG4gICAgfVxuXG4gICAgX29uQ2hlY2tlZChqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdTeW1TZWxlY3RGaWVsZC5DaGFuZ2VSZXF1ZXN0Jywge1xuICAgICAgICB2YWx1ZTogdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19jaGVja2JveCcpLnByb3AoJ2NoZWNrZWQnKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN1cGVyLl9vbk1vZGVsQ2hhbmdlKGV2dCk7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSAnZGlzYWJsZWRPcHRpb25zJykge1xuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuX29wdGlvbnMpLmZvckVhY2goKG9wdCkgPT4ge1xuICAgICAgICAgIGlmIChldnQuZGF0YS52YWx1ZS5pbmNsdWRlcyhvcHQuaWQoKSkpIHtcbiAgICAgICAgICAgIG9wdC5kaXNhYmxlKCk7XG4gICAgICAgICAgICBvcHQuaGlkZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHQuc2hvdygpO1xuICAgICAgICAgICAgb3B0LmVuYWJsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcihldnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRmllbGRDaGFuZ2UoanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRmllbGQuVmFsdWVDaGFuZ2UnLCB7XG4gICAgICAgIHZhbHVlOiB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIikudmFsKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgfVxuXG4gICAgZm9jdXMoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdCcpLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgX3JlbmRlcihtb2RlbCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19sYWJlbCcpLmh0bWwobW9kZWwuZ2V0KCdsYWJlbCcpKTtcbiAgICAgIGZvciAobGV0IG9wdElkIGluIHRoaXMuX29wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyhtb2RlbC5nZXQoJ29wdGlvbnMnKSkuaW5jbHVkZXMob3B0SWQpKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLl9vcHRpb25zW29wdElkXSk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX29wdGlvbnNbb3B0SWRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpZCBpbiBtb2RlbC5nZXQoJ29wdGlvbnMnKSkge1xuICAgICAgICBsZXQgbGFiZWwgPSBtb2RlbC5nZXQoJ29wdGlvbnMnKVtpZF07XG4gICAgICAgIGlmICghdGhpcy5fb3B0aW9uc1tpZF0pIHtcbiAgICAgICAgICB0aGlzLl9vcHRpb25zW2lkXSA9IG5ldyBPcHRpb25WaWV3KHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIHNlbGVjdGVkOiBtb2RlbC52YWx1ZSgpID09IGlkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9vcHRpb25zW2lkXSwgXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IG1vZGVsLnZhbHVlKCkucXVhbGl0YXRpdmVWYWx1ZTtcbiAgICAgICAgICB0aGlzLl9vcHRpb25zW2lkXS5zZWxlY3QobW9kZWxWYWx1ZSA9PSBpZCk7XG4gICAgICAgICAgaWYgKHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fY2hlY2tib3gnKSkge1xuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19jaGVja2JveCcpLnByb3AoJ2NoZWNrZWQnLCBtb2RlbC52YWx1ZSgpLnZhcmlhdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiJdfQ==
