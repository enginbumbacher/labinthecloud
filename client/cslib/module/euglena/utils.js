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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJFdWdsZW5hVXRpbHMiLCJsaWdodHMiLCJ0aW1lIiwib3B0cyIsImJsb2NrVGltZSIsImxpZ2h0IiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJibG9jayIsImZvckVhY2giLCJrZXkiLCJhbmdsZSIsIk1hdGgiLCJhdGFuMiIsImludGVuc2l0eSIsInNxcnQiLCJwb3ciLCJyZXMiLCJ0aW1lUHJvbWlzZSIsInJ1blRpbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInByb21pc2VBamF4IiwiZXhwZXJpbWVudElkIiwidGhlbiIsImV4cCIsImNvbmZpZ3VyYXRpb24iLCJyZXN1bHQiLCJ0cmFja3MiLCJ0cmFjayIsInNhbXBsZXMiLCJzYW1wbGUiLCJpbmQiLCJzcGVlZCIsInNwZWVkWCIsInNwZWVkWSIsImFuZ2xlWFkiLCJyYW5kb20iLCJQSSIsIngiLCJ5IiwiZnBzIiwibnVtRnJhbWVzIiwiZXhwSWQiLCJub3RlSWQiLCJndWlkNCIsImdldCIsImRpc3BhdGNoRXZlbnQiLCJpZCIsImV4cGlyZUxhYmVsIiwibWVzc2FnZSIsImRhdGEiLCJmaWx0ZXIiLCJ3aGVyZSIsImFuZCIsImJwdV9hcGlfaWQiLCJuZXEiLCJjb250ZW50VHlwZSIsInJlc3VsdHMiLCJub3JtYWxpemVSZXN1bHRzIiwibm9ybWFsaXplZCIsIm1vZGVsIiwicmVsb2FkIiwiZXVnbGVuYU1vZGVsSWQiLCJsZW5ndGgiLCJnZW5lcmF0ZVJlc3VsdHMiLCJjb3VudCIsIm1hZ25pZmljYXRpb24iLCJnZXRNb2RlbFJlc3VsdHMiLCJjb25mIiwiaW5pdGlhbGl6YXRpb24iLCJpbml0aWFsaXplTW9kZWxFdWdsZW5hIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImluaXRpYWxpemUiLCJp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bW9kdWxlL2V1Z2xlbmEvdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG5cbiAgY2xhc3MgRXVnbGVuYVV0aWxzIHtcbiAgICBnZXRMaWdodFN0YXRlKGxpZ2h0cywgdGltZSwgb3B0cyA9IHt9KSB7XG4gICAgICBsZXQgYmxvY2tUaW1lID0gMDtcbiAgICAgIGxldCBsaWdodCA9IHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwXG4gICAgICB9O1xuICAgICAgaWYgKHRpbWUgPD0gbGlnaHRzLnJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbC5kdXJhdGlvbiwgMCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiBsaWdodHMpIHtcbiAgICAgICAgICBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgbGlnaHRba2V5XSA9IGJsb2NrW2tleV07XG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAodGltZSA9PSAwIHx8ICh0aW1lID4gYmxvY2tUaW1lICYmIHRpbWUgPD0gYmxvY2tUaW1lICsgYmxvY2suZHVyYXRpb24pKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYmxvY2tUaW1lICs9IGJsb2NrLmR1cmF0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAob3B0cy5hbmdsZSkge1xuICAgICAgICBsaWdodC5hbmdsZSA9IE1hdGguYXRhbjIobGlnaHQuYm90dG9tIC0gbGlnaHQudG9wLCBsaWdodC5sZWZ0IC0gbGlnaHQucmlnaHQpXG4gICAgICB9XG4gICAgICBpZiAob3B0cy5pbnRlbnNpdHkpIHtcbiAgICAgICAgbGlnaHQuaW50ZW5zaXR5ID0gTWF0aC5zcXJ0KE1hdGgucG93KGxpZ2h0LmJvdHRvbSAtIGxpZ2h0LnRvcCwgMikgKyBNYXRoLnBvdyhsaWdodC5sZWZ0IC0gbGlnaHQucmlnaHQsIDIpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxpZ2h0O1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZVJlc3VsdHMocmVzKSB7XG4gICAgICBsZXQgdGltZVByb21pc2U7XG4gICAgICBpZiAocmVzLnJ1blRpbWUpIHtcbiAgICAgICAgdGltZVByb21pc2UgPSBQcm9taXNlLnJlc29sdmUocmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVQcm9taXNlID0gVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXhwZXJpbWVudHMvJHtyZXMuZXhwZXJpbWVudElkfWApLnRoZW4oKGV4cCkgPT4ge1xuICAgICAgICAgIGxldCB0aW1lID0gZXhwLmNvbmZpZ3VyYXRpb24ucmVkdWNlKChhY2MsIHZhbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFjYyArIHZhbC5kdXJhdGlvblxuICAgICAgICAgIH0sIDApO1xuICAgICAgICAgIHJlcy5ydW5UaW1lID0gdGltZTtcbiAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aW1lUHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmVzdWx0LnRyYWNrcy5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgIHRyYWNrLnNhbXBsZXMuZm9yRWFjaCgoc2FtcGxlLCBpbmQpID0+IHtcbiAgICAgICAgICAgIGlmIChpbmQgPT0gMCkge1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWQgPSAwO1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWRYID0gMDtcbiAgICAgICAgICAgICAgc2FtcGxlLnNwZWVkWSA9IDA7XG4gICAgICAgICAgICAgIHNhbXBsZS5hbmdsZVhZID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2FtcGxlLnNwZWVkID0gTWF0aC5zcXJ0KE1hdGgucG93KHNhbXBsZS54IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS54LCAyKSArIE1hdGgucG93KHNhbXBsZS55IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS55LCAyKSkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgICBzYW1wbGUuc3BlZWRYID0gKHNhbXBsZS54IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS54KSAvIChzYW1wbGUudGltZSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0udGltZSk7XG4gICAgICAgICAgICAgIHNhbXBsZS5zcGVlZFkgPSAoc2FtcGxlLnkgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnkpIC8gKHNhbXBsZS50aW1lIC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS50aW1lKTtcbiAgICAgICAgICAgICAgc2FtcGxlLmFuZ2xlWFkgPSBNYXRoLmF0YW4yKChzYW1wbGUueSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueSkgLCAoc2FtcGxlLnggLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLngpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICByZXN1bHQuZnBzID0gcmVzdWx0Lm51bUZyYW1lcyAvIHJlc3VsdC5ydW5UaW1lO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRMaXZlUmVzdWx0cyhleHBJZCkge1xuICAgICAgY29uc3Qgbm90ZUlkID0gVXRpbHMuZ3VpZDQoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICBpZDogbm90ZUlkLFxuICAgICAgICBleHBpcmVMYWJlbDogbnVsbCxcbiAgICAgICAgbWVzc2FnZTogXCJMb2FkaW5nIGxpdmUgcmVzdWx0c1wiXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICB7IGV4cGVyaW1lbnRJZDogZXhwSWQgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBicHVfYXBpX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgIG5lcTogbnVsbFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVSZXN1bHRzKHJlc3VsdHNbMF0pO1xuICAgICAgfSkudGhlbigobm9ybWFsaXplZCkgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLlJlbW92ZScsIHtcbiAgICAgICAgICBub3RlSWQ6IG5vdGVJZFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldE1vZGVsUmVzdWx0cyhleHBJZCwgbW9kZWwsIHJlbG9hZCA9IGZhbHNlKSB7XG4gICAgICBsZXQgbm90ZUlkO1xuICAgICAgaWYgKCFyZWxvYWQpIHtcbiAgICAgICAgbm90ZUlkID0gVXRpbHMuZ3VpZDQoKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IG5vdGVJZCxcbiAgICAgICAgICBleHBpcmVMYWJlbDogbnVsbCxcbiAgICAgICAgICBtZXNzYWdlOiBcIkxvYWRpbmcgbW9kZWwgcmVzdWx0c1wiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL1Jlc3VsdHNgLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgIGFuZDogW1xuICAgICAgICAgICAgICAgIHsgZXhwZXJpbWVudElkOiBleHBJZCB9LFxuICAgICAgICAgICAgICAgIHsgZXVnbGVuYU1vZGVsSWQ6IG1vZGVsLmlkIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0c1swXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZVJlc3VsdHMoe1xuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBleHBJZCxcbiAgICAgICAgICAgIGV1Z2xlbmFNb2RlbElkOiBtb2RlbC5pZCxcbiAgICAgICAgICAgIGNvdW50OiBtb2RlbC5jb25maWd1cmF0aW9uLmNvdW50LFxuICAgICAgICAgICAgbWFnbmlmaWNhdGlvbjogR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50UmVzdWx0cy5tYWduaWZpY2F0aW9uJylcbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE1vZGVsUmVzdWx0cyhleHBJZCwgbW9kZWwsIHRydWUpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVSZXN1bHRzKHJlc3VsdCk7XG4gICAgICB9KS50aGVuKChub3JtYWxpemVkKSA9PiB7XG4gICAgICAgIGlmIChub3RlSWQpIHtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLlJlbW92ZScsIHtcbiAgICAgICAgICAgIG5vdGVJZDogbm90ZUlkXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdlbmVyYXRlUmVzdWx0cyhjb25mKSB7XG4gICAgICBpZiAoIWNvbmYuYnB1X2FwaV9pZCkge1xuICAgICAgICBjb25mLmZwcyA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwuc2ltdWxhdGlvbkZwcycpO1xuICAgICAgICBjb25mLmluaXRpYWxpemF0aW9uID0gdGhpcy5pbml0aWFsaXplTW9kZWxFdWdsZW5hKGNvbmYuY291bnQsIGNvbmYubWFnbmlmaWNhdGlvbik7XG4gICAgICAgIGRlbGV0ZSBjb25mLmNvdW50O1xuICAgICAgICBkZWxldGUgY29uZi5tYWduaWZpY2F0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL1Jlc3VsdHMnLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShjb25mKSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBpbml0aWFsaXplTW9kZWxFdWdsZW5hKGNvdW50LCBtYWduaWZpY2F0aW9uKSB7XG4gICAgICBjb25zdCBpbml0aWFsaXplID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgaW5pdGlhbGl6ZS5wdXNoKHtcbiAgICAgICAgICB4OiAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIDY0MCAvICgyICogbWFnbmlmaWNhdGlvbiksXG4gICAgICAgICAgeTogKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiA0ODAgLyAoMiAqIG1hZ25pZmljYXRpb24pLFxuICAgICAgICAgIHo6IDAsXG4gICAgICAgICAgeWF3OiBNYXRoLnJhbmRvbSgpICogVXRpbHMuVEFVLFxuICAgICAgICAgIHJvbGw6IE1hdGgucmFuZG9tKCkgKiBVdGlscy5UQVUsXG4gICAgICAgICAgcGl0Y2g6IDBcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbml0aWFsaXplO1xuICAgIH1cblxuICAgIGV4cGVyaW1lbnRNYXRjaChhLGIpIHtcbiAgICAgIGlmIChhLmNvbmZpZ3VyYXRpb24ubGVuZ3RoICE9IGIuY29uZmlndXJhdGlvbi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAobGV0IGluZCA9IDA7IGluZCA8IGEuY29uZmlndXJhdGlvbi5sZW5ndGg7IGluZCsrKSB7XG4gICAgICAgIGxldCBsaWdodENvbmYgPSBhLmNvbmZpZ3VyYXRpb25baW5kXTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGxpZ2h0Q29uZikge1xuICAgICAgICAgIGlmIChsaWdodENvbmZba2V5XSAhPT0gYi5jb25maWd1cmF0aW9uW2luZF1ba2V5XSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ldyBFdWdsZW5hVXRpbHM7XG59KVxuIl19
