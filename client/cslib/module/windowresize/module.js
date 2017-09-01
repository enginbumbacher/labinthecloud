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

      return _possibleConstructorReturn(this, (WindowResize.__proto__ || Object.getPrototypeOf(WindowResize)).apply(this, arguments));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS93aW5kb3dyZXNpemUvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCIkIiwiTW9kdWxlIiwiR2xvYmFscyIsIkV2ZW50Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblJlc2l6ZSIsImJpbmQiLCJnZXQiLCJkaXNwYXRjaEV2ZW50Iiwid2lkdGgiLCJoZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsSUFBSUQsUUFBUSxRQUFSLENBQVY7QUFBQSxNQUNFRSxTQUFTRixRQUFRLGlCQUFSLENBRFg7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGtCQUFSLENBSFY7O0FBS0E7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDZCQUNTO0FBQ0wsWUFBSUssTUFBSixFQUFZQSxPQUFPQyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxLQUFLQyxTQUFMLENBQWVDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBbEM7QUFDYjtBQUhIO0FBQUE7QUFBQSxrQ0FLYztBQUNWTCxnQkFBUU0sR0FBUixDQUFZLE9BQVosRUFBcUJDLGFBQXJCLENBQW1DLElBQUlOLEtBQUosQ0FBVSxlQUFWLEVBQTJCO0FBQzVETyxpQkFBT1YsRUFBRUksTUFBRixFQUFVTSxLQUFWLEVBRHFEO0FBRTVEQyxrQkFBUVgsRUFBRUksTUFBRixFQUFVTyxNQUFWO0FBRm9ELFNBQTNCLENBQW5DO0FBSUQ7QUFWSDs7QUFBQTtBQUFBLElBQWtDVixNQUFsQztBQVlELENBbEJEIiwiZmlsZSI6Im1vZHVsZS93aW5kb3dyZXNpemUvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgRXZlbnQgPSByZXF1aXJlKCdjb3JlL2V2ZW50L2V2ZW50Jyk7XG5cbiAgcmV0dXJuIGNsYXNzIFdpbmRvd1Jlc2l6ZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgIGlmICh3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfb25SZXNpemUoKSB7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnV2luZG93LlJlc2l6ZScsIHtcbiAgICAgICAgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLFxuICAgICAgICBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKVxuICAgICAgfSkpO1xuICAgIH1cbiAgfTtcbn0pOyJdfQ==
