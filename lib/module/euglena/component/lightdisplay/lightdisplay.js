define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils'),
    EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay')
  ;

  class LightDisplay extends Component {
    constructor(config = {}) {
      config.viewClass = config.viewClass || View;
      config.modelClass = config.modelClass || Model;
      super(config);
    }

    // handleVideo(data) {
    //   this._model.set('runTime', data.runTime);
    //   this._model.set('fps', data.fps);
    //   this._model.set('video', data.video);
    // }

    render(lights) {
      this.view().render(lights);
    }
  }
  
  LightDisplay.create = (data) => new LightDisplay({ modelData: data });

  return LightDisplay;
})