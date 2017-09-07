define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

  class TimeSeries extends Component {
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
      this.view().update(timestamp, this._model);
    }

    reset() {
      this._model.reset();
    }
  }

  TimeSeries.create = (data) => new TimeSeries({ modelData: data });

  return TimeSeries;
})
