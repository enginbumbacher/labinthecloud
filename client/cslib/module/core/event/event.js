"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Event
// =====
//
// Base class to represent application events.

define(function (require) {
  return function () {
    function Event(name) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      _classCallCheck(this, Event);

      this.name = name;
      this.data = data;
      this.bubbles = bubbles;
      this.target = null;
      this.currentTarget = null;
    }

    _createClass(Event, [{
      key: "stopPropagation",
      value: function stopPropagation() {
        this.bubbles = false;
      }
    }]);

    return Event;
  }();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2V2ZW50L2V2ZW50LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJuYW1lIiwiZGF0YSIsImJ1YmJsZXMiLCJ0YXJnZXQiLCJjdXJyZW50VGFyZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEI7QUFDRSxtQkFBWUMsSUFBWixFQUE4QztBQUFBLFVBQTVCQyxJQUE0Qix1RUFBckIsRUFBcUI7QUFBQSxVQUFqQkMsT0FBaUIsdUVBQVAsS0FBTzs7QUFBQTs7QUFDNUMsV0FBS0YsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsV0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsV0FBS0MsTUFBTCxHQUFjLElBQWQ7QUFDQSxXQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0Q7O0FBUEg7QUFBQTtBQUFBLHdDQVNvQjtBQUNoQixhQUFLRixPQUFMLEdBQWUsS0FBZjtBQUNEO0FBWEg7O0FBQUE7QUFBQTtBQWFELENBZEQiLCJmaWxlIjoibW9kdWxlL2NvcmUvZXZlbnQvZXZlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFdmVudFxuLy8gPT09PT1cbi8vXG4vLyBCYXNlIGNsYXNzIHRvIHJlcHJlc2VudCBhcHBsaWNhdGlvbiBldmVudHMuXG5cbmRlZmluZSgocmVxdWlyZSkgPT4ge1xuICByZXR1cm4gY2xhc3MgRXZlbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGRhdGEgPSB7fSwgYnViYmxlcyA9IGZhbHNlKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgIHRoaXMuYnViYmxlcyA9IGJ1YmJsZXM7XG4gICAgICB0aGlzLnRhcmdldCA9IG51bGxcbiAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGxcbiAgICB9XG5cbiAgICBzdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgICB0aGlzLmJ1YmJsZXMgPSBmYWxzZVxuICAgIH1cbiAgfTtcbn0pOyJdfQ==
