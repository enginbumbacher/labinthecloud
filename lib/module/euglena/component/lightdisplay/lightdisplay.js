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
      Utils.bindMethods(this, ['_onTick']);

      this.view().addEventListener('LightDisplay.Tick', this._onTick);
    }

    run(lightData) {
      this._model.set('lightData', lightData);
      this._model.start();
    }

    stop() {
      this._model.stop();
    }

    _onTick(evt) {
      this._model._onTick(evt);
      this.dispatchEvent(evt);
    }

    handleVideo(data) {
      this._model.set('runTime', data.runTime);
      this._model.set('fps', data.fps);
      this._model.set('video', data.video);
    }

    reset() {
      this._model.reset();
    }
  }
  
  LightDisplay.create = (data) => new LightDisplay({ modelData: data });

  return LightDisplay;
})