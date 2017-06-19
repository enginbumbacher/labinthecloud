define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

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

    update(timestamp) {
      this._model.update(timestamp);
    }

    reset() {
      this._model.reset();
    }
  }

  Histogram.create = (data) => new Histogram({ modelData: data });

  return Histogram;
})