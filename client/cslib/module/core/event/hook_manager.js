"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// HookManager
// ===========

// A static class to handle synchronous responses. The primary goal of this class
// is to provide a standard way to allow for customization.

// The main difference between hooks and events are that they are responses and
// reactions, respectively. Events are listening for the completion of a process,
// so that they can react appropriately. Hooks are a openings to inject code in
// the middle of a process, to alter it in some way. As such, hooks are
// necessarily synchronous, whereas events are not.


define(function (require) {
  var HookManager = function () {
    function HookManager() {
      _classCallCheck(this, HookManager);

      this._hooks = {};
    }

    // Public API
    // ----------

    // `hook(hookName, callback, priority = 0)`

    // Ties a callback to a named hook. Priority allows for fine-grained control
    // over the ordering of callbacks. High valued priority (e.g. 10.7) occurs
    // before low valued (e.g. -8).

    _createClass(HookManager, [{
      key: "hook",
      value: function hook(hookName, callback) {
        var priorty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        this._hooks[hookName] = this._hooks[hookName] || [];
        this._hooks[hookName].push({
          callback: callback,
          priorty: priorty
        });
      }

      // `invoke(hookName, subject, args...)`

      // Invokes a hook by name. The `subject` argument is the object to be modified
      // and returned by the callbacks. If multiple values are required, `subject`
      // should be an object or array.

    }, {
      key: "invoke",
      value: function invoke(hookName, subject) {
        var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (this._hooks[hookName]) {
          this._hooks[hookName].sort(function (a, b) {
            return b.priorty - a.priorty;
          });
          this._hooks[hookName].forEach(function (hook) {
            subject = hook.callback.call(null, subject, meta);
          });
        }
        return subject;
      }
    }]);

    return HookManager;
  }();

  return new HookManager();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2V2ZW50L2hvb2tfbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiSG9va01hbmFnZXIiLCJfaG9va3MiLCJob29rTmFtZSIsImNhbGxiYWNrIiwicHJpb3J0eSIsInB1c2giLCJzdWJqZWN0IiwibWV0YSIsInNvcnQiLCJhIiwiYiIsImZvckVhY2giLCJob29rIiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUFBLE1BQ1pDLFdBRFk7QUFFaEIsMkJBQWM7QUFBQTs7QUFDWixXQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNEOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQWJvQjtBQUFBO0FBQUEsMkJBZVhDLFFBZlcsRUFlREMsUUFmQyxFQWVzQjtBQUFBLFlBQWJDLE9BQWEsdUVBQUgsQ0FBRzs7QUFDcEMsYUFBS0gsTUFBTCxDQUFZQyxRQUFaLElBQXdCLEtBQUtELE1BQUwsQ0FBWUMsUUFBWixLQUF5QixFQUFqRDtBQUNBLGFBQUtELE1BQUwsQ0FBWUMsUUFBWixFQUFzQkcsSUFBdEIsQ0FBMkI7QUFDekJGLG9CQUFVQSxRQURlO0FBRXpCQyxtQkFBU0E7QUFGZ0IsU0FBM0I7QUFJRDs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7O0FBNUJvQjtBQUFBO0FBQUEsNkJBOEJURixRQTlCUyxFQThCQ0ksT0E5QkQsRUE4QnFCO0FBQUEsWUFBWEMsSUFBVyx1RUFBSixFQUFJOztBQUNuQyxZQUFJLEtBQUtOLE1BQUwsQ0FBWUMsUUFBWixDQUFKLEVBQTJCO0FBQ3pCLGVBQUtELE1BQUwsQ0FBWUMsUUFBWixFQUFzQk0sSUFBdEIsQ0FBMkIsVUFBQ0MsQ0FBRCxFQUFHQyxDQUFILEVBQVM7QUFDbEMsbUJBQU9BLEVBQUVOLE9BQUYsR0FBWUssRUFBRUwsT0FBckI7QUFDRCxXQUZEO0FBR0EsZUFBS0gsTUFBTCxDQUFZQyxRQUFaLEVBQXNCUyxPQUF0QixDQUE4QixVQUFDQyxJQUFELEVBQVU7QUFDdENOLHNCQUFVTSxLQUFLVCxRQUFMLENBQWNVLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUJQLE9BQXpCLEVBQWtDQyxJQUFsQyxDQUFWO0FBQ0QsV0FGRDtBQUdEO0FBQ0QsZUFBT0QsT0FBUDtBQUNEO0FBeENlOztBQUFBO0FBQUE7O0FBMENsQixTQUFPLElBQUlOLFdBQUosRUFBUDtBQUNELENBM0NEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2V2ZW50L2hvb2tfbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
