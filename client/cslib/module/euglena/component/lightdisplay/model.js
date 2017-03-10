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
    // video: null,
    // runTime: 0,
    // fps: 0,
  };

  return function (_Model) {
    _inherits(LightDisplayModel, _Model);

    function LightDisplayModel() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, LightDisplayModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(LightDisplayModel).call(this, config));
    }

    return LightDisplayModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbW9kZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sUUFBUSxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFHRSxXQUFXO0FBQ1QsV0FBTyxHQURFO0FBRVQsWUFBUTs7OztBQUZDLEdBSGI7O0FBWUE7QUFBQTs7QUFDRSxpQ0FBeUI7QUFBQSxVQUFiLE1BQWEseURBQUosRUFBSTs7QUFBQTs7QUFDdkIsYUFBTyxRQUFQLEdBQWtCLE1BQU0sY0FBTixDQUFxQixPQUFPLFFBQTVCLEVBQXNDLFFBQXRDLENBQWxCO0FBRHVCLGtHQUVqQixNQUZpQjtBQUd4Qjs7QUFKSDtBQUFBLElBQXVDLEtBQXZDO0FBTUQsQ0FuQkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2xpZ2h0ZGlzcGxheS9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
