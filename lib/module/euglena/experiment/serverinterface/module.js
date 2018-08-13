import Module from 'core/app/module';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import BPUConnector from './bpu_connector';
import DemoConnector from './demo_connector';
import EugUtils from 'euglena/utils';

export default class EuglenaServerModule extends Module {
  constructor() {
    super();

    Utils.bindMethods(this, [
      '_onExperimentRequest'
      , '_onExperimentUpdate'
      , '_onSubmissionError'
      , '_onQueueError'
      , '_onExperimentReady'
      , '_searchAndLoadData'
    ]);

    if (Globals.get('AppConfig.experiment.euglenaServerMode')) {
      Globals.set('euglenaServerMode',Globals.get('AppConfig.experiment.euglenaServerMode'))
    } else {
      Globals.set('euglenaServerMode', 'bpu');
    }
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

    // First, check whether this experiment has already been run.
    new Promise((resolve,reject) => {
      this._searchAndLoadData(evt.data.lights, null, 'experiment', resolve);
    }).then((expIdAndResults) => {
      // Look which previous experiment has the same light configuration. --> Store its id in copyOfID.
      Utils.promiseAjax("/api/v1/Experiments", {
        method: "POST",
        data: JSON.stringify({
          studentId: Globals.get('student_id'),
          configuration: evt.data.lights,
          expForm: evt.data.expForm ? evt.data.expForm : null,
          lab: Globals.get('AppConfig.lab'),
          copyOfID: (Globals.get('AppConfig.experiment.euglenaServerMode')==='simulate' && expIdAndResults.copyOfID > 0 && expIdAndResults.results.length) ? expIdAndResults.copyOfID : 0 // update the copyOfID if it is found.
        }),
        contentType: 'application/json'
      }).then((data) => {
        Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentSaved', {
          experiment: data
        });

        if (Globals.get('euglenaServerMode') == 'demo') {
          this.demo.runExperiment(lightData, data.id);
        } else if (Globals.get('euglenaServerMode') == 'simulate') {
          if (data.copyOfID>0) {
              // new Promise((resolve, reject) => {
              //   this._searchAndLoadData(lightData, data.copyOfID, 'results', resolve);
              // }).then((resultsData) => {
              //     if (!resultsData) {
              //       this.bpu.runExperiment(lightData, data.id);
              //     } else {
              expIdAndResults.results[0].experimentId = data.id;
              delete expIdAndResults.results[0].id;
              EugUtils.generateResults( expIdAndResults.results[0]).then((data) => {
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
                    //Globals.get('Relay').dispatchEvent('ExperimentServer.Results', expIdAndResults.results);
                  // }
              // }).catch((reason) => { console.log('Handle rejected Results promise(' + reason + ') here.')});;
          } else {
            this.bpu.runExperiment(lightData, data.id);
          } // Check first whether there is another experiment with the same config. If so, load that. Otherwise, run the bpu.

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
    }).catch((reason) => { console.log('Handle rejected Experiment promise(' + reason + ') here.')});
  }

  _searchAndLoadData(lightData, expId, loadData, resolve) {

//    if (loadData === 'experiment') {

      // Utils.promiseAjax('/api/v1/Experiments', {
      //   data: {
      //     filter: {
      //       where:{
      //         copyOfID: 0
      //       }
      //     }
      //   },
      //   contentType: 'application/json'
      // })

      Utils.promiseAjax('/api/v1/Experiments/expsWithResults', {
        data: {
          copyOfID: 0
        }
      }).then((data) => {
        // if there are multiple experiments found, return the most recent one
        var filteredData = data;
        for (var idx = 0; idx<4; idx++) {
        	if (filteredData.length >0) {
            filteredData = filteredData.filter(exp => {
          		var expConfig = exp.configuration;
          		var isMatch = true;
          		for (let elem of Object.keys(lightData[idx])) {
          			if (expConfig[idx][elem] != lightData[idx][elem]) {
          				return false;
                }
          		}
          		if (isMatch) {return true};
          	})
          }
        }

        var copyOfID = 0;
        if (filteredData.length > 1) {
          filteredData.sort((a, b) => {
            return (new Date(b.date_created)).getTime() - (new Date(a.date_created)).getTime()
          });
          copyOfID = filteredData[0].id
        } else if (filteredData.length == 1) {
          copyOfID = filteredData[0].id
        }

        if (copyOfID>0) {
          Utils.promiseAjax(`/api/v1/Results`, {
            data: {
              filter: {
                where: {
                  and: [
                    { experimentId: copyOfID },
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
            var expIdAndResults = {copyOfID: copyOfID, results: results};
            resolve(expIdAndResults)
          })
        } else {
          resolve({copyOfID: 0, results: null})
        }

        //resolve(copyOfID);

      })
    // } else if (loadData === 'results') {
    //   Utils.promiseAjax(`/api/v1/Results`, {
    //     data: {
    //       filter: {
    //         where: {
    //           and: [
    //             { experimentId: expId },
    //             {
    //               bpu_api_id: {
    //                 neq: null
    //               }
    //             }
    //           ]
    //         }
    //       }
    //     },
    //     contentType: 'application/json'
    //   }).then((results) => {
    //     resolve(results)
    //   })
    // }


  }

}
