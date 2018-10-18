import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Component from 'core/component/component';
import Model from './model';
import View from './view';

class AggregateDataTab extends Component {
  constructor(settings = {}) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
    Utils.bindMethods(this, ['_onAddRequest', '_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest',
      '_onGraphSelectionChange'])

    Globals.get('Relay').addEventListener('AggregateData.AddRequest', this._onAddRequest);
    this.view().addEventListener('AggregateTab.ToggleRequest', this._onToggleRequest)
    this.view().addEventListener('LegendRow.ShowToggleRequest', this._onResultToggleRequest)
    this.view().addEventListener('LegendRow.ClearRequest', this._onClearRequest)
    this.view().addEventListener('Legend.ClearAllRequest', this._onClearAllRequest)
    this.view().addEventListener('AggregateTab.GraphSelectionChange', this._onGraphSelectionChange)
  }

  hide() {
    this.view().hide();
  }

  show() {
    this.view().show();
  }

  _onAddRequest(evt) {
    this._model.addDataSet(evt.data.data);
  }

  _onToggleRequest(evt) {
    this._model.toggle();
    Globals.get('Logger').log({
      type: this._model.get('open') ? 'open' : 'close',
      category: 'aggregate',
      data: {
        displayState: this._model.getDisplayState(),
        visualization: this.view().getCurrentVisualization()
      }
    })
  }

  _onResultToggleRequest(evt) {
    this._model.toggleResult(evt.data.resultId);
    Globals.get('Logger').log({
      type: 'result_toggle',
      category: 'aggregate',
      data: {
        displayState: this._model.getDisplayState(),
        visualization: this.view().getCurrentVisualization()
      }
    })
  }

  _onClearRequest(evt) {
    this._model.clearResult(evt.data.resultId);
    Globals.get('Logger').log({
      type: 'remove_data',
      category: 'aggregate',
      data: {
        resultId: evt.data.resultId,
        displayState: this._model.getDisplayState(),
        visualization: this.view().getCurrentVisualization()
      }
    })
  }

  _onClearAllRequest(evt) {
    this._model.clearResultGroup(evt.data.experimentId);
    Globals.get('Logger').log({
      type: 'remove_group',
      category: 'aggregate',
      data: {
        experimentId: evt.data.experimentId,
        displayState: this._model.getDisplayState(),
        visualization: this.view().getCurrentVisualization()
      }
    })
  }

  _onGraphSelectionChange(evt) {
    Globals.get('Logger').log({
      type: 'visualization_change',
      category: 'aggregate',
      data: {
        displayState: this._model.getDisplayState(),
        visualization: this.view().getCurrentVisualization()
      }
    })
  }

  destroy() {
    Globals.get('Relay').removeEventListener('AggregateData.AddRequest', this._onAddRequest);
    return super.destroy();
  }
}

AggregateDataTab.create = (data = {}) => {
  return new AggregateDataTab({ modelData: data })
}

export default AggregateDataTab;
