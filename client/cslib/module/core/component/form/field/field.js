'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view');

  return function (_Component) {
    _inherits(Field, _Component);

    function Field() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Field);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, settings));

      _this._onFieldChange = _this._onFieldChange.bind(_this);

      _this._view.$dom().addClass(_this._model.get('classes').join(' '));
      _this._view.addEventListener('Field.ValueChange', _this._onFieldChange);
      return _this;
    }

    _createClass(Field, [{
      key: '_onFieldChange',
      value: function _onFieldChange(evt) {
        if (evt.bubbles) evt.stopPropagation();
        var oldVal = this._model.value();
        this._model.set('value', evt.data.value);
        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value()
        });
      }
    }, {
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'setId',
      value: function setId(id) {
        this._model.set('id', id);
      }
    }, {
      key: 'label',
      value: function label() {
        return this._model.get('label');
      }
    }, {
      key: 'enable',
      value: function enable() {
        this._model.enable();
        _get(Field.prototype.__proto__ || Object.getPrototypeOf(Field.prototype), 'enable', this).call(this);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this._model.disable();
        _get(Field.prototype.__proto__ || Object.getPrototypeOf(Field.prototype), 'disable', this).call(this);
      }
    }, {
      key: 'show',
      value: function show() {
        this._view.show();
      }
    }, {
      key: 'hide',
      value: function hide() {
        this._view.hide();
      }
    }, {
      key: 'validate',
      value: function validate() {
        return this._model.validate();
      }
    }, {
      key: 'value',
      value: function value() {
        return this._model.value();
      }
    }, {
      key: 'setValue',
      value: function setValue(val) {
        var oldVal = this._model.value();
        this._model.set('value', val);
        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value()
        });
        return Promise.resolve(val);
      }
    }, {
      key: 'clear',
      value: function clear() {
        var useDefault = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (useDefault) {
          return this.setValue(this._model.get('defaultValue'));
        } else {
          return this.setValue(null);
        }
      }
    }, {
      key: 'require',
      value: function require() {
        this._model.set('required', true);
      }
    }, {
      key: 'unrequire',
      value: function unrequire() {
        this._model.set('required', false);
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.view().focus();
      }
    }, {
      key: 'setErrors',
      value: function setErrors(errors) {
        this._model.set('errors', errors);
        this._model.set('isValid', errors.length);
      }
    }]);

    return Field;
  }(Component);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJfb25GaWVsZENoYW5nZSIsImJpbmQiLCJfdmlldyIsIiRkb20iLCJhZGRDbGFzcyIsIl9tb2RlbCIsImdldCIsImpvaW4iLCJhZGRFdmVudExpc3RlbmVyIiwiZXZ0IiwiYnViYmxlcyIsInN0b3BQcm9wYWdhdGlvbiIsIm9sZFZhbCIsInZhbHVlIiwic2V0IiwiZGF0YSIsImRpc3BhdGNoRXZlbnQiLCJvbGRWYWx1ZSIsImlkIiwiZW5hYmxlIiwiZGlzYWJsZSIsInNob3ciLCJoaWRlIiwidmFsaWRhdGUiLCJ2YWwiLCJQcm9taXNlIiwicmVzb2x2ZSIsInVzZURlZmF1bHQiLCJzZXRWYWx1ZSIsInZpZXciLCJmb2N1cyIsImVycm9ycyIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUOztBQUlBO0FBQUE7O0FBQ0UscUJBQTJCO0FBQUEsVUFBZkksUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QkgsS0FBN0M7QUFDQUUsZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQkgsSUFBM0M7O0FBRnlCLGdIQUluQkMsUUFKbUI7O0FBS3pCLFlBQUtHLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkMsSUFBcEIsT0FBdEI7O0FBRUEsWUFBS0MsS0FBTCxDQUFXQyxJQUFYLEdBQWtCQyxRQUFsQixDQUEyQixNQUFLQyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsU0FBaEIsRUFBMkJDLElBQTNCLENBQWdDLEdBQWhDLENBQTNCO0FBQ0EsWUFBS0wsS0FBTCxDQUFXTSxnQkFBWCxDQUE0QixtQkFBNUIsRUFBaUQsTUFBS1IsY0FBdEQ7QUFSeUI7QUFTMUI7O0FBVkg7QUFBQTtBQUFBLHFDQVlpQlMsR0FaakIsRUFZc0I7QUFDbEIsWUFBSUEsSUFBSUMsT0FBUixFQUFpQkQsSUFBSUUsZUFBSjtBQUNqQixZQUFJQyxTQUFTLEtBQUtQLE1BQUwsQ0FBWVEsS0FBWixFQUFiO0FBQ0EsYUFBS1IsTUFBTCxDQUFZUyxHQUFaLENBQWdCLE9BQWhCLEVBQXlCTCxJQUFJTSxJQUFKLENBQVNGLEtBQWxDO0FBQ0EsYUFBS0csYUFBTCxDQUFtQixjQUFuQixFQUFtQztBQUNqQ0Msb0JBQVVMLE1BRHVCO0FBRWpDQyxpQkFBTyxLQUFLUixNQUFMLENBQVlRLEtBQVo7QUFGMEIsU0FBbkM7QUFJRDtBQXBCSDtBQUFBO0FBQUEsMkJBc0JPO0FBQ0gsZUFBTyxLQUFLUixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBeEJIO0FBQUE7QUFBQSw0QkEwQlFZLEVBMUJSLEVBMEJZO0FBQ1IsYUFBS2IsTUFBTCxDQUFZUyxHQUFaLENBQWdCLElBQWhCLEVBQXNCSSxFQUF0QjtBQUNEO0FBNUJIO0FBQUE7QUFBQSw4QkE4QlU7QUFDTixlQUFPLEtBQUtiLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixDQUFQO0FBQ0Q7QUFoQ0g7QUFBQTtBQUFBLCtCQWtDVztBQUNQLGFBQUtELE1BQUwsQ0FBWWMsTUFBWjtBQUNBO0FBQ0Q7QUFyQ0g7QUFBQTtBQUFBLGdDQXVDWTtBQUNSLGFBQUtkLE1BQUwsQ0FBWWUsT0FBWjtBQUNBO0FBQ0Q7QUExQ0g7QUFBQTtBQUFBLDZCQTRDUztBQUNMLGFBQUtsQixLQUFMLENBQVdtQixJQUFYO0FBQ0Q7QUE5Q0g7QUFBQTtBQUFBLDZCQWdEUztBQUNMLGFBQUtuQixLQUFMLENBQVdvQixJQUFYO0FBQ0Q7QUFsREg7QUFBQTtBQUFBLGlDQW9EYTtBQUNULGVBQU8sS0FBS2pCLE1BQUwsQ0FBWWtCLFFBQVosRUFBUDtBQUNEO0FBdERIO0FBQUE7QUFBQSw4QkF3RFU7QUFDTixlQUFPLEtBQUtsQixNQUFMLENBQVlRLEtBQVosRUFBUDtBQUNEO0FBMURIO0FBQUE7QUFBQSwrQkE0RFdXLEdBNURYLEVBNERnQjtBQUNaLFlBQU1aLFNBQVMsS0FBS1AsTUFBTCxDQUFZUSxLQUFaLEVBQWY7QUFDQSxhQUFLUixNQUFMLENBQVlTLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUJVLEdBQXpCO0FBQ0EsYUFBS1IsYUFBTCxDQUFtQixjQUFuQixFQUFtQztBQUNqQ0Msb0JBQVVMLE1BRHVCO0FBRWpDQyxpQkFBTyxLQUFLUixNQUFMLENBQVlRLEtBQVo7QUFGMEIsU0FBbkM7QUFJQSxlQUFPWSxRQUFRQyxPQUFSLENBQWdCRixHQUFoQixDQUFQO0FBQ0Q7QUFwRUg7QUFBQTtBQUFBLDhCQXNFMkI7QUFBQSxZQUFuQkcsVUFBbUIsdUVBQU4sSUFBTTs7QUFDdkIsWUFBSUEsVUFBSixFQUFnQjtBQUNkLGlCQUFPLEtBQUtDLFFBQUwsQ0FBYyxLQUFLdkIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLGNBQWhCLENBQWQsQ0FBUDtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLEtBQUtzQixRQUFMLENBQWMsSUFBZCxDQUFQO0FBQ0Q7QUFDRjtBQTVFSDtBQUFBO0FBQUEsZ0NBOEVZO0FBQ1IsYUFBS3ZCLE1BQUwsQ0FBWVMsR0FBWixDQUFnQixVQUFoQixFQUE0QixJQUE1QjtBQUNEO0FBaEZIO0FBQUE7QUFBQSxrQ0FrRmM7QUFDVixhQUFLVCxNQUFMLENBQVlTLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsS0FBNUI7QUFDRDtBQXBGSDtBQUFBO0FBQUEsOEJBc0ZVO0FBQ04sYUFBS2UsSUFBTCxHQUFZQyxLQUFaO0FBQ0Q7QUF4Rkg7QUFBQTtBQUFBLGdDQTBGWUMsTUExRlosRUEwRm9CO0FBQ2hCLGFBQUsxQixNQUFMLENBQVlTLEdBQVosQ0FBZ0IsUUFBaEIsRUFBMEJpQixNQUExQjtBQUNBLGFBQUsxQixNQUFMLENBQVlTLEdBQVosQ0FBZ0IsU0FBaEIsRUFBMkJpQixPQUFPQyxNQUFsQztBQUNEO0FBN0ZIOztBQUFBO0FBQUEsSUFBMkJ0QyxTQUEzQjtBQStGRCxDQXBHRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC9maWVsZC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
