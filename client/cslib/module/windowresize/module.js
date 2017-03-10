'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var $ = require('jquery'),
      Module = require('core/app/module'),
      Globals = require('core/model/globals'),
      Event = require('core/event/event');

  return function (_Module) {
    _inherits(WindowResize, _Module);

    function WindowResize() {
      _classCallCheck(this, WindowResize);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(WindowResize).apply(this, arguments));
    }

    _createClass(WindowResize, [{
      key: 'init',
      value: function init() {
        if (window) window.addEventListener('resize', this._onResize.bind(this));
      }
    }, {
      key: '_onResize',
      value: function _onResize() {
        Globals.get('Relay').dispatchEvent(new Event('Window.Resize', {
          width: $(window).width(),
          height: $(window).height()
        }));
      }
    }]);

    return WindowResize;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS93aW5kb3dyZXNpemUvbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sSUFBSSxRQUFRLFFBQVIsQ0FBVjtBQUFBLE1BQ0UsU0FBUyxRQUFRLGlCQUFSLENBRFg7QUFBQSxNQUVFLFVBQVUsUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFHRSxRQUFRLFFBQVEsa0JBQVIsQ0FIVjs7QUFLQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBQ1M7QUFDTCxZQUFJLE1BQUosRUFBWSxPQUFPLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBbEM7QUFDYjtBQUhIO0FBQUE7QUFBQSxrQ0FLYztBQUNWLGdCQUFRLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLGFBQXJCLENBQW1DLElBQUksS0FBSixDQUFVLGVBQVYsRUFBMkI7QUFDNUQsaUJBQU8sRUFBRSxNQUFGLEVBQVUsS0FBVixFQURxRDtBQUU1RCxrQkFBUSxFQUFFLE1BQUYsRUFBVSxNQUFWO0FBRm9ELFNBQTNCLENBQW5DO0FBSUQ7QUFWSDs7QUFBQTtBQUFBLElBQWtDLE1BQWxDO0FBWUQsQ0FsQkQiLCJmaWxlIjoibW9kdWxlL3dpbmRvd3Jlc2l6ZS9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
