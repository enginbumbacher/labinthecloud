'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Help = require('./help'),
      Globals = require('core/model/globals');

  return function (_Module) {
    _inherits(HelpModule, _Module);

    function HelpModule() {
      _classCallCheck(this, HelpModule);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HelpModule).call(this));

      _this.help = new Help();
      return _this;
    }

    _createClass(HelpModule, [{
      key: 'run',
      value: function run() {
        // console.log(Globals.get('Layout.panels.main'));
        Globals.get('Layout.panels.main').addChild(this.help.view());
      }
    }]);

    return HelpModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sU0FBUyxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFLE9BQU8sUUFBUSxRQUFSLENBRFQ7QUFBQSxNQUVFLFVBQVUsUUFBUSxvQkFBUixDQUZaOztBQUlBO0FBQUE7O0FBQ0UsMEJBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFLLElBQUwsR0FBWSxJQUFJLElBQUosRUFBWjtBQUZZO0FBR2I7O0FBSkg7QUFBQTtBQUFBLDRCQU1ROztBQUVKLGdCQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxRQUFsQyxDQUEyQyxLQUFLLElBQUwsQ0FBVSxJQUFWLEVBQTNDO0FBQ0Q7QUFUSDs7QUFBQTtBQUFBLElBQWdDLE1BQWhDO0FBV0QsQ0FoQkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvaGVscC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
