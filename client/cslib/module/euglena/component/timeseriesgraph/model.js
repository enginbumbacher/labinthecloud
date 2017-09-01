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
            color: rlayer == layer ? color : null
          };
        }
        this.set('data', pdata);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk1vZGVsIiwiVXRpbHMiLCJHbG9iYWxzIiwiZGVmYXVsdHMiLCJ2UmFuZ2UiLCJtb2RlIiwic3RkQmFuZCIsImRUIiwid2lkdGgiLCJoZWlnaHQiLCJkYXRhIiwicmF3IiwibWFyZ2lucyIsInRvcCIsImxlZnQiLCJib3R0b20iLCJyaWdodCIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwibGF5ZXIiLCJjb2xvciIsInNldCIsInVzZWRWcmFuZ2UiLCJnZXQiLCJPYmplY3QiLCJ2YWx1ZXMiLCJyZWR1Y2UiLCJhY2MiLCJ2YWwiLCJNYXRoIiwibWF4IiwidHJhY2tzIiwidGFjYyIsInR2YWwiLCJzYW1wbGVzIiwiZmlsdGVyIiwiYSIsImV4aXN0cyIsInNwZWVkIiwic2FjYyIsInN2YWwiLCJhYnMiLCJzcGVlZFgiLCJzcGVlZFkiLCJjZWlsIiwicGRhdGEiLCJybGF5ZXIiLCJyZGF0YSIsImdyYXBocyIsIngiLCJ5IiwidG90YWwiLCJpIiwibnVtRnJhbWVzIiwia2V5IiwicHVzaCIsImZyYW1lIiwidGltZSIsImZwcyIsIm1lYW4iLCJzIiwidHJhY2siLCJzYW1wbGUiLCJzYW1wbGVGcmFtZSIsInJvdW5kIiwibWF4RGlzcGxheSIsImxlbmd0aCIsInYiLCJjIiwic3FydCIsIm1hcCIsInBvdyIsIm1heFZhbHVlIiwicnVuVGltZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUlFSSxXQUFXO0FBQ1RDLFlBQVEsSUFEQztBQUVUQyxVQUFNLE9BRkc7QUFHVEMsYUFBUyxJ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QUFBQTs7QUFBQTtBQUN0QixvQ0FBa0JaLE9BQU9NLElBQVAsQ0FBbEIsbUlBQStCO0FBQUEsb0JBQXRCRSxLQUFzQjs7QUFBQSxzQkFBdEJBLEtBQXNCO0FBTTlCO0FBUHFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRdkI7QUFDRFgsZ0JBQU1DLE1BQU4sSUFBZ0I7QUFDZEUsb0JBQVFBLE1BRE07QUFFZHdCLHNCQUFVUCxVQUZJO0FBR2RRLHFCQUFTMUIsTUFBTTBCLE9BSEQ7QUFJZHJELG1CQUFPMEIsVUFBVTNCLEtBQVYsR0FBa0JDLEtBQWxCLEdBQTBCO0FBSm5CLFdBQWhCO0FBTUQ7QUFDRCxhQUFLQyxHQUFMLENBQVMsTUFBVCxFQUFpQndCLEtBQWpCO0FBQ0Q7QUE1RUg7QUFBQTtBQUFBLDhCQThFVTtBQUNOLGFBQUt4QixHQUFMLENBQVMsTUFBVCxFQUFpQixFQUFqQjtBQUNEO0FBaEZIOztBQUFBO0FBQUEsSUFBcUNyQixLQUFyQztBQWtGRCxDQXpHRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdGltZXNlcmllc2dyYXBoL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICB2UmFuZ2U6IG51bGwsXG4gICAgICBtb2RlOiAndG90YWwnLFxuICAgICAgc3RkQmFuZDogdHJ1ZSxcbiAgICAgIGRUOiAxLFxuICAgICAgd2lkdGg6IDQwMCxcbiAgICAgIGhlaWdodDogMzAwLFxuICAgICAgZGF0YToge30sXG4gICAgICByYXc6IHt9LFxuICAgICAgbWFyZ2luczoge1xuICAgICAgICB0b3A6IDIwLFxuICAgICAgICBsZWZ0OiA0MCxcbiAgICAgICAgYm90dG9tOiA0MCxcbiAgICAgICAgcmlnaHQ6IDIwXG4gICAgICB9XG4gICAgfVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIFRpbWVTZXJpZXNNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuICAgICAgY29uZmlnLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZmlnLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG4gICAgICBzdXBlcihjb25maWcpO1xuICAgIH1cblxuICAgIHBhcnNlRGF0YShkYXRhLCBsYXllciA9ICdkZWZhdWx0JywgY29sb3IpIHtcbiAgICAgIHRoaXMuc2V0KGByYXcuJHtsYXllcn1gLCBkYXRhKTtcblxuICAgICAgbGV0IHVzZWRWcmFuZ2UgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmhpc3RvZ3JhbS52UmFuZ2UnKSA/IHRoaXMuZ2V0KCd2UmFuZ2UnKSA6IE9iamVjdC52YWx1ZXModGhpcy5nZXQoJ3JhdycpKS5yZWR1Y2UoKGFjYywgdmFsKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChhY2MsIHZhbC50cmFja3MucmVkdWNlKCh0YWNjLCB0dmFsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRhY2MsIHR2YWwuc2FtcGxlcy5maWx0ZXIoKGEpID0+IFV0aWxzLmV4aXN0cyhhLnNwZWVkKSkucmVkdWNlKChzYWNjLCBzdmFsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoc2FjYywgdGhpcy5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50JyA/IE1hdGgubWF4KE1hdGguYWJzKHN2YWwuc3BlZWRYKSwgTWF0aC5hYnMoc3ZhbC5zcGVlZFkpKSA6IHN2YWwuc3BlZWQpO1xuICAgICAgICAgIH0sIDApKTtcbiAgICAgICAgfSwgMCkpO1xuICAgICAgfSwgMCk7XG4gICAgICB1c2VkVnJhbmdlID0gTWF0aC5jZWlsKHVzZWRWcmFuZ2UpO1xuXG4gICAgICBsZXQgcGRhdGEgPSB7fTtcblxuICAgICAgZm9yIChsZXQgcmxheWVyIGluIHRoaXMuZ2V0KCdyYXcnKSkge1xuICAgICAgICBsZXQgcmRhdGEgPSB0aGlzLmdldChgcmF3LiR7cmxheWVyfWApO1xuICAgICAgICBsZXQgZ3JhcGhzID0ge307XG4gICAgICAgIGlmICh0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnKSB7XG4gICAgICAgICAgZ3JhcGhzLnggPSBbXTtcbiAgICAgICAgICBncmFwaHMueSA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYXBocy50b3RhbCA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZGF0YS5udW1GcmFtZXM7IGkrKykge1xuICAgICAgICAgIGZvciAobGV0IGtleSBpbiBncmFwaHMpIHtcbiAgICAgICAgICAgIGdyYXBoc1trZXldLnB1c2goe1xuICAgICAgICAgICAgICBmcmFtZTogaSxcbiAgICAgICAgICAgICAgdGltZTogaSAvIHJkYXRhLmZwcyxcbiAgICAgICAgICAgICAgc2FtcGxlczogW10sXG4gICAgICAgICAgICAgIG1lYW46IG51bGwsXG4gICAgICAgICAgICAgIHM6IG51bGxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHRyYWNrIG9mIHJkYXRhLnRyYWNrcykge1xuICAgICAgICAgIGZvciAobGV0IHNhbXBsZSBvZiB0cmFjay5zYW1wbGVzKSB7XG4gICAgICAgICAgICBpZiAoIXNhbXBsZS5zcGVlZCkgY29udGludWU7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoc2FtcGxlLnNwZWVkWCkgPiB1c2VkVnJhbmdlIHx8IE1hdGguYWJzKHNhbXBsZS5zcGVlZFkpID4gdXNlZFZyYW5nZSkgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoc2FtcGxlLnNwZWVkKSA+IHVzZWRWcmFuZ2UpIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHNhbXBsZUZyYW1lID0gTWF0aC5yb3VuZChzYW1wbGUudGltZSAqIHJkYXRhLmZwcyk7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgICAgICBncmFwaHMueFtzYW1wbGVGcmFtZS0xXS5zYW1wbGVzLnB1c2goc2FtcGxlLnNwZWVkWCk7XG4gICAgICAgICAgICAgIGdyYXBocy55W3NhbXBsZUZyYW1lLTFdLnNhbXBsZXMucHVzaChzYW1wbGUuc3BlZWRZKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGdyYXBocy50b3RhbFtzYW1wbGVGcmFtZS0xXS5zYW1wbGVzLnB1c2goc2FtcGxlLnNwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1heERpc3BsYXkgPSAwO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZ3JhcGhzKSB7XG4gICAgICAgICAgZm9yIChsZXQgZnJhbWUgb2YgZ3JhcGhzW2tleV0pIHtcbiAgICAgICAgICAgIGlmIChmcmFtZS5zYW1wbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBmcmFtZS5tZWFuID0gZnJhbWUuc2FtcGxlcy5yZWR1Y2UoKHYsIGMpID0+IHYgKyBjLCAwKSAvIGZyYW1lLnNhbXBsZXMubGVuZ3RoO1xuICAgICAgICAgICAgICBmcmFtZS5zID0gTWF0aC5zcXJ0KGZyYW1lLnNhbXBsZXMubWFwKCh2KSA9PiBNYXRoLnBvdyh2IC0gZnJhbWUubWVhbiwgMikpLnJlZHVjZSgodiwgYykgPT4gdiArIGMsIDApIC8gZnJhbWUuc2FtcGxlcy5sZW5ndGgpO1xuICAgICAgICAgICAgICBtYXhEaXNwbGF5ID0gTWF0aC5tYXgobWF4RGlzcGxheSwgTWF0aC5tYXgoTWF0aC5hYnMoZnJhbWUubWVhbiArIGZyYW1lLnMpLCBNYXRoLmFicyhmcmFtZS5tZWFuIC0gZnJhbWUucykpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGRhdGFbcmxheWVyXSA9IHtcbiAgICAgICAgICBncmFwaHM6IGdyYXBocyxcbiAgICAgICAgICBtYXhWYWx1ZTogbWF4RGlzcGxheSxcbiAgICAgICAgICBydW5UaW1lOiByZGF0YS5ydW5UaW1lLFxuICAgICAgICAgIGNvbG9yOiBybGF5ZXIgPT0gbGF5ZXIgPyBjb2xvciA6IG51bGxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0KCdkYXRhJywgcGRhdGEpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5zZXQoJ2RhdGEnLCB7fSk7XG4gICAgfVxuICB9XG59KSJdfQ==
