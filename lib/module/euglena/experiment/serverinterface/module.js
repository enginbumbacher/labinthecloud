import Module from 'core/app/module';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import BPUConnector from './bpu_connector';
import DemoConnector from './demo_connector';
import HistoricalConnector from './historical_connector';
import EugUtils from 'euglena/utils';

export default class EuglenaServerModule extends Module {
  constructor() {
    super();

    Utils.bindMethods(this, [
      '_onExperimentRequest'
      , '_onExperimentUpdate'
      // , '_onSubmissionError'
      // , '_onQueueError'
      , '_onExperimentReady'
    ]);

    if (Globals.get('AppConfig.experiment.euglenaServerMode')) {
      Globals.set('euglenaServerMode',Globals.get('AppConfig.experiment.euglenaServerMode'))
    } else {
      Globals.set('euglenaServerMode', 'simulate');
    }

    let connectorConfig = Globals.get('AppConfig.experiment.connectorConfig') || {};
    switch (Globals.get('euglenaServerMode')) {
      case "simulate":
        this.connector = new BPUConnector(connectorConfig);
      break;
      case "demo":
        this.connector = new DemoConnector(connectorConfig);
      break;
      case "historical":
      default:
        this.connector = new HistoricalConnector(connectorConfig);
      break;
    }

    this.connector.addEventListener('ExperimentConnector.Error', this._onConnectorError);
    this.connector.addEventListener('ExperimentConnector.Experiment.Update', this._onExperimentUpdate);
    this.connector.addEventListener('ExperimentConnector.Experiment.Ready', this._onExperimentReady);

    this._experiments = [];

    Globals.get('Relay').addEventListener('ExperimentServer.ExperimentRequest', this._onExperimentRequest);
  }

  init() {
    return this.connector.init();
  }

  _onConnectorError(evt) {
    Globals.get('Relay').dispatchEvent('Notifications.Add', {
      id: evt.data.error_id,
      type: "error",
      message: evt.data.error_message
    });
    Globals.get('Relay').dispatchEvent('ExperimentServer.Failure', {
      error: evt.data.error_message
    })
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

    EugUtils.generateResults(evt.data.resData).then((data) => {
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

    this.connector.saveExperiment({
      studentId: Globals.get('student_id'),
      configuration: evt.data.lights,
      expForm: evt.data.expForm ? evt.data.expForm : null,
      lab: Globals.get('AppConfig.lab')
    }).then((data) => {
      console.log("experiment saved");
      console.log(data);
      Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentSaved', {
        experiment: data
      });

      this.connector.runExperiment(lightData, data);
    })
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
