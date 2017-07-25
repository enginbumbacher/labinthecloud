'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      d3 = require('d3'),
      Template = require('text!./histogramgraph.html');

  require('link!./histogramgraph.css');

  return function (_DomView) {
    _inherits(HistogramView, _DomView);

    function HistogramView(model, tmpl) {
      _classCallCheck(this, HistogramView);

      var _this = _possibleConstructorReturn(this, (HistogramView.__proto__ || Object.getPrototypeOf(HistogramView)).call(this, tmpl || Template));

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
        var svg = d3.select(_this.$el.find('.histogram__graph').get(0)).append('svg');
        svg.classed('histogram__graph__' + key, true);
        svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
        svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
        _this.svgs[key] = svg.append('g').attr('transform', 'translate(' + model.get('margins.left') + ', ' + model.get('margins.top') + ')');
      }
      _this.scales = {};
      _this.scales.x = d3.scaleBand().range([0, model.get('width')]).padding(0.1);
      _this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);
      return _this;
    }

    _createClass(HistogramView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == 'data') {
          this.setup(evt.currentTarget);
        } else if (evt.data.path.match(/^histogram/)) {
          this.render(evt.currentTarget);
        }
      }
    }, {
      key: 'setup',
      value: function setup(model) {
        if (Object.values(model.get('data')).length) {
          this.reset();
          var binSample = Object.values(model.get('data'))[0].intervals[0].bins;
          if (model.get('mode') == 'component') {
            binSample = binSample.x;
          } else {
            binSample = binSample.total;
          }
          this.scales.x.domain(binSample.map(function (d) {
            return Math.round((d.vStart + d.vEnd) / 2);
          }));
          // this.scales.y.domain([0, Object.values(model.get('data')).reduce((acc, val) => Math.max(acc, val.maxBinValue), 0)]);
          this.scales.y.domain([0, 100]);
          this.axes = {
            x: d3.axisBottom().scale(this.scales.x),
            y: d3.axisLeft().scale(this.scales.y).ticks(5)
          };
          for (var key in this.svgs) {
            this.svgs[key].select('.histogram__graph__axis').remove();
            this.svgs[key].append('g').attr('class', 'histogram__graph__axis histogram__graph__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(this.axes.x).append('text').attr('class', 'histogram__graph__axis-label').text('Speed (' + key + ')').attr('x', model.get('width') / 2).attr('y', 30);
            this.svgs[key].append('g').attr('class', 'histogram__graph__axis histogram__graph__axis-y').call(this.axes.y).append('text').attr('class', 'histogram__graph__axis-label').text('Frequency (% total)').attr('y', -30).attr('x', -model.get('height') / 2).attr('transform', 'rotate(-90)');
          }
        } else {
          this.reset();
        }
      }
    }, {
      key: 'render',
      value: function render(model) {
        var _this2 = this;

        var measureCount = 0;
        for (var layer in model.get('histogram')) {
          for (var key in model.get('histogram.' + layer)) {
            var bins = model.get('histogram.' + layer + '.' + key);
            var data = this.svgs[key].selectAll('.histogram__bar__' + layer).data(bins);
            var color = model.get('data.' + layer + '.color');
            data.enter().append('rect').attr('class', 'histogram__bar histogram__bar__' + layer).attr('x', function (d, i) {
              return _this2.scales.x(Math.round((d.vStart + d.vEnd) / 2));
            }).attr('width', this.scales.x.bandwidth()).attr('y', this.scales.y(0)).attr('style', color ? 'fill: #' + color.toString(16) : null).merge(data).transition().ease(d3.easeLinear).attr('y', function (d) {
              return _this2.scales.y(d.value * 100);
            }).attr('height', function (d) {
              return model.get('height') - _this2.scales.y(d.value * 100);
            });
            data.exit().remove();
            measureCount = bins.reduce(function (v, c) {
              return v + c.frequency;
            }, 0);
          }
          this.$el.find('.histogram__meta__' + layer).html(measureCount + ' samples');
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        for (var key in this.svgs) {
          this.svgs[key].selectAll('.histogram__graph__axis').remove();
          this.svgs[key].selectAll('.histogram__bar').remove();
        }
        this.$el.find(".histogram__meta span").html('');
      }
    }]);

    return HistogramView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVXRpbHMiLCJkMyIsIlRlbXBsYXRlIiwibW9kZWwiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxDaGFuZ2UiLCJnZXQiLCJzdmdzIiwieCIsInkiLCJ0b3RhbCIsImtleSIsInN2ZyIsInNlbGVjdCIsIiRlbCIsImZpbmQiLCJhcHBlbmQiLCJjbGFzc2VkIiwiYXR0ciIsInNjYWxlcyIsInNjYWxlQmFuZCIsInJhbmdlIiwicGFkZGluZyIsInNjYWxlTGluZWFyIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJzZXR1cCIsImN1cnJlbnRUYXJnZXQiLCJtYXRjaCIsInJlbmRlciIsIk9iamVjdCIsInZhbHVlcyIsImxlbmd0aCIsInJlc2V0IiwiYmluU2FtcGxlIiwiaW50ZXJ2YWxzIiwiYmlucyIsImRvbWFpbiIsIm1hcCIsImQiLCJNYXRoIiwicm91bmQiLCJ2U3RhcnQiLCJ2RW5kIiwiYXhlcyIsImF4aXNCb3R0b20iLCJzY2FsZSIsImF4aXNMZWZ0IiwidGlja3MiLCJyZW1vdmUiLCJjYWxsIiwidGV4dCIsIm1lYXN1cmVDb3VudCIsImxheWVyIiwic2VsZWN0QWxsIiwiY29sb3IiLCJlbnRlciIsImkiLCJiYW5kd2lkdGgiLCJ0b1N0cmluZyIsIm1lcmdlIiwidHJhbnNpdGlvbiIsImVhc2UiLCJlYXNlTGluZWFyIiwidmFsdWUiLCJleGl0IiwicmVkdWNlIiwidiIsImMiLCJmcmVxdWVuY3kiLCJodG1sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFR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SzhCLE1BQUwsQ0FBWSxVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxxQkFBVUQsSUFBSUMsRUFBRUMsU0FBaEI7QUFBQSxhQUFaLEVBQXVDLENBQXZDLENBQWY7QUFDRDtBQUNELGVBQUt4RCxHQUFMLENBQVNDLElBQVQsd0JBQW1DdUMsS0FBbkMsRUFBNENpQixJQUE1QyxDQUFvRGxCLFlBQXBEO0FBQ0Q7QUFDRjtBQXpHSDtBQUFBO0FBQUEsOEJBMkdVO0FBQ04sYUFBSyxJQUFJMUMsR0FBVCxJQUFnQixLQUFLSixJQUFyQixFQUEyQjtBQUN6QixlQUFLQSxJQUFMLENBQVVJLEdBQVYsRUFBZTRDLFNBQWYsQ0FBeUIseUJBQXpCLEVBQW9ETCxNQUFwRDtBQUNBLGVBQUszQyxJQUFMLENBQVVJLEdBQVYsRUFBZTRDLFNBQWYsQ0FBeUIsaUJBQXpCLEVBQTRDTCxNQUE1QztBQUNEO0FBQ0QsYUFBS3BDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHVCQUFkLEVBQXVDd0QsSUFBdkMsQ0FBNEMsRUFBNUM7QUFDRDtBQWpISDs7QUFBQTtBQUFBLElBQW1DMUUsT0FBbkM7QUFtSEQsQ0E1SEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2hpc3RvZ3JhbWdyYXBoL3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
