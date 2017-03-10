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
        var priorty = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

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
        var meta = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2V2ZW50L2hvb2tfbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQUEsTUFDWixXQURZO0FBRWhCLDJCQUFjO0FBQUE7O0FBQ1osV0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNEOzs7Ozs7Ozs7OztBQUplO0FBQUE7QUFBQSwyQkFlWCxRQWZXLEVBZUQsUUFmQyxFQWVzQjtBQUFBLFlBQWIsT0FBYSx5REFBSCxDQUFHOztBQUNwQyxhQUFLLE1BQUwsQ0FBWSxRQUFaLElBQXdCLEtBQUssTUFBTCxDQUFZLFFBQVosS0FBeUIsRUFBakQ7QUFDQSxhQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQXNCLElBQXRCLENBQTJCO0FBQ3pCLG9CQUFVLFFBRGU7QUFFekIsbUJBQVM7QUFGZ0IsU0FBM0I7QUFJRDs7Ozs7Ozs7QUFyQmU7QUFBQTtBQUFBLDZCQThCVCxRQTlCUyxFQThCQyxPQTlCRCxFQThCcUI7QUFBQSxZQUFYLElBQVcseURBQUosRUFBSTs7QUFDbkMsWUFBSSxLQUFLLE1BQUwsQ0FBWSxRQUFaLENBQUosRUFBMkI7QUFDekIsZUFBSyxNQUFMLENBQVksUUFBWixFQUFzQixJQUF0QixDQUEyQixVQUFDLENBQUQsRUFBRyxDQUFILEVBQVM7QUFDbEMsbUJBQU8sRUFBRSxPQUFGLEdBQVksRUFBRSxPQUFyQjtBQUNELFdBRkQ7QUFHQSxlQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQXNCLE9BQXRCLENBQThCLFVBQUMsSUFBRCxFQUFVO0FBQ3RDLHNCQUFVLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUIsT0FBekIsRUFBa0MsSUFBbEMsQ0FBVjtBQUNELFdBRkQ7QUFHRDtBQUNELGVBQU8sT0FBUDtBQUNEO0FBeENlOztBQUFBO0FBQUE7O0FBMENsQixTQUFPLElBQUksV0FBSixFQUFQO0FBQ0QsQ0EzQ0QiLCJmaWxlIjoibW9kdWxlL2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
