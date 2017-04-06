define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');
  
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),

    ModelHistoryForm = require('../history/form'),
    ModelForm = require('../form/form');

  class ModelTab extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, [
        '_onSimluateRequest', '_onSaveRequest', '_onAggregateRequest'
      ]);

      this._history = new ModelHistoryForm({
        id: `model_history__${this._model.get("id")}`,
        modelType: this._model.get('modelType')
      });
      this._form = ModelForm.create({
        modelType: this._model.get('modelType'),
        fieldConfig: this._model.get('parameters'),
        euglenaCountConfig: this._model.get('euglenaCount')
      })
      this._form.view().addEventListener('ModelForm.Simulate', this._onSimluateRequest);
      this._form.view().addEventListener('ModelForm.Save', this._onSaveRequest);
      this._form.view().addEventListener('ModelForm.AddToAggregate', this._onAggregateRequest);
      this.view().addChild(this._history.view());
      this.view().addChild(this._form.view());
    }

    id() {
      return this._model.get('id');
    }

    _onSimluateRequest(evt) {
      this._form.export();
      Utils.promiseAjax('/api/v1/Results', {
        method: 'POST',
        data: JSON.stringify({
          fps: 30,
          model: {
            modelType: this._model.get('modelType'),
            configuration: this._form.export()
          },
          experimentId: Globals.get('currentExperiment').id
        }),
        contentType: 'application/json'
      }).then((data) => {
        Globals.get('Relay').dispatchEvent('Simulation.Run', {
          results: data
        })
      })
    }

    _onSaveRequest(evt) {
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        id: "model_save_todo",
        message: "This feature is not implemented yet.",
        autoExpire: 10,
        expireLabel: "I guess I'll wait"
      })
    }

    _onAggregateRequest(evt) {
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        id: "model_aggregate_todo",
        message: "This feature is not implemented yet.",
        autoExpire: 10,
        expireLabel: "I guess I'll wait"
      })
    }
  }

  ModelTab.create = (data) => {
    return new ModelTab({ modelData: data });
  }

  return ModelTab;

})