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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2JwdV9jb25uZWN0b3IuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwiJCIsInNvY2tldGlvIiwiR2xvYmFscyIsImFjY2VzcyIsInJvdXRlciIsImNvbm5lY3QiLCJkaXNjb25uZWN0IiwiYXV0aG9yaXplIiwiZ2V0UXVldWUiLCJ1cGRhdGUiLCJzdWJtaXRFeHBlcmltZW50Iiwic2VydmVySW5mbyIsIklkZW50aWZpZXIiLCJuYW1lIiwic29ja2V0Q2xpZW50U2VydmVySVAiLCJzb2NrZXRDbGllbnRTZXJ2ZXJQb3J0IiwidXNlciIsImlkIiwiZ3JvdXBzIiwic2Vzc2lvbiIsInNlc3Npb25JRCIsInNvY2tldElEIiwic29ja2V0SGFuZGxlIiwidXJsIiwiZmlsZVNlcnZlciIsImRvbWFpbiIsIkRPV05MT0FEX0RFTEFZIiwiYmluZE1ldGhvZHMiLCJleHBlcmltZW50cyIsImRvd25sb2FkcyIsInNvY2tldCIsIm11bHRpcGxleCIsInJlY29ubmVjdCIsIm9uIiwiZXJyb3IiLCJjbG9zZSIsImRpc3BhdGNoRXZlbnQiLCJfb25Tb2NrZXREaXNjb25uZWN0IiwiX29uU29ja2V0Q29ubmVjdCIsIl9vblNvY2tldFVwZGF0ZSIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIl91cGRhdGVQcm9jZXNzaW5nVGltZSIsInJlamVjdCIsInJlc29sdmUiLCJlbWl0IiwiX29uU29ja2V0QXV0aG9yaXphdGlvbiIsImVyciIsImF1dGgiLCJicHVMaXN0IiwiZXhwZXJpbWVudExpc3QiLCJxdWV1ZSIsImV4cHMiLCJmaWx0ZXIiLCJicHUiLCJpc09uIiwiYnB1U3RhdHVzIiwibGl2ZUJwdUV4cGVyaW1lbnQiLCJ1c2VybmFtZSIsIm1hcCIsImV4cCIsImluY2x1ZGVzIiwid2FpdGluZyIsImtleSIsInN1YnN0ciIsImxlbmd0aCIsImNvbmNhdCIsIndhaXQiLCJmb3JFYWNoIiwic3RhdHVzIiwiZXhwZXJpbWVudF9pZCIsInJlbWFpbmluZ19lc3RpbWF0ZSIsImV4cF9sYXN0UmVzb3J0IiwidG90YWxXYWl0VGltZSIsIm5vd1J1bm5pbmciLCJwdXNoIiwiYmNfdGltZUxlZnQiLCJwcm9jZXNzX3N0YXJ0IiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0aW1lc3RhbXAiLCJyZW1haW5pbmciLCJfZG93bmxvYWREYXRhIiwicHJvbWlzZUFqYXgiLCJ0aW1lb3V0IiwidGhlbiIsImV4cGRhdGEiLCJkYXRhIiwiZXhwZXJpbWVudCIsInZpZGVvIiwiY2F0Y2giLCJsaWdodERhdGEiLCJleHBJZCIsInRvcFZhbHVlIiwicmlnaHRWYWx1ZSIsImJvdHRvbVZhbHVlIiwibGVmdFZhbHVlIiwidGltZSIsInF1ZXVlT2JqIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwiYmFzZSIsImV4cF9ldmVudHNUb1J1biIsImdyb3VwX2V4cGVyaW1lbnRUeXBlIiwiZXhwX21ldGFEYXRhIiwiY2xpZW50Q3JlYXRpb25EYXRlIiwiRGF0ZSIsInJ1blRpbWUiLCJ0YWciLCJ1c2VyVXJsIiwiZ2V0IiwiZXhwX3dhbnRzQnB1TmFtZSIsImV4dGVuZCIsInJlcyIsIl9pZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxrQkFBa0JELFFBQVEsdUJBQVIsQ0FBeEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxJQUFJSCxRQUFRLFFBQVIsQ0FGTjtBQUFBLE1BR0VJLFdBQVdKLFFBQVEsVUFBUixDQUhiO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaO0FBQUEsTUFNRU0sU0FBUztBQUNQQyxZQUFRO0FBQ05DLGVBQVMsU0FESDtBQUVOQyxrQkFBWSxZQUZOO0FBR05DLGlCQUFXLGVBSEw7QUFJTkMsZ0JBQVUscUJBSko7QUFLTkMsY0FBUSxR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R0FEUztBQUVwQjlDLDBCQUFRO0FBRlksaUJBQXRCO0FBSUQsZUFMTSxNQUtBO0FBQ0wsdUJBQUtqQyxhQUFMLENBQW1CLGdDQUFuQixFQUFxRCxFQUFFRixPQUFPLG1CQUFULEVBQXJEO0FBQ0Q7QUFDRixhQVpEO0FBYUQ7QUFDRixTQTVDRDtBQTZDRDtBQXZMSDs7QUFBQTtBQUFBLElBQWtDcEMsZUFBbEM7QUEwTEQsQ0FuT0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9zZXJ2ZXJpbnRlcmZhY2UvYnB1X2Nvbm5lY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdjb3JlL2V2ZW50L2Rpc3BhdGNoZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICBzb2NrZXRpbyA9IHJlcXVpcmUoJ3NvY2tldGlvJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuXG4gICAgYWNjZXNzID0ge1xuICAgICAgcm91dGVyOiB7XG4gICAgICAgIGNvbm5lY3Q6ICdjb25uZWN0JyxcbiAgICAgICAgZGlzY29ubmVjdDogJ2Rpc2Nvbm5lY3QnLFxuICAgICAgICBhdXRob3JpemU6ICdzZXRDb25uZWN0aW9uJyxcbiAgICAgICAgZ2V0UXVldWU6ICdnZXRKb2luUXVldWVEYXRhT2JqJyxcbiAgICAgICAgdXBkYXRlOiAndXBkYXRlJyxcbiAgICAgICAgc3VibWl0RXhwZXJpbWVudDogJy9icHVDb250LyNzdWJtaXRFeHBlcmltZW50UmVxdWVzdCdcbiAgICAgIH0sXG4gICAgICBzZXJ2ZXJJbmZvOiB7XG4gICAgICAgIElkZW50aWZpZXI6ICdDNDIyNjkxQUEzOEY5QTg2RUMwMkNCN0I1NUQ1RjU0MicsXG4gICAgICAgIG5hbWU6ICdyYWRpYW50bGxhbWEnLFxuICAgICAgICBzb2NrZXRDbGllbnRTZXJ2ZXJJUDogJ2V1Z2xlbmEuc3RhbmZvcmQuZWR1JyxcbiAgICAgICAgc29ja2V0Q2xpZW50U2VydmVyUG9ydDogODA4NFxuICAgICAgfSxcbiAgICAgIHVzZXI6IHtcbiAgICAgICAgaWQ6ICc1NzQ4ODU4OThiZjE4Yjk1MDgxOTNlMmEnLFxuICAgICAgICBuYW1lOiAncmFkaWFudGxsYW1hJyxcbiAgICAgICAgZ3JvdXBzOiBbJ2RlZmF1bHQnXVxuICAgICAgfSxcbiAgICAgIHNlc3Npb246IHtcbiAgICAgICAgaWQ6ICc1OGJmNTcxY2M4OWI5OTA5MjU1M2ZhNjUnLFxuICAgICAgICBzZXNzaW9uSUQ6ICdSLU9wWUxiVDZLay1HWHlFbVgxU09PT0hEdzE1N21KYycsXG4gICAgICAgIHNvY2tldElEOiBudWxsLFxuICAgICAgICBzb2NrZXRIYW5kbGU6ICcvYWNjb3VudC9qb2lubGFid2l0aGRhdGEnLFxuICAgICAgICB1cmw6ICcvYWNjb3VudC9qb2lubGFid2l0aGRhdGEnXG4gICAgICB9XG4gICAgfSxcbiAgICBmaWxlU2VydmVyID0gYGh0dHA6Ly8ke2FjY2Vzcy5zZXJ2ZXJJbmZvLnNvY2tldENsaWVudFNlcnZlcklQfS9hY2NvdW50L2pvaW5sYWJ3aXRoZGF0YS9kb3dubG9hZEZpbGUvYCxcbiAgICBkb21haW4gPSBgaHR0cDovLyR7YWNjZXNzLnNlcnZlckluZm8uc29ja2V0Q2xpZW50U2VydmVySVB9OiR7YWNjZXNzLnNlcnZlckluZm8uc29ja2V0Q2xpZW50U2VydmVyUG9ydH1gXG4gIDtcblxuICBjb25zdCBET1dOTE9BRF9ERUxBWSA9IDEwMDtcblxuICByZXR1cm4gY2xhc3MgQlBVQ29ubmVjdG9yIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25Tb2NrZXREaXNjb25uZWN0JyxcbiAgICAgICAgJ19vblNvY2tldENvbm5lY3QnLFxuICAgICAgICAnX29uU29ja2V0VXBkYXRlJyxcbiAgICAgICAgJ19vblNvY2tldEF1dGhvcml6YXRpb24nLFxuICAgICAgICAnX3VwZGF0ZVByb2Nlc3NpbmdUaW1lJ1xuICAgICAgXSk7XG4gICAgICB0aGlzLmV4cGVyaW1lbnRzID0gW107XG4gICAgICB0aGlzLmRvd25sb2FkcyA9IFtdO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICB0aGlzLnNvY2tldCA9IHNvY2tldGlvLmNvbm5lY3QoZG9tYWluLCB7XG4gICAgICAgIG11bHRpcGxleDogZmFsc2UsXG4gICAgICAgIHJlY29ubmVjdDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdF9lcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvblJlZnVzZWQnLCB7ZXJyb3I6IGVycm9yfSk7XG4gICAgICB9KVxuICAgICAgdGhpcy5zb2NrZXQub24oYWNjZXNzLnJvdXRlci5kaXNjb25uZWN0LCB0aGlzLl9vblNvY2tldERpc2Nvbm5lY3QpO1xuICAgICAgdGhpcy5zb2NrZXQub24oYWNjZXNzLnJvdXRlci5jb25uZWN0LCB0aGlzLl9vblNvY2tldENvbm5lY3QpO1xuICAgICAgdGhpcy5zb2NrZXQub24oYWNjZXNzLnJvdXRlci51cGRhdGUsIHRoaXMuX29uU29ja2V0VXBkYXRlKTtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fdXBkYXRlUHJvY2Vzc2luZ1RpbWUpO1xuICAgIH1cblxuICAgIF9vblNvY2tldERpc2Nvbm5lY3QocmVqZWN0KSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnQlBVIGNvbnRyb2xsZXIgZGlzY29ubmVjdGVkJyk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvbicsIHsgZXJyb3I6ICdDb3VsZCBub3QgY29ubmVjdCB0byB0aGUgQlBVIENvbnRyb2xsZXInIH0pO1xuICAgIH1cblxuICAgIF9vblNvY2tldENvbm5lY3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnQlBVIGNvbnRyb2xsZXIgY29ubmVjdGVkJyk7XG4gICAgICB0aGlzLnNvY2tldC5lbWl0KGFjY2Vzcy5yb3V0ZXIuYXV0aG9yaXplLCBhY2Nlc3Muc2VydmVySW5mbywgdGhpcy5fb25Tb2NrZXRBdXRob3JpemF0aW9uKTtcbiAgICB9XG5cbiAgICBfb25Tb2NrZXRBdXRob3JpemF0aW9uKGVyciwgYXV0aCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvbicsIHsgZXJyb3I6ICdDb3VsZCBub3QgYXV0aG9yaXplIHdpdGggQlBVIENvbnRyb2xsZXInIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hdXRoID0gYXV0aDtcbiAgICAgICAgYWNjZXNzLnNlc3Npb24uc29ja2V0SUQgPSB0aGlzLnNvY2tldC5pZDtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLlJlYWR5Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uU29ja2V0VXBkYXRlKGJwdUxpc3QsIGV4cGVyaW1lbnRMaXN0LCBxdWV1ZSkge1xuICAgICAgY29uc3QgZXhwcyA9IGJwdUxpc3QuZmlsdGVyKChicHUpID0+IHtcbiAgICAgICAgcmV0dXJuIGJwdS5pc09uICYmIGJwdS5icHVTdGF0dXMgPT0gXCJydW5uaW5nXCIgJiYgYnB1LmxpdmVCcHVFeHBlcmltZW50LnVzZXJuYW1lID09IGFjY2Vzcy51c2VyLm5hbWUgJiYgdGhpcy5leHBlcmltZW50cy5tYXAoKGV4cCkgPT4gZXhwLmlkKS5pbmNsdWRlcyhicHUubGl2ZUJwdUV4cGVyaW1lbnQuaWQpO1xuICAgICAgfSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhleHBzKTtcbiAgICAgIGxldCB3YWl0aW5nID0gW107XG4gICAgICBmb3IgKGxldCBrZXkgaW4gZXhwZXJpbWVudExpc3QpIHtcbiAgICAgICAgaWYgKGtleS5zdWJzdHIoMCwzKSA9PSBcImV1Z1wiICYmIGV4cGVyaW1lbnRMaXN0W2tleV0ubGVuZ3RoKSB7XG4gICAgICAgICAgd2FpdGluZyA9IHdhaXRpbmcuY29uY2F0KGV4cGVyaW1lbnRMaXN0W2tleV0uZmlsdGVyKCh3YWl0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5leHBlcmltZW50cy5tYXAoKGV4cCkgPT4gZXhwLmlkKS5pbmNsdWRlcyh3YWl0LmlkKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh3YWl0aW5nLmxlbmd0aCkge1xuICAgICAgICB3YWl0aW5nLmZvckVhY2goKHdhaXQpID0+IHtcbiAgICAgICAgICB0aGlzLmV4cGVyaW1lbnRzLmZpbHRlcigoZXhwKSA9PiBleHAuaWQgPT0gd2FpdC5pZCkuZm9yRWFjaCgoZXhwKSA9PiB7XG4gICAgICAgICAgICBleHAuc3RhdHVzID0gJ3F1ZXVlJztcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlVwZGF0ZScsIHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRfaWQ6IHdhaXQuaWQsXG4gICAgICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IHdhaXQuZXhwX2xhc3RSZXNvcnQudG90YWxXYWl0VGltZSxcbiAgICAgICAgICAgIHN0YXR1czogJ3F1ZXVlJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBjb25zdCBub3dSdW5uaW5nID0gW107XG4gICAgICBpZiAoZXhwcyAmJiBleHBzLmxlbmd0aCkge1xuICAgICAgICBleHBzLmZvckVhY2goKGJwdSkgPT4ge1xuICAgICAgICAgIHRoaXMuZXhwZXJpbWVudHMuZmlsdGVyKChleHApID0+IGV4cC5pZCA9PSBicHUubGl2ZUJwdUV4cGVyaW1lbnQuaWQpLmZvckVhY2goKGV4cCkgPT4ge1xuICAgICAgICAgICAgZXhwLnN0YXR1cyA9ICdydW5uaW5nJztcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub3dSdW5uaW5nLnB1c2goYnB1LmxpdmVCcHVFeHBlcmltZW50LmlkKTtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5VcGRhdGUnLCB7XG4gICAgICAgICAgICBleHBlcmltZW50X2lkOiBicHUubGl2ZUJwdUV4cGVyaW1lbnQuaWQsXG4gICAgICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IGJwdS5saXZlQnB1RXhwZXJpbWVudC5iY190aW1lTGVmdCxcbiAgICAgICAgICAgIHN0YXR1czogJ3J1bm5pbmcnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLmV4cGVyaW1lbnRzLmZvckVhY2goKGV4cCkgPT4ge1xuICAgICAgICBpZiAoZXhwLnN0YXR1cyA9PSAncnVubmluZycgJiYgIW5vd1J1bm5pbmcuaW5jbHVkZXMoZXhwLmlkKSkge1xuICAgICAgICAgIGV4cC5zdGF0dXMgPSAncHJvY2Vzc2luZyc7XG4gICAgICAgICAgZXhwLnByb2Nlc3Nfc3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfdXBkYXRlUHJvY2Vzc2luZ1RpbWUodGltZXN0YW1wKSB7XG4gICAgICB0aGlzLmV4cGVyaW1lbnRzLmZvckVhY2goKGV4cCkgPT4ge1xuICAgICAgICBpZiAoZXhwLnN0YXR1cyA9PSAncHJvY2Vzc2luZycpIHtcbiAgICAgICAgICBjb25zdCByZW1haW5pbmcgPSBET1dOTE9BRF9ERUxBWSAqIDEwMDAgLSAodGltZXN0YW1wIC0gZXhwLnByb2Nlc3Nfc3RhcnQpXG4gICAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwKSB7XG4gICAgICAgICAgICBleHAuc3RhdHVzID0gJ3JldHJlaXZpbmcnO1xuICAgICAgICAgICAgZGVsZXRlIGV4cC5wcm9jZXNzX3N0YXJ0O1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50X2lkOiBleHAuaWQsXG4gICAgICAgICAgICAgIHN0YXR1czogZXhwLnN0YXR1cyxcbiAgICAgICAgICAgICAgcmVtYWluaW5nX2VzdGltYXRlOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fZG93bmxvYWREYXRhKGV4cCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlVwZGF0ZScsIHtcbiAgICAgICAgICAgICAgZXhwZXJpbWVudF9pZDogZXhwLmlkLFxuICAgICAgICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IHJlbWFpbmluZyxcbiAgICAgICAgICAgICAgc3RhdHVzOiBleHAuc3RhdHVzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX3VwZGF0ZVByb2Nlc3NpbmdUaW1lKTtcbiAgICB9XG5cbiAgICBfZG93bmxvYWREYXRhKGV4cCkge1xuICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYCR7ZmlsZVNlcnZlcn0ke2V4cC5pZH0vJHtleHAuaWR9Lmpzb25gLCB7IHRpbWVvdXQ6IDEwICogMTAwMCB9KVxuICAgICAgLnRoZW4oKGV4cGRhdGEpID0+IHtcbiAgICAgICAgZXhwLmRhdGEgPSB7XG4gICAgICAgICAgZXhwZXJpbWVudDogZXhwZGF0YSxcbiAgICAgICAgICB2aWRlbzogYCR7ZmlsZVNlcnZlcn0ke2V4cC5pZH0vbW92aWUubXA0YFxuICAgICAgICB9O1xuICAgICAgICBleHAuc3RhdHVzID0gJ3JlYWR5JztcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuUmVhZHknLCBleHApO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAvLyB0cnkgYWdhaW4/XG4gICAgICAgIHRoaXMuX2Rvd25sb2FkRGF0YShleHApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcnVuRXhwZXJpbWVudChsaWdodERhdGEsIGV4cElkKSB7XG4gICAgICBsaWdodERhdGEucHVzaCh7IHRvcFZhbHVlOiAwLCByaWdodFZhbHVlOiAwLCBib3R0b21WYWx1ZTogMCwgbGVmdFZhbHVlOiAwLCB0aW1lOiA2MDAwMCB9KVxuICAgICAgdGhpcy5zb2NrZXQuZW1pdChhY2Nlc3Mucm91dGVyLmdldFF1ZXVlLCBhY2Nlc3Muc2VydmVySW5mbywgKGVyciwgcXVldWVPYmopID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FcnJvci5RdWV1ZScsIHsgZXJyb3I6IGVyciB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBxdWV1ZSA9IFtdO1xuICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShxdWV1ZU9iaikpOyAvL2Nsb25lcyB0aGUgcXVldWVPYmpcbiAgICAgICAgICBsZXQgYmFzZSA9IHtcbiAgICAgICAgICAgIGV4cF9ldmVudHNUb1J1bjogbGlnaHREYXRhLFxuICAgICAgICAgICAgZ3JvdXBfZXhwZXJpbWVudFR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgIHVzZXI6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYWNjZXNzLnVzZXIpKSxcbiAgICAgICAgICAgIHNlc3Npb246IHtcbiAgICAgICAgICAgICAgaWQ6IGFjY2Vzcy5zZXNzaW9uLmlkLFxuICAgICAgICAgICAgICBzZXNzaW9uSUQ6IGFjY2Vzcy5zZXNzaW9uLnNlc3Npb25JRCxcbiAgICAgICAgICAgICAgc29ja2V0SGFuZGxlOiBhY2Nlc3Muc2Vzc2lvbi5zb2NrZXRIYW5kbGUsXG4gICAgICAgICAgICAgIHNvY2tldElEOiBhY2Nlc3Muc2Vzc2lvbi5zb2NrZXRJRCxcbiAgICAgICAgICAgICAgdXNlcjogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhY2Nlc3MudXNlcikpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXhwX21ldGFEYXRhOiB7XG4gICAgICAgICAgICAgIGNsaWVudENyZWF0aW9uRGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgZ3JvdXBfZXhwZXJpbWVudFR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgcnVuVGltZTogNjAwMDAsXG4gICAgICAgICAgICAgIHRhZzogZXhwSWQsXG4gICAgICAgICAgICAgIHVzZXJVcmw6IGFjY2Vzcy5zZXNzaW9uLnVybFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5icHVJZCcpKSBiYXNlLmV4cF93YW50c0JwdU5hbWUgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuYnB1SWQnKVxuICAgICAgICAgIGRhdGEgPSAkLmV4dGVuZCh0cnVlLCBkYXRhLCBiYXNlKVxuXG4gICAgICAgICAgcXVldWUucHVzaChkYXRhKTtcblxuICAgICAgICAgIHRoaXMuc29ja2V0LmVtaXQoYWNjZXNzLnJvdXRlci5zdWJtaXRFeHBlcmltZW50LCB0aGlzLmF1dGgsIHF1ZXVlLCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FcnJvci5TdWJtaXNzaW9uJywgeyBlcnJvcjogZXJyIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcyAmJiByZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMuZXhwZXJpbWVudHMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IHJlc1swXS5faWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnc3VibWl0dGVkJ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FcnJvci5TdWJtaXNzaW9uJywgeyBlcnJvcjogJ05vIHJlc291cmNlIGZvdW5kJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBcbn0pOyJdfQ==
