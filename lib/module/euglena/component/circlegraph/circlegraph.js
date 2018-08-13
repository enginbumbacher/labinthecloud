import Component from 'core/component/component';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';

class CircleHistogram extends Component {
  constructor(config = {}) {
    config.modelClass = config.modelClass || Model;
    config.viewClass = config.viewClass || View;
    super(config);
  }

  id() {
    return this._model.get('id');
  }

  handleData(data, layer = 'default', lightConfig, color) {
    this._model.parseData(data, layer, color);
  }

  setLive(showLayerLive) {
    this._model.setLayerLive(showLayerLive);
  }

  update(timestamp, lights) {
    this._model.update(timestamp, lights);
  }

  reset() {
    this._model.reset();
  }
}

CircleHistogram.create = (data) => new CircleHistogram({ modelData: data });

export default CircleHistogram;
