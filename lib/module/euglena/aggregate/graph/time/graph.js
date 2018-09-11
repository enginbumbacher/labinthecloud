import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Component from 'core/component/component';
import Model from './model';
import View from './view';

class AggregateTimeGraph extends Component {
  constructor(settings) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
    Utils.bindMethods(this, ['_onEnableRequest', '_onDisableRequest'])
    this._model.addEventListener('AggregateGraph.EnableRequest', this._onEnableRequest);
    this._model.addEventListener('AggregateGraph.DisableRequest', this._onDisableRequest);
  }

  _onEnableRequest(evt) {
    this.dispatchEvent(evt);
  }
  _onDisableRequest(evt) {
    this.dispatchEvent(evt);
  }

  update(datasets) {
    this._model.update(datasets);
  }

  label() {
    return this._model.get('label');
  }
  id() {
    return this._model.get('id');
  }

  toggleResult(resId, shown) {
    this.view().toggleResult(resId, shown)
  }
}
AggregateTimeGraph.create = (data) => {
  return new AggregateTimeGraph({ modelData: data })
}

export default AggregateTimeGraph;
