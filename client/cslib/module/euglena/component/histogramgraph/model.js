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
    binCount: 20,
    vRange: 200,
    mode: 'total',
    dT: 1,
    tStep: 2,
    width: 200,
    height: 200,
    margins: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 40
    }
  };

  return function (_Model) {
    _inherits(HistogramModel, _Model);

    function HistogramModel() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, HistogramModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(HistogramModel).call(this, config));
    }

    _createClass(HistogramModel, [{
      key: 'parseData',
      value: function parseData(data) {
        var _this2 = this;

        var intervals = void 0,
            i = void 0,
            j = void 0,
            k = void 0,
            parsed = void 0,
            track = void 0,
            sample = void 0,
            int = void 0,
            bin = void 0,
            maxBinValue = void 0,
            usedVrange = void 0;
        usedVrange = Globals.get('AppConfig.histogram.vRange') ? this.get('vRange') : data.tracks.reduce(function (tVal, tCurr) {
          return Math.max(tVal, tCurr.samples.filter(function (a) {
            return Utils.exists(a.speed);
          }).reduce(function (sVal, sCurr) {
            return Math.max(sVal, _this2.get('mode') == 'component' ? Math.max(sCurr.speedX, sCurr.speedY) : sCurr.speed);
          }, 0));
        }, 0);
        usedVrange = Math.ceil(usedVrange);

        intervals = [];
        for (i = 0; i < data.runTime; i += this.get('tStep')) {
          parsed = {
            timeStart: i,
            timeEnd: Math.min(i + this.get('tStep'), data.runTime),
            sampleStart: Math.min(i + this.get('tStep'), data.runTime) - this.get('dT'),
            sampleEnd: Math.min(i + this.get('tStep'), data.runTime),
            bins: {}
          };
          var binSize = 0;
          if (this.get('mode') == 'component') {
            parsed.bins.x = [];
            parsed.bins.y = [];
            binSize = usedVrange * 2 / this.get('binCount');
          } else {
            parsed.bins.total = [];
            binSize = usedVrange / this.get('binCount');
          }
          for (j = 0; j < this.get('binCount'); j++) {
            for (k in parsed.bins) {
              if (this.get('mode') == 'component') {
                parsed.bins[k].push({
                  vStart: j * binSize - usedVrange,
                  vEnd: (j + 1) * binSize - usedVrange,
                  frequency: 0
                });
              } else {
                parsed.bins[k].push({
                  vStart: j * binSize,
                  vEnd: (j + 1) * binSize,
                  frequency: 0
                });
              }
            }
          }
          intervals.push(parsed);
        }
        maxBinValue = 0;
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

                if (!sample.speed) continue;
                if (this.get('mode') == 'component') {
                  if (Math.abs(sample.speedX) > usedVrange || Math.abs(sample.speedY) > usedVrange) continue;
                } else {
                  if (Math.abs(sample.speed) > usedVrange) continue;
                }
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = intervals[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    int = _step3.value;

                    if (int.sampleStart <= sample.time && int.sampleEnd > sample.time) {
                      if (this.get('mode') == 'component') {
                        var binX = Math.floor((sample.speedX + usedVrange) / (usedVrange * 2) * this.get('binCount'));
                        var binY = Math.floor((sample.speedY + usedVrange) / (usedVrange * 2) * this.get('binCount'));
                        int.bins.x[binX].frequency += 1;
                        int.bins.y[binY].frequency += 1;
                        maxBinValue = Math.max(maxBinValue, Math.max(int.bins.x[binX].frequency, int.bins.y[binY].frequency));
                      } else {
                        var _bin = Math.floor(this.get('binCount') * sample.speed / usedVrange);
                        int.bins.total[_bin].frequency += 1;
                        maxBinValue = Math.max(maxBinValue, int.bins.total[_bin].frequency);
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

        this.set('data', {
          intervals: intervals,
          maxBinValue: maxBinValue
        });
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.set('data', null);
      }
    }, {
      key: 'update',
      value: function update(timestamp) {
        if (this.get('data')) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = this.get('data.intervals')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var interval = _step4.value;

              if (interval.timeStart <= timestamp && interval.timeEnd > timestamp) {
                this.set('histogram', interval.bins);
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
      }
    }]);

    return HistogramModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFFBQVEsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsVUFBVSxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUlFLFdBQVc7QUFDVCxjQUFVLEVBREQ7QUFFVCxZQUFRLEdBRkM7QUFHVCxVQUFNLE9BSEc7QUFJVCxRQUFJLENBSks7QUFLVCxXQUFPLENBTEU7QUFNVCxXQUFPLEdBTkU7QUFPVCxZQUFRLEdBUEM7QUFRVCxhQUFTO0FBQ1AsV0FBSyxFQURFO0FBRVAsYUFBTyxFQUZBO0FBR1AsY0FBUSxFQUhEO0FBSVAsWUFBTTtBQUpDO0FBUkEsR0FKYjs7QUFxQkE7QUFBQTs7QUFDRSw4QkFBeUI7QUFBQSxVQUFiLE1BQWEseURBQUosRUFBSTs7QUFBQTs7QUFDdkIsYUFBTyxRQUFQLEdBQWtCLE1BQU0sY0FBTixDQUFxQixPQUFPLFFBQTVCLEVBQXNDLFFBQXRDLENBQWxCO0FBRHVCLCtGQUVqQixNQUZpQjtBQUd4Qjs7QUFKSDtBQUFBO0FBQUEsZ0NBTVksSUFOWixFQU1rQjtBQUFBOztBQUNkLFlBQUksa0JBQUo7QUFBQSxZQUFlLFVBQWY7QUFBQSxZQUFrQixVQUFsQjtBQUFBLFlBQXFCLFVBQXJCO0FBQUEsWUFBd0IsZUFBeEI7QUFBQSxZQUFnQyxjQUFoQztBQUFBLFlBQXVDLGVBQXZDO0FBQUEsWUFBK0MsWUFBL0M7QUFBQSxZQUFvRCxZQUFwRDtBQUFBLFlBQXlELG9CQUF6RDtBQUFBLFlBQXNFLG1CQUF0RTtBQUNBLHFCQUFhLFFBQVEsR0FBUixDQUFZLDRCQUFaLElBQTRDLEtBQUssR0FBTCxDQUFTLFFBQVQsQ0FBNUMsR0FBaUUsS0FBSyxNQUFMLENBQVksTUFBWixDQUMxRSxV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QixTQUF0RCxDQUF0QixDQUFkO0FBQ0QsdUJBTkQsTUFNTztBQUNMLDRCQUFJLE9BQU0sS0FBSyxLQUFMLENBQVcsS0FBSyxHQUFMLENBQVMsVUFBVCxJQUF1QixPQUFPLEtBQTlCLEdBQXNDLFVBQWpELENBQVY7QUFDQSw0QkFBSSxJQUFKLENBQVMsS0FBVCxDQUFlLElBQWYsRUFBb0IsU0FBcEIsSUFBaUMsQ0FBakM7QUFDQSxzQ0FBYyxLQUFLLEdBQUwsQ0FBUyxXQUFULEVBQXNCLElBQUksSUFBSixDQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQW9CLFNBQTFDLENBQWQ7QUFDRDtBQUNGO0FBQ0Y7QUFyQjJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFzQjdCO0FBdkJ3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBd0IxQjtBQXpFYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQTBFZCxhQUFLLEdBQUwsQ0FBUyxNQUFULEVBQWlCO0FBQ2YscUJBQVcsU0FESTtBQUVmLHVCQUFhO0FBRkUsU0FBakI7QUFJRDtBQXBGSDtBQUFBO0FBQUEsOEJBc0ZVO0FBQ04sYUFBSyxHQUFMLENBQVMsTUFBVCxFQUFpQixJQUFqQjtBQUNEO0FBeEZIO0FBQUE7QUFBQSw2QkEwRlMsU0ExRlQsRUEwRm9CO0FBQ2hCLFlBQUksS0FBSyxHQUFMLENBQVMsTUFBVCxDQUFKLEVBQXNCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3BCLGtDQUFxQixLQUFLLEdBQUwsQ0FBUyxnQkFBVCxDQUFyQixtSUFBaUQ7QUFBQSxrQkFBeEMsUUFBd0M7O0FBQy9DLGtCQUFJLFNBQVMsU0FBVCxJQUFzQixTQUF0QixJQUFtQyxTQUFTLE9BQVQsR0FBbUIsU0FBMUQsRUFBcUU7QUFDbkUscUJBQUssR0FBTCxDQUFTLFdBQVQsRUFBc0IsU0FBUyxJQUEvQjtBQUNBO0FBQ0Q7QUFDRjtBQU5tQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT3JCO0FBQ0Y7QUFuR0g7O0FBQUE7QUFBQSxJQUFvQyxLQUFwQztBQXFHRCxDQTNIRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvaGlzdG9ncmFtZ3JhcGgvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
