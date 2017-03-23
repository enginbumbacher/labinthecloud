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
      Utils.bindMethods(this, ['_onExperimentLoaded']);

      this._currentExperiment = null;
      this._currentModel = null;

      this._view = new View();

      Globals.get('Relay').addEventListener('Experiment.Loaded', this._onExperimentLoaded);
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
                  experimentId: evt.data.experiment.id,
                  bpu_api_id: {
                    neq: null
                  }
                }
              }
            }
          }).then((results) => {
            const res = results[0];
            res.runTime = evt.data.experiment.configuration.reduce((acc, val) => {
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
            this._view.handleResults(evt.data.experiment, res);
          }).catch((err) => {
            console.log(err);
          })
        } else {
          this._view.clear();
        }
      }
    }
  }
  
})