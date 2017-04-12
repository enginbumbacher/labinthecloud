define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');
  
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),

    ModelHistoryForm = require('../history/form'),
    ModelForm = require('../form/form'),
    NameForm = require('../nameform/form');

  class ModelTab extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, [
        '_onSimluateRequest', '_onSaveRequest', '_onAggregateRequest',
        '_onNameCancel', '_onNameSubmit', '_onGlobalsChange', '_loadModelInForm',
        '_onHistorySelectionChange', '_onConfigChange'
      ]);

      this._history = ModelHistoryForm.create({
        id: `model_history__${this._model.get("id")}`,
        modelType: this._model.get('modelType')
      });
      this._history.addEventListener('Form.FieldChanged', this._onHistorySelectionChange);

      this._form = ModelForm.create({
        modelType: this._model.get('modelType'),
        fieldConfig: this._model.get('parameters'),
        euglenaCountConfig: this._model.get('euglenaCount')
      })
      this._form.addEventListener('Form.FieldChanged', this._onConfigChange);
      this._form.view().addEventListener('ModelForm.Simulate', this._onSimluateRequest);
      this._form.view().addEventListener('ModelForm.Save', this._onSaveRequest);
      this._form.view().addEventListener('ModelForm.AddToAggregate', this._onAggregateRequest);

      this._nameForm = NameForm.create();
      this._nameForm.view().addEventListener('ModelSave.Submit', this._onNameSubmit);
      this._nameForm.view().addEventListener('ModelSave.Cancel', this._onNameCancel);
      this.view().addChild(this._history.view());
      this.view().addChild(this._form.view());

      Globals.addEventListener('Model.Change', this._onGlobalsChange);
    }

    id() {
      return this._model.get('id');
    }

    _onGlobalsChange(evt) {
      switch(evt.data.path) {
        case 'student_id':
          this._history.update().then(() => {
            const hist = this._history.getHistory()
            if (hist.length) {
              return this._history.import({
                model_history_id: hist[hist.length - 1]
              })
            } else {
              return true;
            }
          }).then(() => {
            this._loadModelInForm(this._history.export().model_history_id);
          })
        break;
      }
    }

    _onHistorySelectionChange(evt) {
      this._loadModelInForm(evt.currentTarget.export().model_history_id);
    }

    _onConfigChange(evt) {
      this._history.import({ model_history_id: '_new' });
      this._lastSimulationId = null;
    }

    _loadModelInForm(id) {
      if (!id) return;
      if (id != '_new') {
        Utils.promiseAjax(`/api/v1/EuglenaModels/${id}`).then((data) => {
          this._form.removeEventListener('Form.FieldChanged', this._onConfigChange)
          this._form.import(data.configuration).then(() => {
            this._form.addEventListener('Form.FieldChanged', this._onConfigChange)
            Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
              model: data
            })
          })
        })
      } else {
        Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
          model: {
            id: '_new'
          }
        })
      }
    }

    _onSimluateRequest(evt) {
      Utils.promiseAjax('/api/v1/Results', {
        method: 'POST',
        data: JSON.stringify({
          fps: this._model.get('simulationFps'),
          model: {
            modelType: this._model.get('modelType'),
            configuration: this._form.export()
          },
          experimentId: Globals.get('currentExperiment').id
        }),
        contentType: 'application/json'
      }).then((data) => {
        this._lastSimulationId = data.id;
        Globals.get('Relay').dispatchEvent('Simulation.Run', {
          results: data
        })
      })
    }

    _onSaveRequest(evt) {
      Globals.get('InteractiveModal').display(this._nameForm.view())
    }

    _onNameSubmit(evt) {
      let model;
      this._nameForm.validate().then((validation) => {
        return Utils.promiseAjax('/api/v1/EuglenaModels', {
          method: 'POST',
          data: JSON.stringify({
            studentId: Globals.get('student_id'),
            configuration: this._form.export(),
            modelType: this._model.get('modelType'),
            name: this._nameForm.export().name
          }),
          contentType: 'application/json'
        })
      }, (err) => {
        // do nothing
      }).then((data) => {
        if (!data) return;
        model = data;
        if (this._lastSimulationId) {
          return Utils.promiseAjax(`/api/v1/Results/${this._lastSimulationId}`, {
            method: 'PATCH',
            data: JSON.stringify({
              euglenaModelId: model.id
            }),
            contentType: 'application/json'
          })
        } else {
          return Utils.promiseAjax('/api/v1/Results', {
            method: 'POST',
            data: JSON.stringify({
              fps: this._model.get('simulationFps'),
              euglenaModelId: model.id,
              experimentId: Globals.get('currentExperiment').id
            }),
            contentType: 'application/json'
          })
        }
      }).then((results) => {
        Globals.get('InteractiveModal').hide().then(() => {
          this._nameForm.clear()
        });
        return this._history.update()
      }).then(() => {
        this._history.import({
          model_history_id: model.id
        })
      })
    }

    _onNameCancel(evt) {
      Globals.get('InteractiveModal').hide().then(() => {
        this._nameForm.clear()
      });
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