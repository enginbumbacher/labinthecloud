define((require) => {
  const HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals');

  const Module = require('core/app/module'),
    View = require('./view')
  ;

  return class ResultsModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onExperimentLoaded', '_onModelLoaded', '_onSimulationRun']);

      this._currentExperiment = null;
      this._currentModel = null;

      this._view = new View();

      Globals.get('Relay').addEventListener('Experiment.Loaded', this._onExperimentLoaded);
      Globals.get('Relay').addEventListener('Simulation.Run', this._onSimulationRun);
      Globals.get('Relay').addEventListener('EuglenaModel.Loaded', this._onModelLoaded);
    }

    init() {
      HM.hook('Panel.Contents', (subject, meta) => {
        if (meta.id == "result") {
          subject.push(this._view);
        }
        return subject;
      }, 10);
    }

    _onExperimentLoaded(evt) {
      if (evt.data.experiment.id != this._currentExperiment) {
        this._currentExperiment = evt.data.experiment.id;
        
        if (evt.data.experiment.id != '_new') {
          Utils.promiseAjax('/api/v1/Results', {
            data: {
              filter: {
                where: {
                  and: [
                    { experimentId: evt.data.experiment.id },
                    { 
                      bpu_api_id: {
                        neq: null
                      }
                    }
                  ]
                }
              }
            },
            contentType: 'application/json'
          }).then((results) => {
            return this._normalizeResults(results[0]);
          }).then((results) => {
            this._view.handleExperimentResults(evt.data.experiment, results);
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this._view.clear();
        }
      }
    }

    _normalizeResults(res) {
      res.runTime = res.runTime || evt.data.experiment.configuration.reduce((acc, val) => {
        return acc + val.duration
      }, 0);
      res.tracks.forEach((track) => {
        track.samples.forEach((sample, ind) => {
          if (ind == 0) {
            sample.speed = 0;
            sample.speedX = 0;
            sample.speedY = 0;
          } else {
            sample.speed = Math.sqrt(Math.pow(sample.x - track.samples[ind - 1].x, 2) + Math.pow(sample.y - track.samples[ind - 1].y, 2)) / (sample.time - track.samples[ind - 1].time);
            sample.speedX = (sample.x - track.samples[ind - 1].x) / (sample.time - track.samples[ind - 1].time);
            sample.speedY = (sample.y - track.samples[ind - 1].y) / (sample.time - track.samples[ind - 1].time);
          }
        })
      })
      res.fps = res.numFrames / res.runTime;
      return res;
    }

    _onModelLoaded(evt) {
      if (evt.data.model.id != '_new') {
        if (!(this._lastModelResult && this._lastModelResult.euglenaModelId == evt.data.model.id && this._lastModelResult.experimentId == Globals.get('currentExperiment').id)) {
          Utils.promiseAjax('/api/v1/Results', {
            data: {
              filter: {
                where: {
                  and: [
                    { euglenaModelId: evt.data.model.id },
                    { experimentId: Globals.get('currentExperiment').id }
                  ]
                }
              }
            }
          }).then((results) => {
            return this._normalizeResults(results[0])
          }).then((results) => {
            this._view.handleModelResults(evt.data.model, results);
          })
          this._lastModelResult = {
            euglenaModelId: evt.data.model.id,
            experimentId: Globals.get('currentExperiment').id
          }
        }
      } else {
        this._view.handleModelResults(evt.data.model, null);
        this._lastModelResult = null;
      }
    }

    _onSimulationRun(evt) {
      Utils.promiseAjax(`/api/v1/Results/${evt.data.results.id}`).then((results) => {
        return this._normalizeResults(results)
      }).then((results) => {
        this._view.handleModelResults(null, results);
      })
    }
  }
  
})