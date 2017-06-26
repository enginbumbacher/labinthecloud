define((require) => {
  const Controller = require('core/controller/controller'),
    Utils = require('core/util/utils'),
    View = require('./view'),
    Model = require('./model')
  ;

  class Euglena extends Controller {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);
    }

    view() {
      return this._view.threeObject();
    }

    setInitialPosition(pos) {
      this._model.setInitialPosition(pos);
    }

    update(time, bounds) {
      this._view.update(this._model.getState(time, bounds));
    }
  }

  Euglena.create = (data) => {
    return new Euglena({ modelData: data })
  }

  return Euglena;
})