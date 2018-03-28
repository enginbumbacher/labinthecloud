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
            noteId: noteId, type: 'experiment'
          });
          return normalized;
        });
      }
    }, {
      key: 'getModelResults',
      value: function getModelResults(expId, model) {
        var _this2 = this;

        var reload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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
          return _this2.normalizeResults(result);
        }).then(function (normalized) {
          if (noteId) {
            Globals.get('Relay').dispatchEvent('Notifications.Remove', {
              noteId: noteId, type: 'model'
            });
          }
          return normalized;
        });
      }
    }, {
      key: 'generateResults',
      value: function generateResults(conf) {
        if (!conf.bpu_api_id) {
          conf.fps = Globals.get('AppConfig.model.simulationFps');
          //conf.initialization = this.initializeModelEuglena(conf.count, conf.magnification, conf.initialization);
          delete conf.count;
          delete conf.magnification;
        } else {
          delete conf.tracks;
        }
        return Utils.promiseAjax('/api/v1/Results', {
          method: 'POST',
          data: JSON.stringify(conf),
          contentType: 'application/json'
        });
      }
    }, {
      key: 'initializeModelEuglena',
      value: function initializeModelEuglena(count, magnification, initialOrientation) {
        var initialize = [];
        if (initialOrientation === '1') {

          for (var i = 0; i < count; i++) {
            initialize.push({
              x: (Math.random() * 2 - 1) * 640 / (2 * magnification),
              y: (Math.random() * 2 - 1) * 480 / (2 * magnification),
              z: 0,
              yaw: Math.random() * Utils.TAU,
              roll: 0,
              pitch: Math.random() * Utils.TAU
            });
          }
        } else {
          for (var _i = 0; _i < count; _i++) {
            initialize.push({
              x: (Math.random() * 2 - 1) * 640 / (2 * liveResult.magnification),
              y: (Math.random() * 2 - 1) * 480 / (2 * liveResult.magnification),
              z: 0,
              yaw: 0,
              roll: 0.1,
              pitch: Math.PI / 2
            });
          }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJFdWdsZW5hVXRpbHMiLCJsaWdodHMiLCJ0aW1lIiwib3B0cyIsImJsb2NrVGltZSIsImxpZ2h0IiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJibG9jayIsImZvckVhY2giLCJrZXkiLCJhbmdsZSIsIk1hdGgiLCJhdGFuMiIsImludGVuc2l0eSIsInNxcnQiLCJwb3ciLCJyZXMiLCJ0aW1lUHJvbWlzZSIsInJ1blRpbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInByb21pc2VBamF4IiwiZXhwZXJpbWVudElkIiwidGhlbiIsImV4cCIsImNvbmZpZ3VyYXRpb24iLCJyZXN1bHQiLCJ0cmFja3MiLCJ0cmFjayIsInNhbXBsZXMiLCJzYW1wbGUiLCJpbmQiLCJzcGVlZCIsInNwZWVkWCIsInNwZWVkWSIsImFuZ2xlWFkiLCJyYW5kb20iLCJQSSIsIngiLCJ5IiwiZnBzIiwibnVtRnJhbWVzIiwiZXhwSWQiLCJub3RlSWQiLCJndWlkNCIsImdldCIsImRpc3BhdGNoRXZlbnQiLCJpZCIsImV4cGlyZUxhYmVsIiwibWVzc2FnZSIsImRhdGEiLCJmaWx0ZXIiLCJ3aGVyZSIsImFuZCIsImJwdV9hcGlfaWQiLCJuZXEiLCJjb250ZW50VHlwZSIsInJlc3VsdHMiLCJub3JtYWxpemVSZXN1bHRzIiwibm9ybWFsaXplZCIsInR5cGUiLCJtb2RlbCIsInJlbG9hZCIsImV1Z2xlbmFNb2RlbElkIiwibGVuZ3RoIiwiZ2VuZXJhdGVSZXN1bHRzIiwiY291bnQiLCJtYWduaWZpY2F0aW9uIiwiZ2V0TW9kZWxSZXN1bHRzIiwiY29uZiIsIm1ldGhvZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJpbml0aWFsT3JpZW50YXRpb24iLCJpbml0aWFsaXplIiwiaSIsInB1c2giLCJ6Iiwi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LFlBQUlELEVBQUUxRCxhQUFGLENBQWdCdUMsTUFBaEIsSUFBMEJvQixFQUFFM0QsYUFBRixDQUFnQnVDLE1BQTlDLEVBQXNELE9BQU8sS0FBUDtBQUN0RCxhQUFLLElBQUlqQyxNQUFNLENBQWYsRUFBa0JBLE1BQU1vRCxFQUFFMUQsYUFBRixDQUFnQnVDLE1BQXhDLEVBQWdEakMsS0FBaEQsRUFBdUQ7QUFDckQsY0FBSXNELFlBQVlGLEVBQUUxRCxhQUFGLENBQWdCTSxHQUFoQixDQUFoQjtBQUNBLGVBQUssSUFBSXRCLEdBQVQsSUFBZ0I0RSxTQUFoQixFQUEyQjtBQUN6QixnQkFBSUEsVUFBVTVFLEdBQVYsTUFBbUIyRSxFQUFFM0QsYUFBRixDQUFnQk0sR0FBaEIsRUFBcUJ0QixHQUFyQixDQUF2QixFQUFrRCxPQUFPLEtBQVA7QUFDbkQ7QUFDRjtBQUNELGVBQU8sSUFBUDtBQUNEO0FBek1lOztBQUFBO0FBQUE7O0FBMk1sQixTQUFPLElBQUloQixZQUFKLEVBQVA7QUFDRCxDQTVNRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcblxuICBjbGFzcyBFdWdsZW5hVXRpbHMge1xuICAgIGdldExpZ2h0U3RhdGUobGlnaHRzLCB0aW1lLCBvcHRzID0ge30pIHtcbiAgICAgIGxldCBibG9ja1RpbWUgPSAwO1xuICAgICAgbGV0IGxpZ2h0ID0ge1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICAgIGxlZnQ6IDBcbiAgICAgIH07XG4gICAgICBpZiAodGltZSA8PSBsaWdodHMucmVkdWNlKChhY2MsIHZhbCkgPT4gYWNjICsgdmFsLmR1cmF0aW9uLCAwKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIGxpZ2h0cykge1xuICAgICAgICAgIFsndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBsaWdodFtrZXldID0gYmxvY2tba2V5XTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICh0aW1lID09IDAgfHwgKHRpbWUgPiBibG9ja1RpbWUgJiYgdGltZSA8PSBibG9ja1RpbWUgKyBibG9jay5kdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBibG9ja1RpbWUgKz0gYmxvY2suZHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvcHRzLmFuZ2xlKSB7XG4gICAgICAgIGxpZ2h0LmFuZ2xlID0gTWF0aC5hdGFuMihsaWdodC5ib3R0b20gLSBsaWdodC50b3AsIGxpZ2h0LmxlZnQgLSBsaWdodC5yaWdodClcbiAgICAgIH1cbiAgICAgIGlmIChvcHRzLmludGVuc2l0eSkge1xuICAgICAgICBsaWdodC5pbnRlbnNpdHkgPSBNYXRoLnNxcnQoTWF0aC5wb3cobGlnaHQuYm90dG9tIC0gbGlnaHQudG9wLCAyKSArIE1hdGgucG93KGxpZ2h0LmxlZnQgLSBsaWdodC5yaWdodCwgMikpXG4gICAgICB9XG4gICAgICByZXR1cm4gbGlnaHQ7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplUmVzdWx0cyhyZXMpIHtcbiAgICAgIGxldCB0aW1lUHJvbWlzZTtcbiAgICAgIGlmIChyZXMucnVuVGltZSkge1xuICAgICAgICB0aW1lUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShyZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZVByb21pc2UgPSBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FeHBlcmltZW50cy8ke3Jlcy5leHBlcmltZW50SWR9YCkudGhlbigoZXhwKSA9PiB7XG4gICAgICAgICAgbGV0IHRpbWUgPSBleHAuY29uZmlndXJhdGlvbi5yZWR1Y2UoKGFjYywgdmFsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWNjICsgdmFsLmR1cmF0aW9uXG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgcmVzLnJ1blRpbWUgPSB0aW1lO1xuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRpbWVQcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXN1bHQudHJhY2tzLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICAgICAgdHJhY2suc2FtcGxlcy5mb3JFYWNoKChzYW1wbGUsIGluZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGluZCA9PSAwKSB7XG4gICAgICAgICAgICAgIHNhbXBsZS5zcGVlZCA9IDA7XG4gICAgICAgICAgICAgIHNhbXBsZS5zcGVlZFggPSAwO1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWRZID0gMDtcbiAgICAgICAgICAgICAgc2FtcGxlLmFuZ2xlWFkgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWQgPSBNYXRoLnNxcnQoTWF0aC5wb3coc2FtcGxlLnggLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLngsIDIpICsgTWF0aC5wb3coc2FtcGxlLnkgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnksIDIpKSAvIChzYW1wbGUudGltZSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0udGltZSk7XG4gICAgICAgICAgICAgIHNhbXBsZS5zcGVlZFggPSAoc2FtcGxlLnggLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLngpIC8gKHNhbXBsZS50aW1lIC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS50aW1lKTtcbiAgICAgICAgICAgICAgc2FtcGxlLnNwZWVkWSA9IChzYW1wbGUueSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueSkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgICBzYW1wbGUuYW5nbGVYWSA9IE1hdGguYXRhbjIoKHNhbXBsZS55IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS55KSAsIChzYW1wbGUueCAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHJlc3VsdC5mcHMgPSByZXN1bHQubnVtRnJhbWVzIC8gcmVzdWx0LnJ1blRpbWU7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KVxuICAgIH1cblxuICAgIGdldExpdmVSZXN1bHRzKGV4cElkKSB7XG4gICAgICBjb25zdCBub3RlSWQgPSBVdGlscy5ndWlkNCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgIGlkOiBub3RlSWQsXG4gICAgICAgIGV4cGlyZUxhYmVsOiBudWxsLFxuICAgICAgICBtZXNzYWdlOiBcIkxvYWRpbmcgbGl2ZSByZXN1bHRzXCJcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL1Jlc3VsdHNgLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgIGFuZDogW1xuICAgICAgICAgICAgICAgIHsgZXhwZXJpbWVudElkOiBleHBJZCB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGJwdV9hcGlfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbmVxOiBudWxsXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9KS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZVJlc3VsdHMocmVzdWx0c1swXSk7XG4gICAgICB9KS50aGVuKChub3JtYWxpemVkKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJywge1xuICAgICAgICAgIG5vdGVJZDogbm90ZUlkLCB0eXBlOiAnZXhwZXJpbWVudCdcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRNb2RlbFJlc3VsdHMoZXhwSWQsIG1vZGVsLCByZWxvYWQgPSBmYWxzZSkge1xuICAgICAgbGV0IG5vdGVJZDtcbiAgICAgIGlmICghcmVsb2FkKSB7XG4gICAgICAgIG5vdGVJZCA9IFV0aWxzLmd1aWQ0KCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgIGlkOiBub3RlSWQsXG4gICAgICAgICAgZXhwaXJlTGFiZWw6IG51bGwsXG4gICAgICAgICAgbWVzc2FnZTogXCJMb2FkaW5nIG1vZGVsIHJlc3VsdHNcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICB7IGV4cGVyaW1lbnRJZDogZXhwSWQgfSxcbiAgICAgICAgICAgICAgICB7IGV1Z2xlbmFNb2RlbElkOiBtb2RlbC5pZCB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0pLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVSZXN1bHRzKHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogZXhwSWQsXG4gICAgICAgICAgICBldWdsZW5hTW9kZWxJZDogbW9kZWwuaWQsXG4gICAgICAgICAgICBjb3VudDogbW9kZWwuY29uZmlndXJhdGlvbi5jb3VudCxcbiAgICAgICAgICAgIG1hZ25pZmljYXRpb246IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMubWFnbmlmaWNhdGlvbicpXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRNb2RlbFJlc3VsdHMoZXhwSWQsIG1vZGVsLCB0cnVlKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplUmVzdWx0cyhyZXN1bHQpO1xuICAgICAgfSkudGhlbigobm9ybWFsaXplZCkgPT4ge1xuICAgICAgICBpZiAobm90ZUlkKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5SZW1vdmUnLCB7XG4gICAgICAgICAgICBub3RlSWQ6IG5vdGVJZCwgdHlwZTogJ21vZGVsJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVJlc3VsdHMoY29uZikge1xuICAgICAgaWYgKCFjb25mLmJwdV9hcGlfaWQpIHtcbiAgICAgICAgY29uZi5mcHMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnNpbXVsYXRpb25GcHMnKTtcbiAgICAgICAgLy9jb25mLmluaXRpYWxpemF0aW9uID0gdGhpcy5pbml0aWFsaXplTW9kZWxFdWdsZW5hKGNvbmYuY291bnQsIGNvbmYubWFnbmlmaWNhdGlvbiwgY29uZi5pbml0aWFsaXphdGlvbik7XG4gICAgICAgIGRlbGV0ZSBjb25mLmNvdW50O1xuICAgICAgICBkZWxldGUgY29uZi5tYWduaWZpY2F0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGNvbmYudHJhY2tzXG4gICAgICB9XG4gICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvUmVzdWx0cycsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGNvbmYpLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9KVxuICAgIH1cblxuICAgIGluaXRpYWxpemVNb2RlbEV1Z2xlbmEoY291bnQsIG1hZ25pZmljYXRpb24sIGluaXRpYWxPcmllbnRhdGlvbikge1xuICAgICAgY29uc3QgaW5pdGlhbGl6ZSA9IFtdO1xuICAgICAgaWYgKGluaXRpYWxPcmllbnRhdGlvbj09PScxJykge1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgIGluaXRpYWxpemUucHVzaCh7XG4gICAgICAgICAgICB4OiAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIDY0MCAvICgyICogbWFnbmlmaWNhdGlvbiksXG4gICAgICAgICAgICB5OiAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIDQ4MCAvICgyICogbWFnbmlmaWNhdGlvbiksXG4gICAgICAgICAgICB6OiAwLFxuICAgICAgICAgICAgeWF3OiBNYXRoLnJhbmRvbSgpICogVXRpbHMuVEFVLFxuICAgICAgICAgICAgcm9sbDogMCxcbiAgICAgICAgICAgIHBpdGNoOiBNYXRoLnJhbmRvbSgpICogVXRpbHMuVEFVXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgaW5pdGlhbGl6ZS5wdXNoKHtcbiAgICAgICAgICAgIHg6IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogNjQwIC8gKDIgKiBsaXZlUmVzdWx0Lm1hZ25pZmljYXRpb24pLFxuICAgICAgICAgICAgeTogKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiA0ODAgLyAoMiAqIGxpdmVSZXN1bHQubWFnbmlmaWNhdGlvbiksXG4gICAgICAgICAgICB6OiAwLFxuICAgICAgICAgICAgeWF3OiAwLFxuICAgICAgICAgICAgcm9sbDogMC4xLFxuICAgICAgICAgICAgcGl0Y2g6IE1hdGguUEkgLyAyXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluaXRpYWxpemU7XG4gICAgfVxuXG4gICAgZXhwZXJpbWVudE1hdGNoKGEsYikge1xuICAgICAgaWYgKGEuY29uZmlndXJhdGlvbi5sZW5ndGggIT0gYi5jb25maWd1cmF0aW9uLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgZm9yIChsZXQgaW5kID0gMDsgaW5kIDwgYS5jb25maWd1cmF0aW9uLmxlbmd0aDsgaW5kKyspIHtcbiAgICAgICAgbGV0IGxpZ2h0Q29uZiA9IGEuY29uZmlndXJhdGlvbltpbmRdO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gbGlnaHRDb25mKSB7XG4gICAgICAgICAgaWYgKGxpZ2h0Q29uZltrZXldICE9PSBiLmNvbmZpZ3VyYXRpb25baW5kXVtrZXldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IEV1Z2xlbmFVdGlscztcbn0pXG4iXX0=
