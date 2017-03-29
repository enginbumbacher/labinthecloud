define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

  class LightDisplay extends Component {
    constructor(config = {}) {
      config.viewClass = config.viewClass || View;
      config.modelClass = config.modelClass || Model;
      super(config);
    }

    render(lights) {
      this.view().render(lights);
    }
  }
  
  LightDisplay.create = (data) => new LightDisplay({ modelData: data });

  return LightDisplay;
})