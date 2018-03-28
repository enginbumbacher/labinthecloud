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
      key: '_updateValidation',
      value: function _updateValidation(newValidation) {
        this.set('validation', newValidation);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiVmFsaWRhdGlvbiIsImRlZmF1bHRzIiwiaWQiLCJsYWJlbCIsInZhbHVlIiwiZGVmYXVsdFZhbHVlIiwiZGlzYWJsZWQiLCJyZXF1aXJlZCIsImhhc0Vycm9yIiwiZXJyb3JzIiwiY2xhc3NlcyIsInZhbGlkYXRpb24iLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImRhdGEiLCJ0ZXN0IiwiZXJyb3JNZXNzYWdlIiwic2V0IiwiZXhpc3RzIiwiZ2V0IiwibmV3VmFsaWRhdGlvbiIsInRlc3RzIiwidmFsIiwic3BlYyIsInRlc3ROYW1lIiwicHVzaCIsIlByb21pc2UiLCJyZWplY3QiLCJhbGwiLCJ0aGVuIiwicmVzdWx0cyIsImlzVmFsaWQiLCJyZXN1bHQiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxhQUFhSCxRQUFRLHNCQUFSLENBRmY7QUFBQSxNQUdFSSxXQUFXO0FBQ1RDLFFBQUksSUFESztBQUVUQyxXQUFPLEVBRkU7QUFHVEMsV0FBTyxJQUhFO0FBSVRDLGtCQUFjLElBSkw7QUFLVEMsY0FBVSxLQUxEO0FBTVRDLGNBQVUsS0FORDtBQU9UQyxjQUFVLEtBUEQ7QUFRVEMsWUFBUSxFQVJDO0FBU1RDLGFBQVMsRUFUQTtBQVVUQyxnQkFBWTtBQVZILEdBSGI7O0FBZ0JBO0FBQUE7O0FBQ0Usd0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEJBLGFBQU9YLFFBQVAsR0FBa0JGLE1BQU1jLGNBQU4sQ0FBcUJELE9BQU9YLFFBQTVCLEVBQXNDQSxRQUF0QyxDQUFsQjtBQUNBVyxhQUFPRSxJQUFQLENBQVlILFVBQVosR0FBeUJDLE9BQU9FLElBQVAsQ0FBWUgsVUFBWixJQUEwQixFQUFuRDtBQUNBLFVBQUlDLE9BQU9FLElBQVAsQ0FBWVAsUUFBaEIsRUFBMEI7QUFDeEJLLGVBQU9FLElBQVAsQ0FBWUgsVUFBWixDQUF1QkosUUFBdkIsR0FBa0M7QUFDaENRLGdCQUFNLFFBRDBCO0FBRWhDQyx3QkFBaUJKLE9BQU9FLElBQVAsQ0FBWVgsS0FBN0I7QUFGZ0MsU0FBbEM7QUFJRDtBQVJpQixxSEFTWlMsTUFUWTtBQVVuQjs7QUFYSDtBQUFBO0FBQUEsK0JBYVc7QUFDUCxhQUFLSyxHQUFMLENBQVMsVUFBVCxFQUFxQixLQUFyQjtBQUNEO0FBZkg7QUFBQTtBQUFBLGdDQWlCWTtBQUNSLGFBQUtBLEdBQUwsQ0FBUyxVQUFULEVBQXFCLElBQXJCO0FBQ0Q7QUFuQkg7QUFBQTtBQUFBLDhCQXFCVTtBQUNOLFlBQUlsQixNQUFNbUIsTUFBTixDQUFhLEtBQUtDLEdBQUwsQ0FBUyxPQUFULENBQWIsQ0FBSixFQUFxQztBQUNuQyxpQkFBTyxLQUFLQSxHQUFMLENBQVMsT0FBVCxDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsaUJBQU8sS0FBS0EsR0FBTCxDQUFTLGNBQVQsQ0FBUDtBQUNEO0FBQ0Y7QUEzQkg7QUFBQTtBQUFBLHdDQTZCb0JDLGFBN0JwQixFQTZCbUM7QUFDL0IsYUFBS0gsR0FBTCxDQUFTLFlBQVQsRUFBc0JHLGFBQXRCO0FBQ0Q7QUEvQkg7QUFBQTtBQUFBLGlDQWlDYTtBQUFBOztBQUNULFlBQUlDLFFBQVEsRUFBWjtBQUNBLFlBQUlDLE1BQU0sS0FBS2xCLEtBQUwsRUFBVjtBQUNBLGFBQUssSUFBSVcsSUFBVCxJQUFpQixLQUFLSSxHQUFMLENBQVMsWUFBVCxDQUFqQixFQUF5QztBQUN2QyxjQUFJSSxPQUFPLEtBQUtKLEdBQUwsaUJBQXVCSixJQUF2QixDQUFYO0FBQ0EsY0FBSVMsV0FBV0QsS0FBS1IsSUFBTCxJQUFhQSxJQUE1QjtBQUNBLGNBQUlmLFdBQVd3QixRQUFYLENBQUosRUFBMEI7QUFDeEJILGtCQUFNSSxJQUFOLENBQVd6QixXQUFXd0IsUUFBWCxFQUFxQkYsR0FBckIsRUFBMEJDLElBQTFCLENBQVg7QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBT0csUUFBUUMsTUFBUixrQkFBOEJILFFBQTlCLDJCQUFQO0FBQ0Q7QUFDRjtBQUNELGVBQU9FLFFBQVFFLEdBQVIsQ0FBWVAsS0FBWixFQUFtQlEsSUFBbkIsQ0FBd0IsVUFBQ0MsT0FBRCxFQUFhO0FBQzFDLGNBQUlDLFVBQVUsSUFBZDtBQUNBLGNBQUl0QixTQUFTLEVBQWI7QUFGMEM7QUFBQTtBQUFBOztBQUFBO0FBRzFDLGlDQUFtQnFCLE9BQW5CLDhIQUE0QjtBQUFBLGtCQUFuQkUsTUFBbUI7O0FBQzFCLGtCQUFJLENBQUNBLE9BQU9ELE9BQVosRUFBcUI7QUFDbkJBLDBCQUFVLEtBQVY7QUFDRDtBQUNELGtCQUFJQyxPQUFPQyxLQUFYLEVBQWtCO0FBQ2hCeEIsdUJBQU9nQixJQUFQLENBQVlPLE9BQU9DLEtBQW5CO0FBQ0Q7QUFDRjtBQVZ5QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVcxQyxpQkFBS2hCLEdBQUwsQ0FBUyxRQUFULEVBQW1CUixNQUFuQjtBQUNBLGlCQUFLUSxHQUFMLENBQVMsU0FBVCxFQUFvQmMsT0FBcEI7O0FBRUEsaUJBQU87QUFDTDdCLGdCQUFJLE9BQUtpQixHQUFMLENBQVMsSUFBVCxDQURDO0FBRUxZLHFCQUFTQSxPQUZKO0FBR0x0QixvQkFBUUE7QUFISCxXQUFQO0FBS0QsU0FuQk0sQ0FBUDtBQW9CRDtBQWpFSDs7QUFBQTtBQUFBLElBQWdDWCxLQUFoQztBQW1FRCxDQXBGRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFZhbGlkYXRpb24gPSByZXF1aXJlKCdjb3JlL3V0aWwvdmFsaWRhdGlvbicpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgaWQ6IG51bGwsXG4gICAgICBsYWJlbDogJycsXG4gICAgICB2YWx1ZTogbnVsbCxcbiAgICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIGhhc0Vycm9yOiBmYWxzZSxcbiAgICAgIGVycm9yczogW10sXG4gICAgICBjbGFzc2VzOiBbXSxcbiAgICAgIHZhbGlkYXRpb246IG51bGxcbiAgICB9O1xuXG4gIHJldHVybiBjbGFzcyBGaWVsZE1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgY29uZmlnLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZmlnLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG4gICAgICBjb25maWcuZGF0YS52YWxpZGF0aW9uID0gY29uZmlnLmRhdGEudmFsaWRhdGlvbiB8fCB7fTtcbiAgICAgIGlmIChjb25maWcuZGF0YS5yZXF1aXJlZCkge1xuICAgICAgICBjb25maWcuZGF0YS52YWxpZGF0aW9uLnJlcXVpcmVkID0ge1xuICAgICAgICAgIHRlc3Q6IFwiZXhpc3RzXCIsXG4gICAgICAgICAgZXJyb3JNZXNzYWdlOiBgJHtjb25maWcuZGF0YS5sYWJlbH0gcmVxdWlyZWQuYFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICB0aGlzLnNldCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIHRoaXMuc2V0KCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIH1cblxuICAgIHZhbHVlKCkge1xuICAgICAgaWYgKFV0aWxzLmV4aXN0cyh0aGlzLmdldCgndmFsdWUnKSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCd2YWx1ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdkZWZhdWx0VmFsdWUnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfdXBkYXRlVmFsaWRhdGlvbihuZXdWYWxpZGF0aW9uKSB7XG4gICAgICB0aGlzLnNldCgndmFsaWRhdGlvbicsbmV3VmFsaWRhdGlvbik7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoKSB7XG4gICAgICBsZXQgdGVzdHMgPSBbXTtcbiAgICAgIGxldCB2YWwgPSB0aGlzLnZhbHVlKCk7XG4gICAgICBmb3IgKGxldCB0ZXN0IGluIHRoaXMuZ2V0KCd2YWxpZGF0aW9uJykpIHtcbiAgICAgICAgbGV0IHNwZWMgPSB0aGlzLmdldChgdmFsaWRhdGlvbi4ke3Rlc3R9YCk7XG4gICAgICAgIGxldCB0ZXN0TmFtZSA9IHNwZWMudGVzdCB8fCB0ZXN0O1xuICAgICAgICBpZiAoVmFsaWRhdGlvblt0ZXN0TmFtZV0pIHtcbiAgICAgICAgICB0ZXN0cy5wdXNoKFZhbGlkYXRpb25bdGVzdE5hbWVdKHZhbCwgc3BlYykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChgVmFsaWRhdGlvbiBcIiR7dGVzdE5hbWV9XCIgY291bGQgbm90IGJlIGZvdW5kLmApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLmFsbCh0ZXN0cykudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcmVzdWx0IG9mIHJlc3VsdHMpIHtcbiAgICAgICAgICBpZiAoIXJlc3VsdC5pc1ZhbGlkKSB7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKHJlc3VsdC5lcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0KCdlcnJvcnMnLCBlcnJvcnMpO1xuICAgICAgICB0aGlzLnNldCgnaXNWYWxpZCcsIGlzVmFsaWQpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHRoaXMuZ2V0KCdpZCcpLFxuICAgICAgICAgIGlzVmFsaWQ6IGlzVmFsaWQsXG4gICAgICAgICAgZXJyb3JzOiBlcnJvcnNcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTtcbiJdfQ==
