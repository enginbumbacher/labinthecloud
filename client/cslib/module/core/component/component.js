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

      var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, settings));

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
      key: 'hide',
      value: function hide() {
        this._active = false;
        this.dispatchEvent('Component.Hidden', {});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9jb21wb25lbnQuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbnRyb2xsZXIiLCJzZXR0aW5ncyIsIl9hY3RpdmUiLCJkaXNwYXRjaEV2ZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGFBQWFELFFBQVEsNEJBQVIsQ0FBbkI7O0FBRUE7QUFBQTs7QUFDRSx1QkFBWUUsUUFBWixFQUFzQjtBQUFBOztBQUFBLHdIQUNkQSxRQURjOztBQUVwQixZQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUZvQjtBQUdyQjs7QUFKSDtBQUFBO0FBQUEsK0JBTVc7QUFDUCxhQUFLQSxPQUFMLEdBQWUsSUFBZjtBQUNBLGFBQUtDLGFBQUwsQ0FBbUIsbUJBQW5CLEVBQXdDLEVBQXhDO0FBQ0Q7QUFUSDtBQUFBO0FBQUEsZ0NBVVk7QUFDUixhQUFLRCxPQUFMLEdBQWUsS0FBZjtBQUNBLGFBQUtDLGFBQUwsQ0FBbUIsb0JBQW5CLEVBQXlDLEVBQXpDO0FBQ0Q7QUFiSDtBQUFBO0FBQUEsNkJBY1M7QUFDTCxhQUFLRCxPQUFMLEdBQWUsS0FBZjtBQUNBLGFBQUtDLGFBQUwsQ0FBbUIsa0JBQW5CLEVBQXNDLEVBQXRDO0FBQ0Q7QUFqQkg7QUFBQTtBQUFBLGlDQWtCYTtBQUNULGVBQU8sS0FBS0QsT0FBWjtBQUNEO0FBcEJIOztBQUFBO0FBQUEsSUFBK0JGLFVBQS9CO0FBc0JELENBekJEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29udHJvbGxlciA9IHJlcXVpcmUoJ2NvcmUvY29udHJvbGxlci9jb250cm9sbGVyJyk7XG5cbiAgcmV0dXJuIGNsYXNzIENvbXBvbmVudCBleHRlbmRzIENvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICB0aGlzLl9hY3RpdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0NvbXBvbmVudC5FbmFibGVkJywge30pO1xuICAgIH1cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0NvbXBvbmVudC5EaXNhYmxlZCcsIHt9KTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdDb21wb25lbnQuSGlkZGVuJyx7fSk7XG4gICAgfVxuICAgIGlzQWN0aXZlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
