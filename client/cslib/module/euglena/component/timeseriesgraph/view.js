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
          this.svgs[key].select('.time-series__graph__axis').remove();
          this.svgs[key].append('g').attr('class', 'time-series__graph__axis time-series__graph__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(this.axes.x).append('text').attr('class', 'time-series__graph__axis-label').text('Time').attr('x', model.get('width') / 2).attr('y', 30);
          this.svgs[key].append('g').attr('class', 'time-series__graph__axis time-series__graph__axis-y').call(this.axes.y).append('text').attr('class', 'time-series__graph__axis-label').text('Average Speed (' + key + ')').attr('transform', 'rotate(-90)').attr('y', -30).attr('x', -model.get('height') / 2);

          this.bgs[key] = this.svgs[key].append('g').attr('class', 'time-series__graph__background');

          for (var layer in model.get('data')) {
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

            var line = d3.line().x(function (d) {
              return _this2.scales.x(d.time);
            }).y(function (d) {
              return _this2.scales.y(d.mean);
            });
            this.svgs[key].append('path').datum(graphdata).attr('class', 'time-series__graph__line time-series__graph__line__' + layer).attr('style', color ? 'stroke: #' + color.toString(16) : null).attr('d', line);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiZDMiLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiZ2V0Iiwic3ZncyIsIngiLCJ5IiwidG90YWwiLCJrZXkiLCJzdmciLCJzZWxlY3QiLCIkZWwiLCJmaW5kIiwiYXBwZW5kIiwiY2xhc3NlZCIsImF0dHIiLCJzY2FsZXMiLCJzY2FsZUxpbmVhciIsInJhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsInJlc2V0Iiwic2V0dXAiLCJjdXJyZW50VGFyZ2V0IiwiZG9tYWluIiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwidmFsIiwiTWF0aCIsIm1heCIsInJ1blRpbWUiLCJtYXhWYWx1ZSIsImF4ZXMiLCJheGlzQm90dG9tIiwic2NhbGUiLCJheGlzTGVmdCIsImJncyIsInJlbW92ZSIsImNhbGwiLCJ0ZXh0IiwibGF5ZXIiLCJncmFwaGRhdGEiLCJmaWx0ZXIiLCJpdGVtIiwibWVhbiIsImNvbG9yIiwic3RkIiwiYXJlYSIsImQiLCJ0aW1lIiwieTAiLCJzIiwieTEiLCJkYXR1bSIsInRvU3RyaW5nIiwibGluZSIsInRpbWVzdGFtcCIsInJ1bnRpbWUiLCJ0aW1lYmFuZCIsInNlbGVjdEFsbCIsImVudGVyIiwibWVyZ2UiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJtaW4iLCJleGl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLElBQVIsQ0FGUDtBQUFB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a0IsQ0FBbEMsQ0FBbEIsQ0FBZCxDQUFQO0FBQUEsV0FQZixFQVFLWSxJQVJMLENBUVUsT0FSVixFQVFtQixVQUFDcUMsQ0FBRDtBQUFBLG1CQUFPLE9BQUtwQyxNQUFMLENBQVlYLENBQVosQ0FBY1AsTUFBTUssR0FBTixDQUFVLElBQVYsSUFBa0I2QixLQUFLb0MsR0FBTCxDQUFTLENBQVQsRUFBWWhCLElBQUl0RCxNQUFNSyxHQUFOLENBQVUsSUFBVixJQUFrQixDQUFsQyxDQUFsQixHQUF5RDZCLEtBQUtvQyxHQUFMLENBQVMsQ0FBVCxFQUFZUCxVQUFVVCxDQUFWLEdBQWN0RCxNQUFNSyxHQUFOLENBQVUsSUFBVixJQUFrQixDQUE1QyxDQUF2RSxDQUFQO0FBQUEsV0FSbkI7QUFTQTJELG1CQUFTTyxJQUFULEdBQWdCNUIsTUFBaEI7QUFDRDtBQUNGO0FBeEhIO0FBQUE7QUFBQSw4QkEwSFU7QUFDTixhQUFLLElBQUlqQyxHQUFULElBQWdCLEtBQUtKLElBQXJCLEVBQTJCO0FBQ3pCLGVBQUtBLElBQUwsQ0FBVUksR0FBVixFQUFldUQsU0FBZixDQUF5QiwyQkFBekIsRUFBc0R0QixNQUF0RDtBQUNBLGVBQUtyQyxJQUFMLENBQVVJLEdBQVYsRUFBZXVELFNBQWYsQ0FBeUIsZ0NBQXpCLEVBQTJEdEIsTUFBM0Q7QUFDQSxlQUFLckMsSUFBTCxDQUFVSSxHQUFWLEVBQWV1RCxTQUFmLENBQXlCLDBCQUF6QixFQUFxRHRCLE1BQXJEO0FBQ0EsZUFBS3JDLElBQUwsQ0FBVUksR0FBVixFQUFldUQsU0FBZixDQUF5QiwyQkFBekIsRUFBc0R0QixNQUF0RDtBQUNEO0FBQ0Y7QUFqSUg7O0FBQUE7QUFBQSxJQUFvQy9DLE9BQXBDO0FBbUlELENBM0lEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
