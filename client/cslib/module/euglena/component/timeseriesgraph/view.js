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
          if (model.get('lightConfig')) {

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiZDMiLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiZ2V0Iiwic3ZncyIsIngiLCJ5IiwidG90YWwiLCJrZXkiLCJzdmciLCJzZWxlY3QiLCIkZWwiLCJmaW5kIiwiYXBwZW5kIiwiY2xhc3NlZCIsImF0dHIiLCJzY2FsZXMiLCJzY2FsZUxpbmVhciIsInJhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsInJlc2V0Iiwic2V0dXAiLCJjdXJyZW50VGFyZ2V0IiwiZG9tYWluIiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwidmFsIiwiTWF0aCIsIm1heCIsInJ1blRpbWUiLCJtYXhWYWx1ZSIsImF4ZXMiLCJheGlzQm90dG9tIiwic2NhbGUiLCJheGlzTGVmdCIsImJncyIsInNlbGVjdEFsbCIsInJlbW92ZSIsImNhbGwiLCJ0ZXh0IiwibGF5ZXIiLCJncmFwaGRhdGEiLCJmaWx0ZXIiLCJpdGVtIiwibWVhbiIsImNvbG9yIiwic3RkIiwiYXJlYSIsImQiLCJ0aW1lIiwieTAiLCJzIiwieTEiLCJkYXR1bSIsInRvU3RyaW5nIiwibGluZSIsInN0eWxlIiwiZXhwRHVyYXRpb24iLCJjdXJyIiwidGltZUVuZCIsImNvbmZpZyIsInRpbWVTdGFydCIsImxpZ2h0RGlyIiwibGlnaHRWYWx1ZSIsInNxcnQiLCJwb3ciLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJyb3VuZCIsInRpbWVzdGFtcCIsInJ1bnRpbWUiLCJ0aW1lYmFuZCIsImVudGVyIiwibWVyZ2UiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJtaW4iLCJleGl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7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TCxDQUFTLENBQVQsRUFBWW9CLElBQUl2RCxNQUFNSyxHQUFOLENBQVUsSUFBVixJQUFrQixDQUFsQyxDQUFsQixDQUFkLENBQVA7QUFBQSxXQVBmLEVBUUtZLElBUkwsQ0FRVSxPQVJWLEVBUW1CLFVBQUNzQyxDQUFEO0FBQUEsbUJBQU8sT0FBS3JDLE1BQUwsQ0FBWVgsQ0FBWixDQUFjUCxNQUFNSyxHQUFOLENBQVUsSUFBVixJQUFrQjZCLEtBQUttRCxHQUFMLENBQVMsQ0FBVCxFQUFZOUIsSUFBSXZELE1BQU1LLEdBQU4sQ0FBVSxJQUFWLElBQWtCLENBQWxDLENBQWxCLEdBQXlENkIsS0FBS21ELEdBQUwsQ0FBUyxDQUFULEVBQVlOLFVBQVV4QixDQUFWLEdBQWN2RCxNQUFNSyxHQUFOLENBQVUsSUFBVixJQUFrQixDQUE1QyxDQUF2RSxDQUFQO0FBQUEsV0FSbkI7QUFTQTJFLG1CQUFTTSxJQUFULEdBQWdCMUMsTUFBaEI7QUFDRDtBQUNGO0FBdE5IO0FBQUE7QUFBQSw4QkF3TlU7QUFDTixhQUFLLElBQUlsQyxHQUFULElBQWdCLEtBQUtKLElBQXJCLEVBQTJCO0FBQ3pCLGVBQUtBLElBQUwsQ0FBVUksR0FBVixFQUFlaUMsU0FBZixDQUF5QiwyQkFBekIsRUFBc0RDLE1BQXREO0FBQ0EsZUFBS3RDLElBQUwsQ0FBVUksR0FBVixFQUFlaUMsU0FBZixDQUF5QixnQ0FBekIsRUFBMkRDLE1BQTNEO0FBQ0EsZUFBS3RDLElBQUwsQ0FBVUksR0FBVixFQUFlaUMsU0FBZixDQUF5QiwwQkFBekIsRUFBcURDLE1BQXJEO0FBQ0EsZUFBS3RDLElBQUwsQ0FBVUksR0FBVixFQUFlaUMsU0FBZixDQUF5QiwyQkFBekIsRUFBc0RDLE1BQXREO0FBQ0Q7QUFDRjtBQS9OSDs7QUFBQTtBQUFBLElBQW9DaEQsT0FBcEM7QUFpT0QsQ0F6T0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3RpbWVzZXJpZXNncmFwaC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGQzID0gcmVxdWlyZSgnZDMnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi90aW1lc2VyaWVzZ3JhcGguaHRtbCcpXG4gIDtcbiAgcmVxdWlyZSgnbGluayEuL3RpbWVzZXJpZXNncmFwaC5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgVGltZVNlcmllc1ZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJ10pO1xuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcblxuICAgICAgaWYgKG1vZGVsLmdldCgnbW9kZScpID09IFwiY29tcG9uZW50XCIpIHtcbiAgICAgICAgdGhpcy5zdmdzID0ge1xuICAgICAgICAgIHg6IG51bGwsXG4gICAgICAgICAgeTogbnVsbFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN2Z3MgPSB7XG4gICAgICAgICAgdG90YWw6IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICBsZXQgc3ZnID0gZDMuc2VsZWN0KHRoaXMuJGVsLmZpbmQoJy50aW1lLXNlcmllc19fZ3JhcGgnKS5nZXQoMCkpLmFwcGVuZCgnc3ZnJyk7XG4gICAgICAgIHN2Zy5jbGFzc2VkKGB0aW1lLXNlcmllc19fZ3JhcGhfXyR7a2V5fWAsIHRydWUpO1xuICAgICAgICBzdmcuYXR0cignd2lkdGgnLCBtb2RlbC5nZXQoJ3dpZHRoJykgKyBtb2RlbC5nZXQoJ21hcmdpbnMubGVmdCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLnJpZ2h0JykpO1xuICAgICAgICBzdmcuYXR0cignaGVpZ2h0JywgbW9kZWwuZ2V0KCdoZWlnaHQnKSArIG1vZGVsLmdldCgnbWFyZ2lucy50b3AnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5ib3R0b20nKSk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldID0gc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHttb2RlbC5nZXQoJ21hcmdpbnMubGVmdCcpfSwgJHttb2RlbC5nZXQoJ21hcmdpbnMudG9wJyl9KWApO1xuICAgICAgfVxuICAgICAgdGhpcy5zY2FsZXMgPSB7fTtcbiAgICAgIHRoaXMuc2NhbGVzLnggPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFswLCBtb2RlbC5nZXQoJ3dpZHRoJyldKTtcbiAgICAgIHRoaXMuc2NhbGVzLnkgPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFttb2RlbC5nZXQoJ2hlaWdodCcpLCAwXSk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzd2l0Y2ggKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSBcImRhdGFcIjpcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0dXAoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwKG1vZGVsKSB7XG4gICAgICB0aGlzLnNjYWxlcy54LmRvbWFpbihbMCwgT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCB2YWwucnVuVGltZSksIDApXSk7XG5cbiAgICAgIGxldCBtYXhWYWx1ZSA9IE9iamVjdC52YWx1ZXMobW9kZWwuZ2V0KCdkYXRhJykpLnJlZHVjZSgoYWNjLCB2YWwpID0+IE1hdGgubWF4KGFjYywgdmFsLm1heFZhbHVlKSwgMCk7XG4gICAgICB0aGlzLnNjYWxlcy55LmRvbWFpbihbbW9kZWwuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcgPyAtbWF4VmFsdWUgOiAwLCBtYXhWYWx1ZV0pO1xuICAgICAgdGhpcy5heGVzID0ge1xuICAgICAgICB4OiBkMy5heGlzQm90dG9tKCkuc2NhbGUodGhpcy5zY2FsZXMueCksXG4gICAgICAgIHk6IGQzLmF4aXNMZWZ0KCkuc2NhbGUodGhpcy5zY2FsZXMueSlcbiAgICAgIH07XG4gICAgICB0aGlzLmJncyA9IHt9O1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XS5zZWxlY3RBbGwoJyonKS5yZW1vdmUoKTtcblxuICAgICAgICB0aGlzLnN2Z3Nba2V5XS5zZWxlY3QoJy50aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGltZS1zZXJpZXNfX2dyYXBoX19heGlzIHRpbWUtc2VyaWVzX19ncmFwaF9fYXhpcy14JylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21vZGVsLmdldCgnaGVpZ2h0Jyl9KWApXG4gICAgICAgICAgLmNhbGwodGhpcy5heGVzLngpXG4gICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGltZS1zZXJpZXNfX2dyYXBoX19heGlzLWxhYmVsJylcbiAgICAgICAgICAgIC50ZXh0KCdUaW1lIFtzZWNvbmRzXScpXG4gICAgICAgICAgICAuYXR0cigneCcsIG1vZGVsLmdldCgnd2lkdGgnKSAvIDIpXG4gICAgICAgICAgICAuYXR0cigneScsIDMwKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGltZS1zZXJpZXNfX2dyYXBoX19heGlzIHRpbWUtc2VyaWVzX19ncmFwaF9fYXhpcy15JylcbiAgICAgICAgICAuY2FsbCh0aGlzLmF4ZXMueSlcbiAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMtbGFiZWwnKVxuICAgICAgICAgICAgLnRleHQoYEF2ZyBTcGVlZCBbbWljcm9tZXRlcnMgLyBzZWNvbmRdYClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAncm90YXRlKC05MCknKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAtMzApXG4gICAgICAgICAgICAuYXR0cigneCcsIC1tb2RlbC5nZXQoJ2hlaWdodCcpIC8gMik7XG5cbiAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjb21wb25lbnQtc3BlZWRfX2dyYXBoX190aXRsZScpXG4gICAgICAgICAgICAudGV4dCgnQXZlcmFnZSBmb3J3YXJkIHNwZWVkIChkaXN0YW5jZSBjb3ZlcmVkIHBlciBzZWNvbmQpJylcbiAgICAgICAgICAgIC5hdHRyKCd5JywgLTEwKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyKTtcblxuICAgICAgICB0aGlzLmJnc1trZXldID0gdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGltZS1zZXJpZXNfX2dyYXBoX19iYWNrZ3JvdW5kJyk7XG5cbiAgICAgICAgZm9yIChsZXQgbGF5ZXIgaW4gbW9kZWwuZ2V0KCdkYXRhJykpIHtcbiAgICAgICAgICBpZiAoIW1vZGVsLmdldChgZGF0YS4ke2xheWVyfS5zaG93TGF5ZXJgKSkge2NvbnRpbnVlfVxuICAgICAgICAgIGxldCBncmFwaGRhdGEgPSBtb2RlbC5nZXQoYGRhdGEuJHtsYXllcn0uZ3JhcGhzLiR7a2V5fWApLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5tZWFuKTtcbiAgICAgICAgICBsZXQgY29sb3IgPSBtb2RlbC5nZXQoYGRhdGEuJHtsYXllcn0uY29sb3JgKVxuICAgICAgICAgIGlmIChtb2RlbC5nZXQoJ3N0ZEJhbmQnKSkge1xuICAgICAgICAgICAgbGV0IHN0ZCA9IGQzLmFyZWEoKVxuICAgICAgICAgICAgICAueCgoZCkgPT4gdGhpcy5zY2FsZXMueChkLnRpbWUpKVxuICAgICAgICAgICAgICAueTAoKGQpID0+IHRoaXMuc2NhbGVzLnkoZC5tZWFuIC0gZC5zKSlcbiAgICAgICAgICAgICAgLnkxKChkKSA9PiB0aGlzLnNjYWxlcy55KGQubWVhbiArIGQucykpO1xuICAgICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgICAgLmRhdHVtKGdyYXBoZGF0YSlcbiAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYHRpbWUtc2VyaWVzX19ncmFwaF9fc3RkIHRpbWUtc2VyaWVzX19ncmFwaF9fc3RkX18ke2xheWVyfWApXG4gICAgICAgICAgICAgIC5hdHRyKCdzdHlsZScsIGNvbG9yID8gYGZpbGw6ICMke2NvbG9yLnRvU3RyaW5nKDE2KX1gIDogbnVsbClcbiAgICAgICAgICAgICAgLmF0dHIoJ2QnLCBzdGQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEZ1bmN0aW9uIHRvIGJlIHVzZWQgZm9yIHBsb3R0aW5nXG4gICAgICAgICAgLy8gSXQgZGVmaW5lcyB0aGF0IGl0IHRha2VzIGZvciBlYWNoIGRhdGEgcG9pbnQgdGhlIHRpbWUgZWxlbWVudCBhbmQgdGhlIG1lYW4gYW5kIHBsb3RzIGl0IGluIHgseS5cbiAgICAgICAgICAvLyAuZGF0dW0oZ3JhcGhkYXRhKTogVGhhdCdzIHRoZSBkYXRhIG9uIHdoaWNoIHRvIGFwcGx5IHRoZSBmdW5jdGlvbi5cbiAgICAgICAgICAvLyAuYXR0cigpOiBDaGFyYWN0ZXJpc3RpY3Mgb2YgdGhlIHN2Zy5cbiAgICAgICAgICAvLyAuYXR0cignZCcsbGluZSkgaXMgd2hlcmUgdGhlIGRhdHVtIGdldHMgdHJhbnNmb3JtZWQgaW50byB0aGUgbGluZS5cbiAgICAgICAgICBsZXQgbGluZSA9IGQzLmxpbmUoKVxuICAgICAgICAgICAgLngoKGQpID0+IHRoaXMuc2NhbGVzLngoZC50aW1lKSlcbiAgICAgICAgICAgIC55KChkKSA9PiB0aGlzLnNjYWxlcy55KGQubWVhbikpXG4gICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5kYXR1bShncmFwaGRhdGEpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBgdGltZS1zZXJpZXNfX2dyYXBoX19saW5lIHRpbWUtc2VyaWVzX19ncmFwaF9fbGluZV9fJHtsYXllcn1gKVxuICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgY29sb3IgPyBgc3Ryb2tlOiAjJHtjb2xvci50b1N0cmluZygxNil9YCA6IG51bGwpXG4gICAgICAgICAgICAuYXR0cignZCcsIGxpbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgbGluZXMgYXQgdGhlIGRpZmZlcmVudCB0aW1lIGludGVydmFscy5cbiAgICAgICAgaWYgKG1vZGVsLmdldCgnbGlnaHRDb25maWcnKSkge1xuXG4gICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKFwic3ZnOmRlZnNcIilcbiAgICAgICAgICAgXHQuYXBwZW5kKFwic3ZnOm1hcmtlclwiKVxuICAgICAgICAgICBcdC5hdHRyKFwiaWRcIiwgYGFycm93X19saWdodGApXG4gICAgICAgICAgIFx0LmF0dHIoXCJyZWZYXCIsIDApXG4gICAgICAgICAgIFx0LmF0dHIoXCJyZWZZXCIsIDIpXG4gICAgICAgICAgIFx0LmF0dHIoXCJtYXJrZXJXaWR0aFwiLCA0KVxuICAgICAgICAgICBcdC5hdHRyKFwibWFya2VySGVpZ2h0XCIsIDQpXG4gICAgICAgICAgIFx0LmF0dHIoXCJvcmllbnRcIiwgXCJhdXRvXCIpXG4gICAgICAgICAgIFx0LmFwcGVuZChcInN2ZzpwYXRoXCIpXG4gICAgICAgICAgIFx0LmF0dHIoXCJkXCIsIFwiTTAsMCBMMCw0IEw0LDIgelwiKVxuICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsJ3JnYigyMzUsMTYwLDE3KScpO1xuXG4gICAgICAgICAgdmFyIGV4cER1cmF0aW9uID0gbW9kZWwuZ2V0KCdsaWdodENvbmZpZycpLnJlZHVjZSgoYWNjLGN1cnIpID0+IE1hdGgubWF4KGFjYyxjdXJyLnRpbWVFbmQpLDApO1xuXG4gICAgICAgICAgZm9yIChsZXQgY29uZmlnIG9mIG1vZGVsLmdldCgnbGlnaHRDb25maWcnKSkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy50aW1lU3RhcnQgIT0gMCkge1xuICAgICAgICAgICAgICB0aGlzLnN2Z3Nba2V5XS5hcHBlbmQoXCJsaW5lXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvbXBvbmVudC1zcGVlZF9fZ3JhcGhfX2xpZ2h0LXRpbWUnKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieDFcIiwgY29uZmlnLnRpbWVTdGFydCAqIG1vZGVsLmdldCgnd2lkdGgnKSAvIGV4cER1cmF0aW9uKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieTFcIiwgbW9kZWwuZ2V0KCdoZWlnaHQnKSlcbiAgICAgICAgICAgICAgICAuYXR0cihcIngyXCIsIGNvbmZpZy50aW1lU3RhcnQgKiBtb2RlbC5nZXQoJ3dpZHRoJykgLyBleHBEdXJhdGlvbilcbiAgICAgICAgICAgICAgICAuYXR0cihcInkyXCIsMClcbiAgICAgICAgICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLDIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29uZmlnLmxpZ2h0RGlyWzBdICE9IDAgfHwgY29uZmlnLmxpZ2h0RGlyWzFdICE9IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKFwibGluZVwiKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvbXBvbmVudC1zcGVlZF9fZ3JhcGhfX2xpZ2h0LWFycm93JylcbiAgICAgICAgICAgICAgICAgIC5hdHRyKFwieDFcIiwoY29uZmlnLnRpbWVFbmQgKyBjb25maWcudGltZVN0YXJ0KSAvIDIgKiBtb2RlbC5nZXQoJ3dpZHRoJykgLyBleHBEdXJhdGlvbiArIDIwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ5MVwiLCAxMClcbiAgICAgICAgICAgICAgICAgIC5hdHRyKFwieDJcIiwoY29uZmlnLnRpbWVFbmQgKyBjb25maWcudGltZVN0YXJ0KSAvIDIgICogbW9kZWwuZ2V0KCd3aWR0aCcpIC8gZXhwRHVyYXRpb24gKyAxMCAqIGNvbmZpZy5saWdodERpclswXSArIDIwKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCAxMCArIDEwICogY29uZmlnLmxpZ2h0RGlyWzFdKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwyKVxuICAgICAgICAgICAgICAgICAgLmF0dHIoXCJtYXJrZXItZW5kXCIsYHVybCgjYXJyb3dfX2xpZ2h0KWApXG4gICAgICAgICAgICAgIC8vdmFyIGxpZ2h0VmFsdWUgPSBjb25maWcubGVmdCE9MD8gY29uZmlnLmxlZnQ6IChjb25maWcucmlnaHQhPTA/IGNvbmZpZy5yaWdodCA6IChjb25maWcudG9wIT0wPyA6IGNvbmZpZy50b3AgOiAoY29uZmlnLmJvdHRvbSE9MD8gY29uZmlnLmJvdHRvbSA6IDApKSk7XG4gICAgICAgICAgICAgIHZhciBsaWdodFZhbHVlID0gTWF0aC5zcXJ0KE1hdGgucG93KGNvbmZpZy5sZWZ0LDIpICsgTWF0aC5wb3coY29uZmlnLnJpZ2h0LDIpICsgTWF0aC5wb3coY29uZmlnLnRvcCwyKSArIE1hdGgucG93KGNvbmZpZy5ib3R0b20sMikpO1xuICAgICAgICAgICAgICBsaWdodFZhbHVlID0gTWF0aC5yb3VuZChsaWdodFZhbHVlKTtcbiAgICAgICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY29tcG9uZW50LXNwZWVkX19ncmFwaF9fbGlnaHQtbGFiZWwnKVxuICAgICAgICAgICAgICAgIC50ZXh0KGAke2xpZ2h0VmFsdWV9JSBpbiBgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgMTUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoY29uZmlnLnRpbWVFbmQgKyBjb25maWcudGltZVN0YXJ0KSAvIDIgKiBtb2RlbC5nZXQoJ3dpZHRoJykgLyBleHBEdXJhdGlvbiAtIDIwKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcubGVmdCAhPSAwICYmIGNvbmZpZy5yaWdodCAhPSAwICYmIGNvbmZpZy50b3AgIT0gMCAmJiBjb25maWcuYm90dG9tICE9IDApe1xuICAgICAgICAgICAgICB0aGlzLnN2Z3Nba2V5XS5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjb21wb25lbnQtc3BlZWRfX2dyYXBoX19saWdodC1sYWJlbCcpXG4gICAgICAgICAgICAgICAgLnRleHQoYCR7Y29uZmlnLmxlZnR9JSBmcm9tIGFsbCBkaXIuYClcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIDE1KVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgKGNvbmZpZy50aW1lRW5kICsgY29uZmlnLnRpbWVTdGFydCkgLyAyICogbW9kZWwuZ2V0KCd3aWR0aCcpIC8gZXhwRHVyYXRpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcubGVmdCAhPSAwICYmIGNvbmZpZy5yaWdodCAhPSAwICYmIGNvbmZpZy50b3AgPT0gMCAmJiBjb25maWcuYm90dG9tID09IDApe1xuICAgICAgICAgICAgICB0aGlzLnN2Z3Nba2V5XS5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdjb21wb25lbnQtc3BlZWRfX2dyYXBoX19saWdodC1sYWJlbCcpXG4gICAgICAgICAgICAgICAgLnRleHQoYCR7Y29uZmlnLmxlZnR9JSBmcm9tIGxlZnQtcmlnaHRgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgMTUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoY29uZmlnLnRpbWVFbmQgKyBjb25maWcudGltZVN0YXJ0KSAvIDIgKiBtb2RlbC5nZXQoJ3dpZHRoJykgLyBleHBEdXJhdGlvbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5sZWZ0ID09IDAgJiYgY29uZmlnLnJpZ2h0ID09IDAgJiYgY29uZmlnLnRvcCAhPSAwICYmIGNvbmZpZy5ib3R0b20gIT0gMCl7XG4gICAgICAgICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvbXBvbmVudC1zcGVlZF9fZ3JhcGhfX2xpZ2h0LWxhYmVsJylcbiAgICAgICAgICAgICAgICAudGV4dChgJHtjb25maWcudG9wfSUgZnJvbSB0b3AtYm90dG9tYClcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIDE1KVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgKGNvbmZpZy50aW1lRW5kICsgY29uZmlnLnRpbWVTdGFydCkgLyAyICogbW9kZWwuZ2V0KCd3aWR0aCcpIC8gZXhwRHVyYXRpb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnY29tcG9uZW50LXNwZWVkX19ncmFwaF9fbGlnaHQtbGFiZWwnKVxuICAgICAgICAgICAgICAgIC50ZXh0KFwibm8gbGlnaHRcIilcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIDE1KVxuICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgKGNvbmZpZy50aW1lRW5kICsgY29uZmlnLnRpbWVTdGFydCkgLyAyICogbW9kZWwuZ2V0KCd3aWR0aCcpIC8gZXhwRHVyYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlKHRpbWVzdGFtcCwgbW9kZWwpIHtcbiAgICAgIGxldCBydW50aW1lID0gT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCB2YWwucnVuVGltZSksIDApO1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICBsZXQgdGltZWJhbmQgPSB0aGlzLmJnc1trZXldLnNlbGVjdEFsbCgnLnRpbWUtc2VyaWVzX19ncmFwaF9fdGltZS1iYW5kJylcbiAgICAgICAgICAuZGF0YShbdGltZXN0YW1wXSlcbiAgICAgICAgdGltZWJhbmQuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aW1lLXNlcmllc19fZ3JhcGhfX3RpbWUtYmFuZCcpXG4gICAgICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBtb2RlbC5nZXQoJ2hlaWdodCcpKVxuICAgICAgICAgIC5tZXJnZSh0aW1lYmFuZClcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMuc2NhbGVzLngoTWF0aC5taW4ocnVudGltZSwgTWF0aC5tYXgoMCwgZCAtIG1vZGVsLmdldCgnZFQnKSAvIDIpKSkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgPT4gdGhpcy5zY2FsZXMueChtb2RlbC5nZXQoJ2RUJykgKyBNYXRoLm1pbigwLCBkIC0gbW9kZWwuZ2V0KCdkVCcpIC8gMikgKyBNYXRoLm1pbigwLCBydW50aW1lIC0gZCAtIG1vZGVsLmdldCgnZFQnKSAvIDIpKSlcbiAgICAgICAgdGltZWJhbmQuZXhpdCgpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XS5zZWxlY3RBbGwoJy50aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX190aW1lLWJhbmQnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX19zdGQnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX19saW5lJykucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl19
