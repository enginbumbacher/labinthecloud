'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      EugUtils = require('euglena/utils'),
      defaults = {
    width: 400,
    height: 300,
    lightData: []
  };

  return function (_Model) {
    _inherits(VisualResultModel, _Model);

    function VisualResultModel() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, VisualResultModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (VisualResultModel.__proto__ || Object.getPrototypeOf(VisualResultModel)).call(this, config));
    }

    _createClass(VisualResultModel, [{
      key: 'getLightState',
      value: function getLightState(time) {
        return EugUtils.getLightState(this.get('lightData'), time);
      }
    }]);

    return VisualResultModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZGVsIiwiVXRpbHMiLCJFdWdVdGlscyIsImRlZmF1bHRzIiwid2lkdGgiLCJoZWlnaHQiLCJsaWdodERhdGEiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsInRpbWUiLCJnZXRMaWdodFN0YXRlIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVdILFFBQVEsZUFBUixDQUZiO0FBQUEsTUFJRUksV0FBVztBQUNUQyxXQUFPLEdBREU7QUFFVEMsWUFBUSxHQUZDO0FBR1RDLGVBQVc7QUFIRixHQUpiOztBQVVBO0FBQUE7O0FBQ0UsaUNBQXlCO0FBQUEsVUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUN2QkEsYUFBT0osUUFBUCxHQUFrQkYsTUFBTU8sY0FBTixDQUFxQkQsT0FBT0osUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBRHVCLG1JQUVqQkksTUFGaUI7QUFHeEI7O0FBSkg7QUFBQTtBQUFBLG9DQU1nQkUsSUFOaEIsRUFNc0I7QUFDbEIsZUFBT1AsU0FBU1EsYUFBVCxDQUF1QixLQUFLQyxHQUFMLENBQVMsV0FBVCxDQUF2QixFQUE4Q0YsSUFBOUMsQ0FBUDtBQUNEO0FBUkg7O0FBQUE7QUFBQSxJQUF1Q1QsS0FBdkM7QUFVRCxDQXJCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
