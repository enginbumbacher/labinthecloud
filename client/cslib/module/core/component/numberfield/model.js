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
      return _possibleConstructorReturn(this, (NumberFieldModel.__proto__ || Object.getPrototypeOf(NumberFieldModel)).call(this, config));
    }

    return NumberFieldModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZU1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsInByZWZpeCIsInBvc3RmaXgiLCJtaW4iLCJtYXgiLCJwbGFjZWhvbGRlciIsInR5cGUiLCJjaGFuZ2VFdmVudHMiLCJ2YWxpZGF0aW9uIiwiX251bWJlciIsInRlc3QiLCJlcnJvck1lc3NhZ2UiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSxpQ0FBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVc7QUFDVEMsWUFBUSxFQURDO0FBRVRDLGFBQVMsRUFGQTtBQUdUQyxTQUFLLElBSEk7QUFJVEMsU0FBSyxJQUpJO0FBS1RDLGlCQUFhLElBTEo7QUFNVEMsVUFBTSxPQU5HO0FBT1RDLGtCQUFjLGFBUEw7QUFRVEMsZ0JBQVk7QUFDVkMsZUFBUztBQUNQQyxjQUFNLFNBREM7QUFFUEMsc0JBQWM7QUFGUDtBQURDO0FBUkgsR0FGYjs7QUFrQkE7QUFBQTs7QUFDRSw4QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT1osUUFBUCxHQUFrQkQsTUFBTWMsY0FBTixDQUFxQkQsT0FBT1osUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBRGtCLGlJQUVaWSxNQUZZO0FBR25COztBQUpIO0FBQUEsSUFBc0NkLFNBQXRDO0FBTUQsQ0F6QkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L251bWJlcmZpZWxkL21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
