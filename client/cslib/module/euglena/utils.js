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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJFdWdsZW5hVXRpbHMiLCJsaWdodHMiLCJ0aW1lIiwib3B0cyIsImJsb2NrVGltZSIsImxpZ2h0IiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJibG9jayIsImZvckVhY2giLCJrZXkiLCJhbmdsZSIsIk1hdGgiLCJhdGFuMiIsImludGVuc2l0eSIsInNxcnQiLCJwb3ciLCJyZXMiLCJydW5UaW1lIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJjb25maWd1cmF0aW9uIiwidHJhY2tzIiwidHJhY2siLCJzYW1wbGVzIiwic2FtcGxlIiwiaW5kIiwic3BlZWQiLCJzcGVlZFgiLCJzcGVlZFkiLCJhbmdsZVhZIiwicmFuZG9tIiwiUEkiLCJ4IiwieSIsImZwcyIsIm51bUZyYW1lcyIsImV4cElkIiwicHJvbWlzZUFqYXgiLCJmaWx0ZXIiLCJ3aGVyZSIsImFuZCIsImV4cGVyaW1lbnRJZCIsImJwdV9hcGlfaWQiLCJuZXEiLCJjb250ZW50VHlwZSIsInRoZW4iLCJyZXN1bHRzIiwibm9ybWFsaXplUmVzdWx0cyIsIm1vZGVsIiwiZXVnbGVuYU1vZGVsSWQiLCJpZCIsImxlbmd0aCIsImdlbmVyYXRlUmVzdWx0cyIsImNvdW50IiwibWFnbmlmaWNhdGlvbiIsImdldCIsImdldE1vZGVsUmVzdWx0cyIsInJlc3VsdCIsImNvbmYiLCJpbml0aWFsaXphdGlvbiIsImluaXRpYWxpemVNb2RlbEV1Z2xlbmEiLCJtZXRob2QiLCJKU09OIiwic3RyaW5naWZ5IiwiaW5pdGlhbGl6ZSIsImkiLCJwdXNoIiwieiIsInlhdyIsIlRBVSIsInJvbGwiLCJwaXRjaCIsImEiLCJiIiwibGlnaHRDb25mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFE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O0FBR2RhLGVBQUcsQ0FIVztBQUlkQyxpQkFBSzFELEtBQUtvQixNQUFMLEtBQWdCeEMsTUFBTStFLEdBSmI7QUFLZEMsa0JBQU01RCxLQUFLb0IsTUFBTCxLQUFnQnhDLE1BQU0rRSxHQUxkO0FBTWRFLG1CQUFPO0FBTk8sV0FBaEI7QUFRRDtBQUNELGVBQU9QLFVBQVA7QUFDRDtBQXhJZTtBQUFBO0FBQUEsc0NBMElBUSxDQTFJQSxFQTBJRUMsQ0ExSUYsRUEwSUs7QUFDbkIsWUFBSUQsRUFBRXBELGFBQUYsQ0FBZ0IrQixNQUFoQixJQUEwQnNCLEVBQUVyRCxhQUFGLENBQWdCK0IsTUFBOUMsRUFBc0QsT0FBTyxLQUFQO0FBQ3RELGFBQUssSUFBSTFCLE1BQU0sQ0FBZixFQUFrQkEsTUFBTStDLEVBQUVwRCxhQUFGLENBQWdCK0IsTUFBeEMsRUFBZ0QxQixLQUFoRCxFQUF1RDtBQUNyRCxjQUFJaUQsWUFBWUYsRUFBRXBELGFBQUYsQ0FBZ0JLLEdBQWhCLENBQWhCO0FBQ0EsZUFBSyxJQUFJakIsR0FBVCxJQUFnQmtFLFNBQWhCLEVBQTJCO0FBQ3pCLGdCQUFJQSxVQUFVbEUsR0FBVixNQUFtQmlFLEVBQUVyRCxhQUFGLENBQWdCSyxHQUFoQixFQUFxQmpCLEdBQXJCLENBQXZCLEVBQWtELE9BQU8sS0FBUDtBQUNuRDtBQUNGO0FBQ0QsZUFBTyxJQUFQO0FBQ0Q7QUFuSmU7O0FBQUE7QUFBQTs7QUFxSmxCLFNBQU8sSUFBSWhCLFlBQUosRUFBUDtBQUNELENBdEpEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIGNsYXNzIEV1Z2xlbmFVdGlscyB7XG4gICAgZ2V0TGlnaHRTdGF0ZShsaWdodHMsIHRpbWUsIG9wdHMgPSB7fSkge1xuICAgICAgbGV0IGJsb2NrVGltZSA9IDA7XG4gICAgICBsZXQgbGlnaHQgPSB7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMFxuICAgICAgfTtcbiAgICAgIGlmICh0aW1lIDw9IGxpZ2h0cy5yZWR1Y2UoKGFjYywgdmFsKSA9PiBhY2MgKyB2YWwuZHVyYXRpb24sIDApKSB7XG4gICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2YgbGlnaHRzKSB7XG4gICAgICAgICAgWyd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGxpZ2h0W2tleV0gPSBibG9ja1trZXldO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHRpbWUgPT0gMCB8fCAodGltZSA+IGJsb2NrVGltZSAmJiB0aW1lIDw9IGJsb2NrVGltZSArIGJsb2NrLmR1cmF0aW9uKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJsb2NrVGltZSArPSBibG9jay5kdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9wdHMuYW5nbGUpIHtcbiAgICAgICAgbGlnaHQuYW5nbGUgPSBNYXRoLmF0YW4yKGxpZ2h0LmJvdHRvbSAtIGxpZ2h0LnRvcCwgbGlnaHQubGVmdCAtIGxpZ2h0LnJpZ2h0KVxuICAgICAgfVxuICAgICAgaWYgKG9wdHMuaW50ZW5zaXR5KSB7XG4gICAgICAgIGxpZ2h0LmludGVuc2l0eSA9IE1hdGguc3FydChNYXRoLnBvdyhsaWdodC5ib3R0b20gLSBsaWdodC50b3AsIDIpICsgTWF0aC5wb3cobGlnaHQubGVmdCAtIGxpZ2h0LnJpZ2h0LCAyKSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaWdodDtcbiAgICB9XG5cbiAgICBub3JtYWxpemVSZXN1bHRzKHJlcykge1xuICAgICAgcmVzLnJ1blRpbWUgPSByZXMucnVuVGltZSB8fCBldnQuZGF0YS5leHBlcmltZW50LmNvbmZpZ3VyYXRpb24ucmVkdWNlKChhY2MsIHZhbCkgPT4ge1xuICAgICAgICByZXR1cm4gYWNjICsgdmFsLmR1cmF0aW9uXG4gICAgICB9LCAwKTtcbiAgICAgIHJlcy50cmFja3MuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgdHJhY2suc2FtcGxlcy5mb3JFYWNoKChzYW1wbGUsIGluZCkgPT4ge1xuICAgICAgICAgIGlmIChpbmQgPT0gMCkge1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkID0gMDtcbiAgICAgICAgICAgIHNhbXBsZS5zcGVlZFggPSAwO1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkWSA9IDA7XG4gICAgICAgICAgICBzYW1wbGUuYW5nbGVYWSA9IE1hdGgucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkID0gTWF0aC5zcXJ0KE1hdGgucG93KHNhbXBsZS54IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS54LCAyKSArIE1hdGgucG93KHNhbXBsZS55IC0gdHJhY2suc2FtcGxlc1tpbmQgLSAxXS55LCAyKSkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkWCA9IChzYW1wbGUueCAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueCkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgc2FtcGxlLnNwZWVkWSA9IChzYW1wbGUueSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueSkgLyAoc2FtcGxlLnRpbWUgLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLnRpbWUpO1xuICAgICAgICAgICAgc2FtcGxlLmFuZ2xlWFkgPSBNYXRoLmF0YW4yKChzYW1wbGUueSAtIHRyYWNrLnNhbXBsZXNbaW5kIC0gMV0ueSkgLCAoc2FtcGxlLnggLSB0cmFjay5zYW1wbGVzW2luZCAtIDFdLngpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgcmVzLmZwcyA9IHJlcy5udW1GcmFtZXMgLyByZXMucnVuVGltZTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZ2V0TGl2ZVJlc3VsdHMoZXhwSWQpIHtcbiAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICB7IGV4cGVyaW1lbnRJZDogZXhwSWQgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBicHVfYXBpX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgIG5lcTogbnVsbFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVSZXN1bHRzKHJlc3VsdHNbMF0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0TW9kZWxSZXN1bHRzKGV4cElkLCBtb2RlbCkge1xuICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL1Jlc3VsdHNgLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgIGFuZDogW1xuICAgICAgICAgICAgICAgIHsgZXhwZXJpbWVudElkOiBleHBJZCB9LFxuICAgICAgICAgICAgICAgIHsgZXVnbGVuYU1vZGVsSWQ6IG1vZGVsLmlkIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0c1swXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZVJlc3VsdHMoe1xuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBleHBJZCxcbiAgICAgICAgICAgIGV1Z2xlbmFNb2RlbElkOiBtb2RlbC5pZCxcbiAgICAgICAgICAgIGNvdW50OiBtb2RlbC5jb25maWd1cmF0aW9uLmNvdW50LFxuICAgICAgICAgICAgbWFnbmlmaWNhdGlvbjogR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50UmVzdWx0cy5tYWduaWZpY2F0aW9uJylcbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE1vZGVsUmVzdWx0cyhleHBJZCwgbW9kZWwpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVSZXN1bHRzKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVJlc3VsdHMoY29uZikge1xuICAgICAgaWYgKCFjb25mLmJwdV9hcGlfaWQpIHtcbiAgICAgICAgY29uZi5mcHMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnNpbXVsYXRpb25GcHMnKTtcbiAgICAgICAgY29uZi5pbml0aWFsaXphdGlvbiA9IHRoaXMuaW5pdGlhbGl6ZU1vZGVsRXVnbGVuYShjb25mLmNvdW50LCBjb25mLm1hZ25pZmljYXRpb24pO1xuICAgICAgICBkZWxldGUgY29uZi5jb3VudDtcbiAgICAgICAgZGVsZXRlIGNvbmYubWFnbmlmaWNhdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9SZXN1bHRzJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoY29uZiksXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZU1vZGVsRXVnbGVuYShjb3VudCwgbWFnbmlmaWNhdGlvbikge1xuICAgICAgY29uc3QgaW5pdGlhbGl6ZSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIGluaXRpYWxpemUucHVzaCh7XG4gICAgICAgICAgeDogKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiA2NDAgLyAoMiAqIG1hZ25pZmljYXRpb24pLFxuICAgICAgICAgIHk6IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogNDgwIC8gKDIgKiBtYWduaWZpY2F0aW9uKSxcbiAgICAgICAgICB6OiAwLFxuICAgICAgICAgIHlhdzogTWF0aC5yYW5kb20oKSAqIFV0aWxzLlRBVSxcbiAgICAgICAgICByb2xsOiBNYXRoLnJhbmRvbSgpICogVXRpbHMuVEFVLFxuICAgICAgICAgIHBpdGNoOiAwXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gaW5pdGlhbGl6ZTtcbiAgICB9XG5cbiAgICBleHBlcmltZW50TWF0Y2goYSxiKSB7XG4gICAgICBpZiAoYS5jb25maWd1cmF0aW9uLmxlbmd0aCAhPSBiLmNvbmZpZ3VyYXRpb24ubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICBmb3IgKGxldCBpbmQgPSAwOyBpbmQgPCBhLmNvbmZpZ3VyYXRpb24ubGVuZ3RoOyBpbmQrKykge1xuICAgICAgICBsZXQgbGlnaHRDb25mID0gYS5jb25maWd1cmF0aW9uW2luZF07XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBsaWdodENvbmYpIHtcbiAgICAgICAgICBpZiAobGlnaHRDb25mW2tleV0gIT09IGIuY29uZmlndXJhdGlvbltpbmRdW2tleV0pIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgRXVnbGVuYVV0aWxzO1xufSlcbiJdfQ==
