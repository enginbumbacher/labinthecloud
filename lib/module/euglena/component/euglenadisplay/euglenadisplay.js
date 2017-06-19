define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager')
  ;

  class EuglenaDisplay extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);

      this._lastRender = 0;
    }

    handleData(results, model, color) {
      if (results.magnification) this._model.setMagnification(results.magnification);
      this._model.setTrackData(results.tracks, model, color);
    }

    render(lights, time) {
      this.view().render({
        lights: lights,
        time: time,
        model: this._model
      })
    }
  }

  EuglenaDisplay.create = (data = {}) => new EuglenaDisplay({ modelData: data });

  return EuglenaDisplay;
})