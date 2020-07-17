import EventDispatcher from "core/event/dispatcher";
import Utils from "core/util/utils";

export default class ExperimentServerConnector extends EventDispatcher {
  constructor() {
    super();
    this.experiments = [];
  }

  init() {
    return Promise.resolve(true);
  }

  saveExperiment(expConf) {
    expConf.copyOfID = expConf.copyOfID ? expConf.copyOfID : 0;
    return Utils.promiseAjax("/api/v1/Experiments", {
      method: "POST",
      data: JSON.stringify(expConf),
      contentType: 'application/json'
    });
  }

  runExperiment() {}
}