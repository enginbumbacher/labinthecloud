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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HistogramView).call(this, tmpl || Template));

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
        switch (evt.data.path) {
          case "histogram":
            this.render(evt.currentTarget);
            break;
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
        var binSample = model.get('data.intervals')[0].bins;
        if (model.get('mode') == 'component') {
          binSample = binSample.x;
        } else {
          binSample = binSample.total;
        }
        this.scales.x.domain(binSample.map(function (d) {
          return Math.round((d.vStart + d.vEnd) / 2);
        }));
        this.scales.y.domain([0, model.get('data.maxBinValue')]);
        this.axes = {
          x: d3.axisBottom().scale(this.scales.x),
          y: d3.axisLeft().scale(this.scales.y).ticks(5)
        };
        for (var key in this.svgs) {
          this.svgs[key].select('.histogram__graph__axis').remove();
          this.svgs[key].append('g').attr('class', 'histogram__graph__axis histogram__graph__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(this.axes.x).append('text').attr('class', 'histogram__graph__axis-label').text('Speed (' + key + ')').attr('x', model.get('width') / 2).attr('y', 30);
          this.svgs[key].append('g').attr('class', 'histogram__graph__axis histogram__graph__axis-y').call(this.axes.y).append('text').attr('class', 'histogram__graph__axis-label').text('Frequency').attr('y', -30).attr('x', -model.get('height') / 2).attr('transform', 'rotate(-90)');
        }
      }
    }, {
      key: 'render',
      value: function render(model) {
        var _this2 = this;

        var measureCount = 0;
        for (var key in model.get('histogram')) {
          var bins = model.get('histogram')[key];
          var data = this.svgs[key].selectAll('.histogram__bar').data(bins);
          data.enter().append('rect').attr('class', 'histogram__bar').attr('x', function (d, i) {
            return _this2.scales.x(Math.round((d.vStart + d.vEnd) / 2));
          }).attr('width', this.scales.x.bandwidth()).attr('y', this.scales.y(0)).merge(data).transition().ease(d3.easeLinear).attr('y', function (d) {
            return _this2.scales.y(d.frequency);
          }).attr('height', function (d) {
            return model.get('height') - _this2.scales.y(d.frequency);
          });
          data.exit().remove();
          measureCount = bins.reduce(function (v, c) {
            return v + c.frequency;
          }, 0);
        }
        this.$el.find('.histogram__meta').html(measureCount + ' samples');
      }
    }, {
      key: 'reset',
      value: function reset() {
        for (var key in this.svgs) {
          this.svgs[key].selectAll('.histogram__graph__axis').remove();
          this.svgs[key].selectAll('.histogram__bar').remove();
        }
        this.$el.find(".histogram__meta").html('0 samples');
      }
    }]);

    return HistogramView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sVUFBVSxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsS0FBSyxRQUFRLElBQVIsQ0FGUDtBQUFBLE1BR0UsV0FBVyxRQUFRLDRCQUFSLENBSGI7O0FBTUEsVUFBUSwyQkFBUjs7QUFFQTtBQUFBOztBQUNFLDJCQUFZLEtBQVosRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxtR0FDakIsUUFBUSxRQURTOztBQUV2QixZQUFNLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxDQUF4Qjs7QUFFQSxZQUFNLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUssY0FBNUM7O0FBRUEsVUFBSSxNQUFNLEdBQU4sQ0FBVSxNQUFWLEtBQXFCLFdBQXpCLEVBQXNDO0FBQ3BDLGNBQUssSUFBTCxHQUFZO0FBQ1YsYUFBRyxJQURPO0FBRVYsYUFBRztBQUZPLFNBQVo7QUFJRCxPQUxELE1BS087QUFDTCxjQUFLLElBQUwsR0FBWTtBQUNWLGlCQUFPO0FBREcsU0FBWjtBQUdEO0FBQ0QsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBSyxJQUFyQixFQUEyQjtBQUN6QixZQUFJLE1BQU0sR0FBRyxNQUFILENBQVUsTUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLG1CQUFkLEVBQW1DLEdBQW5DLENBQXVDLENBQXZDLENBQVYsRUFBcUQsTUFBckQsQ0FBNEQsS0FBNUQsQ0FBVjtBQUNBLFlBQUksT0FBSix3QkFBaUMsR0FBakMsRUFBd0MsSUFBeEM7QUFDQSxZQUFJLElBQUosQ0FBUyxPQUFULEVBQWtCLE1BQU0sR0FBTixDQUFVLE9BQVYsSUFBcUIsTUFBTSxHQUFOLENBQVUsY0FBVixDQUFyQixHQUFpRCxNQUFNLEdB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
