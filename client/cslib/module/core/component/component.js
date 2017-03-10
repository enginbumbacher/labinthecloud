'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Controller = require('core/controller/controller');

  return function (_Controller) {
    _inherits(Component, _Controller);

    function Component(settings) {
      _classCallCheck(this, Component);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this, settings));

      _this._active = true;
      return _this;
    }

    _createClass(Component, [{
      key: 'enable',
      value: function enable() {
        this._active = true;
        this.dispatchEvent('Component.Enabled', {});
      }
    }, {
      key: 'disable',
      value: function disable() {
        this._active = false;
        this.dispatchEvent('Component.Disabled', {});
      }
    }, {
      key: 'isActive',
      value: function isActive() {
        return this._active;
      }
    }]);

    return Component;
  }(Controller);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxhQUFhLFFBQVEsNEJBQVIsQ0FBbkI7O0FBRUE7QUFBQTs7QUFDRSx1QkFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQUEsK0ZBQ2QsUUFEYzs7QUFFcEIsWUFBSyxPQUFMLEdBQWUsSUFBZjtBQUZvQjtBQUdyQjs7QUFKSDtBQUFBO0FBQUEsK0JBTVc7QUFDUCxhQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0EsYUFBSyxhQUFMLENBQW1CLG1CQUFuQixFQUF3QyxFQUF4QztBQUNEO0FBVEg7QUFBQTtBQUFBLGdDQVVZO0FBQ1IsYUFBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLGFBQUssYUFBTCxDQUFtQixvQkFBbkIsRUFBeUMsRUFBekM7QUFDRDtBQWJIO0FBQUE7QUFBQSxpQ0FjYTtBQUNULGVBQU8sS0FBSyxPQUFaO0FBQ0Q7QUFoQkg7O0FBQUE7QUFBQSxJQUErQixVQUEvQjtBQWtCRCxDQXJCRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
