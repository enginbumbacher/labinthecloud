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

        // set the range for the vertical axis
        // vRange: if it is given as a parameter, choose it.
        // The structure of the data:
        // this.get('raw').live.tracks --> Array of tracks for each recorded Euglena. Each element has an array of samples, which corresponds to the info for that specific Euglena.
        // this.get('raw').live.tracks[0].samples --> Each sample has the following dictionary {angleXY, speed, speedX, speedY, time, x, y, yaw}
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

          // For each frame generate the relevant data structure for the graph - here, it has to haev a time value, a mean and a standard deviation s at every time point.
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
                    // Either display information for x and y speed separately, or the total speed.
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

            // Create the mean and standard deviation
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9hbmdsZWNoYW5nZWdyYXBoL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiR2xvYmFscyIsImRlZmF1bHRzIiwidlJhbmdlIiwibW9kZSIsInN0ZEJhbmQiLCJkVCIsIndpZHRoIiwiaGVpZ2h0IiwiZGF0YSIsInJhdyIsIm1hcmdpbnMiLCJ0b3AiLCJsZWZ0IiwiYm90dG9tIiwicmlnaHQiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImxheWVyIiwiY29sb3IiLCJzZXQiLCJ1c2VkVnJhbmdlIiwiZ2V0IiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwidmFsIiwiTWF0aCIsIm1heCIsInRyYWNrcyIsInRhY2MiLCJ0dmFsIiwic2FtcGxlcyIsImZpbHRlciIsImEiLCJleGlzdHMiLCJzcGVlZCIsInNhY2MiLCJzdmFsIiwiYWJzIiwic3BlZWRYIiwic3BlZWRZIiwiY2VpbCIsInBkYXRhIiwicmxheWVyIiwicmRhdGEiLCJncmFwaHMiLCJ4IiwieSIsInRvdGFsIiwiaSIsIm51bUZyYW1lcyIsImtleSIsInB1c2giLCJmcmFtZSIsInRpbWUiLCJmcHMiLCJtZWFuIiwicyIsInRyYWNrIiwic2FtcGxlIiwic2FtcGxlRnJhbWUiLCJyb3VuZCIsIm1heERpc3BsYXkiLCJsZW5ndGgiLCJ2IiwiYyIsInNxcnQiLCJtYXAiLCJwb3ciLCJtYXhWYWx1ZSIsInJ1blRpbWUiLCJzaG93TGF5ZXIiLCJzaG93TGF5ZXJMaXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BSUVJLFdBQVc7QUFDVEMsWUFBUSxJQURD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ZSxNQUFNRyxJQUFOLEdBQWFILE1BQU1JLENBQTVCLENBQXpDLENBQXJCLENBQWI7QUFDRDtBQU5tQjs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDdEIsb0NBQWtCWixPQUFPTSxJQUFQLENBQWxCLG1JQUErQjtBQUFBLG9CQUF0QkUsS0FBc0I7O0FBQUEsc0JBQXRCQSxLQUFzQjtBQU05QjtBQVBxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUXZCO0FBQ0RYLGdCQUFNQyxNQUFOLElBQWdCO0FBQ2RFLG9CQUFRQSxNQURNO0FBRWR3QixzQkFBVVAsVUFGSTtBQUdkUSxxQkFBUzFCLE1BQU0wQixPQUhEO0FBSWRyRCxtQkFBTzBCLFVBQVUzQixLQUFWLEdBQWtCQyxLQUFsQixHQUEwQixJQUpuQjtBQUtkc0QsdUJBQVk1QixVQUFVM0IsS0FBWCxHQUFvQixJQUFwQixHQUEyQixLQUFLSSxHQUFMLFdBQWlCdUIsTUFBakI7QUFMeEIsV0FBaEI7QUFPRDtBQUNELGFBQUt6QixHQUFMLENBQVMsTUFBVCxFQUFpQndCLEtBQWpCO0FBQ0Q7QUF0Rkg7QUFBQTtBQUFBLG1DQXdGZThCLGFBeEZmLEVBd0Y4QjtBQUMxQixhQUFLdEQsR0FBTCx3QkFBZ0NzRCxhQUFoQztBQUNEO0FBMUZIO0FBQUE7QUFBQSw4QkE0RlU7QUFDTixhQUFLdEQsR0FBTCxDQUFTLE1BQVQsRUFBaUIsRUFBakI7QUFDRDtBQTlGSDs7QUFBQTtBQUFBLElBQXFDckIsS0FBckM7QUFnR0QsQ0F2SEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2FuZ2xlY2hhbmdlZ3JhcGgvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kZWwgPSByZXF1aXJlKCdjb3JlL21vZGVsL21vZGVsJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHZSYW5nZTogbnVsbCxcbiAgICAgIG1vZGU6ICd0b3RhbCcsXG4gICAgICBzdGRCYW5kOiB0cnVlLFxuICAgICAgZFQ6IDEsXG4gICAgICB3aWR0aDogNDAwLFxuICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICBkYXRhOiB7fSxcbiAgICAgIHJhdzoge30sXG4gICAgICBtYXJnaW5zOiB7XG4gICAgICAgIHRvcDogMjAsXG4gICAgICAgIGxlZnQ6IDQwLFxuICAgICAgICBib3R0b206IDQwLFxuICAgICAgICByaWdodDogMjBcbiAgICAgIH1cbiAgICB9XG4gIDtcblxuICByZXR1cm4gY2xhc3MgVGltZVNlcmllc01vZGVsIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgcGFyc2VEYXRhKGRhdGEsIGxheWVyID0gJ2RlZmF1bHQnLCBjb2xvcikge1xuICAgICAgdGhpcy5zZXQoYHJhdy4ke2xheWVyfWAsIGRhdGEpO1xuXG5cbiAgICAgIC8vIHNldCB0aGUgcmFuZ2UgZm9yIHRoZSB2ZXJ0aWNhbCBheGlzXG4gICAgICAvLyB2UmFuZ2U6IGlmIGl0IGlzIGdpdmVuIGFzIGEgcGFyYW1ldGVyLCBjaG9vc2UgaXQuXG4gICAgICAvLyBUaGUgc3RydWN0dXJlIG9mIHRoZSBkYXRhOlxuICAgICAgLy8gdGhpcy5nZXQoJ3JhdycpLmxpdmUudHJhY2tzIC0tPiBBcnJheSBvZiB0cmFja3MgZm9yIGVhY2ggcmVjb3JkZWQgRXVnbGVuYS4gRWFjaCBlbGVtZW50IGhhcyBhbiBhcnJheSBvZiBzYW1wbGVzLCB3aGljaCBjb3JyZXNwb25kcyB0byB0aGUgaW5mbyBmb3IgdGhhdCBzcGVjaWZpYyBFdWdsZW5hLlxuICAgICAgLy8gdGhpcy5nZXQoJ3JhdycpLmxpdmUudHJhY2tzWzBdLnNhbXBsZXMgLS0+IEVhY2ggc2FtcGxlIGhhcyB0aGUgZm9sbG93aW5nIGRpY3Rpb25hcnkge2FuZ2xlWFksIHNwZWVkLCBzcGVlZFgsIHNwZWVkWSwgdGltZSwgeCwgeSwgeWF3fVxuICAgICAgbGV0IHVzZWRWcmFuZ2UgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmhpc3RvZ3JhbS52UmFuZ2UnKSA/IHRoaXMuZ2V0KCd2UmFuZ2UnKSA6IE9iamVjdC52YWx1ZXModGhpcy5nZXQoJ3JhdycpKS5yZWR1Y2UoKGFjYywgdmFsKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChhY2MsIHZhbC50cmFja3MucmVkdWNlKCh0YWNjLCB0dmFsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRhY2MsIHR2YWwuc2FtcGxlcy5maWx0ZXIoKGEpID0+IFV0aWxzLmV4aXN0cyhhLnNwZWVkKSkucmVkdWNlKChzYWNjLCBzdmFsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoc2FjYywgdGhpcy5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50JyA/IE1hdGgubWF4KE1hdGguYWJzKHN2YWwuc3BlZWRYKSwgTWF0aC5hYnMoc3ZhbC5zcGVlZFkpKSA6IHN2YWwuc3BlZWQpO1xuICAgICAgICAgIH0sIDApKTtcbiAgICAgICAgfSwgMCkpO1xuICAgICAgfSwgMCk7XG4gICAgICB1c2VkVnJhbmdlID0gTWF0aC5jZWlsKHVzZWRWcmFuZ2UpO1xuXG4gICAgICBsZXQgcGRhdGEgPSB7fTtcblxuICAgICAgZm9yIChsZXQgcmxheWVyIGluIHRoaXMuZ2V0KCdyYXcnKSkge1xuICAgICAgICBsZXQgcmRhdGEgPSB0aGlzLmdldChgcmF3LiR7cmxheWVyfWApO1xuICAgICAgICBsZXQgZ3JhcGhzID0ge307XG4gICAgICAgIGlmICh0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnKSB7XG4gICAgICAgICAgZ3JhcGhzLnggPSBbXTtcbiAgICAgICAgICBncmFwaHMueSA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYXBocy50b3RhbCA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9yIGVhY2ggZnJhbWUgZ2VuZXJhdGUgdGhlIHJlbGV2YW50IGRhdGEgc3RydWN0dXJlIGZvciB0aGUgZ3JhcGggLSBoZXJlLCBpdCBoYXMgdG8gaGFldiBhIHRpbWUgdmFsdWUsIGEgbWVhbiBhbmQgYSBzdGFuZGFyZCBkZXZpYXRpb24gcyBhdCBldmVyeSB0aW1lIHBvaW50LlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJkYXRhLm51bUZyYW1lczsgaSsrKSB7XG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIGdyYXBocykge1xuICAgICAgICAgICAgZ3JhcGhzW2tleV0ucHVzaCh7XG4gICAgICAgICAgICAgIGZyYW1lOiBpLFxuICAgICAgICAgICAgICB0aW1lOiBpIC8gcmRhdGEuZnBzLFxuICAgICAgICAgICAgICBzYW1wbGVzOiBbXSxcbiAgICAgICAgICAgICAgbWVhbjogbnVsbCxcbiAgICAgICAgICAgICAgczogbnVsbFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgdHJhY2sgb2YgcmRhdGEudHJhY2tzKSB7XG4gICAgICAgICAgZm9yIChsZXQgc2FtcGxlIG9mIHRyYWNrLnNhbXBsZXMpIHtcbiAgICAgICAgICAgIGlmICghc2FtcGxlLnNwZWVkKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnKSB7XG4gICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzYW1wbGUuc3BlZWRYKSA+IHVzZWRWcmFuZ2UgfHwgTWF0aC5hYnMoc2FtcGxlLnNwZWVkWSkgPiB1c2VkVnJhbmdlKSBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChNYXRoLmFicyhzYW1wbGUuc3BlZWQpID4gdXNlZFZyYW5nZSkgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgc2FtcGxlRnJhbWUgPSBNYXRoLnJvdW5kKHNhbXBsZS50aW1lICogcmRhdGEuZnBzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnKSB7IC8vIEVpdGhlciBkaXNwbGF5IGluZm9ybWF0aW9uIGZvciB4IGFuZCB5IHNwZWVkIHNlcGFyYXRlbHksIG9yIHRoZSB0b3RhbCBzcGVlZC5cbiAgICAgICAgICAgICAgZ3JhcGhzLnhbc2FtcGxlRnJhbWUtMV0uc2FtcGxlcy5wdXNoKHNhbXBsZS5zcGVlZFgpO1xuICAgICAgICAgICAgICBncmFwaHMueVtzYW1wbGVGcmFtZS0xXS5zYW1wbGVzLnB1c2goc2FtcGxlLnNwZWVkWSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBncmFwaHMudG90YWxbc2FtcGxlRnJhbWUtMV0uc2FtcGxlcy5wdXNoKHNhbXBsZS5zcGVlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWFuIGFuZCBzdGFuZGFyZCBkZXZpYXRpb25cbiAgICAgICAgbGV0IG1heERpc3BsYXkgPSAwO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZ3JhcGhzKSB7XG4gICAgICAgICAgZm9yIChsZXQgZnJhbWUgb2YgZ3JhcGhzW2tleV0pIHtcbiAgICAgICAgICAgIGlmIChmcmFtZS5zYW1wbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBmcmFtZS5tZWFuID0gZnJhbWUuc2FtcGxlcy5yZWR1Y2UoKHYsIGMpID0+IHYgKyBjLCAwKSAvIGZyYW1lLnNhbXBsZXMubGVuZ3RoO1xuICAgICAgICAgICAgICBmcmFtZS5zID0gTWF0aC5zcXJ0KGZyYW1lLnNhbXBsZXMubWFwKCh2KSA9PiBNYXRoLnBvdyh2IC0gZnJhbWUubWVhbiwgMikpLnJlZHVjZSgodiwgYykgPT4gdiArIGMsIDApIC8gZnJhbWUuc2FtcGxlcy5sZW5ndGgpO1xuICAgICAgICAgICAgICBtYXhEaXNwbGF5ID0gTWF0aC5tYXgobWF4RGlzcGxheSwgTWF0aC5tYXgoTWF0aC5hYnMoZnJhbWUubWVhbiArIGZyYW1lLnMpLCBNYXRoLmFicyhmcmFtZS5tZWFuIC0gZnJhbWUucykpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcGRhdGFbcmxheWVyXSA9IHtcbiAgICAgICAgICBncmFwaHM6IGdyYXBocyxcbiAgICAgICAgICBtYXhWYWx1ZTogbWF4RGlzcGxheSxcbiAgICAgICAgICBydW5UaW1lOiByZGF0YS5ydW5UaW1lLFxuICAgICAgICAgIGNvbG9yOiBybGF5ZXIgPT0gbGF5ZXIgPyBjb2xvciA6IG51bGwsXG4gICAgICAgICAgc2hvd0xheWVyOiAocmxheWVyID09IGxheWVyKSA/IHRydWUgOiB0aGlzLmdldChgZGF0YS4ke3JsYXllcn0uc2hvd0xheWVyYClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0KCdkYXRhJywgcGRhdGEpO1xuICAgIH1cblxuICAgIHNldExheWVyTGl2ZShzaG93TGF5ZXJMaXZlKSB7XG4gICAgICB0aGlzLnNldChgZGF0YS5saXZlLnNob3dMYXllcmAsIHNob3dMYXllckxpdmUpXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLnNldCgnZGF0YScsIHt9KTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
