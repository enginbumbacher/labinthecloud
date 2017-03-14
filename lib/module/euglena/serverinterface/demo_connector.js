define((require) => {
  const EventDispatcher = require('core/event/dispatcher'),
    Utils = require('core/util/utils'),
    $ = require('jquery'),
    Globals = require('core/model/globals')
  ;

  return class DemoConnector extends EventDispatcher {
    constructor() {
      super();
      Utils.bindMethods(this, [
        '_updateProcessingTime'
      ]);
      this.experiments = [];
      this.demoLength = 1;
    }

    init() {
      window.requestAnimationFrame(this._updateProcessingTime);
    }

    _updateProcessingTime(timestamp) {
      let now = performance.now();
      this.experiments.forEach((exp) => {
        if (exp.status == 'running') {
          if (now - exp.startTime < this.demoLength * 1000) {
            this.dispatchEvent('DemoController.Experiment.Update', {
              experiment_id: exp.id,
              remaining_estimate: this.demoLength * 1000 - (now - exp.startTime),
              status: exp.status
            });
          } else {
            exp.status = 'downloading';
            this.dispatchEvent('DemoController.Experiment.Update', {
              experiment_id: exp.id,
              status: exp.status,
              remaining_estimate: 0
            });
            Promise.all([
              Utils.promiseAjax('/cslib/module/euglena/demodata/58c82d732288ca69a5319aab.json'),
              Utils.promiseAjax('/cslib/module/euglena/demodata/tracks.json')
            ]).then((downloads) => {
              exp.data = {
                experiment: downloads[0],
                video: '/cslib/module/euglena/demodata/movie.mp4',
                tracks: downloads[1]
              };
              exp.status = 'ready';
              this.dispatchEvent('DemoController.Experiment.Ready', exp);
            })
          }
        }
      })
      window.requestAnimationFrame(this._updateProcessingTime);
    }

    runExperiment(lightData) {
      let exp = {
        id: this.experiments.length,
        lightData: lightData,
        startTime: performance.now(),
        status: 'running'
      };
      this.experiments.push(exp);
    }
  }
  
});