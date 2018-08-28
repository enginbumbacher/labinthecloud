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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2JwdV9jb25uZWN0b3IuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwiJCIsInNvY2tldGlvIiwiR2xvYmFscyIsImFjY2VzcyIsInJvdXRlciIsImNvbm5lY3QiLCJkaXNjb25uZWN0IiwiYXV0aG9yaXplIiwiZ2V0UXVldWUiLCJ1cGRhdGUiLCJzdWJtaXRFeHBlcmltZW50Iiwic2VydmVySW5mbyIsIklkZW50aWZpZXIiLCJuYW1lIiwic29ja2V0Q2xpZW50U2VydmVySVAiLCJ3aW5kb3ciLCJFdWdsZW5hQ29uZmlnIiwiZXhwZXJpbWVudCIsInNlcnZlciIsInNvY2tldENsaWVudFNlcnZlclBvcnQiLCJ1c2VyIiwiaWQiLCJncm91cHMiLCJzZXNzaW9uIiwic2Vzc2lvbklEIiwic29ja2V0SUQiLCJzb2NrZXRIYW5kbGUiLCJ1cmwiLCJmaWxlU2VydmVyIiwiZG9tYWluIiwiRE9XTkxPQURfREVMQVkiLCJiaW5kTWV0aG9kcyIsImV4cGVyaW1lbnRzIiwiZG93bmxvYWRzIiwic29ja2V0IiwibXVsdGlwbGV4IiwicmVjb25uZWN0Iiwib24iLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJjbG9zZSIsImRpc3BhdGNoRXZlbnQiLCJfb25Tb2NrZXREaXNjb25uZWN0IiwiX29uU29ja2V0Q29ubmVjdCIsIl9vblNvY2tldFVwZGF0ZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIl91cGRhdGVQcm9jZXNzaW5nVGltZSIsInJlamVjdCIsInJlc29sdmUiLCJlbWl0IiwiX29uU29ja2V0QXV0aG9yaXphdGlvbiIsImVyciIsImF1dGgiLCJicHVMaXN0IiwiZXhwZXJpbWVudExpc3QiLCJxdWV1ZSIsImV4cHMiLCJmaWx0ZXIiLCJicHUiLCJpc09uIiwiYnB1U3RhdHVzIiwibGl2ZUJwdUV4cGVyaW1lbnQiLCJ1c2VybmFtZSIsIm1hcCIsImV4cCIsImluY2x1ZGVzIiwid2FpdGluZyIsImtleSIsInN1YnN0ciIsImxlbmd0aCIsImNvbmNhdCIsIndhaXQiLCJmb3JFYWNoIiwic3RhdHVzIiwiZXhwZXJpbWVudF9pZCIsInJlbWFpbmluZ19lc3RpbWF0ZSIsImV4cF9sYXN0UmVzb3J0IiwidG90YWxXYWl0VGltZSIsIm5vd1J1bm5pbmciLCJwdXNoIiwiYmNfdGltZUxlZnQiLCJwcm9jZXNzX3N0YXJ0IiwicGVyZm9ybWFuY2UiLCJub3ciLCJ0aW1lc3RhbXAiLCJyZW1haW5pbmciLCJfZG93bmxvYWREYXRhIiwicHJvbWlzZUFqYXgiLCJ0aW1lb3V0IiwidGhlbiIsImV4cGRhdGEiLCJkYXRhIiwidmlkZW8iLCJjYXRjaCIsImxpZ2h0RGF0YSIsImV4cElkIiwidG9wVmFsdWUiLCJyaWdodFZhbHVlIiwiYm90dG9tVmFsdWUiLCJsZWZ0VmFsdWUiLCJ0aW1lIiwicXVldWVPYmoiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJiYXNlIiwiZXhwX2V2ZW50c1RvUnVuIiwiZ3JvdXBfZXhwZXJpbWVudFR5cGUiLCJleHBfbWV0YURhdGEiLCJjbGllbnRDcmVhdGlvbkRhdGUiLCJEYXRlIiwicnVuVGltZSIsInRhZyIsInVzZXJVcmwiLCJnZXQiLCJleHBfd2FudHNCcHVOYW1lIiwiZXh0ZW5kIiwicmVzIiwiX2lkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGtCQUFrQkQsUUFBUSx1QkFBUixDQUF4QjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLElBQUlILFFBQVEsUUFBUixDQUZOO0FBQUEsTUFHRUksV0FBV0osUUFBUSxVQUFSLENBSGI7QUFBQSxNQUlFSyxVQUFVTCxRQUFRLG9CQUFSLENBSlo7QUFBQSxNQUtFTSxTQUFTO0FBQ1BDLFlBQVE7QUFDTkMsZUFBUyxTQURIO0FBRU5DLGtCQUFZLFlBRk47QUFHTkMs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Q0FBbkIsRUFBcUQsRUFBRUosT0FBT2MsR0FBVCxFQUFyRDtBQUNELGVBRkQsTUFFTyxJQUFJa0UsT0FBT0EsSUFBSWhELE1BQWYsRUFBdUI7QUFDNUIsdUJBQUt0QyxXQUFMLENBQWlCZ0QsSUFBakIsQ0FBc0I7QUFDcEIzRCxzQkFBSWlHLElBQUksQ0FBSixFQUFPQyxHQURTO0FBRXBCN0MsMEJBQVE7QUFGWSxpQkFBdEI7QUFJRCxlQUxNLE1BS0E7QUFDTCx1QkFBS2hDLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFELEVBQUVKLE9BQU8sbUJBQVQsRUFBckQ7QUFDRDtBQUNGLGFBWkQ7QUFhRDtBQUNGLFNBNUNEO0FBNkNEO0FBeExIOztBQUFBO0FBQUEsSUFBa0N4QyxlQUFsQztBQTJMRCxDQWxPRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L3NlcnZlcmludGVyZmFjZS9icHVfY29ubmVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvZGlzcGF0Y2hlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuICAgIHNvY2tldGlvID0gcmVxdWlyZSgnc29ja2V0aW8nKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgYWNjZXNzID0ge1xuICAgICAgcm91dGVyOiB7XG4gICAgICAgIGNvbm5lY3Q6ICdjb25uZWN0JyxcbiAgICAgICAgZGlzY29ubmVjdDogJ2Rpc2Nvbm5lY3QnLFxuICAgICAgICBhdXRob3JpemU6ICdzZXRDb25uZWN0aW9uJyxcbiAgICAgICAgZ2V0UXVldWU6ICdnZXRKb2luUXVldWVEYXRhT2JqJyxcbiAgICAgICAgdXBkYXRlOiAndXBkYXRlJyxcbiAgICAgICAgc3VibWl0RXhwZXJpbWVudDogJy9icHVDb250LyNzdWJtaXRFeHBlcmltZW50UmVxdWVzdCdcbiAgICAgIH0sXG4gICAgICBzZXJ2ZXJJbmZvOiB7XG4gICAgICAgIElkZW50aWZpZXI6ICdDNDIyNjkxQUEzOEY5QTg2RUMwMkNCN0I1NUQ1RjU0MicsXG4gICAgICAgIG5hbWU6ICdyYWRpYW50bGxhbWEnLFxuICAgICAgICBzb2NrZXRDbGllbnRTZXJ2ZXJJUDogd2luZG93LkV1Z2xlbmFDb25maWcuZXhwZXJpbWVudC5zZXJ2ZXIgPT0gXCJkZXZcIiA/ICdiaW90aWMuc3RhbmZvcmQuZWR1JyA6ICdldWdsZW5hLnN0YW5mb3JkLmVkdScsXG4gICAgICAgIHNvY2tldENsaWVudFNlcnZlclBvcnQ6IDgwODRcbiAgICAgIH0sXG4gICAgICB1c2VyOiB7XG4gICAgICAgIGlkOiAnNTc0ODg1ODk4YmYxOGI5NTA4MTkzZTJhJyxcbiAgICAgICAgbmFtZTogJ3JhZGlhbnRsbGFtYScsXG4gICAgICAgIGdyb3VwczogWydkZWZhdWx0J11cbiAgICAgIH0sXG4gICAgICBzZXNzaW9uOiB7XG4gICAgICAgIGlkOiAnNThiZjU3MWNjODliOTkwOTI1NTNmYTY1JyxcbiAgICAgICAgc2Vzc2lvbklEOiAnUi1PcFlMYlQ2S2stR1h5RW1YMVNPT09IRHcxNTdtSmMnLFxuICAgICAgICBzb2NrZXRJRDogbnVsbCxcbiAgICAgICAgc29ja2V0SGFuZGxlOiAnL2FjY291bnQvam9pbmxhYndpdGhkYXRhJyxcbiAgICAgICAgdXJsOiAnL2FjY291bnQvam9pbmxhYndpdGhkYXRhJ1xuICAgICAgfVxuICAgIH0sXG4gICAgZmlsZVNlcnZlciA9IGBodHRwOi8vJHthY2Nlc3Muc2VydmVySW5mby5zb2NrZXRDbGllbnRTZXJ2ZXJJUH0vYWNjb3VudC9qb2lubGFid2l0aGRhdGEvZG93bmxvYWRGaWxlL2AsXG4gICAgZG9tYWluID0gYGh0dHA6Ly8ke2FjY2Vzcy5zZXJ2ZXJJbmZvLnNvY2tldENsaWVudFNlcnZlcklQfToke2FjY2Vzcy5zZXJ2ZXJJbmZvLnNvY2tldENsaWVudFNlcnZlclBvcnR9YFxuXG4gIGNvbnN0IERPV05MT0FEX0RFTEFZID0gMTAwO1xuXG4gIHJldHVybiBjbGFzcyBCUFVDb25uZWN0b3IgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vblNvY2tldERpc2Nvbm5lY3QnLFxuICAgICAgICAnX29uU29ja2V0Q29ubmVjdCcsXG4gICAgICAgICdfb25Tb2NrZXRVcGRhdGUnLFxuICAgICAgICAnX29uU29ja2V0QXV0aG9yaXphdGlvbicsXG4gICAgICAgICdfdXBkYXRlUHJvY2Vzc2luZ1RpbWUnXG4gICAgICBdKTtcbiAgICAgIHRoaXMuZXhwZXJpbWVudHMgPSBbXTtcbiAgICAgIHRoaXMuZG93bmxvYWRzID0gW107XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0aW8uY29ubmVjdChkb21haW4sIHtcbiAgICAgICAgbXVsdGlwbGV4OiBmYWxzZSxcbiAgICAgICAgcmVjb25uZWN0OiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdjb25uZWN0X2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkVycm9yLkNvbm5lY3Rpb25SZWZ1c2VkJywge2Vycm9yOiBlcnJvcn0pO1xuICAgICAgfSlcbiAgICAgIHRoaXMuc29ja2V0Lm9uKGFjY2Vzcy5yb3V0ZXIuZGlzY29ubmVjdCwgdGhpcy5fb25Tb2NrZXREaXNjb25uZWN0KTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uKGFjY2Vzcy5yb3V0ZXIuY29ubmVjdCwgdGhpcy5fb25Tb2NrZXRDb25uZWN0KTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uKGFjY2Vzcy5yb3V0ZXIudXBkYXRlLCB0aGlzLl9vblNvY2tldFVwZGF0ZSk7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX3VwZGF0ZVByb2Nlc3NpbmdUaW1lKTtcbiAgICB9XG5cbiAgICBfb25Tb2NrZXREaXNjb25uZWN0KHJlamVjdCkge1xuICAgICAgLy8gY29uc29sZS5sb2coJ0JQVSBjb250cm9sbGVyIGRpc2Nvbm5lY3RlZCcpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkVycm9yLkNvbm5lY3Rpb24nLCB7IGVycm9yOiAnQ291bGQgbm90IGNvbm5lY3QgdG8gdGhlIEJQVSBDb250cm9sbGVyJyB9KTtcbiAgICB9XG5cbiAgICBfb25Tb2NrZXRDb25uZWN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgLy8gY29uc29sZS5sb2coJ0JQVSBjb250cm9sbGVyIGNvbm5lY3RlZCcpO1xuICAgICAgdGhpcy5zb2NrZXQuZW1pdChhY2Nlc3Mucm91dGVyLmF1dGhvcml6ZSwgYWNjZXNzLnNlcnZlckluZm8sIHRoaXMuX29uU29ja2V0QXV0aG9yaXphdGlvbik7XG4gICAgfVxuXG4gICAgX29uU29ja2V0QXV0aG9yaXphdGlvbihlcnIsIGF1dGgpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkVycm9yLkNvbm5lY3Rpb24nLCB7IGVycm9yOiAnQ291bGQgbm90IGF1dGhvcml6ZSB3aXRoIEJQVSBDb250cm9sbGVyJyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYXV0aCA9IGF1dGg7XG4gICAgICAgIGFjY2Vzcy5zZXNzaW9uLnNvY2tldElEID0gdGhpcy5zb2NrZXQuaWQ7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5SZWFkeScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vblNvY2tldFVwZGF0ZShicHVMaXN0LCBleHBlcmltZW50TGlzdCwgcXVldWUpIHtcbiAgICAgIGNvbnN0IGV4cHMgPSBicHVMaXN0LmZpbHRlcigoYnB1KSA9PiB7XG4gICAgICAgIHJldHVybiBicHUuaXNPbiAmJiBicHUuYnB1U3RhdHVzID09IFwicnVubmluZ1wiICYmIGJwdS5saXZlQnB1RXhwZXJpbWVudC51c2VybmFtZSA9PSBhY2Nlc3MudXNlci5uYW1lICYmIHRoaXMuZXhwZXJpbWVudHMubWFwKChleHApID0+IGV4cC5pZCkuaW5jbHVkZXMoYnB1LmxpdmVCcHVFeHBlcmltZW50LmlkKTtcbiAgICAgIH0pO1xuICAgICAgLy8gY29uc29sZS5sb2coZXhwcyk7XG4gICAgICBsZXQgd2FpdGluZyA9IFtdO1xuICAgICAgZm9yIChsZXQga2V5IGluIGV4cGVyaW1lbnRMaXN0KSB7XG4gICAgICAgIGlmIChrZXkuc3Vic3RyKDAsMykgPT0gXCJldWdcIiAmJiBleHBlcmltZW50TGlzdFtrZXldLmxlbmd0aCkge1xuICAgICAgICAgIHdhaXRpbmcgPSB3YWl0aW5nLmNvbmNhdChleHBlcmltZW50TGlzdFtrZXldLmZpbHRlcigod2FpdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXhwZXJpbWVudHMubWFwKChleHApID0+IGV4cC5pZCkuaW5jbHVkZXMod2FpdC5pZCk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAod2FpdGluZy5sZW5ndGgpIHtcbiAgICAgICAgd2FpdGluZy5mb3JFYWNoKCh3YWl0KSA9PiB7XG4gICAgICAgICAgdGhpcy5leHBlcmltZW50cy5maWx0ZXIoKGV4cCkgPT4gZXhwLmlkID09IHdhaXQuaWQpLmZvckVhY2goKGV4cCkgPT4ge1xuICAgICAgICAgICAgZXhwLnN0YXR1cyA9ICdxdWV1ZSc7XG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5VcGRhdGUnLCB7XG4gICAgICAgICAgICBleHBlcmltZW50X2lkOiB3YWl0LmlkLFxuICAgICAgICAgICAgcmVtYWluaW5nX2VzdGltYXRlOiB3YWl0LmV4cF9sYXN0UmVzb3J0LnRvdGFsV2FpdFRpbWUsXG4gICAgICAgICAgICBzdGF0dXM6ICdxdWV1ZSdcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgY29uc3Qgbm93UnVubmluZyA9IFtdO1xuICAgICAgaWYgKGV4cHMgJiYgZXhwcy5sZW5ndGgpIHtcbiAgICAgICAgZXhwcy5mb3JFYWNoKChicHUpID0+IHtcbiAgICAgICAgICB0aGlzLmV4cGVyaW1lbnRzLmZpbHRlcigoZXhwKSA9PiBleHAuaWQgPT0gYnB1LmxpdmVCcHVFeHBlcmltZW50LmlkKS5mb3JFYWNoKChleHApID0+IHtcbiAgICAgICAgICAgIGV4cC5zdGF0dXMgPSAncnVubmluZyc7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbm93UnVubmluZy5wdXNoKGJwdS5saXZlQnB1RXhwZXJpbWVudC5pZCk7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywge1xuICAgICAgICAgICAgZXhwZXJpbWVudF9pZDogYnB1LmxpdmVCcHVFeHBlcmltZW50LmlkLFxuICAgICAgICAgICAgcmVtYWluaW5nX2VzdGltYXRlOiBicHUubGl2ZUJwdUV4cGVyaW1lbnQuYmNfdGltZUxlZnQsXG4gICAgICAgICAgICBzdGF0dXM6ICdydW5uaW5nJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgdGhpcy5leHBlcmltZW50cy5mb3JFYWNoKChleHApID0+IHtcbiAgICAgICAgaWYgKGV4cC5zdGF0dXMgPT0gJ3J1bm5pbmcnICYmICFub3dSdW5uaW5nLmluY2x1ZGVzKGV4cC5pZCkpIHtcbiAgICAgICAgICBleHAuc3RhdHVzID0gJ3Byb2Nlc3NpbmcnO1xuICAgICAgICAgIGV4cC5wcm9jZXNzX3N0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX3VwZGF0ZVByb2Nlc3NpbmdUaW1lKHRpbWVzdGFtcCkge1xuICAgICAgdGhpcy5leHBlcmltZW50cy5mb3JFYWNoKChleHApID0+IHtcbiAgICAgICAgaWYgKGV4cC5zdGF0dXMgPT0gJ3Byb2Nlc3NpbmcnKSB7XG4gICAgICAgICAgY29uc3QgcmVtYWluaW5nID0gRE9XTkxPQURfREVMQVkgKiAxMDAwIC0gKHRpbWVzdGFtcCAtIGV4cC5wcm9jZXNzX3N0YXJ0KVxuICAgICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICAgICAgZXhwLnN0YXR1cyA9ICdyZXRyaWV2aW5nJztcbiAgICAgICAgICAgIGRlbGV0ZSBleHAucHJvY2Vzc19zdGFydDtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlVwZGF0ZScsIHtcbiAgICAgICAgICAgICAgZXhwZXJpbWVudF9pZDogZXhwLmlkLFxuICAgICAgICAgICAgICBzdGF0dXM6IGV4cC5zdGF0dXMsXG4gICAgICAgICAgICAgIHJlbWFpbmluZ19lc3RpbWF0ZTogMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX2Rvd25sb2FkRGF0YShleHApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5VcGRhdGUnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnRfaWQ6IGV4cC5pZCxcbiAgICAgICAgICAgICAgcmVtYWluaW5nX2VzdGltYXRlOiByZW1haW5pbmcsXG4gICAgICAgICAgICAgIHN0YXR1czogZXhwLnN0YXR1c1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl91cGRhdGVQcm9jZXNzaW5nVGltZSk7XG4gICAgfVxuXG4gICAgX2Rvd25sb2FkRGF0YShleHApIHtcbiAgICAgIFV0aWxzLnByb21pc2VBamF4KGAke2ZpbGVTZXJ2ZXJ9JHtleHAuaWR9LyR7ZXhwLmlkfS5qc29uYCwgeyB0aW1lb3V0OiAxMCAqIDEwMDAgfSlcbiAgICAgIC50aGVuKChleHBkYXRhKSA9PiB7XG4gICAgICAgIGV4cC5kYXRhID0ge1xuICAgICAgICAgIGV4cGVyaW1lbnQ6IGV4cGRhdGEsXG4gICAgICAgICAgdmlkZW86IGAke2ZpbGVTZXJ2ZXJ9JHtleHAuaWR9L21vdmllLm1wNGBcbiAgICAgICAgfTtcbiAgICAgICAgZXhwLnN0YXR1cyA9ICdyZWFkeSc7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlJlYWR5JywgZXhwKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgLy8gdHJ5IGFnYWluP1xuICAgICAgICB0aGlzLl9kb3dubG9hZERhdGEoZXhwKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJ1bkV4cGVyaW1lbnQobGlnaHREYXRhLCBleHBJZCkge1xuICAgICAgbGlnaHREYXRhLnB1c2goeyB0b3BWYWx1ZTogMCwgcmlnaHRWYWx1ZTogMCwgYm90dG9tVmFsdWU6IDAsIGxlZnRWYWx1ZTogMCwgdGltZTogNjAwMDAgfSlcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoYWNjZXNzLnJvdXRlci5nZXRRdWV1ZSwgYWNjZXNzLnNlcnZlckluZm8sIChlcnIsIHF1ZXVlT2JqKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuUXVldWUnLCB7IGVycm9yOiBlcnIgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcXVldWUgPSBbXTtcbiAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocXVldWVPYmopKTsgLy9jbG9uZXMgdGhlIHF1ZXVlT2JqXG4gICAgICAgICAgbGV0IGJhc2UgPSB7XG4gICAgICAgICAgICBleHBfZXZlbnRzVG9SdW46IGxpZ2h0RGF0YSxcbiAgICAgICAgICAgIGdyb3VwX2V4cGVyaW1lbnRUeXBlOiAndGV4dCcsXG4gICAgICAgICAgICB1c2VyOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGFjY2Vzcy51c2VyKSksXG4gICAgICAgICAgICBzZXNzaW9uOiB7XG4gICAgICAgICAgICAgIGlkOiBhY2Nlc3Muc2Vzc2lvbi5pZCxcbiAgICAgICAgICAgICAgc2Vzc2lvbklEOiBhY2Nlc3Muc2Vzc2lvbi5zZXNzaW9uSUQsXG4gICAgICAgICAgICAgIHNvY2tldEhhbmRsZTogYWNjZXNzLnNlc3Npb24uc29ja2V0SGFuZGxlLFxuICAgICAgICAgICAgICBzb2NrZXRJRDogYWNjZXNzLnNlc3Npb24uc29ja2V0SUQsXG4gICAgICAgICAgICAgIHVzZXI6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYWNjZXNzLnVzZXIpKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV4cF9tZXRhRGF0YToge1xuICAgICAgICAgICAgICBjbGllbnRDcmVhdGlvbkRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgIGdyb3VwX2V4cGVyaW1lbnRUeXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgIHJ1blRpbWU6IDYwMDAwLFxuICAgICAgICAgICAgICB0YWc6IGV4cElkLFxuICAgICAgICAgICAgICB1c2VyVXJsOiBhY2Nlc3Muc2Vzc2lvbi51cmxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuYnB1SWQnKSkgYmFzZS5leHBfd2FudHNCcHVOYW1lID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmJwdUlkJylcbiAgICAgICAgICBkYXRhID0gJC5leHRlbmQodHJ1ZSwgZGF0YSwgYmFzZSlcblxuICAgICAgICAgIHF1ZXVlLnB1c2goZGF0YSk7XG5cbiAgICAgICAgICB0aGlzLnNvY2tldC5lbWl0KGFjY2Vzcy5yb3V0ZXIuc3VibWl0RXhwZXJpbWVudCwgdGhpcy5hdXRoLCBxdWV1ZSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuU3VibWlzc2lvbicsIHsgZXJyb3I6IGVyciB9KVxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXMgJiYgcmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLmV4cGVyaW1lbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiByZXNbMF0uX2lkLFxuICAgICAgICAgICAgICAgIHN0YXR1czogJ3N1Ym1pdHRlZCdcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuU3VibWlzc2lvbicsIHsgZXJyb3I6ICdObyByZXNvdXJjZSBmb3VuZCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxufSk7XG4iXX0=
