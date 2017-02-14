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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeSeriesView).call(this, tmpl || Template));

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

        this.scales.x.domain([0, model.get('data.runTime')]);

        this.scales.y.domain([model.get('mode') == 'component' ? -model.get('data.maxValue') : 0, model.get('data.maxValue')]);
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

          var graphdata = model.get('data.graphs.' + key).filter(function (item) {
            return item.mean;
          });

          if (model.get('stdBand')) {
            var std = d3.area().x(function (d) {
              return _this2.scales.x(d.time);
            }).y0(function (d) {
              return _this2.scales.y(d.mean - d.s);
            }).y1(function (d) {
              return _this2.scales.y(d.mean + d.s);
            });
            this.svgs[key].append('path').datum(graphdata).attr('class', 'time-series__graph__std').attr('d', std);
          }

          var line = d3.line().x(function (d) {
            return _this2.scales.x(d.time);
          }).y(function (d) {
            return _this2.scales.y(d.mean);
          });
          this.svgs[key].append('path').datum(graphdata).attr('class', 'time-series__graph__line').attr('d', line);
        }
      }
    }, {
      key: 'update',
      value: function update(timestamp, model) {
        var _this3 = this;

        for (var key in this.svgs) {
          var timeband = this.bgs[key].selectAll('.time-series__graph__time-band').data([timestamp]);
          timeband.enter().append('rect').attr('class', 'time-series__graph__time-band').attr('y', 0).attr('height', model.get('height')).merge(timeband).transition().duration(0).attr('x', function (d) {
            return _this3.scales.x(Math.min(model.get('data.runTime'), Math.max(0, d - model.get('dT') / 2)));
          }).attr('width', function (d) {
            return _this3.scales.x(model.get('dT') + Math.min(0, d - model.get('dT') / 2) + Math.min(0, model.get('data.runTime') - d - model.get('dT') / 2));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFVBQVUsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLEtBQUssUUFBUSxJQUFSLENBRlA7QUFBQSxNQUdFLFdBQVcsUUFBUSw2QkFBUixDQUhiO0FBS0EsVUFBUSw0QkFBUjs7QUFFQTtBQUFBOztBQUNFLDRCQUFZLEtBQVosRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxvR0FDakIsUUFBUSxRQURTOztBQUV2QixZQUFNLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxDQUF4Qjs7QUFFQSxZQUFNLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUssY0FBNUM7O0FBRUEsVUFBSSxNQUFNLEdBQU4sQ0FBVSxNQUFWLEtBQXFCLFdBQXpCLEVBQXNDO0FBQ3BDLGNBQUssSUFBTCxHQUFZO0FBQ1YsYUFBRyxJQURPO0FBRVYsYUFBRztBQUZPLFNBQVo7QUFJRCxPQUxELE1BS087QUFDTCxjQUFLLElBQUwsR0FBWTtBQUNWLGlCQUFPO0FBREcsU0FBWjtBQUdEO0FBQ0QsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBSyxJQUFyQixFQUEyQjtBQUN6QixZQUFJLE1BQU0sR0FBRyxNQUFILENBQVUsTUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLHFCQUFkLEVBQXFDLEdBQXJDLENBQXlDLENBQXpDLENBQVYsRUFBdUQsTUFBdkQsQ0FBOEQsS0FBOUQsQ0FBVjtBQUNBLFlBQUksT0FBSiwwQkFBbUMsR0FBbkMsRUFBMEMsSUFBMUM7QUFDQSxZQUFJLElBQUosQ0FBUyxPQUFULEVBQWtCLE1BQU0sR0FBTixDQUFVLE9BQVYsSUFBcUIsTUFBTSxHQUFOLENBQVUsY0FBVixDQUFyQixHQUFpRCxNQUFNLEdB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Q0FBVSxJQUFWLElBQWtCLENBQWxDLENBQXBDLENBQWQsQ0FBUDtBQUFBLFdBUGYsRUFRSyxJQVJMLENBUVUsT0FSVixFQVFtQixVQUFDLENBQUQ7QUFBQSxtQkFBTyxPQUFLLE1BQUwsQ0FBWSxDQUFaLENBQWMsTUFBTSxHQUFOLENBQVUsSUFBVixJQUFrQixLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSSxNQUFNLEdBQU4sQ0FBVSxJQUFWLElBQWtCLENBQWxDLENBQWxCLEdBQXlELEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxNQUFNLEdBQU4sQ0FBVSxjQUFWLElBQTRCLENBQTVCLEdBQWdDLE1BQU0sR0FBTixDQUFVLElBQVYsSUFBa0IsQ0FBOUQsQ0FBdkUsQ0FBUDtBQUFBLFdBUm5CO0FBU0EsbUJBQVMsSUFBVCxHQUFnQixNQUFoQjtBQUNEO0FBQ0Y7QUFqSEg7QUFBQTtBQUFBLDhCQW1IVTtBQUNOLGFBQUssSUFBSSxHQUFULElBQWdCLEtBQUssSUFBckIsRUFBMkI7QUFDekIsZUFBSyxJQUFMLENBQVUsR0FBVixFQUFlLFNBQWYsQ0FBeUIsMkJBQXpCLEVBQXNELE1BQXREO0FBQ0EsZUFBSyxJQUFMLENBQVUsR0FBVixFQUFlLFNBQWYsQ0FBeUIsZ0NBQXpCLEVBQTJELE1BQTNEO0FBQ0EsZUFBSyxJQUFMLENBQVUsR0FBVixFQUFlLFNBQWYsQ0FBeUIsMEJBQXpCLEVBQXFELE1BQXJEO0FBQ0EsZUFBSyxJQUFMLENBQVUsR0FBVixFQUFlLFNBQWYsQ0FBeUIsMkJBQXpCLEVBQXNELE1BQXREO0FBQ0Q7QUFDRjtBQTFISDs7QUFBQTtBQUFBLElBQW9DLE9BQXBDO0FBNEhELENBcElEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
