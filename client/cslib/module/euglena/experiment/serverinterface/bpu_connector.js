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
              exp.status = 'retreiving';
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2JwdV9jb25uZWN0b3IuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwiJCIsInNvY2tldGlvIiwiR2xvYmFscyIsImFjY2VzcyIsInJvdXRlciIsImNvbm5lY3QiLCJkaXNjb25uZWN0IiwiYXV0aG9yaXplIiwiZ2V0UXVldWUiLCJ1cGRhdGUiLCJzdWJtaXRFeHBlcmltZW50Iiwic2VydmVySW5mbyIsIklkZW50aWZpZXIiLCJuYW1lIiwic29ja2V0Q2xpZW50U2VydmVySVAiLCJzb2NrZXRDbGllbnRTZXJ2ZXJQb3J0IiwidXNlciIsImlkIiwiZ3JvdXBzIiwic2Vzc2lvbiIsInNlc3Npb25JRCIsInNvY2tldElEIiwic29ja2V0SGFuZGxlIiwidXJsIiwiZmlsZVNlcnZlciIsImRvbWFpbiIsIkRPV05MT0FEX0RFTEFZIiwiYmluZE1ldGhvZHMiLCJleHBlcmltZW50cyIsImRvd25sb2FkcyIsInNvY2tldCIsIm11bHRpcGxleCIsInJlY29ubmVjdCIsIm9uIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiY2xvc2UiLCJkaXNwYXRjaEV2ZW50IiwiX29uU29ja2V0RGlzY29ubmVjdCIsIl9vblNvY2tldENvbm5lY3QiLCJfb25Tb2NrZXRVcGRhdGUiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJfdXBkYXRlUHJvY2Vzc2luZ1RpbWUiLCJyZWplY3QiLCJyZXNvbHZlIiwiZW1pdCIsIl9vblNvY2tldEF1dGhvcml6YXRpb24iLCJlcnIiLCJhdXRoIiwiYnB1TGlzdCIsImV4cGVyaW1lbnRMaXN0IiwicXVldWUiLCJleHBzIiwiZmlsdGVyIiwiYnB1IiwiaXNPbiIsImJwdVN0YXR1cyIsImxpdmVCcHVFeHBlcmltZW50IiwidXNlcm5hbWUiLCJtYXAiLCJleHAiLCJpbmNsdWRlcyIsIndhaXRpbmciLCJrZXkiLCJzdWJzdHIiLCJsZW5ndGgiLCJjb25jYXQiLCJ3YWl0IiwiZm9yRWFjaCIsInN0YXR1cyIsImV4cGVyaW1lbnRfaWQiLCJyZW1haW5pbmdfZXN0aW1hdGUiLCJleHBfbGFzdFJlc29ydCIsInRvdGFsV2FpdFRpbWUiLCJub3dSdW5uaW5nIiwicHVzaCIsImJjX3RpbWVMZWZ0IiwicHJvY2Vzc19zdGFydCIsInBlcmZvcm1hbmNlIiwibm93IiwidGltZXN0YW1wIiwicmVtYWluaW5nIiwiX2Rvd25sb2FkRGF0YSIsInByb21pc2VBamF4IiwidGltZW91dCIsInRoZW4iLCJleHBkYXRhIiwiZGF0YSIsImV4cGVyaW1lbnQiLCJ2aWRlbyIsImNhdGNoIiwibGlnaHREYXRhIiwiZXhwSWQiLCJ0b3BWYWx1ZSIsInJpZ2h0VmFsdWUiLCJib3R0b21WYWx1ZSIsImxlZnRWYWx1ZSIsInRpbWUiLCJxdWV1ZU9iaiIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImJhc2UiLCJleHBfZXZlbnRzVG9SdW4iLCJncm91cF9leHBlcmltZW50VHlwZSIsImV4cF9tZXRhRGF0YSIsImNsaWVudENyZWF0aW9uRGF0ZSIsIkRhdGUiLCJydW5UaW1lIiwidGFnIiwidXNlclVybCIsImdldCIsImV4cF93YW50c0JwdU5hbWUiLCJleHRlbmQiLCJyZXMiLCJfaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsa0JBQWtCRCxRQUFRLHVCQUFSLENBQXhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsSUFBSUgsUUFBUSxRQUFSLENBRk47QUFBQSxNQUdFSSxXQUFXSixRQUFRLFVBQVIsQ0FIYjtBQUFBLE1BSUVLLFVBQVVMLFFBQVEsb0JBQVIsQ0FKWjtBQUFBLE1BTUVNLFNBQVM7QUFDUEMsWUFBUTtBQUNOQyxlQUFTLFNBREg7QUFFTkMsa0JBQVksWUFGTjtBQUdOQyxpQkFBVyxlQUhMO0FBSU5DLGdCQUFVLHFC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LFNBQUwsQ0FBZXBHLE9BQU9hLElBQXRCLENBQVgsQ0FIRztBQUlURyx1QkFBUztBQUNQRixvQkFBSWQsT0FBT2dCLE9BQVAsQ0FBZUYsRUFEWjtBQUVQRywyQkFBV2pCLE9BQU9nQixPQUFQLENBQWVDLFNBRm5CO0FBR1BFLDhCQUFjbkIsT0FBT2dCLE9BQVAsQ0FBZUcsWUFIdEI7QUFJUEQsMEJBQVVsQixPQUFPZ0IsT0FBUCxDQUFlRSxRQUpsQjtBQUtQTCxzQkFBTXFGLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsU0FBTCxDQUFlcEcsT0FBT2EsSUFBdEIsQ0FBWDtBQUxDLGVBSkE7QUFXVDJGLDRCQUFjO0FBQ1pDLG9DQUFvQixJQUFJQyxJQUFKLEVBRFI7QUFFWkgsc0NBQXNCLE1BRlY7QUFHWkkseUJBQVMsS0FIRztBQUlaQyxxQkFBS2pCLEtBSk87QUFLWmtCLHlCQUFTN0csT0FBT2dCLE9BQVAsQ0FBZUk7QUFMWjtBQVhMLGFBQVg7QUFtQkEsZ0JBQUlyQixRQUFRK0csR0FBUixDQUFZLDRCQUFaLENBQUosRUFBK0NULEtBQUtVLGdCQUFMLEdBQXdCaEgsUUFBUStHLEdBQVIsQ0FBWSw0QkFBWixDQUF4QjtBQUMvQ3hCLG1CQUFPekYsRUFBRW1ILE1BQUYsQ0FBUyxJQUFULEVBQWUxQixJQUFmLEVBQXFCZSxJQUFyQixDQUFQOztBQUVBbkQsa0JBQU13QixJQUFOLENBQVdZLElBQVg7O0FBRUEsbUJBQUszRCxNQUFMLENBQVlpQixJQUFaLENBQWlCNUMsT0FBT0MsTUFBUCxDQUFjTSxnQkFBL0IsRUFBaUQsT0FBS3dDLElBQXRELEVBQTRERyxLQUE1RCxFQUFtRSxVQUFDSixHQUFELEVBQU1tRSxHQUFOLEVBQWM7QUFDL0U7QUFDQSxrQkFBSW5FLEdBQUosRUFBUztBQUNQLHVCQUFLWCxhQUFMLENBQW1CLGdDQUFuQixFQUFxRCxFQUFFSixPQUFPZSxHQUFULEVBQXJEO0FBQ0QsZUFGRCxNQUVPLElBQUltRSxPQUFPQSxJQUFJakQsTUFBZixFQUF1QjtBQUM1Qix1QkFBS3ZDLFdBQUwsQ0FBaUJpRCxJQUFqQixDQUFzQjtBQUNwQjVELHNCQUFJbUcsSUFBSSxDQUFKLEVBQU9DLEdBRFM7QUFFcEI5QywwQkFBUTtBQUZZLGlCQUF0QjtBQUlELGVBTE0sTUFLQTtBQUNMLHVCQUFLakMsYUFBTCxDQUFtQixnQ0FBbkIsRUFBcUQsRUFBRUosT0FBTyxtQkFBVCxFQUFyRDtBQUNEO0FBQ0YsYUFaRDtBQWFEO0FBQ0YsU0E1Q0Q7QUE2Q0Q7QUF4TEg7O0FBQUE7QUFBQSxJQUFrQ3BDLGVBQWxDO0FBMkxELENBcE9EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2JwdV9jb25uZWN0b3IuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
