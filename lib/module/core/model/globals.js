// Globals
// =======

// A singleton instance of a Model, used to manage global data.

import EventDispatcher from 'core/event/dispatcher';
import Model from './model';

class Globals extends Model {
  constructor() {
    super({
      data: {},
      defaults: {}
    });
    this.set('Relay', new EventDispatcher());
  }
}

// Having the module return an instance of the class effectively makes the
// class a singleton without jumping through the hoops of calling
// `Globals.instance()`

export default new Globals();
