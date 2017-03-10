'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      Validation = require('core/util/validation'),
      defaults = {
    id: null,
    label: '',
    value: null,
    defaultValue: null,
    disabled: false,
    required: false,
    hasError: false,
    errors: [],
    classes: [],
    validation: null
  };

  return function (_Model) {
    _inherits(FieldModel, _Model);

    function FieldModel(config) {
      _classCallCheck(this, FieldModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      config.data.validation = config.data.validation || {};
      if (config.data.required) {
        config.data.validation.required = {
          test: "exists",
          errorMessage: config.data.label + ' required.'
        };
      }
      return _possibleConstructorReturn(this, Object.getPrototypeOf(FieldModel).call(this, config));
    }

    _createClass(FieldModel, [{
      key: 'enable',
      value: function enable() {
        this.set('disabled', false);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.set('disabled', true);
      }
    }, {
      key: 'value',
      value: function value() {
        if (this.get('value')) {
          return this.get('value');
        } else {
          return this.get('defaultValue');
        }
      }
    }, {
      key: 'validate',
      value: function validate() {
        var _this2 = this;

        var tests = [];
        var val = this.value();
        for (var test in this.get('validation')) {
          var spec = this.get('validation.' + test);
          var testName = spec.test || test;
          if (Validation[testName]) {
            tests.push(Validation[testName](val, spec));
          } else {
            return Promise.reject('Validation "' + testName + '" could not be found.');
          }
        }
        return Promise.all(tests).then(function (results) {
          var isValid = true;
          var errors = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var result = _step.value;

              if (!result.isValid) {
                isValid = false;
              }
              if (result.error) {
                errors.push(result.error);
              }
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

          _this2.set('errors', errors);
          _this2.set('isValid', isValid);

          return {
            id: _this2.get('id'),
            isValid: isValid,
            errors: errors
          };
        });
      }
    }]);

    return FieldModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sUUFBUSxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxhQUFhLFFBQVEsc0JBQVIsQ0FGZjtBQUFBLE1BR0UsV0FBVztBQUNULFFBQUksSUFESztBQUVULFdBQU8sRUFGRTtBQUdULFdBQU8sSUFIRTtBQUlULGtCQUFjLElBSkw7QUFLVCxjQUFVLEtBTEQ7QUFNVCxjQUFVLEtBTkQ7QUFPVCxjQUFVLEtBUEQ7QUFRVCxZQUFRLEVBUkM7QUFTVCxhQUFTLEVBVEE7QUFVVCxnQkFBWTtBQVZILEdBSGI7O0FBZ0JBO0FBQUE7O0FBQ0Usd0JBQVksTUFBWixFQUFvQjtBQUFBOztBQUNsQixhQUFPLFFBQVAsR0FBa0IsTUFBTSxjQUFOLENBQXFCLE9BQU8sUUFBNUIsRUFBc0MsUUFBdEMsQ0FBbEI7QUFDQSxhQUFPLElBQVAsQ0FBWSxVQUFaLEdBQXlCLE9BQU8sSUFBUCxDQUFZLFVBQVosSUFBMEIsRUFBbkQ7QUFDQSxVQUFJLE9BQU8sSUFBUCxDQUFZLFFBQWhCLEVBQTBCO0FBQ3hCLGVBQU8sSUFBUCxDQUFZLFVBQVosQ0FBdUIsUUFBdkIsR0FBa0M7QUFDaEMsZ0JBQU0sUUFEMEI7QUFFaEMsd0JBQWlCLE9BQU8sSUFBUCxDQUFZLEtBQTdCO0FBRmdDLFNBQWxDO0FBSUQ7QUFSaUIsMkZBU1osTUFUWTtBQVVuQjs7QUFYSDtBQUFBO0FBQUEsK0JBYVc7QUFDUCxhQUFLLEdBQUwsQ0FBUyxVQUFULEVBQXFCLEtBQXJCO0FBQ0Q7QUFmSDtBQUFBO0FBQUEsZ0NBaUJZO0FBQ1IsYUFBSyxHQUFMLENBQVMsVUFBVCxFQUFxQixJQUFyQjtBQUNEO0FBbkJIO0FBQUE7QUFBQSw4QkFxQlU7QUFDTixZQUFJLEtBQUssR0FBTCxDQUFTLE9BQVQsQ0FBSixFQUF1QjtBQUNyQixpQkFBTyxLQUFLLEdBQUwsQ0FBUyxPQUFULENBQVA7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBTyxLQUFLLEdBQUwsQ0FBUyxjQUFULENBQVA7QUFDRDtBQUNGO0FBM0JIO0FBQUE7QUFBQSxpQ0E2QmE7QUFBQTs7QUFDVCxZQUFJLFFBQVEsRUFBWjtBQUNBLFlBQUksTUFBTSxLQUFLLEtBQUwsRUFBVjtBQUNBLGFBQUssSUFBSSxJQUFULElBQWlCLEtBQUssR0FBTCxDQUFTLFlBQVQsQ0FBakIsRUFBeUM7QUFDdkMsY0FBSSxPQUFPLEtBQUssR0FBTCxpQkFBdUIsSUFBdkIsQ0FBWDtBQUNBLGNBQUksV0FBVyxLQUFLLElBQUwsSUFBYSxJQUE1QjtBQUNBLGNBQUksV0FBVyxRQUFYLENBQUosRUFBMEI7QUFDeEIsa0JBQU0sSUFBTixDQUFXLFdBQVcsUUFBWCxFQUFxQixHQUFyQixFQUEwQixJQUExQixDQUFYO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsbUJBQU8sUUFBUSxNQUFSLGtCQUE4QixRQUE5QiwyQkFBUDtBQUNEO0FBQ0Y7QUFDRCxlQUFPLFFBQVEsR0FBUixDQUFZLEtBQVosRUFBbUIsSUFBbkIsQ0FBd0IsVUFBQyxPQUFELEVBQWE7QUFDMUMsY0FBSSxVQUFVLElBQWQ7QUFDQSxjQUFJLFNBQVMsRUFBYjtBQUYwQztBQUFBO0FBQUE7O0FBQUE7QUFHMUMsaUNBQW1CLE9BQW5CLDhIQUE0QjtBQUFBLGtCQUFuQixNQUFtQjs7QUFDMUIsa0JBQUksQ0FBQyxPQUFPLE9BQVosRUFBcUI7QUFDbkIsMEJBQVUsS0FBVjtBQUNEO0FBQ0Qsa0JBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2hCLHVCQUFPLElBQVAsQ0FBWSxPQUFPLEtBQW5CO0FBQ0Q7QUFDRjtBQVZ5QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVcxQyxpQkFBSyxHQUFMLENBQVMsUUFBVCxFQUFtQixNQUFuQjtBQUNBLGlCQUFLLEdBQUwsQ0FBUyxTQUFULEVBQW9CLE9BQXBCOztBQUVBLGlCQUFPO0FBQ0wsZ0JBQUksT0FBSyxHQUFMLENBQVMsSUFBVCxDQURDO0FBRUwscUJBQVMsT0FGSjtBQUdMLG9CQUFRO0FBSEgsV0FBUDtBQUtELFNBbkJNLENBQVA7QUFvQkQ7QUE3REg7O0FBQUE7QUFBQSxJQUFnQyxLQUFoQztBQStERCxDQWhGRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
