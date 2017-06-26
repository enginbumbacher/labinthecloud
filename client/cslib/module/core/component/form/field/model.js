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
      return _possibleConstructorReturn(this, (FieldModel.__proto__ || Object.getPrototypeOf(FieldModel)).call(this, config));
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
        if (Utils.exists(this.get('value'))) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiVmFsaWRhdGlvbiIsImRlZmF1bHRzIiwiaWQiLCJsYWJlbCIsInZhbHVlIiwiZGVmYXVsdFZhbHVlIiwiZGlzYWJsZWQiLCJyZXF1aXJlZCIsImhhc0Vycm9yIiwiZXJyb3JzIiwiY2xhc3NlcyIsInZhbGlkYXRpb24iLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImRhdGEiLCJ0ZXN0IiwiZXJyb3JNZXNzYWdlIiwic2V0IiwiZXhpc3RzIiwiZ2V0IiwidGVzdHMiLCJ2YWwiLCJzcGVjIiwidGVzdE5hbWUiLCJwdXNoIiwiUHJvbWlzZSIsInJlamVjdCIsImFsbCIsInRoZW4iLCJyZXN1bHRzIiwiaXNWYWxpZCIsInJlc3VsdCIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLGFBQWFILFFBQVEsc0JBQVIsQ0FGZjtBQUFBLE1BR0VJLFdBQVc7QUFDVEMsUUFBSSxJQURLO0FBRVRDLFdBQU8sRUFGRTtBQUdUQyxXQUFPLElBSEU7QUFJVEMsa0JBQWMsSUFKTDtBQUtUQyxjQUFVLEtBTEQ7QUFNVEMsY0FBVSxLQU5EO0FBT1RDLGNBQVUsS0FQRDtBQVFUQyxZQUFRLEVBUkM7QUFTVEMsYUFBUyxFQVRBO0FBVVRDLGdCQUFZO0FBVkgsR0FIYjs7QUFnQkE7QUFBQTs7QUFDRSx3QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT1gsUUFBUCxHQUFrQkYsTUFBTWMsY0FBTixDQUFxQkQsT0FBT1gsUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBQ0FXLGFBQU9FLElBQVAsQ0FBWUgsVUFBWixHQUF5QkMsT0FBT0UsSUFBUCxDQUFZSCxVQUFaLElBQTBCLEVBQW5EO0FBQ0EsVUFBSUMsT0FBT0UsSUFBUCxDQUFZUCxRQUFoQixFQUEwQjtBQUN4QkssZUFBT0UsSUFBUCxDQUFZSCxVQUFaLENBQXVCSixRQUF2QixHQUFrQztBQUNoQ1EsZ0JBQU0sUUFEMEI7QUFFaENDLHdCQUFpQkosT0FBT0UsSUFBUCxDQUFZWCxLQUE3QjtBQUZnQyxTQUFsQztBQUlEO0FBUmlCLHFIQVNaUyxNQVRZO0FBVW5COztBQVhIO0FBQUE7QUFBQSwrQkFhVztBQUNQLGFBQUtLLEdBQUwsQ0FBUyxVQUFULEVBQXFCLEtBQXJCO0FBQ0Q7QUFmSDtBQUFBO0FBQUEsZ0NBaUJZO0FBQ1IsYUFBS0EsR0FBTCxDQUFTLFVBQVQsRUFBcUIsSUFBckI7QUFDRDtBQW5CSDtBQUFBO0FBQUEsOEJBcUJVO0FBQ04sWUFBSWxCLE1BQU1tQixNQUFOLENBQWEsS0FBS0MsR0FBTCxDQUFTLE9BQVQsQ0FBYixDQUFKLEVBQXFDO0FBQ25DLGlCQUFPLEtBQUtBLEdBQUwsQ0FBUyxPQUFULENBQVA7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBTyxLQUFLQSxHQUFMLENBQVMsY0FBVCxDQUFQO0FBQ0Q7QUFDRjtBQTNCSDtBQUFBO0FBQUEsaUNBNkJhO0FBQUE7O0FBQ1QsWUFBSUMsUUFBUSxFQUFaO0FBQ0EsWUFBSUMsTUFBTSxLQUFLakIsS0FBTCxFQUFWO0FBQ0EsYUFBSyxJQUFJVyxJQUFULElBQWlCLEtBQUtJLEdBQUwsQ0FBUyxZQUFULENBQWpCLEVBQXlDO0FBQ3ZDLGNBQUlHLE9BQU8sS0FBS0gsR0FBTCxpQkFBdUJKLElBQXZCLENBQVg7QUFDQSxjQUFJUSxXQUFXRCxLQUFLUCxJQUFMLElBQWFBLElBQTVCO0FBQ0EsY0FBSWYsV0FBV3VCLFFBQVgsQ0FBSixFQUEwQjtBQUN4Qkgsa0JBQU1JLElBQU4sQ0FBV3hCLFdBQVd1QixRQUFYLEVBQXFCRixHQUFyQixFQUEwQkMsSUFBMUIsQ0FBWDtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPRyxRQUFRQyxNQUFSLGtCQUE4QkgsUUFBOUIsMkJBQVA7QUFDRDtBQUNGO0FBQ0QsZUFBT0UsUUFBUUUsR0FBUixDQUFZUCxLQUFaLEVBQW1CUSxJQUFuQixDQUF3QixVQUFDQyxPQUFELEVBQWE7QUFDMUMsY0FBSUMsVUFBVSxJQUFkO0FBQ0EsY0FBSXJCLFNBQVMsRUFBYjtBQUYwQztBQUFBO0FBQUE7O0FBQUE7QUFHMUMsaUNBQW1Cb0IsT0FBbkIsOEhBQTRCO0FBQUEsa0JBQW5CRSxNQUFtQjs7QUFDMUIsa0JBQUksQ0FBQ0EsT0FBT0QsT0FBWixFQUFxQjtBQUNuQkEsMEJBQVUsS0FBVjtBQUNEO0FBQ0Qsa0JBQUlDLE9BQU9DLEtBQVgsRUFBa0I7QUFDaEJ2Qix1QkFBT2UsSUFBUCxDQUFZTyxPQUFPQyxLQUFuQjtBQUNEO0FBQ0Y7QUFWeUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFXMUMsaUJBQUtmLEdBQUwsQ0FBUyxRQUFULEVBQW1CUixNQUFuQjtBQUNBLGlCQUFLUSxHQUFMLENBQVMsU0FBVCxFQUFvQmEsT0FBcEI7O0FBRUEsaUJBQU87QUFDTDVCLGdCQUFJLE9BQUtpQixHQUFMLENBQVMsSUFBVCxDQURDO0FBRUxXLHFCQUFTQSxPQUZKO0FBR0xyQixvQkFBUUE7QUFISCxXQUFQO0FBS0QsU0FuQk0sQ0FBUDtBQW9CRDtBQTdESDs7QUFBQTtBQUFBLElBQWdDWCxLQUFoQztBQStERCxDQWhGRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
