define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')

  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view')

  class AggregateTimeGraph extends Component {
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
  AggregateTimeGraph.create = (data) => {
    return new AggregateTimeGraph({ modelData: data })
  }

  return AggregateTimeGraph;
})