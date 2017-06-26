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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiX3JlbmRlciIsIiRlbCIsImZpbmQiLCJvbiIsIl9vbkZpZWxkQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmb3JFYWNoIiwib3B0IiwidmFsdWUiLCJpbmNsdWRlcyIsImlkIiwiZGlzYWJsZSIsImVuYWJsZSIsImN1cnJlbnRUYXJnZXQiLCJqcWV2dCIsImRpc3BhdGNoRXZlbnQiLCJ2YWwiLCJwcm9wIiwiZm9jdXMiLCJodG1sIiwiZ2V0Iiwib3B0SWQiLCJrZXlzIiwicmVtb3ZlQ2hpbGQiLCJsYWJlbCIsInNlbGVjdGVkIiwiYWRkQ2hpbGQiLCJzZWxlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxnQkFBZ0JELFFBQVEsZ0NBQVIsQ0FBdEI7QUFBQSxNQUNFRSxhQUFhRixRQUFRLGNBQVIsQ0FEZjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjtBQUFBLE1BR0VJLFdBQVdKLFFBQVEseUJBQVIsQ0FIYjs7QUFNQTtBQUFBOztBQUNFLDZCQUFZSyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkQsS0FEaUIsRUFDVkMsT0FBT0EsSUFBUCxHQUFjRixRQURKOztBQUV2QkQsWUFBTUksV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLGdCQUFuQixDQUF4Qjs7QUFFQSxZQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsWUFBS0MsT0FBTCxDQUFhSixLQUFiOztBQUVBLFlBQUtLLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHNCQUFkLEVBQXNDQyxFQUF0QyxDQUF5QyxRQUF6QyxFQUFtRCxNQUFLQyxjQUF4RDtBQVB1QjtBQVF4Qjs7QUFUSDtBQUFBO0FBQUEscUNBV2lCQyxHQVhqQixFQVdzQjtBQUNsQix5SUFBcUJBLEdBQXJCO0FBQ0EsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxJQUFULElBQWlCLGlCQUFyQixFQUF3QztBQUN0Q0MsaUJBQU9DLE1BQVAsQ0FBYyxLQUFLVixRQUFuQixFQUE2QlcsT0FBN0IsQ0FBcUMsVUFBQ0MsR0FBRCxFQUFTO0FBQzVDLGdCQUFJTixJQUFJQyxJQUFKLENBQVNNLEtBQVQsQ0FBZUMsUUFBZixDQUF3QkYsSUFBSUcsRUFBSixFQUF4QixDQUFKLEVBQXVDO0FBQ3JDSCxrQkFBSUksT0FBSjtBQUNELGFBRkQsTUFFTztBQUNMSixrQkFBSUssTUFBSjtBQUNEO0FBQ0YsV0FORDtBQU9ELFNBUkQsTUFRTztBQUNMLGVBQUtoQixPQUFMLENBQWFLLElBQUlZLGFBQWpCO0FBQ0Q7QUFDRjtBQXhCSDtBQUFBO0FBQUEscUNBMEJpQkMsS0ExQmpCLEVBMEJ3QjtBQUNwQixhQUFLQyxhQUFMLENBQW1CLG1CQUFuQixFQUF3QztBQUN0Q1AsaUJBQU8sS0FBS1gsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0NrQixHQUF0QztBQUQrQixTQUF4QztBQUdEO0FBOUJIO0FBQUE7QUFBQSxnQ0FnQ1k7QUFDUixhQUFLbkIsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0NtQixJQUF0QyxDQUEyQyxVQUEzQyxFQUF1RCxJQUF2RDtBQUNEO0FBbENIO0FBQUE7QUFBQSwrQkFvQ1c7QUFDUCxhQUFLcEIsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0NtQixJQUF0QyxDQUEyQyxVQUEzQyxFQUF1RCxLQUF2RDtBQUNEO0FBdENIO0FBQUE7QUFBQSw4QkF3Q1U7QUFDTixhQUFLcEIsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0NvQixLQUF0QztBQUNEO0FBMUNIO0FBQUE7QUFBQSw4QkE0Q1UxQixLQTVDVixFQTRDaUI7QUFDYixhQUFLSyxHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQ3FCLElBQXJDLENBQTBDM0IsTUFBTTRCLEdBQU4sQ0FBVSxPQUFWLENBQTFDO0FBQ0EsYUFBSyxJQUFJQyxLQUFULElBQWtCLEtBQUsxQixRQUF2QixFQUFpQztBQUMvQixjQUFJLENBQUNTLE9BQU9rQixJQUFQLENBQVk5QixNQUFNNEIsR0FBTixDQUFVLFNBQVYsQ0FBWixFQUFrQ1gsUUFBbEMsQ0FBMkNZLEtBQTNDLENBQUwsRUFBd0Q7QUFDdEQsaUJBQUtFLFdBQUwsQ0FBaUIsS0FBSzVCLFFBQUwsQ0FBYzBCLEtBQWQsQ0FBakI7QUFDQSxtQkFBTyxLQUFLMUIsUUFBTCxDQUFjMEIsS0FBZCxDQUFQO0FBQ0Q7QUFDRjtBQUNELGFBQUssSUFBSVgsRUFBVCxJQUFlbEIsTUFBTTRCLEdBQU4sQ0FBVSxTQUFWLENBQWYsRUFBcUM7QUFDbkMsY0FBSUksUUFBUWhDLE1BQU00QixHQUFOLENBQVUsU0FBVixFQUFxQlYsRUFBckIsQ0FBWjtBQUNBLGNBQUksQ0FBQyxLQUFLZixRQUFMLENBQWNlLEVBQWQsQ0FBTCxFQUF3QjtBQUN0QixpQkFBS2YsUUFBTCxDQUFjZSxFQUFkLElBQW9CLElBQUlyQixVQUFKLENBQWU7QUFDakNxQixrQkFBSUEsRUFENkI7QUFFakNjLHFCQUFPQSxLQUYwQjtBQUdqQ0Msd0JBQVVqQyxNQUFNZ0IsS0FBTixNQUFpQkU7QUFITSxhQUFmLENBQXBCO0FBS0EsaUJBQUtnQixRQUFMLENBQWMsS0FBSy9CLFFBQUwsQ0FBY2UsRUFBZCxDQUFkLEVBQWlDLHNCQUFqQztBQUNELFdBUEQsTUFPTztBQUNMLGlCQUFLZixRQUFMLENBQWNlLEVBQWQsRUFBa0JpQixNQUFsQixDQUF5Qm5DLE1BQU1nQixLQUFOLE1BQWlCRSxFQUExQztBQUNEO0FBQ0Y7QUFDRCxZQUFJbEIsTUFBTTRCLEdBQU4sQ0FBVSxVQUFWLENBQUosRUFBMkI7QUFDekIsZUFBS1QsT0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtDLE1BQUw7QUFDRDtBQUNGO0FBdEVIOztBQUFBO0FBQUEsSUFBcUN4QixhQUFyQztBQXdFRCxDQS9FRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
