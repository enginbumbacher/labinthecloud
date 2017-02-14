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
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Field);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Field).call(this, settings));

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
        _get(Object.getPrototypeOf(Field.prototype), 'enable', this).call(this);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this._model.disable();
        _get(Object.getPrototypeOf(Field.prototype), 'disable', this).call(this);
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
        this._model.set('value', val);
      }
    }, {
      key: 'clear',
      value: function clear() {
        var useDefault = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

        if (useDefault) {
          this.setValue(this._model.get('defaultValue'));
        } else {
          this.setValue(null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxZQUFZLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFLE9BQU8sUUFBUSxRQUFSLENBRlQ7O0FBSUE7QUFBQTs7QUFDRSxxQkFBMkI7QUFBQSxVQUFmLFFBQWUseURBQUosRUFBSTs7QUFBQTs7QUFDekIsZUFBUyxVQUFULEdBQXNCLFNBQVMsVUFBVCxJQUF1QixLQUE3QztBQUNBLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsSUFBM0M7O0FBRnlCLDJGQUluQixRQUptQjs7QUFLekIsWUFBSyxjQUFMLEdBQXNCLE1BQUssY0FBTCxDQUFvQixJQUFwQixPQUF0Qjs7QUFFQSxZQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLFFBQWxCLENBQTJCLE1BQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsU0FBaEIsRUFBMkIsSUFBM0IsQ0FBZ0MsR0FBaEMsQ0FBM0I7QUFDQSxZQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUE0QixtQkFBNUIsRUFBaUQsTUFBSyxjQUF0RDtBQVJ5QjtBQVMxQjs7QUFWSDtBQUFBO0FBQUEscUNBWWlCLEdBWmpCLEVBWXNCO0FBQ2xCLFlBQUksSUFBSSxPQUFSLEVBQWlCLElBQUksZUFBSjtBQUNqQixZQUFJLFNBQVMsS0FBSyxNQUFMLENBQVksS0FBWixFQUFiO0FBQ0EsYUFBSyxNQUFMLENBQVksR0FBWixDQUFnQixPQUFoQixFQUF5QixJQUFJLElBQUosQ0FBUyxLQUFsQztBQUNBLGFBQUssYUFBTCxDQUFtQixjQUFuQixFQUFtQztBQUNqQyxvQkFBVSxNQUR1QjtBQUVqQyxpQkFBTyxLQUFLLE1BQUwsQ0FBWSxLQUFaO0FBRjBCLFNBQW5DO0FBSUQ7QUFwQkg7QUFBQTtBQUFBLDJCQXNCTztBQUNILGVBQU8sS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUF4Qkg7QUFBQTtBQUFBLDRCQTBCUSxFQTFCUixFQTBCWTtBQUNSLGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsSUFBaEIsRUFBc0IsRUFBdEI7QUFDRDtBQTVCSDtBQUFBO0FBQUEsOEJBOEJVO0FBQ04sZUFBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE9BQWhCLENBQVA7QUFDRDtBQWhDSDtBQUFBO0FBQUEsK0JBa0NXO0FBQ1AsYUFBSyxNQUFMLENBQVksTUFBWjtBQUNBO0FBQ0Q7QUFyQ0g7QUFBQTtBQUFBLGdDQXVDWTtBQUNSLGFBQUssTUFBTCxDQUFZLE9BQVo7QUFDQTtBQUNEO0FBMUNIO0FBQUE7QUFBQSw2QkE0Q1M7QUFDTCxhQUFLLEtBQUwsQ0FBVyxJQUFYO0FBQ0Q7QUE5Q0g7QUFBQTtBQUFBLDZCQWdEUztBQUNMLGFBQUssS0FBTCxDQUFXLElBQVg7QUFDRDtBQWxESDtBQUFBO0FBQUEsaUNBb0RhO0FBQ1QsZUFBTyxLQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQVA7QUFDRDtBQXRESDtBQUFBO0FBQUEsOEJBd0RVO0FBQ04sZUFBTyxLQUFLLE1BQUwsQ0FBWSxLQUFaLEVBQVA7QUFDRDtBQTFESDtBQUFBO0FBQUEsK0JBNERXLEdBNURYLEVBNERnQjtBQUNaLGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsR0FBekI7QUFDRDtBQTlESDtBQUFBO0FBQUEsOEJBZ0UyQjtBQUFBLFlBQW5CLFVBQW1CLHlEQUFOLElBQU07O0FBQ3ZCLFlBQUksVUFBSixFQUFnQjtBQUNkLGVBQUssUUFBTCxDQUFjLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsY0FBaEIsQ0FBZDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUssUUFBTCxDQUFjLElBQWQ7QUFDRDtBQUNGO0FBdEVIO0FBQUE7QUFBQSxnQ0F3RVk7QUFDUixhQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFVBQWhCLEVBQTRCLElBQTVCO0FBQ0Q7QUExRUg7QUFBQTtBQUFBLGtDQTRFYztBQUNWLGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsS0FBNUI7QUFDRDtBQTlFSDtBQUFBO0FBQUEsOEJBZ0ZVO0FBQ04sYUFBSyxJQUFMLEdBQVksS0FBWjtBQUNEO0FBbEZIO0FBQUE7QUFBQSxnQ0FvRlksTUFwRlosRUFvRm9CO0FBQ2hCLGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsUUFBaEIsRUFBMEIsTUFBMUI7QUFDQSxhQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFNBQWhCLEVBQTJCLE9BQU8sTUFBbEM7QUFDRDtBQXZGSDs7QUFBQTtBQUFBLElBQTJCLFNBQTNCO0FBeUZELENBOUZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
