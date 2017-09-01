'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Model = require('core/model/model'),
      defaults = {
    id: 'aggregate_time',
    graph_class: 'aggregate_time',
    axis_label: 'Aggregate Time',
    width: 500,
    height: 300,
    margins: {
      top: 20,
      bottom: 40,
      left: 80,
      right: 20
    }
  },
      EugUtils = require('euglena/utils');

  return function (_Model) {
    _inherits(AggregateTimeGraphModel, _Model);

    function AggregateTimeGraphModel(conf) {
      _classCallCheck(this, AggregateTimeGraphModel);

      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      return _possibleConstructorReturn(this, (AggregateTimeGraphModel.__proto__ || Object.getPrototypeOf(AggregateTimeGraphModel)).call(this, conf));
    }

    _createClass(AggregateTimeGraphModel, [{
      key: 'update',
      value: function update(datasets) {
        var _this2 = this;

        var dss = Object.values(datasets);
        var allSame = true;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = dss[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var ds = _step.value;

            if (ds == dss[0]) continue;
            if (!EugUtils.experimentMatch(dss[0].get('experiment'), ds.get('experiment'))) {
              allSame = false;
              break;
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

        if (!allSame || dss.length == 0) {
          // TODO disable graph
          this.set('graph', null);
          this.dispatchEvent('AggregateGraph.DisableRequest', {
            id: this.get('id')
          });
          return;
        }
        this.dispatchEvent('AggregateGraph.EnableRequest', {
          id: this.get('id')
        });
        // let group = Object.values(datasets)[0];

        var lines = {};

        var _loop = function _loop(group) {
          group.get('results').forEach(function (res) {
            lines[res.get('id')] = _this2.generateLine(res, group.get('experiment'));
          });
        };

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = dss[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var group = _step2.value;

            _loop(group);
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

        this.set('graph', {
          lines: lines,
          lights: dss[0].get('experiment.configuration'),
          runTime: dss[0].get('experiment.configuration').reduce(function (acc, val) {
            return acc + val.duration;
          }, 0),
          maxValue: this.getMaxValue(lines),
          minValue: this.getMinValue(lines)
        });
      }
    }, {
      key: 'getMinValue',
      value: function getMinValue(lines) {
        return Object.values(lines).reduce(function (lacc, lval) {
          return Math.min(lacc, lval.data.reduce(function (pacc, pval) {
            return Math.min(pacc, pval.value);
          }, 0));
        }, 0);
      }
    }, {
      key: 'getMaxValue',
      value: function getMaxValue(lines) {
        return Object.values(lines).reduce(function (lacc, lval) {
          return Math.max(lacc, lval.data.reduce(function (pacc, pval) {
            return Math.max(pacc, pval.value);
          }, 0));
        }, 0);
      }
    }, {
      key: 'generateLine',
      value: function generateLine(res, exp) {
        var _this3 = this;

        var line = [];
        for (var i = 0; i <= res.get('numFrames'); i++) {
          line.push({
            frame: i,
            time: i / res.get('fps'),
            samples: []
          });
        }
        res.get('tracks').forEach(function (track) {
          track.samples.forEach(function (sample) {
            var sframe = Math.max(1, Math.round(sample.time * res.get('fps')));
            var maxFrame = Math.min(res.get('numFrames'), sframe + Math.round(res.get('fps') * Globals.get('AppConfig.aggregate.timeWindow')));
            for (var _i = sframe; _i <= maxFrame; _i++) {
              line[_i].samples.push(sample);
            }
          });
        });
        line.forEach(function (point) {
          point.value = _this3.generateLinePoint(point, exp);
        });

        return {
          id: res.get('id'),
          color: res.get('color'),
          data: line
        };
      }
    }, {
      key: 'generateLinePoint',
      value: function generateLinePoint(data, experiment) {
        return 0;
      }
    }]);

    return AggregateTimeGraphModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC90aW1lL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZGVsIiwiZGVmYXVsdHMiLCJpZCIsImdyYXBoX2NsYXNzIiwiYXhpc19sYWJlbCIsIndpZHRoIiwiaGVpZ2h0IiwibWFyZ2lucyIsInRvcCIsImJvdHRvbSIsImxlZnQiLCJyaWdodCIsIkV1Z1V0aWxzIiwiY29uZiIsImVuc3VyZURlZmF1bHRzIiwiZGF0YXNldHMiLCJkc3MiLCJPYmplY3QiLCJ2YWx1ZXMiLCJhbGxTYW1lIiwiZHMiLCJleHBlcmltZW50TWF0Y2giLCJnZXQiLCJsZW5ndGgiLCJzZXQiLCJkaXNwYXRjaEV2ZW50IiwibGluZXMiLCJncm91cCIsImZvckVhY2giLCJyZXMiLCJnZW5lcmF0ZUxpbmUiLCJsaWdodHMiLCJydW5UaW1lIiwicmVkdWNlIiwiYWNjIiwidmFsIiwiZHVyYXRpb24iLCJtYXhWYWx1ZSIsImdldE1heFZhbHVlIiwibWluVmFsdWUiLCJnZXRNaW5WYWx1ZSIsImxhY2MiLCJsdmFsIiwiTWF0aCIsIm1pbiIsImRhdGEiLCJwYWNjIiwicHZhbCIsInZhbHVlIiwibWF4IiwiZXhwIiwibGluZSIsImkiLCJwdXNoIiwiZnJhbWUiLCJ0aW1lIiwic2FtcGxlcyIsInRyYWNrIiwic2FtcGxlIiwic2ZyYW1lIiwicm91bmQiLCJtYXhGcmFtZSIsInBvaW50IiwiZ2VuZXJhdGVMaW5lUG9pbnQiLCJjb2xvciIsImV4cGVyaW1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFFBQVFKLFFBQVEsa0JB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QztBQUNsQyxlQUFPLENBQVA7QUFDRDtBQW5GSDs7QUFBQTtBQUFBLElBQTZDakUsS0FBN0M7QUFxRkQsQ0ExR0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL3RpbWUvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpXG4gIFxuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIGlkOiAnYWdncmVnYXRlX3RpbWUnLFxuICAgICAgZ3JhcGhfY2xhc3M6ICdhZ2dyZWdhdGVfdGltZScsXG4gICAgICBheGlzX2xhYmVsOiAnQWdncmVnYXRlIFRpbWUnLFxuICAgICAgd2lkdGg6IDUwMCxcbiAgICAgIGhlaWdodDogMzAwLFxuICAgICAgbWFyZ2luczoge1xuICAgICAgICB0b3A6IDIwLFxuICAgICAgICBib3R0b206IDQwLFxuICAgICAgICBsZWZ0OiA4MCxcbiAgICAgICAgcmlnaHQ6IDIwXG4gICAgICB9XG4gICAgfSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKVxuXG4gIHJldHVybiBjbGFzcyBBZ2dyZWdhdGVUaW1lR3JhcGhNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25mKSB7XG4gICAgICBjb25mLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZi5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZik7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRhdGFzZXRzKSB7XG4gICAgICBjb25zdCBkc3MgPSBPYmplY3QudmFsdWVzKGRhdGFzZXRzKTtcbiAgICAgIGxldCBhbGxTYW1lID0gdHJ1ZTtcbiAgICAgIGZvciAobGV0IGRzIG9mIGRzcykge1xuICAgICAgICBpZiAoZHMgPT0gZHNzWzBdKSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFFdWdVdGlscy5leHBlcmltZW50TWF0Y2goZHNzWzBdLmdldCgnZXhwZXJpbWVudCcpLCBkcy5nZXQoJ2V4cGVyaW1lbnQnKSkpIHtcbiAgICAgICAgICBhbGxTYW1lID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghYWxsU2FtZSB8fCBkc3MubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gVE9ETyBkaXNhYmxlIGdyYXBoXG4gICAgICAgIHRoaXMuc2V0KCdncmFwaCcsIG51bGwpXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlR3JhcGguRGlzYWJsZVJlcXVlc3QnLCB7XG4gICAgICAgICAgaWQ6IHRoaXMuZ2V0KCdpZCcpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlR3JhcGguRW5hYmxlUmVxdWVzdCcsIHtcbiAgICAgICAgaWQ6IHRoaXMuZ2V0KCdpZCcpXG4gICAgICB9KVxuICAgICAgLy8gbGV0IGdyb3VwID0gT2JqZWN0LnZhbHVlcyhkYXRhc2V0cylbMF07XG5cbiAgICAgIGNvbnN0IGxpbmVzID0ge307XG4gICAgICBmb3IgKGxldCBncm91cCBvZiBkc3MpIHtcbiAgICAgICAgZ3JvdXAuZ2V0KCdyZXN1bHRzJykuZm9yRWFjaCgocmVzKSA9PiB7XG4gICAgICAgICAgbGluZXNbcmVzLmdldCgnaWQnKV0gPSB0aGlzLmdlbmVyYXRlTGluZShyZXMsIGdyb3VwLmdldCgnZXhwZXJpbWVudCcpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgdGhpcy5zZXQoJ2dyYXBoJywge1xuICAgICAgICBsaW5lczogbGluZXMsXG4gICAgICAgIGxpZ2h0czogZHNzWzBdLmdldCgnZXhwZXJpbWVudC5jb25maWd1cmF0aW9uJyksXG4gICAgICAgIHJ1blRpbWU6IGRzc1swXS5nZXQoJ2V4cGVyaW1lbnQuY29uZmlndXJhdGlvbicpLnJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbC5kdXJhdGlvbiwgMCksXG4gICAgICAgIG1heFZhbHVlOiB0aGlzLmdldE1heFZhbHVlKGxpbmVzKSxcbiAgICAgICAgbWluVmFsdWU6IHRoaXMuZ2V0TWluVmFsdWUobGluZXMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGdldE1pblZhbHVlKGxpbmVzKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhsaW5lcykucmVkdWNlKChsYWNjLCBsdmFsKSA9PiBNYXRoLm1pbihsYWNjLCBsdmFsLmRhdGEucmVkdWNlKChwYWNjLHB2YWwpID0+IE1hdGgubWluKHBhY2MsIHB2YWwudmFsdWUpLCAwKSksIDApXG4gICAgfVxuXG4gICAgZ2V0TWF4VmFsdWUobGluZXMpIHtcbiAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKGxpbmVzKS5yZWR1Y2UoKGxhY2MsIGx2YWwpID0+IE1hdGgubWF4KGxhY2MsIGx2YWwuZGF0YS5yZWR1Y2UoKHBhY2MscHZhbCkgPT4gTWF0aC5tYXgocGFjYywgcHZhbC52YWx1ZSksIDApKSwgMClcbiAgICB9XG5cbiAgICBnZW5lcmF0ZUxpbmUocmVzLCBleHApIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBbXVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gcmVzLmdldCgnbnVtRnJhbWVzJyk7IGkrKykge1xuICAgICAgICBsaW5lLnB1c2goe1xuICAgICAgICAgIGZyYW1lOiBpLFxuICAgICAgICAgIHRpbWU6IGkgLyByZXMuZ2V0KCdmcHMnKSxcbiAgICAgICAgICBzYW1wbGVzOiBbXVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmVzLmdldCgndHJhY2tzJykuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgdHJhY2suc2FtcGxlcy5mb3JFYWNoKChzYW1wbGUpID0+IHtcbiAgICAgICAgICBjb25zdCBzZnJhbWUgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHNhbXBsZS50aW1lICogcmVzLmdldCgnZnBzJykpKTtcbiAgICAgICAgICBjb25zdCBtYXhGcmFtZSA9IE1hdGgubWluKHJlcy5nZXQoJ251bUZyYW1lcycpLCBzZnJhbWUgKyBNYXRoLnJvdW5kKHJlcy5nZXQoJ2ZwcycpICogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5hZ2dyZWdhdGUudGltZVdpbmRvdycpKSlcbiAgICAgICAgICBmb3IgKGxldCBpID0gc2ZyYW1lOyBpIDw9IG1heEZyYW1lOyBpKyspIHtcbiAgICAgICAgICAgIGxpbmVbaV0uc2FtcGxlcy5wdXNoKHNhbXBsZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgbGluZS5mb3JFYWNoKChwb2ludCkgPT4ge1xuICAgICAgICBwb2ludC52YWx1ZSA9IHRoaXMuZ2VuZXJhdGVMaW5lUG9pbnQocG9pbnQsIGV4cCk7XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogcmVzLmdldCgnaWQnKSxcbiAgICAgICAgY29sb3I6IHJlcy5nZXQoJ2NvbG9yJyksXG4gICAgICAgIGRhdGE6IGxpbmVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVMaW5lUG9pbnQoZGF0YSwgZXhwZXJpbWVudCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG59KSJdfQ==
