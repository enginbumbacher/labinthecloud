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
      var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var bubbles = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2V2ZW50L2V2ZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBS0EsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQjtBQUNFLG1CQUFZLElBQVosRUFBOEM7QUFBQSxVQUE1QixJQUE0Qix5REFBckIsRUFBcUI7QUFBQSxVQUFqQixPQUFpQix5REFBUCxLQUFPOztBQUFBOztBQUM1QyxXQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsV0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFdBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxXQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLElBQXJCO0FBQ0Q7O0FBUEg7QUFBQTtBQUFBLHdDQVNvQjtBQUNoQixhQUFLLE9BQUwsR0FBZSxLQUFmO0FBQ0Q7QUFYSDs7QUFBQTtBQUFBO0FBYUQsQ0FkRCIsImZpbGUiOiJtb2R1bGUvY29yZS9ldmVudC9ldmVudC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
