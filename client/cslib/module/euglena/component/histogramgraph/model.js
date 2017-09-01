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
            color: layer == rlayer ? color : null // if trying to display multiple models simultaneously, this will need better management
          };
        }
        this.set('data', pdata);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsIkdsb2JhbHMiLCJkZWZhdWx0cyIsImJpbkNvdW50IiwidlJhbmdlIiwibW9kZSIsImRUIiwidFN0ZXAiLCJ3aWR0aCIsImhlaWdodCIsImRhdGEiLCJyYXciLCJtYXJnaW5zIiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0IiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiLCJsYXllciIsImNvbG9yIiwic2V0IiwiaW50ZXJ2YWxzIiwiaSIsImoiLCJrIiwicGFyc2VkIiwidHJhY2siLCJzYW1wbGUiLCJpbnQiLCJiaW4iLCJtYXhCaW5WYWx1ZSIsInVzZWRWcmFuZ2UiLCJwZGF0YSIsInJkYXRhIiwiZ2V0IiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwidmFsIiwiTWF0aCIsIm1heCIsInRyYWNrcyIsInRhY2MiLCJ0dmFsIiwic2FtcGxlcyIsImZpbHRlciIsImEiLCJleGlzdHMiLCJzcGVlZCIsInNhY2MiLCJzdmFsIiwiYWJzIiwic3BlZWRYIiwic3BlZWRZIiwiY2VpbCIsInJsYXllciIsInJ1blRpbWUiLCJ0aW1lU3RhcnQiLCJ0aW1lRW5kIiwibWluIiwic2FtcGxlU3RhcnQiLCJzYW1wbGVFbmQiLCJiaW5zIiwiYmluU2l6ZSIsIngiLCJ5IiwidG90YWwiLCJwdXNoIiwidlN0YXJ0IiwidkVuZCIsImZyZXF1ZW5jeSIsInRpbWUiLCJiaW5YIiwiZmxvb3IiLCJiaW5ZIiwiZm9yRWFjaCIsIm1heENvdW50Iiwic2EiLCJzdiIsImJpbkdyb3VwIiwidmFsdWUiLCJ0aW1lc3RhbXAiLCJoaXN0b2dyYW0iLCJpbnRlcnZhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtC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Q0FBUyxNQUFULENBQUosRUFBc0I7QUFDcEIsY0FBSWlELFlBQVksRUFBaEI7QUFDQSxlQUFLLElBQUlqRSxLQUFULElBQWtCLEtBQUtnQixHQUFMLENBQVMsTUFBVCxDQUFsQixFQUFvQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNsQyxvQ0FBcUIsS0FBS0EsR0FBTCxXQUFpQmhCLEtBQWpCLGdCQUFyQixtSUFBMEQ7QUFBQSxvQkFBakRrRSxRQUFpRDs7QUFDeEQsb0JBQUlBLFNBQVMxQixTQUFULElBQXNCd0IsU0FBdEIsSUFBbUNFLFNBQVN6QixPQUFULEdBQW1CdUIsU0FBMUQsRUFBcUU7QUFDbkVDLDRCQUFVakUsS0FBVixJQUFtQmtFLFNBQVNyQixJQUE1QjtBQUNBO0FBQ0Q7QUFDRjtBQU5pQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT25DO0FBQ0QsZUFBSzNDLEdBQUwsQ0FBUyxXQUFULEVBQXNCK0QsU0FBdEI7QUFDRDtBQUNGO0FBbEhIOztBQUFBO0FBQUEsSUFBb0NyRixLQUFwQztBQW9IRCxDQTVJRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvaGlzdG9ncmFtZ3JhcGgvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kZWwgPSByZXF1aXJlKCdjb3JlL21vZGVsL21vZGVsJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIGJpbkNvdW50OiAyMCxcbiAgICAgIHZSYW5nZTogMjAwLFxuICAgICAgbW9kZTogJ3RvdGFsJyxcbiAgICAgIGRUOiAxLFxuICAgICAgdFN0ZXA6IDIsXG4gICAgICB3aWR0aDogMjAwLFxuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICBkYXRhOiB7fSxcbiAgICAgIHJhdzoge30sXG4gICAgICBtYXJnaW5zOiB7XG4gICAgICAgIHRvcDogMjAsXG4gICAgICAgIHJpZ2h0OiAyMCxcbiAgICAgICAgYm90dG9tOiA0MCxcbiAgICAgICAgbGVmdDogNDBcbiAgICAgIH1cbiAgICB9XG4gIDtcblxuICByZXR1cm4gY2xhc3MgSGlzdG9ncmFtTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSwgbGF5ZXIgPSAnZGVmYXVsdCcsIGNvbG9yKSB7XG4gICAgICB0aGlzLnNldChgcmF3LiR7bGF5ZXJ9YCwgZGF0YSk7XG4gICAgICBsZXQgaW50ZXJ2YWxzLCBpLCBqLCBrLCBwYXJzZWQsIHRyYWNrLCBzYW1wbGUsIGludCwgYmluLCBtYXhCaW5WYWx1ZSwgdXNlZFZyYW5nZSwgcGRhdGEsIHJkYXRhO1xuICAgICAgdXNlZFZyYW5nZSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuaGlzdG9ncmFtLnZSYW5nZScpID8gdGhpcy5nZXQoJ3ZSYW5nZScpIDogT2JqZWN0LnZhbHVlcyh0aGlzLmdldCgncmF3JykpLnJlZHVjZSgoYWNjLCB2YWwpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGFjYywgdmFsLnRyYWNrcy5yZWR1Y2UoKHRhY2MsIHR2YWwpID0+IHtcbiAgICAgICAgICByZXR1cm4gTWF0aC5tYXgodGFjYywgdHZhbC5zYW1wbGVzLmZpbHRlcigoYSkgPT4gVXRpbHMuZXhpc3RzKGEuc3BlZWQpKS5yZWR1Y2UoKHNhY2MsIHN2YWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChzYWNjLCB0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnID8gTWF0aC5tYXgoTWF0aC5hYnMoc3ZhbC5zcGVlZFgpLCBNYXRoLmFicyhzdmFsLnNwZWVkWSkpIDogc3ZhbC5zcGVlZCk7XG4gICAgICAgICAgfSwgMCkpO1xuICAgICAgICB9LCAwKSk7XG4gICAgICB9LCAwKTtcbiAgICAgIHVzZWRWcmFuZ2UgPSBNYXRoLmNlaWwodXNlZFZyYW5nZSk7XG5cbiAgICAgIHBkYXRhID0ge307XG4gICAgICBmb3IgKGxldCBybGF5ZXIgaW4gdGhpcy5nZXQoJ3JhdycpKSB7XG4gICAgICAgIHJkYXRhID0gdGhpcy5nZXQoYHJhdy4ke3JsYXllcn1gKTtcbiAgICAgICAgaW50ZXJ2YWxzID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByZGF0YS5ydW5UaW1lOyBpICs9IHRoaXMuZ2V0KCd0U3RlcCcpKSB7XG4gICAgICAgICAgcGFyc2VkID0ge1xuICAgICAgICAgICAgdGltZVN0YXJ0OiBpLFxuICAgICAgICAgICAgdGltZUVuZDogTWF0aC5taW4oaSArIHRoaXMuZ2V0KCd0U3RlcCcpLCByZGF0YS5ydW5UaW1lKSxcbiAgICAgICAgICAgIHNhbXBsZVN0YXJ0OiBNYXRoLm1pbihpICsgdGhpcy5nZXQoJ3RTdGVwJyksIHJkYXRhLnJ1blRpbWUpIC0gdGhpcy5nZXQoJ2RUJyksXG4gICAgICAgICAgICBzYW1wbGVFbmQ6IE1hdGgubWluKGkgKyB0aGlzLmdldCgndFN0ZXAnKSwgcmRhdGEucnVuVGltZSksXG4gICAgICAgICAgICBiaW5zOiB7fVxuICAgICAgICAgIH07XG4gICAgICAgICAgbGV0IGJpblNpemUgPSAwO1xuICAgICAgICAgIGlmICh0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnKSB7XG4gICAgICAgICAgICBwYXJzZWQuYmlucy54ID0gW107XG4gICAgICAgICAgICBwYXJzZWQuYmlucy55ID0gW107XG4gICAgICAgICAgICBiaW5TaXplID0gdXNlZFZyYW5nZSAqIDIgLyB0aGlzLmdldCgnYmluQ291bnQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VkLmJpbnMudG90YWwgPSBbXTtcbiAgICAgICAgICAgIGJpblNpemUgPSB1c2VkVnJhbmdlIC8gdGhpcy5nZXQoJ2JpbkNvdW50Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaiA9IDAgOyBqIDwgdGhpcy5nZXQoJ2JpbkNvdW50Jyk7IGorKykge1xuICAgICAgICAgICAgZm9yIChrIGluIHBhcnNlZC5iaW5zKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VkLmJpbnNba10ucHVzaCh7XG4gICAgICAgICAgICAgICAgICB2U3RhcnQ6IGogKiBiaW5TaXplIC0gdXNlZFZyYW5nZSxcbiAgICAgICAgICAgICAgICAgIHZFbmQ6IChqICsgMSkgKiBiaW5TaXplIC0gdXNlZFZyYW5nZSxcbiAgICAgICAgICAgICAgICAgIGZyZXF1ZW5jeTogMFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyc2VkLmJpbnNba10ucHVzaCh7XG4gICAgICAgICAgICAgICAgICB2U3RhcnQ6IGogKiBiaW5TaXplLFxuICAgICAgICAgICAgICAgICAgdkVuZDogKGogKyAxKSAqIGJpblNpemUsXG4gICAgICAgICAgICAgICAgICBmcmVxdWVuY3k6IDBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGludGVydmFscy5wdXNoKHBhcnNlZCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh0cmFjayBvZiByZGF0YS50cmFja3MpIHtcbiAgICAgICAgICBmb3IgKHNhbXBsZSBvZiB0cmFjay5zYW1wbGVzKSB7XG4gICAgICAgICAgICBpZiAoIXNhbXBsZS5zcGVlZCkgY29udGludWU7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoc2FtcGxlLnNwZWVkWCkgPiB1c2VkVnJhbmdlIHx8IE1hdGguYWJzKHNhbXBsZS5zcGVlZFkpID4gdXNlZFZyYW5nZSkgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoc2FtcGxlLnNwZWVkKSA+IHVzZWRWcmFuZ2UpIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpbnQgb2YgaW50ZXJ2YWxzKSB7XG4gICAgICAgICAgICAgIGlmIChpbnQuc2FtcGxlU3RhcnQgPD0gc2FtcGxlLnRpbWUgJiYgaW50LnNhbXBsZUVuZCA+IHNhbXBsZS50aW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHtcbiAgICAgICAgICAgICAgICAgIGxldCBiaW5YID0gTWF0aC5mbG9vcigoc2FtcGxlLnNwZWVkWCArIHVzZWRWcmFuZ2UpIC8gKHVzZWRWcmFuZ2UgKiAyKSAqIHRoaXMuZ2V0KCdiaW5Db3VudCcpKTtcbiAgICAgICAgICAgICAgICAgIGxldCBiaW5ZID0gTWF0aC5mbG9vcigoc2FtcGxlLnNwZWVkWSArIHVzZWRWcmFuZ2UpIC8gKHVzZWRWcmFuZ2UgKiAyKSAqIHRoaXMuZ2V0KCdiaW5Db3VudCcpKTtcbiAgICAgICAgICAgICAgICAgIGludC5iaW5zLnhbYmluWF0uZnJlcXVlbmN5ICs9IDE7XG4gICAgICAgICAgICAgICAgICBpbnQuYmlucy55W2JpblldLmZyZXF1ZW5jeSArPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBsZXQgYmluID0gTWF0aC5mbG9vcih0aGlzLmdldCgnYmluQ291bnQnKSAqIHNhbXBsZS5zcGVlZCAvIHVzZWRWcmFuZ2UpO1xuICAgICAgICAgICAgICAgICAgaW50LmJpbnMudG90YWxbYmluXS5mcmVxdWVuY3kgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaW50ZXJ2YWxzLmZvckVhY2goKGludCkgPT4ge1xuICAgICAgICAgIGxldCBtYXhDb3VudCA9IE9iamVjdC52YWx1ZXMoaW50LmJpbnMpLnJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbC5yZWR1Y2UoKHNhLCBzdikgPT4gc2EgKyBzdi5mcmVxdWVuY3ksIDApLCAwKVxuICAgICAgICAgIE9iamVjdC52YWx1ZXMoaW50LmJpbnMpLmZvckVhY2goKGJpbkdyb3VwKSA9PiB7XG4gICAgICAgICAgICBiaW5Hcm91cC5mb3JFYWNoKChiaW4pID0+IHtcbiAgICAgICAgICAgICAgaWYobWF4Q291bnQgPT0gMCkge2Jpbi52YWx1ZSA9IDA7fSBlbHNlIHsgYmluLnZhbHVlID0gYmluLmZyZXF1ZW5jeSAvIG1heENvdW50O31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgcGRhdGFbcmxheWVyXSA9IHtcbiAgICAgICAgICBpbnRlcnZhbHM6IGludGVydmFscyxcbiAgICAgICAgICBjb2xvcjogbGF5ZXIgPT0gcmxheWVyID8gY29sb3IgOiBudWxsIC8vIGlmIHRyeWluZyB0byBkaXNwbGF5IG11bHRpcGxlIG1vZGVscyBzaW11bHRhbmVvdXNseSwgdGhpcyB3aWxsIG5lZWQgYmV0dGVyIG1hbmFnZW1lbnRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0KCdkYXRhJywgcGRhdGEpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5zZXQoJ2RhdGEnLCB7fSk7XG4gICAgfVxuXG4gICAgdXBkYXRlKHRpbWVzdGFtcCkge1xuICAgICAgaWYgKHRoaXMuZ2V0KCdkYXRhJykpIHtcbiAgICAgICAgbGV0IGhpc3RvZ3JhbSA9IHt9O1xuICAgICAgICBmb3IgKGxldCBsYXllciBpbiB0aGlzLmdldCgnZGF0YScpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaW50ZXJ2YWwgb2YgdGhpcy5nZXQoYGRhdGEuJHtsYXllcn0uaW50ZXJ2YWxzYCkpIHtcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbC50aW1lU3RhcnQgPD0gdGltZXN0YW1wICYmIGludGVydmFsLnRpbWVFbmQgPiB0aW1lc3RhbXApIHtcbiAgICAgICAgICAgICAgaGlzdG9ncmFtW2xheWVyXSA9IGludGVydmFsLmJpbnM7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldCgnaGlzdG9ncmFtJywgaGlzdG9ncmFtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG4iXX0=
