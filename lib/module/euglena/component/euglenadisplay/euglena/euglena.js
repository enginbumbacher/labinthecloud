define((require) => {
  const Controller = require('core/controller/controller'),
    Utils = require('core/util/utils'),
    View = require('./view')
  ;

  return class Euglena extends Controller {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      super(settings);
      this.controllerState = {};
    }

    view() {
      return this._view.threeObject();
    }

    setPosition(x, y, z = 0) {
      this._view.setPosition(x, y, z);
    }

    setRotation(theta) {
      this._view.setRotation(theta);
    }

    update(lights, dT, model) {
      this._view.update(lights, dT, model, this.controllerState);
    }
  }
})