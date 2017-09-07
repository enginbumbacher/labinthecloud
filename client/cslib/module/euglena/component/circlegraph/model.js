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
    binCount: 24,
    dT: 1,
    tStep: 1,
    data: {},
    histogram: {},
    width: 200,
    height: 200,
    margins: {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    }
  };

  return function (_Model) {
    _inherits(CircleHistogramModel, _Model);

    function CircleHistogramModel() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, CircleHistogramModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (CircleHistogramModel.__proto__ || Object.getPrototypeOf(CircleHistogramModel)).call(this, config));
    }

    _createClass(CircleHistogramModel, [{
      key: 'parseData',
      value: function parseData(data) {
        var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
        var color = arguments[2];

        if (data == null) {
          this.set('data.' + layer, null);
          this.set('histogram.' + layer, null);
          return;
        }
        var intervals = void 0,
            i = void 0,
            j = void 0,
            parsed = void 0,
            track = void 0,
            sample = void 0,
            int = void 0,
            bin = void 0,
            maxBinValue = void 0;
        intervals = [];
        for (i = 0; i < data.runTime; i += this.get('tStep')) {
          parsed = {
            timeStart: i,
            timeEnd: Math.min(i + this.get('tStep'), data.runTime),
            sampleStart: Math.min(i + this.get('tStep'), data.runTime) - this.get('dT'),
            sampleEnd: Math.min(i + this.get('tStep'), data.runTime),
            bins: []
          };
          for (j = 0; j < this.get('binCount'); j++) {
            parsed.bins.push({
              thetaStart: j * Utils.TAU / this.get('binCount'),
              thetaEnd: (j + 1) * Utils.TAU / this.get('binCount'),
              frequency: 0
            });
          }
          intervals.push(parsed);
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.tracks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            track = _step.value;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = track.samples[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                sample = _step2.value;

                bin = Math.floor(this.get('binCount') * Utils.posMod(sample.angleXY, Utils.TAU) / Utils.TAU);
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = intervals[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    int = _step3.value;

                    if (int.sampleStart <= sample.time && int.sampleEnd > sample.time) {
                      int.bins[bin].frequency += 1;
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

        maxBinValue = intervals.reduce(function (val, curr) {
          return Math.max(val, curr.bins.reduce(function (v, c) {
            return Math.max(v, c.frequency);
          }, 0));
        }, 0);
        this.set('data.' + layer, {
          intervals: intervals,
          maxBinValue: maxBinValue,
          color: color,
          showLayer: true
        });
      }
    }, {
      key: 'update',
      value: function update(timestamp, lights) {
        if (this.get('data')) {
          for (var layer in this.get('data')) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = this.get('data.' + layer + '.intervals')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var interval = _step4.value;

                if (interval.timeStart <= timestamp && interval.timeEnd > timestamp) {
                  this.set('histogram.' + layer, interval.bins);
                  break;
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
          this.set('lights', lights);
        }
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

    return CircleHistogramModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsIkdsb2JhbHMiLCJkZWZhdWx0cyIsImJpbkNvdW50IiwiZFQiLCJ0U3RlcCIsImRhdGEiLCJoaXN0b2dyYW0iLCJ3aWR0aCIsImhlaWdodCIsIm1hcmdpbnMiLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImxlZnQiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImxheWVyIiwiY29sb3IiLCJzZXQiLCJpbnRlcnZhbHMiLCJpIiwiaiIsInBhcnNlZCIsInRyYWNrIiwic2FtcGxlIiwiaW50IiwiYmluIiwibWF4QmluVmFsdWUiLCJydW5UaW1lIiwiZ2V0IiwidGltZVN0YXJ0IiwidGltZUVuZCIsIk1hdGgiLCJtaW4iLCJzYW1wbGVTdGFydCIsInNhbXBsZUVuZCIsImJpbnMiLCJwdXNoIiwidGhldGFTdGFydCIsIlRBVSIsInRoZXRhRW5kIiwiZnJlcXVlbmN5IiwidHJhY2tzIiwic2FtcGxlcyIsImZsb29yIiwicG9zTW9kIiwiYW5nbGVYWSIsInRpbWUiLCJyZWR1Y2UiLCJ2YWwiLCJjdXJyIiwibWF4IiwidiIsImMiLCJzaG93TGF5ZXIiLCJ0aW1lc3RhbXAiLCJsaWdodHMiLCJpbnRlcnZhbCIsInNob3dMYXllckxpdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsVUFBVUgsUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFJRUksV0FBVztBQUNUQyxjQUFVLEVBREQ7QUFFVEMsUUFBSSxDQUZLO0FBR1RDLFdBQU8sQ0FIRTtBQUlUQyxVQUFNLEVBSkc7QUFLVEMsZUFBVyxFQUxGO0FBTVRDLFdBQU8sR0FO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Q2xDLG9DQUFxQixLQUFLQSxHQUFMLFdBQWlCYixLQUFqQixnQkFBckIsbUlBQTBEO0FBQUEsb0JBQWpEeUMsUUFBaUQ7O0FBQ3hELG9CQUFJQSxTQUFTM0IsU0FBVCxJQUFzQnlCLFNBQXRCLElBQW1DRSxTQUFTMUIsT0FBVCxHQUFtQndCLFNBQTFELEVBQXFFO0FBQ25FLHVCQUFLckMsR0FBTCxnQkFBc0JGLEtBQXRCLEVBQStCeUMsU0FBU3JCLElBQXhDO0FBQ0E7QUFDRDtBQUNGO0FBTmlDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPbkM7QUFDRCxlQUFLbEIsR0FBTCxDQUFTLFFBQVQsRUFBbUJzQyxNQUFuQjtBQUNEO0FBQ0Y7QUE5REg7QUFBQTtBQUFBLG1DQWdFZUUsYUFoRWYsRUFnRThCO0FBQzFCLGFBQUt4QyxHQUFMLHdCQUFnQ3dDLGFBQWhDO0FBQ0Q7QUFsRUg7QUFBQTtBQUFBLDhCQW9FVTtBQUNOLGFBQUt4QyxHQUFMLENBQVMsTUFBVCxFQUFpQixFQUFqQjtBQUNEO0FBdEVIOztBQUFBO0FBQUEsSUFBMENwQixLQUExQztBQXdFRCxDQTlGRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvY2lyY2xlZ3JhcGgvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kZWwgPSByZXF1aXJlKCdjb3JlL21vZGVsL21vZGVsJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIGJpbkNvdW50OiAyNCxcbiAgICAgIGRUOiAxLFxuICAgICAgdFN0ZXA6IDEsXG4gICAgICBkYXRhOiB7fSxcbiAgICAgIGhpc3RvZ3JhbToge30sXG4gICAgICB3aWR0aDogMjAwLFxuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICBtYXJnaW5zOiB7XG4gICAgICAgIHRvcDogMzAsXG4gICAgICAgIHJpZ2h0OiAzMCxcbiAgICAgICAgYm90dG9tOiAzMCxcbiAgICAgICAgbGVmdDogMzBcbiAgICAgIH1cbiAgICB9XG4gIDtcblxuICByZXR1cm4gY2xhc3MgQ2lyY2xlSGlzdG9ncmFtTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSwgbGF5ZXIgPSAnZGVmYXVsdCcsIGNvbG9yKSB7XG4gICAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc2V0KGBkYXRhLiR7bGF5ZXJ9YCwgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0KGBoaXN0b2dyYW0uJHtsYXllcn1gLCBudWxsKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IGludGVydmFscywgaSwgaiwgcGFyc2VkLCB0cmFjaywgc2FtcGxlLCBpbnQsIGJpbiwgbWF4QmluVmFsdWU7XG4gICAgICBpbnRlcnZhbHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLnJ1blRpbWU7IGkgKz0gdGhpcy5nZXQoJ3RTdGVwJykpIHtcbiAgICAgICAgcGFyc2VkID0ge1xuICAgICAgICAgIHRpbWVTdGFydDogaSxcbiAgICAgICAgICB0aW1lRW5kOiBNYXRoLm1pbihpICsgdGhpcy5nZXQoJ3RTdGVwJyksIGRhdGEucnVuVGltZSksXG4gICAgICAgICAgc2FtcGxlU3RhcnQ6IE1hdGgubWluKGkgKyB0aGlzLmdldCgndFN0ZXAnKSwgZGF0YS5ydW5UaW1lKSAtIHRoaXMuZ2V0KCdkVCcpLFxuICAgICAgICAgIHNhbXBsZUVuZDogTWF0aC5taW4oaSArIHRoaXMuZ2V0KCd0U3RlcCcpLCBkYXRhLnJ1blRpbWUpLFxuICAgICAgICAgIGJpbnM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIGZvciAoaiA9IDAgOyBqIDwgdGhpcy5nZXQoJ2JpbkNvdW50Jyk7IGorKykge1xuICAgICAgICAgIHBhcnNlZC5iaW5zLnB1c2goe1xuICAgICAgICAgICAgdGhldGFTdGFydDogaiAqIFV0aWxzLlRBVSAvIHRoaXMuZ2V0KCdiaW5Db3VudCcpLFxuICAgICAgICAgICAgdGhldGFFbmQ6IChqKzEpICogVXRpbHMuVEFVIC8gdGhpcy5nZXQoJ2JpbkNvdW50JyksXG4gICAgICAgICAgICBmcmVxdWVuY3k6IDBcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGludGVydmFscy5wdXNoKHBhcnNlZCk7XG4gICAgICB9XG4gICAgICBmb3IgKHRyYWNrIG9mIGRhdGEudHJhY2tzKSB7XG4gICAgICAgIGZvciAoc2FtcGxlIG9mIHRyYWNrLnNhbXBsZXMpIHtcbiAgICAgICAgICBiaW4gPSBNYXRoLmZsb29yKHRoaXMuZ2V0KCdiaW5Db3VudCcpICogVXRpbHMucG9zTW9kKHNhbXBsZS5hbmdsZVhZLCBVdGlscy5UQVUpIC8gVXRpbHMuVEFVKTtcbiAgICAgICAgICBmb3IgKGludCBvZiBpbnRlcnZhbHMpIHtcbiAgICAgICAgICAgIGlmIChpbnQuc2FtcGxlU3RhcnQgPD0gc2FtcGxlLnRpbWUgJiYgaW50LnNhbXBsZUVuZCA+IHNhbXBsZS50aW1lKSB7XG4gICAgICAgICAgICAgIGludC5iaW5zW2Jpbl0uZnJlcXVlbmN5ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtYXhCaW5WYWx1ZSA9IGludGVydmFscy5yZWR1Y2UoKHZhbCwgY3VycikgPT4gTWF0aC5tYXgodmFsLCBjdXJyLmJpbnMucmVkdWNlKCh2LCBjKSA9PiBNYXRoLm1heCh2LCBjLmZyZXF1ZW5jeSksIDApKSwgMCk7XG4gICAgICB0aGlzLnNldChgZGF0YS4ke2xheWVyfWAsIHtcbiAgICAgICAgaW50ZXJ2YWxzOiBpbnRlcnZhbHMsXG4gICAgICAgIG1heEJpblZhbHVlOiBtYXhCaW5WYWx1ZSxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBzaG93TGF5ZXI6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZSh0aW1lc3RhbXAsIGxpZ2h0cykge1xuICAgICAgaWYgKHRoaXMuZ2V0KCdkYXRhJykpIHtcbiAgICAgICAgZm9yIChsZXQgbGF5ZXIgaW4gdGhpcy5nZXQoJ2RhdGEnKSkge1xuICAgICAgICAgIGZvciAobGV0IGludGVydmFsIG9mIHRoaXMuZ2V0KGBkYXRhLiR7bGF5ZXJ9LmludGVydmFsc2ApKSB7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwudGltZVN0YXJ0IDw9IHRpbWVzdGFtcCAmJiBpbnRlcnZhbC50aW1lRW5kID4gdGltZXN0YW1wKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0KGBoaXN0b2dyYW0uJHtsYXllcn1gLCBpbnRlcnZhbC5iaW5zKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0KCdsaWdodHMnLCBsaWdodHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldExheWVyTGl2ZShzaG93TGF5ZXJMaXZlKSB7XG4gICAgICB0aGlzLnNldChgZGF0YS5saXZlLnNob3dMYXllcmAsIHNob3dMYXllckxpdmUpXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLnNldCgnZGF0YScsIHt9KTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
