'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
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
      socketClientServerIP: 'euglena.stanford.edu',
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
      fileServer = 'http://' + access.serverInfo.socketClientServerIP + '/account/joinlabwithdata/downloadFile/',
      domain = 'http://' + access.serverInfo.socketClientServerIP + ':' + access.serverInfo.socketClientServerPort;

  var DOWNLOAD_DELAY = 100;

  return function (_EventDispatcher) {
    _inherits(BPUConnector, _EventDispatcher);

    function BPUConnector() {
      _classCallCheck(this, BPUConnector);

      var _this = _possibleConstructorReturn(this, (BPUConnector.__proto__ || Object.getPrototypeOf(BPUConnector)).call(this));

      Utils.bindMethods(_this, ['_onSocketDisconnect', '_onSocketConnect', '_onSocketUpdate', '_onSocketAuthorization', '_updateProcessingTime']);
      _this.experiments = [];
      _this.downloads = [];
      return _this;
    }

    _createClass(BPUConnector, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        this.socket = socketio.connect(domain, {
          multiplex: false,
          reconnect: true
        });
        this.socket.on('connect_error', function (error) {
          console.log(error);
          _this2.socket.close();
          _this2.dispatchEvent('BPUController.Error.ConnectionRefused', { error: error });
        });
        this.socket.on(access.router.disconnect, this._onSocketDisconnect);
        this.socket.on(access.router.connect, this._onSocketConnect);
        this.socket.on(access.router.update, this._onSocketUpdate);
        window.requestAnimationFrame(this._updateProcessingTime);
      }
    }, {
      key: '_onSocketDisconnect',
      value: function _onSocketDisconnect(reject) {
        // console.log('BPU controller disconnected');
        this.dispatchEvent('BPUController.Error.Connection', { error: 'Could not connect to the BPU Controller' });
      }
    }, {
      key: '_onSocketConnect',
      value: function _onSocketConnect(resolve, reject) {
        // console.log('BPU controller connected');
        this.socket.emit(access.router.authorize, access.serverInfo, this._onSocketAuthorization);
      }
    }, {
      key: '_onSocketAuthorization',
      value: function _onSocketAuthorization(err, auth) {
        if (err) {
          this.dispatchEvent('BPUController.Error.Connection', { error: 'Could not authorize with BPU Controller' });
        } else {
          this.auth = auth;
          access.session.socketID = this.socket.id;
          this.dispatchEvent('BPUController.Ready');
        }
      }
    }, {
      key: '_onSocketUpdate',
      value: function _onSocketUpdate(bpuList, experimentList, queue) {
        var _this3 = this;

        var exps = bpuList.filter(function (bpu) {
          return bpu.isOn && bpu.bpuStatus == "running" && bpu.liveBpuExperiment.username == access.user.name && _this3.experiments.map(function (exp) {
            return exp.id;
          }).includes(bpu.liveBpuExperiment.id);
        });
        // console.log(exps);
        var waiting = [];
        for (var key in experimentList) {
          if (key.substr(0, 3) == "eug" && experimentList[key].length) {
            waiting = waiting.concat(experimentList[key].filter(function (wait) {
              return _this3.experiments.map(function (exp) {
                return exp.id;
              }).includes(wait.id);
            }));
          }
        }
        if (waiting.length) {
          waiting.forEach(function (wait) {
            _this3.experiments.filter(function (exp) {
              return exp.id == wait.id;
            }).forEach(function (exp) {
              exp.status = 'queue';
            });
            _this3.dispatchEvent('BPUController.Experiment.Update', {
              experiment_id: wait.id,
              remaining_estimate: wait.exp_lastResort.totalWaitTime,
              status: 'queue'
            });
          });
        }
        var nowRunning = [];
        if (exps && exps.length) {
          exps.forEach(function (bpu) {
            _this3.experiments.filter(function (exp) {
              return exp.id == bpu.liveBpuExperiment.id;
            }).forEach(function (exp) {
              exp.status = 'running';
            });
            nowRunning.push(bpu.liveBpuExperiment.id);
            _this3.dispatchEvent('BPUController.Experiment.Update', {
              experiment_id: bpu.liveBpuExperiment.id,
              remaining_estimate: bpu.liveBpuExperiment.bc_timeLeft,
              status: 'running'
            });
          });
        }
        this.experiments.forEach(function (exp) {
          if (exp.status == 'running' && !nowRunning.includes(exp.id)) {
            exp.status = 'processing';
            exp.process_start = performance.now();
          }
        });
      }
    }, {
      key: '_updateProcessingTime',
      value: function _updateProcessingTime(timestamp) {
        var _this4 = this;

        this.experiments.forEach(function (exp) {
          if (exp.status == 'processing') {
            var remaining = DOWNLOAD_DELAY * 1000 - (timestamp - exp.process_start);
            if (remaining <= 0) {
              exp.status = 'retrieving';
              delete exp.process_start;
              _this4.dispatchEvent('BPUController.Experiment.Update', {
                experiment_id: exp.id,
                status: exp.status,
                remaining_estimate: 0
              });
              _this4._downloadData(exp);
            } else {
              _this4.dispatchEvent('BPUController.Experiment.Update', {
                experiment_id: exp.id,
                remaining_estimate: remaining,
                status: exp.status
              });
            }
          }
        });
        window.requestAnimationFrame(this._updateProcessingTime);
      }
    }, {
      key: '_downloadData',
      value: function _downloadData(exp) {
        var _this5 = this;

        Utils.promiseAjax('' + fileServer + exp.id + '/' + exp.id + '.json', { timeout: 10 * 1000 }).then(function (expdata) {
          exp.data = {
            experiment: expdata,
            video: '' + fileServer + exp.id + '/movie.mp4'
          };
          exp.status = 'ready';
          _this5.dispatchEvent('BPUController.Experiment.Ready', exp);
        }).catch(function (err) {
          // try again?
          _this5._downloadData(exp);
        });
      }
    }, {
      key: 'runExperiment',
      value: function runExperiment(lightData, expId) {
        var _this6 = this;

        lightData.push({ topValue: 0, rightValue: 0, bottomValue: 0, leftValue: 0, time: 60000 });
        this.socket.emit(access.router.getQueue, access.serverInfo, function (err, queueObj) {
          if (err) {
            _this6.dispatchEvent('BPUController.Error.Queue', { error: err });
          } else {
            var queue = [];
            var data = JSON.parse(JSON.stringify(queueObj)); //clones the queueObj
            var base = {
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
                tag: expId,
                userUrl: access.session.url
              }
            };
            if (Globals.get('AppConfig.experiment.bpuId')) base.exp_wantsBpuName = Globals.get('AppConfig.experiment.bpuId');
            data = $.extend(true, data, base);

            queue.push(data);

            _this6.socket.emit(access.router.submitExperiment, _this6.auth, queue, function (err, res) {
              // console.log(arguments);
              if (err) {
                _this6.dispatchEvent('BPUController.Error.Submission', { error: err });
              } else if (res && res.length) {
                _this6.experiments.push({
                  id: res[0]._id,
                  status: 'submitted'
                });
              } else {
                _this6.dispatchEvent('BPUController.Error.Submission', { error: 'No resource found' });
              }
            });
          }
        });
      }
    }]);

    return BPUConnector;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2JwdV9jb25uZWN0b3IuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwiJCIsInNvY2tldGlvIiwiR2xvYmFscyIsImFjY2VzcyIsInJvdXRlciIsImNvbm5lY3QiLCJkaXNjb25uZWN0IiwiYXV0aG9yaXplIiwiZ2V0UXVldWUiLCJ1cGRhdGUiLCJzdWJtaXRFeHBlcmltZW50Iiwic2VydmVySW5mbyIsIklkZW50aWZpZXIiLCJuYW1lIiwic29ja2V0Q2xpZW50U2VydmVySVAiLCJzb2NrZXRDbGllbnRTZXJ2ZXJQb3J0IiwidXNlciIsImlkIiwiZ3JvdXBzIiwic2Vzc2lvbiIsInNlc3Npb25JRCIsInNvY2tldElEIiwic29ja2V0SGFuZGxlIiwidXJsIiwiZmlsZVNlcnZlciIsImRvbWFpbiIsIkRPV05MT0FEX0RFTEFZIiwiYmluZE1ldGhvZHMiLCJleHBlcmltZW50cyIsImRvd25sb2FkcyIsInNvY2tldCIsIm11bHRpcGxleCIsInJlY29ubmVjdCIsIm9uIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiY2xvc2UiLCJkaXNwYXRjaEV2ZW50IiwiX29uU29ja2V0RGlzY29ubmVjdCIsIl9vblNvY2tldENvbm5lY3QiLCJfb25Tb2NrZXRVcGRhdGUiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJfdXBkYXRlUHJvY2Vzc2luZ1RpbWUiLCJyZWplY3QiLCJyZXNvbHZlIiwiZW1pdCIsIl9vblNvY2tldEF1dGhvcml6YXRpb24iLCJlcnIiLCJhdXRoIiwiYnB1TGlzdCIsImV4cGVyaW1lbnRMaXN0IiwicXVldWUiLCJleHBzIiwiZmlsdGVyIiwiYnB1IiwiaXNPbiIsImJwdVN0YXR1cyIsImxpdmVCcHVFeHBlcmltZW50IiwidXNlcm5hbWUiLCJtYXAiLCJleHAiLCJpbmNsdWRlcyIsIndhaXRpbmciLCJrZXkiLCJzdWJzdHIiLCJsZW5ndGgiLCJjb25jYXQiLCJ3YWl0IiwiZm9yRWFjaCIsInN0YXR1cyIsImV4cGVyaW1lbnRfaWQiLCJyZW1haW5pbmdfZXN0aW1hdGUiLCJleHBfbGFzdFJlc29ydCIsInRvdGFsV2FpdFRpbWUiLCJub3dSdW5uaW5nIiwicHVzaCIsImJjX3RpbWVMZWZ0IiwicHJvY2Vzc19zdGFydCIsInBlcmZvcm1hbmNlIiwibm93IiwidGltZXN0YW1wIiwicmVtYWluaW5nIiwiX2Rvd25sb2FkRGF0YSIsInByb21pc2VBamF4IiwidGltZW91dCIsInRoZW4iLCJleHBkYXRhIiwiZGF0YSIsImV4cGVyaW1lbnQiLCJ2aWRlbyIsImNhdGNoIiwibGlnaHREYXRhIiwiZXhwSWQiLCJ0b3BWYWx1ZSIsInJpZ2h0VmFsdWUiLCJib3R0b21WYWx1ZSIsImxlZnRWYWx1ZSIsInRpbWUiLCJxdWV1ZU9iaiIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImJhc2UiLCJleHBfZXZlbnRzVG9SdW4iLCJncm91cF9leHBlcmltZW50VHlwZSIsImV4cF9tZXRhRGF0YSIsImNsaWVudENyZWF0aW9uRGF0ZSIsIkRhdGUiLCJydW5UaW1lIiwidGFnIiwidXNlclVybCIsImdldCIsImV4cF93YW50c0JwdU5hbWUiLCJleHRlbmQiLCJyZXMiLCJfaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsa0JBQWtCRCxRQUFRLHVCQUFSLENBQXhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsSUFBSUgsUUFBUSxRQUFSLENBRk47QUFBQSxNQUdFSSxXQUFXSixRQUFRLFVBQVIsQ0FIYjtBQUFBLE1BSUVLLFVBQVVMLFFBQVEsb0JBQVIsQ0FKWjtBQUFBLE1BTUVNLFNBQVM7QUFDUEMsWUFBUTtBQUNOQyxlQUFTLFNBREg7QUFFTkMsa0JBQVksWUFGTjtBQUdOQyxpQkFBVyxlQUhMO0FBSU5DLGdCQUFVLHFC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aUJpRCxJQUFqQixDQUFzQjtBQUNwQjVELHNCQUFJbUcsSUFBSSxDQUFKLEVBQU9DLEdBRFM7QUFFcEI5QywwQkFBUTtBQUZZLGlCQUF0QjtBQUlELGVBTE0sTUFLQTtBQUNMLHVCQUFLakMsYUFBTCxDQUFtQixnQ0FBbkIsRUFBcUQsRUFBRUosT0FBTyxtQkFBVCxFQUFyRDtBQUNEO0FBQ0YsYUFaRDtBQWFEO0FBQ0YsU0E1Q0Q7QUE2Q0Q7QUF4TEg7O0FBQUE7QUFBQSxJQUFrQ3BDLGVBQWxDO0FBMkxELENBcE9EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2JwdV9jb25uZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRXZlbnREaXNwYXRjaGVyID0gcmVxdWlyZSgnY29yZS9ldmVudC9kaXNwYXRjaGVyJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXG4gICAgc29ja2V0aW8gPSByZXF1aXJlKCdzb2NrZXRpbycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGFjY2VzcyA9IHtcbiAgICAgIHJvdXRlcjoge1xuICAgICAgICBjb25uZWN0OiAnY29ubmVjdCcsXG4gICAgICAgIGRpc2Nvbm5lY3Q6ICdkaXNjb25uZWN0JyxcbiAgICAgICAgYXV0aG9yaXplOiAnc2V0Q29ubmVjdGlvbicsXG4gICAgICAgIGdldFF1ZXVlOiAnZ2V0Sm9pblF1ZXVlRGF0YU9iaicsXG4gICAgICAgIHVwZGF0ZTogJ3VwZGF0ZScsXG4gICAgICAgIHN1Ym1pdEV4cGVyaW1lbnQ6ICcvYnB1Q29udC8jc3VibWl0RXhwZXJpbWVudFJlcXVlc3QnXG4gICAgICB9LFxuICAgICAgc2VydmVySW5mbzoge1xuICAgICAgICBJZGVudGlmaWVyOiAnQzQyMjY5MUFBMzhGOUE4NkVDMDJDQjdCNTVENUY1NDInLFxuICAgICAgICBuYW1lOiAncmFkaWFudGxsYW1hJyxcbiAgICAgICAgc29ja2V0Q2xpZW50U2VydmVySVA6ICdldWdsZW5hLnN0YW5mb3JkLmVkdScsXG4gICAgICAgIHNvY2tldENsaWVudFNlcnZlclBvcnQ6IDgwODRcbiAgICAgIH0sXG4gICAgICB1c2VyOiB7XG4gICAgICAgIGlkOiAnNTc0ODg1ODk4YmYxOGI5NTA4MTkzZTJhJyxcbiAgICAgICAgbmFtZTogJ3JhZGlhbnRsbGFtYScsXG4gICAgICAgIGdyb3VwczogWydkZWZhdWx0J11cbiAgICAgIH0sXG4gICAgICBzZXNzaW9uOiB7XG4gICAgICAgIGlkOiAnNThiZjU3MWNjODliOTkwOTI1NTNmYTY1JyxcbiAgICAgICAgc2Vzc2lvbklEOiAnUi1PcFlMYlQ2S2stR1h5RW1YMVNPT09IRHcxNTdtSmMnLFxuICAgICAgICBzb2NrZXRJRDogbnVsbCxcbiAgICAgICAgc29ja2V0SGFuZGxlOiAnL2FjY291bnQvam9pbmxhYndpdGhkYXRhJyxcbiAgICAgICAgdXJsOiAnL2FjY291bnQvam9pbmxhYndpdGhkYXRhJ1xuICAgICAgfVxuICAgIH0sXG4gICAgZmlsZVNlcnZlciA9IGBodHRwOi8vJHthY2Nlc3Muc2VydmVySW5mby5zb2NrZXRDbGllbnRTZXJ2ZXJJUH0vYWNjb3VudC9qb2lubGFid2l0aGRhdGEvZG93bmxvYWRGaWxlL2AsXG4gICAgZG9tYWluID0gYGh0dHA6Ly8ke2FjY2Vzcy5zZXJ2ZXJJbmZvLnNvY2tldENsaWVudFNlcnZlcklQfToke2FjY2Vzcy5zZXJ2ZXJJbmZvLnNvY2tldENsaWVudFNlcnZlclBvcnR9YFxuICA7XG5cbiAgY29uc3QgRE9XTkxPQURfREVMQVkgPSAxMDA7XG5cbiAgcmV0dXJuIGNsYXNzIEJQVUNvbm5lY3RvciBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uU29ja2V0RGlzY29ubmVjdCcsXG4gICAgICAgICdfb25Tb2NrZXRDb25uZWN0JyxcbiAgICAgICAgJ19vblNvY2tldFVwZGF0ZScsXG4gICAgICAgICdfb25Tb2NrZXRBdXRob3JpemF0aW9uJyxcbiAgICAgICAgJ191cGRhdGVQcm9jZXNzaW5nVGltZSdcbiAgICAgIF0pO1xuICAgICAgdGhpcy5leHBlcmltZW50cyA9IFtdO1xuICAgICAgdGhpcy5kb3dubG9hZHMgPSBbXTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgdGhpcy5zb2NrZXQgPSBzb2NrZXRpby5jb25uZWN0KGRvbWFpbiwge1xuICAgICAgICBtdWx0aXBsZXg6IGZhbHNlLFxuICAgICAgICByZWNvbm5lY3Q6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zb2NrZXQub24oJ2Nvbm5lY3RfZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvblJlZnVzZWQnLCB7ZXJyb3I6IGVycm9yfSk7XG4gICAgICB9KVxuICAgICAgdGhpcy5zb2NrZXQub24oYWNjZXNzLnJvdXRlci5kaXNjb25uZWN0LCB0aGlzLl9vblNvY2tldERpc2Nvbm5lY3QpO1xuICAgICAgdGhpcy5zb2NrZXQub24oYWNjZXNzLnJvdXRlci5jb25uZWN0LCB0aGlzLl9vblNvY2tldENvbm5lY3QpO1xuICAgICAgdGhpcy5zb2NrZXQub24oYWNjZXNzLnJvdXRlci51cGRhdGUsIHRoaXMuX29uU29ja2V0VXBkYXRlKTtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fdXBkYXRlUHJvY2Vzc2luZ1RpbWUpO1xuICAgIH1cblxuICAgIF9vblNvY2tldERpc2Nvbm5lY3QocmVqZWN0KSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnQlBVIGNvbnRyb2xsZXIgZGlzY29ubmVjdGVkJyk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvbicsIHsgZXJyb3I6ICdDb3VsZCBub3QgY29ubmVjdCB0byB0aGUgQlBVIENvbnRyb2xsZXInIH0pO1xuICAgIH1cblxuICAgIF9vblNvY2tldENvbm5lY3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnQlBVIGNvbnRyb2xsZXIgY29ubmVjdGVkJyk7XG4gICAgICB0aGlzLnNvY2tldC5lbWl0KGFjY2Vzcy5yb3V0ZXIuYXV0aG9yaXplLCBhY2Nlc3Muc2VydmVySW5mbywgdGhpcy5fb25Tb2NrZXRBdXRob3JpemF0aW9uKTtcbiAgICB9XG5cbiAgICBfb25Tb2NrZXRBdXRob3JpemF0aW9uKGVyciwgYXV0aCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvbicsIHsgZXJyb3I6ICdDb3VsZCBub3QgYXV0aG9yaXplIHdpdGggQlBVIENvbnRyb2xsZXInIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hdXRoID0gYXV0aDtcbiAgICAgICAgYWNjZXNzLnNlc3Npb24uc29ja2V0SUQgPSB0aGlzLnNvY2tldC5pZDtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLlJlYWR5Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uU29ja2V0VXBkYXRlKGJwdUxpc3QsIGV4cGVyaW1lbnRMaXN0LCBxdWV1ZSkge1xuICAgICAgY29uc3QgZXhwcyA9IGJwdUxpc3QuZmlsdGVyKChicHUpID0+IHtcbiAgICAgICAgcmV0dXJuIGJwdS5pc09uICYmIGJwdS5icHVTdGF0dXMgPT0gXCJydW5uaW5nXCIgJiYgYnB1LmxpdmVCcHVFeHBlcmltZW50LnVzZXJuYW1lID09IGFjY2Vzcy51c2VyLm5hbWUgJiYgdGhpcy5leHBlcmltZW50cy5tYXAoKGV4cCkgPT4gZXhwLmlkKS5pbmNsdWRlcyhicHUubGl2ZUJwdUV4cGVyaW1lbnQuaWQpO1xuICAgICAgfSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhleHBzKTtcbiAgICAgIGxldCB3YWl0aW5nID0gW107XG4gICAgICBmb3IgKGxldCBrZXkgaW4gZXhwZXJpbWVudExpc3QpIHtcbiAgICAgICAgaWYgKGtleS5zdWJzdHIoMCwzKSA9PSBcImV1Z1wiICYmIGV4cGVyaW1lbnRMaXN0W2tleV0ubGVuZ3RoKSB7XG4gICAgICAgICAgd2FpdGluZyA9IHdhaXRpbmcuY29uY2F0KGV4cGVyaW1lbnRMaXN0W2tleV0uZmlsdGVyKCh3YWl0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5leHBlcmltZW50cy5tYXAoKGV4cCkgPT4gZXhwLmlkKS5pbmNsdWRlcyh3YWl0LmlkKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh3YWl0aW5nLmxlbmd0aCkge1xuICAgICAgICB3YWl0aW5nLmZvckVhY2goKHdhaXQpID0+IHtcbiAgICAgICAgICB0aGlzLmV4cGVyaW1lbnRzLmZpbHRlcigoZXhwKSA9PiBleHAuaWQgPT0gd2FpdC5pZCkuZm9yRWFjaCgoZXhwKSA9PiB7XG4gICAgICAgICAgICBleHAuc3RhdHVzID0gJ3F1ZXVlJztcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlVwZGF0ZScsIHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRfaWQ6IHdhaXQuaWQsXG4gICAgICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IHdhaXQuZXhwX2xhc3RSZXNvcnQudG90YWxXYWl0VGltZSxcbiAgICAgICAgICAgIHN0YXR1czogJ3F1ZXVlJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBjb25zdCBub3dSdW5uaW5nID0gW107XG4gICAgICBpZiAoZXhwcyAmJiBleHBzLmxlbmd0aCkge1xuICAgICAgICBleHBzLmZvckVhY2goKGJwdSkgPT4ge1xuICAgICAgICAgIHRoaXMuZXhwZXJpbWVudHMuZmlsdGVyKChleHApID0+IGV4cC5pZCA9PSBicHUubGl2ZUJwdUV4cGVyaW1lbnQuaWQpLmZvckVhY2goKGV4cCkgPT4ge1xuICAgICAgICAgICAgZXhwLnN0YXR1cyA9ICdydW5uaW5nJztcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub3dSdW5uaW5nLnB1c2goYnB1LmxpdmVCcHVFeHBlcmltZW50LmlkKTtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5VcGRhdGUnLCB7XG4gICAgICAgICAgICBleHBlcmltZW50X2lkOiBicHUubGl2ZUJwdUV4cGVyaW1lbnQuaWQsXG4gICAgICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IGJwdS5saXZlQnB1RXhwZXJpbWVudC5iY190aW1lTGVmdCxcbiAgICAgICAgICAgIHN0YXR1czogJ3J1bm5pbmcnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLmV4cGVyaW1lbnRzLmZvckVhY2goKGV4cCkgPT4ge1xuICAgICAgICBpZiAoZXhwLnN0YXR1cyA9PSAncnVubmluZycgJiYgIW5vd1J1bm5pbmcuaW5jbHVkZXMoZXhwLmlkKSkge1xuICAgICAgICAgIGV4cC5zdGF0dXMgPSAncHJvY2Vzc2luZyc7XG4gICAgICAgICAgZXhwLnByb2Nlc3Nfc3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfdXBkYXRlUHJvY2Vzc2luZ1RpbWUodGltZXN0YW1wKSB7XG4gICAgICB0aGlzLmV4cGVyaW1lbnRzLmZvckVhY2goKGV4cCkgPT4ge1xuICAgICAgICBpZiAoZXhwLnN0YXR1cyA9PSAncHJvY2Vzc2luZycpIHtcbiAgICAgICAgICBjb25zdCByZW1haW5pbmcgPSBET1dOTE9BRF9ERUxBWSAqIDEwMDAgLSAodGltZXN0YW1wIC0gZXhwLnByb2Nlc3Nfc3RhcnQpXG4gICAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwKSB7XG4gICAgICAgICAgICBleHAuc3RhdHVzID0gJ3JldHJpZXZpbmcnO1xuICAgICAgICAgICAgZGVsZXRlIGV4cC5wcm9jZXNzX3N0YXJ0O1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50X2lkOiBleHAuaWQsXG4gICAgICAgICAgICAgIHN0YXR1czogZXhwLnN0YXR1cyxcbiAgICAgICAgICAgICAgcmVtYWluaW5nX2VzdGltYXRlOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fZG93bmxvYWREYXRhKGV4cCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlVwZGF0ZScsIHtcbiAgICAgICAgICAgICAgZXhwZXJpbWVudF9pZDogZXhwLmlkLFxuICAgICAgICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IHJlbWFpbmluZyxcbiAgICAgICAgICAgICAgc3RhdHVzOiBleHAuc3RhdHVzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX3VwZGF0ZVByb2Nlc3NpbmdUaW1lKTtcbiAgICB9XG5cbiAgICBfZG93bmxvYWREYXRhKGV4cCkge1xuICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYCR7ZmlsZVNlcnZlcn0ke2V4cC5pZH0vJHtleHAuaWR9Lmpzb25gLCB7IHRpbWVvdXQ6IDEwICogMTAwMCB9KVxuICAgICAgLnRoZW4oKGV4cGRhdGEpID0+IHtcbiAgICAgICAgZXhwLmRhdGEgPSB7XG4gICAgICAgICAgZXhwZXJpbWVudDogZXhwZGF0YSxcbiAgICAgICAgICB2aWRlbzogYCR7ZmlsZVNlcnZlcn0ke2V4cC5pZH0vbW92aWUubXA0YFxuICAgICAgICB9O1xuICAgICAgICBleHAuc3RhdHVzID0gJ3JlYWR5JztcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuUmVhZHknLCBleHApO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAvLyB0cnkgYWdhaW4/XG4gICAgICAgIHRoaXMuX2Rvd25sb2FkRGF0YShleHApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcnVuRXhwZXJpbWVudChsaWdodERhdGEsIGV4cElkKSB7XG4gICAgICBsaWdodERhdGEucHVzaCh7IHRvcFZhbHVlOiAwLCByaWdodFZhbHVlOiAwLCBib3R0b21WYWx1ZTogMCwgbGVmdFZhbHVlOiAwLCB0aW1lOiA2MDAwMCB9KVxuICAgICAgdGhpcy5zb2NrZXQuZW1pdChhY2Nlc3Mucm91dGVyLmdldFF1ZXVlLCBhY2Nlc3Muc2VydmVySW5mbywgKGVyciwgcXVldWVPYmopID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FcnJvci5RdWV1ZScsIHsgZXJyb3I6IGVyciB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBxdWV1ZSA9IFtdO1xuICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShxdWV1ZU9iaikpOyAvL2Nsb25lcyB0aGUgcXVldWVPYmpcbiAgICAgICAgICBsZXQgYmFzZSA9IHtcbiAgICAgICAgICAgIGV4cF9ldmVudHNUb1J1bjogbGlnaHREYXRhLFxuICAgICAgICAgICAgZ3JvdXBfZXhwZXJpbWVudFR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgIHVzZXI6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYWNjZXNzLnVzZXIpKSxcbiAgICAgICAgICAgIHNlc3Npb246IHtcbiAgICAgICAgICAgICAgaWQ6IGFjY2Vzcy5zZXNzaW9uLmlkLFxuICAgICAgICAgICAgICBzZXNzaW9uSUQ6IGFjY2Vzcy5zZXNzaW9uLnNlc3Npb25JRCxcbiAgICAgICAgICAgICAgc29ja2V0SGFuZGxlOiBhY2Nlc3Muc2Vzc2lvbi5zb2NrZXRIYW5kbGUsXG4gICAgICAgICAgICAgIHNvY2tldElEOiBhY2Nlc3Muc2Vzc2lvbi5zb2NrZXRJRCxcbiAgICAgICAgICAgICAgdXNlcjogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhY2Nlc3MudXNlcikpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXhwX21ldGFEYXRhOiB7XG4gICAgICAgICAgICAgIGNsaWVudENyZWF0aW9uRGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgZ3JvdXBfZXhwZXJpbWVudFR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgcnVuVGltZTogNjAwMDAsXG4gICAgICAgICAgICAgIHRhZzogZXhwSWQsXG4gICAgICAgICAgICAgIHVzZXJVcmw6IGFjY2Vzcy5zZXNzaW9uLnVybFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5icHVJZCcpKSBiYXNlLmV4cF93YW50c0JwdU5hbWUgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuYnB1SWQnKVxuICAgICAgICAgIGRhdGEgPSAkLmV4dGVuZCh0cnVlLCBkYXRhLCBiYXNlKVxuXG4gICAgICAgICAgcXVldWUucHVzaChkYXRhKTtcblxuICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoYWNjZXNzLnJvdXRlci5zdWJtaXRFeHBlcmltZW50LCB0aGlzLmF1dGgsIHF1ZXVlLCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FcnJvci5TdWJtaXNzaW9uJywgeyBlcnJvcjogZXJyIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcyAmJiByZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMuZXhwZXJpbWVudHMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IHJlc1swXS5faWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VibWl0dGVkJ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FcnJvci5TdWJtaXNzaW9uJywgeyBlcnJvcjogJ05vIHJlc291cmNlIGZvdW5kJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG59KTtcbiJdfQ==
