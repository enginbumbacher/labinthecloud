// import EventDispatcher from 'core/event/dispatcher';
import Utils from 'core/util/utils';
import $ from 'jquery';
import Globals from 'core/model/globals';
import ExperimentServerConnector from "./experiment_server_connector";

export default class DemoConnector extends ExperimentServerConnector {
  constructor() {
    super();
    Utils.bindMethods(this, [
      '_updateProcessingTime'
    ]);
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
          this.dispatchEvent('ExperimentConnector.Experiment.Update', {
            experiment_id: exp.id,
            remaining_estimate: this.demoLength * 1000 - (now - exp.startTime),
            status: exp.status
          });
        } else {
          exp.status = 'downloading';
          this.dispatchEvent('ExperimentConnector.Experiment.Update', {
            experiment_id: exp.id,
            status: exp.status,
            remaining_estimate: 0
          });
          Promise.all([
            Utils.promiseAjax('/cslib/module/euglena/experiment/demodata/58c82d732288ca69a5319aab.json'),
            Utils.promiseAjax('/cslib/module/euglena/experiment/demodata/tracks.json')
          ]).then((downloads) => {
            exp.data = {
              experiment: downloads[0],
              video: '/cslib/module/euglena/experiment/demodata/movie.mp4',
              tracks: downloads[1],
              trackFile: '/cslib/module/euglena/experiment/demodata/tracks.json'
            };
            exp.data.experiment.exp_metaData.tag = exp.experimentId;
            exp.status = 'ready';
            exp.resData = {
              bpu_api_id: exp.data.experiment.exp_metaData.ExpName,
              experimentId: exp.data.experiment.exp_metaData.tag,
              trackFile: exp.data.trackFile,
              video: exp.data.video,
              magnification: exp.data.experiment.exp_metaData.magnification,
              runTime: exp.data.experiment.exp_metaData.runTime / 1000
            }
            this.dispatchEvent('ExperimentConnector.Experiment.Ready', exp);
          })
        }
      }
    })
    window.requestAnimationFrame(this._updateProcessingTime);
  }

  runExperiment(lightData, expData) {
    let exp = {
      id: this.experiments.length,
      experimentId: expData.id,
      lightData: lightData,
      startTime: performance.now(),
      status: 'running'
    };
    this.experiments.push(exp);
  }
}
