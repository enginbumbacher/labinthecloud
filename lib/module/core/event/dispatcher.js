// Event Dispatcher
// ================

// Base class for dispatching [Event](./event.html)s. Expect pretty much every
// class to have this somewhere in its inheritence chain.

define((require) => {
  const Event = require('./event');

  return class EventDispatcher {
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
    
    addEventListener(evtName, callback) {
      //lazily create the listener collections
      this.__listeners = this.__listeners || {};
      this.__listeners[evtName] = this.__listeners[evtName] || [];
      if (!this.__listeners[evtName].includes(callback))
        this.__listeners[evtName].push(callback);
      return this;
    }

    
// `removeEventListener(eventName, callback)`

// Stops a listener from listening to the specified event.
    
    removeEventListener(evtName, callback) {
      if (this.__listeners && this.__listeners[evtName] && this.__listeners[evtName].includes(callback))
        this.__listeners[evtName].splice(this.__listeners[evtName].indexOf(callback), 1)
      return this;
    }

    
// `dispatchEvent(event)`, `dispatchEvent(eventName, data = {}, bubbles = false)`

// Fires an event, calling all of the callbacks in the order they were added.
// If the first argument is a string, then it is assumed to be the event's name,
// and a proper Event object is created on the fly.

// Once all callbacks bound to the specific event name are fired, callbacks bound
// to all event using the wildcard ("*") name are fired.
    
    dispatchEvent(evt, data = {}, bubbles = false) {
      if (this.__listeners) {
        if (typeof evt == "string") evt = new Event(evt, data, bubbles);
        evt.target = evt.target || this;
        evt.currentTarget = this;

        [evt.name, '*'].forEach((val, ind, arr) => {
          if (this.__listeners[val]) {
            let listeners = this.__listeners[val].slice(0);
            listeners.forEach((cb) => cb(evt));
          }
        });
      }
      return this;
    }
    
// API Aliases
// ===========
// `on(eventName, callback)`

// Shorthand for `addEventListener`.
    
    on(...args) {
      this.addEventListener.apply(this, args);
    }
    
// `off(eventName, callback)`

// Shorthand for `removeEventListener`.
    
    off(...args) {
      this.addEventListener.apply(this, args);
    }
    
// `fire(event)`, `fire(eventName, data = {}, bubbles = false)`

// Shorthand for `dispatchEvent`.
    
    fire(...args){
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
    
    bubbleEvent(evt) {
      if (evt.bubbles) this.dispatchEvent(evt);
    }
  }
});