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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9icHVfY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sa0JBQWtCLFFBQVEsdUJBQVIsQ0FBeEI7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxJQUFJLFFBQVEsUUFBUixDQUZOO0FBQUEsTUFHRSxXQUFXLFFBQVEsVUFBUixDQUhiO0FBQUEsTUFJRSxVQUFVLFFBQVEsb0JBQVIsQ0FKWjtBQUFBLE1BTUUsU0FBUztBQUNQLFlBQVE7QUFDTixlQUFTLFNBREg7QUFFTixrQkFBWSxZQUZOO0FBR04saUJBQVcsZUFITDtBQUlOLGdCQUFVLHFCQUpKO0FBS04sY0FBUSxRQUxGO0FBTU4sd0JBQWtCO0FBTlosS0FERDtBQVNQLGdCQUFZO0FBQ1Ysa0JBQVksa0NBREY7QUFFVixZQUFNLGNBRkk7QUFHViw0QkFBc0IscUJBSFo7QUFJViw4QkFBd0I7QUFKZCxLQVRMO0FBZVAsVUFBTTtBQUNKLFVBQUksMEJBREE7QUFFSixZQUFNLGNBRkY7QUFHSixjQUFRLENBQUMsU0FBRDtBQUhKLEtBZkM7QUFvQlAsYUFBUztBQUNQLFVBQUksMEJBREc7QUFFUCxpQkFBVyxrQ0FGSjtBQUdQLGdCQUFVLElBSEg7QUFJUCxvQkFBYywwQkFKUDtBQUtQLFdBQUs7QUFMRTtBQXBCRixHQU5YO0FBQUEsTUFrQ0UseUJBQXVCLE9BQU8sVUFBUCxDQUFrQixvQkFBekMsMkNBbENGO0FBQUEsTUFtQ0UscUJBQW1CLE9BQU8sVUFBUCxDQUFrQixvQkFBckMsU0FBNkQsT0FBTyxVQUFQLENBQWtCLHNCQW5DakY7O0FBc0NBLE1BQU0saUJBQWlCLEdBQXZCOztBQUVBO0FBQUE7O0FBQ0UsNEJBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFNLFdBQU4sUUFBd0IsQ0FDdEIscUJBRHNCLEVBRXRCLGtCQUZzQixFQUd0QixpQkFIc0IsRUFJdEIsd0JBSnNCLEVBS3RCLHVCQUxzQixDQUF4QjtBQU9BLFlBQUssV0FBTCxHQUFtQixFQUFuQjtBQUNBLFlBQUssU0FBTCxHQUFpQixFQUFqQjtBQVZZO0FBV2I7O0FBWkg7QUFBQTtBQUFBLDZCQWNTO0FBQUE7O0FBQ0wsYUFBSyxNQUFMLEdBQWMsU0FBUyxPQUFULENBQWlCLE1BQWpCLEVBQXlCO0FBQ3JDLHFCQUFXLEtBRDBCO0FBRXJDLHFCQUFXO0FBRjBCLFNBQXpCLENBQWQ7QUFJQSxhQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsZUFBZixFQUFnQyxVQUFDLEtBQUQsRUFBVztBQUN6QyxpQkFBSyxNQUFMLENBQVksS0FBWjtBQUNBLGlCQUFLLGFBQUwsQ0FBbUIsdUNBQW5CLEVBQTRELEVBQUMsT0FBTyxLQUFSLEVBQTVEO0FBQ0QsU0FIRDtBQUlBLGFBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxPQUFPLE1BQVAsQ0FBYyxVQUE3QixFQUF5QyxLQUFLLG1CQUE5QztBQUNBLGFBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxPQUFPLE1BQVAsQ0FBYyxPQUE3QixFQUFzQyxLQUFLLGdCQUEzQztBQUNBLGFBQUssTUFBTCxDQUFZLEVBQVosQ0FBZSxPQUFPLE1BQVAsQ0FBYyxNQUE3QixFQUFxQyxLQUFLLGVBQTFDO0FBQ0EsZUFBTyxxQkFBUCxDQUE2QixLQUFLLHFCQUFsQztBQUNEO0FBM0JIO0FBQUE7QUFBQSwwQ0E2QnNCLE1BN0J0QixFQTZCOEI7O0FBRTFCLGFBQUssYUFBTCxDQUFtQixnQ0FBbkIsRUFBcUQsRUFBRSxPQUFPLHlDQUFULEVBQXJEO0FBQ0Q7QUFoQ0g7QUFBQTtBQUFBLHVDQWtDbUIsT0FsQ25CLEVBa0M0QixNQWxDNUIsRUFrQ29DOztBQUVoQyxhQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLE9BQU8sTUFBUCxDQUFjLFNBQS9CLEVBQTBDLE9BQU8sVUFBakQsRUFBNkQsS0FBSyxzQkFBbEU7QUFDRDtBQXJDSDtBQUFBO0FBQUEsNkNBdUN5QixHQXZDekIsRUF1QzhCLElBdkM5QixFQXVDb0M7QUFDaEMsWUFBSSxHQUFKLEVBQVM7QUFDUCxlQUFLLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFELEVBQUUsT0FBTyx5Q0FBVCxFQUFyRDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxpQkFBTyxPQUFQLENBQWUsUUFBZixHQUEwQixLQUFLLE1BQUwsQ0FBWSxFQUF0QztBQUNBLGVBQUssYUFBTCxDQUFtQixxQkFBbkI7QUFDRDtBQUNGO0FBL0NIO0FBQUE7QUFBQSxzQ0FpRGtCLE9BakRsQixFQWlEMkIsY0FqRDNCLEVBaUQyQyxLQWpEM0MsRUFpRGtEO0FBQUE7O0FBQzlDLFlBQU0sT0FBTyxRQUFRLE1BQVIsQ0FBZSxVQUFDLEdBQUQsRUFBUztBQUNuQyxpQkFBTyxJQUFJLElBQUosSUFBWSxJQUFJLFNBQUosSUFBaUIsU0FBN0IsSUFBMEMsSUFBSSxpQkFBSixDQUFzQixRQUF0QixJQUFrQyxPQUFPLElBQVAsQ0FBWSxJQUF4RixJQUFnRyxPQUFLLFdBQUwsQ0FBaUIsR0FBakIsQ0FBcUIsVUFBQyxHQUFEO0FBQUEsbUJBQVMsSUFBSSxFQUFiO0FBQUEsV0FBckIsRUFBc0MsUUFBdEMsQ0FBK0MsSUFBSSxpQkFBSixDQUFzQixFQUFyRSxDQUF2RztBQUNELFNBRlksQ0FBYjs7QUFJQSxZQUFJLFVBQVUsRUFBZDtBQUNBLGFBQUssSUFBSSxHQUFULElBQWdCLGNBQWhCLEVBQWdDO0FBQzlCLGNBQUksSUFBSSxNQUFKLENBQVcsQ0FBWCxFQUFhLENBQWIsS0FBbUIsS0FBbkIsSUFBNEIsZUFBZSxHQUFmLEVBQW9CLE1BQXBELEVBQTREO0FBQzFELHNCQUFVLFFBQVEsTUFBUixDQUFlLGVBQWUsR0FBZixFQUFvQixNQUFwQixDQUEyQixVQUFDLElBQUQsRUFBVTtBQUM1RCxxQkFBTyxPQUFLLFdBQUwsQ0FBaUIsR0FBakIsQ0FBcUIsVUFBQyxHQUFEO0FBQUEsdUJBQVMsSUFBSSxFQUFiO0FBQUEsZUFBckIsRUFBc0MsUUFBdEMsQ0FBK0MsS0FBSyxFQUFwRCxDQUFQO0FBQ0QsYUFGd0IsQ0FBZixDQUFWO0FBR0Q7QUFDRjtBQUNELFlBQUksUUFBUSxNQUFaLEVBQW9CO0FBQ2xCLGtCQUFRLE9BQVIsQ0FBZ0IsVUFBQyxJQUFELEVBQVU7QUFDeEIsbUJBQUssV0FBTCxDQUFpQixNQUFqQixDQUF3QixVQUFDLEdBQUQ7QUFBQSxxQkFBUyxJQUFJLEVBQUosSUFBVSxLQUFLLEVBQXhCO0FBQUEsYUFBeEIsRUFBb0QsT0FBcEQsQ0FBNEQsVUFBQyxHQUFELEVBQVM7QUFDbkUsa0JBQUksTUFBSixHQUFhLE9BQWI7QUFDRCxhQUZEO0FBR0EsbUJBQUssYUFBTCxDQUFtQixpQ0FBbkIsRUFBc0Q7QUFDcEQsNkJBQWUsS0FBSyxFQURnQztBQUVwRCxrQ0FBb0IsS0FBSyxjQUFMLENBQW9CLGFBRlk7QUFHcEQsc0JBQVE7QUFINEMsYUFBdEQ7QUFLRCxXQVREO0FBVUQ7QUFDRCxZQUFNLGFBQWEsRUFBbkI7QUFDQSxZQUFJLFFBQVEsS0FBSyxNQUFqQixFQUF5QjtBQUN2QixlQUFLLE9BQUwsQ0FBYSxVQUFDLEdBQUQsRUFBUztBQUNwQixtQkFBSyxXQUFMLENBQWlCLE1BQWpCLENBQXdCLFVBQUMsR0FBRDtBQUFBLHFCQUFTLElBQUksRUFBSixJQUFVLElBQUksaUJBQUosQ0FBc0IsRUFBekM7QUFBQSxhQUF4QixFQUFxRSxPQUFyRSxDQUE2RSxVQUFDLEdBQUQsRUFBUztBQUNwRixrQkFBSSxNQUFKLEdBQWEsU0FBYjtBQUNELGFBRkQ7QUFHQSx1QkFBVyxJQUFYLENBQWdCLElBQUksaUJBQUosQ0FBc0IsRUFBdEM7QUFDQSxtQkFBSyxhQUFMLENBQW1CLGlDQUFuQixFQUFzRDtBQUNwRCw2QkFBZSxJQUFJLGlCQUFKLENBQXNCLEVBRGU7QUFFcEQsa0NBQW9CLElBQUksaUJBQUosQ0FBc0IsV0FGVTtBQUdwRCxzQkFBUTtBQUg0QyxhQUF0RDtBQUtELFdBVkQ7QUFXRDtBQUNELGFBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixVQUFDLEdBQUQsRUFBUztBQUNoQyxjQUFJLElBQUksTUFBSixJQUFjLFNBQWQsSUFBMkIsQ0FBQyxXQUFXLFFBQVgsQ0FBb0IsSUFBSSxFQUF4QixDQUFoQyxFQUE2RDtBQUMzRCxnQkFBSSxNQUFKLEdBQWEsWUFBYjtBQUNBLGdCQUFJLGFBQUosR0FBb0IsWUFBWSxHQUFaLEVBQXBCO0FBQ0Q7QUFDRixTQUxEO0FBTUQ7QUE5Rkg7QUFBQTtBQUFBLDRDQWdHd0IsU0FoR3hCLEVBZ0dtQztBQUFBOztBQUMvQixhQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBQyxHQUFELEVBQVM7QUFDaEMsY0FBSSxJQUFJLE1BQUosSUFBYyxZQUFsQixFQUFnQztBQUM5QixnQkFBTSxZQUFZLGlCQUFpQixJQUFqQixJQUF5QixZQUFZLElBQUksYUFBekMsQ0FBbEI7QUFDQSxnQkFBSSxhQUFhLENBQWpCLEVBQW9CO0FBQ2xCLGtCQUFJLE1BQUosR0FBYSxhQUFiO0FBQ0EscUJBQU8sSUFBSSxhQUFYO0FBQ0EscUJBQUssYUFBTCxDQUFtQixpQ0FBbkIsRUFBc0Q7QUFDcEQsK0JBQWUsSUFBSSxFQURpQztBQUVwRCx3QkFBUSxJQUFJLE1BRndDO0FBR3BELG9DQUFvQjtBQUhnQyxlQUF0RDtBQUtBLHNCQUFRLEdBQVIsQ0FBWSxDQUNWLE1BQU0sV0FBTixNQUFxQixVQUFyQixHQUFrQyxJQUFJLEVBQXRDLFNBQTRDLElBQUksRUFBaEQsV0FEVSxFQUVWLE1BQU0sV0FBTixNQUFxQixVQUFyQixHQUFrQyxJQUFJLEVBQXRDLGtCQUZVLENBQVosRUFHRyxJQUhILENBR1EsVUFBQyxTQUFELEVBQWU7QUFDckIsb0JBQUksSUFBSixHQUFXO0FBQ1QsOEJBQVksVUFBVSxDQUFWLENBREg7QUFFVCw4QkFBVSxVQUFWLEdBQXVCLElBQUksRUFBM0IsZUFGUztBQUdULDBCQUFRLFVBQVUsQ0FBVjtBQUhDLGlCQUFYO0FBS0Esb0JBQUksTUFBSixHQUFhLE9BQWI7QUFDQSx1QkFBSyxhQUFMLENBQW1CLGdDQUFuQixFQUFxRCxHQUFyRDtBQUNELGVBWEQ7QUFZRCxhQXBCRCxNQW9CTztBQUNMLHFCQUFLLGFBQUwsQ0FBbUIsaUNBQW5CLEVBQXNEO0FBQ3BELCtCQUFlLElBQUksRUFEaUM7QUFFcEQsb0NBQW9CLFNBRmdDO0FBR3BELHdCQUFRLElBQUk7QUFId0MsZUFBdEQ7QUFLRDtBQUNGO0FBQ0YsU0EvQkQ7QUFnQ0EsZUFBTyxxQkFBUCxDQUE2QixLQUFLLHFCQUFsQztBQUNEO0FBbElIO0FBQUE7QUFBQSxvQ0FvSWdCLFNBcEloQixFQW9JMkI7QUFBQTs7O0FBRXZCLGtCQUFVLElBQVYsQ0FBZSxFQUFFLFVBQVUsQ0FBWixFQUFlLFlBQVksQ0FBM0IsRUFBOEIsYUFBYSxDQUEzQyxFQUE4QyxXQUFXLENBQXpELEVBQTRELE1BQU0sS0FBbEUsRUFBZjtBQUNBLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsT0FBTyxNQUFQLENBQWMsUUFBL0IsRUFBeUMsT0FBTyxVQUFoRCxFQUE0RCxVQUFDLEdBQUQsRUFBTSxRQUFOLEVBQW1CO0FBQzdFLGNBQUksR0FBSixFQUFTO0FBQ1AsbUJBQUssYUFBTCxDQUFtQiwyQkFBbkIsRUFBZ0QsRUFBRSxPQUFPLEdBQVQsRUFBaEQ7QUFDRCxXQUZELE1BRU87QUFDTCxnQkFBTSxRQUFRLEVBQWQ7QUFDQSxnQkFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQUssU0FBTCxDQUFlLFFBQWYsQ0FBWCxDQUFYLEM7QUFDQSxtQkFBTyxFQUFFLE1BQUYsQ0FBUyxJQUFULEVBQWUsSUFBZixFQUFxQjtBQUMxQiwrQkFBaUIsU0FEUztBQUUxQixvQ0FBc0IsTUFGSTtBQUcxQixvQkFBTSxLQUFLLEtBQUwsQ0FBVyxLQUFLLFNBQUwsQ0FBZSxPQUFPLElBQXRCLENBQVgsQ0FIb0I7QUFJMUIsdUJBQVM7QUFDUCxvQkFBSSxPQUFPLE9BQVAsQ0FBZSxFQURaO0FBRVAsMkJBQVcsT0FBTyxPQUFQLENBQWUsU0FGbkI7QUFHUCw4QkFBYyxPQUFPLE9BQVAsQ0FBZSxZQUh0QjtBQUlQLDBCQUFVLE9BQU8sT0FBUCxDQUFlLFFBSmxCO0FBS1Asc0JBQU0sS0FBSyxLQUFMLENBQVcsS0FBSyxTQUFMLENBQWUsT0FBTyxJQUF0QixDQUFYO0FBTEMsZUFKaUI7QUFXMUIsNEJBQWM7QUFDWixvQ0FBb0IsSUFBSSxJQUFKLEVBRFI7QUFFWixzQ0FBc0IsTUFGVjtBQUdaLHlCQUFTLEtBSEc7QUFJWixxQkFBSyxPQUFPLElBQVAsQ0FBWSxJQUpMLEU7QUFLWix5QkFBUyxPQUFPLE9BQVAsQ0FBZTtBQUxaLGVBWFk7QUFrQjFCLGdDQUFrQjtBQWxCUSxhQUFyQixDQUFQOztBQXFCQSxrQkFBTSxJQUFOLENBQVcsSUFBWDs7QUFFQSxtQkFBSyxNQUFMLENBQVksSUFBWixDQUFpQixPQUFPLE1BQVAsQ0FBYyxnQkFBL0IsRUFBaUQsT0FBSyxJQUF0RCxFQUE0RCxLQUE1RCxFQUFtRSxVQUFDLEdBQUQsRUFBTSxHQUFOLEVBQWM7QUFDL0Usa0JBQUksR0FBSixFQUFTO0FBQ1AsdUJBQUssYUFBTCxDQUFtQixnQ0FBbkIsRUFBcUQsRUFBRSxPQUFPLEdBQVQsRUFBckQ7QUFDRCxlQUZELE1BRU8sSUFBSSxPQUFPLElBQUksTUFBZixFQUF1QjtBQUM1Qix1QkFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCO0FBQ3BCLHNCQUFJLElBQUksQ0FBSixFQUFPLEdBRFM7QUFFcEIsMEJBQVE7QUFGWSxpQkFBdEI7O0FBS0QsZUFOTSxNQU1BO0FBQ0wseUJBQUssYUFBTCxDQUFtQixnQ0FBbkIsRUFBcUQsRUFBRSxPQUFPLG1CQUFULEVBQXJEO0FBQ0Q7QUFDRixhQVpEO0FBYUQ7QUFDRixTQTNDRDtBQTRDRDtBQW5MSDs7QUFBQTtBQUFBLElBQWtDLGVBQWxDO0FBc0xELENBL05EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9icHVfY29ubmVjdG9yLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
