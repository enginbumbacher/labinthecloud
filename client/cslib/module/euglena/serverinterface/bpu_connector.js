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
      socketClientServerPort: 4200
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
            var remaining = 30 * 1000 - (timestamp - exp.process_start);
            if (remaining <= 0) {
              exp.status = 'downloading';
              delete exp.process_start;
              _this4.dispatchEvent('BPUController.Experiment.Update', {
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
                _this4.dispatchEvent('BPUController.Experiment.Ready', exp);
              });
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
      key: 'runExperiment',
      value: function runExperiment(lightData) {
        var _this5 = this;

        // lightData.unshift({ topValue: 0, rightValue: 0, bottomValue: 0, leftValue: 0, time: 0 })
        lightData.push({ topValue: 0, rightValue: 0, bottomValue: 0, leftValue: 0, time: 60000 });
        this.socket.emit(access.router.getQueue, access.serverInfo, function (err, queueObj) {
          if (err) {
            _this5.dispatchEvent('BPUController.Error.Queue', { error: err });
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

            _this5.socket.emit(access.router.submitExperiment, _this5.auth, queue, function (err, res) {
              if (err) {
                _this5.dispatchEvent('BPUController.Error.Submission', { error: err });
              } else if (res && res.length) {
                _this5.experiments.push({
                  id: res[0]._id,
                  status: 'submitted'
                });
                // console.log(this.experiments);
              } else {
                  _this5.dispatchEvent('BPUController.Error.Submission', { error: 'No resource found' });
                }
            });
          }
        });
      }
    }]);

    return BPUConnector;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9icHVfY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sa0JBQWtCLFFBQVEsdUJBQVIsQ0FBeEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxJQUFJLFFBQVEsUUFBUixDQUZOO0FBQUEsTUFHRSxXQUFXLFFBQVEsVUFBUixDQUhiO0FBQUEsTUFJRSxVQUFVLFFBQVEsb0JBQVIsQ0FKWjtBQUFBLE1BTUUsU0FBUztBQUNQLFlBQVE7QUFDTixlQUFTLFNBREg7QUFFTixrQkFBWSxZQUZOO0FBR04saUJBQVcsZUFITDtBQUlOLGdCQUFVLHFCQUpKO0FBS04sY0FBUSxRQUxGO0FBTU4sd0JBQWtCO0FBTlosS0FERDtBQVNQLGdCQUFZO0FBQ1Ysa0JBQVksa0NBREY7QUFFVixZQUFNLGNBRkk7QUFHViw0QkFBc0IscUJBSFo7QUFJViw4QkFBd0I7QUFKZCxLQVRMO0FBZVAsVUFBTTtBQUNKLFVBQUksMEJBREE7QUFFSixZQUFNLGNBRkY7QUFHSixjQUFRLENBQUMsU0FBRDtBQUhKLEtBZkM7QUFvQlAsYUFBUztBQUNQLFVBQUksMEJBREc7QUFFUCxpQkFBVyxrQ0FGSjtBQUdQLGdCQUFVLElBSEg7QUFJUCxvQkFBYywwQkFKUDtBQUtQLFdBQUs7QUFMRTtBQXBCRixHQU5YO0FBQUEsTUFrQ0UseUJBQXVCLE9BQU8sVUFBUCxDQUFrQixvQkFBekMsMkNBbENGO0FBQUEsTUFtQ0UscUJBQW1CLE9BQU8sVUFBUCxDQUFrQixvQkFBckMsU0FBNkQsT0FBTyxVQUFQLENBQWtCLHNCQW5DakY7O0FBc0NBO0FBQUE7O0FBQ0UsNEJBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFNLFdBQU4sUUFBd0IsQ0FDdEIscUJBRHNCLEVBRXRCLGtCQUZzQixFQUd0QixpQkFIc0IsRUFJdEIsd0JBSnNC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LEtBQUssS0FBTCxDQUFXLEtBQUssU0FBTCxDQUFlLE9BQU8sSUFBdEIsQ0FBWDtBQUxDLGVBSmlCO0FBVzFCLDRCQUFjO0FBQ1osb0NBQW9CLElBQUksSUFBSixFQURSO0FBRVosc0NBQXNCLE1BRlY7QUFHWix5QkFBUyxLQUhHO0FBSVoscUJBQUssT0FBTyxJQUFQLENBQVksSUFKTCxFO0FBS1oseUJBQVMsT0FBTyxPQUFQLENBQWU7QUFMWixlQVhZO0FBa0IxQixnQ0FBa0I7QUFsQlEsYUFBckIsQ0FBUDs7QUFxQkEsa0JBQU0sSUFBTixDQUFXLElBQVg7O0FBRUEsbUJBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsT0FBTyxNQUFQLENBQWMsZ0JBQS9CLEVBQWlELE9BQUssSUFBdEQsRUFBNEQsS0FBNUQsRUFBbUUsVUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQy9FLGtCQUFJLEdBQUosRUFBUztBQUNQLHVCQUFLLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFELEVBQUUsT0FBTyxHQUFULEVBQXJEO0FBQ0QsZUFGRCxNQUVPLElBQUksT0FBTyxJQUFJLE1BQWYsRUFBdUI7QUFDNUIsdUJBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQjtBQUNwQixzQkFBSSxJQUFJLENBQUosRUFBTyxHQURTO0FBRXBCLDBCQUFRO0FBRlksaUJBQXRCOztBQUtELGVBTk0sTUFNQTtBQUNMLHlCQUFLLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFELEVBQUUsT0FBTyxtQkFBVCxFQUFyRDtBQUNEO0FBQ0YsYUFaRDtBQWFEO0FBQ0YsU0EzQ0Q7QUE0Q0Q7QUFsTEg7O0FBQUE7QUFBQSxJQUFrQyxlQUFsQztBQXFMRCxDQTVORCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9zZXJ2ZXJpbnRlcmZhY2UvYnB1X2Nvbm5lY3Rvci5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
