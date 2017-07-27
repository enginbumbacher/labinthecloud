define((require) => {
  const HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals');

  const Module = require('core/app/module'),
    View = require('./view'),
    EugUtils = require('euglena/utils')
  ;

  return class ResultsModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onExperimentLoaded', '_onModelLoaded', '_onSimulationRun', '_onModelResultsRequest', '_onPhaseChange']);

      this._currentExperiment = null;
      this._currentModel = null;

      this._view = new View();
      this._view.addEventListener('ResultsView.RequestModelData', this._onModelResultsRequest);

      this._firstModelSkip = {};

      Globals.get('Relay').addEventListener('Experiment.Loaded', this._onExperimentLoaded);
      Globals.get('Relay').addEventListener('Simulation.Run', this._onSimulationRun);
      Globals.get('Relay').addEventListener('EuglenaModel.Loaded', this._onModelLoaded);
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
    }

    init() {
      HM.hook('Panel.Contents', (subject, meta) => {
        if (meta.id == "result") {
          subject.push(this._view);
        }
        return subject;
      }, 10);
      return super.init();
    }

    _onExperimentLoaded(evt) {
      if (evt.data.experiment.id != this._currentExperiment) {
        this._currentExperiment = evt.data.experiment.id;
        
        if (evt.data.experiment.id != '_new') {
          EugUtils.getLiveResults(evt.data.experiment.id).then((results) => {
            Globals.set('currentExperimentResults', results);
            this._view.handleExperimentResults(evt.data.experiment, results);
            if (this._modelCache && this._modelCache.model != null) {
              this._onModelLoaded({
                data: this._modelCache
              })
            } else if (this._simCache) {
              EugUtils.generateResults(this._simCache).then((res) => {
                this._onSimulationRun({
                  data: {
                    results: res,
                    simulation: this._simCache.simulation,
                    tabid: this._simCache.tabId
                  }
                })
              })
            }
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this._view.clear();
        }
      }
    }

    _onModelLoaded(evt) {
      if (!Utils.exists(this._firstModelSkip[evt.data.tabId])) {
        this._firstModelSkip[evt.data.tabId] = true;
        return;
      }
      if (evt.data.model.id != '_new' && Globals.get('currentExperiment')) {
        if (!(this._lastModelResult && this._lastModelResult.euglenaModelId == evt.data.model.id && this._lastModelResult.experimentId == Globals.get('currentExperiment').id)) {
          EugUtils.getModelResults(Globals.get('currentExperiment').id, evt.data.model).then((results) => {
            this._view.handleModelResults(evt.data.model, results, evt.data.tabId);
          })
          this._lastModelResult = {
            euglenaModelId: evt.data.model.id,
            experimentId: Globals.get('currentExperiment').id
          }
        }
        this._cacheModel(evt.data.model, evt.data.tabId);
      } else if (evt.data.model.id != '_new') {
        this._cacheModel(evt.data.model, evt.data.tabId);
      } else {
        this._view.handleModelResults(evt.data.model, null, evt.data.tabId);
        this._lastModelResult = null;
      }
    }

    _cacheModel(model, tabId) {
      if (!model.date_created) {
        Utils.promiseAjax(`/api/v1/EuglenaModels/${model.id}`).then((data) => {
          this._modelCache = {
            model: data,
            tabId: tabId
          }
        })
      } else {
        this._modelCache = {
          model: model,
          tabId: tabId
        }
      }
    }

    _onSimulationRun(evt) {
      this._simCache = {
        simulation: evt.data.simulation,
        tabId: evt.data.tabId
      }
      Utils.promiseAjax(`/api/v1/Results/${evt.data.results.id}`).then((results) => {
        return EugUtils.normalizeResults(results)
      }).then((results) => {
        this._view.handleModelResults(evt.data.simulation.model, results, evt.data.tabId);
      })
    }

    _onModelResultsRequest(evt) {
      if (evt.data.tabId == 'none') {
        this._view.handleModelResults(null, null, evt.data.tabId);
        Globals.get('Logger').log({
          type: "model_change",
          category: "results",
          data: {
            tab: evt.data.tabId
          }
        })
        this._modelCache = {
          tabId: 'none',
          model: null
        }
      } else {
        const lastResultId = Globals.get(`ModelTab.${evt.data.tabId}`).lastResultId();
        const currModel = Globals.get(`ModelTab.${evt.data.tabId}`).currModel();
        if (currModel) {
          this._onModelLoaded({
            data: {
              model: currModel,
              tabId: evt.data.tabId
            }
          })
          Globals.get('Logger').log({
            type: "model_change",
            category: "results",
            data: {
              tab: evt.data.tabId,
              modelId: currModel.id
            }
          })
        } else if (lastResultId) {
          this._onSimulationRun({
            data: {
              results: {
                id: lastResultId
              },
              tabId: evt.data.tabId
            }
          })
          this._lastModelResult = null;
          Globals.get('Logger').log({
            type: "model_change",
            category: "results",
            data: {
              tab: evt.data.tabId,
              resultId: lastResultId,
              simulation: true
            }
          })
        } else {
          this._view.handleModelResults(null, null, evt.data.tabId);
          this._lastModelResult = null;
          Globals.get('Logger').log({
            type: "model_change",
            category: "results",
            data: {
              tab: evt.data.tabId,
              resultId: null
            }
          })
        }
        Globals.get('Relay').dispatchEvent('InteractiveTabs.TabRequest', {
          tabId: `model_${evt.data.tabId}`
        })
      }
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "login") {
        this._view.reset();
        this._firstModelSkip = {};
      }
    }
  }
  
})