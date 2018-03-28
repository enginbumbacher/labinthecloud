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

  var Form = function (_Component) {
    _inherits(Form, _Component);

    function Form(settings) {
      _classCallCheck(this, Form);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, settings));

      _this._onFieldChanged = _this._onFieldChanged.bind(_this);
      _this._onSubmitRequest = _this._onSubmitRequest.bind(_this);

      _this._model.addEventListener('Form.FieldChanged', _this._onFieldChanged);
      _this._view.addEventListener('Form.SubmitRequest', _this._onSubmitRequest);
      // this.view().addEventListener("*", this._onEvent);
      return _this;
    }

    _createClass(Form, [{
      key: 'validate',
      value: function validate() {
        return this._model.validate();
      }
    }, {
      key: 'export',
      value: function _export() {
        var exp = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this._model.getFields()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var field = _step.value;

            exp[field.id()] = field.value();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return exp;
      }
    }, {
      key: 'import',
      value: function _import(data) {
        var _this2 = this;

        return this.clear().then(function () {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = _this2._model.getFields()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var field = _step2.value;

              if (data[field.id()] !== undefined) {
                field.setValue(data[field.id()]);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        });
      }
    }, {
      key: 'getField',
      value: function getField(fieldId) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this._model.getFields()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var field = _step3.value;

            if (field.id() == fieldId) {
              return field;
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return null;
      }
    }, {
      key: 'addField',
      value: function addField(field, destination) {
        this._model.addField(field, destination);
      }
    }, {
      key: 'removeField',
      value: function removeField(field) {
        this._model.removeField(field);
      }
    }, {
      key: 'addButton',
      value: function addButton(button) {
        this._model.addButton(button);
      }
    }, {
      key: 'removeButton',
      value: function removeButton(buttonId) {
        this._model.removeButton(buttonId);
      }
    }, {
      key: 'getButton',
      value: function getButton(buttonId) {
        return this._model.getButton(buttonId);
      }
    }, {
      key: 'setTitle',
      value: function setTitle(title) {
        this._model.set('title', title);
      }
    }, {
      key: 'focus',
      value: function focus(fieldId) {
        this.getField(fieldId).focus();
      }
    }, {
      key: 'setErrors',
      value: function setErrors(errors, fieldId) {
        if (fieldId) {
          this.getField(fieldId).setErrors(errors);
        } else {
          this._model.set('errors', errors);
        }
      }
    }, {
      key: 'clear',
      value: function clear() {
        return this._model.clear();
      }
    }, {
      key: '_onFieldChanged',
      value: function _onFieldChanged(evt) {
        this.dispatchEvent(evt);
      }
    }, {
      key: '_onSubmitRequest',
      value: function _onSubmitRequest(evt) {
        var btn = void 0;
        if (btn = this._model.getButton('submit')) {
          btn.trigger();
        }
      }
    }, {
      key: 'disable',
      value: function disable() {
        this._model.disable();
        _get(Form.prototype.__proto__ || Object.getPrototypeOf(Form.prototype), 'disable', this).call(this);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this._model.enable();
        _get(Form.prototype.__proto__ || Object.getPrototypeOf(Form.prototype), 'enable', this).call(this);
      }
    }, {
      key: 'hide',
      value: function hide() {
        this._model.hide();
        _get(Form.prototype.__proto__ || Object.getPrototypeOf(Form.prototype), 'hide', this).call(this);
      }
    }, {
      key: 'hideFields',
      value: function hideFields() {
        this._model.hideFields();
        _get(Form.prototype.__proto__ || Object.getPrototypeOf(Form.prototype), 'hide', this).call(this);
      }
    }, {
      key: 'disableFields',
      value: function disableFields() {
        this._model.disableFields();
        _get(Form.prototype.__proto__ || Object.getPrototypeOf(Form.prototype), 'disable', this).call(this);
      }
    }, {
      key: 'partiallyDisableFields',
      value: function partiallyDisableFields(exceptions) {
        this._model.partiallyDisableFields(exceptions);
        _get(Form.prototype.__proto__ || Object.getPrototypeOf(Form.prototype), 'disable', this).call(this);
      }
    }]);

    return Form;
  }(Component);

  Form.create = function (data) {
    return new Form({ modelData: data });
  };

  return Form;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0uanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIkZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJfb25GaWVsZENoYW5nZWQiLCJiaW5kIiwiX29uU3VibWl0UmVxdWVzdCIsIl9tb2RlbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfdmlldyIsInZhbGlkYXRlIiwiZXhwIiwiZ2V0RmllbGRzIiwiZmllbGQiLCJpZCIsInZhbHVlIiwiZGF0YSIsImNsZWFyIiwidGhlbiIsInVuZGVmaW5lZCIsInNldFZhbHVlIiwiZmllbGRJZCIsImRlc3RpbmF0aW9uIiwiYWRkRmllbGQiLCJyZW1vdmVGaWVsZCIsImJ1dHRvbiIsImFkZEJ1dHRvbiIsImJ1dHRvbklkIiwicmVtb3ZlQnV0dG9uIiwiZ2V0QnV0dG9uIiwidGl0bGUiLCJzZXQiLCJnZXRGaWVsZCIsImZvY3VzIiwiZXJyb3JzIiwic2V0RXJyb3JzIiwiZXZ0IiwiZGlzcGF0Y2hFdmVudCIsImJ0biIsInRyaWdnZXIiLCJkaXNhYmxlIiwiZW5hYmxlIiwiaGlkZSIsImhpZGVGaWVsZHMiLCJkaXNhYmxlRmllbGRzIiwiZXhjZXB0aW9ucyIsInBhcnRpYWxseURpc2FibGVGaWVsZHMiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDs7QUFEa0IsTUFLWkksSUFMWTtBQUFBOztBQU1oQixrQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUNwQkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QkosS0FB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ZTtBQUFBO0FBQUEsc0NBd0hBO0FBQ2QsYUFBS3BDLE1BQUwsQ0FBWXFDLGFBQVo7QUFDQTtBQUNEO0FBM0hlO0FBQUE7QUFBQSw2Q0E2SE9DLFVBN0hQLEVBNkhtQjtBQUNqQyxhQUFLdEMsTUFBTCxDQUFZdUMsc0JBQVosQ0FBbUNELFVBQW5DO0FBQ0E7QUFDRDtBQWhJZTs7QUFBQTtBQUFBLElBS0NoRCxTQUxEOztBQW9JbEJHLE9BQUsrQyxNQUFMLEdBQWMsVUFBQy9CLElBQUQsRUFBVTtBQUN0QixXQUFPLElBQUloQixJQUFKLENBQVMsRUFBRWdELFdBQVdoQyxJQUFiLEVBQVQsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT2hCLElBQVA7QUFDRCxDQXpJRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcblxuICBjbGFzcyBGb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIHRoaXMuX29uRmllbGRDaGFuZ2VkID0gdGhpcy5fb25GaWVsZENoYW5nZWQuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uU3VibWl0UmVxdWVzdCA9IHRoaXMuX29uU3VibWl0UmVxdWVzdC5iaW5kKHRoaXMpO1xuXG4gICAgICB0aGlzLl9tb2RlbC5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uRmllbGRDaGFuZ2VkKTtcbiAgICAgIHRoaXMuX3ZpZXcuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5TdWJtaXRSZXF1ZXN0JywgdGhpcy5fb25TdWJtaXRSZXF1ZXN0KTtcbiAgICAgIC8vIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoXCIqXCIsIHRoaXMuX29uRXZlbnQpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLnZhbGlkYXRlKCk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgbGV0IGV4cCA9IHt9O1xuICAgICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5fbW9kZWwuZ2V0RmllbGRzKCkpIHtcbiAgICAgICAgZXhwW2ZpZWxkLmlkKCldID0gZmllbGQudmFsdWUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBleHA7XG4gICAgfVxuXG4gICAgaW1wb3J0KGRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuX21vZGVsLmdldEZpZWxkcygpKSB7XG4gICAgICAgICAgaWYgKGRhdGFbZmllbGQuaWQoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmllbGQuc2V0VmFsdWUoZGF0YVtmaWVsZC5pZCgpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGdldEZpZWxkKGZpZWxkSWQpIHtcbiAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuX21vZGVsLmdldEZpZWxkcygpKSB7XG4gICAgICAgIGlmIChmaWVsZC5pZCgpID09IGZpZWxkSWQpIHtcbiAgICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFkZEZpZWxkKGZpZWxkLCBkZXN0aW5hdGlvbikge1xuICAgICAgdGhpcy5fbW9kZWwuYWRkRmllbGQoZmllbGQsIGRlc3RpbmF0aW9uKTtcbiAgICB9XG5cbiAgICByZW1vdmVGaWVsZChmaWVsZCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVtb3ZlRmllbGQoZmllbGQpO1xuICAgIH1cblxuICAgIGFkZEJ1dHRvbihidXR0b24pIHtcbiAgICAgIHRoaXMuX21vZGVsLmFkZEJ1dHRvbihidXR0b24pO1xuICAgIH1cblxuICAgIHJlbW92ZUJ1dHRvbihidXR0b25JZCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVtb3ZlQnV0dG9uKGJ1dHRvbklkKTtcbiAgICB9XG5cbiAgICBnZXRCdXR0b24oYnV0dG9uSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXRCdXR0b24oYnV0dG9uSWQpO1xuICAgIH1cblxuICAgIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ3RpdGxlJywgdGl0bGUpO1xuICAgIH1cblxuICAgIGZvY3VzKGZpZWxkSWQpIHtcbiAgICAgIHRoaXMuZ2V0RmllbGQoZmllbGRJZCkuZm9jdXMoKVxuICAgIH1cblxuICAgIHNldEVycm9ycyhlcnJvcnMsIGZpZWxkSWQpIHtcbiAgICAgIGlmIChmaWVsZElkKSB7XG4gICAgICAgIHRoaXMuZ2V0RmllbGQoZmllbGRJZCkuc2V0RXJyb3JzKGVycm9ycylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnNldCgnZXJyb3JzJywgZXJyb3JzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5jbGVhcigpO1xuICAgIH1cblxuICAgIF9vbkZpZWxkQ2hhbmdlZChldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgIH1cblxuICAgIF9vblN1Ym1pdFJlcXVlc3QoZXZ0KSB7XG4gICAgICBsZXQgYnRuO1xuICAgICAgaWYgKGJ0biA9IHRoaXMuX21vZGVsLmdldEJ1dHRvbignc3VibWl0JykpIHtcbiAgICAgICAgYnRuLnRyaWdnZXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy5fbW9kZWwuZGlzYWJsZSgpO1xuICAgICAgc3VwZXIuZGlzYWJsZSgpO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuX21vZGVsLmVuYWJsZSgpO1xuICAgICAgc3VwZXIuZW5hYmxlKCk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMuX21vZGVsLmhpZGUoKTtcbiAgICAgIHN1cGVyLmhpZGUoKTtcbiAgICB9XG5cbiAgICBoaWRlRmllbGRzKCkge1xuICAgICAgdGhpcy5fbW9kZWwuaGlkZUZpZWxkcygpO1xuICAgICAgc3VwZXIuaGlkZSgpO1xuICAgIH1cblxuICAgIGRpc2FibGVGaWVsZHMoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5kaXNhYmxlRmllbGRzKCk7XG4gICAgICBzdXBlci5kaXNhYmxlKCk7XG4gICAgfVxuXG4gICAgcGFydGlhbGx5RGlzYWJsZUZpZWxkcyhleGNlcHRpb25zKSB7XG4gICAgICB0aGlzLl9tb2RlbC5wYXJ0aWFsbHlEaXNhYmxlRmllbGRzKGV4Y2VwdGlvbnMpO1xuICAgICAgc3VwZXIuZGlzYWJsZSgpO1xuICAgIH1cblxuICB9XG5cbiAgRm9ybS5jcmVhdGUgPSAoZGF0YSkgPT4ge1xuICAgIHJldHVybiBuZXcgRm9ybSh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfTtcblxuICByZXR1cm4gRm9ybTtcbn0pO1xuIl19
