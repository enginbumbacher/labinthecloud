'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    width: 200,
    height: 200
  };

  return function (_Model) {
    _inherits(LightDisplayModel, _Model);

    function LightDisplayModel() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, LightDisplayModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (LightDisplayModel.__proto__ || Object.getPrototypeOf(LightDisplayModel)).call(this, config));
    }

    return LightDisplayModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsIndpZHRoIiwiaGVpZ2h0IiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BR0VHLFdBQVc7QUFDVEMsV0FBTyxHQURFO0FBRVRDLFlBQVE7QUFGQyxHQUhiOztBQVNBO0FBQUE7O0FBQ0UsaUNBQXlCO0FBQUEsVUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUN2QkEsYUFBT0gsUUFBUCxHQUFrQkQsTUFBTUssY0FBTixDQUFxQkQsT0FBT0gsUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBRHVCLG1JQUVqQkcsTUFGaUI7QUFHeEI7O0FBSkg7QUFBQSxJQUF1Q0wsS0FBdkM7QUFNRCxDQWhCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvbGlnaHRkaXNwbGF5L21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
