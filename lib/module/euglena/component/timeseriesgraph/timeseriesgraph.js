import Component from 'core/component/component';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';

class TimeSeries extends Component {
  constructor(config = {}) {
    config.modelClass = config.modelClass || Model;
    config.viewClass = config.viewClass || View;
    super(config);
  }

  id() {
    return this._model.get('id');
  }

  handleData(data, layer = 'default', lightConfig, color) {
    this._model.parseData(data, layer, lightConfig, color);
  }

  setLive(showLayerLive) {
    this._model.setLayerLive(showLayerLive);
  }

  update(timestamp) {
    this.view().update(timestamp, this._model);
  }

  reset() {
    this._model.reset();
  }
}

TimeSeries.create = (data) => new TimeSeries({ modelData: data });

export default TimeSeries;
