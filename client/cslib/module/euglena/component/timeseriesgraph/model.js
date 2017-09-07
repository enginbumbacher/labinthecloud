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
      top: 20,
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
        var _this2 = this;

        var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
        var color = arguments[2];

        this.set('raw.' + layer, data);

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
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = rdata.tracks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
                  var sampleFrame = Math.round(sample.time * rdata.fps);
                  if (this.get('mode') == 'component') {
                    graphs.x[sampleFrame - 1].samples.push(sample.speedX);
                    graphs.y[sampleFrame - 1].samples.push(sample.speedY);
                  } else {
                    graphs.total[sampleFrame - 1].samples.push(sample.speed);
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
            var _loop = function _loop(frame) {
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

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = graphs[_key][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var frame = _step2.value;

                _loop(frame);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZGVsIiwiVXRpbHMiLCJHbG9iYWxzIiwiZGVmYXVsdHMiLCJ2UmFuZ2UiLCJtb2RlIiwic3RkQmFuZCIsImRUIiwid2lkdGgiLCJoZWlnaHQiLCJkYXRhIiwicmF3IiwibWFyZ2lucyIsInRvcCIsImxlZnQiLCJib3R0b20iLCJyaWdodCIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwibGF5ZXIiLCJjb2xvciIsInNldCIsInVzZWRWcmFuZ2UiLCJnZXQiLCJPYmplY3QiLCJ2YWx1ZXMiLCJyZWR1Y2UiLCJhY2MiLCJ2YWwiLCJNYXRoIiwibWF4IiwidHJhY2tzIiwidGFjYyIsInR2YWwiLCJzYW1wbGVzIiwiZmlsdGVyIiwiYSIsImV4aXN0cyIsInNwZWVkIiwic2FjYyIsInN2YWwiLCJhYnMiLCJzcGVlZFgiLCJzcGVlZFkiLCJjZWlsIiwicGRhdGEiLCJybGF5ZXIiLCJyZGF0YSIsImdyYXBocyIsIngiLCJ5IiwidG90YWwiLCJpIiwibnVtRnJhbWVzIiwia2V5IiwicHVzaCIsImZyYW1lIiwidGltZSIsImZwcyIsIm1lYW4iLCJzIiwidHJhY2siLCJzYW1wbGUiLCJzYW1wbGVGcmFtZSIsInJvdW5kIiwibWF4RGlzcGxheSIsImxlbmd0aCIsInYiLCJjIiwic3FydCIsIm1hcCIsInBvdyIsIm1heFZhbHVlIiwicnVuVGltZSIsInNob3dMYXllciIsInNob3dMYXllckxpdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsVUFBVUgsUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFJRUksV0FBVztBQUNUQyxZQUFRLElBREM7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LENBQWI7QUFDRDtBQU5tQjs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDdEIsb0NBQWtCWixPQUFPTSxJQUFQLENBQWxCLG1JQUErQjtBQUFBLG9CQUF0QkUsS0FBc0I7O0FBQUEsc0JBQXRCQSxLQUFzQjtBQU05QjtBQVBxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUXZCO0FBQ0RYLGdCQUFNQyxNQUFOLElBQWdCO0FBQ2RFLG9CQUFRQSxNQURNO0FBRWR3QixzQkFBVVAsVUFGSTtBQUdkUSxxQkFBUzFCLE1BQU0wQixPQUhEO0FBSWRyRCxtQkFBTzBCLFVBQVUzQixLQUFWLEdBQWtCQyxLQUFsQixHQUEwQixJQUpuQjtBQUtkc0QsdUJBQVk1QixVQUFVM0IsS0FBWCxHQUFvQixJQUFwQixHQUEyQixLQUFLSSxHQUFMLFdBQWlCdUIsTUFBakI7QUFMeEIsV0FBaEI7QUFPRDtBQUNELGFBQUt6QixHQUFMLENBQVMsTUFBVCxFQUFpQndCLEtBQWpCO0FBQ0Q7QUE3RUg7QUFBQTtBQUFBLG1DQStFZThCLGFBL0VmLEVBK0U4QjtBQUMxQixhQUFLdEQsR0FBTCx3QkFBZ0NzRCxhQUFoQztBQUNEO0FBakZIO0FBQUE7QUFBQSw4QkFtRlU7QUFDTixhQUFLdEQsR0FBTCxDQUFTLE1BQVQsRUFBaUIsRUFBakI7QUFDRDtBQXJGSDs7QUFBQTtBQUFBLElBQXFDckIsS0FBckM7QUF1RkQsQ0E5R0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3RpbWVzZXJpZXNncmFwaC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgdlJhbmdlOiBudWxsLFxuICAgICAgbW9kZTogJ3RvdGFsJyxcbiAgICAgIHN0ZEJhbmQ6IHRydWUsXG4gICAgICBkVDogMSxcbiAgICAgIHdpZHRoOiA0MDAsXG4gICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgIGRhdGE6IHt9LFxuICAgICAgcmF3OiB7fSxcbiAgICAgIG1hcmdpbnM6IHtcbiAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgbGVmdDogNDAsXG4gICAgICAgIGJvdHRvbTogNDAsXG4gICAgICAgIHJpZ2h0OiAyMFxuICAgICAgfVxuICAgIH1cbiAgO1xuXG4gIHJldHVybiBjbGFzcyBUaW1lU2VyaWVzTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBwYXJzZURhdGEoZGF0YSwgbGF5ZXIgPSAnZGVmYXVsdCcsIGNvbG9yKSB7XG4gICAgICB0aGlzLnNldChgcmF3LiR7bGF5ZXJ9YCwgZGF0YSk7XG5cbiAgICAgIGxldCB1c2VkVnJhbmdlID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5oaXN0b2dyYW0udlJhbmdlJykgPyB0aGlzLmdldCgndlJhbmdlJykgOiBPYmplY3QudmFsdWVzKHRoaXMuZ2V0KCdyYXcnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoYWNjLCB2YWwudHJhY2tzLnJlZHVjZSgodGFjYywgdHZhbCkgPT4ge1xuICAgICAgICAgIHJldHVybiBNYXRoLm1heCh0YWNjLCB0dmFsLnNhbXBsZXMuZmlsdGVyKChhKSA9PiBVdGlscy5leGlzdHMoYS5zcGVlZCkpLnJlZHVjZSgoc2FjYywgc3ZhbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KHNhY2MsIHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcgPyBNYXRoLm1heChNYXRoLmFicyhzdmFsLnNwZWVkWCksIE1hdGguYWJzKHN2YWwuc3BlZWRZKSkgOiBzdmFsLnNwZWVkKTtcbiAgICAgICAgICB9LCAwKSk7XG4gICAgICAgIH0sIDApKTtcbiAgICAgIH0sIDApO1xuICAgICAgdXNlZFZyYW5nZSA9IE1hdGguY2VpbCh1c2VkVnJhbmdlKTtcblxuICAgICAgbGV0IHBkYXRhID0ge307XG5cbiAgICAgIGZvciAobGV0IHJsYXllciBpbiB0aGlzLmdldCgncmF3JykpIHtcbiAgICAgICAgbGV0IHJkYXRhID0gdGhpcy5nZXQoYHJhdy4ke3JsYXllcn1gKTtcbiAgICAgICAgbGV0IGdyYXBocyA9IHt9O1xuICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgIGdyYXBocy54ID0gW107XG4gICAgICAgICAgZ3JhcGhzLnkgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFwaHMudG90YWwgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmRhdGEubnVtRnJhbWVzOyBpKyspIHtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gZ3JhcGhzKSB7XG4gICAgICAgICAgICBncmFwaHNba2V5XS5wdXNoKHtcbiAgICAgICAgICAgICAgZnJhbWU6IGksXG4gICAgICAgICAgICAgIHRpbWU6IGkgLyByZGF0YS5mcHMsXG4gICAgICAgICAgICAgIHNhbXBsZXM6IFtdLFxuICAgICAgICAgICAgICBtZWFuOiBudWxsLFxuICAgICAgICAgICAgICBzOiBudWxsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCB0cmFjayBvZiByZGF0YS50cmFja3MpIHtcbiAgICAgICAgICBmb3IgKGxldCBzYW1wbGUgb2YgdHJhY2suc2FtcGxlcykge1xuICAgICAgICAgICAgaWYgKCFzYW1wbGUuc3BlZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNhbXBsZS5zcGVlZFgpID4gdXNlZFZyYW5nZSB8fCBNYXRoLmFicyhzYW1wbGUuc3BlZWRZKSA+IHVzZWRWcmFuZ2UpIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHNhbXBsZS5zcGVlZCkgPiB1c2VkVnJhbmdlKSBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBzYW1wbGVGcmFtZSA9IE1hdGgucm91bmQoc2FtcGxlLnRpbWUgKiByZGF0YS5mcHMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcpIHtcbiAgICAgICAgICAgICAgZ3JhcGhzLnhbc2FtcGxlRnJhbWUtMV0uc2FtcGxlcy5wdXNoKHNhbXBsZS5zcGVlZFgpO1xuICAgICAgICAgICAgICBncmFwaHMueVtzYW1wbGVGcmFtZS0xXS5zYW1wbGVzLnB1c2goc2FtcGxlLnNwZWVkWSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBncmFwaHMudG90YWxbc2FtcGxlRnJhbWUtMV0uc2FtcGxlcy5wdXNoKHNhbXBsZS5zcGVlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBtYXhEaXNwbGF5ID0gMDtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGdyYXBocykge1xuICAgICAgICAgIGZvciAobGV0IGZyYW1lIG9mIGdyYXBoc1trZXldKSB7XG4gICAgICAgICAgICBpZiAoZnJhbWUuc2FtcGxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgZnJhbWUubWVhbiA9IGZyYW1lLnNhbXBsZXMucmVkdWNlKCh2LCBjKSA9PiB2ICsgYywgMCkgLyBmcmFtZS5zYW1wbGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgZnJhbWUucyA9IE1hdGguc3FydChmcmFtZS5zYW1wbGVzLm1hcCgodikgPT4gTWF0aC5wb3codiAtIGZyYW1lLm1lYW4sIDIpKS5yZWR1Y2UoKHYsIGMpID0+IHYgKyBjLCAwKSAvIGZyYW1lLnNhbXBsZXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgbWF4RGlzcGxheSA9IE1hdGgubWF4KG1heERpc3BsYXksIE1hdGgubWF4KE1hdGguYWJzKGZyYW1lLm1lYW4gKyBmcmFtZS5zKSwgTWF0aC5hYnMoZnJhbWUubWVhbiAtIGZyYW1lLnMpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBkYXRhW3JsYXllcl0gPSB7XG4gICAgICAgICAgZ3JhcGhzOiBncmFwaHMsXG4gICAgICAgICAgbWF4VmFsdWU6IG1heERpc3BsYXksXG4gICAgICAgICAgcnVuVGltZTogcmRhdGEucnVuVGltZSxcbiAgICAgICAgICBjb2xvcjogcmxheWVyID09IGxheWVyID8gY29sb3IgOiBudWxsLFxuICAgICAgICAgIHNob3dMYXllcjogKHJsYXllciA9PSBsYXllcikgPyB0cnVlIDogdGhpcy5nZXQoYGRhdGEuJHtybGF5ZXJ9LnNob3dMYXllcmApXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB0aGlzLnNldCgnZGF0YScsIHBkYXRhKTtcbiAgICB9XG5cbiAgICBzZXRMYXllckxpdmUoc2hvd0xheWVyTGl2ZSkge1xuICAgICAgdGhpcy5zZXQoYGRhdGEubGl2ZS5zaG93TGF5ZXJgLCBzaG93TGF5ZXJMaXZlKVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5zZXQoJ2RhdGEnLCB7fSk7XG4gICAgfVxuICB9XG59KVxuIl19
