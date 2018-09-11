import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Component from 'core/component/component';
import Model from './model';
import View from './view';

class LightGrid extends Component {
  constructor(conf) {
    conf.modelClass = conf.modelClass || Model;
    conf.viewClass = conf.viewClass || View;
    super(conf);
  }

  update(lights) {
    this._model.update(lights);
  }

  reset() {
    this._model.reset()
  }
}

LightGrid.create = (data = {}) => {
  return new LightGrid({ modelData: data })
}

export default LightGrid;
