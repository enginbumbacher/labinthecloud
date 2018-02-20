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
              noteId: noteId
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJFdWdsZW5hVXRpbHMiLCJsaWdodHMiLCJ0aW1lIiwib3B0cyIsImJsb2NrVGltZSIsImxpZ2h0IiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJibG9jayIsImZvckVhY2giLCJrZXkiLCJhbmdsZSIsIk1hdGgiLCJhdGFuMiIsImludGVuc2l0eSIsInNxcnQiLCJwb3ciLCJyZXMiLCJ0aW1lUHJvbWlzZSIsInJ1blRpbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInByb21pc2VBamF4IiwiZXhwZXJpbWVudElkIiwidGhlbiIsImV4cCIsImNvbmZpZ3VyYXRpb24iLCJyZXN1bHQiLCJ0cmFja3MiLCJ0cmFjayIsInNhbXBsZXMiLCJzYW1wbGUiLCJpbmQiLCJzcGVlZCIsInNwZWVkWCIsInNwZWVkWSIsImFuZ2xlWFkiLCJyYW5kb20iLCJQSSIsIngiLCJ5IiwiZnBzIiwibnVtRnJhbWVzIiwiZXhwSWQiLCJub3RlSWQiLCJndWlkNCIsImdldCIsImRpc3BhdGNoRXZlbnQiLCJpZCIsImV4cGlyZUxhYmVsIiwibWVzc2FnZSIsImRhdGEiLCJmaWx0ZXIiLCJ3aGVyZSIsImFuZCIsImJwdV9hcGlfaWQiLCJuZXEiLCJjb250ZW50VHlwZSIsInJlc3VsdHMiLCJub3JtYWxpemVSZXN1bHRzIiwibm9ybWFsaXplZCIsIm1vZGVsIiwicmVsb2FkIiwiZXVnbGVuYU1vZGVsSWQiLCJsZW5ndGgiLCJnZW5lcmF0ZVJlc3VsdHMiLCJjb3VudCIsIm1hZ25pZmljYXRpb24iLCJnZXRNb2RlbFJlc3VsdHMiLCJjb25mIiwiaW5pdGlhbGl6YXRpb24iLCJpbml0aWFsaXplTW9kZWxFdWdsZW5hIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImluaXRpYWxpemUiLCJp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QUFKLEVBQVA7QUFDRCxDQTVMRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcblxuICBjbGFzcyBFdWdsZW5hVXRpbHMge1xuICAgIGdldExpZ2h0U3RhdGUobGlnaHRzLCB0aW1lLCBvcHRzID0ge30pIHtcbiAgICAgIGxldCBibG9ja1RpbWUgPSAwO1xuICAgICAgbGV0IGxpZ2h0ID0ge1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICAgIGxlZnQ6IDBcbiAgICAgIH07XG4gICAgICBpZiAodGltZSA8PSBsaWdodHMucmVkdWNlKChhY2MsIHZhbCkgPT4gYWNjICsgdmFsLmR1cmF0aW9uLCAwKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIGxpZ2h0cykge1xuICAgICAgICAgIFsndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBsaWdodFtrZXldID0gYmxvY2tba2V5XTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICh0aW1lID09IDAgfHwgKHRpbWUgPiBibG9ja1RpbWUgJiYgdGltZSA8PSBibG9ja1RpbWUgKyBibG9jay5kdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBibG9ja1RpbWUgKz0gYmxvY2suZHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvcHRzLmFuZ2xlKSB7XG4gICAgICAgIGxpZ2h0LmFuZ2xlID0gTWF0aC5hdGFuMihsaWdodC5ib3R0b20gLSBsaWdodC50b3AsIGxpZ2h0LmxlZnQgLSBsaWdodC5yaWdodClcbiAgICAgIH1cbiAgICAgIGlmIChvcHRzLmludGVuc2l0eSkge1xuICAgICAgICBsaWdodC5pbnRlbnNpdHkgPSBNYXRoLnNxcnQoTWF0aC5wb3cobGlnaHQuYm90dG9tIC0gbGlnaHQudG9wLCAyKSArIE1hdGgucG93KGxpZ2h0LmxlZnQgLSBsaWdodC5yaWdodCwgMikpXG4gICAgICB9XG4gICAgICByZXR1cm4gbGlnaHQ7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplUmVzdWx0cyhyZXMpIHtcbiAgICAgIGxldCB0aW1lUHJvbWlzZTtcbiAgICAgIGlmIChyZXMucnVuVGltZSkge1xuICAgICAgICB0aW1lUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShyZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZVByb21pc2UgPSBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FeHBlcmltZW50cy8ke3Jlcy5leHBlcmltZW50SWR9YCkudGhlbigoZXhwKSA9PiB7XG4gICAgICAgICAgbGV0IHRpbWUgPSBleHAuY29uZmlndXJhdGlvbi5yZWR1Y2UoKGFjYywgdmFsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWNjICsgdmFsLmR1cmF0aW9uXG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgcmVzLnJ1blRpbWUgPSB0aW1lO1xuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRpbWVQcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXN1bHQudHJhY2tzLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICAgICAgdHJhY2suc2FtcGxlcy5mb3JFYWNoKChzYW1wbGUsIGluZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGluZCA9PSAwKSB7XG4gICAgICAgICAgICAgIHNhbXBsZS5zcGVlZCA9IDA7XG4gICAgICAgICAgICAgIHNhbXBsZS5zcGVlZFggPSAwO1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWRZID0gMDtcbiAgICAgICAgICAgICAgc2FtcGxlLmFuZ2xlWFkgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWQgPSBNYXRoLnNxcnQoTWF0aC5wb3coc2FtcGxlLnggLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLngsIDIpICsgTWF0aC5wb3coc2FtcGxlLnkgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnksIDIpKSAvIChzYW1wbGUudGltZSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0udGltZSk7XG4gICAgICAgICAgICAgIHNhbXBsZS5zcGVlZFggPSAoc2FtcGxlLnggLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLngpIC8gKHNhbXBsZS50aW1lIC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS50aW1lKTtcbiAgICAgICAgICAgICAgc2FtcGxlLnNwZWVkWSA9IChzYW1wbGUueSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueSkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgICBzYW1wbGUuYW5nbGVYWSA9IE1hdGguYXRhbjIoKHNhbXBsZS55IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS55KSAsIChzYW1wbGUueCAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHJlc3VsdC5mcHMgPSByZXN1bHQubnVtRnJhbWVzIC8gcmVzdWx0LnJ1blRpbWU7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KVxuICAgIH1cblxuICAgIGdldExpdmVSZXN1bHRzKGV4cElkKSB7XG4gICAgICBjb25zdCBub3RlSWQgPSBVdGlscy5ndWlkNCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgIGlkOiBub3RlSWQsXG4gICAgICAgIGV4cGlyZUxhYmVsOiBudWxsLFxuICAgICAgICBtZXNzYWdlOiBcIkxvYWRpbmcgbGl2ZSByZXN1bHRzXCJcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL1Jlc3VsdHNgLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgIGFuZDogW1xuICAgICAgICAgICAgICAgIHsgZXhwZXJpbWVudElkOiBleHBJZCB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGJwdV9hcGlfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbmVxOiBudWxsXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9KS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZVJlc3VsdHMocmVzdWx0c1swXSk7XG4gICAgICB9KS50aGVuKChub3JtYWxpemVkKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJywge1xuICAgICAgICAgIG5vdGVJZDogbm90ZUlkXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0TW9kZWxSZXN1bHRzKGV4cElkLCBtb2RlbCwgcmVsb2FkID0gZmFsc2UpIHtcbiAgICAgIGxldCBub3RlSWQ7XG4gICAgICBpZiAoIXJlbG9hZCkge1xuICAgICAgICBub3RlSWQgPSBVdGlscy5ndWlkNCgpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICBpZDogbm90ZUlkLFxuICAgICAgICAgIGV4cGlyZUxhYmVsOiBudWxsLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiTG9hZGluZyBtb2RlbCByZXN1bHRzXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvUmVzdWx0c2AsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgYW5kOiBbXG4gICAgICAgICAgICAgICAgeyBleHBlcmltZW50SWQ6IGV4cElkIH0sXG4gICAgICAgICAgICAgICAgeyBldWdsZW5hTW9kZWxJZDogbW9kZWwuaWQgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9KS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHRzWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlUmVzdWx0cyh7XG4gICAgICAgICAgICBleHBlcmltZW50SWQ6IGV4cElkLFxuICAgICAgICAgICAgZXVnbGVuYU1vZGVsSWQ6IG1vZGVsLmlkLFxuICAgICAgICAgICAgY291bnQ6IG1vZGVsLmNvbmZpZ3VyYXRpb24uY291bnQsXG4gICAgICAgICAgICBtYWduaWZpY2F0aW9uOiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnRSZXN1bHRzLm1hZ25pZmljYXRpb24nKVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TW9kZWxSZXN1bHRzKGV4cElkLCBtb2RlbCwgdHJ1ZSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZVJlc3VsdHMocmVzdWx0KTtcbiAgICAgIH0pLnRoZW4oKG5vcm1hbGl6ZWQpID0+IHtcbiAgICAgICAgaWYgKG5vdGVJZCkge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJywge1xuICAgICAgICAgICAgbm90ZUlkOiBub3RlSWRcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub3JtYWxpemVkO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVSZXN1bHRzKGNvbmYpIHtcbiAgICAgIGlmICghY29uZi5icHVfYXBpX2lkKSB7XG4gICAgICAgIGNvbmYuZnBzID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC5zaW11bGF0aW9uRnBzJyk7XG4gICAgICAgIGNvbmYuaW5pdGlhbGl6YXRpb24gPSB0aGlzLmluaXRpYWxpemVNb2RlbEV1Z2xlbmEoY29uZi5jb3VudCwgY29uZi5tYWduaWZpY2F0aW9uKTtcbiAgICAgICAgZGVsZXRlIGNvbmYuY291bnQ7XG4gICAgICAgIGRlbGV0ZSBjb25mLm1hZ25pZmljYXRpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvUmVzdWx0cycsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGNvbmYpLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9KVxuICAgIH1cblxuICAgIGluaXRpYWxpemVNb2RlbEV1Z2xlbmEoY291bnQsIG1hZ25pZmljYXRpb24pIHtcbiAgICAgIGNvbnN0IGluaXRpYWxpemUgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICBpbml0aWFsaXplLnB1c2goe1xuICAgICAgICAgIHg6IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogNjQwIC8gKDIgKiBtYWduaWZpY2F0aW9uKSxcbiAgICAgICAgICB5OiAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIDQ4MCAvICgyICogbWFnbmlmaWNhdGlvbiksXG4gICAgICAgICAgejogMCxcbiAgICAgICAgICB5YXc6IE1hdGgucmFuZG9tKCkgKiBVdGlscy5UQVUsXG4gICAgICAgICAgcm9sbDogTWF0aC5yYW5kb20oKSAqIFV0aWxzLlRBVSxcbiAgICAgICAgICBwaXRjaDogTWF0aC5yYW5kb20oKSAqIFV0aWxzLlRBVVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluaXRpYWxpemU7XG4gICAgfVxuXG4gICAgZXhwZXJpbWVudE1hdGNoKGEsYikge1xuICAgICAgaWYgKGEuY29uZmlndXJhdGlvbi5sZW5ndGggIT0gYi5jb25maWd1cmF0aW9uLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgZm9yIChsZXQgaW5kID0gMDsgaW5kIDwgYS5jb25maWd1cmF0aW9uLmxlbmd0aDsgaW5kKyspIHtcbiAgICAgICAgbGV0IGxpZ2h0Q29uZiA9IGEuY29uZmlndXJhdGlvbltpbmRdO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gbGlnaHRDb25mKSB7XG4gICAgICAgICAgaWYgKGxpZ2h0Q29uZltrZXldICE9PSBiLmNvbmZpZ3VyYXRpb25baW5kXVtrZXldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IEV1Z2xlbmFVdGlscztcbn0pXG4iXX0=
