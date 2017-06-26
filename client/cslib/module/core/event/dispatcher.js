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
    }, {
      key: 'removeAllListeners',
      value: function removeAllListeners(evtName) {
        if (evtName) {
          if (this.__listeners && this.__listeners[evtName]) {
            this.__listeners[evtName].length = 0;
          }
        } else {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.__listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var key = _step.value;

              this.__listeners[key].length = 0;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
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

        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2V2ZW50L2Rpc3BhdGNoZXIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50IiwiZXZ0TmFtZSIsImNhbGxiYWNrIiwiX19saXN0ZW5lcnMiLCJpbmNsdWRlcyIsInB1c2giLCJzcGxpY2UiLCJpbmRleE9mIiwibGVuZ3RoIiwia2V5IiwiZXZ0IiwiZGF0YSIsImJ1YmJsZXMiLCJ0YXJnZXQiLCJjdXJyZW50VGFyZ2V0IiwibmFtZSIsImZvckVhY2giLCJ2YWwiLCJpbmQiLCJhcnIiLCJsaXN0ZW5lcnMiLCJzbGljZSIsImNiIiwiYXJncyIsImFkZEV2ZW50TGlzdGVuZXIiLCJhcHBseSIsImRpc3BhdGNoRXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxTQUFSLENBQWQ7O0FBRUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQWxCRSx1Q0FvQm1CRSxPQXBCbkIsRUFvQjRCQyxRQXBCNUIsRUFvQnNDO0FBQ2xDO0FBQ0EsYUFBS0MsV0FBTCxHQUFtQixLQUFLQSxXQUFMLElBQW9CLEVBQXZDO0FBQ0EsYUFBS0EsV0FBTCxDQUFpQkYsT0FBakIsSUFBNEIsS0FBS0UsV0FBTCxDQUFpQkYsT0FBakIsS0FBNkIsRUFBekQ7QUFDQSxZQUFJLENBQUMsS0FBS0UsV0FBTCxDQUFpQkYsT0FBakIsRUFBMEJHLFFBQTFCLENBQW1DRixRQUFuQyxDQUFMLEVBQ0UsS0FBS0MsV0FBTCxDQUFpQkYsT0FBakIsRUFBMEJJLElBQTFCLENBQStCSCxRQUEvQjtBQUNGLGVBQU8sSUFBUDtBQUNEOztBQUdMOztBQUVBOztBQWhDRTtBQUFBO0FBQUEsMENBa0NzQkQsT0FsQ3RCLEVBa0MrQkMsUUFsQy9CLEVBa0N5QztBQUNyQyxZQUFJLEtBQUtDLFdBQUwsSUFBb0IsS0FBS0EsV0FBTCxDQUFpQkYsT0FBakIsQ0FBcEIsSUFBaUQsS0FBS0UsV0FBTCxDQUFpQkYsT0FBakIsRUFBMEJHLFFBQTFCLENBQW1DRixRQUFuQyxDQUFyRCxFQUNFLEtBQUtDLFdBQUwsQ0FBaUJGLE9BQWpCLEVBQTBCSyxNQUExQixDQUFpQyxLQUFLSCxXQUFMLENBQWlCRixPQUFqQixFQUEwQk0sT0FBMUIsQ0FBa0NMLFFBQWxDLENBQWpDLEVBQThFLENBQTlFO0FBQ0YsZUFBTyxJQUFQO0FBQ0Q7QUF0Q0g7QUFBQTtBQUFBLHlDQXdDcUJELE9BeENyQixFQXdDOEI7QUFDMUIsWUFBSUEsT0FBSixFQUFhO0FBQ1gsY0FBSSxLQUFLRSxXQUFMLElBQW9CLEtBQUtBLFdBQUwsQ0FBaUJGLE9BQWpCLENBQXhCLEVBQW1EO0FBQ2pELGlCQUFLRSxXQUFMLENBQWlCRixPQUFqQixFQUEwQk8sTUFBMUIsR0FBbUMsQ0FBbkM7QUFDRDtBQUNGLFNBSkQsTUFJTztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNMLGlDQUFnQixLQUFLTCxXQUFyQiw4SEFBa0M7QUFBQSxrQkFBekJNLEdBQXlCOztBQUNoQyxtQkFBS04sV0FBTCxDQUFpQk0sR0FBakIsRUFBc0JELE1BQXRCLEdBQStCLENBQS9CO0FBQ0Q7QUFISTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSU47QUFDRCxlQUFPLElBQVA7QUFDRDs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUE3REU7QUFBQTtBQUFBLG9DQStEZ0JFLEdBL0RoQixFQStEaUQ7QUFBQTs7QUFBQSxZQUE1QkMsSUFBNEIsdUVBQXJCLEVBQXFCO0FBQUEsWUFBakJDLE9BQWlCLHVFQUFQLEtBQU87O0FBQzdDLFlBQUksS0FBS1QsV0FBVCxFQUFzQjtBQUNwQixjQUFJLE9BQU9PLEdBQVAsSUFBYyxRQUFsQixFQUE0QkEsTUFBTSxJQUFJVixLQUFKLENBQVVVLEdBQVYsRUFBZUMsSUFBZixFQUFxQkMsT0FBckIsQ0FBTjtBQUM1QkYsY0FBSUcsTUFBSixHQUFhSCxJQUFJRyxNQUFKLElBQWMsSUFBM0I7QUFDQUgsY0FBSUksYUFBSixHQUFvQixJQUFwQjs7QUFFQSxXQUFDSixJQUFJSyxJQUFMLEVBQVcsR0FBWCxFQUFnQkMsT0FBaEIsQ0FBd0IsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLEdBQVgsRUFBbUI7QUFDekMsZ0JBQUksTUFBS2hCLFdBQUwsQ0FBaUJjLEdBQWpCLENBQUosRUFBMkI7QUFDekIsa0JBQUlHLFlBQVksTUFBS2pCLFdBQUwsQ0FBaUJjLEdBQWpCLEVBQXNCSSxLQUF0QixDQUE0QixDQUE1QixDQUFoQjtBQUNBRCx3QkFBVUosT0FBVixDQUFrQixVQUFDTSxFQUFEO0FBQUEsdUJBQVFBLEdBQUdaLEdBQUgsQ0FBUjtBQUFBLGVBQWxCO0FBQ0Q7QUFDRixXQUxEO0FBTUQ7QUFDRCxlQUFPLElBQVA7QUFDRDs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7O0FBbkZFO0FBQUE7QUFBQSwyQkFxRmM7QUFBQSwwQ0FBTmEsSUFBTTtBQUFOQSxjQUFNO0FBQUE7O0FBQ1YsYUFBS0MsZ0JBQUwsQ0FBc0JDLEtBQXRCLENBQTRCLElBQTVCLEVBQWtDRixJQUFsQztBQUNEOztBQUVMOztBQUVBOztBQTNGRTtBQUFBO0FBQUEsNEJBNkZlO0FBQUEsMkNBQU5BLElBQU07QUFBTkEsY0FBTTtBQUFBOztBQUNYLGFBQUtDLGdCQUFMLENBQXNCQyxLQUF0QixDQUE0QixJQUE1QixFQUFrQ0YsSUFBbEM7QUFDRDs7QUFFTDs7QUFFQTs7QUFuR0U7QUFBQTtBQUFBLDZCQXFHZTtBQUFBLDJDQUFMQSxJQUFLO0FBQUxBLGNBQUs7QUFBQTs7QUFDWCxhQUFLRyxhQUFMLENBQW1CRCxLQUFuQixDQUF5QixJQUF6QixFQUErQkYsSUFBL0I7QUFDRDs7QUFHTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFySEU7QUFBQTtBQUFBLGtDQXVIY2IsR0F2SGQsRUF1SG1CO0FBQ2YsWUFBSUEsSUFBSUUsT0FBUixFQUFpQixLQUFLYyxhQUFMLENBQW1CaEIsR0FBbkI7QUFDbEI7QUF6SEg7O0FBQUE7QUFBQTtBQTJIRCxDQTlIRCIsImZpbGUiOiJtb2R1bGUvY29yZS9ldmVudC9kaXNwYXRjaGVyLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
