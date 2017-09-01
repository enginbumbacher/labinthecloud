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
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, NumberField);

      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, (NumberField.__proto__ || Object.getPrototypeOf(NumberField)).call(this, settings));
    }

    return NumberField;
  }(BaseField);

  NumberField.create = function (data) {
    return new NumberField({ modelData: data });
  };

  return NumberField;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZUZpZWxkIiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJOdW1iZXJGaWVsZCIsInNldHRpbmdzIiwidmlld0NsYXNzIiwibW9kZWxDbGFzcyIsImNyZWF0ZSIsImRhdGEiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsaUNBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWOztBQURrQixNQU1aSyxXQU5ZO0FBQUE7O0FBT2hCLDJCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFNBQVQsR0FBcUJELFNBQVNDLFNBQVQsSUFBc0JKLElBQTNDO0FBQ0FHLGVBQVNFLFVBQVQsR0FBc0JGLFNBQVNFLFVBQVQsSUFBdUJOLEtBQTdDO0FBRnlCLHVIQUduQkksUUFIbUI7QUFJMUI7O0FBWGU7QUFBQSxJQU1RTCxTQU5SOztBQWNsQkksY0FBWUksTUFBWixHQUFxQixVQUFDQyxJQUFELEVBQVU7QUFDN0IsV0FBTyxJQUFJTCxXQUFKLENBQWdCLEVBQUVNLFdBQVdELElBQWIsRUFBaEIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT0wsV0FBUDtBQUNELENBbkJEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC9maWVsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyk7XG5cbiAgY2xhc3MgTnVtYmVyRmllbGQgZXh0ZW5kcyBCYXNlRmllbGQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgfVxuICB9XG5cbiAgTnVtYmVyRmllbGQuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IE51bWJlckZpZWxkKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9O1xuXG4gIHJldHVybiBOdW1iZXJGaWVsZDtcbn0pOyJdfQ==
