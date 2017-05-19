define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager')
  
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view');

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

  return LightGrid;
})