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
    meanTheta: 0,
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
          this.set('meanTheta.' + layer, null);
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
            parsed.bins.push({ // parsed contains the frequency per bin
              thetaStart: j * Utils.TAU / this.get('binCount'), // Utils.TAU = 2*MATH.PI
              thetaEnd: (j + 1) * Utils.TAU / this.get('binCount'),
              frequency: 0
            });
          }
          intervals.push(parsed); // Contains data.runTime elements
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.tracks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            track = _step.value;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = track.samples[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                sample = _step3.value;

                bin = Math.floor(this.get('binCount') * Utils.posMod(sample.angleXY, Utils.TAU) / Utils.TAU); // Get the bin in which the angle falls
                // I checked whether the calculation of the angleXY has been done by calculating the atan2, or acos of the sample speeds. Only in cases the speed is zero did the values for both deviate. So, sample.angleXY is as good as it gets.
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                  for (var _iterator4 = intervals[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    int = _step4.value;

                    if (int.sampleStart <= sample.time && int.sampleEnd > sample.time) {
                      int.bins[bin].frequency += 1;
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

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = intervals[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            int = _step2.value;
            // Calculate the weighted average orientation for the circular histograms (weighted by frequencies)
            // I realize this doesn't actually work. If the distribution is completely circular, then the meanTheta line will, if calculated like now, still have a radian of 3. It should then have a length of zero.
            // In order to calculate the length, I have to see how the distribution is generated (e.g. maxValue as max length). It could be proportional to the difference between the longest and shortest histogram in an instance?
            var numFreq = int.bins.reduce(function (acc, curr) {
              return acc + curr.frequency;
            }, 0);
            var mean = int.bins.reduce(function (acc, curr) {
              return acc + (curr.thetaEnd + curr.thetaStart) / 2 * curr.frequency;
            }, 0) / numFreq;
            int.meanTheta = isNaN(mean) ? 0 : mean;
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
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = this.get('data.' + layer + '.intervals')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var interval = _step5.value;

                if (interval.timeStart <= timestamp && interval.timeEnd > timestamp) {
                  this.set('histogram.' + layer, interval.bins);
                  this.set('meanTheta.' + layer, interval.meanTheta);
                  break;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsIkdsb2JhbHMiLCJkZWZhdWx0cyIsImJpbkNvdW50IiwiZFQiLCJ0U3RlcCIsImRhdGEiLCJoaXN0b2dyYW0iLCJtZWFuVGhldGEiLCJ3aWR0aCIsImhlaWdodCIsIm1hcmdpbnMiLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImxlZnQiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImxheWVyIiwiY29sb3IiLCJzZXQiLCJpbnRlcnZhbHMiLCJpIiwiaiIsInBhcnNlZCIsInRyYWNrIiwic2FtcGxlIiwiaW50IiwiYmluIiwibWF4QmluVmFsdWUiLCJydW5UaW1lIiwiZ2V0IiwidGltZVN0YXJ0IiwidGltZUVuZCIsIk1hdGgiLCJtaW4iLCJzYW1wbGVTdGFydCIsInNhbXBsZUVuZCIsImJpbnMiLCJwdXNoIiwidGhldGFTdGFydCIsIlRBVSIsInRoZXRhRW5kIiwiZnJlcXVlbmN5IiwidHJhY2tzIiwic2FtcGxlcyIsImZsb29yIiwicG9zTW9kIiwiYW5nbGVYWSIsInRpbWUiLCJudW1GcmVxIiwicmVkdWNlIiwiYWNjIiwiY3VyciIsIm1lYW4iLCJpc05hTiIsInZhbCIsIm1heCIsInYiLCJjIiwic2hvd0xheWVyIiwidGltZXN0YW1wIiwibGlnaHRzIiwiaW50ZXJ2YWwiLCJzaG93TGF5ZXJMaXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BSUVJLFdBQVc7QUFDVEMsY0FBVSxFQUREO0FBRVRDLFFBQUksQ0FGSztBQUdUQyxXQUFPLENBSEU7QUFJ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TCxnQkFBc0JGLEtBQXRCLEVBQStCNkMsU0FBU3ZELFNBQXhDO0FBQ0E7QUFDRDtBQUNGO0FBUGlDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRbkM7QUFDRCxlQUFLWSxHQUFMLENBQVMsUUFBVCxFQUFtQjBDLE1BQW5CO0FBQ0Q7QUFDRjtBQTFFSDtBQUFBO0FBQUEsbUNBNEVlRSxhQTVFZixFQTRFOEI7QUFDMUIsYUFBSzVDLEdBQUwsd0JBQWdDNEMsYUFBaEM7QUFDRDtBQTlFSDtBQUFBO0FBQUEsOEJBZ0ZVO0FBQ04sYUFBSzVDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLEVBQWpCO0FBQ0Q7QUFsRkg7O0FBQUE7QUFBQSxJQUEwQ3JCLEtBQTFDO0FBb0ZELENBM0dEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgYmluQ291bnQ6IDI0LFxuICAgICAgZFQ6IDEsXG4gICAgICB0U3RlcDogMSxcbiAgICAgIGRhdGE6IHt9LFxuICAgICAgaGlzdG9ncmFtOiB7fSxcbiAgICAgIG1lYW5UaGV0YTogMCxcbiAgICAgIHdpZHRoOiAyMDAsXG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIG1hcmdpbnM6IHtcbiAgICAgICAgdG9wOiAzMCxcbiAgICAgICAgcmlnaHQ6IDMwLFxuICAgICAgICBib3R0b206IDMwLFxuICAgICAgICBsZWZ0OiAzMFxuICAgICAgfVxuICAgIH1cbiAgO1xuXG4gIHJldHVybiBjbGFzcyBDaXJjbGVIaXN0b2dyYW1Nb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuICAgICAgY29uZmlnLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZmlnLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG4gICAgICBzdXBlcihjb25maWcpO1xuICAgIH1cblxuICAgIHBhcnNlRGF0YShkYXRhLCBsYXllciA9ICdkZWZhdWx0JywgY29sb3IpIHtcbiAgICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXQoYGRhdGEuJHtsYXllcn1gLCBudWxsKTtcbiAgICAgICAgdGhpcy5zZXQoYGhpc3RvZ3JhbS4ke2xheWVyfWAsIG51bGwpO1xuICAgICAgICB0aGlzLnNldChgbWVhblRoZXRhLiR7bGF5ZXJ9YCwgbnVsbCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBpbnRlcnZhbHMsIGksIGosIHBhcnNlZCwgdHJhY2ssIHNhbXBsZSwgaW50LCBiaW4sIG1heEJpblZhbHVlO1xuICAgICAgaW50ZXJ2YWxzID0gW107XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5ydW5UaW1lOyBpICs9IHRoaXMuZ2V0KCd0U3RlcCcpKSB7XG4gICAgICAgIHBhcnNlZCA9IHtcbiAgICAgICAgICB0aW1lU3RhcnQ6IGksXG4gICAgICAgICAgdGltZUVuZDogTWF0aC5taW4oaSArIHRoaXMuZ2V0KCd0U3RlcCcpLCBkYXRhLnJ1blRpbWUpLFxuICAgICAgICAgIHNhbXBsZVN0YXJ0OiBNYXRoLm1pbihpICsgdGhpcy5nZXQoJ3RTdGVwJyksIGRhdGEucnVuVGltZSkgLSB0aGlzLmdldCgnZFQnKSxcbiAgICAgICAgICBzYW1wbGVFbmQ6IE1hdGgubWluKGkgKyB0aGlzLmdldCgndFN0ZXAnKSwgZGF0YS5ydW5UaW1lKSxcbiAgICAgICAgICBiaW5zOiBbXVxuICAgICAgICB9O1xuICAgICAgICBmb3IgKGogPSAwIDsgaiA8IHRoaXMuZ2V0KCdiaW5Db3VudCcpOyBqKyspIHtcbiAgICAgICAgICBwYXJzZWQuYmlucy5wdXNoKHsgLy8gcGFyc2VkIGNvbnRhaW5zIHRoZSBmcmVxdWVuY3kgcGVyIGJpblxuICAgICAgICAgICAgdGhldGFTdGFydDogaiAqIFV0aWxzLlRBVSAvIHRoaXMuZ2V0KCdiaW5Db3VudCcpLCAvLyBVdGlscy5UQVUgPSAyKk1BVEguUElcbiAgICAgICAgICAgIHRoZXRhRW5kOiAoaisxKSAqIFV0aWxzLlRBVSAvIHRoaXMuZ2V0KCdiaW5Db3VudCcpLFxuICAgICAgICAgICAgZnJlcXVlbmN5OiAwXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpbnRlcnZhbHMucHVzaChwYXJzZWQpOyAvLyBDb250YWlucyBkYXRhLnJ1blRpbWUgZWxlbWVudHNcbiAgICAgIH1cbiAgICAgIGZvciAodHJhY2sgb2YgZGF0YS50cmFja3MpIHtcbiAgICAgICAgZm9yIChzYW1wbGUgb2YgdHJhY2suc2FtcGxlcykge1xuICAgICAgICAgIGJpbiA9IE1hdGguZmxvb3IodGhpcy5nZXQoJ2JpbkNvdW50JykgKiBVdGlscy5wb3NNb2Qoc2FtcGxlLmFuZ2xlWFksIFV0aWxzLlRBVSkgLyBVdGlscy5UQVUpOyAvLyBHZXQgdGhlIGJpbiBpbiB3aGljaCB0aGUgYW5nbGUgZmFsbHNcbiAgICAgICAgICAvLyBJIGNoZWNrZWQgd2hldGhlciB0aGUgY2FsY3VsYXRpb24gb2YgdGhlIGFuZ2xlWFkgaGFzIGJlZW4gZG9uZSBieSBjYWxjdWxhdGluZyB0aGUgYXRhbjIsIG9yIGFjb3Mgb2YgdGhlIHNhbXBsZSBzcGVlZHMuIE9ubHkgaW4gY2FzZXMgdGhlIHNwZWVkIGlzIHplcm8gZGlkIHRoZSB2YWx1ZXMgZm9yIGJvdGggZGV2aWF0ZS4gU28sIHNhbXBsZS5hbmdsZVhZIGlzIGFzIGdvb2QgYXMgaXQgZ2V0cy5cbiAgICAgICAgICBmb3IgKGludCBvZiBpbnRlcnZhbHMpIHtcbiAgICAgICAgICAgIGlmIChpbnQuc2FtcGxlU3RhcnQgPD0gc2FtcGxlLnRpbWUgJiYgaW50LnNhbXBsZUVuZCA+IHNhbXBsZS50aW1lKSB7XG4gICAgICAgICAgICAgIGludC5iaW5zW2Jpbl0uZnJlcXVlbmN5ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoaW50IG9mIGludGVydmFscykgeyAvLyBDYWxjdWxhdGUgdGhlIHdlaWdodGVkIGF2ZXJhZ2Ugb3JpZW50YXRpb24gZm9yIHRoZSBjaXJjdWxhciBoaXN0b2dyYW1zICh3ZWlnaHRlZCBieSBmcmVxdWVuY2llcylcbiAgICAgICAgLy8gSSByZWFsaXplIHRoaXMgZG9lc24ndCBhY3R1YWxseSB3b3JrLiBJZiB0aGUgZGlzdHJpYnV0aW9uIGlzIGNvbXBsZXRlbHkgY2lyY3VsYXIsIHRoZW4gdGhlIG1lYW5UaGV0YSBsaW5lIHdpbGwsIGlmIGNhbGN1bGF0ZWQgbGlrZSBub3csIHN0aWxsIGhhdmUgYSByYWRpYW4gb2YgMy4gSXQgc2hvdWxkIHRoZW4gaGF2ZSBhIGxlbmd0aCBvZiB6ZXJvLlxuICAgICAgICAvLyBJbiBvcmRlciB0byBjYWxjdWxhdGUgdGhlIGxlbmd0aCwgSSBoYXZlIHRvIHNlZSBob3cgdGhlIGRpc3RyaWJ1dGlvbiBpcyBnZW5lcmF0ZWQgKGUuZy4gbWF4VmFsdWUgYXMgbWF4IGxlbmd0aCkuIEl0IGNvdWxkIGJlIHByb3BvcnRpb25hbCB0byB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBsb25nZXN0IGFuZCBzaG9ydGVzdCBoaXN0b2dyYW0gaW4gYW4gaW5zdGFuY2U/XG4gICAgICAgIGxldCBudW1GcmVxID0gaW50LmJpbnMucmVkdWNlKChhY2MsY3VycikgPT4gYWNjICsgY3Vyci5mcmVxdWVuY3ksMCk7XG4gICAgICAgIGxldCBtZWFuID0gaW50LmJpbnMucmVkdWNlKChhY2MsY3VycikgPT4gYWNjICsgKGN1cnIudGhldGFFbmQgKyBjdXJyLnRoZXRhU3RhcnQpIC8gMiAqIGN1cnIuZnJlcXVlbmN5LDApIC8gbnVtRnJlcTtcbiAgICAgICAgaW50Lm1lYW5UaGV0YSA9IGlzTmFOKG1lYW4pID8gMCA6IG1lYW47XG4gICAgICB9XG5cbiAgICAgIG1heEJpblZhbHVlID0gaW50ZXJ2YWxzLnJlZHVjZSgodmFsLCBjdXJyKSA9PiBNYXRoLm1heCh2YWwsIGN1cnIuYmlucy5yZWR1Y2UoKHYsIGMpID0+IE1hdGgubWF4KHYsIGMuZnJlcXVlbmN5KSwgMCkpLCAwKTtcbiAgICAgIHRoaXMuc2V0KGBkYXRhLiR7bGF5ZXJ9YCwge1xuICAgICAgICBpbnRlcnZhbHM6IGludGVydmFscyxcbiAgICAgICAgbWF4QmluVmFsdWU6IG1heEJpblZhbHVlLFxuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHNob3dMYXllcjogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlKHRpbWVzdGFtcCwgbGlnaHRzKSB7XG4gICAgICBpZiAodGhpcy5nZXQoJ2RhdGEnKSkge1xuICAgICAgICBmb3IgKGxldCBsYXllciBpbiB0aGlzLmdldCgnZGF0YScpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaW50ZXJ2YWwgb2YgdGhpcy5nZXQoYGRhdGEuJHtsYXllcn0uaW50ZXJ2YWxzYCkpIHtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbC50aW1lU3RhcnQgPD0gdGltZXN0YW1wICYmIGludGVydmFsLnRpbWVFbmQgPiB0aW1lc3RhbXApIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXQoYGhpc3RvZ3JhbS4ke2xheWVyfWAsIGludGVydmFsLmJpbnMpO1xuICAgICAgICAgICAgICB0aGlzLnNldChgbWVhblRoZXRhLiR7bGF5ZXJ9YCwgaW50ZXJ2YWwubWVhblRoZXRhKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0KCdsaWdodHMnLCBsaWdodHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldExheWVyTGl2ZShzaG93TGF5ZXJMaXZlKSB7XG4gICAgICB0aGlzLnNldChgZGF0YS5saXZlLnNob3dMYXllcmAsIHNob3dMYXllckxpdmUpXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLnNldCgnZGF0YScsIHt9KTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
