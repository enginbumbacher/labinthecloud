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

    initialize() {
      let euglenaManager = HM.invoke('Euglena.Manager', {
        manager: null,
        candidates: []
      });
      // console.log(euglenaManager)
      if (euglenaManager.manager) {
        for (let euglena of this._model.get('euglena')) {
          euglenaManager.manager.initialize(euglena)
        }
      }
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