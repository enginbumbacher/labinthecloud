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
    data: null,
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
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, CircleHistogramModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(CircleHistogramModel).call(this, config));
    }

    _createClass(CircleHistogramModel, [{
      key: 'parseData',
      value: function parseData(data) {
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
              thetaStart: j * 360 / this.get('binCount'),
              thetaEnd: (j + 1) * 360 / this.get('binCount'),
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

                bin = Math.floor(this.get('binCount') * sample.angle / 360);
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
        this.set('data', {
          intervals: intervals,
          maxBinValue: maxBinValue
        });
      }
    }, {
      key: 'update',
      value: function update(timestamp, lights) {
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

          this.set('lights', lights);
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.set('data', null);
      }
    }]);

    return CircleHistogramModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFFBQVEsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsVUFBVSxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUlFLFdBQVc7QUFDVCxjQUFVLEVBREQ7QUFFVCxRQUFJLENBRks7QUFHVCxXQUFPLENBSEU7QUFJVCxVQUFNLElBSkc7QUFLVCxXQUFPLEdBTEU7QUFNVCxZQUFRLEdBTkM7QUFPVCxhQUFTO0FBQ1AsV0FBSyxFQURFO0FBRVAsYUFBTyxFQUZBO0FBR1AsY0FBUSxFQUhEO0FBSVAsWUFBTTtBQUpDO0FBUEEsR0FKYjs7QUFvQkE7QUFBQTs7QUFDRSxvQ0FBeUI7QUFBQSxVQUFiLE1BQWEseURBQUosRUFBSTs7QUFBQTs7QUFDdkIsYUFBTyxRQUFQLEdBQWtCLE1BQU0sY0FBTixDQUFxQixPQUFPLFFBQTVCLEVBQXNDLFFBQXRDLENBQWxCO0FBRHVCLHFHQUVqQixNQUZpQjtBQUd4Qjs7QUFKSDtBQUFBO0FBQUEsZ0NBTVksSUFOWixFQU1rQjtBQUNkLFlBQUksa0JBQUo7QUFBQSxZQUFlLFVBQWY7QUFBQSxZQUFrQixVQUFsQjtBQUFBLFlBQXFCLGVBQXJCO0FBQUEsWUFBNkIsY0FBN0I7QUFBQSxZQUFvQyxlQUFwQztBQUFBLFlBQTRDLFlBQTVDO0FBQUEsWUFBaUQsWUFBakQ7QUFBQSxZQUFzRCxvQkFBdEQ7QUFDQSxvQkFBWSxFQUFaO0FBQ0EsYUFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLEtBQUssT0FBckIsRUFBOEIsS0FBSyxLQUFLLEdBQUwsQ0FBUyxPQUFULENBQW5DLEVBQXNEO0FBQ3BELG1CQUFTO0FBQ1AsdUJBQVcsQ0FESjtBQUVQLHFCQUFTLEtBQUssR0FBTCxDQUFTLElBQUksS0FBSyxHQUFMLENBQVMsT0FBVCxDQUFiLEVBQWdDLEtBQUssT0FBckMsQ0FGRjtBQUdQLHlCQUFhLEtBQUssR0FBTCxDQUFTLElBQUksS0FBSyxHQUFMLENBQVMsT0FBVCxDQUFiLEVBQWdDLEtBQUssT0FBckMsSUFBZ0QsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUh0RDtBQUlQLHVCQUFXLEtBQUssR0FBTCxDQUFTLElBQUksS0FBSyxHQUFMLENBQVMsT0FBVCxDQUFiLEVBQWdDLEtBQUssT0FBckMsQ0FKSjtBQUtQLGtCQUFNO0FBTEMsV0FBVDtBQU9BLGVBQUssSUFBSSxDQUFULEVBQWEsSUFBSSxLQUFLLEdBQUwsQ0FBUyxVQUFULENBQWpCLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzFDLG1CQUFPLElBQVAsQ0FBWSxJQUFaLENBQWlCO0FBQ2YsMEJBQVksSUFBSSxHQUFKLEdBQVUsS0FBSyxHQUFMLENBQVMsVUFBVCxDQURQO0FBRWYsd0JBQVUsQ0FBQyxJQUFFLENBQUgsSUFBUSxHQUFSLEdBQWMsS0FBSyxHQUFMLENBQVMsVUFBVCxDQUZUO0FBR2YseUJBQVc7QUFISSxhQUFqQjtBQUtEO0FBQ0Qsb0JBQVUsSUFBVixDQUFlLE1BQWY7QUFDRDtBQW5CYTtBQUFBO0FBQUE7O0FBQUE7QUFvQmQsK0JBQWMsS0FBSyxNQUFuQiw4SEFBMkI7QUFBdEIsaUJBQXNCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3pCLG9DQUFlLE1BQU0sT0FBckIsbUlBQThCO0FBQXpCLHNCQUF5Qjs7QUFDNUIsc0JBQU0sS0FBSyxLQUFMLENBQVcsS0FBSyxHQUFMLENBQVMsVUFBVCxJQUF1QixPQUFPLEtBQTlCLEdBQXNDLEdBQWpELENBQU47QUFENEI7QUFBQTtBQUFBOztBQUFBO0FBRTVCLHdDQUFZLFNBQVosbUlBQXVCO0FBQWxCLHVCQUFrQjs7QUFDckIsd0JBQUksSUFBSSxXQUFKLElBQW1CLE9BQU8sSUFBMUIsSUFBa0MsSUFBSSxTQUFKLEdBQWdCLE9BQU8sSUFBN0QsRUFBbUU7QUFDakUsMEJBQUksSUFBSixDQUFTLEdBQVQsRUFBYyxTQUFkLElBQTJCLENBQTNCO0FBQ0Q7QUFDRjtBQU4yQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTzdCO0FBUndCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTMUI7QUE3QmE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUE4QmQsc0JBQWMsVUFBVSxNQUFWLENBQWlCLFVBQUMsR0FBRCxFQUFNLElBQU47QUFBQSxpQkFBZSxLQUFLLEdBQUwsQ0FBUyxHQUFULEVBQWMsS0FBSyxJQUFMLENBQVUsTUFBVixDQUFpQixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsbUJBQVUsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLEVBQUUsU0FBZCxDQUFWO0FBQUEsV0FBakIsRUFBcUQsQ0FBckQsQ0FBZCxDQUFmO0FBQUEsU0FBakIsRUFBd0csQ0FBeEcsQ0FBZDtBQUNBLGFBQUssR0FBTCxDQUFTLE1BQVQsRUFBaUI7QUFDZixxQkFBVyxTQURJO0FBRWYsdUJBQWE7QUFGRSxTQUFqQjtBQUlEO0FBekNIO0FBQUE7QUFBQSw2QkEyQ1MsU0EzQ1QsRUEyQ29CLE1BM0NwQixFQTJDNEI7QUFDeEIsWUFBSSxLQUFLLEdBQUwsQ0FBUyxNQUFULENBQUosRUFBc0I7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDcEIsa0NBQXFCLEtBQUssR0FBTCxDQUFTLGdCQUFULENBQXJCLG1JQUFpRDtBQUFBLGtCQUF4QyxRQUF3Qzs7QUFDL0Msa0JBQUksU0FBUyxTQUFULElBQXNCLFNBQXRCLElBQW1DLFNBQVMsT0FBVCxHQUFtQixTQUExRCxFQUFxRTtBQUNuRSxxQkFBSyxHQUFMLENBQVMsV0FBVCxFQUFzQixTQUFTLElBQS9CO0FBQ0E7QUFDRDtBQUNGO0FBTm1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT3BCLGVBQUssR0FBTCxDQUFTLFFBQVQsRUFBbUIsTUFBbkI7QUFDRDtBQUNGO0FBckRIO0FBQUE7QUFBQSw4QkF1RFU7QUFDTixhQUFLLEdBQUwsQ0FBUyxNQUFULEVBQWlCLElBQWpCO0FBQ0Q7QUF6REg7O0FBQUE7QUFBQSxJQUEwQyxLQUExQztBQTJERCxDQWhGRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvY2lyY2xlZ3JhcGgvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
