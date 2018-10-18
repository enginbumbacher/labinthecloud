// Application
// ===========
// 
// Base class for an application. Handles module integration.
// 
// All modules are deal with in phases:
// 
// * `load`: All modules are loaded
// * `init`: An initialization step allows modules an opportunity to run whatever setup is necessary before the application kicks off.
// * `run`: All modules are assumed to be in a ready state, and are notified 

import $ from 'jquery';
import EventDispatcher from 'core/event/dispatcher';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Globals from 'core/model/globals';
import View from 'core/app/view';

export default class Application extends EventDispatcher {
// `new Application(domRoot)`

// Constructor method. Accepts a single argument of the application's root
// DOM element.
  constructor(domRoot, name) {
    super();
    this._domRoot = $(domRoot);
    this._name = name;
    Globals.set(`${this._name}.App`, this);
  }

  _buildModuleRequirements(module, reqSet) {
    if (module.requires && module.requires.length) module.requires.forEach((req) => {
      if (!reqSet.has(req)) {
        reqSet.add(req);
        this._buildModuleRequirements(req, reqSet);
      }
    })
  }

// `load()`
  load() {
    let promises, moduleClasses;
    promises = [];
// First, the application invoke the `Application.Modules` hook to obtain
// a set of all desired modules.
    moduleClasses = HM.invoke('Application.Modules', this.moduleSet(), {
      app: this._name
    });
// The set is then modified to ensure any requirements are also managed
    Array.from(moduleClasses).forEach((mc) => {
      this._buildModuleRequirements(mc, moduleClasses);
    });

// Then the modules are set to load, with the promises returned from their
// load functions stored in an array.
    this._modules = [];
    moduleClasses.forEach((mc) => {
      let module = new mc({
        app: this._name
      });
      this._modules.push(module);
      promises.push(module.load());
    });
// Finally, the View class load promise is created and added to the array.
    promises.push(this.buildView());
    // let viewClassPath = HM.invoke('Application.ViewClass', 'core/app/view');
    // promises.push(Utils.promiseRequire(viewClassPath).then((reqs) => {
    //   let viewClass = reqs[0];
    //   this.view = new viewClass();
    //   this._domRoot.append(this.view.$dom()); // REACT EDIT
    //   this.dispatchEvent('Application.ViewReady', {});
    // }));
    return Promise.all(promises);
  }

  moduleSet() {
    return new Set();
  }

  viewClass() {
    return View;
  }

  buildView() {
    const viewClass = this.viewClass();
    this.view = new viewClass();
    this._domRoot.append(this.view.$dom());
    this.dispatchEvent('Application.ViewReady', {
      app: this._name
    });
    Promise.resolve(this.view);
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
    this.dispatchEvent('Application.Run', {
      app: this._name
    });
  }

  destroy() {
    return Promise.all(this._modules.map((m) => m.destroy())).then(() => {
      this.view.$dom().remove();
      Globals.set(`${this._name}.App`, null);
      this.dispatchEvent('Application.Destroyed', {
        app: this._name
      })
    })
  }
}
