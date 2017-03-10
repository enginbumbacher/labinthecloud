'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Globals = require('core/model/globals'),
      DomView = require('core/view/dom_view');

  return function (_Module) {
    _inherits(EuglenaLayoutModule, _Module);

    function EuglenaLayoutModule() {
      _classCallCheck(this, EuglenaLayoutModule);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EuglenaLayoutModule).call(this));

      _this.panels = {
        left: new DomView("<div class='panel panel-left'></div>"),
        main: new DomView("<div class='panel panel-main'></div>")
      };
      Globals.set('Layout', _this);
      return _this;
    }

    _createClass(EuglenaLayoutModule, [{
      key: 'run',
      value: function run() {
        Globals.get('App.view').addChild(this.panels.left);
        Globals.get('App.view').addChild(this.panels.main);
      }
    }]);

    return EuglenaLayoutModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xheW91dC9tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxTQUFTLFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0UsVUFBVSxRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFLFVBQVUsUUFBUSxvQkFBUixDQUZaOztBQUlBO0FBQUE7O0FBQ0UsbUNBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFLLE1BQUwsR0FBYztBQUNaLGNBQU0sSUFBSSxPQUFKLENBQVksc0NBQVosQ0FETTtBQUVaLGNBQU0sSUFBSSxPQUFKLENBQVksc0NBQVo7QUFGTSxPQUFkO0FBSUEsY0FBUSxHQUFSLENBQVksUUFBWjtBQU5ZO0FBT2I7O0FBUkg7QUFBQTtBQUFBLDRCQVVRO0FBQ0osZ0JBQVEsR0FBUixDQUFZLFVBQVosRUFBd0IsUUFBeEIsQ0FBaUMsS0FBSyxNQUFMLENBQVksSUFBN0M7QUFDQSxnQkFBUSxHQUFSLENBQVksVUFBWixFQUF3QixRQUF4QixDQUFpQyxLQUFLLE1BQUwsQ0FBWSxJQUE3QztBQUNEO0FBYkg7O0FBQUE7QUFBQSxJQUF5QyxNQUF6QztBQWVELENBcEJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2xheW91dC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
