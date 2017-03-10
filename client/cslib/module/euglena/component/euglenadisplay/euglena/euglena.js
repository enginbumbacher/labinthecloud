'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Controller = require('core/controller/controller'),
      Utils = require('core/util/utils'),
      View = require('./view');

  return function (_Controller) {
    _inherits(Euglena, _Controller);

    function Euglena() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Euglena);

      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Euglena).call(this, settings));

      _this.controllerState = {};
      return _this;
    }

    _createClass(Euglena, [{
      key: 'view',
      value: function view() {
        return this._view.threeObject();
      }
    }, {
      key: 'setPosition',
      value: function setPosition(x, y) {
        var z = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        this._view.setPosition(x, y, z);
      }
    }, {
      key: 'setRotation',
      value: function setRotation(theta) {
        this._view.setRotation(theta);
      }
    }, {
      key: 'update',
      value: function update(lights, dT, model) {
        this._view.update(lights, dT, model, this.controllerState);
      }
    }]);

    return Euglena;
  }(Controller);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hL2V1Z2xlbmEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxhQUFhLFFBQVEsNEJBQVIsQ0FBbkI7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxPQUFPLFFBQVEsUUFBUixDQUZUOztBQUtBO0FBQUE7O0FBQ0UsdUJBQTJCO0FBQUEsVUFBZixRQUFlLHlEQUFKLEVBQUk7O0FBQUE7O0FBQ3pCLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsSUFBM0M7O0FBRHlCLDZGQUVuQixRQUZtQjs7QUFHekIsWUFBSyxlQUFMLEdBQXVCLEVBQXZCO0FBSHlCO0FBSTFCOztBQUxIO0FBQUE7QUFBQSw2QkFPUztBQUNMLGVBQU8sS0FBSyxLQUFMLENBQVcsV0FBWCxFQUFQO0FBQ0Q7QUFUSDtBQUFBO0FBQUEsa0NBV2MsQ0FYZCxFQVdpQixDQVhqQixFQVcyQjtBQUFBLFlBQVAsQ0FBTyx5REFBSCxDQUFHOztBQUN2QixhQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBQTZCLENBQTdCO0FBQ0Q7QUFiSDtBQUFBO0FBQUEsa0NBZWMsS0FmZCxFQWVxQjtBQUNqQixhQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLEtBQXZCO0FBQ0Q7QUFqQkg7QUFBQTtBQUFBLDZCQW1CUyxNQW5CVCxFQW1CaUIsRUFuQmpCLEVBbUJxQixLQW5CckIsRUFtQjRCO0FBQ3hCLGFBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBbEIsRUFBMEIsRUFBMUIsRUFBOEIsS0FBOUIsRUFBcUMsS0FBSyxlQUExQztBQUNEO0FBckJIOztBQUFBO0FBQUEsSUFBNkIsVUFBN0I7QUF1QkQsQ0E3QkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L2V1Z2xlbmEvZXVnbGVuYS5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
