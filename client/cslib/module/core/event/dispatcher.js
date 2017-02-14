'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Event Dispatcher
// ================

// Base class for dispatching [Event](./event.html)s. Expect pretty much every
// class to have this somewhere in its inheritence chain.

define(function (require) {
  var Event = require('./event');

  return function () {
    function EventDispatcher() {
      _classCallCheck(this, EventDispatcher);
    }

    _createClass(EventDispatcher, [{
      key: 'addEventListener',

      // Public API
      // ==========

      // `addEventListener(eventName, callback)`

      // Registers a callback function to be called when an event with the specified
      // name is fired by this object. This callback is considered to be "listening" for
      // that event.

      // The callback should expect a single argument, which will be an
      // [Event](./event.html) object.

      // There are two points to note:

      // 1. The same callback set to listen for the same event will only be called
      //   once.
      // 2. Since lambda functions are always considered to be different with each
      //   declaration, they should not be used as callbacks for events.

      value: function addEventListener(evtName, callback) {
        //lazily create the listener collections
        this.__listeners = this.__listeners || {};
        this.__listeners[evtName] = this.__listeners[evtName] || [];
        if (!this.__listeners[evtName].includes(callback)) this.__listeners[evtName].push(callback);
        return this;
      }

      // `removeEventListener(eventName, callback)`

      // Stops a listener from listening to the specified event.

    }, {
      key: 'removeEventListener',
      value: function removeEventListener(evtName, callback) {
        if (this.__listeners && this.__listeners[evtName] && this.__listeners[evtName].includes(callback)) this.__listeners[evtName].splice(this.__listeners[evtName].indexOf(callback), 1);
        return this;
      }

      // `dispatchEvent(event)`, `dispatchEvent(eventName, data = {}, bubbles = false)`

      // Fires an event, calling all of the callbacks in the order they were added.
      // If the first argument is a string, then it is assumed to be the event's name,
      // and a proper Event object is created on the fly.

      // Once all callbacks bound to the specific event name are fired, callbacks bound
      // to all event using the wildcard ("*") name are fired.

    }, {
      key: 'dispatchEvent',
      value: function dispatchEvent(evt) {
        var _this = this;

        var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var bubbles = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        if (this.__listeners) {
          if (typeof evt == "string") evt = new Event(evt, data, bubbles);
          evt.target = evt.target || this;
          evt.currentTarget = this;

          [evt.name, '*'].forEach(function (val, ind, arr) {
            if (_this.__listeners[val]) {
              var listeners = _this.__listeners[val].slice(0);
              listeners.forEach(function (cb) {
                return cb(evt);
              });
            }
          });
        }
        return this;
      }

      // API Aliases
      // ===========
      // `on(eventName, callback)`

      // Shorthand for `addEventListener`.

    }, {
      key: 'on',
      value: function on() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.addEventListener.apply(this, args);
      }

      // `off(eventName, callback)`

      // Shorthand for `removeEventListener`.

    }, {
      key: 'off',
      value: function off() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        this.addEventListener.apply(this, args);
      }

      // `fire(event)`, `fire(eventName, data = {}, bubbles = false)`

      // Shorthand for `dispatchEvent`.

    }, {
      key: 'fire',
      value: function fire() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        this.dispatchEvent.apply(this, args);
      }

      // Utilities
      // =========

      // `bubbleEvent(event)`

      // Event listener to fire any bubbling events. Normal usage of this looks
      // something like the following:

      //     child.addEventListener "*", parent.bubbleEvent

      // This allows the parent to fire any events that the child fires up the chain,
      // restricted only to the events that are specified to bubble.

    }, {
      key: 'bubbleEvent',
      value: function bubbleEvent(evt) {
        if (evt.bubbles) this.dispatchEvent(evt);
      }
    }]);

    return EventDispatcher;
  }();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2V2ZW50L2Rpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBTUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFFBQVEsUUFBUSxTQUFSLENBQWQ7O0FBRUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBb0JtQixPQXBCbkIsRUFvQjRCLFFBcEI1QixFQW9Cc0M7O0FBRWxDLGFBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsSUFBb0IsRUFBdkM7QUFDQSxhQUFLLFdBQUwsQ0FBaUIsT0FBakIsSUFBNEIsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEtBQTZCLEVBQXpEO0FBQ0EsWUFBSSxDQUFDLEtBQUssV0FBTCxDQUFpQixPQUFqQixFQUEwQixRQUExQixDQUFtQyxRQUFuQyxDQUFMLEVBQ0UsS0FBSyxXQUFMLENBQWlCLE9BQWpCLEVBQTBCLElBQTFCLENBQStCLFFBQS9CO0FBQ0YsZUFBTyxJQUFQO0FBQ0Q7Ozs7OztBQTNCSDtBQUFBO0FBQUEsMENBa0NzQixPQWxDdEIsRUFrQytCLFFBbEMvQixFQWtDeUM7QUFDckMsWUFBSSxLQUFLLFdBQUwsSUFBb0IsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQXBCLElBQWlELEtBQUssV0FBTCxDQUFpQixPQUFqQixFQUEwQixRQUExQixDQUFtQyxRQUFuQyxDQUFyRCxFQUNFLEtBQUssV0FBTCxDQUFpQixPQUFqQixFQUEwQixNQUExQixDQUFpQyxLQUFLLFdBQUwsQ0FBaUIsT0FBakIsRUFBMEIsT0FBMUIsQ0FBa0MsUUFBbEMsQ0FBakMsRUFBOEUsQ0FBOUU7QUFDRixlQUFPLElBQVA7QUFDRDs7Ozs7Ozs7Ozs7QUF0Q0g7QUFBQTtBQUFBLG9DQWtEZ0IsR0FsRGhCLEVBa0RpRDtBQUFBOztBQUFBLFlBQTVCLElBQTRCLHlEQUFyQixFQUFxQjtBQUFBLFlBQWpCLE9BQWlCLHlEQUFQLEtBQU87O0FBQzdDLFlBQUksS0FBSyxXQUFULEVBQXNCO0FBQ3BCLGNBQUksT0FBTyxHQUFQLElBQWMsUUFBbEIsRUFBNEIsTUFBTSxJQUFJLEtBQUosQ0FBVSxHQUFWLEVBQWUsSUFBZixFQUFxQixPQUFyQixDQUFOO0FBQzVCLGNBQUksTUFBSixHQUFhLElBQUksTUFBSixJQUFjLElBQTNCO0FBQ0EsY0FBSSxhQUFKLEdBQW9CLElBQXBCOztBQUVBLFdBQUMsSUFBSSxJQUFMLEVBQVcsR0FBWCxFQUFnQixPQUFoQixDQUF3QixVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFtQjtBQUN6QyxnQkFBSSxNQUFLLFdBQUwsQ0FBaUIsR0FBakIsQ0FBSixFQUEyQjtBQUN6QixrQkFBSSxZQUFZLE1BQUssV0FBTCxDQUFpQixHQUFqQixFQUFzQixLQUF0QixDQUE0QixDQUE1QixDQUFoQjtBQUNBLHdCQUFVLE9BQVYsQ0FBa0IsVUFBQyxFQUFEO0FBQUEsdUJBQVEsR0FBRyxHQUFILENBQVI7QUFBQSxlQUFsQjtBQUNEO0FBQ0YsV0FMRDtBQU1EO0FBQ0QsZUFBTyxJQUFQO0FBQ0Q7Ozs7Ozs7O0FBaEVIO0FBQUE7QUFBQSwyQkF3RWM7QUFBQSwwQ0FBTixJQUFNO0FBQU4sY0FBTTtBQUFBOztBQUNWLGFBQUssZ0JBQUwsQ0FBc0IsS0FBdEIsQ0FBNEIsSUFBNUIsRUFBa0MsSUFBbEM7QUFDRDs7Ozs7O0FBMUVIO0FBQUE7QUFBQSw0QkFnRmU7QUFBQSwyQ0FBTixJQUFNO0FBQU4sY0FBTTtBQUFBOztBQUNYLGFBQUssZ0JBQUwsQ0FBc0IsS0FBdEIsQ0FBNEIsSUFBNUIsRUFBa0MsSUFBbEM7QUFDRDs7Ozs7O0FBbEZIO0FBQUE7QUFBQSw2QkF3RmU7QUFBQSwyQ0FBTCxJQUFLO0FBQUwsY0FBSztBQUFBOztBQUNYLGFBQUssYUFBTCxDQUFtQixLQUFuQixDQUF5QixJQUF6QixFQUErQixJQUEvQjtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7QUExRkg7QUFBQTtBQUFBLGtDQTBHYyxHQTFHZCxFQTBHbUI7QUFDZixZQUFJLElBQUksT0FBUixFQUFpQixLQUFLLGFBQUwsQ0FBbUIsR0FBbkI7QUFDbEI7QUE1R0g7O0FBQUE7QUFBQTtBQThHRCxDQWpIRCIsImZpbGUiOiJtb2R1bGUvY29yZS9ldmVudC9kaXNwYXRjaGVyLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
