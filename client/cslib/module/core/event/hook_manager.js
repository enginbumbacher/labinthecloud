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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2V2ZW50L2hvb2tfbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiSG9va01hbmFnZXIiLCJfaG9va3MiLCJob29rTmFtZSIsImNhbGxiYWNrIiwicHJpb3J0eSIsInB1c2giLCJzdWJqZWN0IiwibWV0YSIsInNvcnQiLCJhIiwiYiIsImZvckVhY2giLCJob29rIiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUFBLE1BQ1pDLFdBRFk7QUFFaEIsMkJBQWM7QUFBQTs7QUFDWixXQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNEOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQWJvQjtBQUFBO0FBQUEsMkJBZVhDLFFBZlcsRUFlREMsUUFmQyxFQWVzQjtBQUFBLFlBQWJDLE9BQWEsdUVBQUgsQ0FBRzs7QUFDcEMsYUFBS0gsTUFBTCxDQUFZQyxRQUFaLElBQXdCLEtBQUtELE1BQUwsQ0FBWUMsUUFBWixLQUF5QixFQUFqRDtBQUNBLGFBQUtELE1BQUwsQ0FBWUMsUUFBWixFQUFzQkcsSUFBdEIsQ0FBMkI7QUFDekJGLG9CQUFVQSxRQURlO0FBRXpCQyxtQkFBU0E7QUFGZ0IsU0FBM0I7QUFJRDs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7O0FBNUJvQjtBQUFBO0FBQUEsNkJBOEJURixRQTlCUyxFQThCQ0ksT0E5QkQsRUE4QnFCO0FBQUEsWUFBWEMsSUFBVyx1RUFBSixFQUFJOztBQUNuQyxZQUFJLEtBQUtOLE1BQUwsQ0FBWUMsUUFBWixDQUFKLEVBQTJCO0FBQ3pCLGVBQUtELE1BQUwsQ0FBWUMsUUFBWixFQUFzQk0sSUFBdEIsQ0FBMkIsVUFBQ0MsQ0FBRCxFQUFHQyxDQUFILEVBQVM7QUFDbEMsbUJBQU9BLEVBQUVOLE9BQUYsR0FBWUssRUFBRUwsT0FBckI7QUFDRCxXQUZEO0FBR0EsZUFBS0gsTUFBTCxDQUFZQyxRQUFaLEVBQXNCUyxPQUF0QixDQUE4QixVQUFDQyxJQUFELEVBQVU7QUFDdENOLHNCQUFVTSxLQUFLVCxRQUFMLENBQWNVLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUJQLE9BQXpCLEVBQWtDQyxJQUFsQyxDQUFWO0FBQ0QsV0FGRDtBQUdEO0FBQ0QsZUFBT0QsT0FBUDtBQUNEO0FBeENlOztBQUFBO0FBQUE7O0FBMENsQixTQUFPLElBQUlOLFdBQUosRUFBUDtBQUNELENBM0NEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2V2ZW50L2hvb2tfbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEhvb2tNYW5hZ2VyXG4vLyA9PT09PT09PT09PVxuXG4vLyBBIHN0YXRpYyBjbGFzcyB0byBoYW5kbGUgc3luY2hyb25vdXMgcmVzcG9uc2VzLiBUaGUgcHJpbWFyeSBnb2FsIG9mIHRoaXMgY2xhc3Ncbi8vIGlzIHRvIHByb3ZpZGUgYSBzdGFuZGFyZCB3YXkgdG8gYWxsb3cgZm9yIGN1c3RvbWl6YXRpb24uXG5cbi8vIFRoZSBtYWluIGRpZmZlcmVuY2UgYmV0d2VlbiBob29rcyBhbmQgZXZlbnRzIGFyZSB0aGF0IHRoZXkgYXJlIHJlc3BvbnNlcyBhbmRcbi8vIHJlYWN0aW9ucywgcmVzcGVjdGl2ZWx5LiBFdmVudHMgYXJlIGxpc3RlbmluZyBmb3IgdGhlIGNvbXBsZXRpb24gb2YgYSBwcm9jZXNzLFxuLy8gc28gdGhhdCB0aGV5IGNhbiByZWFjdCBhcHByb3ByaWF0ZWx5LiBIb29rcyBhcmUgYSBvcGVuaW5ncyB0byBpbmplY3QgY29kZSBpblxuLy8gdGhlIG1pZGRsZSBvZiBhIHByb2Nlc3MsIHRvIGFsdGVyIGl0IGluIHNvbWUgd2F5LiBBcyBzdWNoLCBob29rcyBhcmVcbi8vIG5lY2Vzc2FyaWx5IHN5bmNocm9ub3VzLCB3aGVyZWFzIGV2ZW50cyBhcmUgbm90LlxuXG5cbmRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjbGFzcyBIb29rTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLl9ob29rcyA9IHt9O1xuICAgIH1cbiAgICBcbi8vIFB1YmxpYyBBUElcbi8vIC0tLS0tLS0tLS1cblxuLy8gYGhvb2soaG9va05hbWUsIGNhbGxiYWNrLCBwcmlvcml0eSA9IDApYFxuXG4vLyBUaWVzIGEgY2FsbGJhY2sgdG8gYSBuYW1lZCBob29rLiBQcmlvcml0eSBhbGxvd3MgZm9yIGZpbmUtZ3JhaW5lZCBjb250cm9sXG4vLyBvdmVyIHRoZSBvcmRlcmluZyBvZiBjYWxsYmFja3MuIEhpZ2ggdmFsdWVkIHByaW9yaXR5IChlLmcuIDEwLjcpIG9jY3Vyc1xuLy8gYmVmb3JlIGxvdyB2YWx1ZWQgKGUuZy4gLTgpLlxuICAgIFxuICAgIGhvb2soaG9va05hbWUsIGNhbGxiYWNrLCBwcmlvcnR5ID0gMCkge1xuICAgICAgdGhpcy5faG9va3NbaG9va05hbWVdID0gdGhpcy5faG9va3NbaG9va05hbWVdIHx8IFtdO1xuICAgICAgdGhpcy5faG9va3NbaG9va05hbWVdLnB1c2goe1xuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgIHByaW9ydHk6IHByaW9ydHlcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIFxuLy8gYGludm9rZShob29rTmFtZSwgc3ViamVjdCwgYXJncy4uLilgXG5cbi8vIEludm9rZXMgYSBob29rIGJ5IG5hbWUuIFRoZSBgc3ViamVjdGAgYXJndW1lbnQgaXMgdGhlIG9iamVjdCB0byBiZSBtb2RpZmllZFxuLy8gYW5kIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFja3MuIElmIG11bHRpcGxlIHZhbHVlcyBhcmUgcmVxdWlyZWQsIGBzdWJqZWN0YFxuLy8gc2hvdWxkIGJlIGFuIG9iamVjdCBvciBhcnJheS5cbiAgICBcbiAgICBpbnZva2UoaG9va05hbWUsIHN1YmplY3QsIG1ldGEgPSB7fSkge1xuICAgICAgaWYgKHRoaXMuX2hvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgICB0aGlzLl9ob29rc1tob29rTmFtZV0uc29ydCgoYSxiKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGIucHJpb3J0eSAtIGEucHJpb3J0eTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2hvb2tzW2hvb2tOYW1lXS5mb3JFYWNoKChob29rKSA9PiB7XG4gICAgICAgICAgc3ViamVjdCA9IGhvb2suY2FsbGJhY2suY2FsbChudWxsLCBzdWJqZWN0LCBtZXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3ViamVjdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ldyBIb29rTWFuYWdlcigpO1xufSk7Il19
