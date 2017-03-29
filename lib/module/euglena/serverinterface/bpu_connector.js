define((require) => {
  const EventDispatcher = require('core/event/dispatcher'),
    Utils = require('core/util/utils'),
    $ = require('jquery'),
    socketio = require('socketio'),
    Globals = require('core/model/globals'),

    access = {
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
        socketClientServerIP: 'biotic.stanford.edu',
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
    },
    fileServer = `http://${access.serverInfo.socketClientServerIP}/account/joinlabwithdata/downloadFile/`,
    domain = `http://${access.serverInfo.socketClientServerIP}:${access.serverInfo.socketClientServerPort}`
  ;

  const DOWNLOAD_DELAY = 100;

  return class BPUConnector extends EventDispatcher {
    constructor() {
      super();
      Utils.bindMethods(this, [
        '_onSocketDisconnect',
        '_onSocketConnect',
        '_onSocketUpdate',
        '_onSocketAuthorization',
        '_updateProcessingTime'
      ]);
      this.experiments = [];
      this.downloads = [];
    }

    init() {
      this.socket = socketio.connect(domain, {
        multiplex: false,
        reconnect: true
      });
      this.socket.on('connect_error', (error) => {
        this.socket.close();
        this.dispatchEvent('BPUController.Error.ConnectionRefused', {error: error});
      })
      this.socket.on(access.router.disconnect, this._onSocketDisconnect);
      this.socket.on(access.router.connect, this._onSocketConnect);
      this.socket.on(access.router.update, this._onSocketUpdate);
      window.requestAnimationFrame(this._updateProcessingTime);
    }

    _onSocketDisconnect(reject) {
      // console.log('BPU controller disconnected');
      this.dispatchEvent('BPUController.Error.Connection', { error: 'Could not connect to the BPU Controller' });
    }

    _onSocketConnect(resolve, reject) {
      // console.log('BPU controller connected');
      this.socket.emit(access.router.authorize, access.serverInfo, this._onSocketAuthorization);
    }

    _onSocketAuthorization(err, auth) {
      if (err) {
        this.dispatchEvent('BPUController.Error.Connection', { error: 'Could not authorize with BPU Controller' });
      } else {
        this.auth = auth;
        access.session.socketID = this.socket.id;
        this.dispatchEvent('BPUController.Ready');
      }
    }

    _onSocketUpdate(bpuList, experimentList, queue) {
      const exps = bpuList.filter((bpu) => {
        return bpu.isOn && bpu.bpuStatus == "running" && bpu.liveBpuExperiment.username == access.user.name && this.experiments.map((exp) => exp.id).includes(bpu.liveBpuExperiment.id);
      });
      // console.log(exps);
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
          this.dispatchEvent('BPUController.Experiment.Update', {
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
          this.dispatchEvent('BPUController.Experiment.Update', {
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
      this.experiments.forEach((exp) => {
        if (exp.status == 'processing') {
          const remaining = DOWNLOAD_DELAY * 1000 - (timestamp - exp.process_start)
          if (remaining <= 0) {
            exp.status = 'downloading';
            delete exp.process_start;
            this.dispatchEvent('BPUController.Experiment.Update', {
              experiment_id: exp.id,
              status: exp.status,
              remaining_estimate: 0
            })
            Promise.all([
              Utils.promiseAjax(`${fileServer}${exp.id}/${exp.id}.json`),
              Utils.promiseAjax(`${fileServer}${exp.id}/tracks.json`)
            ]).then((downloads) => {
              exp.data = {
                experiment: downloads[0],
                video: `${fileServer}${exp.id}/movie.mp4`,
                tracks: downloads[1]
              };
              exp.status = 'ready';
              this.dispatchEvent('BPUController.Experiment.Ready', exp);
            });
          } else {
            this.dispatchEvent('BPUController.Experiment.Update', {
              experiment_id: exp.id,
              remaining_estimate: remaining,
              status: exp.status
            });
          }
        }
      })
      window.requestAnimationFrame(this._updateProcessingTime);
    }

    runExperiment(lightData) {
      // lightData.unshift({ topValue: 0, rightValue: 0, bottomValue: 0, leftValue: 0, time: 0 })
      lightData.push({ topValue: 0, rightValue: 0, bottomValue: 0, leftValue: 0, time: 60000 })
      this.socket.emit(access.router.getQueue, access.serverInfo, (err, queueObj) => {
        if (err) {
          this.dispatchEvent('BPUController.Error.Queue', { error: err });
        } else {
          const queue = [];
          let data = JSON.parse(JSON.stringify(queueObj)); //clones the queueObj
          data = $.extend(true, data, {
            exp_eventsToRun: lightData,
            group_experimentType: 'text',
            user: JSON.parse(JSON.stringify(access.user)),
            session: {
              id: access.session.id,
              sessionID: access.session.sessionID,
              socketHandle: access.session.socketHandle,
              socketID: access.session.socketID,
              user: JSON.parse(JSON.stringify(access.user))
            },
            exp_metaData: {
              clientCreationDate: new Date(),
              group_experimentType: 'text',
              runTime: 60000,
              tag: access.user.name, // or any tag
              userUrl: access.session.url
            },
            exp_wantsBpuName: null,
          })

          queue.push(data);

          this.socket.emit(access.router.submitExperiment, this.auth, queue, (err, res) => {
            if (err) {
              this.dispatchEvent('BPUController.Error.Submission', { error: err })
            } else if (res && res.length) {
              this.experiments.push({
                id: res[0]._id,
                status: 'submitted'
              });
              // console.log(this.experiments);
            } else {
              this.dispatchEvent('BPUController.Error.Submission', { error: 'No resource found' });
            }
          })
        }
      })
    }
  }
  
});