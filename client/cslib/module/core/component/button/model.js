'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseModel = require('core/component/form/field/model'),
      Utils = require('core/util/utils'),
      defaults = {
    id: null,
    label: '',
    eventName: 'Button.Pressed',
    eventData: {},
    style: "button",
    killNativeEvent: true
  };

  return function (_BaseModel) {
    _inherits(ButtonModel, _BaseModel);

    function ButtonModel(config) {
      _classCallCheck(this, ButtonModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(ButtonModel).call(this, config));
    }

    return ButtonModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vbW9kZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sWUFBWSxRQUFRLGlDQUFSLENBQWxCO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsV0FBVztBQUNULFFBQUksSUFESztBQUVULFdBQU8sRUFGRTtBQUdULGVBQVcsZ0JBSEY7QUFJVCxlQUFXLEVBSkY7QUFLVCxXQUFPLFFBTEU7QUFNVCxxQkFBaUI7QUFOUixHQUZiOztBQVdBO0FBQUE7O0FBQ0UseUJBQVksTUFBWixFQUFvQjtBQUFBOztBQUNsQixhQUFPLFFBQVAsR0FBa0IsTUFBTSxjQUFOLENBQXFCLE9BQU8sUUFBNUIsRUFBc0MsUUFBdEMsQ0FBbEI7QUFEa0IsNEZBRVosTUFGWTtBQUduQjs7QUFKSDtBQUFBLElBQWlDLFNBQWpDO0FBTUQsQ0FsQkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2J1dHRvbi9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
