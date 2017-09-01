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
          color: color
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
      key: 'reset',
      value: function reset() {
        this.set('data', {});
      }
    }]);

    return CircleHistogramModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsIkdsb2JhbHMiLCJkZWZhdWx0cyIsImJpbkNvdW50IiwiZFQiLCJ0U3RlcCIsImRhdGEiLCJoaXN0b2dyYW0iLCJ3aWR0aCIsImhlaWdodCIsIm1hcmdpbnMiLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImxlZnQiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImxheWVyIiwiY29sb3IiLCJzZXQiLCJpbnRlcnZhbHMiLCJpIiwiaiIsInBhcnNlZCIsInRyYWNrIiwic2FtcGxlIiwiaW50IiwiYmluIiwibWF4QmluVmFsdWUiLCJydW5UaW1lIiwiZ2V0IiwidGltZVN0YXJ0IiwidGltZUVuZCIsIk1hdGgiLCJtaW4iLCJzYW1wbGVTdGFydCIsInNhbXBsZUVuZCIsImJpbnMiLCJwdXNoIiwidGhldGFTdGFydCIsIlRBVSIsInRoZXRhRW5kIiwiZnJlcXVlbmN5IiwidHJhY2tzIiwic2FtcGxlcyIsImZsb29yIiwicG9zTW9kIiwiYW5nbGVYWSIsInRpbWUiLCJyZWR1Y2UiLCJ2YWwiLCJjdXJyIiwibWF4IiwidiIsImMiLCJ0aW1lc3RhbXAiLCJsaWdodHMiLCJpbnRlcnZhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUlFSSxXQUFXO0FBQ1RDLGNBQVUsRUFERDtBQUVUQyxRQUFJLENBRks7QUFHVEMsV0FBTyxDQUhFO0FBSVRDLFVBQU0sRUFKRztBQUtUQyxlQUFXLEVBTEY7QUFNVEMsV0FBTyxHQU5FO0FBT1RDLFlBQVEsR0FQQztBQVFUQyxhQUFT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MEQ7QUFBQSxvQkFBakR3QyxRQUFpRDs7QUFDeEQsb0JBQUlBLFNBQVMxQixTQUFULElBQXNCd0IsU0FBdEIsSUFBbUNFLFNBQVN6QixPQUFULEdBQW1CdUIsU0FBMUQsRUFBcUU7QUFDbkUsdUJBQUtwQyxHQUFMLGdCQUFzQkYsS0FBdEIsRUFBK0J3QyxTQUFTcEIsSUFBeEM7QUFDQTtBQUNEO0FBQ0Y7QUFOaUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9uQztBQUNELGVBQUtsQixHQUFMLENBQVMsUUFBVCxFQUFtQnFDLE1BQW5CO0FBQ0Q7QUFDRjtBQTdESDtBQUFBO0FBQUEsOEJBK0RVO0FBQ04sYUFBS3JDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLEVBQWpCO0FBQ0Q7QUFqRUg7O0FBQUE7QUFBQSxJQUEwQ3BCLEtBQTFDO0FBbUVELENBekZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgYmluQ291bnQ6IDI0LFxuICAgICAgZFQ6IDEsXG4gICAgICB0U3RlcDogMSxcbiAgICAgIGRhdGE6IHt9LFxuICAgICAgaGlzdG9ncmFtOiB7fSxcbiAgICAgIHdpZHRoOiAyMDAsXG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIG1hcmdpbnM6IHtcbiAgICAgICAgdG9wOiAzMCxcbiAgICAgICAgcmlnaHQ6IDMwLFxuICAgICAgICBib3R0b206IDMwLFxuICAgICAgICBsZWZ0OiAzMFxuICAgICAgfVxuICAgIH1cbiAgO1xuXG4gIHJldHVybiBjbGFzcyBDaXJjbGVIaXN0b2dyYW1Nb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuICAgICAgY29uZmlnLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZmlnLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG4gICAgICBzdXBlcihjb25maWcpO1xuICAgIH1cblxuICAgIHBhcnNlRGF0YShkYXRhLCBsYXllciA9ICdkZWZhdWx0JywgY29sb3IpIHtcbiAgICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXQoYGRhdGEuJHtsYXllcn1gLCBudWxsKTtcbiAgICAgICAgdGhpcy5zZXQoYGhpc3RvZ3JhbS4ke2xheWVyfWAsIG51bGwpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgaW50ZXJ2YWxzLCBpLCBqLCBwYXJzZWQsIHRyYWNrLCBzYW1wbGUsIGludCwgYmluLCBtYXhCaW5WYWx1ZTtcbiAgICAgIGludGVydmFscyA9IFtdO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEucnVuVGltZTsgaSArPSB0aGlzLmdldCgndFN0ZXAnKSkge1xuICAgICAgICBwYXJzZWQgPSB7XG4gICAgICAgICAgdGltZVN0YXJ0OiBpLFxuICAgICAgICAgIHRpbWVFbmQ6IE1hdGgubWluKGkgKyB0aGlzLmdldCgndFN0ZXAnKSwgZGF0YS5ydW5UaW1lKSxcbiAgICAgICAgICBzYW1wbGVTdGFydDogTWF0aC5taW4oaSArIHRoaXMuZ2V0KCd0U3RlcCcpLCBkYXRhLnJ1blRpbWUpIC0gdGhpcy5nZXQoJ2RUJyksXG4gICAgICAgICAgc2FtcGxlRW5kOiBNYXRoLm1pbihpICsgdGhpcy5nZXQoJ3RTdGVwJyksIGRhdGEucnVuVGltZSksXG4gICAgICAgICAgYmluczogW11cbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChqID0gMCA7IGogPCB0aGlzLmdldCgnYmluQ291bnQnKTsgaisrKSB7XG4gICAgICAgICAgcGFyc2VkLmJpbnMucHVzaCh7XG4gICAgICAgICAgICB0aGV0YVN0YXJ0OiBqICogVXRpbHMuVEFVIC8gdGhpcy5nZXQoJ2JpbkNvdW50JyksXG4gICAgICAgICAgICB0aGV0YUVuZDogKGorMSkgKiBVdGlscy5UQVUgLyB0aGlzLmdldCgnYmluQ291bnQnKSxcbiAgICAgICAgICAgIGZyZXF1ZW5jeTogMFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgaW50ZXJ2YWxzLnB1c2gocGFyc2VkKTtcbiAgICAgIH1cbiAgICAgIGZvciAodHJhY2sgb2YgZGF0YS50cmFja3MpIHtcbiAgICAgICAgZm9yIChzYW1wbGUgb2YgdHJhY2suc2FtcGxlcykge1xuICAgICAgICAgIGJpbiA9IE1hdGguZmxvb3IodGhpcy5nZXQoJ2JpbkNvdW50JykgKiBVdGlscy5wb3NNb2Qoc2FtcGxlLmFuZ2xlWFksIFV0aWxzLlRBVSkgLyBVdGlscy5UQVUpO1xuICAgICAgICAgIGZvciAoaW50IG9mIGludGVydmFscykge1xuICAgICAgICAgICAgaWYgKGludC5zYW1wbGVTdGFydCA8PSBzYW1wbGUudGltZSAmJiBpbnQuc2FtcGxlRW5kID4gc2FtcGxlLnRpbWUpIHtcbiAgICAgICAgICAgICAgaW50LmJpbnNbYmluXS5mcmVxdWVuY3kgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1heEJpblZhbHVlID0gaW50ZXJ2YWxzLnJlZHVjZSgodmFsLCBjdXJyKSA9PiBNYXRoLm1heCh2YWwsIGN1cnIuYmlucy5yZWR1Y2UoKHYsIGMpID0+IE1hdGgubWF4KHYsIGMuZnJlcXVlbmN5KSwgMCkpLCAwKTtcbiAgICAgIHRoaXMuc2V0KGBkYXRhLiR7bGF5ZXJ9YCwge1xuICAgICAgICBpbnRlcnZhbHM6IGludGVydmFscyxcbiAgICAgICAgbWF4QmluVmFsdWU6IG1heEJpblZhbHVlLFxuICAgICAgICBjb2xvcjogY29sb3JcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZSh0aW1lc3RhbXAsIGxpZ2h0cykge1xuICAgICAgaWYgKHRoaXMuZ2V0KCdkYXRhJykpIHtcbiAgICAgICAgZm9yIChsZXQgbGF5ZXIgaW4gdGhpcy5nZXQoJ2RhdGEnKSkge1xuICAgICAgICAgIGZvciAobGV0IGludGVydmFsIG9mIHRoaXMuZ2V0KGBkYXRhLiR7bGF5ZXJ9LmludGVydmFsc2ApKSB7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwudGltZVN0YXJ0IDw9IHRpbWVzdGFtcCAmJiBpbnRlcnZhbC50aW1lRW5kID4gdGltZXN0YW1wKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0KGBoaXN0b2dyYW0uJHtsYXllcn1gLCBpbnRlcnZhbC5iaW5zKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0KCdsaWdodHMnLCBsaWdodHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5zZXQoJ2RhdGEnLCB7fSk7XG4gICAgfVxuICB9XG59KVxuIl19
