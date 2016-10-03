// Model
// =====
//
// A base class for models. Provides support for default-driven models

define((require) => {
  const EventDispatcher = require('core/event/dispatcher'),
    Utils = require('core/util/utils'),
    defaults = {
      data: {},
      defaults: {}
    };

  return class Model extends EventDispatcher {
    
// `new Model({data: {}, defaults: {}})`

// The constructor accepts two parameters, the desired data object and the default
// data object. The merge of these two gets set to the private `this._data` attribute.
    
    constructor(settings = {}) {
      super();
      settings = Utils.ensureDefaults(settings, defaults);
      this._data = Utils.ensureDefaults(settings.data, settings.defaults);
    }
    
// Public API
// ----------
//
// `get(path, trace = false)`
//
// Returns the value found in `path`.
//
// This method drills down into `this._data` along the specified dot-separated path.
    
    get(path, trace = false) {
      let parts, target, targets;
      parts = path.split('.');
      target = this._data;

      if (trace) targets = [target];

      for (let part of parts) {
        if (target.get && typeof target.get == 'function' && target.get(part)) {
          target = target.get(part);
        } else if (target[part]) {
          target = target[part];
        } else {
          target = null;
          break;
        }
        if (trace) targets.push(target);
      }

      if (trace) {
        return targets;
      } else {
        return target;
      }
    }
    
    
// `set(path, value)`

// Sets the value to the provided dot-separated path. If elements of the path do
// not currently exist, they are created as objects.
    
    set(path, value, forceEvent = false) {
      let paths, target, part, old;
      if (value != this.get(path)) {
        paths = path.split('.');
        target = this._data;

        for (var i = 0; i < paths.length; i++) {
          part = paths[i];
          if (i == paths.length - 1) {
            if (target.set && typeof target.set == 'function') {
              old = target.get(part);
              target.set(part, value);
            } else {
              old = target[part];
              if (value == null) {
                target[part] = null;
                delete target[part];
              } else {
                target[part] = value;
              }
            }
            this.dispatchEvent('Model.Change', { path: path, value: value, old: old }, true);
          } else {
            if (target.get && typeof target.get == 'function') {
              if (!target.get(part)) target.set(part, {});
              target = target.get(part);
            } else {
              if (!target[part]) target[part] = {};
              target = target[part];
            }
          }
        }
      } else if (forceEvent || value instanceof Array) {
        this.dispatchEvent('Model.Change', { path: path, value: value }, true);
      }
    }
    
// `update(data)`

// Wholesale update of the model's data. This will only overwrite the keys defined
// by the provided update data object, and will not remove unrelated data.
    
    update(data) {
      for (let key of data) {
        let val = data[key];
        if (key == "id" && this._data.id) {
          continue;
        }
        this._data[key] = val;
      }
      this.dispatchEvent('Model.Change', { path: null, value: data }, true);
    }
    

// Events
// ------

// `Model.Change`

// Fires whenever a value in the model is changed via the `set` method.
  };
});