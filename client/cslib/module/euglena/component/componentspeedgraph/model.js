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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jb21wb25lbnRzcGVlZGdyYXBoL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiR2xvYmFscyIsImRlZmF1bHRzIiwidlJhbmdlIiwibW9kZSIsInN0ZEJhbmQiLCJkVCIsIndpZHRoIiwiaGVpZ2h0IiwiZGF0YSIsInJhdyIsIm1hcmdpbnMiLCJ0b3AiLCJsZWZ0IiwiYm90dG9tIiwicmlnaHQiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImxheWVyIiwibGlnaHRDb25maWciLCJjb2xvciIsInNldCIsImFjY190aW1lIiwidl9saWdodCIsImsiLCJ2X2xlbmd0aCIsIk1hdGgiLCJzcXJ0IiwibWFwIiwieCIsImxpZ2h0RGlyIiwidGltZVN0YXJ0IiwidGltZUVuZCIsImR1cmF0aW9uIiwidXNlZFZyYW5nZSIsImdldCIsIk9iamVjdCIsInZhbHVlcyIsInJlZHVjZSIsImFjYyIsInZhbCIsIm1heCIsInRyYWNrcyIsInRhY2MiLCJ0dmFsIiwic2FtcGxlcyIsImZpbHRlciIsImEiLCJleGlzdHMiLCJzcGVlZCIsInNhY2MiLCJzdmFsIiwiYWJzIiwic3BlZWRYIiwic3BlZWRZIiwiY2VpbCIsInBkYXRhIiwicmxheWVyIiwicmRhdGEiLCJncmFwaHMiLCJ5IiwidG90YWwiLCJpIiwibnVtRnJhbWVzIiwia2V5IiwicHVzaCIsImZyYW1lIiwidGltZSIsImZwcyIsIm1lYW4iLCJzIiwidHJhY2siLCJzYW1wbGUiLCJzYW1wbGVGcmFtZSIsInJvdW5kIiwibWF4RGlzcGxheSIsImxlbmd0aCIsInYiLCJjIiwicG93IiwibWF4VmFsdWUiLCJydW5UaW1lIiwic2hvd0xheWVyIiwic2hvd0xheWVyTGl2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7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QUNEO0FBOUhIOztBQUFBO0FBQUEsSUFBcUN0QixLQUFyQztBQWdJRCxDQXZKRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvY29tcG9uZW50c3BlZWRncmFwaC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgdlJhbmdlOiBudWxsLFxuICAgICAgbW9kZTogJ3RvdGFsJyxcbiAgICAgIHN0ZEJhbmQ6IHRydWUsXG4gICAgICBkVDogMSxcbiAgICAgIHdpZHRoOiA0MDAsXG4gICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgIGRhdGE6IHt9LFxuICAgICAgcmF3OiB7fSxcbiAgICAgIG1hcmdpbnM6IHtcbiAgICAgICAgdG9wOiA0MCxcbiAgICAgICAgbGVmdDogNDAsXG4gICAgICAgIGJvdHRvbTogNDAsXG4gICAgICAgIHJpZ2h0OiAyMFxuICAgICAgfVxuICAgIH1cbiAgO1xuXG4gIHJldHVybiBjbGFzcyBUaW1lU2VyaWVzTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSwgbGF5ZXIgPSAnZGVmYXVsdCcsIGxpZ2h0Q29uZmlnLCBjb2xvcikge1xuICAgICAgdGhpcy5zZXQoYHJhdy4ke2xheWVyfWAsIGRhdGEpO1xuXG4gICAgICBpZiAobGlnaHRDb25maWcpIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBsaWdodCBkaXJlY3Rpb24gZm9yIGVhY2ggdGltZSBiYW5kIGFuZCB0aGUgYWNjdW11bGF0ZWQgdGltZVxuICAgICAgICB2YXIgYWNjX3RpbWUgPSAwXG4gICAgICAgIGZvciAobGV0IGNvbmZpZyBvZiBsaWdodENvbmZpZykge1xuICAgICAgICAgIGxldCB2X2xpZ2h0ID0gWzAsMF07XG4gICAgICAgICAgZm9yIChsZXQgayBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoaykge1xuICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgIHZfbGlnaHRbMF0gKz0gY29uZmlnW2tdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICB2X2xpZ2h0WzBdICs9IC1jb25maWdba107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgICAgICAgICAgICB2X2xpZ2h0WzFdICs9IGNvbmZpZ1trXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICAgIHZfbGlnaHRbMV0gKz0gLWNvbmZpZ1trXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IHZfbGVuZ3RoID0gTWF0aC5zcXJ0KHZfbGlnaHRbMF0qdl9saWdodFswXSArIHZfbGlnaHRbMV0qdl9saWdodFsxXSk7XG4gICAgICAgICAgdl9sZW5ndGggPSB2X2xlbmd0aD09PTAgPyAxIDogdl9sZW5ndGg7XG4gICAgICAgICAgdl9saWdodCA9IHZfbGlnaHQubWFwKGZ1bmN0aW9uKHgpIHtyZXR1cm4geCAvIHZfbGVuZ3RofSk7XG4gICAgICAgICAgY29uZmlnLmxpZ2h0RGlyID0gdl9saWdodFxuICAgICAgICAgIGNvbmZpZy50aW1lU3RhcnQgPSBhY2NfdGltZTtcbiAgICAgICAgICBjb25maWcudGltZUVuZCA9IGFjY190aW1lICsgY29uZmlnLmR1cmF0aW9uO1xuICAgICAgICAgIGFjY190aW1lICs9IGNvbmZpZy5kdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldCgnbGlnaHRDb25maWcnLCBsaWdodENvbmZpZylcblxuICAgICAgLy8gc2V0IHRoZSByYW5nZSBmb3IgdGhlIHZlcnRpY2FsIGF4aXNcbiAgICAgIC8vIHZSYW5nZTogaWYgaXQgaXMgZ2l2ZW4gYXMgYSBwYXJhbWV0ZXIsIGNob29zZSBpdC5cbiAgICAgIC8vIFRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGRhdGE6XG4gICAgICAvLyB0aGlzLmdldCgncmF3JykubGl2ZS50cmFja3MgLS0+IEFycmF5IG9mIHRyYWNrcyBmb3IgZWFjaCByZWNvcmRlZCBFdWdsZW5hLiBFYWNoIGVsZW1lbnQgaGFzIGFuIGFycmF5IG9mIHNhbXBsZXMsIHdoaWNoIGNvcnJlc3BvbmRzIHRvIHRoZSBpbmZvIGZvciB0aGF0IHNwZWNpZmljIEV1Z2xlbmEuXG4gICAgICAvLyB0aGlzLmdldCgncmF3JykubGl2ZS50cmFja3NbMF0uc2FtcGxlcyAtLT4gRWFjaCBzYW1wbGUgaGFzIHRoZSBmb2xsb3dpbmcgZGljdGlvbmFyeSB7YW5nbGVYWSwgc3BlZWQsIHNwZWVkWCwgc3BlZWRZLCB0aW1lLCB4LCB5LCB5YXd9XG4gICAgICBsZXQgdXNlZFZyYW5nZSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuaGlzdG9ncmFtLnZSYW5nZScpID8gdGhpcy5nZXQoJ3ZSYW5nZScpIDogT2JqZWN0LnZhbHVlcyh0aGlzLmdldCgncmF3JykpLnJlZHVjZSgoYWNjLCB2YWwpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGFjYywgdmFsLnRyYWNrcy5yZWR1Y2UoKHRhY2MsIHR2YWwpID0+IHtcbiAgICAgICAgICByZXR1cm4gTWF0aC5tYXgodGFjYywgdHZhbC5zYW1wbGVzLmZpbHRlcigoYSkgPT4gVXRpbHMuZXhpc3RzKGEuc3BlZWQpKS5yZWR1Y2UoKHNhY2MsIHN2YWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChzYWNjLCB0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnID8gTWF0aC5tYXgoTWF0aC5hYnMoc3ZhbC5zcGVlZFgpLCBNYXRoLmFicyhzdmFsLnNwZWVkWSkpIDogc3ZhbC5zcGVlZCk7XG4gICAgICAgICAgfSwgMCkpO1xuICAgICAgICB9LCAwKSk7XG4gICAgICB9LCAwKTtcbiAgICAgIHVzZWRWcmFuZ2UgPSBNYXRoLmNlaWwodXNlZFZyYW5nZSk7XG5cbiAgICAgIGxldCBwZGF0YSA9IHt9O1xuXG4gICAgICBmb3IgKGxldCBybGF5ZXIgaW4gdGhpcy5nZXQoJ3JhdycpKSB7XG4gICAgICAgIGxldCByZGF0YSA9IHRoaXMuZ2V0KGByYXcuJHtybGF5ZXJ9YCk7XG4gICAgICAgIGxldCBncmFwaHMgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHtcbiAgICAgICAgICBncmFwaHMueCA9IFtdO1xuICAgICAgICAgIGdyYXBocy55ID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JhcGhzLnRvdGFsID0gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb3IgZWFjaCBmcmFtZSBnZW5lcmF0ZSB0aGUgcmVsZXZhbnQgZGF0YSBzdHJ1Y3R1cmUgZm9yIHRoZSBncmFwaCAtIGhlcmUsIGl0IGhhcyB0byBoYWV2IGEgdGltZSB2YWx1ZSwgYSBtZWFuIGFuZCBhIHN0YW5kYXJkIGRldmlhdGlvbiBzIGF0IGV2ZXJ5IHRpbWUgcG9pbnQuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmRhdGEubnVtRnJhbWVzOyBpKyspIHtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gZ3JhcGhzKSB7XG4gICAgICAgICAgICBncmFwaHNba2V5XS5wdXNoKHtcbiAgICAgICAgICAgICAgZnJhbWU6IGksXG4gICAgICAgICAgICAgIHRpbWU6IGkgLyByZGF0YS5mcHMsXG4gICAgICAgICAgICAgIHNhbXBsZXM6IFtdLFxuICAgICAgICAgICAgICBtZWFuOiBudWxsLFxuICAgICAgICAgICAgICBzOiBudWxsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCB0cmFjayBvZiByZGF0YS50cmFja3MpIHtcbiAgICAgICAgICBmb3IgKGxldCBzYW1wbGUgb2YgdHJhY2suc2FtcGxlcykge1xuICAgICAgICAgICAgaWYgKCFzYW1wbGUuc3BlZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNhbXBsZS5zcGVlZFgpID4gdXNlZFZyYW5nZSB8fCBNYXRoLmFicyhzYW1wbGUuc3BlZWRZKSA+IHVzZWRWcmFuZ2UpIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNhbXBsZS5zcGVlZCkgPiB1c2VkVnJhbmdlKSBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBzYW1wbGVGcmFtZSA9IE1hdGgucm91bmQoc2FtcGxlLnRpbWUgKiByZGF0YS5mcHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHsgLy8gRWl0aGVyIGRpc3BsYXkgaW5mb3JtYXRpb24gZm9yIHggYW5kIHkgc3BlZWQgc2VwYXJhdGVseSwgb3IgdGhlIHRvdGFsIHNwZWVkLlxuICAgICAgICAgICAgICBncmFwaHMueFtzYW1wbGVGcmFtZS0xXS5zYW1wbGVzLnB1c2goc2FtcGxlLnNwZWVkWCk7XG4gICAgICAgICAgICAgIGdyYXBocy55W3NhbXBsZUZyYW1lLTFdLnNhbXBsZXMucHVzaChzYW1wbGUuc3BlZWRZKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGdyYXBocy50b3RhbFtzYW1wbGVGcmFtZS0xXS5zYW1wbGVzLnB1c2goc2FtcGxlLnNwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgdGhlIG1lYW4gYW5kIHN0YW5kYXJkIGRldmlhdGlvblxuICAgICAgICBsZXQgbWF4RGlzcGxheSA9IDA7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBncmFwaHMpIHtcbiAgICAgICAgICBmb3IgKGxldCBmcmFtZSBvZiBncmFwaHNba2V5XSkge1xuICAgICAgICAgICAgaWYgKGZyYW1lLnNhbXBsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGZyYW1lLm1lYW4gPSBmcmFtZS5zYW1wbGVzLnJlZHVjZSgodiwgYykgPT4gdiArIGMsIDApIC8gZnJhbWUuc2FtcGxlcy5sZW5ndGg7XG4gICAgICAgICAgICAgIGZyYW1lLnMgPSBNYXRoLnNxcnQoZnJhbWUuc2FtcGxlcy5tYXAoKHYpID0+IE1hdGgucG93KHYgLSBmcmFtZS5tZWFuLCAyKSkucmVkdWNlKCh2LCBjKSA9PiB2ICsgYywgMCkgLyBmcmFtZS5zYW1wbGVzLmxlbmd0aCk7XG4gICAgICAgICAgICAgIG1heERpc3BsYXkgPSBNYXRoLm1heChtYXhEaXNwbGF5LCBNYXRoLm1heChNYXRoLmFicyhmcmFtZS5tZWFuICsgZnJhbWUucyksIE1hdGguYWJzKGZyYW1lLm1lYW4gLSBmcmFtZS5zKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwZGF0YVtybGF5ZXJdID0ge1xuICAgICAgICAgIGdyYXBoczogZ3JhcGhzLFxuICAgICAgICAgIG1heFZhbHVlOiBtYXhEaXNwbGF5LFxuICAgICAgICAgIHJ1blRpbWU6IHJkYXRhLnJ1blRpbWUsXG4gICAgICAgICAgY29sb3I6IHJsYXllciA9PSBsYXllciA/IGNvbG9yIDogbnVsbCxcbiAgICAgICAgICBzaG93TGF5ZXI6IChybGF5ZXIgPT0gbGF5ZXIpID8gdHJ1ZSA6IHRoaXMuZ2V0KGBkYXRhLiR7cmxheWVyfS5zaG93TGF5ZXJgKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdGhpcy5zZXQoJ2RhdGEnLCBwZGF0YSk7XG4gICAgfVxuXG4gICAgc2V0TGF5ZXJMaXZlKHNob3dMYXllckxpdmUpIHtcbiAgICAgIHRoaXMuc2V0KGBkYXRhLmxpdmUuc2hvd0xheWVyYCwgc2hvd0xheWVyTGl2ZSlcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuc2V0KCdkYXRhJywge30pO1xuICAgIH1cbiAgfVxufSlcbiJdfQ==
