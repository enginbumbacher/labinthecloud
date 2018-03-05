'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      defaults = {
    vRange: 360,
    stdBand: true,
    dT: 1,
    dT_Angle: 15,
    width: 400,
    height: 300,
    data: {},
    raw: {},
    margins: {
      top: 20,
      left: 40,
      bottom: 40,
      right: 20
    }
  };

  return function (_Model) {
    _inherits(OrientationChangeModel, _Model);

    function OrientationChangeModel() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, OrientationChangeModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (OrientationChangeModel.__proto__ || Object.getPrototypeOf(OrientationChangeModel)).call(this, config));

      Utils.bindMethods(_this, ['parseData']);

      return _this;
    }

    _createClass(OrientationChangeModel, [{
      key: 'parseData',
      value: function parseData(data) {
        var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

        var _this2 = this;

        var lightConfig = arguments[2];
        var color = arguments[3];

        this.set('raw.' + layer, data);
        // Orientation of 0 points to the right.

        if (lightConfig) {
          // Calculate the light direction for each time band and the accumulated time
          var acc_time = 0;

          var _loop = function _loop(config) {
            var v_light = [0, 0];
            for (var k in config) {
              switch (k) {
                case "left":
                  v_light[0] += config[k];
                  break;
                case "right":
                  v_light[0] += -config[k];
                  break;
                case "top":
                  v_light[1] += config[k];
                  break;
                case "bottom":
                  v_light[1] += -config[k];
                  break;
              }
            }
            var v_length = Math.sqrt(v_light[0] * v_light[0] + v_light[1] * v_light[1]);
            v_length = v_length === 0 ? 1 : v_length;
            v_light = v_light.map(function (x) {
              return x / v_length;
            });
            config.lightDir = v_light;
            config.timeStart = acc_time;
            config.timeEnd = acc_time + config.duration;
            acc_time += config.duration;
          };

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = lightConfig[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var config = _step.value;

              _loop(config);
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

        // set the range for the vertical axis: 180 degrees is away from light; 0 degrees is towards light; 90 degrees is neither or.
        var usedVRange = this.get('vRange');

        var pdata = {};

        for (var rlayer in this.get('raw')) {
          var rdata = this.get('raw.' + rlayer);
          var graphs = {};
          graphs.angleDiff = [];

          // For each frame generate the relevant data structure for the graph - here, it has to haev a time value, a mean and a standard deviation s at every time point.
          for (var i = 0; i < rdata.numFrames; i++) {
            for (var key in graphs) {
              graphs[key].push({
                frame: i,
                time: i / rdata.fps,
                samples: [],
                mean: null,
                s: null
              });
            }
          }
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = rdata.tracks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var track = _step2.value;

              for (var idx = this.get('dT_Angle'); idx < track.samples.length; idx++) {
                var sample = track.samples[idx];
                var sampleFrame = Math.round(sample.time * rdata.fps);
                var test = 0;
                if (sample.time > 15 && sample.time < 30) test += 1;
                if (sample.time > 30 && sample.time < 45) test += 1;
                if (sample.time > 45 && sample.time < 60) test += 1;

                if (!sample.angleXY) continue;
                // track.samples.slice(idx - this.get('dT_Angle'), idx).reduce((acc,curr) => acc + Math.atan2(curr.speedY, curr.speedX),0) / this.get('dT_Angle') * 180 / Math.PI;
                // var v_eug = [Math.cos(avgAngle), Math.sin(avgAngle)];

                var _loop3 = function _loop3(lights) {
                  if (lights.timeStart <= sample.time && lights.timeEnd > sample.time) {
                    if (lights.lightDir === [0, 0]) {
                      graphs.angleDiff[sampleFrame - 1].samples.push(90);
                    } else {
                      avgAngle = 0;

                      track.samples.slice(idx - _this2.get('dT_Angle'), idx).forEach(function (curr) {
                        var angle = Math.atan2(curr.speedY, curr.speedX);
                        var v_eug = [Math.cos(angle), Math.sin(angle)];
                        var angleDiff = Math.acos(lights.lightDir[0] * v_eug[0] + lights.lightDir[1] * v_eug[1]);
                        angleDiff = Math.min(angleDiff + Math.PI, Math.PI - angleDiff);
                        angleDiff = Math.abs(angleDiff) * 180 / Math.PI;
                        avgAngle += angleDiff;
                      });

                      avgAngle /= _this2.get('dT_Angle');

                      graphs.angleDiff[sampleFrame].samples.push(avgAngle);
                    }
                  }
                };

                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                  for (var _iterator4 = lightConfig[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var lights = _step4.value;
                    var avgAngle;

                    _loop3(lights);
                  }
                } catch (err) {
                  _didIteratorError4 = true;
                  _iteratorError4 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                      _iterator4.return();
                    }
                  } finally {
                    if (_didIteratorError4) {
                      throw _iteratorError4;
                    }
                  }
                }
              }
            }

            // Create the mean and standard deviation
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

          var maxDisplay = 0;
          for (var _key in graphs) {
            var _loop2 = function _loop2(frame) {
              if (frame.samples.length) {
                frame.mean = frame.samples.reduce(function (v, c) {
                  return v + c;
                }, 0) / frame.samples.length;
                frame.s = Math.sqrt(frame.samples.map(function (v) {
                  return Math.pow(v - frame.mean, 2);
                }).reduce(function (v, c) {
                  return v + c;
                }, 0) / frame.samples.length);
                maxDisplay = Math.max(maxDisplay, Math.max(Math.abs(frame.mean + frame.s), Math.abs(frame.mean - frame.s)));
              }
            };

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = graphs[_key][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var frame = _step3.value;

                _loop2(frame);
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
          pdata[rlayer] = {
            graphs: graphs,
            maxValue: maxDisplay,
            runTime: rdata.runTime,
            color: rlayer == layer ? color : null,
            showLayer: rlayer == layer ? true : this.get('data.' + rlayer + '.showLayer')
          };
        }
        this.set('data', pdata);
      }
    }, {
      key: 'setLayerLive',
      value: function setLayerLive(showLayerLive) {
        this.set('data.live.showLayer', showLayerLive);
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.set('data', {});
      }
    }]);

    return OrientationChangeModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9vcmllbnRhdGlvbmNoYW5nZWdyYXBoL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiR2xvYmFscyIsImRlZmF1bHRzIiwidlJhbmdlIiwic3RkQmFuZCIsImRUIiwiZFRfQW5nbGUiLCJ3aWR0aCIsImhlaWdodCIsImRhdGEiLCJyYXciLCJtYXJnaW5zIiwidG9wIiwibGVmdCIsImJvdHRvbSIsInJpZ2h0IiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiLCJiaW5kTWV0aG9kcyIsImxheWVyIiwibGlnaHRDb25maWciLCJjb2xvciIsInNldCIsImFjY190aW1lIiwidl9saWdodCIsImsiLCJ2X2xlbmd0aCIsIk1hdGgiLCJzcXJ0IiwibWFwIiwieCIsImxpZ2h0RGlyIiwidGltZVN0YXJ0IiwidGltZUVuZCIsImR1cmF0aW9uIiwidXNlZFZSYW5nZSIsImdldCIsInBkYXRhIiwicmxheWVyIiwicmRhdGEiLCJncmFwaHMiLCJhbmdsZURpZmYiLCJpIiwibnVtRnJhbWVzIiwia2V5IiwicHVzaCIsImZyYW1lIiwidGltZSIsImZwcyIsInNhbXBsZXMiLCJtZWFuIiwicyIsInRyYWNrcyIsInRyYWNrIiwiaWR4IiwibGVuZ3RoIiwic2FtcGxlIiwic2FtcGxlRnJhbWUiLCJyb3VuZCIsInRlc3QiLCJhbmdsZVhZIiwibGlnaHRzIiwiYXZnQW5nbGUiLCJzbGljZSIsImZvckVhY2giLCJhbmdsZSIsImF0YW4yIiwiY3VyciIsInNwZWVkWSIsInNwZWVkWCIsInZfZXVnIiwiY29zIiwic2luIiwiYWNvcyIsIm1pbiIsIlBJIiwiYWJzIiwibWF4RGlzcGxheSIsInJlZHVjZSIsInYiLCJjIiwicG93IiwibWF4IiwibWF4VmFsdWUiLCJydW5UaW1lIiwic2hvd0xheWVyIiwic2hvd0xheWVyTGl2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUlFSSxXQUFXO0FBQ1RDLFlBQVEsR0FEQztBQUVUQyxhQUFTLElBRkE7QUFHVEMsUUFBSSxDQUhLO0FBSVRDLGNBQVUsRUFKRDtBQUtUQyxXQUFPLEdBTEU7QUFNVEMsWUFBUSxHQU5DO0FBT1RDLFVBQU0sRUFQRztBQVFUQyxTQUFLLEVBUkk7QUFTVEMsYUFBUztBQUNQQyxXQUFLLEVBREU7QUFFUEMsWUFBTSxFQUZDO0FBR1BDLGNBQVEsRUFIRDtBQUlQQyxhQUFPO0FBSkE7QUFUQSxHQUpiOztBQXNCQTtBQUFBOztBQUNFLHNDQUF5QjtBQUFBLFVBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFDdkJBLGFBQU9kLFFBQVAsR0FBa0JGLE1BQU1pQixjQUFOLENBQXFCRCxPQUFPZCxRQUE1QixFQUFzQ0EsUUFBdEMsQ0FBbEI7O0FBRHVCLGtKQUVqQmMsTUFGaUI7O0FBSXZCaEIsWUFBTWtCLFdBQU4sUUFBd0IsQ0FBQyxXQUFELENBQXhCOztBQUp1QjtBQU14Qjs7QUFQSDtBQUFBO0FBQUEsZ0NBU1lULElBVFosRUFTeUQ7QUFBQSxZQUF2Q1UsS0FBdUMsdUVBQS9CLFNBQStCOztBQUFBOztBQUFBLFlBQXBCQyxXQUFvQjtBQUFBLFlBQVBDLEtBQU87O0FBQ3JELGFBQUtDLEdBQUwsVUFBZ0JILEtBQWhCLEVBQXlCVixJQUF6QjtBQUNBOztBQUVBLFlBQUlXLFdBQUosRUFBaUI7QUFDZjtBQUNBLGNBQUlHLFdBQVcsQ0FBZjs7QUFGZSxxQ0FHTlAsTUFITTtBQUliLGdCQUFJUSxVQUFVLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBZDtBQUNBLGlCQUFLLElBQUlDLENBQVQsSUFBY1QsTUFBZCxFQUFzQjtBQUNwQixzQkFBUVMsQ0FBUjtBQUNFLHFCQUFLLE1BQUw7QUFDRUQsMEJBQVEsQ0FBUixLQUFjUixPQUFPUyxDQUFQLENBQWQ7QUFDQTtBQUNGLHFCQUFLLE9BQUw7QUFDRUQsMEJBQVEsQ0FBUixLQUFjLENBQUNSLE9BQU9TLENBQVAsQ0FBZjtBQUNBO0FBQ0YscUJBQUssS0FBTDtBQUNFRCwwQkFBUSxDQUFSLEtBQWNSLE9BQU9TLENBQVAsQ0FBZDtBQUNBO0FBQ0YscUJBQUssUUFBTDtBQUNFRCwwQkFBUSxDQUFSLEtBQWMsQ0FBQ1IsT0FBT1MsQ0FBUCxDQUFmO0FBQ0E7QUFaSjtBQWNEO0FBQ0QsZ0JBQUlDLFdBQVdDLEtBQUtDLElBQUwsQ0FBVUosUUFBUSxDQUFSLElBQVdBLFFBQVEsQ0FBUixDQUFYLEdBQXdCQSxRQUFRLENBQVIsSUFBV0EsUUFBUSxDQUFSLENBQTdDLENBQWY7QUFDQUUsdUJBQVdBLGFBQVcsQ0FBWCxHQUFlLENBQWYsR0FBbUJBLFFBQTlCO0FBQ0FGLHNCQUFVQSxRQUFRSyxHQUFSLENBQVksVUFBU0MsQ0FBVCxFQUFZO0FBQUMscUJBQU9BLElBQUlKLFFBQVg7QUFBb0IsYUFBN0MsQ0FBVjtBQUNBVixtQkFBT2UsUUFBUCxHQUFrQlAsT0FBbEI7QUFDQVIsbUJBQU9nQixTQUFQLEdBQW1CVCxRQUFuQjtBQUNBUCxtQkFBT2lCLE9BQVAsR0FBaUJWLFdBQVdQLE9BQU9rQixRQUFuQztBQUNBWCx3QkFBWVAsT0FBT2tCLFFBQW5CO0FBM0JhOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUdmLGlDQUFtQmQsV0FBbkIsOEhBQWdDO0FBQUEsa0JBQXZCSixNQUF1Qjs7QUFBQSxvQkFBdkJBLE1BQXVCO0FBeUIvQjtBQTVCYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBNkJoQjs7QUFHRDtBQUNBLFlBQUltQixhQUFhLEtBQUtDLEdBQUwsQ0FBUyxRQUFULENBQWpCOztBQUVBLFlBQUlDLFFBQVEsRUFBWjs7QUFFQSxhQUFLLElBQUlDLE1BQVQsSUFBbUIsS0FBS0YsR0FBTCxDQUFTLEtBQVQsQ0FBbkIsRUFBb0M7QUFDbEMsY0FBSUcsUUFBUSxLQUFLSCxHQUFMLFVBQWdCRSxNQUFoQixDQUFaO0FBQ0EsY0FBSUUsU0FBUyxFQUFiO0FBQ0FBLGlCQUFPQyxTQUFQLEdBQW1CLEVBQW5COztBQUdBO0FBQ0EsZUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE1BQU1JLFNBQTFCLEVBQXFDRCxHQUFyQyxFQUEwQztBQUN4QyxpQkFBSyxJQUFJRSxHQUFULElBQWdCSixNQUFoQixFQUF3QjtBQUN0QkEscUJBQU9JLEdBQVAsRUFBWUMsSUFBWixDQUFpQjtBQUNmQyx1QkFBT0osQ0FEUTtBQUVmSyxzQkFBTUwsSUFBSUgsTUFBTVMsR0FGRDtBQUdmQyx5QkFBUyxFQUhNO0FBSWZDLHNCQUFNLElBSlM7QUFLZkMsbUJBQUc7QUFMWSxlQUFqQjtBQU9EO0FBQ0Y7QUFqQmlDO0FBQUE7QUFBQTs7QUFBQTtBQWtCbEMsa0NBQWtCWixNQUFNYSxNQUF4QixtSUFBZ0M7QUFBQSxrQkFBdkJDLEtBQXVCOztBQUM5QixtQkFBSyxJQUFJQyxNQUFNLEtBQUtsQixHQUFMLENBQVMsVUFBVCxDQUFmLEVBQXFDa0IsTUFBTUQsTUFBTUosT0FBTixDQUFjTSxNQUF6RCxFQUFpRUQsS0FBakUsRUFBd0U7QUFDdEUsb0JBQUlFLFNBQVNILE1BQU1KLE9BQU4sQ0FBY0ssR0FBZCxDQUFiO0FBQ0Esb0JBQUlHLGNBQWM5QixLQUFLK0IsS0FBTCxDQUFXRixPQUFPVCxJQUFQLEdBQWNSLE1BQU1TLEdBQS9CLENBQWxCO0FBQ0Esb0JBQUlXLE9BQU8sQ0FBWDtBQUNBLG9CQUFJSCxPQUFPVCxJQUFQLEdBQWMsRUFBZCxJQUFvQlMsT0FBT1QsSUFBUCxHQUFjLEVBQXRDLEVBQTBDWSxRQUFRLENBQVI7QUFDMUMsb0JBQUlILE9BQU9ULElBQVAsR0FBYyxFQUFkLElBQW9CUyxPQUFPVCxJQUFQLEdBQWMsRUFBdEMsRUFBMENZLFFBQVEsQ0FBUjtBQUMxQyxvQkFBSUgsT0FBT1QsSUFBUCxHQUFjLEVBQWQsSUFBb0JTLE9BQU9ULElBQVAsR0FBYyxFQUF0QyxFQUEwQ1ksUUFBUSxDQUFSOztBQUUxQyxvQkFBSSxDQUFDSCxPQUFPSSxPQUFaLEVBQXFCO0FBQ3JCO0FBQ0E7O0FBVnNFLDZDQVc3REMsTUFYNkQ7QUFZcEUsc0JBQUlBLE9BQU83QixTQUFQLElBQW9Cd0IsT0FBT1QsSUFBM0IsSUFBbUNjLE9BQU81QixPQUFQLEdBQWlCdUIsT0FBT1QsSUFBL0QsRUFBcUU7QUFDbkUsd0JBQUljLE9BQU85QixRQUFQLEtBQWtCLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBdEIsRUFBNkI7QUFDM0JTLDZCQUFPQyxTQUFQLENBQWlCZ0IsY0FBWSxDQUE3QixFQUFnQ1IsT0FBaEMsQ0FBd0NKLElBQXhDLENBQTZDLEVBQTdDO0FBQ0QscUJBRkQsTUFFTztBQUNEaUIsaUNBQVcsQ0FEVjs7QUFFTFQsNEJBQU1KLE9BQU4sQ0FBY2MsS0FBZCxDQUFvQlQsTUFBTSxPQUFLbEIsR0FBTCxDQUFTLFVBQVQsQ0FBMUIsRUFBZ0RrQixHQUFoRCxFQUFxRFUsT0FBckQsQ0FBNkQsZ0JBQVE7QUFDbkUsNEJBQUlDLFFBQVF0QyxLQUFLdUMsS0FBTCxDQUFXQyxLQUFLQyxNQUFoQixFQUF3QkQsS0FBS0UsTUFBN0IsQ0FBWjtBQUNBLDRCQUFJQyxRQUFRLENBQUMzQyxLQUFLNEMsR0FBTCxDQUFTTixLQUFULENBQUQsRUFBa0J0QyxLQUFLNkMsR0FBTCxDQUFTUCxLQUFULENBQWxCLENBQVo7QUFDQSw0QkFBSXhCLFlBQVlkLEtBQUs4QyxJQUFMLENBQVVaLE9BQU85QixRQUFQLENBQWdCLENBQWhCLElBQW1CdUMsTUFBTSxDQUFOLENBQW5CLEdBQThCVCxPQUFPOUIsUUFBUCxDQUFnQixDQUFoQixJQUFtQnVDLE1BQU0sQ0FBTixDQUEzRCxDQUFoQjtBQUNBN0Isb0NBQVlkLEtBQUsrQyxHQUFMLENBQVNqQyxZQUFZZCxLQUFLZ0QsRUFBMUIsRUFBOEJoRCxLQUFLZ0QsRUFBTCxHQUFVbEMsU0FBeEMsQ0FBWjtBQUNBQSxvQ0FBWWQsS0FBS2lELEdBQUwsQ0FBU25DLFNBQVQsSUFBc0IsR0FBdEIsR0FBNEJkLEtBQUtnRCxFQUE3QztBQUNBYixvQ0FBWXJCLFNBQVo7QUFDRCx1QkFQRDs7QUFTQXFCLGtDQUFZLE9BQUsxQixHQUFMLENBQVMsVUFBVCxDQUFaOztBQUVBSSw2QkFBT0MsU0FBUCxDQUFpQmdCLFdBQWpCLEVBQThCUixPQUE5QixDQUFzQ0osSUFBdEMsQ0FBMkNpQixRQUEzQztBQUNEO0FBQ0Y7QUE5Qm1FOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQVd0RSx3Q0FBbUIxQyxXQUFuQixtSUFBZ0M7QUFBQSx3QkFBdkJ5QyxNQUF1QjtBQUFBLHdCQUt0QkMsUUFMc0I7O0FBQUEsMkJBQXZCRCxNQUF1QjtBQW9CL0I7QUEvQnFFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFnQ3ZFO0FBQ0Y7O0FBRUQ7QUF0RGtDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBdURsQyxjQUFJZ0IsYUFBYSxDQUFqQjtBQUNBLGVBQUssSUFBSWpDLElBQVQsSUFBZ0JKLE1BQWhCLEVBQXdCO0FBQUEseUNBQ2JNLEtBRGE7QUFFcEIsa0JBQUlBLE1BQU1HLE9BQU4sQ0FBY00sTUFBbEIsRUFBMEI7QUFDeEJULHNCQUFNSSxJQUFOLEdBQWFKLE1BQU1HLE9BQU4sQ0FBYzZCLE1BQWQsQ0FBcUIsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEseUJBQVVELElBQUlDLENBQWQ7QUFBQSxpQkFBckIsRUFBc0MsQ0FBdEMsSUFBMkNsQyxNQUFNRyxPQUFOLENBQWNNLE1BQXRFO0FBQ0FULHNCQUFNSyxDQUFOLEdBQVV4QixLQUFLQyxJQUFMLENBQVVrQixNQUFNRyxPQUFOLENBQWNwQixHQUFkLENBQWtCLFVBQUNrRCxDQUFEO0FBQUEseUJBQU9wRCxLQUFLc0QsR0FBTCxDQUFTRixJQUFJakMsTUFBTUksSUFBbkIsRUFBeUIsQ0FBekIsQ0FBUDtBQUFBLGlCQUFsQixFQUFzRDRCLE1BQXRELENBQTZELFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLHlCQUFVRCxJQUFJQyxDQUFkO0FBQUEsaUJBQTdELEVBQThFLENBQTlFLElBQW1GbEMsTUFBTUcsT0FBTixDQUFjTSxNQUEzRyxDQUFWO0FBQ0FzQiw2QkFBYWxELEtBQUt1RCxHQUFMLENBQVNMLFVBQVQsRUFBcUJsRCxLQUFLdUQsR0FBTCxDQUFTdkQsS0FBS2lELEdBQUwsQ0FBUzlCLE1BQU1JLElBQU4sR0FBYUosTUFBTUssQ0FBNUIsQ0FBVCxFQUF5Q3hCLEtBQUtpRCxHQUFMLENBQVM5QixNQUFNSSxJQUFOLEdBQWFKLE1BQU1LLENBQTVCLENBQXpDLENBQXJCLENBQWI7QUFDRDtBQU5tQjs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDdEIsb0NBQWtCWCxPQUFPSSxJQUFQLENBQWxCLG1JQUErQjtBQUFBLG9CQUF0QkUsS0FBc0I7O0FBQUEsdUJBQXRCQSxLQUFzQjtBQU05QjtBQVBxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUXZCO0FBQ0RULGdCQUFNQyxNQUFOLElBQWdCO0FBQ2RFLG9CQUFRQSxNQURNO0FBRWQyQyxzQkFBVU4sVUFGSTtBQUdkTyxxQkFBUzdDLE1BQU02QyxPQUhEO0FBSWQvRCxtQkFBT2lCLFVBQVVuQixLQUFWLEdBQWtCRSxLQUFsQixHQUEwQixJQUpuQjtBQUtkZ0UsdUJBQVkvQyxVQUFVbkIsS0FBWCxHQUFvQixJQUFwQixHQUEyQixLQUFLaUIsR0FBTCxXQUFpQkUsTUFBakI7QUFMeEIsV0FBaEI7QUFPRDtBQUNELGFBQUtoQixHQUFMLENBQVMsTUFBVCxFQUFpQmUsS0FBakI7QUFDRDtBQTVISDtBQUFBO0FBQUEsbUNBOEhlaUQsYUE5SGYsRUE4SDhCO0FBQzFCLGFBQUtoRSxHQUFMLHdCQUFnQ2dFLGFBQWhDO0FBQ0Q7QUFoSUg7QUFBQTtBQUFBLDhCQWtJVTtBQUNOLGFBQUtoRSxHQUFMLENBQVMsTUFBVCxFQUFpQixFQUFqQjtBQUNEO0FBcElIOztBQUFBO0FBQUEsSUFBNEN2QixLQUE1QztBQXNJRCxDQTdKRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvb3JpZW50YXRpb25jaGFuZ2VncmFwaC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgdlJhbmdlOiAzNjAsXG4gICAgICBzdGRCYW5kOiB0cnVlLFxuICAgICAgZFQ6IDEsXG4gICAgICBkVF9BbmdsZTogMTUsXG4gICAgICB3aWR0aDogNDAwLFxuICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICBkYXRhOiB7fSxcbiAgICAgIHJhdzoge30sXG4gICAgICBtYXJnaW5zOiB7XG4gICAgICAgIHRvcDogMjAsXG4gICAgICAgIGxlZnQ6IDQwLFxuICAgICAgICBib3R0b206IDQwLFxuICAgICAgICByaWdodDogMjBcbiAgICAgIH1cbiAgICB9XG4gIDtcblxuICByZXR1cm4gY2xhc3MgT3JpZW50YXRpb25DaGFuZ2VNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuICAgICAgY29uZmlnLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZmlnLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG4gICAgICBzdXBlcihjb25maWcpO1xuXG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ3BhcnNlRGF0YSddKTtcblxuICAgIH1cblxuICAgIHBhcnNlRGF0YShkYXRhLCBsYXllciA9ICdkZWZhdWx0JywgbGlnaHRDb25maWcsIGNvbG9yKSB7XG4gICAgICB0aGlzLnNldChgcmF3LiR7bGF5ZXJ9YCwgZGF0YSk7XG4gICAgICAvLyBPcmllbnRhdGlvbiBvZiAwIHBvaW50cyB0byB0aGUgcmlnaHQuXG5cbiAgICAgIGlmIChsaWdodENvbmZpZykge1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGxpZ2h0IGRpcmVjdGlvbiBmb3IgZWFjaCB0aW1lIGJhbmQgYW5kIHRoZSBhY2N1bXVsYXRlZCB0aW1lXG4gICAgICAgIHZhciBhY2NfdGltZSA9IDBcbiAgICAgICAgZm9yIChsZXQgY29uZmlnIG9mIGxpZ2h0Q29uZmlnKSB7XG4gICAgICAgICAgbGV0IHZfbGlnaHQgPSBbMCwwXTtcbiAgICAgICAgICBmb3IgKGxldCBrIGluIGNvbmZpZykge1xuICAgICAgICAgICAgc3dpdGNoIChrKSB7XG4gICAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgdl9saWdodFswXSArPSBjb25maWdba107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgIHZfbGlnaHRbMF0gKz0gLWNvbmZpZ1trXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBcInRvcFwiOlxuICAgICAgICAgICAgICAgIHZfbGlnaHRbMV0gKz0gY29uZmlnW2tdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIFwiYm90dG9tXCI6XG4gICAgICAgICAgICAgICAgdl9saWdodFsxXSArPSAtY29uZmlnW2tdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgdl9sZW5ndGggPSBNYXRoLnNxcnQodl9saWdodFswXSp2X2xpZ2h0WzBdICsgdl9saWdodFsxXSp2X2xpZ2h0WzFdKTtcbiAgICAgICAgICB2X2xlbmd0aCA9IHZfbGVuZ3RoPT09MCA/IDEgOiB2X2xlbmd0aDtcbiAgICAgICAgICB2X2xpZ2h0ID0gdl9saWdodC5tYXAoZnVuY3Rpb24oeCkge3JldHVybiB4IC8gdl9sZW5ndGh9KTtcbiAgICAgICAgICBjb25maWcubGlnaHREaXIgPSB2X2xpZ2h0XG4gICAgICAgICAgY29uZmlnLnRpbWVTdGFydCA9IGFjY190aW1lO1xuICAgICAgICAgIGNvbmZpZy50aW1lRW5kID0gYWNjX3RpbWUgKyBjb25maWcuZHVyYXRpb247XG4gICAgICAgICAgYWNjX3RpbWUgKz0gY29uZmlnLmR1cmF0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgLy8gc2V0IHRoZSByYW5nZSBmb3IgdGhlIHZlcnRpY2FsIGF4aXM6IDE4MCBkZWdyZWVzIGlzIGF3YXkgZnJvbSBsaWdodDsgMCBkZWdyZWVzIGlzIHRvd2FyZHMgbGlnaHQ7IDkwIGRlZ3JlZXMgaXMgbmVpdGhlciBvci5cbiAgICAgIHZhciB1c2VkVlJhbmdlID0gdGhpcy5nZXQoJ3ZSYW5nZScpO1xuXG4gICAgICBsZXQgcGRhdGEgPSB7fTtcblxuICAgICAgZm9yIChsZXQgcmxheWVyIGluIHRoaXMuZ2V0KCdyYXcnKSkge1xuICAgICAgICBsZXQgcmRhdGEgPSB0aGlzLmdldChgcmF3LiR7cmxheWVyfWApO1xuICAgICAgICBsZXQgZ3JhcGhzID0ge307XG4gICAgICAgIGdyYXBocy5hbmdsZURpZmYgPSBbXTtcblxuXG4gICAgICAgIC8vIEZvciBlYWNoIGZyYW1lIGdlbmVyYXRlIHRoZSByZWxldmFudCBkYXRhIHN0cnVjdHVyZSBmb3IgdGhlIGdyYXBoIC0gaGVyZSwgaXQgaGFzIHRvIGhhZXYgYSB0aW1lIHZhbHVlLCBhIG1lYW4gYW5kIGEgc3RhbmRhcmQgZGV2aWF0aW9uIHMgYXQgZXZlcnkgdGltZSBwb2ludC5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZGF0YS5udW1GcmFtZXM7IGkrKykge1xuICAgICAgICAgIGZvciAobGV0IGtleSBpbiBncmFwaHMpIHtcbiAgICAgICAgICAgIGdyYXBoc1trZXldLnB1c2goe1xuICAgICAgICAgICAgICBmcmFtZTogaSxcbiAgICAgICAgICAgICAgdGltZTogaSAvIHJkYXRhLmZwcyxcbiAgICAgICAgICAgICAgc2FtcGxlczogW10sXG4gICAgICAgICAgICAgIG1lYW46IG51bGwsXG4gICAgICAgICAgICAgIHM6IG51bGxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHRyYWNrIG9mIHJkYXRhLnRyYWNrcykge1xuICAgICAgICAgIGZvciAobGV0IGlkeCA9IHRoaXMuZ2V0KCdkVF9BbmdsZScpOyBpZHggPCB0cmFjay5zYW1wbGVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIGxldCBzYW1wbGUgPSB0cmFjay5zYW1wbGVzW2lkeF07XG4gICAgICAgICAgICBsZXQgc2FtcGxlRnJhbWUgPSBNYXRoLnJvdW5kKHNhbXBsZS50aW1lICogcmRhdGEuZnBzKTtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gMDtcbiAgICAgICAgICAgIGlmIChzYW1wbGUudGltZSA+IDE1ICYmIHNhbXBsZS50aW1lIDwgMzApIHRlc3QgKz0gMTtcbiAgICAgICAgICAgIGlmIChzYW1wbGUudGltZSA+IDMwICYmIHNhbXBsZS50aW1lIDwgNDUpIHRlc3QgKz0gMTtcbiAgICAgICAgICAgIGlmIChzYW1wbGUudGltZSA+IDQ1ICYmIHNhbXBsZS50aW1lIDwgNjApIHRlc3QgKz0gMTtcblxuICAgICAgICAgICAgaWYgKCFzYW1wbGUuYW5nbGVYWSkgY29udGludWU7XG4gICAgICAgICAgICAvLyB0cmFjay5zYW1wbGVzLnNsaWNlKGlkeCAtIHRoaXMuZ2V0KCdkVF9BbmdsZScpLCBpZHgpLnJlZHVjZSgoYWNjLGN1cnIpID0+IGFjYyArIE1hdGguYXRhbjIoY3Vyci5zcGVlZFksIGN1cnIuc3BlZWRYKSwwKSAvIHRoaXMuZ2V0KCdkVF9BbmdsZScpICogMTgwIC8gTWF0aC5QSTtcbiAgICAgICAgICAgIC8vIHZhciB2X2V1ZyA9IFtNYXRoLmNvcyhhdmdBbmdsZSksIE1hdGguc2luKGF2Z0FuZ2xlKV07XG4gICAgICAgICAgICBmb3IgKGxldCBsaWdodHMgb2YgbGlnaHRDb25maWcpIHtcbiAgICAgICAgICAgICAgaWYgKGxpZ2h0cy50aW1lU3RhcnQgPD0gc2FtcGxlLnRpbWUgJiYgbGlnaHRzLnRpbWVFbmQgPiBzYW1wbGUudGltZSkge1xuICAgICAgICAgICAgICAgIGlmIChsaWdodHMubGlnaHREaXI9PT1bMCwwXSkge1xuICAgICAgICAgICAgICAgICAgZ3JhcGhzLmFuZ2xlRGlmZltzYW1wbGVGcmFtZS0xXS5zYW1wbGVzLnB1c2goOTApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdmdBbmdsZSA9IDA7XG4gICAgICAgICAgICAgICAgICB0cmFjay5zYW1wbGVzLnNsaWNlKGlkeCAtIHRoaXMuZ2V0KCdkVF9BbmdsZScpLCBpZHgpLmZvckVhY2goY3VyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IE1hdGguYXRhbjIoY3Vyci5zcGVlZFksIGN1cnIuc3BlZWRYKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZfZXVnID0gW01hdGguY29zKGFuZ2xlKSwgTWF0aC5zaW4oYW5nbGUpXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuZ2xlRGlmZiA9IE1hdGguYWNvcyhsaWdodHMubGlnaHREaXJbMF0qdl9ldWdbMF0gKyBsaWdodHMubGlnaHREaXJbMV0qdl9ldWdbMV0pO1xuICAgICAgICAgICAgICAgICAgICBhbmdsZURpZmYgPSBNYXRoLm1pbihhbmdsZURpZmYgKyBNYXRoLlBJLCBNYXRoLlBJIC0gYW5nbGVEaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVEaWZmID0gTWF0aC5hYnMoYW5nbGVEaWZmKSAqIDE4MCAvIE1hdGguUEk7XG4gICAgICAgICAgICAgICAgICAgIGF2Z0FuZ2xlICs9IGFuZ2xlRGlmZjtcbiAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgIGF2Z0FuZ2xlIC89IHRoaXMuZ2V0KCdkVF9BbmdsZScpIDtcblxuICAgICAgICAgICAgICAgICAgZ3JhcGhzLmFuZ2xlRGlmZltzYW1wbGVGcmFtZV0uc2FtcGxlcy5wdXNoKGF2Z0FuZ2xlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWVhbiBhbmQgc3RhbmRhcmQgZGV2aWF0aW9uXG4gICAgICAgIGxldCBtYXhEaXNwbGF5ID0gMDtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGdyYXBocykge1xuICAgICAgICAgIGZvciAobGV0IGZyYW1lIG9mIGdyYXBoc1trZXldKSB7XG4gICAgICAgICAgICBpZiAoZnJhbWUuc2FtcGxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgZnJhbWUubWVhbiA9IGZyYW1lLnNhbXBsZXMucmVkdWNlKCh2LCBjKSA9PiB2ICsgYywgMCkgLyBmcmFtZS5zYW1wbGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgZnJhbWUucyA9IE1hdGguc3FydChmcmFtZS5zYW1wbGVzLm1hcCgodikgPT4gTWF0aC5wb3codiAtIGZyYW1lLm1lYW4sIDIpKS5yZWR1Y2UoKHYsIGMpID0+IHYgKyBjLCAwKSAvIGZyYW1lLnNhbXBsZXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgbWF4RGlzcGxheSA9IE1hdGgubWF4KG1heERpc3BsYXksIE1hdGgubWF4KE1hdGguYWJzKGZyYW1lLm1lYW4gKyBmcmFtZS5zKSwgTWF0aC5hYnMoZnJhbWUubWVhbiAtIGZyYW1lLnMpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBkYXRhW3JsYXllcl0gPSB7XG4gICAgICAgICAgZ3JhcGhzOiBncmFwaHMsXG4gICAgICAgICAgbWF4VmFsdWU6IG1heERpc3BsYXksXG4gICAgICAgICAgcnVuVGltZTogcmRhdGEucnVuVGltZSxcbiAgICAgICAgICBjb2xvcjogcmxheWVyID09IGxheWVyID8gY29sb3IgOiBudWxsLFxuICAgICAgICAgIHNob3dMYXllcjogKHJsYXllciA9PSBsYXllcikgPyB0cnVlIDogdGhpcy5nZXQoYGRhdGEuJHtybGF5ZXJ9LnNob3dMYXllcmApXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB0aGlzLnNldCgnZGF0YScsIHBkYXRhKTtcbiAgICB9XG5cbiAgICBzZXRMYXllckxpdmUoc2hvd0xheWVyTGl2ZSkge1xuICAgICAgdGhpcy5zZXQoYGRhdGEubGl2ZS5zaG93TGF5ZXJgLCBzaG93TGF5ZXJMaXZlKVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5zZXQoJ2RhdGEnLCB7fSk7XG4gICAgfVxuICB9XG59KVxuIl19
