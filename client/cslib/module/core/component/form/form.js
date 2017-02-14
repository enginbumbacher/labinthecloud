'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this, settings));

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
      key: 'getField',
      value: function getField(fieldId) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this._model.getField()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var field = _step2.value;

            if (field.id() == fieldId) {
              return field;
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
        this._model.clear();
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
    }]);

    return Form;
  }(Component);

  Form.create = function (data) {
    return new Form({ modelData: data });
  };

  return Form;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxZQUFZLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFLE9BQU8sUUFBUSxRQUFSLENBRlQ7O0FBRGtCLE1BS1osSUFMWTtBQUFBOztBQU1oQixrQkFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCLGVBQVMsVUFBVCxHQUFzQixTQUFTLFVBQVQsSUFBdUIsS0FBN0M7QUFDQSxlQUFTLFNBQVQsR0FBcUIsU0FBUyxTQUFULElBQXNCLElBQTNDOztBQUZvQiwwRkFHZCxRQUhjOztBQUlwQixZQUFLLGVBQUwsR0FBdUIsTUFBSyxlQUFMLENBQXFCLElBQXJCLE9BQXZCO0FBQ0EsWUFBSyxnQkFBTCxHQUF3QixNQUFLLGdCQUFMLENBQXNCLElBQXRCLE9BQXhCOztBQUVBLFlBQUssTUFBTCxDQUFZLGdCQUFaLENBQTZCLG1CQUE3QixFQUFrRCxNQUFLLGVBQXZEO0FBQ0EsWUFBSyxLQUFMLENBQVcsZ0JBQVgsQ0FBNEIsb0JBQTVCLEVBQWtELE1BQUssZ0JBQXZEOztBQVJvQjtBQVVyQjs7QUFoQmU7QUFBQTtBQUFBLGlDQWtCTDtBQUNULGVBQU8sS0FBSyxNQUFMLENBQVksUUFBWixFQUFQO0FBQ0Q7QUFwQmU7QUFBQTtBQUFBLGdDQXNCUDtBQUNQLFlBQUksTUFBTSxFQUFWO0FBRE87QUFBQTtBQUFBOztBQUFBO0FBRVAsK0JBQWtCLEtBQUssTUFBTCxDQUFZLFNBQVosRUFBbEIsOEhBQTJDO0FBQUEsZ0JBQWxDLEtBQWtDOztBQUN6QyxnQkFBSSxNQUFNLEVBQU4sRUFBSixJQUFrQixNQUFNLEtBQU4sRUFBbEI7QUFDRDtBQUpNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBS1AsZUFBTyxHQUFQO0FBQ0Q7QUE1QmU7QUFBQTtBQUFBLCtCQThCUCxPQTlCTyxFQThCRTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNoQixnQ0FBa0IsS0FBSyxNQUFMLENBQVksUUFBWixFQUFsQixtSUFBMEM7QUFBQSxnQkFBakMsS0FBaUM7O0FBQ3hDLGdCQUFJLE1BQU0sRUFBTixNQUFjLE9BQWxCLEVBQTJCO0FBQ3pCLHFCQUFPLEtBQVA7QUFDRDtBQUNGO0FBTGU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFNaEIsZUFBTyxJQUFQO0FBQ0Q7QUFyQ2U7QUFBQTtBQUFBLCtCQXVDUCxLQXZDTyxFQXVDQSxXQXZDQSxFQXVDYTtBQUMzQixhQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLEtBQXJCLEVBQTRCLFdBQTVCO0FBQ0Q7QUF6Q2U7QUFBQTtBQUFBLGtDQTJDSixLQTNDSSxFQTJDRztBQUNqQixhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLEtBQXhCO0FBQ0Q7QUE3Q2U7QUFBQTtBQUFBLGdDQStDTixNQS9DTSxFQStDRTtBQUNoQixhQUFLLE1BQUwsQ0FBWSxTQUFaLENBQXNCLE1BQXRCO0FBQ0Q7QUFqRGU7QUFBQTtBQUFBLG1DQW1ESCxRQW5ERyxFQW1ETztBQUNyQixhQUFLLE1BQUwsQ0FBWSxZQUFaLENBQXlCLFFBQXpCO0FBQ0Q7QUFyRGU7QUFBQTtBQUFBLCtCQXVEUCxLQXZETyxFQXVEQTtBQUNkLGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsS0FBekI7QUFDRDtBQXpEZTtBQUFBO0FBQUEsNEJBMkRWLE9BM0RVLEVBMkREO0FBQ2IsYUFBSyxRQUFMLENBQWMsT0FBZCxFQUF1QixLQUF2QjtBQUNEO0FBN0RlO0FBQUE7QUFBQSxnQ0ErRE4sTUEvRE0sRUErREUsT0EvREYsRUErRFc7QUFDekIsWUFBSSxPQUFKLEVBQWE7QUFDWCxlQUFLLFFBQUwsQ0FBYyxPQUFkLEVBQXVCLFNBQXZCLENBQWlDLE1BQWpDO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBSyxNQUFMLENBQVksR0FBWixDQUFnQixRQUFoQixFQUEwQixNQUExQjtBQUNEO0FBQ0Y7QUFyRWU7QUFBQTtBQUFBLDhCQXVFUjtBQUNOLGFBQUssTUFBTCxDQUFZLEtBQVo7QUFDRDtBQXpFZTtBQUFBO0FBQUEsc0NBMkVBLEdBM0VBLEVBMkVLO0FBQ25CLGFBQUssYUFBTCxDQUFtQixHQUFuQjtBQUNEO0FBN0VlO0FBQUE7QUFBQSx1Q0ErRUMsR0EvRUQsRUErRU07QUFDcEIsWUFBSSxZQUFKO0FBQ0EsWUFBSSxNQUFNLEtBQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsUUFBdEIsQ0FBVixFQUEyQztBQUN6QyxjQUFJLE9BQUo7QUFDRDtBQUNGO0FBcEZlOztBQUFBO0FBQUEsSUFLQyxTQUxEOztBQXVGbEIsT0FBSyxNQUFMLEdBQWMsVUFBQyxJQUFELEVBQVU7QUFDdEIsV0FBTyxJQUFJLElBQUosQ0FBUyxFQUFFLFdBQVcsSUFBYixFQUFULENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU8sSUFBUDtBQUNELENBNUZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
