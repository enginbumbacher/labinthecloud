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
    vRange: 200,
    mode: 'total',
    stdBand: true,
    dT: 1,
    width: 400,
    height: 300,
    margins: {
      top: 20,
      left: 40,
      bottom: 40,
      right: 20
    }
  };

  return function (_Model) {
    _inherits(TimeSeriesModel, _Model);

    function TimeSeriesModel() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, TimeSeriesModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(TimeSeriesModel).call(this, config));
    }

    _createClass(TimeSeriesModel, [{
      key: 'parseData',
      value: function parseData(data) {
        var _this2 = this;

        var usedVrange = Globals.get('AppConfig.timeseries.vRange') ? this.get('vRange') : data.tracks.reduce(function (tVal, tCurr) {
          return Math.max(tVal, tCurr.samples.filter(function (a) {
            return Utils.exists(a.speed);
          }).reduce(function (sVal, sCurr) {
            return Math.max(sVal, _this2.get('mode') == 'component' ? Math.max(sCurr.speedX, sCurr.speedY) : sCurr.speed);
          }, 0));
        }, 0);
        usedVrange = Math.ceil(usedVrange);

        var graphs = {};
        if (this.get('mode') == 'component') {
          graphs.x = [];
          graphs.y = [];
        } else {
          graphs.total = [];
        }

        for (var i = 0; i < data.numFrames; i++) {
          for (var key in graphs) {
            graphs[key].push({
              frame: i,
              time: i / data.fps,
              samples: [],
              mean: null,
              s: null
            });
          }
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.tracks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var track = _step.value;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = track.samples[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var sample = _step3.value;

                if (!sample.speed) continue;
                if (this.get('mode') == 'component') {
                  if (Math.abs(sample.speedX) > usedVrange || Math.abs(sample.speedY) > usedVrange) continue;
                } else {
                  if (Math.abs(sample.speed) > usedVrange) continue;
                }
                if (this.get('mode') == 'component') {
                  graphs.x[sample.frame - 1].samples.push(sample.speedX);
                  graphs.y[sample.frame - 1].samples.push(sample.speedY);
                } else {
                  graphs.total[sample.frame - 1].samples.push(sample.speed);
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

        var maxDisplay = 0;
        for (var _key in graphs) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            var _loop = function _loop() {
              var frame = _step2.value;

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

            for (var _iterator2 = graphs[_key][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              _loop();
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
        this.set('data', {
          graphs: graphs,
          maxValue: maxDisplay,
          runTime: data.runTime
        });
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.set('data', null);
      }
    }]);

    return TimeSeriesModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvbW9kZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxRQUFRLFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFVBQVUsUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFJRSxXQUFXO0FBQ1QsWUFBUSxHQURDO0FBRVQsVUFBTSxPQUZHO0FBR1QsYUFBUyxJQUhBO0FBSVQsUUFBSSxDQUpLO0FBS1QsV0FBTyxHQUxFO0FBTVQsWUFBUSxHQU5DO0FBT1QsYUFBUztBQUNQLFdBQUssRUFERTtBQUVQLFlBQU0sRUFGQztBQUdQLGNBQVEsRUFIRDtBQUlQLGFBQU87QUFKQTtBQVBBLEdBSmI7O0FBb0JBO0FBQUE7O0FBQ0UsK0JBQXlCO0FBQUEsVUFBYixNQUFhLHlEQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCLGFBQU8sUUFBUCxHQUFrQixNQUFNLGNBQU4sQ0FBcUIsT0FBTyxRQUE1QixFQUFzQyxRQUF0QyxDQUFsQjtBQUR1QixnR0FFakIsTUFGaUI7QUFHeEI7O0FBSkg7QUFBQTtBQUFBLGdDQU1ZLElBTlosRUFNa0I7QUFBQTs7QUFDZCxZQUFJLGFBQWEsUUFBUSxHQUFSLENBQVksNkJBQVosSUFBNkMsS0FBSyxHQUFMLENBQVMsUUFBVCxDQUE3QyxHQUFrRSxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQy9FLFVBQUMsSUFBRCxFQUFPLEtBQVA7QUFBQSxpQkFBaUIsS0FBSyxHQUFMLENBQ2YsSUFEZSxFQUVmLE1BQU0sT0FBTixDQUNHLE1BREgsQ0FDVSxVQUFDLENBQUQ7QUFBQSxtQkFBTyxNQUFNLE1BQU4sQ0FBYSxFQUFFLEtBQWYsQ0FBUDtBQUFBLFdBRFYsRUFFRyxNQUZILENBRVUsVUFBQyxJQUFELEVBQU8sS0FBUDtBQUFBLG1CQUFpQixLQUFLLEdB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LHNCQUFNLENBQU4sR0FBVSxLQUFLLElBQUwsQ0FBVSxNQUFNLE9BQU4sQ0FBYyxHQUFkLENBQWtCLFVBQUMsQ0FBRDtBQUFBLHlCQUFPLEtBQUssR0FBTCxDQUFTLElBQUksTUFBTSxJQUFuQixFQUF5QixDQUF6QixDQUFQO0FBQUEsaUJBQWxCLEVBQXNELE1BQXRELENBQTZELFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSx5QkFBVSxJQUFJLENBQWQ7QUFBQSxpQkFBN0QsRUFBOEUsQ0FBOUUsSUFBbUYsTUFBTSxPQUFOLENBQWMsTUFBM0csQ0FBVjtBQUNBLDZCQUFhLEtBQUssR0FBTCxDQUFTLFVBQVQsRUFBcUIsS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsTUFBTSxJQUFOLEdBQWEsTUFBTSxDQUE1QixDQUFULEVBQXlDLEtBQUssR0FBTCxDQUFTLE1BQU0sSUFBTixHQUFhLE1BQU0sQ0FBNUIsQ0FBekMsQ0FBckIsQ0FBYjtBQUNEO0FBTm1COztBQUN0QixrQ0FBa0IsT0FBTyxJQUFQLENBQWxCLG1JQUErQjtBQUFBO0FBTTlCO0FBUHFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRdkI7QUFDRCxhQUFLLEdBQUwsQ0FBUyxNQUFULEVBQWlCO0FBQ2Ysa0JBQVEsTUFETztBQUVmLG9CQUFVLFVBRks7QUFHZixtQkFBUyxLQUFLO0FBSEMsU0FBakI7QUFLRDtBQWxFSDtBQUFBO0FBQUEsOEJBb0VVO0FBQ04sYUFBSyxHQUFMLENBQVMsTUFBVCxFQUFpQixJQUFqQjtBQUNEO0FBdEVIOztBQUFBO0FBQUEsSUFBcUMsS0FBckM7QUF3RUQsQ0E3RkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3RpbWVzZXJpZXNncmFwaC9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
