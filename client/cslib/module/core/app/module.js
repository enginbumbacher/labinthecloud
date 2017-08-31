'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Module
// ======

// Base class for modules. As described in the Application class, modules are
// processed in the following order: load, init, run.

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Utils = require('core/util/utils');

  return function (_EventDispatcher) {
    _inherits(Module, _EventDispatcher);

    function Module() {
      _classCallCheck(this, Module);

      return _possibleConstructorReturn(this, (Module.__proto__ || Object.getPrototypeOf(Module)).apply(this, arguments));
    }

    _createClass(Module, [{
      key: 'load',

      // Loading returns a Promise that gets resolved when the loading process is
      // completed.
      //
      // The requirements of the loading process may be different for each
      // module, but the default assumes that there are subresources that are
      // handled in a preload stage.
      value: function load() {
        var _this2 = this;

        Utils.promiseRequire(this.listPreload()).then(function (loaded) {
          return _this2.handlePreload.apply(null, loaded);
        });
      }

      // Assuming you are using the default process, `listPreload()` should return
      // an array of Promises that will load the prerequisites.

    }, {
      key: 'listPreload',
      value: function listPreload() {
        return [];
      }

      // `handlePreload()` will then accept and make use of those prerequisites
      // accordingly.

    }, {
      key: 'handlePreload',
      value: function handlePreload() {}

      // Once the loading process is complete, modules are given a chance to run any
      // initialization they might have. Generally speeking, this is where modules
      // are expected to set up event listeners or establish hooks with the
      // HookManager.

    }, {
      key: 'init',
      value: function init() {
        return Promise.resolve(true);
      }

      // After all modules have been initialized, they are allowed to `run`. This is
      // where the module is expected to kick into action.

    }, {
      key: 'run',
      value: function run() {}
    }]);

    return Module;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2FwcC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwicHJvbWlzZVJlcXVpcmUiLCJsaXN0UHJlbG9hZCIsInRoZW4iLCJsb2FkZWQiLCJoYW5kbGVQcmVsb2FkIiwiYXBwbHkiLCJQcm9taXNlIiwicmVzb2x2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsa0JBQWtCRCxRQUFRLHVCQUFSLENBQXhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWOztBQUdBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkUsNkJBT1M7QUFBQTs7QUFDTEUsY0FBTUMsY0FBTixDQUFxQixLQUFLQyxXQUFMLEVBQXJCLEVBQ0dDLElBREgsQ0FDUSxVQUFDQyxNQUFEO0FBQUEsaUJBQVksT0FBS0MsYUFBTCxDQUFtQkMsS0FBbkIsQ0FBeUIsSUFBekIsRUFBK0JGLE1BQS9CLENBQVo7QUFBQSxTQURSO0FBRUQ7O0FBRUw7QUFDQTs7QUFiRTtBQUFBO0FBQUEsb0NBY2dCO0FBQ1osZUFBTyxFQUFQO0FBQ0Q7O0FBRUw7QUFDQTs7QUFuQkU7QUFBQTtBQUFBLHNDQW9Ca0IsQ0FBRTs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7O0FBekJFO0FBQUE7QUFBQSw2QkEwQlM7QUFDTCxlQUFPRyxRQUFRQyxPQUFSLENBQWdCLElBQWhCLENBQVA7QUFDRDs7QUFFTDtBQUNBOztBQS9CRTtBQUFBO0FBQUEsNEJBZ0NRLENBQUU7QUFoQ1Y7O0FBQUE7QUFBQSxJQUE0QlQsZUFBNUI7QUFrQ0QsQ0F0Q0QiLCJmaWxlIjoibW9kdWxlL2NvcmUvYXBwL21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1vZHVsZVxuLy8gPT09PT09XG5cbi8vIEJhc2UgY2xhc3MgZm9yIG1vZHVsZXMuIEFzIGRlc2NyaWJlZCBpbiB0aGUgQXBwbGljYXRpb24gY2xhc3MsIG1vZHVsZXMgYXJlXG4vLyBwcm9jZXNzZWQgaW4gdGhlIGZvbGxvd2luZyBvcmRlcjogbG9hZCwgaW5pdCwgcnVuLlxuXG5kZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnY29yZS9ldmVudC9kaXNwYXRjaGVyJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKTtcblxuICByZXR1cm4gY2xhc3MgTW9kdWxlIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbi8vIExvYWRpbmcgcmV0dXJucyBhIFByb21pc2UgdGhhdCBnZXRzIHJlc29sdmVkIHdoZW4gdGhlIGxvYWRpbmcgcHJvY2VzcyBpc1xuLy8gY29tcGxldGVkLlxuLy9cbi8vIFRoZSByZXF1aXJlbWVudHMgb2YgdGhlIGxvYWRpbmcgcHJvY2VzcyBtYXkgYmUgZGlmZmVyZW50IGZvciBlYWNoXG4vLyBtb2R1bGUsIGJ1dCB0aGUgZGVmYXVsdCBhc3N1bWVzIHRoYXQgdGhlcmUgYXJlIHN1YnJlc291cmNlcyB0aGF0IGFyZVxuLy8gaGFuZGxlZCBpbiBhIHByZWxvYWQgc3RhZ2UuXG4gICAgbG9hZCgpIHtcbiAgICAgIFV0aWxzLnByb21pc2VSZXF1aXJlKHRoaXMubGlzdFByZWxvYWQoKSlcbiAgICAgICAgLnRoZW4oKGxvYWRlZCkgPT4gdGhpcy5oYW5kbGVQcmVsb2FkLmFwcGx5KG51bGwsIGxvYWRlZCkpO1xuICAgIH1cblxuLy8gQXNzdW1pbmcgeW91IGFyZSB1c2luZyB0aGUgZGVmYXVsdCBwcm9jZXNzLCBgbGlzdFByZWxvYWQoKWAgc2hvdWxkIHJldHVyblxuLy8gYW4gYXJyYXkgb2YgUHJvbWlzZXMgdGhhdCB3aWxsIGxvYWQgdGhlIHByZXJlcXVpc2l0ZXMuXG4gICAgbGlzdFByZWxvYWQoKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbi8vIGBoYW5kbGVQcmVsb2FkKClgIHdpbGwgdGhlbiBhY2NlcHQgYW5kIG1ha2UgdXNlIG9mIHRob3NlIHByZXJlcXVpc2l0ZXNcbi8vIGFjY29yZGluZ2x5LlxuICAgIGhhbmRsZVByZWxvYWQoKSB7fVxuXG4vLyBPbmNlIHRoZSBsb2FkaW5nIHByb2Nlc3MgaXMgY29tcGxldGUsIG1vZHVsZXMgYXJlIGdpdmVuIGEgY2hhbmNlIHRvIHJ1biBhbnlcbi8vIGluaXRpYWxpemF0aW9uIHRoZXkgbWlnaHQgaGF2ZS4gR2VuZXJhbGx5IHNwZWVraW5nLCB0aGlzIGlzIHdoZXJlIG1vZHVsZXNcbi8vIGFyZSBleHBlY3RlZCB0byBzZXQgdXAgZXZlbnQgbGlzdGVuZXJzIG9yIGVzdGFibGlzaCBob29rcyB3aXRoIHRoZVxuLy8gSG9va01hbmFnZXIuXG4gICAgaW5pdCgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICB9XG5cbi8vIEFmdGVyIGFsbCBtb2R1bGVzIGhhdmUgYmVlbiBpbml0aWFsaXplZCwgdGhleSBhcmUgYWxsb3dlZCB0byBgcnVuYC4gVGhpcyBpc1xuLy8gd2hlcmUgdGhlIG1vZHVsZSBpcyBleHBlY3RlZCB0byBraWNrIGludG8gYWN0aW9uLlxuICAgIHJ1bigpIHt9XG4gIH07XG59KTsiXX0=
