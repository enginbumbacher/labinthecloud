// import EventDispatcher from 'core/event/dispatcher';
import Utils from 'core/util/utils';
import $ from 'jquery';
import socketio from 'socket.io-client';
import Globals from 'core/model/globals';
import ExperimentServerConnector from "./experiment_server_connector";

const DOWNLOAD_DELAY = 100;

export default class BPUConnector extends ExperimentServerConnector {
  constructor() {
    super();
    this._access = {
      router: {
        connect: 'connect',
        disconnect: 'disconnect',
        authorize: 'setConnection',
        getQueue: 'getJoinQueueDataObj',
        update: 'update',
        submitExperiment: '/bpuCont/#submitExperimentRequest'
      },
      serverInfo: {
        Identifier: 'C422691AA38F9A86EC02CB7B55D5F542',
        name: 'radiantllama',
        socketClientServerIP: window.EuglenaConfig.experiment.server == "dev" ? 'biotic.stanford.edu' : 'euglena.stanford.edu',
        socketClientServerPort: 8084
      },
      user: {
        id: '574885898bf18b9508193e2a',
        name: 'radiantllama',
        groups: ['default']
      },
      session: {
        id: '58bf571cc89b99092553fa65',
        sessionID: 'R-OpYLbT6Kk-GXyEmX1SOOOHDw157mJc',
        socketID: null,
        socketHandle: '/account/joinlabwithdata',
        url: '/account/joinlabwithdata'
      }
    };
    this._fileServer = `http://${this._access.serverInfo.socketClientServerIP}/account/joinlabwithdata/downloadFile/`;
    this._domain = `http://${this._access.serverInfo.socketClientServerIP}:${this._access.serverInfo.socketClientServerPort}`;
    Utils.bindMethods(this, [
      '_onSocketDisconnect',
      '_onSocketConnect',
      '_onSocketUpdate',
      '_onSocketAuthorization',
      '_updateProcessingTime'
    ]);
    this.downloads = [];
  }

  init() {
    let promise = new Promise((resolve, reject) => {
      this.addEventListener('ExperimentConnector.Ready', (evt) => {
        resolve(true);
      })
      this.addEventListener('ExperimentConnector.Error.Connection', (evt) => {
        reject(evt.data.error_message);
      })
    });

    this.socket = socketio.connect(this._domain, {
      multiplex: false,
      reconnect: true
    });
    this.socket.on('connect_error', (error) => {
      console.log(error);
      this.socket.close();
      this.dispatchEvent('ExperimentConnector.Error.Connection', {error_id: "connection_refused", error_message: error});
    })
    this.socket.on(this._access.router.disconnect, this._onSocketDisconnect);
    this.socket.on(this._access.router.connect, this._onSocketConnect);
    this.socket.on(this._access.router.update, this._onSocketUpdate);
    this._active = true;
    window.requestAnimationFrame(this._updateProcessingTime);

    return promise;
  }

  _onSocketDisconnect(reject) {
    // console.log('BPU controller disconnected');
    this.dispatchEvent('ExperimentConnector.Error.Connection', { error: 'Could not connect to the BPU Controller' });
  }

  _onSocketConnect(resolve, reject) {
    // console.log('BPU controller connected');
    this.socket.emit(this._access.router.authorize, this._access.serverInfo, this._onSocketAuthorization);
  }

  _onSocketAuthorization(err, auth) {
    if (err) {
      this.dispatchEvent('ExperimentConnector.Error.Connection', { error: 'Could not authorize with BPU Controller' });
    } else {
      this.auth = auth;
      this._access.session.socketID = this.socket.id;
      this.dispatchEvent('ExperimentConnector.Ready');
    }
  }

