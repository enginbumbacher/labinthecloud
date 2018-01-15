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

        var noteId = Utils.guid4();
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: noteId,
          expireLabel: null,
          message: "Loading live results"
        });
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
        }).then(function (normalized) {
          Globals.get('Relay').dispatchEvent('Notifications.Remove', {
            noteId: noteId
          });
          return normalized;
        });
      }
    }, {
      key: 'getModelResults',
      value: function getModelResults(expId, model) {
        var _this2 = this;

        var reload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        console.log('I am here');
        console.log(expId);
        console.log(model);
        var noteId = void 0;
        if (!reload) {
          noteId = Utils.guid4();
          Globals.get('Relay').dispatchEvent('Notifications.Add', {
            id: noteId,
            expireLabel: null,
            message: "Loading model results"
          });
        }
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
          console.log('now I am here');
          console.log(results);
          if (results.length) {
            return results[0];
          } else {
            return _this2.generateResults({
              experimentId: expId,
              euglenaModelId: model.id,
              count: model.configuration.count,
              magnification: Globals.get('currentExperimentResults.magnification')
            }).then(function () {
              return _this2.getModelResults(expId, model, true);
            });
          }
        }).then(function (result) {
          console.log('now I am normalizing');
          return _this2.normalizeResults(result);
        }).then(function (normalized) {
          if (noteId) {
            Globals.get('Relay').dispatchEvent('Notifications.Remove', {
              noteId: noteId
            });
          }
          return normalized;
        });
      }
    }, {
      key: 'generateResults',
      value: function generateResults(conf) {
        console.log('now in generateResults');
        console.log(conf);
        if (!conf.bpu_api_id) {
          conf.fps = Globals.get('AppConfig.model.simulationFps');
          conf.initialization = this.initializeModelEuglena(conf.count, conf.magnification);
          delete conf.count;
          delete conf.magnification;
        }
        console.log('now done initializing');
        console.log(conf);
        return Utils.promiseAjax('/api/v1/Results', {
          method: 'POST',
          data: JSON.stringify(conf),
          contentType: 'application/json'
        });
      }
    }, {
      key: 'initializeModelEuglena',
      value: function initializeModelEuglena(count, magnification) {
        console.log('now in initialization');
        var initialize = [];
        for (var i = 0; i < count; i++) {
          initialize.push({
            x: (Math.random() * 2 - 1) * 640 / (2 * magnification),
            y: (Math.random() * 2 - 1) * 480 / (2 * magnification),
            z: 0,
            yaw: Math.random() * Utils.TAU,
            roll: Math.random() * Utils.TAU,
            pitch: Math.random() * Utils.TAU
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJFdWdsZW5hVXRpbHMiLCJsaWdodHMiLCJ0aW1lIiwib3B0cyIsImJsb2NrVGltZSIsImxpZ2h0IiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJibG9jayIsImZvckVhY2giLCJrZXkiLCJhbmdsZSIsIk1hdGgiLCJhdGFuMiIsImludGVuc2l0eSIsInNxcnQiLCJwb3ciLCJyZXMiLCJ0aW1lUHJvbWlzZSIsInJ1blRpbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInByb21pc2VBamF4IiwiZXhwZXJpbWVudElkIiwidGhlbiIsImV4cCIsImNvbmZpZ3VyYXRpb24iLCJyZXN1bHQiLCJ0cmFja3MiLCJ0cmFjayIsInNhbXBsZXMiLCJzYW1wbGUiLCJpbmQiLCJzcGVlZCIsInNwZWVkWCIsInNwZWVkWSIsImFuZ2xlWFkiLCJyYW5kb20iLCJQSSIsIngiLCJ5IiwiZnBzIiwibnVtRnJhbWVzIiwiZXhwSWQiLCJub3RlSWQiLCJndWlkNCIsImdldCIsImRpc3BhdGNoRXZlbnQiLCJpZCIsImV4cGlyZUxhYmVsIiwibWVzc2FnZSIsImRhdGEiLCJmaWx0ZXIiLCJ3aGVyZSIsImFuZCIsImJwdV9hcGlfaWQiLCJuZXEiLCJjb250ZW50VHlwZSIsInJlc3VsdHMiLCJub3JtYWxpemVSZXN1bHRzIiwibm9ybWFsaXplZCIsIm1vZGVsIiwicmVsb2FkIiwiY29uc29sZSIsImxvZyIsImV1Z2xlbmFNb2RlbElkIiwibGVuZ3RoIiwiZ2VuZXJhdGVSZXN1bHRzIiwiY291bnQiLCJtYWduaWZpY2F0aW9uIiwiZ2V0TW9kZWxSZXN1bHRzIiwiY29uZiIsImluaXRpYWxpemF0aW9uIiwiaW5pdGlhbGl6ZU1vZGVsRXVnbGVuYSIsIm1ldGhvZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJpbml0aWFsaXplIiwiaSIsInB1c2giLCJ6IiwieWF3IiwiVEFVIiwicm9sbCIsInBpdGNoIiwiYSIsImIiLCJsaWdodENvbmYiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7O0FBRGtCLE1BSVpHLFlBSlk7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG9DQUtGQyxNQUxFLEVBS01DLElBTE4sRUFLdUI7QUFBQSxZQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQ3JDLFlBQUlDLFlBQVksQ0FBaEI7QUFDQSxZQUFJQyxRQUFRO0FBQ1ZDLGVBQUssQ0FESztBQUVWQyxpQkFBTyxDQUZHO0FBR1ZDLGtCQUFRLENBSEU7QUFJVkMsZ0JBQU07QUFKSSxTQUFaO0FBTUEsWUFBSVAsUUFBUUQsT0FBT1MsTUFBUCxDQUFjLFVBQUNDLEdBQUQsRUFBTUMsR0FBTjtBQUFBLGlCQUFjRCxNQUFNQyxJQUFJQyxRQUF4QjtBQUFBLFNBQWQsRUFBZ0QsQ0FBaEQsQ0FBWixFQUFnRTtBQUFBLHFDQUNuREMsS0FEbUQ7QUFFNUQsYUFBQyxLQUFELEVBQVEsT0FBUixFQUFpQixRQUFqQixFQUEyQixNQUEzQixFQUFtQ0MsT0FBbkMsQ0FBMkMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2xEWCxvQkFBTVcsR0FBTixJQUFhRixNQUFNRSxHQUFOLENBQWI7QUFDRCxhQUZEO0FBR0EsZ0JBQUlkLFFBQVEsQ0FBUixJQUFjQSxPQUFPRSxTQUFQLElBQW9CRixRQUFRRSxZQUFZVSxNQUFNRCxRQUFoRSxFQUEyRTtBQUN6RTtBQUNEO0FBQ0RULHlCQUFhVSxNQUFNRCxRQUFuQjtBQVI0RDs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDOUQsaUNBQW9CWixNQUFwQiw4SEFBNEI7QUFBQSxrQkFBakJhLEtBQWlCOztBQUFBLCtCQUFqQkEsS0FBaUI7O0FBQUEsb0NBS3hCO0FB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YUFBSyxJQUFJbEMsTUFBTSxDQUFmLEVBQWtCQSxNQUFNcUQsRUFBRTNELGFBQUYsQ0FBZ0J3QyxNQUF4QyxFQUFnRGxDLEtBQWhELEVBQXVEO0FBQ3JELGNBQUl1RCxZQUFZRixFQUFFM0QsYUFBRixDQUFnQk0sR0FBaEIsQ0FBaEI7QUFDQSxlQUFLLElBQUl0QixHQUFULElBQWdCNkUsU0FBaEIsRUFBMkI7QUFDekIsZ0JBQUlBLFVBQVU3RSxHQUFWLE1BQW1CNEUsRUFBRTVELGFBQUYsQ0FBZ0JNLEdBQWhCLEVBQXFCdEIsR0FBckIsQ0FBdkIsRUFBa0QsT0FBTyxLQUFQO0FBQ25EO0FBQ0Y7QUFDRCxlQUFPLElBQVA7QUFDRDtBQXBNZTs7QUFBQTtBQUFBOztBQXNNbEIsU0FBTyxJQUFJaEIsWUFBSixFQUFQO0FBQ0QsQ0F2TUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG5cbiAgY2xhc3MgRXVnbGVuYVV0aWxzIHtcbiAgICBnZXRMaWdodFN0YXRlKGxpZ2h0cywgdGltZSwgb3B0cyA9IHt9KSB7XG4gICAgICBsZXQgYmxvY2tUaW1lID0gMDtcbiAgICAgIGxldCBsaWdodCA9IHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwXG4gICAgICB9O1xuICAgICAgaWYgKHRpbWUgPD0gbGlnaHRzLnJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbC5kdXJhdGlvbiwgMCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiBsaWdodHMpIHtcbiAgICAgICAgICBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgbGlnaHRba2V5XSA9IGJsb2NrW2tleV07XG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAodGltZSA9PSAwIHx8ICh0aW1lID4gYmxvY2tUaW1lICYmIHRpbWUgPD0gYmxvY2tUaW1lICsgYmxvY2suZHVyYXRpb24pKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYmxvY2tUaW1lICs9IGJsb2NrLmR1cmF0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAob3B0cy5hbmdsZSkge1xuICAgICAgICBsaWdodC5hbmdsZSA9IE1hdGguYXRhbjIobGlnaHQuYm90dG9tIC0gbGlnaHQudG9wLCBsaWdodC5sZWZ0IC0gbGlnaHQucmlnaHQpXG4gICAgICB9XG4gICAgICBpZiAob3B0cy5pbnRlbnNpdHkpIHtcbiAgICAgICAgbGlnaHQuaW50ZW5zaXR5ID0gTWF0aC5zcXJ0KE1hdGgucG93KGxpZ2h0LmJvdHRvbSAtIGxpZ2h0LnRvcCwgMikgKyBNYXRoLnBvdyhsaWdodC5sZWZ0IC0gbGlnaHQucmlnaHQsIDIpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxpZ2h0O1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZVJlc3VsdHMocmVzKSB7XG4gICAgICBsZXQgdGltZVByb21pc2U7XG4gICAgICBpZiAocmVzLnJ1blRpbWUpIHtcbiAgICAgICAgdGltZVByb21pc2UgPSBQcm9taXNlLnJlc29sdmUocmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVQcm9taXNlID0gVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXhwZXJpbWVudHMvJHtyZXMuZXhwZXJpbWVudElkfWApLnRoZW4oKGV4cCkgPT4ge1xuICAgICAgICAgIGxldCB0aW1lID0gZXhwLmNvbmZpZ3VyYXRpb24ucmVkdWNlKChhY2MsIHZhbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFjYyArIHZhbC5kdXJhdGlvblxuICAgICAgICAgIH0sIDApO1xuICAgICAgICAgIHJlcy5ydW5UaW1lID0gdGltZTtcbiAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aW1lUHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmVzdWx0LnRyYWNrcy5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgIHRyYWNrLnNhbXBsZXMuZm9yRWFjaCgoc2FtcGxlLCBpbmQpID0+IHtcbiAgICAgICAgICAgIGlmIChpbmQgPT0gMCkge1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWQgPSAwO1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWRYID0gMDtcbiAgICAgICAgICAgICAgc2FtcGxlLnNwZWVkWSA9IDA7XG4gICAgICAgICAgICAgIHNhbXBsZS5hbmdsZVhZID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2FtcGxlLnNwZWVkID0gTWF0aC5zcXJ0KE1hdGgucG93KHNhbXBsZS54IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS54LCAyKSArIE1hdGgucG93KHNhbXBsZS55IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS55LCAyKSkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWRYID0gKHNhbXBsZS54IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS54KSAvIChzYW1wbGUudGltZSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0udGltZSk7XG4gICAgICAgICAgICAgIHNhbXBsZS5zcGVlZFkgPSAoc2FtcGxlLnkgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnkpIC8gKHNhbXBsZS50aW1lIC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS50aW1lKTtcbiAgICAgICAgICAgICAgc2FtcGxlLmFuZ2xlWFkgPSBNYXRoLmF0YW4yKChzYW1wbGUueSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueSkgLCAoc2FtcGxlLnggLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLngpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICByZXN1bHQuZnBzID0gcmVzdWx0Lm51bUZyYW1lcyAvIHJlc3VsdC5ydW5UaW1lO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRMaXZlUmVzdWx0cyhleHBJZCkge1xuICAgICAgY29uc3Qgbm90ZUlkID0gVXRpbHMuZ3VpZDQoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICBpZDogbm90ZUlkLFxuICAgICAgICBleHBpcmVMYWJlbDogbnVsbCxcbiAgICAgICAgbWVzc2FnZTogXCJMb2FkaW5nIGxpdmUgcmVzdWx0c1wiXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICB7IGV4cGVyaW1lbnRJZDogZXhwSWQgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBicHVfYXBpX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgIG5lcTogbnVsbFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVSZXN1bHRzKHJlc3VsdHNbMF0pO1xuICAgICAgfSkudGhlbigobm9ybWFsaXplZCkgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLlJlbW92ZScsIHtcbiAgICAgICAgICBub3RlSWQ6IG5vdGVJZFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldE1vZGVsUmVzdWx0cyhleHBJZCwgbW9kZWwsIHJlbG9hZCA9IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLmxvZygnSSBhbSBoZXJlJylcbiAgICAgIGNvbnNvbGUubG9nKGV4cElkKVxuICAgICAgY29uc29sZS5sb2cobW9kZWwpXG4gICAgICBsZXQgbm90ZUlkO1xuICAgICAgaWYgKCFyZWxvYWQpIHtcbiAgICAgICAgbm90ZUlkID0gVXRpbHMuZ3VpZDQoKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IG5vdGVJZCxcbiAgICAgICAgICBleHBpcmVMYWJlbDogbnVsbCxcbiAgICAgICAgICBtZXNzYWdlOiBcIkxvYWRpbmcgbW9kZWwgcmVzdWx0c1wiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL1Jlc3VsdHNgLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgIGFuZDogW1xuICAgICAgICAgICAgICAgIHsgZXhwZXJpbWVudElkOiBleHBJZCB9LFxuICAgICAgICAgICAgICAgIHsgZXVnbGVuYU1vZGVsSWQ6IG1vZGVsLmlkIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnbm93IEkgYW0gaGVyZScpXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdHMpXG4gICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHRzWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlUmVzdWx0cyh7XG4gICAgICAgICAgICBleHBlcmltZW50SWQ6IGV4cElkLFxuICAgICAgICAgICAgZXVnbGVuYU1vZGVsSWQ6IG1vZGVsLmlkLFxuICAgICAgICAgICAgY291bnQ6IG1vZGVsLmNvbmZpZ3VyYXRpb24uY291bnQsXG4gICAgICAgICAgICBtYWduaWZpY2F0aW9uOiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnRSZXN1bHRzLm1hZ25pZmljYXRpb24nKVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWxSZXN1bHRzKGV4cElkLCBtb2RlbCwgdHJ1ZSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdub3cgSSBhbSBub3JtYWxpemluZycpXG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZVJlc3VsdHMocmVzdWx0KTtcbiAgICAgIH0pLnRoZW4oKG5vcm1hbGl6ZWQpID0+IHtcbiAgICAgICAgaWYgKG5vdGVJZCkge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJywge1xuICAgICAgICAgICAgbm90ZUlkOiBub3RlSWRcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub3JtYWxpemVkO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVSZXN1bHRzKGNvbmYpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdub3cgaW4gZ2VuZXJhdGVSZXN1bHRzJylcbiAgICAgIGNvbnNvbGUubG9nKGNvbmYpXG4gICAgICBpZiAoIWNvbmYuYnB1X2FwaV9pZCkge1xuICAgICAgICBjb25mLmZwcyA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwuc2ltdWxhdGlvbkZwcycpO1xuICAgICAgICBjb25mLmluaXRpYWxpemF0aW9uID0gdGhpcy5pbml0aWFsaXplTW9kZWxFdWdsZW5hKGNvbmYuY291bnQsIGNvbmYubWFnbmlmaWNhdGlvbik7XG4gICAgICAgIGRlbGV0ZSBjb25mLmNvdW50O1xuICAgICAgICBkZWxldGUgY29uZi5tYWduaWZpY2F0aW9uO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJ25vdyBkb25lIGluaXRpYWxpemluZycpXG4gICAgICBjb25zb2xlLmxvZyhjb25mKVxuICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL1Jlc3VsdHMnLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShjb25mKSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBpbml0aWFsaXplTW9kZWxFdWdsZW5hKGNvdW50LCBtYWduaWZpY2F0aW9uKSB7XG4gICAgICBjb25zb2xlLmxvZygnbm93IGluIGluaXRpYWxpemF0aW9uJylcbiAgICAgIGNvbnN0IGluaXRpYWxpemUgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICBpbml0aWFsaXplLnB1c2goe1xuICAgICAgICAgIHg6IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogNjQwIC8gKDIgKiBtYWduaWZpY2F0aW9uKSxcbiAgICAgICAgICB5OiAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIDQ4MCAvICgyICogbWFnbmlmaWNhdGlvbiksXG4gICAgICAgICAgejogMCxcbiAgICAgICAgICB5YXc6IE1hdGgucmFuZG9tKCkgKiBVdGlscy5UQVUsXG4gICAgICAgICAgcm9sbDogTWF0aC5yYW5kb20oKSAqIFV0aWxzLlRBVSxcbiAgICAgICAgICBwaXRjaDogTWF0aC5yYW5kb20oKSAqIFV0aWxzLlRBVVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluaXRpYWxpemU7XG4gICAgfVxuXG4gICAgZXhwZXJpbWVudE1hdGNoKGEsYikge1xuICAgICAgaWYgKGEuY29uZmlndXJhdGlvbi5sZW5ndGggIT0gYi5jb25maWd1cmF0aW9uLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgZm9yIChsZXQgaW5kID0gMDsgaW5kIDwgYS5jb25maWd1cmF0aW9uLmxlbmd0aDsgaW5kKyspIHtcbiAgICAgICAgbGV0IGxpZ2h0Q29uZiA9IGEuY29uZmlndXJhdGlvbltpbmRdO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gbGlnaHRDb25mKSB7XG4gICAgICAgICAgaWYgKGxpZ2h0Q29uZltrZXldICE9PSBiLmNvbmZpZ3VyYXRpb25baW5kXVtrZXldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IEV1Z2xlbmFVdGlscztcbn0pXG4iXX0=
