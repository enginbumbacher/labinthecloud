'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals');

  var EuglenaUtils = function () {
    function EuglenaUtils() {
      _classCallCheck(this, EuglenaUtils);
    }

    _createClass(EuglenaUtils, [{
      key: 'getLightState',
      value: function getLightState(lights, time) {
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var blockTime = 0;
        var light = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
        if (time <= lights.reduce(function (acc, val) {
          return acc + val.duration;
        }, 0)) {
          var _loop = function _loop(block) {
            ['top', 'right', 'bottom', 'left'].forEach(function (key) {
              light[key] = block[key];
            });
            if (time == 0 || time > blockTime && time <= blockTime + block.duration) {
              return 'break';
            }
            blockTime += block.duration;
          };

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = lights[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var block = _step.value;

              var _ret = _loop(block);

              if (_ret === 'break') break;
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
        }
        if (opts.angle) {
          light.angle = Math.atan2(light.bottom - light.top, light.left - light.right);
        }
        if (opts.intensity) {
          light.intensity = Math.sqrt(Math.pow(light.bottom - light.top, 2) + Math.pow(light.left - light.right, 2));
        }
        return light;
      }
    }, {
      key: 'normalizeResults',
      value: function normalizeResults(res) {
        var timePromise = void 0;
        if (res.runTime) {
          timePromise = Promise.resolve(res);
        } else {
          timePromise = Utils.promiseAjax('/api/v1/Experiments/' + res.experimentId).then(function (exp) {
            var time = exp.configuration.reduce(function (acc, val) {
              return acc + val.duration;
            }, 0);
            res.runTime = time;
            return res;
          });
        }
        return timePromise.then(function (result) {
          result.tracks.forEach(function (track) {
            track.samples.forEach(function (sample, ind) {
              if (ind == 0) {
                sample.speed = 0;
                sample.speedX = 0;
                sample.speedY = 0;
                sample.angleXY = Math.random() * 2 * Math.PI;
              } else {
                sample.speed = Math.sqrt(Math.pow(sample.x - track.samples[ind - 1].x, 2) + Math.pow(sample.y - track.samples[ind - 1].y, 2)) / (sample.time - track.samples[ind - 1].time);
                sample.speedX = (sample.x - track.samples[ind - 1].x) / (sample.time - track.samples[ind - 1].time);
                sample.speedY = (sample.y - track.samples[ind - 1].y) / (sample.time - track.samples[ind - 1].time);
                sample.angleXY = Math.atan2(sample.y - track.samples[ind - 1].y, sample.x - track.samples[ind - 1].x);
              }
            });
          });
          result.fps = result.numFrames / result.runTime;
          return result;
        });
      }
    }, {
      key: 'getLiveResults',
      value: function getLiveResults(expId) {
        var _this = this;

        return Utils.promiseAjax('/api/v1/Results', {
          data: {
            filter: {
              where: {
                and: [{ experimentId: expId }, {
                  bpu_api_id: {
                    neq: null
                  }
                }]
              }
            }
          },
          contentType: 'application/json'
        }).then(function (results) {
          return _this.normalizeResults(results[0]);
        });
      }
    }, {
      key: 'getModelResults',
      value: function getModelResults(expId, model) {
        var _this2 = this;

        return Utils.promiseAjax('/api/v1/Results', {
          data: {
            filter: {
              where: {
                and: [{ experimentId: expId }, { euglenaModelId: model.id }]
              }
            }
          },
          contentType: 'application/json'
        }).then(function (results) {
          if (results.length) {
            return results[0];
          } else {
            return _this2.generateResults({
              experimentId: expId,
              euglenaModelId: model.id,
              count: model.configuration.count,
              magnification: Globals.get('currentExperimentResults.magnification')
            }).then(function () {
              return _this2.getModelResults(expId, model);
            });
          }
        }).then(function (result) {
          return _this2.normalizeResults(result);
        });
      }
    }, {
      key: 'generateResults',
      value: function generateResults(conf) {
        if (!conf.bpu_api_id) {
          conf.fps = Globals.get('AppConfig.model.simulationFps');
          conf.initialization = this.initializeModelEuglena(conf.count, conf.magnification);
          delete conf.count;
          delete conf.magnification;
        }
        return Utils.promiseAjax('/api/v1/Results', {
          method: 'POST',
          data: JSON.stringify(conf),
          contentType: 'application/json'
        });
      }
    }, {
      key: 'initializeModelEuglena',
      value: function initializeModelEuglena(count, magnification) {
        var initialize = [];
        for (var i = 0; i < count; i++) {
          initialize.push({
            x: (Math.random() * 2 - 1) * 640 / (2 * magnification),
            y: (Math.random() * 2 - 1) * 480 / (2 * magnification),
            z: 0,
            yaw: Math.random() * Utils.TAU,
            roll: Math.random() * Utils.TAU,
            pitch: 0
          });
        }
        return initialize;
      }
    }, {
      key: 'experimentMatch',
      value: function experimentMatch(a, b) {
        if (a.configuration.length != b.configuration.length) return false;
        for (var ind = 0; ind < a.configuration.length; ind++) {
          var lightConf = a.configuration[ind];
          for (var key in lightConf) {
            if (lightConf[key] !== b.configuration[ind][key]) return false;
          }
        }
        return true;
      }
    }]);

    return EuglenaUtils;
  }();

  return new EuglenaUtils();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJFdWdsZW5hVXRpbHMiLCJsaWdodHMiLCJ0aW1lIiwib3B0cyIsImJsb2NrVGltZSIsImxpZ2h0IiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJibG9jayIsImZvckVhY2giLCJrZXkiLCJhbmdsZSIsIk1hdGgiLCJhdGFuMiIsImludGVuc2l0eSIsInNxcnQiLCJwb3ciLCJyZXMiLCJ0aW1lUHJvbWlzZSIsInJ1blRpbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInByb21pc2VBamF4IiwiZXhwZXJpbWVudElkIiwidGhlbiIsImV4cCIsImNvbmZpZ3VyYXRpb24iLCJyZXN1bHQiLCJ0cmFja3MiLCJ0cmFjayIsInNhbXBsZXMiLCJzYW1wbGUiLCJpbmQiLCJzcGVlZCIsInNwZWVkWCIsInNwZWVkWSIsImFuZ2xlWFkiLCJyYW5kb20iLCJQSSIsIngiLCJ5IiwiZnBzIiwibnVtRnJhbWVzIiwiZXhwSWQiLCJkYXRhIiwiZmlsdGVyIiwid2hlcmUiLCJhbmQiLCJicHVfYXBpX2lkIiwibmVxIiwiY29udGVudFR5cGUiLCJyZXN1bHRzIiwibm9ybWFsaXplUmVzdWx0cyIsIm1vZGVsIiwiZXVnbGVuYU1vZGVsSWQiLCJpZCIsImxlbmd0aCIsImdlbmVyYXRlUmVzdWx0cyIsImNvdW50IiwibWFnbmlmaWNhdGlvbiIsImdldCIsImdldE1vZGVsUmVzdWx0cyIsImNvbmYiLCJpbml0aWFsaXphdGlvbiIsImluaXRpYWxpemVNb2RlbEV1Z2xlbmEiLCJtZXRob2QiLCJKU09OIiwic3RyaW5naWZ5IiwiaW5pdGlhbGl6ZSIsImkiLCJwdXNoIiwieiIsInlhdyIsIlRBVSIsInJvbGwiLCJwaXRjaCIsImEiLCJiIiwibGlnaHRDb25mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7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
