define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

  class BulbDisplay extends Component {
    constructor(config = {}) {
      config.viewClass = config.viewClass || View;
      config.modelClass = config.modelClass || Model;
      super(config);
    }

    render(lights) {
      this.view().render(lights);
    }
  }

  BulbDisplay.create = (data) => new BulbDisplay({ modelData: data });

  return BulbDisplay;
})
