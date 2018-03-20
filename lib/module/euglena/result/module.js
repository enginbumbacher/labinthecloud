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

      if (evt.data.directModelComparison) { // Load experiment into the second video view for model comparison when activated for the first time
        //var results = Globals.get('currentExperimentResults');
        //var exp = {configuration: Globals.get('currentLightData')};
        //this._view.handleExperimentResults(exp, results, true);
      } else if (evt.data.experiment.id != this._currentExperiment) {
        this._currentExperiment = evt.data.experiment.id;

        if (evt.data.experiment.id != '_new') {
          var loadExpId = evt.data.experiment.copyOfID > 0 ? evt.data.experiment.copyOfID : evt.data.experiment.id;
          EugUtils.getLiveResults(loadExpId).then((results) => {
            Globals.set('currentExperimentResults', results);
            Globals.set('currentLightData',evt.data.experiment.configuration);

            this._view.handleExperimentResults(evt.data.experiment, results); //// THIS IS WHERE I CAN CHANGE THE GRAPH VIEW.

            if (Globals.get('AppConfig.system.expModelModality') === 'sequential') { this._view.showVideo(true);}
            else if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') { this._view.showVideo(true);}

            if (Globals.get('directModelComparison')) { // In case model comparison is active and a new exp is loaded
              //Load the models that are in cache, or re-run.
              this._modelCache.forEach( function(cache) {
                this._onModelLoaded({
                  data: cache
                }) }, this)
            } else {

              if (this._modelCache && this._modelCache[0].model != null) { // If a model has been cached, show that video too.
                this._onModelLoaded({
                  data: this._modelCache[0]
                })
              }
            }
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this._view.clear();
        }
      } else {
        if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') { this._view.showVideo(false);}
      }
    }

    _onModelLoaded(evt) {
      /*
      if (!Utils.exists(this._firstModelSkip[evt.data.tabId])) {
        this._firstModelSkip[evt.data.tabId] = true;
        if (Globals.get(`ModelTab.${evt.data.tabId}`).historyCount() != 0 && Globals.get('AppConfig.system.modelModality') == "create") {
          return;
        }
      }
      */
      if (Globals.get('AppConfig.system.expModelModality') == 'sequential') { this._view.showVideo(false);}
      else if (Globals.get('AppConfig.system.expModelModality') == 'justmodel') { this._view.showVideo(false);}

      if (evt.data.model.id != '_new' && Globals.get('currentExperiment')) {
        if (!(evt.data.tabId == this._currentModel && this._lastModelResult[`model_${evt.data.tabId}`] &&
          this._lastModelResult[`model_${evt.data.tabId}`].euglenaModelId == evt.data.model.id &&
          this._lastModelResult[`model_${evt.data.tabId}`].experimentId == Globals.get('currentExperiment').id)) { // Otherwise, the current model does not have to be changed anyways.
          this._view.handleModelResults(evt.data.model, null, evt.data.tabId, Globals.get('directModelComparison'));

          EugUtils.getModelResults(Globals.get('currentExperiment').id, evt.data.model).then((results) => {
            this._view.handleModelResults(evt.data.model, results, evt.data.tabId, Globals.get('directModelComparison')); // THIS IS WHERE I HAVE TO DO IT WITH THE GRAPH VIEW
          })
          this._lastModelResult[`model_${evt.data.tabId}`] = { // This is to make sure that a model does not get reloaded if it is already "active" in the cache
            euglenaModelId: evt.data.model.id,
            experimentId: Globals.get('currentExperiment').id
          }
          this._currentModel = Globals.get('directModelComparison') ? 'both' : evt.data.tabId;
        }
        this._cacheModel(evt.data.model, evt.data.tabId);
      } else if (evt.data.model.id != '_new') {
        this._cacheModel(evt.data.model, evt.data.tabId);
        this._currentModel = Globals.get('directModelComparison') ? 'both' : evt.data.tabId;
      } else {
        this._view.handleModelResults(evt.data.model, null, evt.data.tabId, Globals.get('directModelComparison'));
        this._lastModelResult[`model_${evt.data.tabId}`] = null;
        this._currentModel = null;
      }
    }

    _cacheModel(model, tabId) {
      if (!model.date_created) { // In case the model has not been created yet, create it and then cache it.
        Utils.promiseAjax(`/api/v1/EuglenaModels/${model.id}`).then((data) => {

          let hasNone = false;
          let modelIndex = this._modelCache.findIndex((o,i) => {
              if (o) {
                if (o.tabId === tabId) {
                  this._modelCache[i] = { tabId: tabId, model: data};
                  return true;
                } else if (o.tabId == 'none') {
                  hasNone = true;
                }
              }
          })

          if (!Globals.get('directModelComparison') || (modelIndex == -1 && hasNone)) {
            this._modelCache = [{ tabId: tabId, model: data }]
          } else if (modelIndex == -1) {
            this._modelCache.push({ tabId: tabId, model: data })
          }
        })
      } else {

        let hasNone = false;
        let modelIndex = this._modelCache.findIndex((o,i) => {
            if (o) {
              if (o.tabId === tabId) {
                this._modelCache[i] = { tabId: tabId, model: model};
                return true;
              } else if (o.tabId == 'none') {
                hasNone = true;
              }
            }
        })

        if (!Globals.get('directModelComparison') || (modelIndex == -1 && hasNone)) {
          this._modelCache = [{ tabId: tabId, model: model }]
        } else if (modelIndex == -1) {
          this._modelCache.push({ tabId: tabId, model: model })
        }
      }
    }

    _onModelResultsRequest(evt) {
      if (evt.data.tabId == 'none') {
        if (Globals.get('directModelComparison')) { // delete the second video view
          Globals.set('directModelComparison',false);
          this._view.activateModelComparison();
        }
        this._lastModelResult = {model_a: null, model_b: null};
        if (Globals.get('AppConfig.system.expModelModality') === 'sequential') { this._view.showVideo(true);}
        else if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') { this._view.showVideo(false);}
        this._view.handleModelResults(null, null, evt.data.tabId);
        Globals.get('Logger').log({
          type: "model_change",
          category: "results",
          data: {
            tab: evt.data.tabId
          }
        })
        this._modelCache = [{
          tabId: 'none',
          model: null
        }]
      } else if (evt.data.tabId == 'both') {

        //1. dispatch event that says to hide results__visualization and instead have a second results__visuals view.
        Globals.set('directModelComparison',true);
        this._view.activateModelComparison();
        Globals.get('Relay').dispatchEvent('EuglenaModel.directModelComparison', { 'directModelComparison': true });

        // 2. Load both models.
        const currModel_a = Globals.get('ModelTab.a').currModel();
        const currModel_b = Globals.get('ModelTab.b').currModel();
        this._lastModelResult = {model_a: null, model_b: null};
        var modelLogIds = {model_a: null, model_b: null};

        if (currModel_a) {
          this._onModelLoaded({
            data: {
              model: currModel_a,
              tabId: 'a'
            }
          })
          modelLogIds.model_a = currModel_a.id;
        } else {
          this._view.handleModelResults(null, null, 'a', true);
          this._lastModelResult.model_a = null;
          if (Globals.get('AppConfig.system.modelModality')!='create') { Globals.get('Relay').dispatchEvent('Model.AutomaticSimulate',{tabId: 'a'}); }
        }

        if (currModel_b) {
          this._onModelLoaded({
            data: {
              model: currModel_b,
              tabId: 'b'
            }
          })
          modelLogIds.model_b = currModel_b.id;
        } else {
          this._view.handleModelResults(null, null, 'b', true);
          this._lastModelResult.model_b = null;
          if (Globals.get('AppConfig.system.modelModality')!='create') { Globals.get('Relay').dispatchEvent('Model.AutomaticSimulate',{tabId: 'b'}); }
        }

        Globals.get('Logger').log({
          type: "model_change",
          category: "results",
          data: {
            tab: evt.data.tabId,
            modelId: modelLogIds
          }
        })

      } else { // only one model active

        if (Globals.get('directModelComparison')) { // delete the second video view
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
          this._lastModelResult[`model_${evt.data.tabId}`] = null;
          Globals.get('Logger').log({
            type: "model_change",
            category: "results",
            data: {
              tab: evt.data.tabId,
              resultId: null
            }
          })
          if (Globals.get('AppConfig.system.modelModality')!='create') { console.log('automatic simulate'); Globals.get('Relay').dispatchEvent('Model.AutomaticSimulate',{tabId: evt.data.tabId}); }
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
