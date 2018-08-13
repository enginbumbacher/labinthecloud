import Component from 'core/component/component';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';

class Histogram extends Component {
  constructor(config = {}) {
    config.modelClass = config.modelClass || Model;
    config.viewClass = config.viewClass || View;
    super(config);
  }

  id() {
    return this._model.get('id');
  }

  handleData(data, layer = 'default', color) {
    this._model.parseData(data, layer, color);
  }

  setLive(showLayerLive) {
    this._model.setLayerLive(showLayerLive);
  }
  
  update(timestamp) {
    this._model.update(timestamp);
  }

  reset() {
    this._model.reset();
  }
}

Histogram.create = (data) => new Histogram({ modelData: data });

export default Histogram;
