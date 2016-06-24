// Parent
// ======

// A generic container class. Parents maintain an array of children, and they
// bubble any events that their children fire.

define((require) => {
  const EventDispatcher = require('core/event/dispatcher');

  return class Parent extends EventDispatcher {
    constructor() {
      super()
      this._children = []
    }

    
// Public API
// ----------

// `addChild(child)`

// Adds the provided child to the parent's list of children. If the child belonged
// to a different parent, that relationship is dropped in favor of the new one.
    
    addChild(child) {
      if (!this._children.includes(child)) {
        if (child.parent) child.parent.removeChild(child);
        child.parent = this;
        child.addEventListener('*', this.bubbleEvent);
        this._children.push(child);
        this.dispatchEvent('Parent.ChildAdded', { child: child }, true);
      }
      return this;
    }

    
// `removeChild(child)`

// Removes the specified child from teh parent's list of children. This also drops
// the event bubbler.
    
    removeChild(child) {
      if (this._children.includes(child)) {
        child.parent = null;
        child.removeEventListener('*', this.bubbleEvent);
        this._children.splice(this._children.indexOf(child), 1);
        this.dispatchEvent('Parent.ChildRemoved', { child: child }, true);
      }
      return this;
    }

    
// Events
// ------

// `Parent.ChildAdded`

// Fires whenever a child is added. Data payload contains the `child` in question.

// `Parent.ChildRemoved`

// Fires whenever a child is removed. Data payload contains the `child` in
// question.
  };
});