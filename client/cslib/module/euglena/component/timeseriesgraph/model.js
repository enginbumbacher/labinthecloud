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
    vRange: null,
    mode: 'total',
    stdBand: true,
    dT: 1,
    width: 400,
    height: 300,
    data: {},
    raw: {},
    margins: {
      top: 40,
      left: 40,
      bottom: 40,
      right: 20
    }
  };

  return function (_Model) {
    _inherits(TimeSeriesModel, _Model);

    function TimeSeriesModel() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, TimeSeriesModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (TimeSeriesModel.__proto__ || Object.getPrototypeOf(TimeSeriesModel)).call(this, config));
    }

    _createClass(TimeSeriesModel, [{
      key: 'parseData',
      value: function parseData(data) {
        var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

        var _this2 = this;

        var lightConfig = arguments[2];
        var color = arguments[3];

        this.set('raw.' + layer, data);
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

        this.set('lightConfig', lightConfig);

        // set the range for the vertical axis
        // vRange: if it is given as a parameter, choose it.
        // The structure of the data:
        // this.get('raw').live.tracks --> Array of tracks for each recorded Euglena. Each element has an array of samples, which corresponds to the info for that specific Euglena.
        // this.get('raw').live.tracks[0].samples --> Each sample has the following dictionary {angleXY, speed, speedX, speedY, time, x, y, yaw}
        var usedVrange = Globals.get('AppConfig.histogram.vRange') ? this.get('vRange') : Object.values(this.get('raw')).reduce(function (acc, val) {
          return Math.max(acc, val.tracks.reduce(function (tacc, tval) {
            return Math.max(tacc, tval.samples.filter(function (a) {
              return Utils.exists(a.speed);
            }).reduce(function (sacc, sval) {
              return Math.max(sacc, _this2.get('mode') == 'component' ? Math.max(Math.abs(sval.speedX), Math.abs(sval.speedY)) : sval.speed);
            }, 0));
          }, 0));
        }, 0);
        usedVrange = Math.ceil(usedVrange);

        var pdata = {};

        for (var rlayer in this.get('raw')) {
          var rdata = this.get('raw.' + rlayer);
          var graphs = {};
          if (this.get('mode') == 'component') {
            graphs.x = [];
            graphs.y = [];
          } else {
            graphs.total = [];
          }

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
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = track.samples[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var sample = _step4.value;

                  if (!sample.speed) continue;
                  if (this.get('mode') == 'component') {
                    if (Math.abs(sample.speedX) > usedVrange || Math.abs(sample.speedY) > usedVrange) continue;
                  } else {
                    if (Math.abs(sample.speed) > usedVrange) continue;
                  }
                  var sampleFrame = Math.round(sample.time * rdata.fps);
                  if (this.get('mode') == 'component') {
                    // Either display information for x and y speed separately, or the total speed.
                    graphs.x[sampleFrame - 1].samples.push(sample.speedX);
                    graphs.y[sampleFrame - 1].samples.push(sample.speedY);
                  } else {
                    graphs.total[sampleFrame - 1].samples.push(sample.speed);
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

    return TimeSeriesModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZGVsIiwiVXRpbHMiLCJHbG9iYWxzIiwiZGVmYXVsdHMiLCJ2UmFuZ2UiLCJtb2RlIiwic3RkQmFuZCIsImRUIiwid2lkdGgiLCJoZWlnaHQiLCJkYXRhIiwicmF3IiwibWFyZ2lucyIsInRvcCIsImxlZnQiLCJib3R0b20iLCJyaWdodCIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwibGF5ZXIiLCJsaWdodENvbmZpZyIsImNvbG9yIiwic2V0IiwiYWNjX3RpbWUiLCJ2X2xpZ2h0IiwiayIsInZfbGVuZ3RoIiwiTWF0aCIsInNxcnQiLCJtYXAiLCJ4IiwibGlnaHREaXIiLCJ0aW1lU3RhcnQiLCJ0aW1lRW5kIiwiZHVyYXRpb24iLCJ1c2VkVnJhbmdlIiwiZ2V0IiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwidmFsIiwibWF4IiwidHJhY2tzIiwidGFjYyIsInR2YWwiLCJzYW1wbGVzIiwiZmlsdGVyIiwiYSIsImV4aXN0cyIsInNwZWVkIiwic2FjYyIsInN2YWwiLCJhYnMiLCJzcGVlZFgiLCJzcGVlZFkiLCJjZWlsIiwicGRhdGEiLCJybGF5ZXIiLCJyZGF0YSIsImdyYXBocyIsInkiLCJ0b3RhbCIsImkiLCJudW1GcmFtZXMiLCJrZXkiLCJwdXNoIiwiZnJhbWUiLCJ0aW1lIiwiZnBzIiwibWVhbiIsInMiLCJ0cmFjayIsInNhbXBsZSIsInNhbXBsZUZyYW1lIiwicm91bmQiLCJtYXhEaXNwbGF5IiwibGVuZ3RoIiwidiIsImMiLCJwb3ciLCJtYXhWYWx1ZSIsInJ1blRpbWUiLCJzaG93TGF5ZXIiLCJzaG93TGF5ZXJMaXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFB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QTlISDs7QUFBQTtBQUFBLElBQXFDdEIsS0FBckM7QUFnSUQsQ0F2SkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3RpbWVzZXJpZXNncmFwaC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgdlJhbmdlOiBudWxsLFxuICAgICAgbW9kZTogJ3RvdGFsJyxcbiAgICAgIHN0ZEJhbmQ6IHRydWUsXG4gICAgICBkVDogMSxcbiAgICAgIHdpZHRoOiA0MDAsXG4gICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgIGRhdGE6IHt9LFxuICAgICAgcmF3OiB7fSxcbiAgICAgIG1hcmdpbnM6IHtcbiAgICAgICAgdG9wOiA0MCxcbiAgICAgICAgbGVmdDogNDAsXG4gICAgICAgIGJvdHRvbTogNDAsXG4gICAgICAgIHJpZ2h0OiAyMFxuICAgICAgfVxuICAgIH1cbiAgO1xuXG4gIHJldHVybiBjbGFzcyBUaW1lU2VyaWVzTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSwgbGF5ZXIgPSAnZGVmYXVsdCcsIGxpZ2h0Q29uZmlnLCBjb2xvcikge1xuICAgICAgdGhpcy5zZXQoYHJhdy4ke2xheWVyfWAsIGRhdGEpO1xuICAgICAgaWYgKGxpZ2h0Q29uZmlnKSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgbGlnaHQgZGlyZWN0aW9uIGZvciBlYWNoIHRpbWUgYmFuZCBhbmQgdGhlIGFjY3VtdWxhdGVkIHRpbWVcbiAgICAgICAgdmFyIGFjY190aW1lID0gMFxuICAgICAgICBmb3IgKGxldCBjb25maWcgb2YgbGlnaHRDb25maWcpIHtcbiAgICAgICAgICBsZXQgdl9saWdodCA9IFswLDBdO1xuICAgICAgICAgIGZvciAobGV0IGsgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGspIHtcbiAgICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICB2X2xpZ2h0WzBdICs9IGNvbmZpZ1trXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgdl9saWdodFswXSArPSAtY29uZmlnW2tdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIFwidG9wXCI6XG4gICAgICAgICAgICAgICAgdl9saWdodFsxXSArPSBjb25maWdba107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgXCJib3R0b21cIjpcbiAgICAgICAgICAgICAgICB2X2xpZ2h0WzFdICs9IC1jb25maWdba107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCB2X2xlbmd0aCA9IE1hdGguc3FydCh2X2xpZ2h0WzBdKnZfbGlnaHRbMF0gKyB2X2xpZ2h0WzFdKnZfbGlnaHRbMV0pO1xuICAgICAgICAgIHZfbGVuZ3RoID0gdl9sZW5ndGg9PT0wID8gMSA6IHZfbGVuZ3RoO1xuICAgICAgICAgIHZfbGlnaHQgPSB2X2xpZ2h0Lm1hcChmdW5jdGlvbih4KSB7cmV0dXJuIHggLyB2X2xlbmd0aH0pO1xuICAgICAgICAgIGNvbmZpZy5saWdodERpciA9IHZfbGlnaHRcbiAgICAgICAgICBjb25maWcudGltZVN0YXJ0ID0gYWNjX3RpbWU7XG4gICAgICAgICAgY29uZmlnLnRpbWVFbmQgPSBhY2NfdGltZSArIGNvbmZpZy5kdXJhdGlvbjtcbiAgICAgICAgICBhY2NfdGltZSArPSBjb25maWcuZHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXQoJ2xpZ2h0Q29uZmlnJywgbGlnaHRDb25maWcpXG5cblxuICAgICAgLy8gc2V0IHRoZSByYW5nZSBmb3IgdGhlIHZlcnRpY2FsIGF4aXNcbiAgICAgIC8vIHZSYW5nZTogaWYgaXQgaXMgZ2l2ZW4gYXMgYSBwYXJhbWV0ZXIsIGNob29zZSBpdC5cbiAgICAgIC8vIFRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGRhdGE6XG4gICAgICAvLyB0aGlzLmdldCgncmF3JykubGl2ZS50cmFja3MgLS0+IEFycmF5IG9mIHRyYWNrcyBmb3IgZWFjaCByZWNvcmRlZCBFdWdsZW5hLiBFYWNoIGVsZW1lbnQgaGFzIGFuIGFycmF5IG9mIHNhbXBsZXMsIHdoaWNoIGNvcnJlc3BvbmRzIHRvIHRoZSBpbmZvIGZvciB0aGF0IHNwZWNpZmljIEV1Z2xlbmEuXG4gICAgICAvLyB0aGlzLmdldCgncmF3JykubGl2ZS50cmFja3NbMF0uc2FtcGxlcyAtLT4gRWFjaCBzYW1wbGUgaGFzIHRoZSBmb2xsb3dpbmcgZGljdGlvbmFyeSB7YW5nbGVYWSwgc3BlZWQsIHNwZWVkWCwgc3BlZWRZLCB0aW1lLCB4LCB5LCB5YXd9XG4gICAgICBsZXQgdXNlZFZyYW5nZSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuaGlzdG9ncmFtLnZSYW5nZScpID8gdGhpcy5nZXQoJ3ZSYW5nZScpIDogT2JqZWN0LnZhbHVlcyh0aGlzLmdldCgncmF3JykpLnJlZHVjZSgoYWNjLCB2YWwpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGFjYywgdmFsLnRyYWNrcy5yZWR1Y2UoKHRhY2MsIHR2YWwpID0+IHtcbiAgICAgICAgICByZXR1cm4gTWF0aC5tYXgodGFjYywgdHZhbC5zYW1wbGVzLmZpbHRlcigoYSkgPT4gVXRpbHMuZXhpc3RzKGEuc3BlZWQpKS5yZWR1Y2UoKHNhY2MsIHN2YWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChzYWNjLCB0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnID8gTWF0aC5tYXgoTWF0aC5hYnMoc3ZhbC5zcGVlZFgpLCBNYXRoLmFicyhzdmFsLnNwZWVkWSkpIDogc3ZhbC5zcGVlZCk7XG4gICAgICAgICAgfSwgMCkpO1xuICAgICAgICB9LCAwKSk7XG4gICAgICB9LCAwKTtcbiAgICAgIHVzZWRWcmFuZ2UgPSBNYXRoLmNlaWwodXNlZFZyYW5nZSk7XG5cbiAgICAgIGxldCBwZGF0YSA9IHt9O1xuXG4gICAgICBmb3IgKGxldCBybGF5ZXIgaW4gdGhpcy5nZXQoJ3JhdycpKSB7XG4gICAgICAgIGxldCByZGF0YSA9IHRoaXMuZ2V0KGByYXcuJHtybGF5ZXJ9YCk7XG4gICAgICAgIGxldCBncmFwaHMgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHtcbiAgICAgICAgICBncmFwaHMueCA9IFtdO1xuICAgICAgICAgIGdyYXBocy55ID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JhcGhzLnRvdGFsID0gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb3IgZWFjaCBmcmFtZSBnZW5lcmF0ZSB0aGUgcmVsZXZhbnQgZGF0YSBzdHJ1Y3R1cmUgZm9yIHRoZSBncmFwaCAtIGhlcmUsIGl0IGhhcyB0byBoYWV2IGEgdGltZSB2YWx1ZSwgYSBtZWFuIGFuZCBhIHN0YW5kYXJkIGRldmlhdGlvbiBzIGF0IGV2ZXJ5IHRpbWUgcG9pbnQuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmRhdGEubnVtRnJhbWVzOyBpKyspIHtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gZ3JhcGhzKSB7XG4gICAgICAgICAgICBncmFwaHNba2V5XS5wdXNoKHtcbiAgICAgICAgICAgICAgZnJhbWU6IGksXG4gICAgICAgICAgICAgIHRpbWU6IGkgLyByZGF0YS5mcHMsXG4gICAgICAgICAgICAgIHNhbXBsZXM6IFtdLFxuICAgICAgICAgICAgICBtZWFuOiBudWxsLFxuICAgICAgICAgICAgICBzOiBudWxsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCB0cmFjayBvZiByZGF0YS50cmFja3MpIHtcbiAgICAgICAgICBmb3IgKGxldCBzYW1wbGUgb2YgdHJhY2suc2FtcGxlcykge1xuICAgICAgICAgICAgaWYgKCFzYW1wbGUuc3BlZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNhbXBsZS5zcGVlZFgpID4gdXNlZFZyYW5nZSB8fCBNYXRoLmFicyhzYW1wbGUuc3BlZWRZKSA+IHVzZWRWcmFuZ2UpIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNhbXBsZS5zcGVlZCkgPiB1c2VkVnJhbmdlKSBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBzYW1wbGVGcmFtZSA9IE1hdGgucm91bmQoc2FtcGxlLnRpbWUgKiByZGF0YS5mcHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHsgLy8gRWl0aGVyIGRpc3BsYXkgaW5mb3JtYXRpb24gZm9yIHggYW5kIHkgc3BlZWQgc2VwYXJhdGVseSwgb3IgdGhlIHRvdGFsIHNwZWVkLlxuICAgICAgICAgICAgICBncmFwaHMueFtzYW1wbGVGcmFtZS0xXS5zYW1wbGVzLnB1c2goc2FtcGxlLnNwZWVkWCk7XG4gICAgICAgICAgICAgIGdyYXBocy55W3NhbXBsZUZyYW1lLTFdLnNhbXBsZXMucHVzaChzYW1wbGUuc3BlZWRZKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGdyYXBocy50b3RhbFtzYW1wbGVGcmFtZS0xXS5zYW1wbGVzLnB1c2goc2FtcGxlLnNwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgdGhlIG1lYW4gYW5kIHN0YW5kYXJkIGRldmlhdGlvblxuICAgICAgICBsZXQgbWF4RGlzcGxheSA9IDA7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBncmFwaHMpIHtcbiAgICAgICAgICBmb3IgKGxldCBmcmFtZSBvZiBncmFwaHNba2V5XSkge1xuICAgICAgICAgICAgaWYgKGZyYW1lLnNhbXBsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGZyYW1lLm1lYW4gPSBmcmFtZS5zYW1wbGVzLnJlZHVjZSgodiwgYykgPT4gdiArIGMsIDApIC8gZnJhbWUuc2FtcGxlcy5sZW5ndGg7XG4gICAgICAgICAgICAgIGZyYW1lLnMgPSBNYXRoLnNxcnQoZnJhbWUuc2FtcGxlcy5tYXAoKHYpID0+IE1hdGgucG93KHYgLSBmcmFtZS5tZWFuLCAyKSkucmVkdWNlKCh2LCBjKSA9PiB2ICsgYywgMCkgLyBmcmFtZS5zYW1wbGVzLmxlbmd0aCk7XG4gICAgICAgICAgICAgIG1heERpc3BsYXkgPSBNYXRoLm1heChtYXhEaXNwbGF5LCBNYXRoLm1heChNYXRoLmFicyhmcmFtZS5tZWFuICsgZnJhbWUucyksIE1hdGguYWJzKGZyYW1lLm1lYW4gLSBmcmFtZS5zKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwZGF0YVtybGF5ZXJdID0ge1xuICAgICAgICAgIGdyYXBoczogZ3JhcGhzLFxuICAgICAgICAgIG1heFZhbHVlOiBtYXhEaXNwbGF5LFxuICAgICAgICAgIHJ1blRpbWU6IHJkYXRhLnJ1blRpbWUsXG4gICAgICAgICAgY29sb3I6IHJsYXllciA9PSBsYXllciA/IGNvbG9yIDogbnVsbCxcbiAgICAgICAgICBzaG93TGF5ZXI6IChybGF5ZXIgPT0gbGF5ZXIpID8gdHJ1ZSA6IHRoaXMuZ2V0KGBkYXRhLiR7cmxheWVyfS5zaG93TGF5ZXJgKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdGhpcy5zZXQoJ2RhdGEnLCBwZGF0YSk7XG4gICAgfVxuXG4gICAgc2V0TGF5ZXJMaXZlKHNob3dMYXllckxpdmUpIHtcbiAgICAgIHRoaXMuc2V0KGBkYXRhLmxpdmUuc2hvd0xheWVyYCwgc2hvd0xheWVyTGl2ZSlcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuc2V0KCdkYXRhJywge30pO1xuICAgIH1cbiAgfVxufSlcbiJdfQ==
