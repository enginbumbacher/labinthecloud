'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      d3 = require('d3'),
      Template = require('text!./timeseriesgraph.html');
  require('link!./timeseriesgraph.css');

  return function (_DomView) {
    _inherits(TimeSeriesView, _DomView);

    function TimeSeriesView(model, tmpl) {
      _classCallCheck(this, TimeSeriesView);

      var _this = _possibleConstructorReturn(this, (TimeSeriesView.__proto__ || Object.getPrototypeOf(TimeSeriesView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);

      model.addEventListener('Model.Change', _this._onModelChange);

      if (model.get('mode') == "component") {
        _this.svgs = {
          x: null,
          y: null
        };
      } else {
        _this.svgs = {
          total: null
        };
      }
      for (var key in _this.svgs) {
        var svg = d3.select(_this.$el.find('.time-series__graph').get(0)).append('svg');
        svg.classed('time-series__graph__' + key, true);
        svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
        svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
        _this.svgs[key] = svg.append('g').attr('transform', 'translate(' + model.get('margins.left') + ', ' + model.get('margins.top') + ')');
      }
      _this.scales = {};
      _this.scales.x = d3.scaleLinear().range([0, model.get('width')]);
      _this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);
      return _this;
    }

    _createClass(TimeSeriesView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          case "data":
            if (evt.data.value) {
              this.reset();
              this.setup(evt.currentTarget);
            } else {
              this.reset();
            }
            break;
        }
      }
    }, {
      key: 'setup',
      value: function setup(model) {
        var _this2 = this;

        this.scales.x.domain([0, Object.values(model.get('data')).reduce(function (acc, val) {
          return Math.max(acc, val.runTime);
        }, 0)]);

        var maxValue = Object.values(model.get('data')).reduce(function (acc, val) {
          return Math.max(acc, val.maxValue);
        }, 0);
        this.scales.y.domain([model.get('mode') == 'component' ? -maxValue : 0, maxValue]);
        this.axes = {
          x: d3.axisBottom().scale(this.scales.x),
          y: d3.axisLeft().scale(this.scales.y)
        };
        this.bgs = {};
        for (var key in this.svgs) {
          this.svgs[key].selectAll('*').remove();

          this.svgs[key].select('.time-series__graph__axis').remove();
          this.svgs[key].append('g').attr('class', 'time-series__graph__axis time-series__graph__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(this.axes.x).append('text').attr('class', 'time-series__graph__axis-label').text('Time [seconds]').attr('x', model.get('width') / 2).attr('y', 30);
          this.svgs[key].append('g').attr('class', 'time-series__graph__axis time-series__graph__axis-y').call(this.axes.y).append('text').attr('class', 'time-series__graph__axis-label').text('Avg Speed [micrometers / second]').attr('transform', 'rotate(-90)').attr('y', -30).attr('x', -model.get('height') / 2);

          this.svgs[key].append('g').append('text').attr('class', 'component-speed__graph__title').text('Average forward speed (distance covered per second)').attr('y', -10).attr('x', model.get('width') / 2);

          this.bgs[key] = this.svgs[key].append('g').attr('class', 'time-series__graph__background');

          for (var layer in model.get('data')) {
            if (!model.get('data.' + layer + '.showLayer')) {
              continue;
            }
            var graphdata = model.get('data.' + layer + '.graphs.' + key).filter(function (item) {
              return item.mean;
            });
            var color = model.get('data.' + layer + '.color');
            if (model.get('stdBand')) {
              var std = d3.area().x(function (d) {
                return _this2.scales.x(d.time);
              }).y0(function (d) {
                return _this2.scales.y(d.mean - d.s);
              }).y1(function (d) {
                return _this2.scales.y(d.mean + d.s);
              });
              this.svgs[key].append('path').datum(graphdata).attr('class', 'time-series__graph__std time-series__graph__std__' + layer).attr('style', color ? 'fill: #' + color.toString(16) : null).attr('d', std);
            }

            // Function to be used for plotting
            // It defines that it takes for each data point the time element and the mean and plots it in x,y.
            // .datum(graphdata): That's the data on which to apply the function.
            // .attr(): Characteristics of the svg.
            // .attr('d',line) is where the datum gets transformed into the line.
            var line = d3.line().x(function (d) {
              return _this2.scales.x(d.time);
            }).y(function (d) {
              return _this2.scales.y(d.mean);
            });
            this.svgs[key].append('path').datum(graphdata).attr('class', 'time-series__graph__line time-series__graph__line__' + layer).attr('style', color ? 'stroke: #' + color.toString(16) : null).attr('d', line);
          }

          // Draw the lines at the different time intervals.
          if (model.get('lightConfig') && Object.keys(model.get('data')).length) {

            this.svgs[key].append("svg:defs").append("svg:marker").attr("id", 'arrow__light').attr("refX", 0).attr("refY", 2).attr("markerWidth", 4).attr("markerHeight", 4).attr("orient", "auto").append("svg:path").attr("d", "M0,0 L0,4 L4,2 z").style('fill', 'rgb(235,160,17)');

            var expDuration = model.get('lightConfig').reduce(function (acc, curr) {
              return Math.max(acc, curr.timeEnd);
            }, 0);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = model.get('lightConfig')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var config = _step.value;

                if (config.timeStart != 0) {
                  this.svgs[key].append("line").attr('class', 'component-speed__graph__light-time').attr("x1", config.timeStart * model.get('width') / expDuration).attr("y1", model.get('height')).attr("x2", config.timeStart * model.get('width') / expDuration).attr("y2", 0).attr("stroke-width", 2);
                }
                if (config.lightDir[0] != 0 || config.lightDir[1] != 0) {
                  this.svgs[key].append("line").attr('class', 'component-speed__graph__light-arrow').attr("x1", (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration + 20).attr("y1", 10).attr("x2", (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration + 10 * config.lightDir[0] + 20).attr("y2", 10 + 10 * config.lightDir[1]).attr("stroke-width", 2).attr("marker-end", 'url(#arrow__light)');
                  //var lightValue = config.left!=0? config.left: (config.right!=0? config.right : (config.top!=0? : config.top : (config.bottom!=0? config.bottom : 0)));
                  var lightValue = Math.sqrt(Math.pow(config.left, 2) + Math.pow(config.right, 2) + Math.pow(config.top, 2) + Math.pow(config.bottom, 2));
                  lightValue = Math.round(lightValue);
                  this.svgs[key].append('g').append('text').attr('class', 'component-speed__graph__light-label').text(lightValue + '% in ').attr('y', 15).attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration - 20);
                } else if (config.left != 0 && config.right != 0 && config.top != 0 && config.bottom != 0) {
                  this.svgs[key].append('g').append('text').attr('class', 'component-speed__graph__light-label').text(config.left + '% from all dir.').attr('y', 15).attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration);
                } else if (config.left != 0 && config.right != 0 && config.top == 0 && config.bottom == 0) {
                  this.svgs[key].append('g').append('text').attr('class', 'component-speed__graph__light-label').text(config.left + '% from left-right').attr('y', 15).attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration);
                } else if (config.left == 0 && config.right == 0 && config.top != 0 && config.bottom != 0) {
                  this.svgs[key].append('g').append('text').attr('class', 'component-speed__graph__light-label').text(config.top + '% from top-bottom').attr('y', 15).attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration);
                } else {
                  this.svgs[key].append('g').append('text').attr('class', 'component-speed__graph__light-label').text("no light").attr('y', 15).attr('x', (config.timeEnd + config.timeStart) / 2 * model.get('width') / expDuration);
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
          }
        }
      }
    }, {
      key: 'update',
      value: function update(timestamp, model) {
        var _this3 = this;

        var runtime = Object.values(model.get('data')).reduce(function (acc, val) {
          return Math.max(acc, val.runTime);
        }, 0);
        for (var key in this.svgs) {
          var timeband = this.bgs[key].selectAll('.time-series__graph__time-band').data([timestamp]);
          timeband.enter().append('rect').attr('class', 'time-series__graph__time-band').attr('y', 0).attr('height', model.get('height')).merge(timeband).transition().duration(0).attr('x', function (d) {
            return _this3.scales.x(Math.min(runtime, Math.max(0, d - model.get('dT') / 2)));
          }).attr('width', function (d) {
            return _this3.scales.x(model.get('dT') + Math.min(0, d - model.get('dT') / 2) + Math.min(0, runtime - d - model.get('dT') / 2));
          });
          timeband.exit().remove();
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        for (var key in this.svgs) {
          this.svgs[key].selectAll('.time-series__graph__axis').remove();
          this.svgs[key].selectAll('.time-series__graph__time-band').remove();
          this.svgs[key].selectAll('.time-series__graph__std').remove();
          this.svgs[key].selectAll('.time-series__graph__line').remove();
        }
      }
    }]);

    return TimeSeriesView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiZDMiLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiZ2V0Iiwic3ZncyIsIngiLCJ5IiwidG90YWwiLCJrZXkiLCJzdmciLCJzZWxlY3QiLCIkZWwiLCJmaW5kIiwiYXBwZW5kIiwiY2xhc3NlZCIsImF0dHIiLCJzY2FsZXMiLCJzY2FsZUxpbmVhciIsInJhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsInJlc2V0Iiwic2V0dXAiLCJjdXJyZW50VGFyZ2V0IiwiZG9tYWluIiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwidmFsIiwiTWF0aCIsIm1heCIsInJ1blRpbWUiLCJtYXhWYWx1ZSIsImF4ZXMiLCJheGlzQm90dG9tIiwic2NhbGUiLCJheGlzTGVmdCIsImJncyIsInNlbGVjdEFsbCIsInJlbW92ZSIsImNhbGwiLCJ0ZXh0IiwibGF5ZXIiLCJncmFwaGRhdGEiLCJmaWx0ZXIiLCJpdGVtIiwibWVhbiIsImNvbG9yIiwic3RkIiwiYXJlYSIsImQiLCJ0aW1lIiwieTAiLCJzIiwieTEiLCJkYXR1bSIsInRvU3RyaW5nIiwibGluZSIsImtleXMiLCJsZW5ndGgiLCJzdHlsZSIsImV4cER1cmF0aW9uIiwiY3VyciIsInRpbWVFbmQiLCJjb25maWciLCJ0aW1lU3RhcnQiLCJsaWdodERpciIsImxpZ2h0VmFsdWUiLCJzcXJ0IiwicG93IiwibGVmdCIsInJpZ2h0IiwidG9wIiwiYm90dG9tIiwicm91bmQiLCJ0aW1lc3RhbXAiLCJydW50aW1lIiwidGltZWJhbmQiLCJlbnRlciIsIm1lcmdlIiwidHJhbnNpdGlvbiIsImR1cmF0aW9uIiwibWluIiwiZXhpdCJdLCJt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ZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBkMyA9IHJlcXVpcmUoJ2QzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vdGltZXNlcmllc2dyYXBoLmh0bWwnKVxuICA7XG4gIHJlcXVpcmUoJ2xpbmshLi90aW1lc2VyaWVzZ3JhcGguY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFRpbWVTZXJpZXNWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Nb2RlbENoYW5nZSddKTtcblxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSk7XG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ21vZGUnKSA9PSBcImNvbXBvbmVudFwiKSB7XG4gICAgICAgIHRoaXMuc3ZncyA9IHtcbiAgICAgICAgICB4OiBudWxsLFxuICAgICAgICAgIHk6IG51bGxcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdmdzID0ge1xuICAgICAgICAgIHRvdGFsOiBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnN2Z3MpIHtcbiAgICAgICAgbGV0IHN2ZyA9IGQzLnNlbGVjdCh0aGlzLiRlbC5maW5kKCcudGltZS1zZXJpZXNfX2dyYXBoJykuZ2V0KDApKS5hcHBlbmQoJ3N2ZycpO1xuICAgICAgICBzdmcuY2xhc3NlZChgdGltZS1zZXJpZXNfX2dyYXBoX18ke2tleX1gLCB0cnVlKTtcbiAgICAgICAgc3ZnLmF0dHIoJ3dpZHRoJywgbW9kZWwuZ2V0KCd3aWR0aCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5yaWdodCcpKTtcbiAgICAgICAgc3ZnLmF0dHIoJ2hlaWdodCcsIG1vZGVsLmdldCgnaGVpZ2h0JykgKyBtb2RlbC5nZXQoJ21hcmdpbnMudG9wJykgKyBtb2RlbC5nZXQoJ21hcmdpbnMuYm90dG9tJykpO1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XSA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7bW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKX0sICR7bW9kZWwuZ2V0KCdtYXJnaW5zLnRvcCcpfSlgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2NhbGVzID0ge307XG4gICAgICB0aGlzLnNjYWxlcy54ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgbW9kZWwuZ2V0KCd3aWR0aCcpXSk7XG4gICAgICB0aGlzLnNjYWxlcy55ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbbW9kZWwuZ2V0KCdoZWlnaHQnKSwgMF0pO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoIChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgXCJkYXRhXCI6XG4gICAgICAgICAgaWYgKGV2dC5kYXRhLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLnNldHVwKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cChtb2RlbCkge1xuICAgICAgdGhpcy5zY2FsZXMueC5kb21haW4oWzAsIE9iamVjdC52YWx1ZXMobW9kZWwuZ2V0KCdkYXRhJykpLnJlZHVjZSgoYWNjLCB2YWwpID0+IE1hdGgubWF4KGFjYywgdmFsLnJ1blRpbWUpLCAwKV0pO1xuXG4gICAgICBsZXQgbWF4VmFsdWUgPSBPYmplY3QudmFsdWVzKG1vZGVsLmdldCgnZGF0YScpKS5yZWR1Y2UoKGFjYywgdmFsKSA9PiBNYXRoLm1heChhY2MsIHZhbC5tYXhWYWx1ZSksIDApO1xuICAgICAgdGhpcy5zY2FsZXMueS5kb21haW4oW21vZGVsLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnID8gLW1heFZhbHVlIDogMCwgbWF4VmFsdWVdKTtcbiAgICAgIHRoaXMuYXhlcyA9IHtcbiAgICAgICAgeDogZDMuYXhpc0JvdHRvbSgpLnNjYWxlKHRoaXMuc2NhbGVzLngpLFxuICAgICAgICB5OiBkMy5heGlzTGVmdCgpLnNjYWxlKHRoaXMuc2NhbGVzLnkpXG4gICAgICB9O1xuICAgICAgdGhpcy5iZ3MgPSB7fTtcbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnN2Z3MpIHtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcqJykucmVtb3ZlKCk7XG5cbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0KCcudGltZS1zZXJpZXNfX2dyYXBoX19heGlzJykucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYXhpcyB0aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMteCcpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttb2RlbC5nZXQoJ2hlaWdodCcpfSlgKVxuICAgICAgICAgIC5jYWxsKHRoaXMuYXhlcy54KVxuICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYXhpcy1sYWJlbCcpXG4gICAgICAgICAgICAudGV4dCgnVGltZSBbc2Vjb25kc10nKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAzMCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYXhpcyB0aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMteScpXG4gICAgICAgICAgLmNhbGwodGhpcy5heGVzLnkpXG4gICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGltZS1zZXJpZXNfX2dyYXBoX19heGlzLWxhYmVsJylcbiAgICAgICAgICAgIC50ZXh0KGBBdmcgU3BlZWQgW21pY3JvbWV0ZXJzIC8gc2Vjb25kXWApXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3JvdGF0ZSgtOTApJylcbiAgICAgICAgICAgIC5hdHRyKCd5JywgLTMwKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAtbW9kZWwuZ2V0KCdoZWlnaHQnKSAvIDIpO1xuXG4gICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY29tcG9uZW50LXNwZWVkX19ncmFwaF9fdGl0bGUnKVxuICAgICAgICAgICAgLnRleHQoJ0F2ZXJhZ2UgZm9yd2FyZCBzcGVlZCAoZGlzdGFuY2UgY292ZXJlZCBwZXIgc2Vjb25kKScpXG4gICAgICAgICAgICAuYXR0cigneScsIC0xMClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgbW9kZWwuZ2V0KCd3aWR0aCcpIC8gMik7XG5cbiAgICAgICAgdGhpcy5iZ3Nba2V5XSA9IHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYmFja2dyb3VuZCcpO1xuXG4gICAgICAgIGZvciAobGV0IGxheWVyIGluIG1vZGVsLmdldCgnZGF0YScpKSB7XG4gICAgICAgICAgaWYgKCFtb2RlbC5nZXQoYGRhdGEuJHtsYXllcn0uc2hvd0xheWVyYCkpIHtjb250aW51ZX1cbiAgICAgICAgICBsZXQgZ3JhcGhkYXRhID0gbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LmdyYXBocy4ke2tleX1gKS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ubWVhbik7XG4gICAgICAgICAgbGV0IGNvbG9yID0gbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LmNvbG9yYClcbiAgICAgICAgICBpZiAobW9kZWwuZ2V0KCdzdGRCYW5kJykpIHtcbiAgICAgICAgICAgIGxldCBzdGQgPSBkMy5hcmVhKClcbiAgICAgICAgICAgICAgLngoKGQpID0+IHRoaXMuc2NhbGVzLngoZC50aW1lKSlcbiAgICAgICAgICAgICAgLnkwKChkKSA9PiB0aGlzLnNjYWxlcy55KGQubWVhbiAtIGQucykpXG4gICAgICAgICAgICAgIC55MSgoZCkgPT4gdGhpcy5zY2FsZXMueShkLm1lYW4gKyBkLnMpKTtcbiAgICAgICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAgIC5kYXR1bShncmFwaGRhdGEpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGB0aW1lLXNlcmllc19fZ3JhcGhfX3N0ZCB0aW1lLXNlcmllc19fZ3JhcGhfX3N0ZF9fJHtsYXllcn1gKVxuICAgICAgICAgICAgICAuYXR0cignc3R5bGUnLCBjb2xvciA/IGBmaWxsOiAjJHtjb2xvci50b1N0cmluZygxNil9YCA6IG51bGwpXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgc3RkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGdW5jdGlvbiB0byBiZSB1c2VkIGZvciBwbG90dGluZ1xuICAgICAgICAgIC8vIEl0IGRlZmluZXMgdGhhdCBpdCB0YWtlcyBmb3IgZWFjaCBkYXRhIHBvaW50IHRoZSB0aW1lIGVsZW1lbnQgYW5kIHRoZSBtZWFuIGFuZCBwbG90cyBpdCBpbiB4LHkuXG4gICAgICAgICAgLy8gLmRhdHVtKGdyYXBoZGF0YSk6IFRoYXQncyB0aGUgZGF0YSBvbiB3aGljaCB0byBhcHBseSB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgLy8gLmF0dHIoKTogQ2hhcmFjdGVyaXN0aWNzIG9mIHRoZSBzdmcuXG4gICAgICAgICAgLy8gLmF0dHIoJ2QnLGxpbmUpIGlzIHdoZXJlIHRoZSBkYXR1bSBnZXRzIHRyYW5zZm9ybWVkIGludG8gdGhlIGxpbmUuXG4gICAgICAgICAgbGV0IGxpbmUgPSBkMy5saW5lKClcbiAgICAgICAgICAgIC54KChkKSA9PiB0aGlzLnNjYWxlcy54KGQudGltZSkpXG4gICAgICAgICAgICAueSgoZCkgPT4gdGhpcy5zY2FsZXMueShkLm1lYW4pKVxuICAgICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAuZGF0dW0oZ3JhcGhkYXRhKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYHRpbWUtc2VyaWVzX19ncmFwaF9fbGluZSB0aW1lLXNlcmllc19fZ3JhcGhfX2xpbmVfXyR7bGF5ZXJ9YClcbiAgICAgICAgICAgIC5hdHRyKCdzdHlsZScsIGNvbG9yID8gYHN0cm9rZTogIyR7Y29sb3IudG9TdHJpbmcoMTYpfWAgOiBudWxsKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCBsaW5lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERyYXcgdGhlIGxpbmVzIGF0IHRoZSBkaWZmZXJlbnQgdGltZSBpbnRlcnZhbHMuXG4gICAgICAgIGlmIChtb2RlbC5nZXQoJ2xpZ2h0Q29uZmlnJykgJiYgT2JqZWN0LmtleXMobW9kZWwuZ2V0KCdkYXRhJykpLmxlbmd0aCkge1xuXG4gICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKFwic3ZnOmRlZnNcIilcbiAgICAgICAgICAgXHQuYXBwZW5kKFwic3ZnOm1hcmtlclwiKVxuICAgICAgICAgICBcdC5hdHRyKFwiaWRcIiwgYGFycm93X19saWdodGApXG4gICAgICAgICAgIFx0LmF0dHIoXCJyZWZYXCIsIDApXG4gICAgICAgICAgIFx0LmF0dHIoXCJyZWZZXCIsIDIpXG4gICAgICAgICAgIFx0LmF0dHIoXCJtYXJrZXJXaWR0aFwiLCA0KVxuICAgICAgICAgICBcdC5hdHRyKFwibWFya2VySGVpZ2h0XCIsIDQpXG4gICAgICAgICAgIFx0LmF0dHIoXCJvcmllbnRcIiwgXCJhdXRvXCIpXG4gICAgICAgICAgIFx0LmFwcGVuZChcInN2ZzpwYXRoXCIpXG4gICAgICAgICAgIFx0LmF0dHIoXCJkXCIsIFwiTTAsMCBMMCw0IEw0LDIgelwiKVxuICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsJ3JnYigyMzUsMTYwLDE3KScpO1xuXG4gICAgICAgICAgdmFyIGV4cER1cmF0aW9uID0gbW9kZWwuZ2V0KCdsaWdodENvbmZpZycpLnJlZHVjZSgoYWNjLGN1cnIpID0+IE1hdGgubWF4KGFjYyxjdXJyLnRpbWVFbmQpLDApO1xuXG4gICAgICAgICAgZm9yIChsZXQgY29uZmlnIG9mIG1vZGVsLmdldCgnbGlnaHRDb25maWcnKSkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy50aW1lU3RhcnQgIT0gMCkge1xuICAgICAgICAgICAgICB0aGlzLnN2Z3Nba2V5XS5hcHBlbmQoXCJsaW5lXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvbXBvbmVudC1zcGVlZF9fZ3JhcGhfX2xpZ2h0LXRpbWUnKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieDFcIiwgY29uZmlnLnRpbWVTdGFydCAqIG1vZGVsLmdldCgnd2lkdGgnKSAvIGV4cER1cmF0aW9uKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieTFcIiwgbW9kZWwuZ2V0KCdoZWlnaHQnKSlcbiAgICAgICAgICAgICAgICAuYXR0cihcIngyXCIsIGNvbmZpZy50aW1lU3RhcnQgKiBtb2RlbC5nZXQoJ3dpZHRoJykgLyBleHBEdXJhdGlvbilcbiAgICAgICAgICAgICAgICAuYXR0cihcInkyXCIsMClcbiAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLDIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29uZmlnLmxpZ2h0RGlyWzBdICE9IDAgfHwgY29uZmlnLmxpZ2h0RGlyWzFdICE9IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKFwibGluZVwiKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvbXBvbmVudC1zcGVlZF9fZ3JhcGhfX2xpZ2h0LWFycm93JylcbiAgICAgICAgICAgICAgICAgIC5hdHRyKFwieDFcIiwoY29uZmlnLnRpbWVFbmQgKyBjb25maWcudGltZVN0YXJ0KSAvIDIgKiBtb2RlbC5nZXQoJ3dpZHRoJykgLyBleHBEdXJhdGlvbiArIDIwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ5MVwiLCAxMClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKFwieDJcIiwoY29uZmlnLnRpbWVFbmQgKyBjb25maWcudGltZVN0YXJ0KSAvIDIgICogbW9kZWwuZ2V0KCd3aWR0aCcpIC8gZXhwRHVyYXRpb24gKyAxMCAqIGNvbmZpZy5saWdodERpclswXSArIDIwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCAxMCArIDEwICogY29uZmlnLmxpZ2h0RGlyWzFdKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwyKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJtYXJrZXItZW5kXCIsYHVybCgjYXJyb3dfX2xpZ2h0KWApXG4gICAgICAgICAgICAgIC8vdmFyIGxpZ2h0VmFsdWUgPSBjb25maWcubGVmdCE9MD8gY29uZmlnLmxlZnQ6IChjb25maWcucmlnaHQhPTA/IGNvbmZpZy5yaWdodCA6IChjb25maWcudG9wIT0wPyA6IGNvbmZpZy50b3AgOiAoY29uZmlnLmJvdHRvbSE9MD8gY29uZmlnLmJvdHRvbSA6IDApKSk7XG4gICAgICAgICAgICAgIHZhciBsaWdodFZhbHVlID0gTWF0aC5zcXJ0KE1hdGgucG93KGNvbmZpZy5sZWZ0LDIpICsgTWF0aC5wb3coY29uZmlnLnJpZ2h0LDIpICsgTWF0aC5wb3coY29uZmlnLnRvcCwyKSArIE1hdGgucG93KGNvbmZpZy5ib3R0b20sMikpO1xuICAgICAgICAgICAgICBsaWdodFZhbHVlID0gTWF0aC5yb3VuZChsaWdodFZhbHVlKTtcbiAgICAgICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY29tcG9uZW50LXNwZWVkX19ncmFwaF9fbGlnaHQtbGFiZWwnKVxuICAgICAgICAgICAgICAgIC50ZXh0KGAke2xpZ2h0VmFsdWV9JSBpbiBgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgMTUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoY29uZmlnLnRpbWVFbmQgKyBjb25maWcudGltZVN0YXJ0KSAvIDIgKiBtb2RlbC5nZXQoJ3dpZHRoJykgLyBleHBEdXJhdGlvbiAtIDIwKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcubGVmdCAhPSAwICYmIGNvbmZpZy5yaWdodCAhPSAwICYmIGNvbmZpZy50b3AgIT0gMCAmJiBjb25maWcuYm90dG9tICE9IDApe1xuICAgICAgICAgICAgICB0aGlzLnN2Z3Nba2V5XS5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjb21wb25lbnQtc3BlZWRfX2dyYXBoX19saWdodC1sYWJlbCcpXG4gICAgICAgICAgICAgICAgLnRleHQoYCR7Y29uZmlnLmxlZnR9JSBmcm9tIGFsbCBkaXIuYClcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIDE1KVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgKGNvbmZpZy50aW1lRW5kICsgY29uZmlnLnRpbWVTdGFydCkgLyAyICogbW9kZWwuZ2V0KCd3aWR0aCcpIC8gZXhwRHVyYXRpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcubGVmdCAhPSAwICYmIGNvbmZpZy5yaWdodCAhPSAwICYmIGNvbmZpZy50b3AgPT0gMCAmJiBjb25maWcuYm90dG9tID09IDApe1xuICAgICAgICAgICAgICB0aGlzLnN2Z3Nba2V5XS5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjb21wb25lbnQtc3BlZWRfX2dyYXBoX19saWdodC1sYWJlbCcpXG4gICAgICAgICAgICAgICAgLnRleHQoYCR7Y29uZmlnLmxlZnR9JSBmcm9tIGxlZnQtcmlnaHRgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgMTUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoY29uZmlnLnRpbWVFbmQgKyBjb25maWcudGltZVN0YXJ0KSAvIDIgKiBtb2RlbC5nZXQoJ3dpZHRoJykgLyBleHBEdXJhdGlvbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5sZWZ0ID09IDAgJiYgY29uZmlnLnJpZ2h0ID09IDAgJiYgY29uZmlnLnRvcCAhPSAwICYmIGNvbmZpZy5ib3R0b20gIT0gMCl7XG4gICAgICAgICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvbXBvbmVudC1zcGVlZF9fZ3JhcGhfX2xpZ2h0LWxhYmVsJylcbiAgICAgICAgICAgICAgICAudGV4dChgJHtjb25maWcudG9wfSUgZnJvbSB0b3AtYm90dG9tYClcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIDE1KVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgKGNvbmZpZy50aW1lRW5kICsgY29uZmlnLnRpbWVTdGFydCkgLyAyICogbW9kZWwuZ2V0KCd3aWR0aCcpIC8gZXhwRHVyYXRpb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY29tcG9uZW50LXNwZWVkX19ncmFwaF9fbGlnaHQtbGFiZWwnKVxuICAgICAgICAgICAgICAgIC50ZXh0KFwibm8gbGlnaHRcIilcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIDE1KVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgKGNvbmZpZy50aW1lRW5kICsgY29uZmlnLnRpbWVTdGFydCkgLyAyICogbW9kZWwuZ2V0KCd3aWR0aCcpIC8gZXhwRHVyYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlKHRpbWVzdGFtcCwgbW9kZWwpIHtcbiAgICAgIGxldCBydW50aW1lID0gT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCB2YWwucnVuVGltZSksIDApO1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICBsZXQgdGltZWJhbmQgPSB0aGlzLmJnc1trZXldLnNlbGVjdEFsbCgnLnRpbWUtc2VyaWVzX19ncmFwaF9fdGltZS1iYW5kJylcbiAgICAgICAgICAuZGF0YShbdGltZXN0YW1wXSlcbiAgICAgICAgdGltZWJhbmQuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aW1lLXNlcmllc19fZ3JhcGhfX3RpbWUtYmFuZCcpXG4gICAgICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBtb2RlbC5nZXQoJ2hlaWdodCcpKVxuICAgICAgICAgIC5tZXJnZSh0aW1lYmFuZClcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMuc2NhbGVzLngoTWF0aC5taW4ocnVudGltZSwgTWF0aC5tYXgoMCwgZCAtIG1vZGVsLmdldCgnZFQnKSAvIDIpKSkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgPT4gdGhpcy5zY2FsZXMueChtb2RlbC5nZXQoJ2RUJykgKyBNYXRoLm1pbigwLCBkIC0gbW9kZWwuZ2V0KCdkVCcpIC8gMikgKyBNYXRoLm1pbigwLCBydW50aW1lIC0gZCAtIG1vZGVsLmdldCgnZFQnKSAvIDIpKSlcbiAgICAgICAgdGltZWJhbmQuZXhpdCgpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XS5zZWxlY3RBbGwoJy50aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX190aW1lLWJhbmQnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX19zdGQnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX19saW5lJykucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl19
