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
      Utils.bindMethods(this, ['_onExperimentLoaded', '_onModelLoaded', '_onModelResultsRequest', '_onPhaseChange',
        '_onExperimentCountChange']);

      this._currentExperiment = null;
      this._currentModel = null;

      this._view = new View();
      this._view.addEventListener('ResultsView.RequestModelData', this._onModelResultsRequest);

      this._firstModelSkip = {};

      Globals.get('Relay').addEventListener('Experiment.Loaded', this._onExperimentLoaded);
      Globals.get('Relay').addEventListener('EuglenaModel.Loaded', this._onModelLoaded);
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
      Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange);
      Globals.get('Relay').addEventListener('EuglenaModel.directModelComparison', this._onExperimentLoaded);
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
      if (evt.data.directModelComparison) { // Triggered by the activation of model comparison
        var results = Globals.get('currentExperimentResults');
        var exp = {configuration: Globals.get('currentLightData')};
        this._view.handleExperimentResults(exp, results, true);
      } else if (evt.data.experiment.id != this._currentExperiment) {
        this._currentExperiment = evt.data.experiment.id;

        if (evt.data.experiment.id != '_new') {
          EugUtils.getLiveResults(evt.data.experiment.id).then((results) => {
            Globals.set('currentExperimentResults', results);
            Globals.set('currentLightData',evt.data.experiment.configuration);
            this._view.handleExperimentResults(evt.data.experiment, results); //// THIS IS WHERE I CAN CHANGE THE GRAPH VIEW.

            if (Globals.get('directModelComparison')) { // In case model comparison is active and a new exp is loaded
              this._view.handleExperimentResults(evt.data.experiment, results, true);
            }

            if (this._modelCache && this._modelCache.model != null) {
              if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {this._view.showVideo(true);}
              this._onModelLoaded({
                data: this._modelCache
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
        if (Globals.get(`ModelTab.${evt.data.tabId}`).historyCount() != 0 && Globals.get('AppConfig.system.modelModality') == "create") { //THIS IS WHERE THE CRUX IS. WHAT IS THAT?
          return;
        }
      }
      if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {this._view.showVideo(false);}

      if (evt.data.model.id != '_new' && Globals.get('currentExperiment')) {
        if (!(this._lastModelResult && this._lastModelResult.euglenaModelId == evt.data.model.id && this._lastModelResult.experimentId == Globals.get('currentExperiment').id)) {
          EugUtils.getModelResults(Globals.get('currentExperiment').id, evt.data.model).then((results) => {
            this._view.handleModelResults(evt.data.model, results, evt.data.tabId); // THIS IS WHERE I HAVE TO DO IT WITH THE GRAPH VIEW
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

    _onModelResultsRequest(evt) {
      if (evt.data.tabId == 'none') {
        if (Globals.get('directModelComparison')) {
          Globals.set('directModelComparison',false);
          this._view.activateModelComparison();
        }
        this._lastModelResult = null;
        if (Globals.get('AppConfig.system.expModelModality') == 'sequential') { this._view.showVideo(true);}
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
      } else if (evt.data.tabId == 'both') {
        console.log('ok, we have step 1. Good luck with the rest.');

        //1. dispatch event that says to hide results__visualization and instead have a second results__visuals view.
        Globals.set('directModelComparison',true);
        this._view.activateModelComparison();
        Globals.get('Relay').dispatchEvent('EuglenaModel.directModelComparison', { 'directModelComparison': true });

      } else {

        if (Globals.get('directModelComparison')) {
          Globals.set('directModelComparison',false);
          this._view.activateModelComparison();
        }

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
      if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
        this._view.reset();
        this._view.hide();
        this._firstModelSkip = {};
      }
    }

    _onExperimentCountChange(evt) {
      if (evt.data.count && !evt.data.old) {
        this._view.show();
      } else if (!evt.data.count) {
        this._view.hide();
      }
    }
  }

})
