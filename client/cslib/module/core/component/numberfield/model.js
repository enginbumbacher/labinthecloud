'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseModel = require('core/component/form/field/model'),
      Utils = require('core/util/utils'),
      defaults = {
    prefix: '',
    postfix: '',
    min: null,
    max: null,
    placeholder: null,
    type: 'float',
    changeEvents: 'change blur',
    validation: {
      _number: {
        test: 'numeric',
        errorMessage: 'Please provide a valid number'
      }
    }
  };

  return function (_BaseModel) {
    _inherits(NumberFieldModel, _BaseModel);

    function NumberFieldModel(config) {
      _classCallCheck(this, NumberFieldModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(NumberFieldModel).call(this, config));
    }

    return NumberFieldModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxZQUFZLFFBQVEsaUNBQVIsQ0FBbEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxXQUFXO0FBQ1QsWUFBUSxFQURDO0FBRVQsYUFBUyxFQUZBO0FBR1QsU0FBSyxJQUhJO0FBSVQsU0FBSyxJQUpJO0FBS1QsaUJBQWEsSUFMSjtBQU1ULFVBQU0sT0FORztBQU9ULGtCQUFjLGFBUEw7QUFRVCxnQkFBWTtBQUNWLGVBQVM7QUFDUCxjQUFNLFNBREM7QUFFUCxzQkFBYztBQUZQO0FBREM7QUFSSCxHQUZiOztBQWtCQTtBQUFBOztBQUNFLDhCQUFZLE1BQVosRUFBb0I7QUFBQTs7QUFDbEIsYUFBTyxRQUFQLEdBQWtCLE1BQU0sY0FBTixDQUFxQixPQUFPLFFBQTVCLEVBQXNDLFFBQXRDLENBQWxCO0FBRGtCLGlHQUVaLE1BRlk7QUFHbkI7O0FBSkg7QUFBQSxJQUFzQyxTQUF0QztBQU1ELENBekJEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
