// Event
// =====
//
// Base class to represent application events.

export default class Event {
  constructor(name, data = {}, bubbles = false) {
    this.name = name;
    this.data = data;
    this.bubbles = bubbles;
    this.target = null
    this.currentTarget = null
  }

  stopPropagation() {
    this.bubbles = false
  }
};
