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

        var _loop2 = function _loop2(rlayer) {
          var rdata = _this2.get('raw.' + rlayer);

          // For each frame generate the relevant data structure for the graph - here, it has to haev a time value, a mean and a standard deviation s at every time point.
          var intervals = void 0,
              i = void 0,
              j = void 0,
              parsed = void 0,
              track = void 0,
              sample = void 0,
              int = void 0,
              bin = void 0,
              maxBinValue = void 0;
          var graphs = [];

          for (i = 0; i < rdata.numFrames / rdata.fps; i += _this2.get('tStep')) {
            parsed = {
              time: i,
              sampleStart: Math.min(i + _this2.get('tStep'), rdata.numFrames / rdata.fps) - _this2.get('dT'),
              sampleEnd: Math.min(i + _this2.get('tStep'), rdata.numFrames / rdata.fps),
              bins: [],
              mean: null,
              s: null
            };
            for (j = 0; j < _this2.get('binCount'); j++) {
              parsed.bins.push({ // parsed contains the frequency per bin
                thetaStart: j * Utils.TAU / _this2.get('binCount'), // Utils.TAU = 2*MATH.PI
                thetaEnd: (j + 1) * Utils.TAU / _this2.get('binCount'),
                avgBinAngle: (2 * j + 1) * Utils.TAU / (2 * _this2.get('binCount')),
                frequency: 0
              });
            }
            graphs.push(parsed);
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = rdata.tracks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              track = _step2.value;
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = track.samples[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  sample = _step4.value;

                  bin = Math.floor(_this2.get('binCount') * Utils.posMod(sample.angleXY, Utils.TAU) / Utils.TAU); // Get the bin in which the angle falls
                  // I checked whether the calculation of the angleXY has been done by calculating the atan2, or acos of the sample speeds. Only in cases the speed is zero did the values for both deviate. So, sample.angleXY is as good as it gets.
                  var _iteratorNormalCompletion5 = true;
                  var _didIteratorError5 = false;
                  var _iteratorError5 = undefined;

                  try {
                    for (var _iterator5 = graphs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                      int = _step5.value;

                      if (int.sampleStart <= sample.time && int.sampleEnd > sample.time) {
                        int.bins[bin].frequency += 1;
                      }
                    }
                  } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                      }
                    } finally {
                      if (_didIteratorError5) {
                        throw _iteratorError5;
                      }
                    }
                  }
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

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = graphs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              int = _step3.value;
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                for (var _iterator6 = lightConfig[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var lights = _step6.value;

                  if (lights.timeStart <= int.time && int.time < lights.timeEnd) {
                    if (lights.lightDir[0] == 0 && lights.lightDir[1] == 0) {
                      int.numEugs = int.bins.reduce(function (acc, curr) {
                        return acc + curr.frequency;
                      }, 0);
                      int.mean = 90;
                      int.s = 0;
                    } else {
                      numNonZeroWeights = 0;
                      var _iteratorNormalCompletion7 = true;
                      var _didIteratorError7 = false;
                      var _iteratorError7 = undefined;

                      try {
                        for (var _iterator7 = int.bins[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                          var _bin = _step7.value;

                          // let v_eug = [Math.cos(bin.avgBinAngle), Math.sin(bin.avgBinAngle)];
                          // let angleDiff = Math.acos(lights.lightDir[0]*v_eug[0] + lights.lightDir[1]*v_eug[1]);
                          // angleDiff = Math.min(angleDiff + Math.PI, Math.PI - angleDiff);
                          // angleDiff = Math.abs(angleDiff);
                          // bin.angleDiff = angleDiff * 180 / Math.PI;
                          if (0 < _bin.avgBinAngle && _bin.avgBinAngle <= Math.PI / 2) {
                            _bin.angleDiff = _bin.avgBinAngle;
                          } else if (Math.PI / 2 < _bin.avgBinAngle && _bin.avgBinAngle <= Math.PI) {
                            _bin.angleDiff = _bin.avgBinAngle - Math.PI / 2;
                          } else if (Math.PI < _bin.avgBinAngle && _bin.avgBinAngle <= 3 / 2 * Math.PI) {
                            _bin.angleDiff = _bin.avgBinAngle - Math.PI;
                          } else if (3 / 2 * Math.PI < _bin.avgBinAngle && _bin.avgBinAngle <= 2 * Math.PI) {
                            _bin.angleDiff = 2 * Math.PI - _bin.avgBinAngle;
                          }
                          _bin.angleDiff = _bin.angleDiff * 180 / Math.PI;
                          if (_bin.frequency > 0) numNonZeroWeights += 1;
                        }

                        // Calculate the weighted mean and standard deviation
                      } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                          }
                        } finally {
                          if (_didIteratorError7) {
                            throw _iteratorError7;
                          }
                        }
                      }

                      int.numEugs = int.bins.reduce(function (acc, curr) {
                        return acc + curr.frequency;
                      }, 0);
                      int.mean = int.bins.reduce(function (acc, curr) {
                        return acc + curr.angleDiff * curr.frequency;
                      }, 0) / int.numEugs;
                      var weightedStd = int.bins.map(function (elem) {
                        return elem.frequency * Math.pow(elem.angleDiff - int.mean, 2);
                      }).reduce(function (v, c) {
                        return v + c;
                      }, 0);
                      int.s = Math.sqrt(weightedStd / ((numNonZeroWeights - 1) / numNonZeroWeights * int.numEugs));
                    }
                  }
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }
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

          pdata[rlayer] = {
            graphs: graphs,
            runTime: rdata.runTime,
            color: rlayer == layer ? color : null,
            showLayer: rlayer == layer ? true : _this2.get('data.' + rlayer + '.showLayer')
          };
        };

        for (var rlayer in this.get('raw')) {
          var numNonZeroWeights;

          _loop2(rlayer);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9vcmllbnRhdGlvbmNoYW5nZWdyYXBoL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiR2xvYmFscyIsImRlZmF1bHRzIiwidlJhbmdlIiwic3RkQmFuZCIsImRUIiwiZFRfQW5nbGUiLCJ3aWR0aCIsImhlaWdodCIsImRhdGEiLCJyYXciLCJtYXJnaW5zIiwidG9wIiwibGVmdCIsImJvdHRvbSIsInJpZ2h0IiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiLCJiaW5kTWV0aG9kcyIsImxheWVyIiwibGlnaHRDb25maWciLCJjb2xvciIsInNldCIsImFjY190aW1lIiwidl9saWdodCIsImsiLCJ2X2xlbmd0aCIsIk1hdGgiLCJzcXJ0IiwibWFwIiwieCIsImxpZ2h0RGlyIiwidGltZVN0YXJ0IiwidGltZUVuZCIsImR1cmF0aW9uIiwidXNlZFZSYW5nZSIsImdldCIsInBkYXRhIiwicmxheWVyIiwicmRhdGEiLCJpbnRlcnZhbHMiLCJpIiwiaiIsInBhcnNlZCIsInRyYWNrIiwic2FtcGxlIiwiaW50IiwiYmluIiwibWF4QmluVmFsdWUiLCJncmFwaHMiLCJudW1GcmFtZXMiLCJmcHMiLCJ0aW1lIiwic2FtcGxlU3RhcnQiLCJtaW4iLCJzYW1wbGVFbmQiLCJiaW5zIiwibWVhbiIsInMiLCJwdXNoIiwidGhldGFTdGFydCIsIlRBVSIsInRoZXRhRW5kIiwiYXZnQmluQW5nbGUiLCJmcmVxdWVuY3kiLCJ0cmFja3MiLCJzYW1wbGVzIiwiZmxvb3IiLCJwb3NNb2QiLCJhbmdsZVhZIiwibGlnaHRzIiwibnVtRXVncyIsInJlZHVjZSIsImFjYyIsImN1cnIiLCJudW1Ob25aZXJvV2VpZ2h0cyIsIlBJIiwiYW5nbGVEaWZmIiwid2VpZ2h0ZWRTdGQiLCJlbGVtIiwicG93IiwidiIsImMiLCJydW5UaW1lIiwic2hvd0xheWVyIiwic2hvd0xheWVyTGl2ZSJdLCJtYXBw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QSxNQUFULElBQW1CLEtBQUtGLEdBQUwsQ0FBUyxLQUFULENBQW5CLEVBQW9DO0FBQUEsY0FnRHRCdUMsaUJBaERzQjs7QUFBQSxpQkFBM0JyQyxNQUEyQjtBQStFbkM7QUFDRCxhQUFLaEIsR0FBTCxDQUFTLE1BQVQsRUFBaUJlLEtBQWpCO0FBQ0Q7QUFuSUg7QUFBQTtBQUFBLG1DQXFJZWdELGFBcklmLEVBcUk4QjtBQUMxQixhQUFLL0QsR0FBTCx3QkFBZ0MrRCxhQUFoQztBQUNEO0FBdklIO0FBQUE7QUFBQSw4QkF5SVU7QUFDTixhQUFLL0QsR0FBTCxDQUFTLE1BQVQsRUFBaUIsRUFBakI7QUFDRDtBQTNJSDs7QUFBQTtBQUFBLElBQTRDdkIsS0FBNUM7QUE2SUQsQ0FwS0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L29yaWVudGF0aW9uY2hhbmdlZ3JhcGgvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kZWwgPSByZXF1aXJlKCdjb3JlL21vZGVsL21vZGVsJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHZSYW5nZTogMzYwLFxuICAgICAgc3RkQmFuZDogdHJ1ZSxcbiAgICAgIGRUOiAxLFxuICAgICAgZFRfQW5nbGU6IDE1LFxuICAgICAgd2lkdGg6IDQwMCxcbiAgICAgIGhlaWdodDogMzAwLFxuICAgICAgZGF0YToge30sXG4gICAgICByYXc6IHt9LFxuICAgICAgbWFyZ2luczoge1xuICAgICAgICB0b3A6IDIwLFxuICAgICAgICBsZWZ0OiA0MCxcbiAgICAgICAgYm90dG9tOiA0MCxcbiAgICAgICAgcmlnaHQ6IDIwXG4gICAgICB9XG4gICAgfVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIE9yaWVudGF0aW9uQ2hhbmdlTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydwYXJzZURhdGEnXSk7XG5cbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSwgbGF5ZXIgPSAnZGVmYXVsdCcsIGxpZ2h0Q29uZmlnLCBjb2xvcikge1xuICAgICAgdGhpcy5zZXQoYHJhdy4ke2xheWVyfWAsIGRhdGEpO1xuICAgICAgLy8gT3JpZW50YXRpb24gb2YgMCBwb2ludHMgdG8gdGhlIHJpZ2h0LlxuXG4gICAgICBpZiAobGlnaHRDb25maWcpIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBsaWdodCBkaXJlY3Rpb24gZm9yIGVhY2ggdGltZSBiYW5kIGFuZCB0aGUgYWNjdW11bGF0ZWQgdGltZVxuICAgICAgICB2YXIgYWNjX3RpbWUgPSAwXG4gICAgICAgIGZvciAobGV0IGNvbmZpZyBvZiBsaWdodENvbmZpZykge1xuICAgICAgICAgIGxldCB2X2xpZ2h0ID0gWzAsMF07XG4gICAgICAgICAgZm9yIChsZXQgayBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoaykge1xuICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgIHZfbGlnaHRbMF0gKz0gY29uZmlnW2tdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICB2X2xpZ2h0WzBdICs9IC1jb25maWdba107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgICAgICAgICAgICB2X2xpZ2h0WzFdICs9IGNvbmZpZ1trXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICAgIHZfbGlnaHRbMV0gKz0gLWNvbmZpZ1trXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IHZfbGVuZ3RoID0gTWF0aC5zcXJ0KHZfbGlnaHRbMF0qdl9saWdodFswXSArIHZfbGlnaHRbMV0qdl9saWdodFsxXSk7XG4gICAgICAgICAgdl9sZW5ndGggPSB2X2xlbmd0aD09PTAgPyAxIDogdl9sZW5ndGg7XG4gICAgICAgICAgdl9saWdodCA9IHZfbGlnaHQubWFwKGZ1bmN0aW9uKHgpIHtyZXR1cm4geCAvIHZfbGVuZ3RofSk7XG4gICAgICAgICAgY29uZmlnLmxpZ2h0RGlyID0gdl9saWdodFxuICAgICAgICAgIGNvbmZpZy50aW1lU3RhcnQgPSBhY2NfdGltZTtcbiAgICAgICAgICBjb25maWcudGltZUVuZCA9IGFjY190aW1lICsgY29uZmlnLmR1cmF0aW9uO1xuICAgICAgICAgIGFjY190aW1lICs9IGNvbmZpZy5kdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuXG5cbiAgICAgIC8vIHNldCB0aGUgcmFuZ2UgZm9yIHRoZSB2ZXJ0aWNhbCBheGlzOiAxODAgZGVncmVlcyBpcyBhd2F5IGZyb20gbGlnaHQ7IDAgZGVncmVlcyBpcyB0b3dhcmRzIGxpZ2h0OyA5MCBkZWdyZWVzIGlzIG5laXRoZXIgb3IuXG4gICAgICB2YXIgdXNlZFZSYW5nZSA9IHRoaXMuZ2V0KCd2UmFuZ2UnKTtcblxuICAgICAgbGV0IHBkYXRhID0ge307XG5cbiAgICAgIGZvciAobGV0IHJsYXllciBpbiB0aGlzLmdldCgncmF3JykpIHtcbiAgICAgICAgbGV0IHJkYXRhID0gdGhpcy5nZXQoYHJhdy4ke3JsYXllcn1gKTtcblxuICAgICAgICAvLyBGb3IgZWFjaCBmcmFtZSBnZW5lcmF0ZSB0aGUgcmVsZXZhbnQgZGF0YSBzdHJ1Y3R1cmUgZm9yIHRoZSBncmFwaCAtIGhlcmUsIGl0IGhhcyB0byBoYWV2IGEgdGltZSB2YWx1ZSwgYSBtZWFuIGFuZCBhIHN0YW5kYXJkIGRldmlhdGlvbiBzIGF0IGV2ZXJ5IHRpbWUgcG9pbnQuXG4gICAgICAgIGxldCBpbnRlcnZhbHMsIGksIGosIHBhcnNlZCwgdHJhY2ssIHNhbXBsZSwgaW50LCBiaW4sIG1heEJpblZhbHVlO1xuICAgICAgICBsZXQgZ3JhcGhzID0gW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHJkYXRhLm51bUZyYW1lcyAvIHJkYXRhLmZwczsgaSArPSB0aGlzLmdldCgndFN0ZXAnKSkge1xuICAgICAgICAgIHBhcnNlZCA9IHtcbiAgICAgICAgICAgIHRpbWU6IGksXG4gICAgICAgICAgICBzYW1wbGVTdGFydDogTWF0aC5taW4oaSArIHRoaXMuZ2V0KCd0U3RlcCcpLCByZGF0YS5udW1GcmFtZXMgLyByZGF0YS5mcHMpIC0gdGhpcy5nZXQoJ2RUJyksXG4gICAgICAgICAgICBzYW1wbGVFbmQ6IE1hdGgubWluKGkgKyB0aGlzLmdldCgndFN0ZXAnKSwgcmRhdGEubnVtRnJhbWVzIC8gcmRhdGEuZnBzKSxcbiAgICAgICAgICAgIGJpbnM6IFtdLFxuICAgICAgICAgICAgbWVhbjogbnVsbCxcbiAgICAgICAgICAgIHM6IG51bGxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGZvciAoaiA9IDAgOyBqIDwgdGhpcy5nZXQoJ2JpbkNvdW50Jyk7IGorKykge1xuICAgICAgICAgICAgcGFyc2VkLmJpbnMucHVzaCh7IC8vIHBhcnNlZCBjb250YWlucyB0aGUgZnJlcXVlbmN5IHBlciBiaW5cbiAgICAgICAgICAgICAgdGhldGFTdGFydDogaiAqIFV0aWxzLlRBVSAvIHRoaXMuZ2V0KCdiaW5Db3VudCcpLCAvLyBVdGlscy5UQVUgPSAyKk1BVEguUElcbiAgICAgICAgICAgICAgdGhldGFFbmQ6IChqKzEpICogVXRpbHMuVEFVIC8gdGhpcy5nZXQoJ2JpbkNvdW50JyksXG4gICAgICAgICAgICAgIGF2Z0JpbkFuZ2xlOiAoMiAqIGogKyAxKSAqIFV0aWxzLlRBVSAvICgyICogdGhpcy5nZXQoJ2JpbkNvdW50JykpLFxuICAgICAgICAgICAgICBmcmVxdWVuY3k6IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGdyYXBocy5wdXNoKHBhcnNlZCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHRyYWNrIG9mIHJkYXRhLnRyYWNrcykge1xuICAgICAgICAgIGZvciAoc2FtcGxlIG9mIHRyYWNrLnNhbXBsZXMpIHtcbiAgICAgICAgICAgIGJpbiA9IE1hdGguZmxvb3IodGhpcy5nZXQoJ2JpbkNvdW50JykgKiBVdGlscy5wb3NNb2Qoc2FtcGxlLmFuZ2xlWFksIFV0aWxzLlRBVSkgLyBVdGlscy5UQVUpOyAvLyBHZXQgdGhlIGJpbiBpbiB3aGljaCB0aGUgYW5nbGUgZmFsbHNcbiAgICAgICAgICAgIC8vIEkgY2hlY2tlZCB3aGV0aGVyIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGUgYW5nbGVYWSBoYXMgYmVlbiBkb25lIGJ5IGNhbGN1bGF0aW5nIHRoZSBhdGFuMiwgb3IgYWNvcyBvZiB0aGUgc2FtcGxlIHNwZWVkcy4gT25seSBpbiBjYXNlcyB0aGUgc3BlZWQgaXMgemVybyBkaWQgdGhlIHZhbHVlcyBmb3IgYm90aCBkZXZpYXRlLiBTbywgc2FtcGxlLmFuZ2xlWFkgaXMgYXMgZ29vZCBhcyBpdCBnZXRzLlxuICAgICAgICAgICAgZm9yIChpbnQgb2YgZ3JhcGhzKSB7XG4gICAgICAgICAgICAgIGlmIChpbnQuc2FtcGxlU3RhcnQgPD0gc2FtcGxlLnRpbWUgJiYgaW50LnNhbXBsZUVuZCA+IHNhbXBsZS50aW1lKSB7XG4gICAgICAgICAgICAgICAgaW50LmJpbnNbYmluXS5mcmVxdWVuY3kgKz0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaW50IG9mIGdyYXBocykge1xuICAgICAgICAgIGZvciAobGV0IGxpZ2h0cyBvZiBsaWdodENvbmZpZykge1xuICAgICAgICAgICAgaWYgKGxpZ2h0cy50aW1lU3RhcnQgPD0gaW50LnRpbWUgJiYgaW50LnRpbWUgPCBsaWdodHMudGltZUVuZCkge1xuICAgICAgICAgICAgICBpZiAobGlnaHRzLmxpZ2h0RGlyWzBdPT0wICYmIGxpZ2h0cy5saWdodERpclsxXT09MCkge1xuICAgICAgICAgICAgICAgIGludC5udW1FdWdzID0gaW50LmJpbnMucmVkdWNlKChhY2MsIGN1cnIpID0+IGFjYyArIGN1cnIuZnJlcXVlbmN5LDApXG4gICAgICAgICAgICAgICAgaW50Lm1lYW4gPSA5MDtcbiAgICAgICAgICAgICAgICBpbnQucyA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbnVtTm9uWmVyb1dlaWdodHMgPSAwXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYmluIG9mIGludC5iaW5zKSB7XG4gICAgICAgICAgICAgICAgICAvLyBsZXQgdl9ldWcgPSBbTWF0aC5jb3MoYmluLmF2Z0JpbkFuZ2xlKSwgTWF0aC5zaW4oYmluLmF2Z0JpbkFuZ2xlKV07XG4gICAgICAgICAgICAgICAgICAvLyBsZXQgYW5nbGVEaWZmID0gTWF0aC5hY29zKGxpZ2h0cy5saWdodERpclswXSp2X2V1Z1swXSArIGxpZ2h0cy5saWdodERpclsxXSp2X2V1Z1sxXSk7XG4gICAgICAgICAgICAgICAgICAvLyBhbmdsZURpZmYgPSBNYXRoLm1pbihhbmdsZURpZmYgKyBNYXRoLlBJLCBNYXRoLlBJIC0gYW5nbGVEaWZmKTtcbiAgICAgICAgICAgICAgICAgIC8vIGFuZ2xlRGlmZiA9IE1hdGguYWJzKGFuZ2xlRGlmZik7XG4gICAgICAgICAgICAgICAgICAvLyBiaW4uYW5nbGVEaWZmID0gYW5nbGVEaWZmICogMTgwIC8gTWF0aC5QSTtcbiAgICAgICAgICAgICAgICAgIGlmICgwIDwgYmluLmF2Z0JpbkFuZ2xlICYmIGJpbi5hdmdCaW5BbmdsZSA8PSBNYXRoLlBJIC8gMikgeyBiaW4uYW5nbGVEaWZmID0gYmluLmF2Z0JpbkFuZ2xlO31cbiAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKE1hdGguUEkvMiA8IGJpbi5hdmdCaW5BbmdsZSAmJiBiaW4uYXZnQmluQW5nbGUgPD0gTWF0aC5QSSkgeyBiaW4uYW5nbGVEaWZmID0gYmluLmF2Z0JpbkFuZ2xlIC0gTWF0aC5QSSAvIDI7IH1cbiAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKE1hdGguUEkgPCBiaW4uYXZnQmluQW5nbGUgJiYgYmluLmF2Z0JpbkFuZ2xlIDw9IDMvMiAqIE1hdGguUEkpIHsgYmluLmFuZ2xlRGlmZiA9IGJpbi5hdmdCaW5BbmdsZSAtIE1hdGguUEk7IH1cbiAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKDMvMiAqIE1hdGguUEkgPCBiaW4uYXZnQmluQW5nbGUgJiYgYmluLmF2Z0JpbkFuZ2xlIDw9IDIgKiBNYXRoLlBJKSB7IGJpbi5hbmdsZURpZmYgPSAyKk1hdGguUEkgLSBiaW4uYXZnQmluQW5nbGU7IH1cbiAgICAgICAgICAgICAgICAgIGJpbi5hbmdsZURpZmYgPSBiaW4uYW5nbGVEaWZmICogMTgwIC8gTWF0aC5QSTtcbiAgICAgICAgICAgICAgICAgIGlmIChiaW4uZnJlcXVlbmN5PjApIG51bU5vblplcm9XZWlnaHRzICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSB3ZWlnaHRlZCBtZWFuIGFuZCBzdGFuZGFyZCBkZXZpYXRpb25cbiAgICAgICAgICAgICAgICBpbnQubnVtRXVncyA9IGludC5iaW5zLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBhY2MgKyBjdXJyLmZyZXF1ZW5jeSwwKVxuICAgICAgICAgICAgICAgIGludC5tZWFuID0gaW50LmJpbnMucmVkdWNlKChhY2MsIGN1cnIpID0+IGFjYyArIGN1cnIuYW5nbGVEaWZmICogY3Vyci5mcmVxdWVuY3ksIDApIC8gaW50Lm51bUV1Z3M7XG4gICAgICAgICAgICAgICAgbGV0IHdlaWdodGVkU3RkID0gaW50LmJpbnMubWFwKChlbGVtKSA9PiBlbGVtLmZyZXF1ZW5jeSAqIE1hdGgucG93KGVsZW0uYW5nbGVEaWZmIC0gaW50Lm1lYW4sMikpLnJlZHVjZSgodixjKSA9PiB2ICsgYywwKTtcbiAgICAgICAgICAgICAgICBpbnQucyA9IE1hdGguc3FydCh3ZWlnaHRlZFN0ZCAvICgobnVtTm9uWmVyb1dlaWdodHMgLSAxKSAvIG51bU5vblplcm9XZWlnaHRzICogaW50Lm51bUV1Z3MpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBkYXRhW3JsYXllcl0gPSB7XG4gICAgICAgICAgZ3JhcGhzOiBncmFwaHMsXG4gICAgICAgICAgcnVuVGltZTogcmRhdGEucnVuVGltZSxcbiAgICAgICAgICBjb2xvcjogcmxheWVyID09IGxheWVyID8gY29sb3IgOiBudWxsLFxuICAgICAgICAgIHNob3dMYXllcjogKHJsYXllciA9PSBsYXllcikgPyB0cnVlIDogdGhpcy5nZXQoYGRhdGEuJHtybGF5ZXJ9LnNob3dMYXllcmApXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB0aGlzLnNldCgnZGF0YScsIHBkYXRhKTtcbiAgICB9XG5cbiAgICBzZXRMYXllckxpdmUoc2hvd0xheWVyTGl2ZSkge1xuICAgICAgdGhpcy5zZXQoYGRhdGEubGl2ZS5zaG93TGF5ZXJgLCBzaG93TGF5ZXJMaXZlKVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5zZXQoJ2RhdGEnLCB7fSk7XG4gICAgfVxuICB9XG59KVxuIl19
