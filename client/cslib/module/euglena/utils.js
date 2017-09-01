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

        var noteId = Utils.guid4();
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: noteId,
          expireLabel: null,
          message: "Loading model results"
        });
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
        }).then(function (normalized) {
          Globals.get('Relay').dispatchEvent('Notifications.Remove', {
            noteId: noteId
          });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3V0aWxzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJFdWdsZW5hVXRpbHMiLCJsaWdodHMiLCJ0aW1lIiwib3B0cyIsImJsb2NrVGltZSIsImxpZ2h0IiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJibG9jayIsImZvckVhY2giLCJrZXkiLCJhbmdsZSIsIk1hdGgiLCJhdGFuMiIsImludGVuc2l0eSIsInNxcnQiLCJwb3ciLCJyZXMiLCJydW5UaW1lIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJjb25maWd1cmF0aW9uIiwidHJhY2tzIiwidHJhY2siLCJzYW1wbGVzIiwic2FtcGxlIiwiaW5kIiwic3BlZWQiLCJzcGVlZFgiLCJzcGVlZFkiLCJhbmdsZVhZIiwicmFuZG9tIiwiUEkiLCJ4IiwieSIsImZwcyIsIm51bUZyYW1lcyIsImV4cElkIiwibm90ZUlkIiwiZ3VpZDQiLCJnZXQiLCJkaXNwYXRjaEV2ZW50IiwiaWQiLCJleHBpcmVMYWJlbCIsIm1lc3NhZ2UiLCJwcm9taXNlQWpheCIsImZpbHRlciIsIndoZXJlIiwiYW5kIiwiZXhwZXJpbWVudElkIiwiYnB1X2FwaV9pZCIsIm5lcSIsImNvbnRlbnRUeXBlIiwidGhlbiIsInJlc3VsdHMiLCJub3JtYWxpemVSZXN1bHRzIiwibm9ybWFsaXplZCIsIm1vZGVsIiwiZXVnbGVuYU1vZGVsSWQiLCJsZW5ndGgiLCJnZW5lcmF0ZVJlc3VsdHMiLCJjb3VudCIsIm1hZ25pZmljYXRpb24iLCJnZXRNb2RlbFJlc3VsdHMiLCJyZXN1bHQiLCJjb25mIiwiaW5pdGlhbGl6YXRpb24iLCJpbml0aWFsaXplTW9kZWxFdWdsZW5hIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImluaXRpYWxpemUiLCJpIiwicHVzaCIsInoiLCJ5YXciLCJUQVUiLCJyb2xsIiwicGl0Y2giLCJhIiwiYiIsImxpZ2h0Q29uZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjs7QUFEa0IsTUFJWkcsWUFKWTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsb0NBS0ZDLE1BTEUsRUFLTUMsSUFMTixFQUt1QjtBQUFBLFlBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFDckMsWUFBSUMsWUFBWSxDQUFoQjtBQUNBLFlBQUlDLFFBQVE7QUFDVkMsZUFBSyxDQURLO0FBRVZDLGlCQUFPLENBRkc7QUFHVkMsa0JBQVEsQ0FIRTtBQUlWQyxnQkFBTTtBQUpJLFNBQVo7QUFNQSxZQUFJUCxRQUFRRCxPQUFPUyxNQUFQLENBQWMsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOO0FBQUEsaUJBQWNELE1BQU1DLElBQUlDLFFBQXhCO0FBQUEsU0FBZCxFQUFnRCxDQUFoRCxDQUFaLEVBQWdFO0FBQUEscUNBQ25EQyxLQURtRDtBQUU1RCxhQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFFBQWpCLEVBQTJCLE1BQTNCLEVBQW1DQyxPQUFuQyxDQUEyQyxVQUFDQyxHQUFELEVBQVM7QUFDbERYLG9CQUFNVyxHQUFOLElBQWFGLE1BQU1FLEdBQU4sQ0FBYjtBQUNELGFBRkQ7QUFHQSxnQkFBSWQsUUFBUSxDQUFSLElBQWNBLE9BQU9FLFNBQVAsSUFBb0JGLFFBQVFFLFlBQVlVLE1BQU1ELFFBQWhFLEVBQTJFO0FBQ3pFO0FBQ0Q7QUFDRFQseUJBQWFVLE1BQU1ELFFBQW5CO0FBUjREOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUM5RCxpQ0FBb0JaLE1BQXBCLDhIQUE0QjtBQUFBLGtCQUFqQmEsS0FBaUI7O0FBQUEsK0JBQWpCQSxLQUFpQjs7QUFBQSxvQ0FLeEI7QUFHSDtBQVQ2RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVS9EO0FBQ0QsWUFBSVgsS0FBS2MsS0FBVCxFQUFnQjtBQUNkWixnQkFBTVksS0FBTixHQUFjQyxLQUFLQyxLQUFMLENBQVdkLE1BQU1HLE1BQU4sR0FBZUgsTUFBTUMsR0FBaEMsRUFBcUNELE1BQU1JLElBQU4sR0FBYUosTUFBTUUsS0FBeEQsQ0FBZDtBQUNEO0FBQ0QsWUFBSUosS0FBS2lCLFNBQVQsRUFBb0I7QUFDbEJmLGdCQUFNZSxTQUFOLEdBQWtCRixLQUFLRyxJQUFMLENBQVVILEtBQUtJLEdBQUwsQ0FBU2pCLE1BQU1HLE1BQU4sR0FBZUgsTUFBTUMsR0FBOUIsRUFBbUMsQ0FBbkMsSUFBd0NZLEtBQUtJLEdBQUwsQ0FBU2pCLE1BQU1JLElBQU4sR0FBYUosTUFBTUUsS0FBNUIsRUFBbUMsQ0FBbkMsQ0FBbEQsQ0FBbEI7QUFDRDtBQUNELGVBQU9GLEtBQVA7QUFDRDtBQS9CZTtBQUFBO0FBQUEsdUNBaUNDa0IsR0FqQ0QsRUFpQ007QUFDcEJBLFlBQUlDLE9BQUosR0FBY0QsSUFBSUMsT0FBSixJQUFlQyxJQUFJQyxJQUFKLENBQVNDLFVBQVQsQ0FBb0JDLGFBQXBCLENBQWtDbEIsTUFBbEMsQ0FBeUMsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDbEYsaUJBQU9ELE1BQU1DLElBQUlDLFFBQWpCO0FBQ0QsU0FGNEIsRUFFMUIsQ0FGMEIsQ0FBN0I7QUFHQVUsWUFBSU0sTUFBSixDQUFXZCxPQUFYLENBQW1CLFVBQUNlLEtBQUQsRUFBVztBQUM1QkEsZ0JBQU1DLE9BQU4sQ0FBY2hCLE9BQWQsQ0FBc0IsVUFBQ2lCLE1BQUQsRUFBU0MsR0FBVCxFQUFpQjtBQUNyQyxnQkFBSUEsT0FBTyxDQUFYLEVBQWM7QUFDWkQscUJBQU9FLEtBQVAsR0FBZSxDQUFmO0FBQ0FGLHFCQUFPRyxNQUFQLEdBQWdCLENBQWhCO0FBQ0FILHFCQUFPSSxNQUFQLEdBQWdCLENBQWhCO0FBQ0FKLHFCQUFPSyxPQUFQLEdBQWlCbkIsS0FBS29CLE1BQUwsS0FBZ0IsQ0FBaEIsR0FBb0JwQixLQUFLcUIsRUFBMUM7QUFDRCxhQUxELE1BS087QUFDTFAscUJBQU9FLEtBQVAsR0FBZWhCLEtBQUtHLElBQUwsQ0FBVUgsS0FBS0ksR0FBTCxDQUFTVSxPQUFPUSxDQUFQLEdBQVdWLE1BQU1DLE9BQU4sQ0FBY0UsTUFBTSxDQUFwQixFQUF1Qk8sQ0FBM0MsRUFBOEMsQ0FBOUMsSUFBbUR0QixLQUFLSSxHQUFMLENBQVNVLE9BQU9TLENBQVAsR0FBV1gsTUFBTUMsT0FBTixDQUFjRSxNQUFNLENBQXBCLEVBQXVCUSxDQUEzQyxFQUE4QyxDQUE5QyxDQUE3RCxLQUFrSFQsT0FBTzlCLElBQVAsR0FBYzRCLE1BQU1DLE9BQU4sQ0FBY0UsTUFBTSxDQUFwQixFQUF1Qi9CLElBQXZKLENBQWY7QUFDQThCLHFCQUFPRyxNQUFQLEdBQWdCLENBQUNILE9BQU9RLENBQVAsR0FBV1YsTUFBTUMsT0FBTixDQUFjRSxNQUFNLENBQXBCLEVBQXVCTyxDQUFuQyxLQUF5Q1IsT0FBTzlCLElBQVAsR0FBYzRCLE1BQU1DLE9BQU4sQ0FBY0UsTUFBTSxDQUFwQixFQUF1Qi9CLElBQTlFLENBQWhCO0FBQ0E4QixxQkFBT0ksTUFBUCxHQUFnQixDQUFDSixPQUFPUyxDQUFQLEdBQVdYLE1BQU1DLE9BQU4sQ0FBY0UsTUFBTSxDQUFwQixFQUF1QlEsQ0FBbkMsS0FBeUNULE9BQU85QixJQUFQLEdBQWM0QixNQUFNQyxPQUFOLENBQWNFLE1BQU0sQ0FBcEIsRUFBdUIvQixJQUE5RSxDQUFoQjtBQUNBOEIscUJBQU9LLE9BQVAsR0FBaUJuQixLQUFLQyxLQUFMLENBQVlhLE9BQU9TLENBQVAsR0FBV1gsTUFBTUMsT0FBTixDQUFjRSxNQUFNLENBQXBCLEVBQXVCUSxDQUE5QyxFQUFvRFQsT0FBT1EsQ0FBUCxHQUFXVixNQUFNQyxPQUFOLENBQWNFLE1BQU0sQ0FBcEIsRUFBdUJPLENBQXRGLENBQWpCO0FBQ0Q7QUFDRixXQVpEO0FBYUQsU0FkRDtBQWVBakIsWUFBSW1CLEdBQUosR0FBVW5CLElBQUlvQixTQUFKLEdBQWdCcEIsSUFBSUMsT0FBOUI7QUFDQSxlQUFPRCxHQUFQO0FBQ0Q7QUF0RGU7QUFBQTtBQUFBLHFDQXdERHFCLEtBeERDLEVBd0RNO0FBQUE7O0FBQ3BCLFlBQU1DLFNBQVMvQyxNQUFNZ0QsS0FBTixFQUFmO0FBQ0EvQyxnQkFBUWdELEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxhQUFyQixDQUFtQyxtQkFBbkMsRUFBd0Q7QUFDdERDLGNBQUlKLE1BRGtEO0FBRXRESyx1QkFBYSxJQUZ5QztBQUd0REMsbUJBQVM7QUFINkMsU0FBeEQ7QUFLQSxlQUFPckQsTUFBTXNELFdBQU4sb0JBQXFDO0FBQzFDMUIsZ0JBQU07QUFDSjJCLG9CQUFRO0FBQ05DLHFCQUFPO0FBQ0xDLHFCQUFLLENBQ0gsRUFBRUMsY0FBY1osS0FBaEIsRUFERyxFQUVIO0FBQ0VhLDhCQUFZO0FBQ1ZDLHlCQUFLO0FBREs7QUFEZCxpQkFGRztBQURBO0FBREQ7QUFESixXQURvQztBQWUxQ0MsdUJBQWE7QUFmNkIsU0FBckMsRUFnQkpDLElBaEJJLENBZ0JDLFVBQUNDLE9BQUQsRUFBYTtBQUNuQixpQkFBTyxNQUFLQyxnQkFBTCxDQUFzQkQsUUFBUSxDQUFSLENBQXRCLENBQVA7QUFDRCxTQWxCTSxFQWtCSkQsSUFsQkksQ0FrQkMsVUFBQ0csVUFBRCxFQUFnQjtBQUN0QmhFLGtCQUFRZ0QsR0FBUixDQUFZLE9BQVosRUFBcUJDLGFBQXJCLENBQW1DLHNCQUFuQyxFQUEyRDtBQUN6REgsb0JBQVFBO0FBRGlELFdBQTNEO0FBR0EsaUJBQU9rQixVQUFQO0FBQ0QsU0F2Qk0sQ0FBUDtBQXdCRDtBQXZGZTtBQUFBO0FBQUEsc0NBeUZBbkIsS0F6RkEsRUF5Rk9vQixLQXpGUCxFQXlGYztBQUFBOztBQUM1QixZQUFNbkIsU0FBUy9DLE1BQU1nRCxLQUFOLEVBQWY7QUFDQS9DLGdCQUFRZ0QsR0FBUixDQUFZLE9BQVosRUFBcUJDLGFBQXJCLENBQW1DLG1CQUFuQyxFQUF3RDtBQUN0REMsY0FBSUosTUFEa0Q7QUFFdERLLHVCQUFhLElBRnlDO0FBR3REQyxtQkFBUztBQUg2QyxTQUF4RDtBQUtBLGVBQU9yRCxNQUFNc0QsV0FBTixvQkFBcUM7QUFDMUMxQixnQkFBTTtBQUNKMkIsb0JBQVE7QUFDTkMscUJBQU87QUFDTEMscUJBQUssQ0FDSCxFQUFFQyxjQUFjWixLQUFoQixFQURHLEVBRUgsRUFBRXFCLGdCQUFnQkQsTUFBTWYsRUFBeEIsRUFGRztBQURBO0FBREQ7QUFESixXQURvQztBQVcxQ1UsdUJBQWE7QUFYNkIsU0FBckMsRUFZSkMsSUFaSSxDQVlDLFVBQUNDLE9BQUQsRUFBYTtBQUNuQixjQUFJQSxRQUFRSyxNQUFaLEVBQW9CO0FBQ2xCLG1CQUFPTCxRQUFRLENBQVIsQ0FBUDtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPLE9BQUtNLGVBQUwsQ0FBcUI7QUFDMUJYLDRCQUFjWixLQURZO0FBRTFCcUIsOEJBQWdCRCxNQUFNZixFQUZJO0FBRzFCbUIscUJBQU9KLE1BQU1wQyxhQUFOLENBQW9Cd0MsS0FIRDtBQUkxQkMsNkJBQWV0RSxRQUFRZ0QsR0FBUixDQUFZLHdDQUFaO0FBSlcsYUFBckIsRUFLSmEsSUFMSSxDQUtDLFlBQU07QUFDWixxQkFBTyxPQUFLVSxlQUFMLENBQXFCMUIsS0FBckIsRUFBNEJvQixLQUE1QixDQUFQO0FBQ0QsYUFQTSxDQUFQO0FBUUQ7QUFDRixTQXpCTSxFQXlCSkosSUF6QkksQ0F5QkMsVUFBQ1csTUFBRCxFQUFZO0FBQ2xCLGlCQUFPLE9BQUtULGdCQUFMLENBQXNCUyxNQUF0QixDQUFQO0FBQ0QsU0EzQk0sRUEyQkpYLElBM0JJLENBMkJDLFVBQUNHLFVBQUQsRUFBZ0I7QUFDdEJoRSxrQkFBUWdELEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxhQUFyQixDQUFtQyxzQkFBbkMsRUFBMkQ7QUFDekRILG9CQUFRQTtBQURpRCxXQUEzRDtBQUdBLGlCQUFPa0IsVUFBUDtBQUNELFNBaENNLENBQVA7QUFpQ0Q7QUFqSWU7QUFBQTtBQUFBLHNDQW1JQVMsSUFuSUEsRUFtSU07QUFDcEIsWUFBSSxDQUFDQSxLQUFLZixVQUFWLEVBQXNCO0FBQ3BCZSxlQUFLOUIsR0FBTCxHQUFXM0MsUUFBUWdELEdBQVIsQ0FBWSwrQkFBWixDQUFYO0FBQ0F5QixlQUFLQyxjQUFMLEdBQXNCLEtBQUtDLHNCQUFMLENBQTRCRixLQUFLSixLQUFqQyxFQUF3Q0ksS0FBS0gsYUFBN0MsQ0FBdEI7QUFDQSxpQkFBT0csS0FBS0osS0FBWjtBQUNBLGlCQUFPSSxLQUFLSCxhQUFaO0FBQ0Q7QUFDRCxlQUFPdkUsTUFBTXNELFdBQU4sQ0FBa0IsaUJBQWxCLEVBQXFDO0FBQzFDdUIsa0JBQVEsTUFEa0M7QUFFMUNqRCxnQkFBTWtELEtBQUtDLFNBQUwsQ0FBZUwsSUFBZixDQUZvQztBQUcxQ2IsdUJBQWE7QUFINkIsU0FBckMsQ0FBUDtBQUtEO0FBL0llO0FBQUE7QUFBQSw2Q0FpSk9TLEtBakpQLEVBaUpjQyxhQWpKZCxFQWlKNkI7QUFDM0MsWUFBTVMsYUFBYSxFQUFuQjtBQUNBLGFBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJWCxLQUFwQixFQUEyQlcsR0FBM0IsRUFBZ0M7QUFDOUJELHFCQUFXRSxJQUFYLENBQWdCO0FBQ2R4QyxlQUFHLENBQUN0QixLQUFLb0IsTUFBTCxLQUFnQixDQUFoQixHQUFvQixDQUFyQixJQUEwQixHQUExQixJQUFpQyxJQUFJK0IsYUFBckMsQ0FEVztBQUVkNUIsZUFBRyxDQUFDdkIsS0FBS29CLE1BQUwsS0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBckIsSUFBMEIsR0FBMUIsSUFBaUMsSUFBSStCLGFBQXJDLENBRlc7QUFHZFksZUFBRyxDQUhXO0FBSWRDLGlCQUFLaEUsS0FBS29CLE1BQUwsS0FBZ0J4QyxNQUFNcUYsR0FKYjtBQUtkQyxrQkFBTWxFLEtBQUtvQixNQUFMLEtBQWdCeEMsTUFBTXFGLEdBTGQ7QUFNZEUsbUJBQU87QUFOTyxXQUFoQjtBQVFEO0FBQ0QsZUFBT1AsVUFBUDtBQUNEO0FBOUplO0FBQUE7QUFBQSxzQ0FnS0FRLENBaEtBLEVBZ0tFQyxDQWhLRixFQWdLSztBQUNuQixZQUFJRCxFQUFFMUQsYUFBRixDQUFnQnNDLE1BQWhCLElBQTBCcUIsRUFBRTNELGFBQUYsQ0FBZ0JzQyxNQUE5QyxFQUFzRCxPQUFPLEtBQVA7QUFDdEQsYUFBSyxJQUFJakMsTUFBTSxDQUFmLEVBQWtCQSxNQUFNcUQsRUFBRTFELGFBQUYsQ0FBZ0JzQyxNQUF4QyxFQUFnRGpDLEtBQWhELEVBQXVEO0FBQ3JELGNBQUl1RCxZQUFZRixFQUFFMUQsYUFBRixDQUFnQkssR0FBaEIsQ0FBaEI7QUFDQSxlQUFLLElBQUlqQixHQUFULElBQWdCd0UsU0FBaEIsRUFBMkI7QUFDekIsZ0JBQUlBLFVBQVV4RSxHQUFWLE1BQW1CdUUsRUFBRTNELGFBQUYsQ0FBZ0JLLEdBQWhCLEVBQXFCakIsR0FBckIsQ0FBdkIsRUFBa0QsT0FBTyxLQUFQO0FBQ25EO0FBQ0Y7QUFDRCxlQUFPLElBQVA7QUFDRDtBQXpLZTs7QUFBQTtBQUFBOztBQTJLbEIsU0FBTyxJQUFJaEIsWUFBSixFQUFQO0FBQ0QsQ0E1S0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvdXRpbHMuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
