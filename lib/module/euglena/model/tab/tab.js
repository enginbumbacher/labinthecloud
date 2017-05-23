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
        '_onHistorySelectionChange', '_onConfigChange', '_onNewRequest'
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
    }

    id() {
      return this._model.get('id');
    }

    lastResultId() {
      return this._lastSimulationId;
    }

    currModelId() {
      return this._currModelId;
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
      if (this._history.export().model_history_id != '_new') {
        this._history.import({ model_history_id: '_new' });
        this._lastSimulationId = null;
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
          })
          this._form.setState('historical');
        } else {
          this._currModelId = null;
          Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
            model: {
              id: '_new'
            },
            tabId: this._model.get('id')
          })
          this._form.setState('new');
        }
        Globals.get('Logger').log({
          type: "load",
          category: "model",
          data: {
            modelId: id,
            tab: this.id()
          }
        })
      }
    }

    _onSimulateRequest(evt) {
      const conf = this._form.export();
      // Utils.promiseAjax('/api/v1/Results', {
      //   method: 'POST',
      //   data: JSON.stringify({
      //     fps: this._model.get('simulationFps'),
      //     model: {
      //       modelType: this._model.get('modelType'),
      //       configuration: conf
      //     },
      //     experimentId: Globals.get('currentExperiment').id,
      //     initialization: this._initializeModelEuglena(conf.count)
      //   }),
      //   contentType: 'application/json'
      // })
      EugUtils.generateResults({
        experimentId: Globals.get('currentExperiment').id,
        model: {
          modelType: this._model.get('modelType'),
          configuration: conf
        },
        count: conf.count,
        magnification: Globals.get('currentExperimentResults.magnification')
      })
      .then((data) => {
        this._lastSimulationId = data.id;
        Globals.get('Relay').dispatchEvent('Simulation.Run', {
          results: data,
          tabId: this._model.get('id')
        })
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
        this._currModelId = model.id;
        if (this._lastSimulationId) {
          return Utils.promiseAjax(`/api/v1/Results/${this._lastSimulationId}`, {
            method: 'PATCH',
            data: JSON.stringify({
              euglenaModelId: model.id
            }),
            contentType: 'application/json'
          })
        } else {
          // const conf = this._form.export();
          // conf.euglenaInitialization = [];
          // for (let i = 0; i < conf.count; i++) {
          //   conf.euglenaInitialization.push({
          //     x: 0,
          //     y: 0,
          //     angle: Math.random() * Utils.TAU
          //   })
          // }
          return EugUtils.generateResults({
            euglenaModelId: model.id,
            experimentId: Globals.get('currentExperiment').id,
            count: model.count,
            magnification: Globals.get('currentExperimentResults.magnification')
          })
        }
      }).then((results) => {
        this._lastSimulationId = results.id;
        Globals.get('InteractiveModal').hide().then(() => {
          this._nameForm.clear()
        });
        return this._history.update()
      }).then(() => {
        this._history.import({
          model_history_id: model.id
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

    // _initializeModelEuglena(count) {
    //   const initialize = [];
    //   for (let i = 0; i < count; i++) {
    //     initialize.push({
    //       x: (Math.random() * 2 - 1) * 640 / (2 * Globals.get('currentExperimentResults.magnification')),
    //       y: (Math.random() * 2 - 1) * 480 / (2 * Globals.get('currentExperimentResults.magnification')),
    //       z: 0,
    //       yaw: Math.random() * Utils.TAU,
    //       roll: Math.random() * Utils.TAU,
    //       pitch: 0
    //     })
    //   }
    //   return initialize;
    // }
  }

  ModelTab.create = (data) => {
    return new ModelTab({ modelData: data });
  }

  return ModelTab;

})