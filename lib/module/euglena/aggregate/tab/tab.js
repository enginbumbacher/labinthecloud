define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view');

  class AggregateDataTab extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_onAddRequest', '_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest'])

      Globals.get('Relay').addEventListener('AggregateData.AddRequest', this._onAddRequest);
      this.view().addEventListener('AggregateTab.ToggleRequest', this._onToggleRequest)
      this.view().addEventListener('LegendRow.ShowToggleRequest', this._onResultToggleRequest)
      this.view().addEventListener('LegendRow.ClearRequest', this._onClearRequest)
      this.view().addEventListener('Legend.ClearAllRequest', this._onClearAllRequest)
    }

    _onAddRequest(evt) {
      this._model.addDataSet(evt.data.data);
    }

    _onToggleRequest(evt) {
      this._model.toggle();
    }

    _onResultToggleRequest(evt) {
      this._model.toggleResult(evt.data.resultId);
    }

    _onClearRequest(evt) {
      this._model.clearResult(evt.data.resultId);
    }

    _onClearAllRequest(evt) {
      this._model.clearResultGroup(evt.data.experimentId);
    }
  }

  AggregateDataTab.create = (data = {}) => {
    return new AggregateDataTab({ modelData: data })
  }
  
  return AggregateDataTab;
})