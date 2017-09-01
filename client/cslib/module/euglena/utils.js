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
        res.runTime = res.runTime || evt.data.experiment.configuration.reduce(function (acc, val) {
          return acc + val.duration;
        }, 0);
        res.tracks.forEach(function (track) {
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
        res.fps = res.numFrames / res.runTime;
        return res;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJFdWdsZW5hVXRpbHMiLCJsaWdodHMiLCJ0aW1lIiwib3B0cyIsImJsb2NrVGltZSIsImxpZ2h0IiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJibG9jayIsImZvckVhY2giLCJrZXkiLCJhbmdsZSIsIk1hdGgiLCJhdGFuMiIsImludGVuc2l0eSIsInNxcnQiLCJwb3ciLCJyZXMiLCJydW5UaW1lIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJjb25maWd1cmF0aW9uIiwidHJhY2tzIiwidHJhY2siLCJzYW1wbGVzIiwic2FtcGxlIiwiaW5kIiwic3BlZWQiLCJzcGVlZFgiLCJzcGVlZFkiLCJhbmdsZVhZIiwicmFuZG9tIiwiUEkiLCJ4IiwieSIsImZwcyIsIm51bUZyYW1lcyIsImV4cElkIiwibm90ZUlkIiwiZ3VpZDQiLCJnZXQiLCJkaXNwYXRjaEV2ZW50IiwiaWQiLCJleHBpcmVMYWJlbCIsIm1lc3NhZ2UiLCJwcm9taXNlQWpheCIsImZpbHRlciIsIndoZXJlIiwiYW5kIiwiZXhwZXJpbWVudElkIiwiYnB1X2FwaV9pZCIsIm5lcSIsImNvbnRlbnRUeXBlIiwidGhlbiIsInJlc3VsdHMiLCJub3JtYWxpemVSZXN1bHRzIiwibm9ybWFsaXplZCIsIm1vZGVsIiwicmVsb2FkIiwiZXVnbGVuYU1vZGVsSWQiLCJsZW5ndGgiLCJnZW5lcmF0ZVJlc3VsdHMiLCJjb3VudCIsIm1hZ25pZmljYXRpb24iLCJnZXRNb2RlbFJlc3VsdHMiLCJyZXN1bHQiLCJjb25mIiwiaW5pdGlhbGl6YXRpb24iLCJpbml0aWFsaXplTW9kZWxFdWdsZW5hIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImluaXRpYWxpemUiLCJpIiwicHVzaCIsInoiLCJ5YXciLCJU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a0JBQU1uRSxLQUFLb0IsTUFBTCxLQUFnQnhDLE1BQU1zRixHQUxkO0FBTWRFLG1CQUFPO0FBTk8sV0FBaEI7QUFRRDtBQUNELGVBQU9QLFVBQVA7QUFDRDtBQW5LZTtBQUFBO0FBQUEsc0NBcUtBUSxDQXJLQSxFQXFLRUMsQ0FyS0YsRUFxS0s7QUFDbkIsWUFBSUQsRUFBRTNELGFBQUYsQ0FBZ0J1QyxNQUFoQixJQUEwQnFCLEVBQUU1RCxhQUFGLENBQWdCdUMsTUFBOUMsRUFBc0QsT0FBTyxLQUFQO0FBQ3RELGFBQUssSUFBSWxDLE1BQU0sQ0FBZixFQUFrQkEsTUFBTXNELEVBQUUzRCxhQUFGLENBQWdCdUMsTUFBeEMsRUFBZ0RsQyxLQUFoRCxFQUF1RDtBQUNyRCxjQUFJd0QsWUFBWUYsRUFBRTNELGFBQUYsQ0FBZ0JLLEdBQWhCLENBQWhCO0FBQ0EsZUFBSyxJQUFJakIsR0FBVCxJQUFnQnlFLFNBQWhCLEVBQTJCO0FBQ3pCLGdCQUFJQSxVQUFVekUsR0FBVixNQUFtQndFLEVBQUU1RCxhQUFGLENBQWdCSyxHQUFoQixFQUFxQmpCLEdBQXJCLENBQXZCLEVBQWtELE9BQU8sS0FBUDtBQUNuRDtBQUNGO0FBQ0QsZUFBTyxJQUFQO0FBQ0Q7QUE5S2U7O0FBQUE7QUFBQTs7QUFnTGxCLFNBQU8sSUFBSWhCLFlBQUosRUFBUDtBQUNELENBakxEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIGNsYXNzIEV1Z2xlbmFVdGlscyB7XG4gICAgZ2V0TGlnaHRTdGF0ZShsaWdodHMsIHRpbWUsIG9wdHMgPSB7fSkge1xuICAgICAgbGV0IGJsb2NrVGltZSA9IDA7XG4gICAgICBsZXQgbGlnaHQgPSB7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMFxuICAgICAgfTtcbiAgICAgIGlmICh0aW1lIDw9IGxpZ2h0cy5yZWR1Y2UoKGFjYywgdmFsKSA9PiBhY2MgKyB2YWwuZHVyYXRpb24sIDApKSB7XG4gICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2YgbGlnaHRzKSB7XG4gICAgICAgICAgWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGxpZ2h0W2tleV0gPSBibG9ja1trZXldO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHRpbWUgPT0gMCB8fCAodGltZSA+IGJsb2NrVGltZSAmJiB0aW1lIDw9IGJsb2NrVGltZSArIGJsb2NrLmR1cmF0aW9uKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJsb2NrVGltZSArPSBibG9jay5kdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9wdHMuYW5nbGUpIHtcbiAgICAgICAgbGlnaHQuYW5nbGUgPSBNYXRoLmF0YW4yKGxpZ2h0LmJvdHRvbSAtIGxpZ2h0LnRvcCwgbGlnaHQubGVmdCAtIGxpZ2h0LnJpZ2h0KVxuICAgICAgfVxuICAgICAgaWYgKG9wdHMuaW50ZW5zaXR5KSB7XG4gICAgICAgIGxpZ2h0LmludGVuc2l0eSA9IE1hdGguc3FydChNYXRoLnBvdyhsaWdodC5ib3R0b20gLSBsaWdodC50b3AsIDIpICsgTWF0aC5wb3cobGlnaHQubGVmdCAtIGxpZ2h0LnJpZ2h0LCAyKSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaWdodDtcbiAgICB9XG5cbiAgICBub3JtYWxpemVSZXN1bHRzKHJlcykge1xuICAgICAgcmVzLnJ1blRpbWUgPSByZXMucnVuVGltZSB8fCBldnQuZGF0YS5leHBlcmltZW50LmNvbmZpZ3VyYXRpb24ucmVkdWNlKChhY2MsIHZhbCkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjICsgdmFsLmR1cmF0aW9uXG4gICAgICB9LCAwKTtcbiAgICAgIHJlcy50cmFja3MuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgdHJhY2suc2FtcGxlcy5mb3JFYWNoKChzYW1wbGUsIGluZCkgPT4ge1xuICAgICAgICAgIGlmIChpbmQgPT0gMCkge1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkID0gMDtcbiAgICAgICAgICAgIHNhbXBsZS5zcGVlZFggPSAwO1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkWSA9IDA7XG4gICAgICAgICAgICBzYW1wbGUuYW5nbGVYWSA9IE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkID0gTWF0aC5zcXJ0KE1hdGgucG93KHNhbXBsZS54IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS54LCAyKSArIE1hdGgucG93KHNhbXBsZS55IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS55LCAyKSkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkWCA9IChzYW1wbGUueCAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueCkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkWSA9IChzYW1wbGUueSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueSkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgc2FtcGxlLmFuZ2xlWFkgPSBNYXRoLmF0YW4yKChzYW1wbGUueSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueSkgLCAoc2FtcGxlLnggLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLngpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgcmVzLmZwcyA9IHJlcy5udW1GcmFtZXMgLyByZXMucnVuVGltZTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZ2V0TGl2ZVJlc3VsdHMoZXhwSWQpIHtcbiAgICAgIGNvbnN0IG5vdGVJZCA9IFV0aWxzLmd1aWQ0KCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgaWQ6IG5vdGVJZCxcbiAgICAgICAgZXhwaXJlTGFiZWw6IG51bGwsXG4gICAgICAgIG1lc3NhZ2U6IFwiTG9hZGluZyBsaXZlIHJlc3VsdHNcIlxuICAgICAgfSk7XG4gICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvUmVzdWx0c2AsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgYW5kOiBbXG4gICAgICAgICAgICAgICAgeyBleHBlcmltZW50SWQ6IGV4cElkIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgYnB1X2FwaV9pZDoge1xuICAgICAgICAgICAgICAgICAgICBuZXE6IG51bGxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0pLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplUmVzdWx0cyhyZXN1bHRzWzBdKTtcbiAgICAgIH0pLnRoZW4oKG5vcm1hbGl6ZWQpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5SZW1vdmUnLCB7XG4gICAgICAgICAgbm90ZUlkOiBub3RlSWRcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRNb2RlbFJlc3VsdHMoZXhwSWQsIG1vZGVsLCByZWxvYWQgPSBmYWxzZSkge1xuICAgICAgbGV0IG5vdGVJZDtcbiAgICAgIGlmICghcmVsb2FkKSB7XG4gICAgICAgIG5vdGVJZCA9IFV0aWxzLmd1aWQ0KCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgIGlkOiBub3RlSWQsXG4gICAgICAgICAgZXhwaXJlTGFiZWw6IG51bGwsXG4gICAgICAgICAgbWVzc2FnZTogXCJMb2FkaW5nIG1vZGVsIHJlc3VsdHNcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICB7IGV4cGVyaW1lbnRJZDogZXhwSWQgfSxcbiAgICAgICAgICAgICAgICB7IGV1Z2xlbmFNb2RlbElkOiBtb2RlbC5pZCB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0pLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVSZXN1bHRzKHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogZXhwSWQsXG4gICAgICAgICAgICBldWdsZW5hTW9kZWxJZDogbW9kZWwuaWQsXG4gICAgICAgICAgICBjb3VudDogbW9kZWwuY29uZmlndXJhdGlvbi5jb3VudCxcbiAgICAgICAgICAgIG1hZ25pZmljYXRpb246IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMubWFnbmlmaWNhdGlvbicpXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRNb2RlbFJlc3VsdHMoZXhwSWQsIG1vZGVsLCB0cnVlKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplUmVzdWx0cyhyZXN1bHQpO1xuICAgICAgfSkudGhlbigobm9ybWFsaXplZCkgPT4ge1xuICAgICAgICBpZiAobm90ZUlkKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5SZW1vdmUnLCB7XG4gICAgICAgICAgICBub3RlSWQ6IG5vdGVJZFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVJlc3VsdHMoY29uZikge1xuICAgICAgaWYgKCFjb25mLmJwdV9hcGlfaWQpIHtcbiAgICAgICAgY29uZi5mcHMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnNpbXVsYXRpb25GcHMnKTtcbiAgICAgICAgY29uZi5pbml0aWFsaXphdGlvbiA9IHRoaXMuaW5pdGlhbGl6ZU1vZGVsRXVnbGVuYShjb25mLmNvdW50LCBjb25mLm1hZ25pZmljYXRpb24pO1xuICAgICAgICBkZWxldGUgY29uZi5jb3VudDtcbiAgICAgICAgZGVsZXRlIGNvbmYubWFnbmlmaWNhdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9SZXN1bHRzJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoY29uZiksXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZU1vZGVsRXVnbGVuYShjb3VudCwgbWFnbmlmaWNhdGlvbikge1xuICAgICAgY29uc3QgaW5pdGlhbGl6ZSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIGluaXRpYWxpemUucHVzaCh7XG4gICAgICAgICAgeDogKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiA2NDAgLyAoMiAqIG1hZ25pZmljYXRpb24pLFxuICAgICAgICAgIHk6IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogNDgwIC8gKDIgKiBtYWduaWZpY2F0aW9uKSxcbiAgICAgICAgICB6OiAwLFxuICAgICAgICAgIHlhdzogTWF0aC5yYW5kb20oKSAqIFV0aWxzLlRBVSxcbiAgICAgICAgICByb2xsOiBNYXRoLnJhbmRvbSgpICogVXRpbHMuVEFVLFxuICAgICAgICAgIHBpdGNoOiAwXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gaW5pdGlhbGl6ZTtcbiAgICB9XG5cbiAgICBleHBlcmltZW50TWF0Y2goYSxiKSB7XG4gICAgICBpZiAoYS5jb25maWd1cmF0aW9uLmxlbmd0aCAhPSBiLmNvbmZpZ3VyYXRpb24ubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICBmb3IgKGxldCBpbmQgPSAwOyBpbmQgPCBhLmNvbmZpZ3VyYXRpb24ubGVuZ3RoOyBpbmQrKykge1xuICAgICAgICBsZXQgbGlnaHRDb25mID0gYS5jb25maWd1cmF0aW9uW2luZF07XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBsaWdodENvbmYpIHtcbiAgICAgICAgICBpZiAobGlnaHRDb25mW2tleV0gIT09IGIuY29uZmlndXJhdGlvbltpbmRdW2tleV0pIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgRXVnbGVuYVV0aWxzO1xufSlcbiJdfQ==
