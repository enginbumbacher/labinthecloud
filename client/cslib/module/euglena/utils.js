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
        if (reload) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJFdWdsZW5hVXRpbHMiLCJsaWdodHMiLCJ0aW1lIiwib3B0cyIsImJsb2NrVGltZSIsImxpZ2h0IiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJibG9jayIsImZvckVhY2giLCJrZXkiLCJhbmdsZSIsIk1hdGgiLCJhdGFuMiIsImludGVuc2l0eSIsInNxcnQiLCJwb3ciLCJyZXMiLCJydW5UaW1lIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJjb25maWd1cmF0aW9uIiwidHJhY2tzIiwidHJhY2siLCJzYW1wbGVzIiwic2FtcGxlIiwiaW5kIiwic3BlZWQiLCJzcGVlZFgiLCJzcGVlZFkiLCJhbmdsZVhZIiwicmFuZG9tIiwiUEkiLCJ4IiwieSIsImZwcyIsIm51bUZyYW1lcyIsImV4cElkIiwibm90ZUlkIiwiZ3VpZDQiLCJnZXQiLCJkaXNwYXRjaEV2ZW50IiwiaWQiLCJleHBpcmVMYWJlbCIsIm1lc3NhZ2UiLCJwcm9taXNlQWpheCIsImZpbHRlciIsIndoZXJlIiwiYW5kIiwiZXhwZXJpbWVudElkIiwiYnB1X2FwaV9pZCIsIm5lcSIsImNvbnRlbnRUeXBlIiwidGhlbiIsInJlc3VsdHMiLCJub3JtYWxpemVSZXN1bHRzIiwibm9ybWFsaXplZCIsIm1vZGVsIiwicmVsb2FkIiwiZXVnbGVuYU1vZGVsSWQiLCJsZW5ndGgiLCJnZW5lcmF0ZVJlc3VsdHMiLCJjb3VudCIsIm1hZ25pZmljYXRpb24iLCJnZXRNb2RlbFJlc3VsdHMiLCJyZXN1bHQiLCJjb25mIiwiaW5pdGlhbGl6YXRpb24iLCJpbml0aWFsaXplTW9kZWxFdWdsZW5hIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImluaXRpYWxpemUiLCJpIiwicHVzaCIsInoiLCJ5YXciLCJU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bkUsS0FBS29CLE1BQUwsS0FBZ0J4QyxNQUFNc0YsR0FMZDtBQU1kRSxtQkFBTztBQU5PLFdBQWhCO0FBUUQ7QUFDRCxlQUFPUCxVQUFQO0FBQ0Q7QUFuS2U7QUFBQTtBQUFBLHNDQXFLQVEsQ0FyS0EsRUFxS0VDLENBcktGLEVBcUtLO0FBQ25CLFlBQUlELEVBQUUzRCxhQUFGLENBQWdCdUMsTUFBaEIsSUFBMEJxQixFQUFFNUQsYUFBRixDQUFnQnVDLE1BQTlDLEVBQXNELE9BQU8sS0FBUDtBQUN0RCxhQUFLLElBQUlsQyxNQUFNLENBQWYsRUFBa0JBLE1BQU1zRCxFQUFFM0QsYUFBRixDQUFnQnVDLE1BQXhDLEVBQWdEbEMsS0FBaEQsRUFBdUQ7QUFDckQsY0FBSXdELFlBQVlGLEVBQUUzRCxhQUFGLENBQWdCSyxHQUFoQixDQUFoQjtBQUNBLGVBQUssSUFBSWpCLEdBQVQsSUFBZ0J5RSxTQUFoQixFQUEyQjtBQUN6QixnQkFBSUEsVUFBVXpFLEdBQVYsTUFBbUJ3RSxFQUFFNUQsYUFBRixDQUFnQkssR0FBaEIsRUFBcUJqQixHQUFyQixDQUF2QixFQUFrRCxPQUFPLEtBQVA7QUFDbkQ7QUFDRjtBQUNELGVBQU8sSUFBUDtBQUNEO0FBOUtlOztBQUFBO0FBQUE7O0FBZ0xsQixTQUFPLElBQUloQixZQUFKLEVBQVA7QUFDRCxDQWpMRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcblxuICBjbGFzcyBFdWdsZW5hVXRpbHMge1xuICAgIGdldExpZ2h0U3RhdGUobGlnaHRzLCB0aW1lLCBvcHRzID0ge30pIHtcbiAgICAgIGxldCBibG9ja1RpbWUgPSAwO1xuICAgICAgbGV0IGxpZ2h0ID0ge1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICAgIGxlZnQ6IDBcbiAgICAgIH07XG4gICAgICBpZiAodGltZSA8PSBsaWdodHMucmVkdWNlKChhY2MsIHZhbCkgPT4gYWNjICsgdmFsLmR1cmF0aW9uLCAwKSkge1xuICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIGxpZ2h0cykge1xuICAgICAgICAgIFsndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBsaWdodFtrZXldID0gYmxvY2tba2V5XTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICh0aW1lID09IDAgfHwgKHRpbWUgPiBibG9ja1RpbWUgJiYgdGltZSA8PSBibG9ja1RpbWUgKyBibG9jay5kdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBibG9ja1RpbWUgKz0gYmxvY2suZHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvcHRzLmFuZ2xlKSB7XG4gICAgICAgIGxpZ2h0LmFuZ2xlID0gTWF0aC5hdGFuMihsaWdodC5ib3R0b20gLSBsaWdodC50b3AsIGxpZ2h0LmxlZnQgLSBsaWdodC5yaWdodClcbiAgICAgIH1cbiAgICAgIGlmIChvcHRzLmludGVuc2l0eSkge1xuICAgICAgICBsaWdodC5pbnRlbnNpdHkgPSBNYXRoLnNxcnQoTWF0aC5wb3cobGlnaHQuYm90dG9tIC0gbGlnaHQudG9wLCAyKSArIE1hdGgucG93KGxpZ2h0LmxlZnQgLSBsaWdodC5yaWdodCwgMikpXG4gICAgICB9XG4gICAgICByZXR1cm4gbGlnaHQ7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplUmVzdWx0cyhyZXMpIHtcbiAgICAgIHJlcy5ydW5UaW1lID0gcmVzLnJ1blRpbWUgfHwgZXZ0LmRhdGEuZXhwZXJpbWVudC5jb25maWd1cmF0aW9uLnJlZHVjZSgoYWNjLCB2YWwpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjYyArIHZhbC5kdXJhdGlvblxuICAgICAgfSwgMCk7XG4gICAgICByZXMudHJhY2tzLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICAgIHRyYWNrLnNhbXBsZXMuZm9yRWFjaCgoc2FtcGxlLCBpbmQpID0+IHtcbiAgICAgICAgICBpZiAoaW5kID09IDApIHtcbiAgICAgICAgICAgIHNhbXBsZS5zcGVlZCA9IDA7XG4gICAgICAgICAgICBzYW1wbGUuc3BlZWRYID0gMDtcbiAgICAgICAgICAgIHNhbXBsZS5zcGVlZFkgPSAwO1xuICAgICAgICAgICAgc2FtcGxlLmFuZ2xlWFkgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNhbXBsZS5zcGVlZCA9IE1hdGguc3FydChNYXRoLnBvdyhzYW1wbGUueCAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueCwgMikgKyBNYXRoLnBvdyhzYW1wbGUueSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueSwgMikpIC8gKHNhbXBsZS50aW1lIC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS50aW1lKTtcbiAgICAgICAgICAgIHNhbXBsZS5zcGVlZFggPSAoc2FtcGxlLnggLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLngpIC8gKHNhbXBsZS50aW1lIC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS50aW1lKTtcbiAgICAgICAgICAgIHNhbXBsZS5zcGVlZFkgPSAoc2FtcGxlLnkgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnkpIC8gKHNhbXBsZS50aW1lIC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS50aW1lKTtcbiAgICAgICAgICAgIHNhbXBsZS5hbmdsZVhZID0gTWF0aC5hdGFuMigoc2FtcGxlLnkgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnkpICwgKHNhbXBsZS54IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS54KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIHJlcy5mcHMgPSByZXMubnVtRnJhbWVzIC8gcmVzLnJ1blRpbWU7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGdldExpdmVSZXN1bHRzKGV4cElkKSB7XG4gICAgICBjb25zdCBub3RlSWQgPSBVdGlscy5ndWlkNCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgIGlkOiBub3RlSWQsXG4gICAgICAgIGV4cGlyZUxhYmVsOiBudWxsLFxuICAgICAgICBtZXNzYWdlOiBcIkxvYWRpbmcgbGl2ZSByZXN1bHRzXCJcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL1Jlc3VsdHNgLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgIGFuZDogW1xuICAgICAgICAgICAgICAgIHsgZXhwZXJpbWVudElkOiBleHBJZCB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGJwdV9hcGlfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbmVxOiBudWxsXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9KS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZVJlc3VsdHMocmVzdWx0c1swXSk7XG4gICAgICB9KS50aGVuKChub3JtYWxpemVkKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJywge1xuICAgICAgICAgIG5vdGVJZDogbm90ZUlkXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0TW9kZWxSZXN1bHRzKGV4cElkLCBtb2RlbCwgcmVsb2FkID0gZmFsc2UpIHtcbiAgICAgIGxldCBub3RlSWQ7XG4gICAgICBpZiAocmVsb2FkKSB7XG4gICAgICAgIG5vdGVJZCA9IFV0aWxzLmd1aWQ0KCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgIGlkOiBub3RlSWQsXG4gICAgICAgICAgZXhwaXJlTGFiZWw6IG51bGwsXG4gICAgICAgICAgbWVzc2FnZTogXCJMb2FkaW5nIG1vZGVsIHJlc3VsdHNcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICB7IGV4cGVyaW1lbnRJZDogZXhwSWQgfSxcbiAgICAgICAgICAgICAgICB7IGV1Z2xlbmFNb2RlbElkOiBtb2RlbC5pZCB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0pLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVSZXN1bHRzKHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogZXhwSWQsXG4gICAgICAgICAgICBldWdsZW5hTW9kZWxJZDogbW9kZWwuaWQsXG4gICAgICAgICAgICBjb3VudDogbW9kZWwuY29uZmlndXJhdGlvbi5jb3VudCxcbiAgICAgICAgICAgIG1hZ25pZmljYXRpb246IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMubWFnbmlmaWNhdGlvbicpXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRNb2RlbFJlc3VsdHMoZXhwSWQsIG1vZGVsLCB0cnVlKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplUmVzdWx0cyhyZXN1bHQpO1xuICAgICAgfSkudGhlbigobm9ybWFsaXplZCkgPT4ge1xuICAgICAgICBpZiAobm90ZUlkKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5SZW1vdmUnLCB7XG4gICAgICAgICAgICBub3RlSWQ6IG5vdGVJZFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVJlc3VsdHMoY29uZikge1xuICAgICAgaWYgKCFjb25mLmJwdV9hcGlfaWQpIHtcbiAgICAgICAgY29uZi5mcHMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnNpbXVsYXRpb25GcHMnKTtcbiAgICAgICAgY29uZi5pbml0aWFsaXphdGlvbiA9IHRoaXMuaW5pdGlhbGl6ZU1vZGVsRXVnbGVuYShjb25mLmNvdW50LCBjb25mLm1hZ25pZmljYXRpb24pO1xuICAgICAgICBkZWxldGUgY29uZi5jb3VudDtcbiAgICAgICAgZGVsZXRlIGNvbmYubWFnbmlmaWNhdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9SZXN1bHRzJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoY29uZiksXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZU1vZGVsRXVnbGVuYShjb3VudCwgbWFnbmlmaWNhdGlvbikge1xuICAgICAgY29uc3QgaW5pdGlhbGl6ZSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIGluaXRpYWxpemUucHVzaCh7XG4gICAgICAgICAgeDogKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiA2NDAgLyAoMiAqIG1hZ25pZmljYXRpb24pLFxuICAgICAgICAgIHk6IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogNDgwIC8gKDIgKiBtYWduaWZpY2F0aW9uKSxcbiAgICAgICAgICB6OiAwLFxuICAgICAgICAgIHlhdzogTWF0aC5yYW5kb20oKSAqIFV0aWxzLlRBVSxcbiAgICAgICAgICByb2xsOiBNYXRoLnJhbmRvbSgpICogVXRpbHMuVEFVLFxuICAgICAgICAgIHBpdGNoOiAwXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gaW5pdGlhbGl6ZTtcbiAgICB9XG5cbiAgICBleHBlcmltZW50TWF0Y2goYSxiKSB7XG4gICAgICBpZiAoYS5jb25maWd1cmF0aW9uLmxlbmd0aCAhPSBiLmNvbmZpZ3VyYXRpb24ubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICBmb3IgKGxldCBpbmQgPSAwOyBpbmQgPCBhLmNvbmZpZ3VyYXRpb24ubGVuZ3RoOyBpbmQrKykge1xuICAgICAgICBsZXQgbGlnaHRDb25mID0gYS5jb25maWd1cmF0aW9uW2luZF07XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBsaWdodENvbmYpIHtcbiAgICAgICAgICBpZiAobGlnaHRDb25mW2tleV0gIT09IGIuY29uZmlndXJhdGlvbltpbmRdW2tleV0pIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgRXVnbGVuYVV0aWxzO1xufSlcbiJdfQ==
