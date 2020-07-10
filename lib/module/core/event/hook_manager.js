// HookManager
// ===========

// A static class to handle synchronous responses. The primary goal of this class
// is to provide a standard way to allow for customization.

// The main difference between hooks and events are that they are responses and
// reactions, respectively. Events are listening for the completion of a process,
// so that they can react appropriately. Hooks are a openings to inject code in
// the middle of a process, to alter it in some way. As such, hooks are
// necessarily synchronous, whereas events are not.


class HookManager {
  constructor() {
    this._hooks = {};
  }
  
// Public API
// ----------

// `hook(hookName, callback, priority = 0)`

// Ties a callback to a named hook. Priority allows for fine-grained control
// over the ordering of callbacks. High valued priority (e.g. 10.7) occurs
// before low valued (e.g. -8).
  
  hook(hookName, callback, priorty = 0) {
    this._hooks[hookName] = this._hooks[hookName] || [];
    this._hooks[hookName].push({
      callback: callback,
      priorty: priorty
    });
  }

  unhook(hookName, callback) {
    if (this._hooks[hookName] && this._hooks[hookName].map((h) => h.callback).includes(callback)) {
      this._hooks[hookName].splice(this._hooks[hookName].map((h) => h.callback).indexOf(callback), 1);
    }
  }
  
// `invoke(hookName, subject, args...)`

// Invokes a hook by name. The `subject` argument is the object to be modified
// and returned by the callbacks. If multiple values are required, `subject`
// should be an object or array.
  
  invoke(hookName, subject, meta = {}) {
    if (this._hooks[hookName]) {
      this._hooks[hookName].sort((a,b) => {
        return b.priorty - a.priorty;
      });
      this._hooks[hookName].forEach((hook) => {
        subject = hook.callback.call(null, subject, meta);
      });
    }
    return subject;
  }
}
export default new HookManager();
