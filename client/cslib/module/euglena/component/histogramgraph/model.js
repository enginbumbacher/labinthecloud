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
    data: {},
    raw: {},
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
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, HistogramModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (HistogramModel.__proto__ || Object.getPrototypeOf(HistogramModel)).call(this, config));
    }

    _createClass(HistogramModel, [{
      key: 'parseData',
      value: function parseData(data) {
        var _this2 = this;

        var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
        var color = arguments[2];

        this.set('raw.' + layer, data);
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
            usedVrange = void 0,
            pdata = void 0,
            rdata = void 0;
        usedVrange = Globals.get('AppConfig.histogram.vRange') ? this.get('vRange') : Object.values(this.get('raw')).reduce(function (acc, val) {
          return Math.max(acc, val.tracks.reduce(function (tacc, tval) {
            return Math.max(tacc, tval.samples.filter(function (a) {
              return Utils.exists(a.speed);
            }).reduce(function (sacc, sval) {
              return Math.max(sacc, _this2.get('mode') == 'component' ? Math.max(Math.abs(sval.speedX), Math.abs(sval.speedY)) : sval.speed);
            }, 0));
          }, 0));
        }, 0);
        usedVrange = Math.ceil(usedVrange);

        pdata = {};
        for (var rlayer in this.get('raw')) {
          rdata = this.get('raw.' + rlayer);
          intervals = [];
          for (i = 0; i < rdata.runTime; i += this.get('tStep')) {
            parsed = {
              timeStart: i,
              timeEnd: Math.min(i + this.get('tStep'), rdata.runTime),
              sampleStart: Math.min(i + this.get('tStep'), rdata.runTime) - this.get('dT'),
              sampleEnd: Math.min(i + this.get('tStep'), rdata.runTime),
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
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = rdata.tracks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
                        } else {
                          var _bin = Math.floor(this.get('binCount') * sample.speed / usedVrange);
                          int.bins.total[_bin].frequency += 1;
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

          intervals.forEach(function (int) {
            var maxCount = Object.values(int.bins).reduce(function (acc, val) {
              return acc + val.reduce(function (sa, sv) {
                return sa + sv.frequency;
              }, 0);
            }, 0);
            Object.values(int.bins).forEach(function (binGroup) {
              binGroup.forEach(function (bin) {
                if (maxCount == 0) {
                  bin.value = 0;
                } else {
                  bin.value = bin.frequency / maxCount;
                }
              });
            });
          });
          pdata[rlayer] = {
            intervals: intervals,
            color: layer == rlayer ? color : null, // if trying to display multiple models simultaneously, this will need better management
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
    }, {
      key: 'update',
      value: function update(timestamp) {
        if (this.get('data')) {
          var histogram = {};
          for (var layer in this.get('data')) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = this.get('data.' + layer + '.intervals')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var interval = _step4.value;

                if (interval.timeStart <= timestamp && interval.timeEnd > timestamp) {
                  histogram[layer] = interval.bins;
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
          this.set('histogram', histogram);
        }
      }
    }]);

    return HistogramModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsIkdsb2JhbHMiLCJkZWZhdWx0cyIsImJpbkNvdW50IiwidlJhbmdlIiwibW9kZSIsImRUIiwidFN0ZXAiLCJ3aWR0aCIsImhlaWdodCIsImRhdGEiLCJyYXciLCJtYXJnaW5zIiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiLCJsYXllciIsImNvbG9yIiwic2V0IiwiaW50ZXJ2YWxzIiwiaSIsImoiLCJrIiwicGFyc2VkIiwidHJhY2siLCJzYW1wbGUiLCJpbnQiLCJiaW4iLCJtYXhCaW5WYWx1ZSIsInVzZWRWcmFuZ2UiLCJwZGF0YSIsInJkYXRhIiwiZ2V0IiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwidmFsIiwiTWF0aCIsIm1heCIsInRyYWNrcyIsInRhY2MiLCJ0dmFsIiwic2FtcGxlcyIsImZpbHRlciIsImEiLCJleGlzdHMiLCJzcGVlZCIsInNhY2MiLCJzdmFsIiwiYWJzIiwic3BlZWRYIiwic3BlZWRZIiwiY2VpbCIsInJsYXllciIsInJ1blRpbWUiLCJ0aW1lU3RhcnQiLCJ0aW1lRW5kIiwibWluIiwic2FtcGxlU3RhcnQiLCJzYW1wbGVFbmQiLCJiaW5zIiwiYmluU2l6ZSIsIngiLCJ5IiwidG90YWwiLCJwdXNoIiwidlN0YXJ0IiwidkVuZCIsImZyZXF1ZW5jeSIsInRpbWUiLCJiaW5YIiwiZmxvb3IiLCJiaW5ZIiwiZm9yRWFjaCIsIm1heENvdW50Iiwic2EiLCJzdiIsImJpbkdyb3VwIiwidmFsdWUiLCJzaG93TGF5ZXIiLCJzaG93TGF5ZXJMaXZlIiwidGltZXN0YW1wIiwiaGlzdG9ncmFtIiwiaW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsVUFBVUgsUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFJRUksV0FBVztBQUNUQyxjQUFVLEVBREQ7QUFFVEMsWUFBUSxHQUZDO0FBR1RDLFVBQU0sT0FIRztBQUlUQyxRQUFJLENBSks7QUFLVEMsV0FBTyxDQUxFO0FBTVRDLFdBQU8sR0FORTtBQU9UQyxZQUFRLEdBUEM7QUFRVEMsVUFBTSxFQVJHO0FBU1RDLFNBQUssRUFUSTtBQVVUQyxhQUFTO0FBQ1BDLFdBQUssRUFERTtBQUVQQyxhQUFPLEVBRkE7QUFHUEMsY0FBUSxFQUhEO0FBSVBDLFlBQU07QUFKQztBQVZBLEdBSmI7O0FBdUJBO0FBQUE7O0FBQ0UsOEJBQXlCO0FBQUEsVUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUN2QkEsYUFBT2YsUUFBUCxHQUFrQkYsTUFBTWtCLGNBQU4sQ0FBcUJELE9BQU9mLFFBQTVCLEVBQXNDQSxRQUF0QyxDQUFsQjtBQUR1Qiw2SEFFakJlLE1BRmlCO0FBR3hCOztBQUpIO0FBQUE7QUFBQSxnQ0FNWVAsSUFOWixFQU00QztBQUFBOztBQUFBLFlBQTFCUyxLQUEwQix1RUFBbEIsU0FBa0I7QUFBQSxZQUFQQyxLQUFPOztBQUN4QyxhQUFLQyxHQUFMLFVBQWdCRixLQUFoQixFQUF5QlQsSUFBekI7QUFDQSxZQUFJWSxrQkFBSjtBQUFBLFlBQWVDLFVBQWY7QUFBQSxZQUFrQkMsVUFBbEI7QUFBQSxZQUFxQkMsVUFBckI7QUFBQSxZQUF3QkMsZUFBeEI7QUFBQSxZQUFnQ0MsY0FBaEM7QUFBQSxZQUF1Q0MsZUFBdkM7QUFBQSxZQUErQ0MsWUFBL0M7QUFBQSxZQUFvREMsWUFBcEQ7QUFBQSxZQUF5REMsb0JBQXpEO0FBQUEsWUFBc0VDLG1CQUF0RTtBQUFBLFlBQWtGQyxjQUFsRjtBQUFBLFlBQXlGQyxjQUF6RjtBQUNBRixxQkFBYS9CLFFBQVFrQyxHQUFSLENBQVksNEJBQVosSUFBNEMsS0FBS0EsR0FBTCxDQUFTLFFBQVQsQ0FBNUMsR0FBaUVDLE9BQU9DLE1BQVAsQ0FBYyxLQUFLRixHQUFMLENBQVMsS0FBVCxDQUFkLEVBQStCRyxNQUEvQixDQUFzQyxVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUNoSSxpQkFBT0MsS0FBS0MsR0FBTCxDQUFTSCxHQUFULEVBQWNDLElBQUlHLE1BQUosQ0FBV0wsTUFBWCxDQUFrQixVQUFDTSxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDckQsbUJBQU9KLEtBQUtDLEdBQUwsQ0FBU0UsSUFBVCxFQUFlQyxLQUFLQyxPQUFMLENBQWFDLE1BQWIsQ0FBb0IsVUFBQ0MsQ0FBRDtBQUFBLHFCQUFPaEQsTUFBTWlELE1BQU4sQ0FBYUQsRUFBRUUsS0FBZixDQUFQO0FBQUEsYUFBcEIsRUFBa0RaLE1BQWxELENBQXlELFVBQUNhLElBQUQsRUFBT0MsSUFBUCxFQUFnQjtBQUM3RixxQkFBT1gsS0FBS0MsR0FBTCxDQUFTUyxJQUFULEVBQWUsT0FBS2hCLEdBQUwsQ0FBUyxNQUFULEtBQW9CLFdBQXBCLEdBQWtDTSxLQUFLQyxHQUFMLENBQVNELEtBQUtZLEdBQUwsQ0FBU0QsS0FBS0UsTUFBZCxDQUFULEVBQWdDYixLQUFLWSxHQUFMLENBQVNELEtBQUtHLE1BQWQsQ0FBaEMsQ0FBbEMsR0FBMkZILEtBQUtGLEtBQS9HLENBQVA7QUFDRCxhQUZxQixFQUVuQixDQUZtQixDQUFmLENBQVA7QUFHRCxXQUpvQixFQUlsQixDQUprQixDQUFkLENBQVA7QUFLRCxTQU42RSxFQU0zRSxDQU4yRSxDQUE5RTtBQU9BbEIscUJBQWFTLEtBQUtlLElBQUwsQ0FBVXhCLFVBQVYsQ0FBYjs7QUFFQUMsZ0JBQVEsRUFBUjtBQUNBLGFBQUssSUFBSXdCLE1BQVQsSUFBbUIsS0FBS3RCLEdBQUwsQ0FBUyxLQUFULENBQW5CLEVBQW9DO0FBQ2xDRCxrQkFBUSxLQUFLQyxHQUFMLFVBQWdCc0IsTUFBaEIsQ0FBUjtBQUNBbkMsc0JBQVksRUFBWjtBQUNBLGVBQUtDLElBQUksQ0FBVCxFQUFZQSxJQUFJVyxNQUFNd0IsT0FBdEIsRUFBK0JuQyxLQUFLLEtBQUtZLEdBQUwsQ0FBUyxPQUFULENBQXBDLEVBQXVEO0FBQ3JEVCxxQkFBUztBQUNQaUMseUJBQVdwQyxDQURKO0FBRVBxQyx1QkFBU25CLEtBQUtvQixHQUFMLENBQVN0QyxJQUFJLEtBQUtZLEdBQUwsQ0FBUyxPQUFULENBQWIsRUFBZ0NELE1BQU13QixPQUF0QyxDQUZGO0FBR1BJLDJCQUFhckIsS0FBS29CLEdBQUwsQ0FBU3RDLElBQUksS0FBS1ksR0FBTCxDQUFTLE9BQVQsQ0FBYixFQUFnQ0QsTUFBTXdCLE9BQXRDLElBQWlELEtBQUt2QixHQUFMLENBQVMsSUFBVCxDQUh2RDtBQUlQNEIseUJBQVd0QixLQUFLb0IsR0FBTCxDQUFTdEMsSUFBSSxLQUFLWSxHQUFMLENBQVMsT0FBVCxDQUFiLEVBQWdDRCxNQUFNd0IsT0FBdEMsQ0FKSjtBQUtQTSxvQkFBTTtBQUxDLGFBQVQ7QUFPQSxnQkFBSUMsVUFBVSxDQUFkO0FBQ0EsZ0JBQUksS0FBSzlCLEdBQUwsQ0FBUyxNQUFULEtBQW9CLFdBQXhCLEVBQXFDO0FBQ25DVCxxQkFBT3NDLElBQVAsQ0FBWUUsQ0FBWixHQUFnQixFQUFoQjtBQUNBeEMscUJBQU9zQyxJQUFQLENBQVlHLENBQVosR0FBZ0IsRUFBaEI7QUFDQUYsd0JBQVVqQyxhQUFhLENBQWIsR0FBaUIsS0FBS0csR0FBTCxDQUFTLFVBQVQsQ0FBM0I7QUFDRCxhQUpELE1BSU87QUFDTFQscUJBQU9zQyxJQUFQLENBQVlJLEtBQVosR0FBb0IsRUFBcEI7QUFDQUgsd0JBQVVqQyxhQUFhLEtBQUtHLEdBQUwsQ0FBUyxVQUFULENBQXZCO0FBQ0Q7QUFDRCxpQkFBS1gsSUFBSSxDQUFULEVBQWFBLElBQUksS0FBS1csR0FBTCxDQUFTLFVBQVQsQ0FBakIsRUFBdUNYLEdBQXZDLEVBQTRDO0FBQzFDLG1CQUFLQyxDQUFMLElBQVVDLE9BQU9zQyxJQUFqQixFQUF1QjtBQUNyQixvQkFBSSxLQUFLN0IsR0FBTCxDQUFTLE1BQVQsS0FBb0IsV0FBeEIsRUFBcUM7QUFDbkNULHlCQUFPc0MsSUFBUCxDQUFZdkMsQ0FBWixFQUFlNEMsSUFBZixDQUFvQjtBQUNsQkMsNEJBQVE5QyxJQUFJeUMsT0FBSixHQUFjakMsVUFESjtBQUVsQnVDLDBCQUFNLENBQUMvQyxJQUFJLENBQUwsSUFBVXlDLE9BQVYsR0FBb0JqQyxVQUZSO0FBR2xCd0MsK0JBQVc7QUFITyxtQkFBcEI7QUFLRCxpQkFORCxNQU1PO0FBQ0w5Qyx5QkFBT3NDLElBQVAsQ0FBWXZDLENBQVosRUFBZTRDLElBQWYsQ0FBb0I7QUFDbEJDLDRCQUFROUMsSUFBSXlDLE9BRE07QUFFbEJNLDBCQUFNLENBQUMvQyxJQUFJLENBQUwsSUFBVXlDLE9BRkU7QUFHbEJPLCtCQUFXO0FBSE8sbUJBQXBCO0FBS0Q7QUFDRjtBQUNGO0FBQ0RsRCxzQkFBVStDLElBQVYsQ0FBZTNDLE1BQWY7QUFDRDtBQXRDaUM7QUFBQTtBQUFBOztBQUFBO0FBdUNsQyxpQ0FBY1EsTUFBTVMsTUFBcEIsOEhBQTRCO0FBQXZCaEIsbUJBQXVCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQzFCLHNDQUFlQSxNQUFNbUIsT0FBckIsbUlBQThCO0FBQXpCbEIsd0JBQXlCOztBQUM1QixzQkFBSSxDQUFDQSxPQUFPc0IsS0FBWixFQUFtQjtBQUNuQixzQkFBSSxLQUFLZixHQUFMLENBQVMsTUFBVCxLQUFvQixXQUF4QixFQUFxQztBQUNuQyx3QkFBSU0sS0FBS1ksR0FBTCxDQUFTekIsT0FBTzBCLE1BQWhCLElBQTBCdEIsVUFBMUIsSUFBd0NTLEtBQUtZLEdBQUwsQ0FBU3pCLE9BQU8yQixNQUFoQixJQUEwQnZCLFVBQXRFLEVBQWtGO0FBQ25GLG1CQUZELE1BRU87QUFDTCx3QkFBSVMsS0FBS1ksR0FBTCxDQUFTekIsT0FBT3NCLEtBQWhCLElBQXlCbEIsVUFBN0IsRUFBeUM7QUFDMUM7QUFOMkI7QUFBQTtBQUFBOztBQUFBO0FBTzVCLDBDQUFZVixTQUFaLG1JQUF1QjtBQUFsQk8seUJBQWtCOztBQUNyQiwwQkFBSUEsSUFBSWlDLFdBQUosSUFBbUJsQyxPQUFPNkMsSUFBMUIsSUFBa0M1QyxJQUFJa0MsU0FBSixHQUFnQm5DLE9BQU82QyxJQUE3RCxFQUFtRTtBQUNqRSw0QkFBSSxLQUFLdEMsR0FBTCxDQUFTLE1BQVQsS0FBb0IsV0FBeEIsRUFBcUM7QUFDbkMsOEJBQUl1QyxPQUFPakMsS0FBS2tDLEtBQUwsQ0FBVyxDQUFDL0MsT0FBTzBCLE1BQVAsR0FBZ0J0QixVQUFqQixLQUFnQ0EsYUFBYSxDQUE3QyxJQUFrRCxLQUFLRyxHQUFMLENBQVMsVUFBVCxDQUE3RCxDQUFYO0FBQ0EsOEJBQUl5QyxPQUFPbkMsS0FBS2tDLEtBQUwsQ0FBVyxDQUFDL0MsT0FBTzJCLE1BQVAsR0FBZ0J2QixVQUFqQixLQUFnQ0EsYUFBYSxDQUE3QyxJQUFrRCxLQUFLRyxHQUFMLENBQVMsVUFBVCxDQUE3RCxDQUFYO0FBQ0FOLDhCQUFJbUMsSUFBSixDQUFTRSxDQUFULENBQVdRLElBQVgsRUFBaUJGLFNBQWpCLElBQThCLENBQTlCO0FBQ0EzQyw4QkFBSW1DLElBQUosQ0FBU0csQ0FBVCxDQUFXUyxJQUFYLEVBQWlCSixTQUFqQixJQUE4QixDQUE5QjtBQUNELHlCQUxELE1BS087QUFDTCw4QkFBSTFDLE9BQU1XLEtBQUtrQyxLQUFMLENBQVcsS0FBS3hDLEdBQUwsQ0FBUyxVQUFULElBQXVCUCxPQUFPc0IsS0FBOUIsR0FBc0NsQixVQUFqRCxDQUFWO0FBQ0FILDhCQUFJbUMsSUFBSixDQUFTSSxLQUFULENBQWV0QyxJQUFmLEVBQW9CMEMsU0FBcEIsSUFBaUMsQ0FBakM7QUFDRDtBQUNGO0FBQ0Y7QUFuQjJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFvQjdCO0FBckJ5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBc0IzQjtBQTdEaUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUE4RGxDbEQsb0JBQVV1RCxPQUFWLENBQWtCLFVBQUNoRCxHQUFELEVBQVM7QUFDekIsZ0JBQUlpRCxXQUFXMUMsT0FBT0MsTUFBUCxDQUFjUixJQUFJbUMsSUFBbEIsRUFBd0IxQixNQUF4QixDQUErQixVQUFDQyxHQUFELEVBQU1DLEdBQU47QUFBQSxxQkFBY0QsTUFBTUMsSUFBSUYsTUFBSixDQUFXLFVBQUN5QyxFQUFELEVBQUtDLEVBQUw7QUFBQSx1QkFBWUQsS0FBS0MsR0FBR1IsU0FBcEI7QUFBQSxlQUFYLEVBQTBDLENBQTFDLENBQXBCO0FBQUEsYUFBL0IsRUFBaUcsQ0FBakcsQ0FBZjtBQUNBcEMsbUJBQU9DLE1BQVAsQ0FBY1IsSUFBSW1DLElBQWxCLEVBQXdCYSxPQUF4QixDQUFnQyxVQUFDSSxRQUFELEVBQWM7QUFDNUNBLHVCQUFTSixPQUFULENBQWlCLFVBQUMvQyxHQUFELEVBQVM7QUFDeEIsb0JBQUdnRCxZQUFZLENBQWYsRUFBa0I7QUFBQ2hELHNCQUFJb0QsS0FBSixHQUFZLENBQVo7QUFBZSxpQkFBbEMsTUFBd0M7QUFBRXBELHNCQUFJb0QsS0FBSixHQUFZcEQsSUFBSTBDLFNBQUosR0FBZ0JNLFFBQTVCO0FBQXNDO0FBQ2pGLGVBRkQ7QUFHRCxhQUpEO0FBS0QsV0FQRDtBQVFBN0MsZ0JBQU13QixNQUFOLElBQWdCO0FBQ2RuQyx1QkFBV0EsU0FERztBQUVkRixtQkFBT0QsU0FBU3NDLE1BQVQsR0FBa0JyQyxLQUFsQixHQUEwQixJQUZuQixFQUV5QjtBQUN2QytELHVCQUFZMUIsVUFBVXRDLEtBQVgsR0FBb0IsSUFBcEIsR0FBMkIsS0FBS2dCLEdBQUwsV0FBaUJzQixNQUFqQjtBQUh4QixXQUFoQjtBQU1EO0FBQ0QsYUFBS3BDLEdBQUwsQ0FBUyxNQUFULEVBQWlCWSxLQUFqQjtBQUNEO0FBakdIO0FBQUE7QUFBQSxtQ0FtR2VtRCxhQW5HZixFQW1HOEI7QUFDMUIsYUFBSy9ELEdBQUwsd0JBQWdDK0QsYUFBaEM7QUFDRDtBQXJHSDtBQUFBO0FBQUEsOEJBdUdVO0FBQ04sYUFBSy9ELEdBQUwsQ0FBUyxNQUFULEVBQWlCLEVBQWpCO0FBQ0Q7QUF6R0g7QUFBQTtBQUFBLDZCQTJHU2dFLFNBM0dULEVBMkdvQjtBQUNoQixZQUFJLEtBQUtsRCxHQUFMLENBQVMsTUFBVCxDQUFKLEVBQXNCO0FBQ3BCLGNBQUltRCxZQUFZLEVBQWhCO0FBQ0EsZUFBSyxJQUFJbkUsS0FBVCxJQUFrQixLQUFLZ0IsR0FBTCxDQUFTLE1BQVQsQ0FBbEIsRUFBb0M7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDbEMsb0NBQXFCLEtBQUtBLEdBQUwsV0FBaUJoQixLQUFqQixnQkFBckIsbUlBQTBEO0FBQUEsb0JBQWpEb0UsUUFBaUQ7O0FBQ3hELG9CQUFJQSxTQUFTNUIsU0FBVCxJQUFzQjBCLFNBQXRCLElBQW1DRSxTQUFTM0IsT0FBVCxHQUFtQnlCLFNBQTFELEVBQXFFO0FBQ25FQyw0QkFBVW5FLEtBQVYsSUFBbUJvRSxTQUFTdkIsSUFBNUI7QUFDQTtBQUNEO0FBQ0Y7QUFOaUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9uQztBQUNELGVBQUszQyxHQUFMLENBQVMsV0FBVCxFQUFzQmlFLFNBQXRCO0FBQ0Q7QUFDRjtBQXhISDs7QUFBQTtBQUFBLElBQW9DdkYsS0FBcEM7QUEwSEQsQ0FsSkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2hpc3RvZ3JhbWdyYXBoL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBiaW5Db3VudDogMjAsXG4gICAgICB2UmFuZ2U6IDIwMCxcbiAgICAgIG1vZGU6ICd0b3RhbCcsXG4gICAgICBkVDogMSxcbiAgICAgIHRTdGVwOiAyLFxuICAgICAgd2lkdGg6IDIwMCxcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgZGF0YToge30sXG4gICAgICByYXc6IHt9LFxuICAgICAgbWFyZ2luczoge1xuICAgICAgICB0b3A6IDIwLFxuICAgICAgICByaWdodDogMjAsXG4gICAgICAgIGJvdHRvbTogNDAsXG4gICAgICAgIGxlZnQ6IDQwXG4gICAgICB9XG4gICAgfVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIEhpc3RvZ3JhbU1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhKGRhdGEsIGxheWVyID0gJ2RlZmF1bHQnLCBjb2xvcikge1xuICAgICAgdGhpcy5zZXQoYHJhdy4ke2xheWVyfWAsIGRhdGEpO1xuICAgICAgbGV0IGludGVydmFscywgaSwgaiwgaywgcGFyc2VkLCB0cmFjaywgc2FtcGxlLCBpbnQsIGJpbiwgbWF4QmluVmFsdWUsIHVzZWRWcmFuZ2UsIHBkYXRhLCByZGF0YTtcbiAgICAgIHVzZWRWcmFuZ2UgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmhpc3RvZ3JhbS52UmFuZ2UnKSA/IHRoaXMuZ2V0KCd2UmFuZ2UnKSA6IE9iamVjdC52YWx1ZXModGhpcy5nZXQoJ3JhdycpKS5yZWR1Y2UoKGFjYywgdmFsKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChhY2MsIHZhbC50cmFja3MucmVkdWNlKCh0YWNjLCB0dmFsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRhY2MsIHR2YWwuc2FtcGxlcy5maWx0ZXIoKGEpID0+IFV0aWxzLmV4aXN0cyhhLnNwZWVkKSkucmVkdWNlKChzYWNjLCBzdmFsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoc2FjYywgdGhpcy5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50JyA/IE1hdGgubWF4KE1hdGguYWJzKHN2YWwuc3BlZWRYKSwgTWF0aC5hYnMoc3ZhbC5zcGVlZFkpKSA6IHN2YWwuc3BlZWQpO1xuICAgICAgICAgIH0sIDApKTtcbiAgICAgICAgfSwgMCkpO1xuICAgICAgfSwgMCk7XG4gICAgICB1c2VkVnJhbmdlID0gTWF0aC5jZWlsKHVzZWRWcmFuZ2UpO1xuXG4gICAgICBwZGF0YSA9IHt9O1xuICAgICAgZm9yIChsZXQgcmxheWVyIGluIHRoaXMuZ2V0KCdyYXcnKSkge1xuICAgICAgICByZGF0YSA9IHRoaXMuZ2V0KGByYXcuJHtybGF5ZXJ9YCk7XG4gICAgICAgIGludGVydmFscyA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcmRhdGEucnVuVGltZTsgaSArPSB0aGlzLmdldCgndFN0ZXAnKSkge1xuICAgICAgICAgIHBhcnNlZCA9IHtcbiAgICAgICAgICAgIHRpbWVTdGFydDogaSxcbiAgICAgICAgICAgIHRpbWVFbmQ6IE1hdGgubWluKGkgKyB0aGlzLmdldCgndFN0ZXAnKSwgcmRhdGEucnVuVGltZSksXG4gICAgICAgICAgICBzYW1wbGVTdGFydDogTWF0aC5taW4oaSArIHRoaXMuZ2V0KCd0U3RlcCcpLCByZGF0YS5ydW5UaW1lKSAtIHRoaXMuZ2V0KCdkVCcpLFxuICAgICAgICAgICAgc2FtcGxlRW5kOiBNYXRoLm1pbihpICsgdGhpcy5nZXQoJ3RTdGVwJyksIHJkYXRhLnJ1blRpbWUpLFxuICAgICAgICAgICAgYmluczoge31cbiAgICAgICAgICB9O1xuICAgICAgICAgIGxldCBiaW5TaXplID0gMDtcbiAgICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgICAgcGFyc2VkLmJpbnMueCA9IFtdO1xuICAgICAgICAgICAgcGFyc2VkLmJpbnMueSA9IFtdO1xuICAgICAgICAgICAgYmluU2l6ZSA9IHVzZWRWcmFuZ2UgKiAyIC8gdGhpcy5nZXQoJ2JpbkNvdW50Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlZC5iaW5zLnRvdGFsID0gW107XG4gICAgICAgICAgICBiaW5TaXplID0gdXNlZFZyYW5nZSAvIHRoaXMuZ2V0KCdiaW5Db3VudCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGogPSAwIDsgaiA8IHRoaXMuZ2V0KCdiaW5Db3VudCcpOyBqKyspIHtcbiAgICAgICAgICAgIGZvciAoayBpbiBwYXJzZWQuYmlucykge1xuICAgICAgICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgICAgICAgIHBhcnNlZC5iaW5zW2tdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgdlN0YXJ0OiBqICogYmluU2l6ZSAtIHVzZWRWcmFuZ2UsXG4gICAgICAgICAgICAgICAgICB2RW5kOiAoaiArIDEpICogYmluU2l6ZSAtIHVzZWRWcmFuZ2UsXG4gICAgICAgICAgICAgICAgICBmcmVxdWVuY3k6IDBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcnNlZC5iaW5zW2tdLnB1c2goe1xuICAgICAgICAgICAgICAgICAgdlN0YXJ0OiBqICogYmluU2l6ZSxcbiAgICAgICAgICAgICAgICAgIHZFbmQ6IChqICsgMSkgKiBiaW5TaXplLFxuICAgICAgICAgICAgICAgICAgZnJlcXVlbmN5OiAwXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpbnRlcnZhbHMucHVzaChwYXJzZWQpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodHJhY2sgb2YgcmRhdGEudHJhY2tzKSB7XG4gICAgICAgICAgZm9yIChzYW1wbGUgb2YgdHJhY2suc2FtcGxlcykge1xuICAgICAgICAgICAgaWYgKCFzYW1wbGUuc3BlZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNhbXBsZS5zcGVlZFgpID4gdXNlZFZyYW5nZSB8fCBNYXRoLmFicyhzYW1wbGUuc3BlZWRZKSA+IHVzZWRWcmFuZ2UpIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNhbXBsZS5zcGVlZCkgPiB1c2VkVnJhbmdlKSBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaW50IG9mIGludGVydmFscykge1xuICAgICAgICAgICAgICBpZiAoaW50LnNhbXBsZVN0YXJ0IDw9IHNhbXBsZS50aW1lICYmIGludC5zYW1wbGVFbmQgPiBzYW1wbGUudGltZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgYmluWCA9IE1hdGguZmxvb3IoKHNhbXBsZS5zcGVlZFggKyB1c2VkVnJhbmdlKSAvICh1c2VkVnJhbmdlICogMikgKiB0aGlzLmdldCgnYmluQ291bnQnKSk7XG4gICAgICAgICAgICAgICAgICBsZXQgYmluWSA9IE1hdGguZmxvb3IoKHNhbXBsZS5zcGVlZFkgKyB1c2VkVnJhbmdlKSAvICh1c2VkVnJhbmdlICogMikgKiB0aGlzLmdldCgnYmluQ291bnQnKSk7XG4gICAgICAgICAgICAgICAgICBpbnQuYmlucy54W2JpblhdLmZyZXF1ZW5jeSArPSAxO1xuICAgICAgICAgICAgICAgICAgaW50LmJpbnMueVtiaW5ZXS5mcmVxdWVuY3kgKz0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgbGV0IGJpbiA9IE1hdGguZmxvb3IodGhpcy5nZXQoJ2JpbkNvdW50JykgKiBzYW1wbGUuc3BlZWQgLyB1c2VkVnJhbmdlKTtcbiAgICAgICAgICAgICAgICAgIGludC5iaW5zLnRvdGFsW2Jpbl0uZnJlcXVlbmN5ICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGludGVydmFscy5mb3JFYWNoKChpbnQpID0+IHtcbiAgICAgICAgICBsZXQgbWF4Q291bnQgPSBPYmplY3QudmFsdWVzKGludC5iaW5zKS5yZWR1Y2UoKGFjYywgdmFsKSA9PiBhY2MgKyB2YWwucmVkdWNlKChzYSwgc3YpID0+IHNhICsgc3YuZnJlcXVlbmN5LCAwKSwgMClcbiAgICAgICAgICBPYmplY3QudmFsdWVzKGludC5iaW5zKS5mb3JFYWNoKChiaW5Hcm91cCkgPT4ge1xuICAgICAgICAgICAgYmluR3JvdXAuZm9yRWFjaCgoYmluKSA9PiB7XG4gICAgICAgICAgICAgIGlmKG1heENvdW50ID09IDApIHtiaW4udmFsdWUgPSAwO30gZWxzZSB7IGJpbi52YWx1ZSA9IGJpbi5mcmVxdWVuY3kgLyBtYXhDb3VudDt9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHBkYXRhW3JsYXllcl0gPSB7XG4gICAgICAgICAgaW50ZXJ2YWxzOiBpbnRlcnZhbHMsXG4gICAgICAgICAgY29sb3I6IGxheWVyID09IHJsYXllciA/IGNvbG9yIDogbnVsbCwgLy8gaWYgdHJ5aW5nIHRvIGRpc3BsYXkgbXVsdGlwbGUgbW9kZWxzIHNpbXVsdGFuZW91c2x5LCB0aGlzIHdpbGwgbmVlZCBiZXR0ZXIgbWFuYWdlbWVudFxuICAgICAgICAgIHNob3dMYXllcjogKHJsYXllciA9PSBsYXllcikgPyB0cnVlIDogdGhpcy5nZXQoYGRhdGEuJHtybGF5ZXJ9LnNob3dMYXllcmApXG4gICAgICAgIH07XG5cbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0KCdkYXRhJywgcGRhdGEpO1xuICAgIH1cblxuICAgIHNldExheWVyTGl2ZShzaG93TGF5ZXJMaXZlKSB7XG4gICAgICB0aGlzLnNldChgZGF0YS5saXZlLnNob3dMYXllcmAsIHNob3dMYXllckxpdmUpXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLnNldCgnZGF0YScsIHt9KTtcbiAgICB9XG5cbiAgICB1cGRhdGUodGltZXN0YW1wKSB7XG4gICAgICBpZiAodGhpcy5nZXQoJ2RhdGEnKSkge1xuICAgICAgICBsZXQgaGlzdG9ncmFtID0ge307XG4gICAgICAgIGZvciAobGV0IGxheWVyIGluIHRoaXMuZ2V0KCdkYXRhJykpIHtcbiAgICAgICAgICBmb3IgKGxldCBpbnRlcnZhbCBvZiB0aGlzLmdldChgZGF0YS4ke2xheWVyfS5pbnRlcnZhbHNgKSkge1xuICAgICAgICAgICAgaWYgKGludGVydmFsLnRpbWVTdGFydCA8PSB0aW1lc3RhbXAgJiYgaW50ZXJ2YWwudGltZUVuZCA+IHRpbWVzdGFtcCkge1xuICAgICAgICAgICAgICBoaXN0b2dyYW1bbGF5ZXJdID0gaW50ZXJ2YWwuYmlucztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0KCdoaXN0b2dyYW0nLCBoaXN0b2dyYW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdfQ==
