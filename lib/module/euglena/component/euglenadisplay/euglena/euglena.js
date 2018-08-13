import Controller from 'core/controller/controller';
import Utils from 'core/util/utils';
import View from './view';
import Model from './model';

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

export default Euglena;
