// Application
// ===========
// 
// Base class for an application. Handles module integration.
// 
// All modules are deal with in phases:
// 
// * `load`: All modules are loaded
// * `init`:
// * `run`:

define((require) => {
  const $ = require('jquery'),
    EventDispatcher = require('core/event/dispatcher'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager'),
    Globals = require('core/model/globals');

  return class Application extends EventDispatcher {
// `new Application(domRoot)`

// Constructor method. Accepts a single argument of the application's root
// DOM element.
    constructor(domRoot) {
      super();
      this._domRoot = $(domRoot);
      Globals.set('App', this);
    }

// `load()`
    load() {
      let promises, moduleClasses;
      promises = [];
// First, the application invoke the `Application.Modules` hook to obtain
// a set of all desired modules.
      moduleClasses = HM.invoke('Application.Modules', new Set());
// The set is then modified to ensure any first-level requirements
// TODO: make requirements check recursive
      Array.from(moduleClasses).forEach((mc) => {
        if (mc.requires && mc.requires.length) mc.forEach((req) => {
          moduleClasses.add(req);
        });
      });

// Then the modules are set to load, with the promises returned from their
// load functions stored in an array.
      this._modules = [];
      moduleClasses.forEach((mc) => {
        let module = new mc();
        this._modules.push(module);
        promises.push(module.load());
      });
// Finally, the View class load promise is created and added to the array.
      let viewClassPath = HM.invoke('Application.ViewClass', 'core/app/view');
      promises.push(Utils.promiseRequire(viewClassPath).then((viewClass) => {
        this.view = new viewClass();
        this._domRoot.append(this.view.$dom()); // REACT EDIT
        this.dispatchEvent('Application.ViewReady', {});
      }));
      return Promise.all(promises);
    }

// `init()`

// Initializes all modules.
    init() {
      return Promise.all(this._modules.map((pi) => pi.init()));
    }

// `run()`

// Runs the application by running all modules.
    run() {
      this._modules.forEach((pi) => pi.run());
      this.dispatchEvent('Application.Run', {});
    }
  };
});