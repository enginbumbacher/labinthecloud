define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

  class EuglenaDisplay extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);

      this._lastRender = 0;
    }

    render(lights, time) {
      let dT = time - this._lastRender;
      if (this._lastRender > time) {
        dT = time;
      }
      this.view().render({
        lights: lights,
        dT: dT,
        model: this._model
      });
      this._lastRender = time;
    }
  }

  EuglenaDisplay.create = (data = {}) => new EuglenaDisplay({ modelData: data });

  return EuglenaDisplay;
})