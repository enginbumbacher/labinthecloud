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

      var _this = _possibleConstructorReturn(this, (HelpModule.__proto__ || Object.getPrototypeOf(HelpModule)).call(this));

      _this.help = new Help();
      return _this;
    }

    _createClass(HelpModule, [{
      key: 'run',
      value: function run() {
        Globals.get('Layout').getPanel('result').addContent(this.help.view());
      }
    }]);

    return HelpModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJIZWxwIiwiR2xvYmFscyIsImhlbHAiLCJnZXQiLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLE9BQU9GLFFBQVEsUUFBUixDQURUO0FBQUEsTUFFRUcsVUFBVUgsUUFBUSxvQkFBUixDQUZaOztBQUlBO0FBQUE7O0FBQ0UsMEJBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFLSSxJQUFMLEdBQVksSUFBSUYsSUFBSixFQUFaO0FBRlk7QUFHYjs7QUFKSDtBQUFBO0FBQUEsNEJBTVE7QUFDSkMsZ0JBQVFFLEdBQVIsQ0FBWSxRQUFaLEVBQXNCQyxRQUF0QixDQUErQixRQUEvQixFQUF5Q0MsVUFBekMsQ0FBb0QsS0FBS0gsSUFBTCxDQUFVSSxJQUFWLEVBQXBEO0FBQ0Q7QUFSSDs7QUFBQTtBQUFBLElBQWdDUCxNQUFoQztBQVVELENBZkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvaGVscC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgSGVscCA9IHJlcXVpcmUoJy4vaGVscCcpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcblxuICByZXR1cm4gY2xhc3MgSGVscE1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5oZWxwID0gbmV3IEhlbHAoKTtcbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICBHbG9iYWxzLmdldCgnTGF5b3V0JykuZ2V0UGFuZWwoJ3Jlc3VsdCcpLmFkZENvbnRlbnQodGhpcy5oZWxwLnZpZXcoKSk7XG4gICAgfVxuICB9O1xufSkiXX0=
