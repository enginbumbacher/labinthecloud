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

    handleData(data) {
      this._model.parseData(data);
    }

    update(timestamp) {
      this.view().update(timestamp, this._model);
    }
  }

  TimeSeries.create = (data) => new TimeSeries({ modelData: data });
  
  return TimeSeries;
})