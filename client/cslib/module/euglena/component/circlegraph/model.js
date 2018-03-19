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
        if (Object.keys(this.get('data')).length) {
          for (var layer in this.get('data')) {
            if (this.get('data.' + layer + '.intervals')) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsIkdsb2JhbHMiLCJkZWZhdWx0cyIsImJpbkNvdW50IiwiZFQiLCJ0U3RlcCIsImRhdGEiLCJoaXN0b2dyYW0iLCJtZWFuVGhldGEiLCJ3aWR0aCIsImhlaWdodCIsIm1hcmdpbnMiLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImxlZnQiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImxheWVyIiwiY29sb3IiLCJzZXQiLCJpbnRlcnZhbHMiLCJpIiwiaiIsInBhcnNlZCIsInRyYWNrIiwic2FtcGxlIiwiaW50IiwiYmluIiwibWF4QmluVmFsdWUiLCJydW5UaW1lIiwiZ2V0IiwidGltZVN0YXJ0IiwidGltZUVuZCIsIk1hdGgiLCJtaW4iLCJzYW1wbGVTdGFydCIsInNhbXBsZUVuZCIsImJpbnMiLCJwdXNoIiwidGhldGFTdGFydCIsIlRBVSIsInRoZXRhRW5kIiwiZnJlcXVlbmN5IiwidHJhY2tzIiwic2FtcGxlcyIsImZsb29yIiwicG9zTW9kIiwiYW5nbGVYWSIsInRpbWUiLCJudW1GcmVxIiwicmVkdWNlIiwiYWNjIiwiY3VyciIsIm1lYW4iLCJpc05hTiIsInZhbCIsIm1heCIsInYiLCJjIiwic2hvd0xheWVyIiwidGltZXN0YW1wIiwibGlnaHRzIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImludGVydmFsIiwic2hvd0xheWVyTGl2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUlFSSxXQUFXO0FBQ1RDLGNBQVUsRUFERDtBQUVUQyxRQUFJLENBRks7QUFHVEMsV0FBTyxDQUhFO0FBSVRDLFVBQU0sRUFKRztBQUtUQyxlQUFXLEVBTEY7QUFNVEMsZUFBVyxDQU5GO0FBT1RDLFdBQU8sR0FQRTtBQVFUQyxZQUFRLEdBUkM7QUFTVEMsYUFBUztBQUNQQyxXQUFLLEVBREU7QUFFUEMsYUFBTyxFQUZBO0FBR1BDLGNBQVEsRUFIRDtBQUlQQyxZQUFNO0FBSkM7QUFUQSxHQUpiOztBQXNCQTtBQUFBOztBQUNFLG9DQUF5QjtBQUFBLFVBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFDdkJBLGFBQU9kLFFBQVAsR0FBa0JGLE1BQU1pQixjQUFOLENBQXFCRCxPQUFPZCxRQUE1QixFQUFzQ0EsUUFBdEMsQ0FBbEI7QUFEdUIseUlBRWpCYyxNQUZpQjtBQUd4Qjs7QUFKSDtBQUFBO0FBQUEsZ0NBTVlWLElBTlosRUFNNEM7QUFBQSxZQUExQlksS0FBMEIsdUVBQWxCLFNBQWtCO0FBQUEsWUFBUEMsS0FBTzs7QUFDeEMsWUFBSWIsUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLGVBQUtjLEdBQUwsV0FBaUJGLEtBQWpCLEVBQTBCLElBQTFCO0FBQ0EsZUFBS0UsR0FBTCxnQkFBc0JGLEtBQXRCLEVBQStCLElBQS9CO0FBQ0EsZUFBS0UsR0FBTCxnQkFBc0JGLEtBQXRCLEVBQStCLElBQS9CO0FBQ0E7QUFDRDtBQUNELFlBQUlHLGtCQUFKO0FBQUEsWUFBZUMsVUFBZjtBQUFBLFlBQWtCQyxVQUFsQjtBQUFBLFlBQXFCQyxlQUFyQjtBQUFBLFlBQTZCQyxjQUE3QjtBQUFBLFlBQW9DQyxlQUFwQztBQUFBLFlBQTRDQyxZQUE1QztBQUFBLFlBQWlEQyxZQUFqRDtBQUFBLFlBQXNEQyxvQkFBdEQ7QUFDQVIsb0JBQVksRUFBWjtBQUNBLGFBQUtDLElBQUksQ0FBVCxFQUFZQSxJQUFJaEIsS0FBS3dCLE9BQXJCLEVBQThCUixLQUFLLEtBQUtTLEdBQUwsQ0FBUyxPQUFULENBQW5DLEVBQXNEO0FBQ3BEUCxtQkFBUztBQUNQUSx1QkFBV1YsQ0FESjtBQUVQVyxxQkFBU0MsS0FBS0MsR0FBTCxDQUFTYixJQUFJLEtBQUtTLEdBQUwsQ0FBUyxPQUFULENBQWIsRUFBZ0N6QixLQUFLd0IsT0FBckMsQ0FGRjtBQUdQTSx5QkFBYUYsS0FBS0MsR0FBTCxDQUFTYixJQUFJLEtBQUtTLEdBQUwsQ0FBUyxPQUFULENBQWIsRUFBZ0N6QixLQUFLd0IsT0FBckMsSUFBZ0QsS0FBS0MsR0FBTCxDQUFTLElBQVQsQ0FIdEQ7QUFJUE0sdUJBQVdILEtBQUtDLEdBQUwsQ0FBU2IsSUFBSSxLQUFLUyxHQUFMLENBQVMsT0FBVCxDQUFiLEVBQWdDekIsS0FBS3dCLE9BQXJDLENBSko7QUFLUFEsa0JBQU07QUFMQyxXQUFUO0FBT0EsZUFBS2YsSUFBSSxDQUFULEVBQWFBLElBQUksS0FBS1EsR0FBTCxDQUFTLFVBQVQsQ0FBakIsRUFBdUNSLEdBQXZDLEVBQTRDO0FBQzFDQyxtQkFBT2MsSUFBUCxDQUFZQyxJQUFaLENBQWlCLEVBQUU7QUFDakJDLDBCQUFZakIsSUFBSXZCLE1BQU15QyxHQUFWLEdBQWdCLEtBQUtWLEdBQUwsQ0FBUyxVQUFULENBRGIsRUFDbUM7QUFDbERXLHdCQUFVLENBQUNuQixJQUFFLENBQUgsSUFBUXZCLE1BQU15QyxHQUFkLEdBQW9CLEtBQUtWLEdBQUwsQ0FBUyxVQUFULENBRmY7QUFHZlkseUJBQVc7QUFISSxhQUFqQjtBQUtEO0FBQ0R0QixvQkFBVWtCLElBQVYsQ0FBZWYsTUFBZixFQWZvRCxDQWU1QjtBQUN6QjtBQXpCdUM7QUFBQTtBQUFBOztBQUFBO0FBMEJ4QywrQkFBY2xCLEtBQUtzQyxNQUFuQiw4SEFBMkI7QUFBdEJuQixpQkFBc0I7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDekIsb0NBQWVBLE1BQU1vQixPQUFyQixtSUFBOEI7QUFBekJuQixzQkFBeUI7O0FBQzVCRSxzQkFBTU0sS0FBS1ksS0FBTCxDQUFXLEtBQUtmLEdBQUwsQ0FBUyxVQUFULElBQXVCL0IsTUFBTStDLE1BQU4sQ0FBYXJCLE9BQU9zQixPQUFwQixFQUE2QmhELE1BQU15QyxHQUFuQyxDQUF2QixHQUFpRXpDLE1BQU15QyxHQUFsRixDQUFOLENBRDRCLENBQ2tFO0FBQzlGO0FBRjRCO0FBQUE7QUFBQTs7QUFBQTtBQUc1Qix3Q0FBWXBCLFNBQVosbUlBQXVCO0FBQWxCTSx1QkFBa0I7O0FBQ3JCLHdCQUFJQSxJQUFJUyxXQUFKLElBQW1CVixPQUFPdUIsSUFBMUIsSUFBa0N0QixJQUFJVSxTQUFKLEdBQWdCWCxPQUFPdUIsSUFBN0QsRUFBbUU7QUFDakV0QiwwQkFBSVcsSUFBSixDQUFTVixHQUFULEVBQWNlLFNBQWQsSUFBMkIsQ0FBM0I7QUFDRDtBQUNGO0FBUDJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRN0I7QUFUd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVUxQjtBQXBDdUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFzQ3hDLGdDQUFZdEIsU0FBWixtSUFBdUI7QUFBbEJNLGVBQWtCO0FBQUU7QUFDdkI7QUFDQTtBQUNBLGdCQUFJdUIsVUFBVXZCLElBQUlXLElBQUosQ0FBU2EsTUFBVCxDQUFnQixVQUFDQyxHQUFELEVBQUtDLElBQUw7QUFBQSxxQkFBY0QsTUFBTUMsS0FBS1YsU0FBekI7QUFBQSxhQUFoQixFQUFtRCxDQUFuRCxDQUFkO0FBQ0EsZ0JBQUlXLE9BQU8zQixJQUFJVyxJQUFKLENBQVNhLE1BQVQsQ0FBZ0IsVUFBQ0MsR0FBRCxFQUFLQyxJQUFMO0FBQUEscUJBQWNELE1BQU0sQ0FBQ0MsS0FBS1gsUUFBTCxHQUFnQlcsS0FBS2IsVUFBdEIsSUFBb0MsQ0FBcEMsR0FBd0NhLEtBQUtWLFNBQWpFO0FBQUEsYUFBaEIsRUFBMkYsQ0FBM0YsSUFBZ0dPLE9BQTNHO0FBQ0F2QixnQkFBSW5CLFNBQUosR0FBZ0IrQyxNQUFNRCxJQUFOLElBQWMsQ0FBZCxHQUFrQkEsSUFBbEM7QUFDRDtBQTVDdUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUE4Q3hDekIsc0JBQWNSLFVBQVU4QixNQUFWLENBQWlCLFVBQUNLLEdBQUQsRUFBTUgsSUFBTjtBQUFBLGlCQUFlbkIsS0FBS3VCLEdBQUwsQ0FBU0QsR0FBVCxFQUFjSCxLQUFLZixJQUFMLENBQVVhLE1BQVYsQ0FBaUIsVUFBQ08sQ0FBRCxFQUFJQyxDQUFKO0FBQUEsbUJBQVV6QixLQUFLdUIsR0FBTCxDQUFTQyxDQUFULEVBQVlDLEVBQUVoQixTQUFkLENBQVY7QUFBQSxXQUFqQixFQUFxRCxDQUFyRCxDQUFkLENBQWY7QUFBQSxTQUFqQixFQUF3RyxDQUF4RyxDQUFkO0FBQ0EsYUFBS3ZCLEdBQUwsV0FBaUJGLEtBQWpCLEVBQTBCO0FBQ3hCRyxxQkFBV0EsU0FEYTtBQUV4QlEsdUJBQWFBLFdBRlc7QUFHeEJWLGlCQUFPQSxLQUhpQjtBQUl4QnlDLHFCQUFXO0FBSmEsU0FBMUI7QUFNRDtBQTNESDtBQUFBO0FBQUEsNkJBNkRTQyxTQTdEVCxFQTZEb0JDLE1BN0RwQixFQTZENEI7QUFDeEIsWUFBSUMsT0FBT0MsSUFBUCxDQUFZLEtBQUtqQyxHQUFMLENBQVMsTUFBVCxDQUFaLEVBQThCa0MsTUFBbEMsRUFBMEM7QUFDeEMsZUFBSyxJQUFJL0MsS0FBVCxJQUFrQixLQUFLYSxHQUFMLENBQVMsTUFBVCxDQUFsQixFQUFvQztBQUNsQyxnQkFBSSxLQUFLQSxHQUFMLFdBQWlCYixLQUFqQixnQkFBSixFQUF5QztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUN2QyxzQ0FBcUIsS0FBS2EsR0FBTCxXQUFpQmIsS0FBakIsZ0JBQXJCLG1JQUEwRDtBQUFBLHNCQUFqRGdELFFBQWlEOztBQUN4RCxzQkFBSUEsU0FBU2xDLFNBQVQsSUFBc0I2QixTQUF0QixJQUFtQ0ssU0FBU2pDLE9BQVQsR0FBbUI0QixTQUExRCxFQUFxRTtBQUNuRSx5QkFBS3pDLEdBQUwsZ0JBQXNCRixLQUF0QixFQUErQmdELFNBQVM1QixJQUF4QztBQUNBLHlCQUFLbEIsR0FBTCxnQkFBc0JGLEtBQXRCLEVBQStCZ0QsU0FBUzFELFNBQXhDO0FBQ0E7QUFDRDtBQUNGO0FBUHNDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFReEM7QUFDRjtBQUNELGVBQUtZLEdBQUwsQ0FBUyxRQUFULEVBQW1CMEMsTUFBbkI7QUFDRDtBQUNGO0FBNUVIO0FBQUE7QUFBQSxtQ0E4RWVLLGFBOUVmLEVBOEU4QjtBQUMxQixhQUFLL0MsR0FBTCx3QkFBZ0MrQyxhQUFoQztBQUNEO0FBaEZIO0FBQUE7QUFBQSw4QkFrRlU7QUFDTixhQUFLL0MsR0FBTCxDQUFTLE1BQVQsRUFBaUIsRUFBakI7QUFDRDtBQXBGSDs7QUFBQTtBQUFBLElBQTBDckIsS0FBMUM7QUFzRkQsQ0E3R0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBiaW5Db3VudDogMjQsXG4gICAgICBkVDogMSxcbiAgICAgIHRTdGVwOiAxLFxuICAgICAgZGF0YToge30sXG4gICAgICBoaXN0b2dyYW06IHt9LFxuICAgICAgbWVhblRoZXRhOiAwLFxuICAgICAgd2lkdGg6IDIwMCxcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgbWFyZ2luczoge1xuICAgICAgICB0b3A6IDMwLFxuICAgICAgICByaWdodDogMzAsXG4gICAgICAgIGJvdHRvbTogMzAsXG4gICAgICAgIGxlZnQ6IDMwXG4gICAgICB9XG4gICAgfVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIENpcmNsZUhpc3RvZ3JhbU1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhKGRhdGEsIGxheWVyID0gJ2RlZmF1bHQnLCBjb2xvcikge1xuICAgICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnNldChgZGF0YS4ke2xheWVyfWAsIG51bGwpO1xuICAgICAgICB0aGlzLnNldChgaGlzdG9ncmFtLiR7bGF5ZXJ9YCwgbnVsbCk7XG4gICAgICAgIHRoaXMuc2V0KGBtZWFuVGhldGEuJHtsYXllcn1gLCBudWxsKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IGludGVydmFscywgaSwgaiwgcGFyc2VkLCB0cmFjaywgc2FtcGxlLCBpbnQsIGJpbiwgbWF4QmluVmFsdWU7XG4gICAgICBpbnRlcnZhbHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLnJ1blRpbWU7IGkgKz0gdGhpcy5nZXQoJ3RTdGVwJykpIHtcbiAgICAgICAgcGFyc2VkID0ge1xuICAgICAgICAgIHRpbWVTdGFydDogaSxcbiAgICAgICAgICB0aW1lRW5kOiBNYXRoLm1pbihpICsgdGhpcy5nZXQoJ3RTdGVwJyksIGRhdGEucnVuVGltZSksXG4gICAgICAgICAgc2FtcGxlU3RhcnQ6IE1hdGgubWluKGkgKyB0aGlzLmdldCgndFN0ZXAnKSwgZGF0YS5ydW5UaW1lKSAtIHRoaXMuZ2V0KCdkVCcpLFxuICAgICAgICAgIHNhbXBsZUVuZDogTWF0aC5taW4oaSArIHRoaXMuZ2V0KCd0U3RlcCcpLCBkYXRhLnJ1blRpbWUpLFxuICAgICAgICAgIGJpbnM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIGZvciAoaiA9IDAgOyBqIDwgdGhpcy5nZXQoJ2JpbkNvdW50Jyk7IGorKykge1xuICAgICAgICAgIHBhcnNlZC5iaW5zLnB1c2goeyAvLyBwYXJzZWQgY29udGFpbnMgdGhlIGZyZXF1ZW5jeSBwZXIgYmluXG4gICAgICAgICAgICB0aGV0YVN0YXJ0OiBqICogVXRpbHMuVEFVIC8gdGhpcy5nZXQoJ2JpbkNvdW50JyksIC8vIFV0aWxzLlRBVSA9IDIqTUFUSC5QSVxuICAgICAgICAgICAgdGhldGFFbmQ6IChqKzEpICogVXRpbHMuVEFVIC8gdGhpcy5nZXQoJ2JpbkNvdW50JyksXG4gICAgICAgICAgICBmcmVxdWVuY3k6IDBcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGludGVydmFscy5wdXNoKHBhcnNlZCk7IC8vIENvbnRhaW5zIGRhdGEucnVuVGltZSBlbGVtZW50c1xuICAgICAgfVxuICAgICAgZm9yICh0cmFjayBvZiBkYXRhLnRyYWNrcykge1xuICAgICAgICBmb3IgKHNhbXBsZSBvZiB0cmFjay5zYW1wbGVzKSB7XG4gICAgICAgICAgYmluID0gTWF0aC5mbG9vcih0aGlzLmdldCgnYmluQ291bnQnKSAqIFV0aWxzLnBvc01vZChzYW1wbGUuYW5nbGVYWSwgVXRpbHMuVEFVKSAvIFV0aWxzLlRBVSk7IC8vIEdldCB0aGUgYmluIGluIHdoaWNoIHRoZSBhbmdsZSBmYWxsc1xuICAgICAgICAgIC8vIEkgY2hlY2tlZCB3aGV0aGVyIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGUgYW5nbGVYWSBoYXMgYmVlbiBkb25lIGJ5IGNhbGN1bGF0aW5nIHRoZSBhdGFuMiwgb3IgYWNvcyBvZiB0aGUgc2FtcGxlIHNwZWVkcy4gT25seSBpbiBjYXNlcyB0aGUgc3BlZWQgaXMgemVybyBkaWQgdGhlIHZhbHVlcyBmb3IgYm90aCBkZXZpYXRlLiBTbywgc2FtcGxlLmFuZ2xlWFkgaXMgYXMgZ29vZCBhcyBpdCBnZXRzLlxuICAgICAgICAgIGZvciAoaW50IG9mIGludGVydmFscykge1xuICAgICAgICAgICAgaWYgKGludC5zYW1wbGVTdGFydCA8PSBzYW1wbGUudGltZSAmJiBpbnQuc2FtcGxlRW5kID4gc2FtcGxlLnRpbWUpIHtcbiAgICAgICAgICAgICAgaW50LmJpbnNbYmluXS5mcmVxdWVuY3kgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChpbnQgb2YgaW50ZXJ2YWxzKSB7IC8vIENhbGN1bGF0ZSB0aGUgd2VpZ2h0ZWQgYXZlcmFnZSBvcmllbnRhdGlvbiBmb3IgdGhlIGNpcmN1bGFyIGhpc3RvZ3JhbXMgKHdlaWdodGVkIGJ5IGZyZXF1ZW5jaWVzKVxuICAgICAgICAvLyBJIHJlYWxpemUgdGhpcyBkb2Vzbid0IGFjdHVhbGx5IHdvcmsuIElmIHRoZSBkaXN0cmlidXRpb24gaXMgY29tcGxldGVseSBjaXJjdWxhciwgdGhlbiB0aGUgbWVhblRoZXRhIGxpbmUgd2lsbCwgaWYgY2FsY3VsYXRlZCBsaWtlIG5vdywgc3RpbGwgaGF2ZSBhIHJhZGlhbiBvZiAzLiBJdCBzaG91bGQgdGhlbiBoYXZlIGEgbGVuZ3RoIG9mIHplcm8uXG4gICAgICAgIC8vIEluIG9yZGVyIHRvIGNhbGN1bGF0ZSB0aGUgbGVuZ3RoLCBJIGhhdmUgdG8gc2VlIGhvdyB0aGUgZGlzdHJpYnV0aW9uIGlzIGdlbmVyYXRlZCAoZS5nLiBtYXhWYWx1ZSBhcyBtYXggbGVuZ3RoKS4gSXQgY291bGQgYmUgcHJvcG9ydGlvbmFsIHRvIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGxvbmdlc3QgYW5kIHNob3J0ZXN0IGhpc3RvZ3JhbSBpbiBhbiBpbnN0YW5jZT9cbiAgICAgICAgbGV0IG51bUZyZXEgPSBpbnQuYmlucy5yZWR1Y2UoKGFjYyxjdXJyKSA9PiBhY2MgKyBjdXJyLmZyZXF1ZW5jeSwwKTtcbiAgICAgICAgbGV0IG1lYW4gPSBpbnQuYmlucy5yZWR1Y2UoKGFjYyxjdXJyKSA9PiBhY2MgKyAoY3Vyci50aGV0YUVuZCArIGN1cnIudGhldGFTdGFydCkgLyAyICogY3Vyci5mcmVxdWVuY3ksMCkgLyBudW1GcmVxO1xuICAgICAgICBpbnQubWVhblRoZXRhID0gaXNOYU4obWVhbikgPyAwIDogbWVhbjtcbiAgICAgIH1cblxuICAgICAgbWF4QmluVmFsdWUgPSBpbnRlcnZhbHMucmVkdWNlKCh2YWwsIGN1cnIpID0+IE1hdGgubWF4KHZhbCwgY3Vyci5iaW5zLnJlZHVjZSgodiwgYykgPT4gTWF0aC5tYXgodiwgYy5mcmVxdWVuY3kpLCAwKSksIDApO1xuICAgICAgdGhpcy5zZXQoYGRhdGEuJHtsYXllcn1gLCB7XG4gICAgICAgIGludGVydmFsczogaW50ZXJ2YWxzLFxuICAgICAgICBtYXhCaW5WYWx1ZTogbWF4QmluVmFsdWUsXG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgc2hvd0xheWVyOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGUodGltZXN0YW1wLCBsaWdodHMpIHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmdldCgnZGF0YScpKS5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChsZXQgbGF5ZXIgaW4gdGhpcy5nZXQoJ2RhdGEnKSkge1xuICAgICAgICAgIGlmICh0aGlzLmdldChgZGF0YS4ke2xheWVyfS5pbnRlcnZhbHNgKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaW50ZXJ2YWwgb2YgdGhpcy5nZXQoYGRhdGEuJHtsYXllcn0uaW50ZXJ2YWxzYCkpIHtcbiAgICAgICAgICAgICAgaWYgKGludGVydmFsLnRpbWVTdGFydCA8PSB0aW1lc3RhbXAgJiYgaW50ZXJ2YWwudGltZUVuZCA+IHRpbWVzdGFtcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KGBoaXN0b2dyYW0uJHtsYXllcn1gLCBpbnRlcnZhbC5iaW5zKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldChgbWVhblRoZXRhLiR7bGF5ZXJ9YCwgaW50ZXJ2YWwubWVhblRoZXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldCgnbGlnaHRzJywgbGlnaHRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMYXllckxpdmUoc2hvd0xheWVyTGl2ZSkge1xuICAgICAgdGhpcy5zZXQoYGRhdGEubGl2ZS5zaG93TGF5ZXJgLCBzaG93TGF5ZXJMaXZlKVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5zZXQoJ2RhdGEnLCB7fSk7XG4gICAgfVxuICB9XG59KVxuIl19
