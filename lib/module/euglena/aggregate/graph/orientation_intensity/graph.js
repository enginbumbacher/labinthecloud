import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Component from 'core/component/component';
import Model from './model';
import View from './view';

class OrientationIntensityGraph extends Component {
  constructor(settings) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
  }

  update(datasets) {
    this._model.update(datasets);
  }

  label() {
    return this._model.get('label');
  }

  toggleResult(resId, shown) {
    this.view().toggleResult(resId, shown)
  }
}
OrientationIntensityGraph.create = (data) => {
  return new OrientationIntensityGraph({ modelData: data })
}

export default OrientationIntensityGraph;
