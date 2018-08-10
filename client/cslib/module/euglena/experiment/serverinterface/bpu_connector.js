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
      Globals = require('core/model/globals');

  var prod_access = {
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
  };

  var dev_access = {
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
  };

  var access = dev_access,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2JwdV9jb25uZWN0b3IuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwiJCIsInNvY2tldGlvIiwiR2xvYmFscyIsInByb2RfYWNjZXNzIiwicm91dGVyIiwiY29ubmVjdCIsImRpc2Nvbm5lY3QiLCJhdXRob3JpemUiLCJnZXRRdWV1ZSIsInVwZGF0ZSIsInN1Ym1pdEV4cGVyaW1lbnQiLCJzZXJ2ZXJJbmZvIiwiSWRlbnRpZmllciIsIm5hbWUiLCJzb2NrZXRDbGllbnRTZXJ2ZXJJUCIsInNvY2tldENsaWVudFNlcnZlclBvcnQiLCJ1c2VyIiwiaWQiLCJncm91cHMiLCJzZXNzaW9uIiwic2Vzc2lvbklEIiwic29ja2V0SUQiLCJzb2NrZXRIYW5kbGUiLCJ1cmwiLCJkZXZfYWNjZXNzIiwiYWNjZXNzIiwiZmlsZVNlcnZlciIsImRvbWFpbiIsIkRPV05MT0FEX0RFTEFZIiwiYmluZE1ldGhvZHMiLCJleHBlcmltZW50cyIsImRvd25sb2FkcyIsInNvY2tldCIsIm11bHRpcGxleCIsInJlY29ubmVjdCIsIm9uIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwiY2xvc2UiLCJkaXNwYXRjaEV2ZW50IiwiX29uU29ja2V0RGlzY29ubmVjdCIsIl9vblNvY2tldENvbm5lY3QiLCJfb25Tb2NrZXRVcGRhdGUiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJfdXBkYXRlUHJvY2Vzc2luZ1RpbWUiLCJyZWplY3QiLCJyZXNvbHZlIiwiZW1pdCIsIl9vblNvY2tldEF1dGhvcml6YXRpb24iLCJlcnIiLCJhdXRoIiwiYnB1TGlzdCIsImV4cGVyaW1lbnRMaXN0IiwicXVldWUiLCJleHBzIiwiZmlsdGVyIiwiYnB1IiwiaXNPbiIsImJwdVN0YXR1cyIsImxpdmVCcHVFeHBlcmltZW50IiwidXNlcm5hbWUiLCJtYXAiLCJleHAiLCJpbmNsdWRlcyIsIndhaXRpbmciLCJrZXkiLCJzdWJzdHIiLCJsZW5ndGgiLCJjb25jYXQiLCJ3YWl0IiwiZm9yRWFjaCIsInN0YXR1cyIsImV4cGVyaW1lbnRfaWQiLCJyZW1haW5pbmdfZXN0aW1hdGUiLCJleHBfbGFzdFJlc29ydCIsInRvdGFsV2FpdFRpbWUiLCJub3dSdW5uaW5nIiwicHVzaCIsImJjX3RpbWVMZWZ0IiwicHJvY2Vzc19zdGFydCIsInBlcmZvcm1hbmNlIiwibm93IiwidGltZXN0YW1wIiwicmVtYWluaW5nIiwiX2Rvd25sb2FkRGF0YSIsInByb21pc2VBamF4IiwidGltZW91dCIsInRoZW4iLCJleHBkYXRhIiwiZGF0YSIsImV4cGVyaW1lbnQiLCJ2aWRlbyIsImNhdGNoIiwibGlnaHREYXRhIiwiZXhwSWQiLCJ0b3BWYWx1ZSIsInJpZ2h0VmFsdWUiLCJib3R0b21WYWx1ZSIsImxlZnRWYWx1ZSIsInRpbWUiLCJxdWV1ZU9iaiIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImJhc2UiLCJleHBfZXZlbnRzVG9SdW4iLCJncm91cF9leHBlcmltZW50VHlwZSIsImV4cF9tZXRhRGF0YSIsImNsaWVudENyZWF0aW9uRGF0ZSIsIkRhdGUiLCJydW5UaW1lIiwidGFnIiwidXNlclVybCIsImdldCIsImV4cF93YW50c0JwdU5hbWUiLCJleHRlbmQiLCJyZXMiLCJfaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsa0JBQWtCRCxRQUFRLHVCQUFSLENBQXhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsSUFBSUgsUUFBUSxRQUFSLENBRk47QUFBQSxNQUdFSSxXQUFXSixRQUFRLFVBQVIsQ0FIYjtBQUFBLE1BSUVLLFVBQVVMLFFBQVEsb0JBQVIsQ0FKWjs7QUFNRSxNQUFNTSxjQUFjO0FBQ2xCQyxZQUFRO0FBQ05DLGVBQVMsU0FESDtBQUVOQyxrQkFBWSxZQUZOO0FB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QVIsQ0FBWSw0QkFBWixDQUFKLEVBQStDVCxLQUFLVSxnQkFBTCxHQUF3QmxILFFBQVFpSCxHQUFSLENBQVksNEJBQVosQ0FBeEI7QUFDL0N4QixtQkFBTzNGLEVBQUVxSCxNQUFGLENBQVMsSUFBVCxFQUFlMUIsSUFBZixFQUFxQmUsSUFBckIsQ0FBUDs7QUFFQW5ELGtCQUFNd0IsSUFBTixDQUFXWSxJQUFYOztBQUVBLG1CQUFLM0QsTUFBTCxDQUFZaUIsSUFBWixDQUFpQnhCLE9BQU9yQixNQUFQLENBQWNNLGdCQUEvQixFQUFpRCxPQUFLMEMsSUFBdEQsRUFBNERHLEtBQTVELEVBQW1FLFVBQUNKLEdBQUQsRUFBTW1FLEdBQU4sRUFBYztBQUMvRTtBQUNBLGtCQUFJbkUsR0FBSixFQUFTO0FBQ1AsdUJBQUtYLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFELEVBQUVKLE9BQU9lLEdBQVQsRUFBckQ7QUFDRCxlQUZELE1BRU8sSUFBSW1FLE9BQU9BLElBQUlqRCxNQUFmLEVBQXVCO0FBQzVCLHVCQUFLdkMsV0FBTCxDQUFpQmlELElBQWpCLENBQXNCO0FBQ3BCOUQsc0JBQUlxRyxJQUFJLENBQUosRUFBT0MsR0FEUztBQUVwQjlDLDBCQUFRO0FBRlksaUJBQXRCO0FBSUQsZUFMTSxNQUtBO0FBQ0wsdUJBQUtqQyxhQUFMLENBQW1CLGdDQUFuQixFQUFxRCxFQUFFSixPQUFPLG1CQUFULEVBQXJEO0FBQ0Q7QUFDRixhQVpEO0FBYUQ7QUFDRixTQTVDRDtBQTZDRDtBQXhMSDs7QUFBQTtBQUFBLElBQWtDdEMsZUFBbEM7QUEyTEQsQ0FuUUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9zZXJ2ZXJpbnRlcmZhY2UvYnB1X2Nvbm5lY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdjb3JlL2V2ZW50L2Rpc3BhdGNoZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICBzb2NrZXRpbyA9IHJlcXVpcmUoJ3NvY2tldGlvJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gICAgY29uc3QgcHJvZF9hY2Nlc3MgPSB7XG4gICAgICByb3V0ZXI6IHtcbiAgICAgICAgY29ubmVjdDogJ2Nvbm5lY3QnLFxuICAgICAgICBkaXNjb25uZWN0OiAnZGlzY29ubmVjdCcsXG4gICAgICAgIGF1dGhvcml6ZTogJ3NldENvbm5lY3Rpb24nLFxuICAgICAgICBnZXRRdWV1ZTogJ2dldEpvaW5RdWV1ZURhdGFPYmonLFxuICAgICAgICB1cGRhdGU6ICd1cGRhdGUnLFxuICAgICAgICBzdWJtaXRFeHBlcmltZW50OiAnL2JwdUNvbnQvI3N1Ym1pdEV4cGVyaW1lbnRSZXF1ZXN0J1xuICAgICAgfSxcbiAgICAgIHNlcnZlckluZm86IHtcbiAgICAgICAgSWRlbnRpZmllcjogJ0M0MjI2OTFBQTM4RjlBODZFQzAyQ0I3QjU1RDVGNTQyJyxcbiAgICAgICAgbmFtZTogJ3JhZGlhbnRsbGFtYScsXG4gICAgICAgIHNvY2tldENsaWVudFNlcnZlcklQOiAnZXVnbGVuYS5zdGFuZm9yZC5lZHUnLFxuICAgICAgICBzb2NrZXRDbGllbnRTZXJ2ZXJQb3J0OiA4MDg0XG4gICAgICB9LFxuICAgICAgdXNlcjoge1xuICAgICAgICBpZDogJzU3NDg4NTg5OGJmMThiOTUwODE5M2UyYScsXG4gICAgICAgIG5hbWU6ICdyYWRpYW50bGxhbWEnLFxuICAgICAgICBncm91cHM6IFsnZGVmYXVsdCddXG4gICAgICB9LFxuICAgICAgc2Vzc2lvbjoge1xuICAgICAgICBpZDogJzU4YmY1NzFjYzg5Yjk5MDkyNTUzZmE2NScsXG4gICAgICAgIHNlc3Npb25JRDogJ1ItT3BZTGJUNktrLUdYeUVtWDFTT09PSER3MTU3bUpjJyxcbiAgICAgICAgc29ja2V0SUQ6IG51bGwsXG4gICAgICAgIHNvY2tldEhhbmRsZTogJy9hY2NvdW50L2pvaW5sYWJ3aXRoZGF0YScsXG4gICAgICAgIHVybDogJy9hY2NvdW50L2pvaW5sYWJ3aXRoZGF0YSdcbiAgICAgIH1cbiAgICB9XG4gIDtcblxuICBjb25zdCBkZXZfYWNjZXNzID0ge1xuICAgIHJvdXRlcjoge1xuICAgICAgY29ubmVjdDogJ2Nvbm5lY3QnLFxuICAgICAgZGlzY29ubmVjdDogJ2Rpc2Nvbm5lY3QnLFxuICAgICAgYXV0aG9yaXplOiAnc2V0Q29ubmVjdGlvbicsXG4gICAgICBnZXRRdWV1ZTogJ2dldEpvaW5RdWV1ZURhdGFPYmonLFxuICAgICAgdXBkYXRlOiAndXBkYXRlJyxcbiAgICAgIHN1Ym1pdEV4cGVyaW1lbnQ6ICcvYnB1Q29udC8jc3VibWl0RXhwZXJpbWVudFJlcXVlc3QnXG4gICAgfSxcbiAgICBzZXJ2ZXJJbmZvOiB7XG4gICAgICBJZGVudGlmaWVyOiAnQzQyMjY5MUFBMzhGOUE4NkVDMDJDQjdCNTVENUY1NDInLFxuICAgICAgbmFtZTogJ3JhZGlhbnRsbGFtYScsXG4gICAgICBzb2NrZXRDbGllbnRTZXJ2ZXJJUDogJ2Jpb3RpYy5zdGFuZm9yZC5lZHUnLFxuICAgICAgc29ja2V0Q2xpZW50U2VydmVyUG9ydDogODA4NFxuICAgIH0sXG4gICAgdXNlcjoge1xuICAgICAgaWQ6ICc1NzQ4ODU4OThiZjE4Yjk1MDgxOTNlMmEnLFxuICAgICAgbmFtZTogJ3JhZGlhbnRsbGFtYScsXG4gICAgICBncm91cHM6IFsnZGVmYXVsdCddXG4gICAgfSxcbiAgICBzZXNzaW9uOiB7XG4gICAgICBpZDogJzU4YmY1NzFjYzg5Yjk5MDkyNTUzZmE2NScsXG4gICAgICBzZXNzaW9uSUQ6ICdSLU9wWUxiVDZLay1HWHlFbVgxU09PT0hEdzE1N21KYycsXG4gICAgICBzb2NrZXRJRDogbnVsbCxcbiAgICAgIHNvY2tldEhhbmRsZTogJy9hY2NvdW50L2pvaW5sYWJ3aXRoZGF0YScsXG4gICAgICB1cmw6ICcvYWNjb3VudC9qb2lubGFid2l0aGRhdGEnXG4gICAgfSAgICBcbiAgfTtcblxuICBjb25zdCBhY2Nlc3MgPSBkZXZfYWNjZXNzLFxuICAgIGZpbGVTZXJ2ZXIgPSBgaHR0cDovLyR7YWNjZXNzLnNlcnZlckluZm8uc29ja2V0Q2xpZW50U2VydmVySVB9L2FjY291bnQvam9pbmxhYndpdGhkYXRhL2Rvd25sb2FkRmlsZS9gLFxuICAgIGRvbWFpbiA9IGBodHRwOi8vJHthY2Nlc3Muc2VydmVySW5mby5zb2NrZXRDbGllbnRTZXJ2ZXJJUH06JHthY2Nlc3Muc2VydmVySW5mby5zb2NrZXRDbGllbnRTZXJ2ZXJQb3J0fWBcblxuICBjb25zdCBET1dOTE9BRF9ERUxBWSA9IDEwMDtcblxuICByZXR1cm4gY2xhc3MgQlBVQ29ubmVjdG9yIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25Tb2NrZXREaXNjb25uZWN0JyxcbiAgICAgICAgJ19vblNvY2tldENvbm5lY3QnLFxuICAgICAgICAnX29uU29ja2V0VXBkYXRlJyxcbiAgICAgICAgJ19vblNvY2tldEF1dGhvcml6YXRpb24nLFxuICAgICAgICAnX3VwZGF0ZVByb2Nlc3NpbmdUaW1lJ1xuICAgICAgXSk7XG4gICAgICB0aGlzLmV4cGVyaW1lbnRzID0gW107XG4gICAgICB0aGlzLmRvd25sb2FkcyA9IFtdO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICB0aGlzLnNvY2tldCA9IHNvY2tldGlvLmNvbm5lY3QoZG9tYWluLCB7XG4gICAgICAgIG11bHRpcGxleDogZmFsc2UsXG4gICAgICAgIHJlY29ubmVjdDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdF9lcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FcnJvci5Db25uZWN0aW9uUmVmdXNlZCcsIHtlcnJvcjogZXJyb3J9KTtcbiAgICAgIH0pXG4gICAgICB0aGlzLnNvY2tldC5vbihhY2Nlc3Mucm91dGVyLmRpc2Nvbm5lY3QsIHRoaXMuX29uU29ja2V0RGlzY29ubmVjdCk7XG4gICAgICB0aGlzLnNvY2tldC5vbihhY2Nlc3Mucm91dGVyLmNvbm5lY3QsIHRoaXMuX29uU29ja2V0Q29ubmVjdCk7XG4gICAgICB0aGlzLnNvY2tldC5vbihhY2Nlc3Mucm91dGVyLnVwZGF0ZSwgdGhpcy5fb25Tb2NrZXRVcGRhdGUpO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl91cGRhdGVQcm9jZXNzaW5nVGltZSk7XG4gICAgfVxuXG4gICAgX29uU29ja2V0RGlzY29ubmVjdChyZWplY3QpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdCUFUgY29udHJvbGxlciBkaXNjb25uZWN0ZWQnKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FcnJvci5Db25uZWN0aW9uJywgeyBlcnJvcjogJ0NvdWxkIG5vdCBjb25uZWN0IHRvIHRoZSBCUFUgQ29udHJvbGxlcicgfSk7XG4gICAgfVxuXG4gICAgX29uU29ja2V0Q29ubmVjdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdCUFUgY29udHJvbGxlciBjb25uZWN0ZWQnKTtcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoYWNjZXNzLnJvdXRlci5hdXRob3JpemUsIGFjY2Vzcy5zZXJ2ZXJJbmZvLCB0aGlzLl9vblNvY2tldEF1dGhvcml6YXRpb24pO1xuICAgIH1cblxuICAgIF9vblNvY2tldEF1dGhvcml6YXRpb24oZXJyLCBhdXRoKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FcnJvci5Db25uZWN0aW9uJywgeyBlcnJvcjogJ0NvdWxkIG5vdCBhdXRob3JpemUgd2l0aCBCUFUgQ29udHJvbGxlcicgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmF1dGggPSBhdXRoO1xuICAgICAgICBhY2Nlc3Muc2Vzc2lvbi5zb2NrZXRJRCA9IHRoaXMuc29ja2V0LmlkO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuUmVhZHknKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Tb2NrZXRVcGRhdGUoYnB1TGlzdCwgZXhwZXJpbWVudExpc3QsIHF1ZXVlKSB7XG4gICAgICBjb25zdCBleHBzID0gYnB1TGlzdC5maWx0ZXIoKGJwdSkgPT4ge1xuICAgICAgICByZXR1cm4gYnB1LmlzT24gJiYgYnB1LmJwdVN0YXR1cyA9PSBcInJ1bm5pbmdcIiAmJiBicHUubGl2ZUJwdUV4cGVyaW1lbnQudXNlcm5hbWUgPT0gYWNjZXNzLnVzZXIubmFtZSAmJiB0aGlzLmV4cGVyaW1lbnRzLm1hcCgoZXhwKSA9PiBleHAuaWQpLmluY2x1ZGVzKGJwdS5saXZlQnB1RXhwZXJpbWVudC5pZCk7XG4gICAgICB9KTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGV4cHMpO1xuICAgICAgbGV0IHdhaXRpbmcgPSBbXTtcbiAgICAgIGZvciAobGV0IGtleSBpbiBleHBlcmltZW50TGlzdCkge1xuICAgICAgICBpZiAoa2V5LnN1YnN0cigwLDMpID09IFwiZXVnXCIgJiYgZXhwZXJpbWVudExpc3Rba2V5XS5sZW5ndGgpIHtcbiAgICAgICAgICB3YWl0aW5nID0gd2FpdGluZy5jb25jYXQoZXhwZXJpbWVudExpc3Rba2V5XS5maWx0ZXIoKHdhaXQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV4cGVyaW1lbnRzLm1hcCgoZXhwKSA9PiBleHAuaWQpLmluY2x1ZGVzKHdhaXQuaWQpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHdhaXRpbmcubGVuZ3RoKSB7XG4gICAgICAgIHdhaXRpbmcuZm9yRWFjaCgod2FpdCkgPT4ge1xuICAgICAgICAgIHRoaXMuZXhwZXJpbWVudHMuZmlsdGVyKChleHApID0+IGV4cC5pZCA9PSB3YWl0LmlkKS5mb3JFYWNoKChleHApID0+IHtcbiAgICAgICAgICAgIGV4cC5zdGF0dXMgPSAncXVldWUnO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywge1xuICAgICAgICAgICAgZXhwZXJpbWVudF9pZDogd2FpdC5pZCxcbiAgICAgICAgICAgIHJlbWFpbmluZ19lc3RpbWF0ZTogd2FpdC5leHBfbGFzdFJlc29ydC50b3RhbFdhaXRUaW1lLFxuICAgICAgICAgICAgc3RhdHVzOiAncXVldWUnXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vd1J1bm5pbmcgPSBbXTtcbiAgICAgIGlmIChleHBzICYmIGV4cHMubGVuZ3RoKSB7XG4gICAgICAgIGV4cHMuZm9yRWFjaCgoYnB1KSA9PiB7XG4gICAgICAgICAgdGhpcy5leHBlcmltZW50cy5maWx0ZXIoKGV4cCkgPT4gZXhwLmlkID09IGJwdS5saXZlQnB1RXhwZXJpbWVudC5pZCkuZm9yRWFjaCgoZXhwKSA9PiB7XG4gICAgICAgICAgICBleHAuc3RhdHVzID0gJ3J1bm5pbmcnO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vd1J1bm5pbmcucHVzaChicHUubGl2ZUJwdUV4cGVyaW1lbnQuaWQpO1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlVwZGF0ZScsIHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRfaWQ6IGJwdS5saXZlQnB1RXhwZXJpbWVudC5pZCxcbiAgICAgICAgICAgIHJlbWFpbmluZ19lc3RpbWF0ZTogYnB1LmxpdmVCcHVFeHBlcmltZW50LmJjX3RpbWVMZWZ0LFxuICAgICAgICAgICAgc3RhdHVzOiAncnVubmluZydcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuZXhwZXJpbWVudHMuZm9yRWFjaCgoZXhwKSA9PiB7XG4gICAgICAgIGlmIChleHAuc3RhdHVzID09ICdydW5uaW5nJyAmJiAhbm93UnVubmluZy5pbmNsdWRlcyhleHAuaWQpKSB7XG4gICAgICAgICAgZXhwLnN0YXR1cyA9ICdwcm9jZXNzaW5nJztcbiAgICAgICAgICBleHAucHJvY2Vzc19zdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF91cGRhdGVQcm9jZXNzaW5nVGltZSh0aW1lc3RhbXApIHtcbiAgICAgIHRoaXMuZXhwZXJpbWVudHMuZm9yRWFjaCgoZXhwKSA9PiB7XG4gICAgICAgIGlmIChleHAuc3RhdHVzID09ICdwcm9jZXNzaW5nJykge1xuICAgICAgICAgIGNvbnN0IHJlbWFpbmluZyA9IERPV05MT0FEX0RFTEFZICogMTAwMCAtICh0aW1lc3RhbXAgLSBleHAucHJvY2Vzc19zdGFydClcbiAgICAgICAgICBpZiAocmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgICAgIGV4cC5zdGF0dXMgPSAncmV0cmlldmluZyc7XG4gICAgICAgICAgICBkZWxldGUgZXhwLnByb2Nlc3Nfc3RhcnQ7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5VcGRhdGUnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnRfaWQ6IGV4cC5pZCxcbiAgICAgICAgICAgICAgc3RhdHVzOiBleHAuc3RhdHVzLFxuICAgICAgICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl9kb3dubG9hZERhdGEoZXhwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50X2lkOiBleHAuaWQsXG4gICAgICAgICAgICAgIHJlbWFpbmluZ19lc3RpbWF0ZTogcmVtYWluaW5nLFxuICAgICAgICAgICAgICBzdGF0dXM6IGV4cC5zdGF0dXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fdXBkYXRlUHJvY2Vzc2luZ1RpbWUpO1xuICAgIH1cblxuICAgIF9kb3dubG9hZERhdGEoZXhwKSB7XG4gICAgICBVdGlscy5wcm9taXNlQWpheChgJHtmaWxlU2VydmVyfSR7ZXhwLmlkfS8ke2V4cC5pZH0uanNvbmAsIHsgdGltZW91dDogMTAgKiAxMDAwIH0pXG4gICAgICAudGhlbigoZXhwZGF0YSkgPT4ge1xuICAgICAgICBleHAuZGF0YSA9IHtcbiAgICAgICAgICBleHBlcmltZW50OiBleHBkYXRhLFxuICAgICAgICAgIHZpZGVvOiBgJHtmaWxlU2VydmVyfSR7ZXhwLmlkfS9tb3ZpZS5tcDRgXG4gICAgICAgIH07XG4gICAgICAgIGV4cC5zdGF0dXMgPSAncmVhZHknO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5SZWFkeScsIGV4cCk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIC8vIHRyeSBhZ2Fpbj9cbiAgICAgICAgdGhpcy5fZG93bmxvYWREYXRhKGV4cCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBydW5FeHBlcmltZW50KGxpZ2h0RGF0YSwgZXhwSWQpIHtcbiAgICAgIGxpZ2h0RGF0YS5wdXNoKHsgdG9wVmFsdWU6IDAsIHJpZ2h0VmFsdWU6IDAsIGJvdHRvbVZhbHVlOiAwLCBsZWZ0VmFsdWU6IDAsIHRpbWU6IDYwMDAwIH0pXG4gICAgICB0aGlzLnNvY2tldC5lbWl0KGFjY2Vzcy5yb3V0ZXIuZ2V0UXVldWUsIGFjY2Vzcy5zZXJ2ZXJJbmZvLCAoZXJyLCBxdWV1ZU9iaikgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkVycm9yLlF1ZXVlJywgeyBlcnJvcjogZXJyIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHF1ZXVlID0gW107XG4gICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHF1ZXVlT2JqKSk7IC8vY2xvbmVzIHRoZSBxdWV1ZU9ialxuICAgICAgICAgIGxldCBiYXNlID0ge1xuICAgICAgICAgICAgZXhwX2V2ZW50c1RvUnVuOiBsaWdodERhdGEsXG4gICAgICAgICAgICBncm91cF9leHBlcmltZW50VHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgdXNlcjogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhY2Nlc3MudXNlcikpLFxuICAgICAgICAgICAgc2Vzc2lvbjoge1xuICAgICAgICAgICAgICBpZDogYWNjZXNzLnNlc3Npb24uaWQsXG4gICAgICAgICAgICAgIHNlc3Npb25JRDogYWNjZXNzLnNlc3Npb24uc2Vzc2lvbklELFxuICAgICAgICAgICAgICBzb2NrZXRIYW5kbGU6IGFjY2Vzcy5zZXNzaW9uLnNvY2tldEhhbmRsZSxcbiAgICAgICAgICAgICAgc29ja2V0SUQ6IGFjY2Vzcy5zZXNzaW9uLnNvY2tldElELFxuICAgICAgICAgICAgICB1c2VyOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGFjY2Vzcy51c2VyKSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleHBfbWV0YURhdGE6IHtcbiAgICAgICAgICAgICAgY2xpZW50Q3JlYXRpb25EYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICBncm91cF9leHBlcmltZW50VHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICBydW5UaW1lOiA2MDAwMCxcbiAgICAgICAgICAgICAgdGFnOiBleHBJZCxcbiAgICAgICAgICAgICAgdXNlclVybDogYWNjZXNzLnNlc3Npb24udXJsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmJwdUlkJykpIGJhc2UuZXhwX3dhbnRzQnB1TmFtZSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5icHVJZCcpXG4gICAgICAgICAgZGF0YSA9ICQuZXh0ZW5kKHRydWUsIGRhdGEsIGJhc2UpXG5cbiAgICAgICAgICBxdWV1ZS5wdXNoKGRhdGEpO1xuXG4gICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChhY2Nlc3Mucm91dGVyLnN1Ym1pdEV4cGVyaW1lbnQsIHRoaXMuYXV0aCwgcXVldWUsIChlcnIsIHJlcykgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkVycm9yLlN1Ym1pc3Npb24nLCB7IGVycm9yOiBlcnIgfSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzICYmIHJlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGhpcy5leHBlcmltZW50cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWJtaXR0ZWQnXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkVycm9yLlN1Ym1pc3Npb24nLCB7IGVycm9yOiAnTm8gcmVzb3VyY2UgZm91bmQnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbn0pO1xuIl19
