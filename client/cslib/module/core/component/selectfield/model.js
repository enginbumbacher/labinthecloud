'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseModel = require('core/component/form/field/model'),
      Utils = require('core/util/utils'),
      defaults = {
    options: {}
  };

  return function (_BaseModel) {
    _inherits(SelectFieldModel, _BaseModel);

    function SelectFieldModel(config) {
      _classCallCheck(this, SelectFieldModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SelectFieldModel).call(this, config));

      if (!Utils.exists(_this.get('value'))) {
        _this.set('value', Object.keys(_this.get('options'))[0]);
      }
      return _this;
    }

    return SelectFieldModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxZQUFZLFFBQVEsaUNBQVIsQ0FBbEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxXQUFXO0FBQ1QsYUFBUztBQURBLEdBRmI7O0FBTUE7QUFBQTs7QUFDRSw4QkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLGFBQU8sUUFBUCxHQUFrQixNQUFNLGNBQU4sQ0FBcUIsT0FBTyxRQUE1QixFQUFzQyxRQUF0QyxDQUFsQjs7QUFEa0Isc0dBRVosTUFGWTs7QUFHbEIsVUFBSSxDQUFDLE1BQU0sTUFBTixDQUFhLE1BQUssR0FBTCxDQUFTLE9BQVQsQ0FBYixDQUFMLEVBQXNDO0FBQ3BDLGNBQUssR0FBTCxDQUFTLE9BQVQsRUFBa0IsT0FBTyxJQUFQLENBQVksTUFBSyxHQUFMLENBQVMsU0FBVCxDQUFaLEVBQWlDLENBQWpDLENBQWxCO0FBQ0Q7QUFMaUI7QUFNbkI7O0FBUEg7QUFBQSxJQUFzQyxTQUF0QztBQVNELENBaEJEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
