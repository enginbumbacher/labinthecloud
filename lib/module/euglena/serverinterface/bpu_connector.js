define((require) => {
  const EventDispatcher = require('core/event/dispatcher'),
    Utils = require('core/util/utils'),
    $ = require('jquery'),
    socketio = require('socketio'),

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
        id: '582125878414c9532bafabaa',
        name: 'radiantllama',
        groups: ['default']
      },
      session: {
        id: '582117b8ba3546ad26e4a452',
        sessionID: 'i4bP9hXwNA3WuH0p6m0TCUIA9Wtz0Ydu',
        socketID: null,
        socketHandle: '/account/joinlabwithdata',
        url: '/account/joinlabwithdata'
      }
    },
    fileServer = `http://${access.serverInfo.socketClientServerIP}/account/joinlabwithdata/downloadFile/`,
    domain = `http://${access.serverInfo.socketClientServerIP}:${access.serverInfo.socketClientServerPort}`
  ;

  return class BPUConnector extends EventDispatcher {
    constructor() {
      super();
      Utils.bindMethods(this, [
        '_onSocketDisconnect',
        '_onSocketConnect',
        '_onSocketUpdate',
        '_onSocketAuthorization'
      ]);
      this.experiments = [];
      this.downloads = [];
    }

    init() {
      this.socket = socketio.connect(domain, {
        multiplex: false,
        reconnect: true
      });
      this.socket.on(access.router.disconnect, this._onSocketDisconnect);
      this.socket.on(access.router.connect, this._onSocketConnect);
      this.socket.on(access.router.update, this._onSocketUpdate);
    }

    _onSocketDisconnect(reject) {
      console.log('BPU controller disconnected');
      this.dispatchEvent('BPUController.Error.Connection', { error: 'Could not connect to the BPU Controller' });
    }

    _onSocketConnect(resolve, reject) {
      console.log('BPU controller connected');
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
      const experiments = bpuList.filter((bpu) => {
        return bpu.isOn && bpu.bpuStatus == "running" && bpu.liveBpuExperiment.username == access.user.name && this.experiments.includes(bpu.liveBpuExperiment.id);
      });
      // console.log(bpuList, experiments);
      if (experiments && experiments.length) {
        experiments.forEach((bpu) => {
          this.dispatchEvent('BPUController.Experiment.Update', {
            experiment_id: bpu.liveBpuExperiment.id,
            remaining_estimate: bpu.liveBpuExperiment.bc_timeLeft
          });

          if (bpu.liveBpuExperiment.bc_timeLeft < 2000 && !this.downloads.includes(bpu.liveBpuExperiment.id)) {
            this.downloads.push(bpu.liveBpuExperiment.id);
            setTimeout(() => {
              this.dispatchEvent('BPUController.Experiment.Ready', {
                experiment_data: `${fileServer}${bpu.liveBpuExperiment.id}/${bpu.liveBpuExperiment.id}.json/`,
                video: `${fileServer}${bpu.liveBpuExperiment.id}/movie.mp4/`,
                lightdata: `${fileServer}${bpu.liveBpuExperiment.id}/lightdata.json/`,
                lightdata_meta: `${fileServer}${bpu.liveBpuExperiment.id}/lightdata_meta.json/`,
                tracks: `${fileServer}${bpu.liveBpuExperiment.id}/tracks.json/`,
              });
            }, 30000);
          }
        })
      }
    }

    runExperiment(lightData) {
      lightData.unshift({ topValue: 0, rightValue: 0, bottomValue: 0, leftValue: 0, time: 0 })
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
          console.log(data);

          this.socket.emit(access.router.submitExperiment, this.auth, queue, (err, res) => {
            if (err) {
              this.dispatchEvent('BPUController.Error.Submission', { error: err })
            } else if (res && res.length) {
              this.experiments.push(res[0]._id);
              console.log(this.experiments);
            } else {
              this.dispatchEvent('BPUController.Error.Submission', { error: 'No resource found' });
            }
          })
        }
      })
    }
  }
  
});