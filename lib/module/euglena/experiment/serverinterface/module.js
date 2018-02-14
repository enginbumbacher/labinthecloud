define((require) => {
  const Module = require('core/app/module'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    BPUConnector = require('./bpu_connector'),
    DemoConnector = require('./demo_connector'),
    EugUtils = require('euglena/utils')
  ;

  return class EuglenaServerModule extends Module {
    constructor() {
      super();

      Utils.bindMethods(this, [
        '_onExperimentRequest'
        , '_onExperimentUpdate'
        , '_onSubmissionError'
        , '_onQueueError'
        , '_onExperimentReady'
      ]);

      Globals.set('euglenaServerMode', 'bpu');
      this.bpu = new BPUConnector();
      this.bpu.addEventListener('BPUController.Error.Submission', this._onSubmissionError);
      this.bpu.addEventListener('BPUController.Error.Queue', this._onQueueError);
      this.bpu.addEventListener('BPUController.Experiment.Update', this._onExperimentUpdate);
      this.bpu.addEventListener('BPUController.Experiment.Ready', this._onExperimentReady);

      this._experiments = [];

      Globals.get('Relay').addEventListener('ExperimentServer.ExperimentRequest', this._onExperimentRequest);
    }

    init() {
      return new Promise((resolve, reject) => {
        this.bpu.addEventListener('BPUController.Ready', (evt) => {
          resolve(true);
        })
        this.bpu.addEventListener('BPUController.Error.Connection', (evt) => {
          reject(evt.data.error);
        })
        this.bpu.addEventListener('BPUController.Error.ConnectionRefused', (evt) => {
          this.demo = new DemoConnector();
          this.demo.addEventListener('DemoController.Experiment.Update', this._onExperimentUpdate);
          this.demo.addEventListener('DemoController.Experiment.Ready', this._onExperimentReady);
          this.demo.init();
          Globals.set('euglenaServerMode', 'demo');
          Globals.get('Relay').dispatchEvent('Notifications.Add', {
            id: "demo_mode",
            type: "notice",
            message: "Demo Mode"
          })
          resolve(true);
        })
        this.bpu.init();
      })
    }

    _onSubmissionError(evt) {
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        id: "submission_rejected",
        type: "error",
        message: `Submission rejected: ${evt.data.error}`
      })
      Globals.get('Relay').dispatchEvent('ExperimentServer.Failure', {
        error: `Submission rejected: ${evt.data.error}`
      });
    }
    _onQueueError(evt) {
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        id: "submission_rejected",
        type: "error",
        message: `Queue request rejected: ${evt.data.error}`
      });
      Globals.get('Relay').dispatchEvent('ExperimentServer.Failure', {
        error: `Queue request rejected: ${evt.data.error}`
      });
    }
    _onExperimentUpdate(evt) {
      Globals.get('Relay').dispatchEvent('ExperimentServer.Update', evt.data);
    }
    _onExperimentReady(evt) {
      const original = evt.data.data;
      const report = original.experiment;
      Globals.get('Relay').dispatchEvent('ExperimentServer.Update', {
        experiment_id: report.exp_metaData.ExpName,
        remaining_estimate: 0,
        status: "downloading"
      });
      EugUtils.generateResults({
        bpu_api_id: report.exp_metaData.ExpName,
        experimentId: report.exp_metaData.tag
      }).then((data) => {
        Globals.get('Relay').dispatchEvent('ExperimentServer.Results', data);
        return data;
      }).catch((err) => {
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: "result_submission_error",
          type: "error",
          message: `Results saving error: ${err}`
        })
        Globals.get('Relay').dispatchEvent('ExperimentServer.Failure', {
          error: `Results saving error: ${err}`
        });
      })
    }

    _onExperimentRequest(evt) {
      const lightData = [];
      let timeAccumulated = 0
      evt.data.lights.forEach((ld) => {
        lightData.push({
          topValue: ld.top,
          rightValue: ld.right,
          bottomValue: ld.bottom,
          leftValue: ld.left,
          time: timeAccumulated
        });
        timeAccumulated += ld.duration * 1000
      })

      Utils.promiseAjax("/api/v1/Experiments", {
        method: "POST",
        data: JSON.stringify({
          studentId: Globals.get('student_id'),
          configuration: evt.data.lights,
          expForm: evt.data.expForm ? evt.data.expForm : null,
          lab: Globals.get('AppConfig.lab')
        }),
        contentType: 'application/json'
      }).then((data) => {
        Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentSaved', {
          experiment: data
        });
        if (Globals.get('euglenaServerMode') == 'demo') {
          this.demo.runExperiment(lightData, data.id);
        } else {
          this.bpu.runExperiment(lightData, data.id);
        }
      }).catch((err) => {
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: "experiment_submission_error",
          type: "error",
          message: `Experiment saving error: ${err}`
        })
        Globals.get('Relay').dispatchEvent('ExperimentServer.Failure', {
          error: `Experiment saving error: ${err}`
        });
      })
    }
  }
})
