'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  var LightDisplay = function (_Component) {
    _inherits(LightDisplay, _Component);

    function LightDisplay() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, LightDisplay);

      config.viewClass = config.viewClass || View;
      config.modelClass = config.modelClass || Model;
      return _possibleConstructorReturn(this, (LightDisplay.__proto__ || Object.getPrototypeOf(LightDisplay)).call(this, config));
    }

    _createClass(LightDisplay, [{
      key: 'render',
      value: function render(lights) {
        this.view().render(lights);
      }
    }]);

    return LightDisplay;
  }(Component);

  LightDisplay.create = function (data) {
    return new LightDisplay({ modelData: data });
  };

  return LightDisplay;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIkxpZ2h0RGlzcGxheSIsImNvbmZpZyIsInZpZXdDbGFzcyIsIm1vZGVsQ2xhc3MiLCJsaWdodHMiLCJ2aWV3IiwicmVuZGVyIiwiY3JlYXRlIiwiZGF0YSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFPWkssWUFQWTtBQUFBOztBQVFoQiw0QkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPQyxTQUFQLEdBQW1CRCxPQUFPQyxTQUFQLElBQW9CSixJQUF2QztBQUNBRyxhQUFPRSxVQUFQLEdBQW9CRixPQUFPRSxVQUFQLElBQXFCTixLQUF6QztBQUZ1Qix5SEFHakJJLE1BSGlCO0FBSXhCOztBQVplO0FBQUE7QUFBQSw2QkFjVEcsTUFkUyxFQWNEO0FBQ2IsYUFBS0MsSUFBTCxHQUFZQyxNQUFaLENBQW1CRixNQUFuQjtBQUNEO0FBaEJlOztBQUFBO0FBQUEsSUFPU1IsU0FQVDs7QUFtQmxCSSxlQUFhTyxNQUFiLEdBQXNCLFVBQUNDLElBQUQ7QUFBQSxXQUFVLElBQUlSLFlBQUosQ0FBaUIsRUFBRVMsV0FBV0QsSUFBYixFQUFqQixDQUFWO0FBQUEsR0FBdEI7O0FBRUEsU0FBT1IsWUFBUDtBQUNELENBdEJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=