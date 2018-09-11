// Module
// ======

// Base class for modules. As described in the Application class, modules are
// processed in the following order: load, init, run.

import EventDispatcher from 'core/event/dispatcher';
import Utils from 'core/util/utils';

export default class Module extends EventDispatcher {
// Loading returns a Promise that gets resolved when the loading process is
// completed.
//
// The requirements of the loading process may be different for each
// module, but the default assumes that there are subresources that are
// handled in a preload stage.
  load() {
    return Promise.all(this.listPreload())
      .then((loaded) => this.handlePreload.apply(null, loaded));
  }

// Assuming you are using the default process, `listPreload()` should return
// an array of Promises that will load the prerequisites.
  listPreload() {
    return []
  }

// `handlePreload()` will then accept and make use of those prerequisites
// accordingly.
  handlePreload() {}

// Once the loading process is complete, modules are given a chance to run any
// initialization they might have. Generally speeking, this is where modules
// are expected to set up event listeners or establish hooks with the
// HookManager.
  init() {
    return Promise.resolve(true)
  }

// After all modules have been initialized, they are allowed to `run`. This is
// where the module is expected to kick into action.
  run() {}
};