  _onSocketUpdate(bpuList, experimentList, queue) {
    const exps = bpuList.filter((bpu) => {
      return bpu.isOn && bpu.bpuStatus == "running" && bpu.liveBpuExperiment.username == this._access.user.name && this.experiments.map((exp) => exp.id).includes(bpu.liveBpuExperiment.id);
    });
    console.log('BPU Update');
    if (exps.length) console.log(exps);
    let waiting = [];
    for (let key in experimentList) {
      if (key.substr(0,3) == "eug" && experimentList[key].length) {
        waiting = waiting.concat(experimentList[key].filter((wait) => {
          return this.experiments.map((exp) => exp.id).includes(wait.id);
        }));
      }
    }
    if (waiting.length) {
      waiting.forEach((wait) => {
        this.experiments.filter((exp) => exp.id == wait.id).forEach((exp) => {
          exp.status = 'queue';
        })
        this.dispatchEvent('ExperimentConnector.Experiment.Update', {
          experiment_id: wait.id,
          remaining_estimate: wait.exp_lastResort.totalWaitTime,
          status: 'queue'
        })
      })
    }
    const nowRunning = [];
    if (exps && exps.length) {
      exps.forEach((bpu) => {
        this.experiments.filter((exp) => exp.id == bpu.liveBpuExperiment.id).forEach((exp) => {
          exp.status = 'running';
        });
        nowRunning.push(bpu.liveBpuExperiment.id);
        this.dispatchEvent('ExperimentConnector.Experiment.Update', {
          experiment_id: bpu.liveBpuExperiment.id,
          remaining_estimate: bpu.liveBpuExperiment.bc_timeLeft,
          status: 'running'
        });
      })
    }
    this.experiments.forEach((exp) => {
      if (exp.status == 'running' && !nowRunning.includes(exp.id)) {
        exp.status = 'processing';
        exp.process_start = performance.now();
      }
    })
  }

  _updateProcessingTime(timestamp) {
    if (this._active) {
      this.experiments.forEach((exp) => {
        if (exp.status == 'processing') {
          const remaining = DOWNLOAD_DELAY * 1000 - (timestamp - exp.process_start)
          if (remaining <= 0) {
            exp.status = 'retrieving';
            delete exp.process_start;
            this.dispatchEvent('ExperimentConnector.Experiment.Update', {
              experiment_id: exp.id,
              status: exp.status,
              remaining_estimate: 0
            })
            this._downloadData(exp);
          } else {
            this.dispatchEvent('ExperimentConnector.Experiment.Update', {
              experiment_id: exp.id,
              remaining_estimate: remaining,
              status: exp.status
            });
          }
        }
      })
      window.requestAnimationFrame(this._updateProcessingTime);
    }
  }

  _downloadData(exp) {
    Utils.promiseAjax(`${this._fileServer}${exp.id}/${exp.id}.json`, { timeout: 10 * 1000 })
    .then((expdata) => {
      exp.data = {
        experiment: expdata,
        video: `${this._fileServer}${exp.id}/movie.mp4`
      };
      exp.status = 'ready';
      exp.resData = {
        bpu_api_id: expdata.exp_metaData.ExpName,
        experimentId: expdata.exp_metaData.tag
      }
      this.dispatchEvent('ExperimentConnector.Experiment.Ready', exp);
    }).catch((err) => {
      // try again?
      this._downloadData(exp);
    });
  }

  runExperiment(lightData, expData) {
    let expId = expData.id;
    lightData.push({ topValue: 0, rightValue: 0, bottomValue: 0, leftValue: 0, time: 60000 })
    this.socket.emit(this._access.router.getQueue, this._access.serverInfo, (err, queueObj) => {
      if (err) {
        this.dispatchEvent('ExperimentConnector.Error', { error_id: "submission_rejected", error_message: `Queue request rejected: ${err}` });
      } else {
        const queue = [];
        let data = JSON.parse(JSON.stringify(queueObj)); //clones the queueObj
        let base = {
          exp_eventsToRun: lightData,
          group_experimentType: 'text',
          user: JSON.parse(JSON.stringify(this._access.user)),
          session: {
            id: this._access.session.id,
            sessionID: this._access.session.sessionID,
            socketHandle: this._access.session.socketHandle,
            socketID: this._access.session.socketID,
            user: JSON.parse(JSON.stringify(this._access.user))
          },
          exp_metaData: {
            clientCreationDate: new Date(),
            group_experimentType: 'text',
            runTime: 60000,
            tag: expId,
            userUrl: this._access.session.url
          },
        }
        if (Globals.get('AppConfig.experiment.bpuId')) base.exp_wantsBpuName = Globals.get('AppConfig.experiment.bpuId')
        data = $.extend(true, data, base)

        queue.push(data);

        this.socket.emit(this._access.router.submitExperiment, this.auth, queue, (err, res) => {
          // console.log(arguments);
          if (err) {
            this.dispatchEvent('ExperimentConnector.Error', { error_id: "submission_rejected", error_message: `Submission rejected: ${err}` })
          } else if (res && res.length) {
            this.experiments.push({
              id: res[0]._id,
              status: 'submitted'
            });
          } else {
            this.dispatchEvent('ExperimentConnector.Error', { error_id: "submission_rejected", error_message: 'Submission rejected: No resource found' });
          }
        })
      }
    })
  }

  destroy() {
    this.socket.close()
    this._active = false
    return super.destroy();
  }
}
