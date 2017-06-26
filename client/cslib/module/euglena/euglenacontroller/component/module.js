'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      Manager = require('./manager');

  return function (_Module) {
    _inherits(ComponentEuglenaControllerModule, _Module);

    function ComponentEuglenaControllerModule() {
      _classCallCheck(this, ComponentEuglenaControllerModule);

      var _this = _possibleConstructorReturn(this, (ComponentEuglenaControllerModule.__proto__ || Object.getPrototypeOf(ComponentEuglenaControllerModule)).call(this));

      HM.hook('Euglena.Manager', function (spec) {
        Manager.setModelData(Globals.get('AppConfig.managers.component'));
        spec.candidates.push(Manager);
        spec.manager = Manager;
        return spec;
      });
      return _this;
    }

    return ComponentEuglenaControllerModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZHVsZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTWFuYWdlciIsImhvb2siLCJzcGVjIiwic2V0TW9kZWxEYXRhIiwiZ2V0IiwiY2FuZGlkYXRlcyIsInB1c2giLCJtYW5hZ2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUdFSSxLQUFLSixRQUFRLHlCQUFSLENBSFA7QUFBQSxNQUlFSyxVQUFVTCxRQUFRLFdBQVIsQ0FKWjs7QUFPQTtBQUFBOztBQUNFLGdEQUFjO0FBQUE7O0FBQUE7O0FBR1pJLFNBQUdFLElBQUgsQ0FBUSxpQkFBUixFQUEyQixVQUFDQyxJQUFELEVBQVU7QUFDbkNGLGdCQUFRRyxZQUFSLENBQXFCTCxRQUFRTSxHQUFSLENBQVksOEJBQVosQ0FBckI7QUFDQUYsYUFBS0csVUFBTCxDQUFnQkMsSUFBaEIsQ0FBcUJOLE9BQXJCO0FBQ0FFLGFBQUtLLE9BQUwsR0FBZVAsT0FBZjtBQUNBLGVBQU9FLElBQVA7QUFDRCxPQUxEO0FBSFk7QUFTYjs7QUFWSDtBQUFBLElBQXNETixNQUF0RDtBQVlELENBcEJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
