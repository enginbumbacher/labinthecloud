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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2JwdV9jb25uZWN0b3IuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwiJCIsInNvY2tldGlvIiwiR2xvYmFscyIsImFjY2VzcyIsInJvdXRlciIsImNvbm5lY3QiLCJkaXNjb25uZWN0IiwiYXV0aG9yaXplIiwiZ2V0UXVldWUiLCJ1cGRhdGUiLCJzdWJtaXRFeHBlcmltZW50Iiwic2VydmVySW5mbyIsIklkZW50aWZpZXIiLCJuYW1lIiwic29ja2V0Q2xpZW50U2VydmVySVAiLCJzb2NrZXRDbGllbnRTZXJ2ZXJQb3J0IiwidXNlciIsImlkIiwiZ3JvdXBzIiwic2Vzc2lvbiIsInNlc3Npb25JRCIsInNvY2tldElEIiwic29ja2V0SGFuZGxlIiwidXJsIiwiZmlsZVNlcnZlciIsImRvbWFpbiIsIkRPV05MT0FEX0RFTEFZIiwiYmluZE1ldGhvZHMiLCJleHBlcmltZW50cyIsImRvd25sb2FkcyIsInNvY2tldCIsIm11bHRpcGxleCIsInJlY29ubmVjdCIsIm9uIiwiZXJyb3IiLCJjbG9zZSIsImRpc3BhdGNoRXZlbnQiLCJfb25Tb2NrZXREaXNjb25uZWN0IiwiX29uU29ja2V0Q29ubmVjdCIsIl9vblNvY2tldFVwZGF0ZSIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIl91cGRhdGVQcm9jZXNzaW5nVGltZSIsInJlamVjdCIsInJlc29sdmUiLCJlbWl0IiwiX29uU29ja2V0QXV0aG9yaXphdGlvbiIsImVyciIsImF1dGgiLCJicHVMaXN0IiwiZXhwZXJpbWVudExpc3QiLCJxdWV1ZSIsImV4cHMiLCJmaWx0ZXIiLCJicHUiLCJpc09uIiwiYnB1U3RhdHVzIiwibGl2ZUJwdUV4cGVyaW1lbnQiLCJ1c2VybmFtZSIsIm1hcCIsImV4cCIsImluY2x1ZGVzIiwid2FpdGluZyIsImtleSIsInN1YnN0ciIsImxlbmd0aCIsImNvbmNhdCIsIndhaXQiLCJmb3JFYWNoIiwic3RhdHVzIiwiZXhwZXJpbWVudF9pZCIsInJlbWFpbmluZ19lc3RpbWF0ZSIsImV4cF9sYXN0UmVzb3J0IiwidG90YWxXYWl0VGltZSIsIm5vd1J1bm5pbmciLCJwdXNoIiwiYmNfdGltZUxlZnQiLCJwcm9jZXNzX3N0YXJ0IiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0aW1lc3RhbXAiLCJyZW1haW5pbmciLCJfZG93bmxvYWREYXRhIiwicHJvbWlzZUFqYXgiLCJ0aW1lb3V0IiwidGhlbiIsImV4cGRhdGEiLCJkYXRhIiwiZXhwZXJpbWVudCIsInZpZGVvIiwiY2F0Y2giLCJsaWdodERhdGEiLCJleHBJZCIsInRvcFZhbHVlIiwicmlnaHRWYWx1ZSIsImJvdHRvbVZhbHVlIiwibGVmdFZhbHVlIiwidGltZSIsInF1ZXVlT2JqIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwiYmFzZSIsImV4cF9ldmVudHNUb1J1biIsImdyb3VwX2V4cGVyaW1lbnRUeXBlIiwiZXhwX21ldGFEYXRhIiwiY2xpZW50Q3JlYXRpb25EYXRlIiwiRGF0ZSIsInJ1blRpbWUiLCJ0YWciLCJ1c2VyVXJsIiwiZ2V0IiwiZXhwX3dhbnRzQnB1TmFtZSIsImV4dGVuZCIsInJlcyIsIl9pZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxrQkFBa0JELFFBQVEsdUJBQVIsQ0FBeEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxJQUFJSCxRQUFRLFFBQVIsQ0FGTjtBQUFBLE1BR0VJLFdBQVdKLFFBQVEsVUFBUixDQUhiO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaO0FBQUEsTUFNRU0sU0FBUztBQUNQQyxZQUFRO0FBQ05DLGVBQVMsU0FESDtBQUVOQyxrQkFBWSxZQUZOO0FBR05DLGlCQUFXLGVBSEw7QUFJTkMsZ0JBQVUscUJBSko7QUFLTkMsY0FBUSxR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QUNQRixvQkFBSWQsT0FBT2dCLE9BQVAsQ0FBZUYsRUFEWjtBQUVQRywyQkFBV2pCLE9BQU9nQixPQUFQLENBQWVDLFNBRm5CO0FBR1BFLDhCQUFjbkIsT0FBT2dCLE9BQVAsQ0FBZUcsWUFIdEI7QUFJUEQsMEJBQVVsQixPQUFPZ0IsT0FBUCxDQUFlRSxRQUpsQjtBQUtQTCxzQkFBTW1GLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsU0FBTCxDQUFlbEcsT0FBT2EsSUFBdEIsQ0FBWDtBQUxDLGVBSkE7QUFXVHlGLDRCQUFjO0FBQ1pDLG9DQUFvQixJQUFJQyxJQUFKLEVBRFI7QUFFWkgsc0NBQXNCLE1BRlY7QUFHWkkseUJBQVMsS0FIRztBQUlaQyxxQkFBS2pCLEtBSk87QUFLWmtCLHlCQUFTM0csT0FBT2dCLE9BQVAsQ0FBZUk7QUFMWjtBQVhMLGFBQVg7QUFtQkEsZ0JBQUlyQixRQUFRNkcsR0FBUixDQUFZLDRCQUFaLENBQUosRUFBK0NULEtBQUtVLGdCQUFMLEdBQXdCOUcsUUFBUTZHLEdBQVIsQ0FBWSw0QkFBWixDQUF4QjtBQUMvQ3hCLG1CQUFPdkYsRUFBRWlILE1BQUYsQ0FBUyxJQUFULEVBQWUxQixJQUFmLEVBQXFCZSxJQUFyQixDQUFQOztBQUVBbkQsa0JBQU13QixJQUFOLENBQVdZLElBQVg7O0FBRUEsbUJBQUt6RCxNQUFMLENBQVllLElBQVosQ0FBaUIxQyxPQUFPQyxNQUFQLENBQWNNLGdCQUEvQixFQUFpRCxPQUFLc0MsSUFBdEQsRUFBNERHLEtBQTVELEVBQW1FLFVBQUNKLEdBQUQsRUFBTW1FLEdBQU4sRUFBYztBQUMvRTtBQUNBLGtCQUFJbkUsR0FBSixFQUFTO0FBQ1AsdUJBQUtYLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFELEVBQUVGLE9BQU9hLEdBQVQsRUFBckQ7QUFDRCxlQUZELE1BRU8sSUFBSW1FLE9BQU9BLElBQUlqRCxNQUFmLEVBQXVCO0FBQzVCLHVCQUFLckMsV0FBTCxDQUFpQitDLElBQWpCLENBQXNCO0FBQ3BCMUQsc0JBQUlpRyxJQUFJLENBQUosRUFBT0MsR0FEUztBQUVwQjlDLDBCQUFRO0FBRlksaUJBQXRCO0FBSUQsZUFMTSxNQUtBO0FBQ0wsdUJBQUtqQyxhQUFMLENBQW1CLGdDQUFuQixFQUFxRCxFQUFFRixPQUFPLG1CQUFULEVBQXJEO0FBQ0Q7QUFDRixhQVpEO0FBYUQ7QUFDRixTQTVDRDtBQTZDRDtBQXZMSDs7QUFBQTtBQUFBLElBQWtDcEMsZUFBbEM7QUEwTEQsQ0FuT0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9zZXJ2ZXJpbnRlcmZhY2UvYnB1X2Nvbm5lY3Rvci5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
