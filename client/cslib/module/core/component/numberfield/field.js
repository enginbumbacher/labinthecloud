'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseField = require('core/component/form/field/field'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  var NumberField = function (_BaseField) {
    _inherits(NumberField, _BaseField);

    function NumberField() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, NumberField);

      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(NumberField).call(this, settings));
    }

    return NumberField;
  }(BaseField);

  NumberField.create = function (data) {
    return new NumberField({ modelData: data });
  };

  return NumberField;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxZQUFZLFFBQVEsaUNBQVIsQ0FBbEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFLE9BQU8sUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFLFFBQVEsUUFBUSxpQkFBUixDQUhWOztBQURrQixNQU1aLFdBTlk7QUFBQTs7QUFPaEIsMkJBQTJCO0FBQUEsVUFBZixRQUFlLHlEQUFKLEVBQUk7O0FBQUE7O0FBQ3pCLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsSUFBM0M7QUFDQSxlQUFTLFVBQVQsR0FBc0IsU0FBUyxVQUFULElBQXVCLEtBQTdDO0FBRnlCLDRGQUduQixRQUhtQjtBQUkxQjs7QUFYZTtBQUFBLElBTVEsU0FOUjs7QUFjbEIsY0FBWSxNQUFaLEdBQXFCLFVBQUMsSUFBRCxFQUFVO0FBQzdCLFdBQU8sSUFBSSxXQUFKLENBQWdCLEVBQUUsV0FBVyxJQUFiLEVBQWhCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU8sV0FBUDtBQUNELENBbkJEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC9maWVsZC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
