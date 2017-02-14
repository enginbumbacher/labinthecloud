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
      fileServer = 'http://' + access.serverInfo.socketClientServerIP + '/account/joinlabwithdata/downloadFile/',
      domain = 'http://' + access.serverInfo.socketClientServerIP + ':' + access.serverInfo.socketClientServerPort;

  return function (_EventDispatcher) {
    _inherits(BPUConnector, _EventDispatcher);

    function BPUConnector() {
      _classCallCheck(this, BPUConnector);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BPUConnector).call(this));

      Utils.bindMethods(_this, ['_onSocketDisconnect', '_onSocketConnect', '_onSocketUpdate', '_onSocketAuthorization', '_updateProcessingTime']);
      _this.experiments = [];
      _this.downloads = [];
      return _this;
    }

    _createClass(BPUConnector, [{
      key: 'init',
      value: function init() {
        this.socket = socketio.connect(domain, {
          multiplex: false,
          reconnect: true
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
        var _this2 = this;

        var exps = bpuList.filter(function (bpu) {
          return bpu.isOn && bpu.bpuStatus == "running" && bpu.liveBpuExperiment.username == access.user.name && _this2.experiments.map(function (exp) {
            return exp.id;
          }).includes(bpu.liveBpuExperiment.id);
        });
        var waiting = [];
        for (var key in experimentList) {
          if (key.substr(0, 3) == "eug" && experimentList[key].length) {
            waiting = waiting.concat(experimentList[key].filter(function (wait) {
              return _this2.experiments.map(function (exp) {
                return exp.id;
              }).includes(wait.id);
            }));
          }
        }
        if (waiting.length) {
          waiting.forEach(function (wait) {
            _this2.experiments.filter(function (exp) {
              return exp.id == wait.id;
            }).forEach(function (exp) {
              exp.status = 'queue';
            });
            _this2.dispatchEvent('BPUController.Experiment.Update', {
              experiment_id: wait.id,
              remaining_estimate: wait.exp_lastResort.totalWaitTime,
              status: 'queue'
            });
          });
        }
        var nowRunning = [];
        if (exps && exps.length) {
          exps.forEach(function (bpu) {
            _this2.experiments.filter(function (exp) {
              return exp.id == bpu.liveBpuExperiment.id;
            }).forEach(function (exp) {
              exp.status = 'running';
            });
            nowRunning.push(bpu.liveBpuExperiment.id);
            _this2.dispatchEvent('BPUController.Experiment.Update', {
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
        var _this3 = this;

        this.experiments.forEach(function (exp) {
          if (exp.status == 'processing') {
            var remaining = 30 * 1000 - (timestamp - exp.process_start);
            if (remaining <= 0) {
              exp.status = 'downloading';
              delete exp.process_start;
              _this3.dispatchEvent('BPUController.Experiment.Update', {
                experiment_id: exp.id,
                status: exp.status,
                remaining_estimate: 0
              });
              Promise.all([Utils.promiseAjax('' + fileServer + exp.id + '/' + exp.id + '.json'), Utils.promiseAjax('' + fileServer + exp.id + '/tracks.json')]).then(function (downloads) {
                exp.data = {
                  experiment: downloads[0],
                  video: '' + fileServer + exp.id + '/movie.mp4',
                  tracks: downloads[1]
                };
                exp.status = 'ready';
                _this3.dispatchEvent('BPUController.Experiment.Ready', exp);
              });
            } else {
              _this3.dispatchEvent('BPUController.Experiment.Update', {
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
      key: 'runExperiment',
      value: function runExperiment(lightData) {
        var _this4 = this;

        // lightData.unshift({ topValue: 0, rightValue: 0, bottomValue: 0, leftValue: 0, time: 0 })
        lightData.push({ topValue: 0, rightValue: 0, bottomValue: 0, leftValue: 0, time: 60000 });
        this.socket.emit(access.router.getQueue, access.serverInfo, function (err, queueObj) {
          if (err) {
            _this4.dispatchEvent('BPUController.Error.Queue', { error: err });
          } else {
            var queue = [];
            var data = JSON.parse(JSON.stringify(queueObj)); //clones the queueObj
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
              exp_wantsBpuName: null
            });

            queue.push(data);

            _this4.socket.emit(access.router.submitExperiment, _this4.auth, queue, function (err, res) {
              if (err) {
                _this4.dispatchEvent('BPUController.Error.Submission', { error: err });
              } else if (res && res.length) {
                _this4.experiments.push({
                  id: res[0]._id,
                  status: 'submitted'
                });
              } else {
                _this4.dispatchEvent('BPUController.Error.Submission', { error: 'No resource found' });
              }
            });
          }
        });
      }
    }]);

    return BPUConnector;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9icHVfY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sa0JBQWtCLFFBQVEsdUJBQVIsQ0FBeEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxJQUFJLFFBQVEsUUFBUixDQUZOO0FBQUEsTUFHRSxXQUFXLFFBQVEsVUFBUixDQUhiO0FBQUEsTUFJRSxVQUFVLFFBQVEsb0JBQVIsQ0FKWjtBQUFBLE1BTUUsU0FBUztBQUNQLFlBQVE7QUFDTixlQUFTLFNBREg7QUFFTixrQkFBWSxZQUZOO0FBR04saUJBQVcsZUFITDtBQUlOLGdCQUFVLHFCQUpKO0FBS04sY0FBUSxRQUxGO0FBTU4sd0JBQWtCO0FBTlosS0FERDtBQVNQLGdCQUFZO0FBQ1Ysa0JBQVksa0NBREY7QUFFVixZQUFNLGNBRkk7QUFHViw0QkFBc0IscUJBSFo7QUFJViw4QkFBd0I7QUFKZCxLQVRMO0FBZVAsVUFBTTtBQUNKLFVBQUksMEJBREE7QUFFSixZQUFNLGNBRkY7QUFHSixjQUFRLENBQUMsU0FBRDtBQUhKLEtBZkM7QUFvQlAsYUFBUztBQUNQLFVBQUksMEJBREc7QUFFUCxpQkFBVyxrQ0FGSjtBQUdQLGdCQUFVLElBSEg7QUFJUCxvQkFBYywwQkFKUDtBQUtQLFdBQUs7QUFMRTtBQXBCRixHQU5YO0FBQUEsTUFrQ0UseUJBQXVCLE9BQU8sVUFBUCxDQUFrQixvQkFBekMsMkNBbENGO0FBQUEsTUFtQ0UscUJBQW1CLE9BQU8sVUFBUCxDQUFrQixvQkFBckMsU0FBNkQsT0FBTyxVQUFQLENBQWtCLHNCQW5DakY7O0FBc0NBO0FBQUE7O0FBQ0UsNEJBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFNLFdBQU4sUUFBd0IsQ0FDdEIscUJBRHNCLEVBRXRCLGtCQUZzQixFQUd0QixpQkFIc0IsRUFJdEIsd0JBSnNC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LElBSkwsRTtBQUtaLHlCQUFTLE9BQU8sT0FBUCxDQUFlO0FBTFosZUFYWTtBQWtCMUIsZ0NBQWtCO0FBbEJRLGFBQXJCLENBQVA7O0FBcUJBLGtCQUFNLElBQU4sQ0FBVyxJQUFYOztBQUVBLG1CQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLE9BQU8sTUFBUCxDQUFjLGdCQUEvQixFQUFpRCxPQUFLLElBQXRELEVBQTRELEtBQTVELEVBQW1FLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUMvRSxrQkFBSSxHQUFKLEVBQVM7QUFDUCx1QkFBSyxhQUFMLENBQW1CLGdDQUFuQixFQUFxRCxFQUFFLE9BQU8sR0FBVCxFQUFyRDtBQUNELGVBRkQsTUFFTyxJQUFJLE9BQU8sSUFBSSxNQUFmLEVBQXVCO0FBQzVCLHVCQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0I7QUFDcEIsc0JBQUksSUFBSSxDQUFKLEVBQU8sR0FEUztBQUVwQiwwQkFBUTtBQUZZLGlCQUF0QjtBQUlELGVBTE0sTUFLQTtBQUNMLHVCQUFLLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFELEVBQUUsT0FBTyxtQkFBVCxFQUFyRDtBQUNEO0FBQ0YsYUFYRDtBQVlEO0FBQ0YsU0ExQ0Q7QUEyQ0Q7QUE3S0g7O0FBQUE7QUFBQSxJQUFrQyxlQUFsQztBQWdMRCxDQXZORCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9zZXJ2ZXJpbnRlcmZhY2UvYnB1X2Nvbm5lY3Rvci5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
