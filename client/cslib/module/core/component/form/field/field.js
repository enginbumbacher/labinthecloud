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
      key: 'updateValidation',
      value: function updateValidation(newValidation) {
        this._model._updateValidation(newValidation);
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
      key: 'setDefault',
      value: function setDefault() {
        this._model.set('value', this._model.get('defaultValue'));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJfb25GaWVsZENoYW5nZSIsImJpbmQiLCJfdmlldyIsIiRkb20iLCJhZGRDbGFzcyIsIl9tb2RlbCIsImdldCIsImpvaW4iLCJhZGRFdmVudExpc3RlbmVyIiwiZXZ0IiwiYnViYmxlcyIsInN0b3BQcm9wYWdhdGlvbiIsIm9sZFZhbCIsInZhbHVlIiwic2V0IiwiZGF0YSIsImRpc3BhdGNoRXZlbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbGlkYXRpb24iLCJfdXBkYXRlVmFsaWRhdGlvbiIsImlkIiwiZW5hYmxlIiwiZGlzYWJsZSIsInNob3ciLCJoaWRlIiwidmFsaWRhdGUiLCJ2YWwiLCJQcm9taXNlIiwicmVzb2x2ZSIsInVzZURlZmF1bHQiLCJzZXRWYWx1ZSIsInZpZXciLCJmb2N1cyIsImVycm9ycyIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUOztBQUlBO0FBQUE7O0FBQ0UscUJBQTJCO0FBQUEsVUFBZkksUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QkgsS0FBN0M7QUFDQUUsZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQkgsSUFBM0M7O0FBRnlCLGdIQUluQkMsUUFKbUI7O0FBS3pCLFlBQUtHLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkMsSUFBcEIsT0FBdEI7O0FBRUEsWUFB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QUFDUixhQUFLRCxNQUFMLENBQVlTLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsSUFBNUI7QUFDRDtBQXhGSDtBQUFBO0FBQUEsa0NBMEZjO0FBQ1YsYUFBS1QsTUFBTCxDQUFZUyxHQUFaLENBQWdCLFVBQWhCLEVBQTRCLEtBQTVCO0FBQ0Q7QUE1Rkg7QUFBQTtBQUFBLDhCQThGVTtBQUNOLGFBQUtpQixJQUFMLEdBQVlDLEtBQVo7QUFDRDtBQWhHSDtBQUFBO0FBQUEsZ0NBa0dZQyxNQWxHWixFQWtHb0I7QUFDaEIsYUFBSzVCLE1BQUwsQ0FBWVMsR0FBWixDQUFnQixRQUFoQixFQUEwQm1CLE1BQTFCO0FBQ0EsYUFBSzVCLE1BQUwsQ0FBWVMsR0FBWixDQUFnQixTQUFoQixFQUEyQm1CLE9BQU9DLE1BQWxDO0FBQ0Q7QUFyR0g7O0FBQUE7QUFBQSxJQUEyQnhDLFNBQTNCO0FBdUdELENBNUdEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcblxuICByZXR1cm4gY2xhc3MgRmllbGQgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG5cbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIHRoaXMuX29uRmllbGRDaGFuZ2UgPSB0aGlzLl9vbkZpZWxkQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAgIHRoaXMuX3ZpZXcuJGRvbSgpLmFkZENsYXNzKHRoaXMuX21vZGVsLmdldCgnY2xhc3NlcycpLmpvaW4oJyAnKSk7XG4gICAgICB0aGlzLl92aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLlZhbHVlQ2hhbmdlJywgdGhpcy5fb25GaWVsZENoYW5nZSk7XG4gICAgfVxuXG4gICAgX29uRmllbGRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmJ1YmJsZXMpIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBvbGRWYWwgPSB0aGlzLl9tb2RlbC52YWx1ZSgpO1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCd2YWx1ZScsIGV2dC5kYXRhLnZhbHVlKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRmllbGQuQ2hhbmdlJywge1xuICAgICAgICBvbGRWYWx1ZTogb2xkVmFsLFxuICAgICAgICB2YWx1ZTogdGhpcy5fbW9kZWwudmFsdWUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB1cGRhdGVWYWxpZGF0aW9uKG5ld1ZhbGlkYXRpb24pIHtcbiAgICAgIHRoaXMuX21vZGVsLl91cGRhdGVWYWxpZGF0aW9uKG5ld1ZhbGlkYXRpb24pO1xuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG5cbiAgICBzZXRJZChpZCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdpZCcsIGlkKTtcbiAgICB9XG5cbiAgICBsYWJlbCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2xhYmVsJyk7XG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgdGhpcy5fbW9kZWwuZW5hYmxlKCk7XG4gICAgICBzdXBlci5lbmFibGUoKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy5fbW9kZWwuZGlzYWJsZSgpO1xuICAgICAgc3VwZXIuZGlzYWJsZSgpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLl92aWV3LnNob3coKTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy5fdmlldy5oaWRlKCk7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwudmFsaWRhdGUoKTtcbiAgICB9XG5cbiAgICB2YWx1ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC52YWx1ZSgpO1xuICAgIH1cblxuICAgIHNldFZhbHVlKHZhbCkge1xuICAgICAgY29uc3Qgb2xkVmFsID0gdGhpcy5fbW9kZWwudmFsdWUoKTtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgndmFsdWUnLCB2YWwpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5DaGFuZ2UnLCB7XG4gICAgICAgIG9sZFZhbHVlOiBvbGRWYWwsXG4gICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWwpO1xuICAgIH1cblxuICAgIGNsZWFyKHVzZURlZmF1bHQgPSB0cnVlKSB7XG4gICAgICBpZiAodXNlRGVmYXVsdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRWYWx1ZSh0aGlzLl9tb2RlbC5nZXQoJ2RlZmF1bHRWYWx1ZScpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFZhbHVlKG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldERlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnNldCgndmFsdWUnLCB0aGlzLl9tb2RlbC5nZXQoJ2RlZmF1bHRWYWx1ZScpKTtcbiAgICB9XG5cbiAgICByZXF1aXJlKCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdyZXF1aXJlZCcsIHRydWUpO1xuICAgIH1cblxuICAgIHVucmVxdWlyZSgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgncmVxdWlyZWQnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZm9jdXMoKSB7XG4gICAgICB0aGlzLnZpZXcoKS5mb2N1cygpO1xuICAgIH1cblxuICAgIHNldEVycm9ycyhlcnJvcnMpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnZXJyb3JzJywgZXJyb3JzKTtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnaXNWYWxpZCcsIGVycm9ycy5sZW5ndGgpO1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
