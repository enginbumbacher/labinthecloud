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
      key: 'isActive',
      value: function isActive() {
        return this._active;
      }
    }]);

    return Component;
  }(Controller);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9jb21wb25lbnQuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbnRyb2xsZXIiLCJzZXR0aW5ncyIsIl9hY3RpdmUiLCJkaXNwYXRjaEV2ZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGFBQWFELFFBQVEsNEJBQVIsQ0FBbkI7O0FBRUE7QUFBQTs7QUFDRSx1QkFBWUUsUUFBWixFQUFzQjtBQUFBOztBQUFBLHdIQUNkQSxRQURjOztBQUVwQixZQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUZvQjtBQUdyQjs7QUFKSDtBQUFBO0FBQUEsK0JBTVc7QUFDUCxhQUFLQSxPQUFMLEdBQWUsSUFBZjtBQUNBLGFBQUtDLGFBQUwsQ0FBbUIsbUJBQW5CLEVBQXdDLEVBQXhDO0FBQ0Q7QUFUSDtBQUFBO0FBQUEsZ0NBVVk7QUFDUixhQUFLRCxPQUFMLEdBQWUsS0FBZjtBQUNBLGFBQUtDLGFBQUwsQ0FBbUIsb0JBQW5CLEVBQXlDLEVBQXpDO0FBQ0Q7QUFiSDtBQUFBO0FBQUEsaUNBY2E7QUFDVCxlQUFPLEtBQUtELE9BQVo7QUFDRDtBQWhCSDs7QUFBQTtBQUFBLElBQStCRixVQUEvQjtBQWtCRCxDQXJCRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlKCdjb3JlL2NvbnRyb2xsZXIvY29udHJvbGxlcicpO1xuXG4gIHJldHVybiBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgdGhpcy5fYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICB0aGlzLl9hY3RpdmUgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdDb21wb25lbnQuRW5hYmxlZCcsIHt9KTtcbiAgICB9XG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdDb21wb25lbnQuRGlzYWJsZWQnLCB7fSk7XG4gICAgfVxuICAgIGlzQWN0aXZlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZTtcbiAgICB9XG4gIH1cbn0pIl19
