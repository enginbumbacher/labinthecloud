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
    }]);

    return Form;
  }(Component);

  Form.create = function (data) {
    return new Form({ modelData: data });
  };

  return Form;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0uanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIkZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJfb25GaWVsZENoYW5nZWQiLCJiaW5kIiwiX29uU3VibWl0UmVxdWVzdCIsIl9tb2RlbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfdmlldyIsInZhbGlkYXRlIiwiZXhwIiwiZ2V0RmllbGRzIiwiZmllbGQiLCJpZCIsInZhbHVlIiwiZGF0YSIsImNsZWFyIiwidGhlbiIsInVuZGVmaW5lZCIsInNldFZhbHVlIiwiZmllbGRJZCIsImRlc3RpbmF0aW9uIiwiYWRkRmllbGQiLCJyZW1vdmVGaWVsZCIsImJ1dHRvbiIsImFkZEJ1dHRvbiIsImJ1dHRvbklkIiwicmVtb3ZlQnV0dG9uIiwiZ2V0QnV0dG9uIiwidGl0bGUiLCJzZXQiLCJnZXRGaWVsZCIsImZvY3VzIiwiZXJyb3JzIiwic2V0RXJyb3JzIiwiZXZ0IiwiZGlzcGF0Y2hFdmVudCIsImJ0biIsInRyaWdnZXIiLCJkaXNhYmxlIiwiZW5hYmxlIiwiaGlkZSIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUOztBQURrQixNQUtaSSxJQUxZO0FBQUE7O0FBTWhCLGtCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSixLQUE3QztBQUNBRyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCSixJQUEzQzs7QUFGb0IsOEdBR2RFLFFB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LEdBRkQ7O0FBSUEsU0FBT2hCLElBQVA7QUFDRCxDQTFIRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcblxuICBjbGFzcyBGb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIHRoaXMuX29uRmllbGRDaGFuZ2VkID0gdGhpcy5fb25GaWVsZENoYW5nZWQuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uU3VibWl0UmVxdWVzdCA9IHRoaXMuX29uU3VibWl0UmVxdWVzdC5iaW5kKHRoaXMpO1xuXG4gICAgICB0aGlzLl9tb2RlbC5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uRmllbGRDaGFuZ2VkKTtcbiAgICAgIHRoaXMuX3ZpZXcuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5TdWJtaXRSZXF1ZXN0JywgdGhpcy5fb25TdWJtaXRSZXF1ZXN0KTtcbiAgICAgIC8vIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoXCIqXCIsIHRoaXMuX29uRXZlbnQpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLnZhbGlkYXRlKCk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgbGV0IGV4cCA9IHt9O1xuICAgICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5fbW9kZWwuZ2V0RmllbGRzKCkpIHtcbiAgICAgICAgZXhwW2ZpZWxkLmlkKCldID0gZmllbGQudmFsdWUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBleHA7XG4gICAgfVxuXG4gICAgaW1wb3J0KGRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuX21vZGVsLmdldEZpZWxkcygpKSB7XG4gICAgICAgICAgaWYgKGRhdGFbZmllbGQuaWQoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmllbGQuc2V0VmFsdWUoZGF0YVtmaWVsZC5pZCgpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGdldEZpZWxkKGZpZWxkSWQpIHtcbiAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuX21vZGVsLmdldEZpZWxkcygpKSB7XG4gICAgICAgIGlmIChmaWVsZC5pZCgpID09IGZpZWxkSWQpIHtcbiAgICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFkZEZpZWxkKGZpZWxkLCBkZXN0aW5hdGlvbikge1xuICAgICAgdGhpcy5fbW9kZWwuYWRkRmllbGQoZmllbGQsIGRlc3RpbmF0aW9uKTtcbiAgICB9XG5cbiAgICByZW1vdmVGaWVsZChmaWVsZCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVtb3ZlRmllbGQoZmllbGQpO1xuICAgIH1cblxuICAgIGFkZEJ1dHRvbihidXR0b24pIHtcbiAgICAgIHRoaXMuX21vZGVsLmFkZEJ1dHRvbihidXR0b24pO1xuICAgIH1cblxuICAgIHJlbW92ZUJ1dHRvbihidXR0b25JZCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVtb3ZlQnV0dG9uKGJ1dHRvbklkKTtcbiAgICB9XG5cbiAgICBnZXRCdXR0b24oYnV0dG9uSWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXRCdXR0b24oYnV0dG9uSWQpO1xuICAgIH1cblxuICAgIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ3RpdGxlJywgdGl0bGUpO1xuICAgIH1cblxuICAgIGZvY3VzKGZpZWxkSWQpIHtcbiAgICAgIHRoaXMuZ2V0RmllbGQoZmllbGRJZCkuZm9jdXMoKVxuICAgIH1cblxuICAgIHNldEVycm9ycyhlcnJvcnMsIGZpZWxkSWQpIHtcbiAgICAgIGlmIChmaWVsZElkKSB7XG4gICAgICAgIHRoaXMuZ2V0RmllbGQoZmllbGRJZCkuc2V0RXJyb3JzKGVycm9ycylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnNldCgnZXJyb3JzJywgZXJyb3JzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5jbGVhcigpO1xuICAgIH1cblxuICAgIF9vbkZpZWxkQ2hhbmdlZChldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgIH1cblxuICAgIF9vblN1Ym1pdFJlcXVlc3QoZXZ0KSB7XG4gICAgICBsZXQgYnRuO1xuICAgICAgaWYgKGJ0biA9IHRoaXMuX21vZGVsLmdldEJ1dHRvbignc3VibWl0JykpIHtcbiAgICAgICAgYnRuLnRyaWdnZXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy5fbW9kZWwuZGlzYWJsZSgpO1xuICAgICAgc3VwZXIuZGlzYWJsZSgpO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuX21vZGVsLmVuYWJsZSgpO1xuICAgICAgc3VwZXIuZW5hYmxlKCk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMuX21vZGVsLmhpZGUoKTtcbiAgICAgIHN1cGVyLmhpZGUoKTtcbiAgICB9XG5cbiAgfVxuXG4gIEZvcm0uY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IEZvcm0oeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEZvcm07XG59KTtcbiJdfQ==
