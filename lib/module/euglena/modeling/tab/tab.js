define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view');

  class ModelingDataTab extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest'])

      this.view().addEventListener('ModelingTab.ToggleRequest', this._onToggleRequest)
    }

    hide() {
      this.view().hide();
    }

    show() {
      this.view().show();
    }

    _onToggleRequest(evt) {
      this._model.toggle();
      Globals.get('Logger').log({
        type: this._model.get('open') ? 'open' : 'close',
        category: 'modeling',
        data: {
          displayState: this._model.getDisplayState(),
          visualization: ''//this.view().getCurrentVisualization()
        }
      })
    }

    _onResultToggleRequest(evt) {
      //this._model.toggleResult(evt.data.resultId);
      Globals.get('Logger').log({
        type: 'result_toggle',
        category: 'modeling',
        data: {
          displayState: this._model.getDisplayState(),
          visualization: ''//this.view().getCurrentVisualization()
        }
      })
    }

    _onClearRequest(evt) {
      //this._model.clearResult(evt.data.resultId);
      Globals.get('Logger').log({
        type: 'remove_data',
        category: 'modeling',
        data: {
          resultId: evt.data.resultId,
          displayState: this._model.getDisplayState(),
          visualization: ''//this.view().getCurrentVisualization()
        }
      })
    }

    _onClearAllRequest(evt) {
      //this._model.clearResultGroup(evt.data.experimentId);
      Globals.get('Logger').log({
        type: 'remove_group',
        category: 'modeling',
        data: {
          experimentId: evt.data.experimentId,
          displayState: this._model.getDisplayState(),
          visualization: ''//this.view().getCurrentVisualization()
        }
      })
    }

  }

  ModelingDataTab.create = (data = {}) => {
    return new ModelingDataTab({ modelData: data })
  }

  return ModelingDataTab;
})
