define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');
  
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),

    ModelHistoryForm = require('../history/form'),
    ModelForm = require('../form/form'),
    NameForm = require('../nameform/form'),
    EugUtils = require('euglena/utils');

  class ModelTab extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, [
        '_onSimulateRequest', '_onSaveRequest', '_onAggregateRequest',
        '_onNameCancel', '_onNameSubmit', '_onGlobalsChange', '_loadModelInForm',
        '_onHistorySelectionChange', '_onConfigChange', '_onNewRequest', '_onPhaseChange'
      ]);

      this._history = ModelHistoryForm.create({
        id: `model_history__${this._model.get("id")}`,
        modelType: this._model.get('modelType')
      });
      this._history.addEventListener('Form.FieldChanged', this._onHistorySelectionChange);
      this._silenceLoadLogs = false;

      this._form = ModelForm.create({
        modelType: this._model.get('modelType'),
        fieldConfig: this._model.get('parameters'),
        euglenaCountConfig: this._model.get('euglenaCount')
      })
      this._form.addEventListener('Form.FieldChanged', this._onConfigChange);
      this._form.view().addEventListener('ModelForm.Simulate', this._onSimulateRequest);
      this._form.view().addEventListener('ModelForm.Save', this._onSaveRequest);
      this._form.view().addEventListener('ModelForm.AddToAggregate', this._onAggregateRequest);
      this._form.view().addEventListener('ModelForm.NewRequest', this._onNewRequest);

      this._nameForm = NameForm.create();
      this._nameForm.view().addEventListener('ModelSave.Submit', this._onNameSubmit);
      this._nameForm.view().addEventListener('ModelSave.Cancel', this._onNameCancel);
      this.view().addChild(this._history.view());
      this.view().addChild(this._form.view());

      Globals.addEventListener('Model.Change', this._onGlobalsChange);
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
    }

    id() {
      return this._model.get('id');
    }

    currModelId() {
      return this._currModelId;
    }

    currModel() {
      return this._currentModel;
    }

    color() {
      return this._model.get('color')
    }

    historyCount() {
      return this._history.historyCount();
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
              this._form.setState('new');
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
      this._lastSimSaved = null;
      if (this._history.export().model_history_id != '_new') {
        this._history.import({ model_history_id: '_new' });
        this._form.setState('new');
      }
    }

    _loadModelInForm(id) {
      if (!id) return;
      let oldId = this._currModelId;
      let target = id == '_new' ? null : id;
      if (oldId != target) {
        if (id != '_new') {
          this._currModelId = id;
          Utils.promiseAjax(`/api/v1/EuglenaModels/${id}`).then((data) => {
            this._form.removeEventListener('Form.FieldChanged', this._onConfigChange)
            this._currentModel = data;
            this._form.import(data.configuration).then(() => {
              this._form.addEventListener('Form.FieldChanged', this._onConfigChange)
              Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
                model: data,
                tabId: this._model.get('id')
              })
            })
            if (data.simulated) {
              this._form.setState('new')
            } else {
              this._form.setState('historical')
            }
          })
        } else {
          this._currModelId = null;
          this._currentModel = null;
          Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
            model: {
              id: '_new'
            },
            tabId: this._model.get('id')
          })
          this._form.setState('new');
        }
        if (!this._silenceLoadLogs) {
          Globals.get('Logger').log({
            type: "load",
            category: "model",
            data: {
              modelId: id,
              tab: this.id()
            }
          })
        }
      } else if (this._lastSimSaved && this._lastSimSaved.id == oldId) {
        // handle "rerunning" a simulation
        Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
          model: this._lastSimSaved,
          tabId: this._model.get('id')
        })
      }
    }

    _onSimulateRequest(evt) {
      const conf = this._form.export();

      this._saveModel({
        name: "(simulation)",
        simulated: true,
        configuration: conf
      }).then((model) => {
        this._silenceLoadLogs = true;
        this._loadModelInForm(model.id);
        this._silenceLoadLogs = false;
      })

      Globals.get('Logger').log({
        type: "simulate",
        category: "model", 
        data: {
          modelType: this._model.get('modelType'),
          configuration: conf
        }
      })
    }

    _onSaveRequest(evt) {
      Globals.get('InteractiveModal').display(this._nameForm.view())
    }

    _saveModel(data) {
      data.studentId = Globals.get('student_id');
      data.modelType = this._model.get('modelType');
      data.lab = Globals.get('AppConfig.lab');

      let saveOrUpdate;
      if (this._lastSimSaved) {
        saveOrUpdate = Utils.promiseAjax(`/api/v1/EuglenaModels/${this._lastSimSaved.id}`, {
          method: 'PATCH',
          data: JSON.stringify({
            name: data.name,
            simulated: data.simulated
          }),
          contentType: 'application/json'
        })
      } else {
        saveOrUpdate = Utils.promiseAjax('/api/v1/EuglenaModels', {
          method: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json'
        })
      }
      return saveOrUpdate.then((serverData) => {
        if (data.simulated) {
          this._lastSimSaved = serverData;
        } else {
          this._lastSimSaved = null;
        }
        if (!serverData) return;
        return serverData;
      })
    }

    _onNameSubmit(evt) {
      let model;

      this._nameForm.validate().then((validation) => {
        return this._saveModel({
          name: this._nameForm.export().name,
          configuration: this._form.export(),
          simulated: false
        })
      }).then((model) => {
        this._lastSimSaved = null;
        Globals.get('InteractiveModal').hide().then(() => {
          this._nameForm.clear()
        });
        this._silenceLoadLogs = true;
        this._history.update().then(() => {
          this._silenceLoadLogs = false;
          this._history.import({
            model_history_id: model.id
          })
        })
      })
      Globals.get('Logger').log({
        type: "save",
        category: "model",
        data: {
          configuration: this._form.export(),
          modelType: this._model.get('modelType'),
          name: this._nameForm.export().name
        }
      })
    }

    _onNameCancel(evt) {
      Globals.get('InteractiveModal').hide().then(() => {
        this._nameForm.clear()
      });
    }

    _onAggregateRequest(evt) {
      EugUtils.getModelResults(Globals.get('currentExperiment.id'), this._currentModel).then((results) => {
        Globals.get('Relay').dispatchEvent('AggregateData.AddRequest', {
          data: results
        })
      })
      Globals.get('Logger').log({
        type: "aggregate",
        category: "model",
        data: {
          modelId: this._history.export().model_history_id
        }
      })
    }

    _onNewRequest(evt) {
      this._onConfigChange(evt);
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "login") {
        this._history.import({ model_history_id: '_new' });
      }
    }
  }

  ModelTab.create = (data) => {
    return new ModelTab({ modelData: data });
  }

  return ModelTab;

})