// import EventDispatcher from 'core/event/dispatcher';
import ExperimentServerConnector from "./experiment_server_connector";
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import EugUtils from "euglena/utils";

export default class HistoricalConnector extends ExperimentServerConnector {
  constructor() {
    super();
    this.experiments = [];
    this.demoLength = 1;
  }

  saveExperiment(expConf) {
    // Utils.promiseAjax('/api/v1/Experiments/findDuplicate', {
    //   data: {
    //     lightData: expConf.configuration
    //   },
    //   contentType: 'application/json'
    // }).then((duplicates) => {
    let lightData = expConf.configuration;
    return Utils.promiseAjax('/api/v1/Experiments/expsWithResults', {
      data: {
        copyOfID: 0
      }
    }).then((data) => {
      // if there are multiple experiments found, return the most recent one
      var filteredData = data;
      for (var idx = 0; idx<lightData.length; idx++) {
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
      return copyOfID;
    }).then((copyOfID) => {
      if (copyOfID) {
        expConf.copyOfID = copyOfID;
        return super.saveExperiment(expConf);
      } else {
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: 'experiment_copy_not_found',
          type: 'error',
          message: 'Could not find original experiment'
        });
        return Promise.reject('Could not find original experiment');
      }
    })
  }

  runExperiment(lightData, expData) {
    Utils.promiseAjax(`/api/v1/Results`, {
      data: {
        filter: {
          where: {
            and: [
              { experimentId: expData.copyOfID },
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
      results[0].experimentId = expData.id;
      delete results[0].id;
      return EugUtils.generateResults( results[0]).then((data) => {
        Globals.get('Relay').dispatchEvent('ExperimentServer.Results', data);
        return data;
      });
    })
  }
}
