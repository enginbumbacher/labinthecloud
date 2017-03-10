'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      BPUConnector = require('./bpu_connector'),
      DemoConnector = require('./demo_connector'),
      LoadingScreen = require('./loadingscreen/loadingscreen');

  return function (_Module) {
    _inherits(EuglenaServerModule, _Module);

    function EuglenaServerModule() {
      _classCallCheck(this, EuglenaServerModule);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EuglenaServerModule).call(this));

      Utils.bindMethods(_this, ['_onExperimentRequest', '_onExperimentUpdate', '_onSubmissionError', '_onQueueError', '_onExperimentReady']);

      Globals.set('euglenaServerMode', 'bpu');
      _this.bpu = new BPUConnector();
      _this.bpu.addEventListener('BPUController.Error.Submission', _this._onSubmissionError);
      _this.bpu.addEventListener('BPUController.Error.Queue', _this._onQueueError);
      _this.bpu.addEventListener('BPUController.Experiment.Update', _this._onExperimentUpdate);
      _this.bpu.addEventListener('BPUController.Experiment.Ready', _this._onExperimentReady);

      _this.loadingScreen = new LoadingScreen();

      Globals.get('Relay').addEventListener('ExperimentServer.ExperimentRequest', _this._onExperimentRequest);
      return _this;
    }

    _createClass(EuglenaServerModule, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          _this2.bpu.addEventListener('BPUController.Ready', function (evt) {
            // console.log('Controller ready');
            resolve(true);
          });
          _this2.bpu.addEventListener('BPUController.Error.Connection', function (evt) {
            reject(evt.data.error);
          });
          _this2.bpu.addEventListener('BPUController.Error.ConnectionRefused', function (evt) {
            console.log(evt);
            _this2.demo = new DemoConnector();
            _this2.demo.addEventListener('DemoController.Experiment.Update', _this2._onExperimentUpdate);
            _this2.demo.addEventListener('DemoController.Experiment.Ready', _this2._onExperimentReady);
            _this2.demo.init();
            Globals.set('euglenaServerMode', 'demo');
            console.log('DEMO MODE');
            resolve(true);
          });
          _this2.bpu.init();
        });
      }
    }, {
      key: 'run',
      value: function run() {
        Globals.get('App.view').addChild(this.loadingScreen);
      }
    }, {
      key: '_onSubmissionError',
      value: function _onSubmissionError(evt) {
        console.log('Submission rejected:', evt.data.error);
      }
    }, {
      key: '_onQueueError',
      value: function _onQueueError(evt) {
        console.log('Queue request rejected:', evt.data.error);
      }
    }, {
      key: '_onExperimentUpdate',
      value: function _onExperimentUpdate(evt) {
        // console.log(evt.data);
        this.loadingScreen.update(evt.data);
      }
    }, {
      key: '_onExperimentReady',
      value: function _onExperimentReady(evt) {
        this.loadingScreen.hide();
        // console.log(evt.data);
        var report = evt.data.data.experiment;
        var tracks = evt.data.data.tracks;
        var results = {
          video: evt.data.data.video,
          runTime: (report.exp_runEndTime - report.exp_runStartTime) / 1000,
          numFrames: report.exp_metaData.numFrames,
          fps: report.exp_metaData.numFrames / ((report.exp_runEndTime - report.exp_runStartTime) / 1000),
          lights: [{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }],
          tracks: tracks
        };
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = tracks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var track = _step.value;

            track.startTime = track.startFrame / results.fps;
            track.lastTime = track.lastFrame / results.fps;
            var lastPos = null;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = track.samples[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var sample = _step3.value;

                sample.time = sample.frame / results.fps;
                sample.x = sample.rect[0];
                sample.y = sample.rect[1];
                sample.width = sample.rect[2];
                sample.height = sample.rect[3];
                sample.angle = sample.rect[4];
                if (sample.angle < 0) {
                  sample.angle += 360;
                }

                if (lastPos) {
                  var dTime = sample.time - lastPos.time;
                  var dX = sample.x - lastPos.x;
                  var dY = sample.y - lastPos.y;
                  sample.speedX = dX / dTime;
                  sample.speedY = dY / dTime;
                  sample.speed = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) / dTime;
                  if (sample.speedX < 0) {
                    sample.angle = (sample.angle + 180) % 360;
                  }
                }
                lastPos = {
                  x: sample.x,
                  y: sample.y,
                  time: sample.time
                };
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var lastLight = 0;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = report.exp_eventsRan[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var evtRan = _step2.value;

            var t = (evtRan.setTime - report.exp_runStartTime) / 1000;
            if (t < 0) continue;
            results.lights[results.lights.length - 1].duration = t - lastLight;
            lastLight = t;
            results.lights.push({
              top: evtRan.topValue,
              left: evtRan.leftValue,
              bottom: evtRan.bottomValue,
              right: evtRan.rightValue
            });
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        results.lights[results.lights.length - 1].duration = results.runTime - lastLight;
        Globals.get('Relay').dispatchEvent('ExperimentServer.Results', results);
      }
    }, {
      key: '_onExperimentRequest',
      value: function _onExperimentRequest(evt) {
        this.loadingScreen.reset();
        this.loadingScreen.show();
        var lightData = [];
        var timeAccumulated = 0;
        evt.data.lights.forEach(function (ld) {
          lightData.push({
            topValue: ld.top,
            rightValue: ld.right,
            bottomValue: ld.bottom,
            leftValue: ld.left,
            time: timeAccumulated
          });
          timeAccumulated += ld.duration * 1000;
        });
        console.log(Globals.get('euglenaServerMode'));
        if (Globals.get('euglenaServerMode') == 'demo') {
          this.demo.runExperiment(lightData);
        } else {
          this.bpu.runExperiment(lightData);
        }
      }
    }]);

    return EuglenaServerModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxTQUFTLFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFVBQVUsUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFHRSxlQUFlLFFBQVEsaUJBQVIsQ0FIakI7QUFBQSxNQUlFLGdCQUFnQixRQUFRLGtCQUFSLENBSmxCO0FBQUEsTUFLRSxnQkFBZ0IsUUFBUSwrQkFBUixDQUxsQjs7QUFRQTtBQUFBOztBQUNFLG1DQUFjO0FBQUE7O0FBQUE7O0FBR1osWUFBTSxXQUFOLFFBQXdCLENBQ3RCLHNCQURzQixFQUVwQixxQkFGb0IsRUFHcEIsb0JBSG9CLEVBSXBCLGVBSm9CLEVBS3BCLG9CQUxvQixDQUF4Qjs7QUFRQSxjQUFRLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxLQUFqQztBQUNBLFlBQUssR0FBTCxHQUFXLElBQUksWUFBSixFQUFYO0FBQ0EsWUFBSyxHQUFMLENBQVMsZ0JBQVQsQ0FBMEIsZ0NBQTFCLEVBQTRELE1BQUssa0JBQWpFO0FBQ0EsWUFBSyxHQUFMLENBQVMsZ0JBQVQsQ0FBMEIsMkJBQTFCLEVBQXVELE1BQUssYUFBNUQ7QUFDQSxZQUFLLEdBQUwsQ0FBUyxnQkFBVCxDQUEwQixpQ0FBMUIsRUFBNkQsTUFBSyxtQkFBbEU7QUFDQSxZQUFLLEdBQUwsQ0FBUyxnQkFBVCxDQUEwQixnQ0FBMUIsRUFBNEQsTUFBSyxrQkFBakU7O0FBRUEsWUFBSyxhQUFMLEdBQXFCLElBQUksYUFBSixFQUFyQjs7QUFFQSxjQUFRLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLGdCQUFyQixDQUFzQyxvQ0FBdEMsRUFBNEUsTUFBSyxvQkFBakY7QUFwQlk7QUFxQmI7O0FBdEJIO0FBQUE7QUFBQSw2QkF3QlM7QUFBQTs7QUFD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Q0EsWUFBSSxJQUFKLENBQVMsTUFBVCxDQUFnQixPQUFoQixDQUF3QixVQUFDLEVBQUQsRUFBUTtBQUM5QixvQkFBVSxJQUFWLENBQWU7QUFDYixzQkFBVSxHQUFHLEdBREE7QUFFYix3QkFBWSxHQUFHLEtBRkY7QUFHYix5QkFBYSxHQUFHLE1BSEg7QUFJYix1QkFBVyxHQUFHLElBSkQ7QUFLYixrQkFBTTtBQUxPLFdBQWY7QUFPQSw2QkFBbUIsR0FBRyxRQUFILEdBQWMsSUFBakM7QUFDRCxTQVREO0FBVUEsZ0JBQVEsR0FBUixDQUFZLFFBQVEsR0FBUixDQUFZLG1CQUFaLENBQVo7QUFDQSxZQUFJLFFBQVEsR0FBUixDQUFZLG1CQUFaLEtBQW9DLE1BQXhDLEVBQWdEO0FBQzlDLGVBQUssSUFBTCxDQUFVLGFBQVYsQ0FBd0IsU0FBeEI7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLLEdBQUwsQ0FBUyxhQUFULENBQXVCLFNBQXZCO0FBQ0Q7QUFDRjtBQXRKSDs7QUFBQTtBQUFBLElBQXlDLE1BQXpDO0FBeUpELENBbEtEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
