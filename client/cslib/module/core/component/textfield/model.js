'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseModel = require('core/component/form/field/model'),
      Utils = require('core/util/utils'),
      defaults = {
    placeholder: null,
    password: false,
    changeEvents: 'change blur'
  };

  return function (_BaseModel) {
    _inherits(TextFieldModel, _BaseModel);

    function TextFieldModel(config) {
      _classCallCheck(this, TextFieldModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (TextFieldModel.__proto__ || Object.getPrototypeOf(TextFieldModel)).call(this, config));
    }

    return TextFieldModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90ZXh0ZmllbGQvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkJhc2VNb2RlbCIsIlV0aWxzIiwiZGVmYXVsdHMiLCJwbGFjZWhvbGRlciIsInBhc3N3b3JkIiwiY2hhbmdlRXZlbnRzIiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsaUNBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXO0FBQ1RDLGlCQUFhLElBREo7QUFFVEMsY0FBVSxLQUZEO0FBR1RDLGtCQUFjO0FBSEwsR0FGYjs7QUFRQTtBQUFBOztBQUNFLDRCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPSixRQUFQLEdBQWtCRCxNQUFNTSxjQUFOLENBQXFCRCxPQUFPSixRQUE1QixFQUFzQ0EsUUFBdEMsQ0FBbEI7QUFEa0IsNkhBRVpJLE1BRlk7QUFHbkI7O0FBSkg7QUFBQSxJQUFvQ04sU0FBcEM7QUFNRCxDQWZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC90ZXh0ZmllbGQvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQmFzZU1vZGVsID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC9tb2RlbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBwbGFjZWhvbGRlcjogbnVsbCxcbiAgICAgIHBhc3N3b3JkOiBmYWxzZSxcbiAgICAgIGNoYW5nZUV2ZW50czogJ2NoYW5nZSBibHVyJ1xuICAgIH07XG5cbiAgcmV0dXJuIGNsYXNzIFRleHRGaWVsZE1vZGVsIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpXG4gICAgICBzdXBlcihjb25maWcpO1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
