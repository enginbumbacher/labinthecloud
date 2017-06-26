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
    }]);

    return Form;
  }(Component);

  Form.create = function (data) {
    return new Form({ modelData: data });
  };

  return Form;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0uanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIkZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJfb25GaWVsZENoYW5nZWQiLCJiaW5kIiwiX29uU3VibWl0UmVxdWVzdCIsIl9tb2RlbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfdmlldyIsInZhbGlkYXRlIiwiZXhwIiwiZ2V0RmllbGRzIiwiZmllbGQiLCJpZCIsInZhbHVlIiwiZGF0YSIsImNsZWFyIiwidGhlbiIsInVuZGVmaW5lZCIsInNldFZhbHVlIiwiZmllbGRJZCIsImRlc3RpbmF0aW9uIiwiYWRkRmllbGQiLCJyZW1vdmVGaWVsZCIsImJ1dHRvbiIsImFkZEJ1dHRvbiIsImJ1dHRvbklkIiwicmVtb3ZlQnV0dG9uIiwiZ2V0QnV0dG9uIiwidGl0bGUiLCJzZXQiLCJnZXRGaWVsZCIsImZvY3VzIiwiZXJyb3JzIiwic2V0RXJyb3JzIiwiZXZ0IiwiZGlzcGF0Y2hFdmVudCIsImJ0biIsInRyaWdnZXIiLCJkaXNhYmxlIiwiZW5hYmxlIiwiY3JlYXRlIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7O0FBRGtCLE1BS1pJLElBTFk7QUFBQTs7QUFNaEIsa0JBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFDcEJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJKLEtBQTdDO0FBQ0FHLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JKLElBQTNDOztBQUZvQiw4R0FHZEUsUUFIYzs7QUFJ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
