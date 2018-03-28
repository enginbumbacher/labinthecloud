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
          if (!model.get('data.' + layer + '.showLayer')) {
            continue;
          }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVXRpbHMiLCJkMyIsIlRlbXBsYXRlIiwibW9kZWwiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxDaGFuZ2UiLCJnZXQiLCJzdmdzIiwieCIsInkiLCJ0b3RhbCIsImtleSIsInN2ZyIsInNlbGVjdCIsIiRlbCIsImZpbmQiLCJhcHBlbmQiLCJjbGFzc2VkIiwiYXR0ciIsInNjYWxlcyIsInNjYWxlQmFuZCIsInJhbmdlIiwicGFkZGluZyIsInNjYWxlTGluZWFyIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJzZXR1cCIsImN1cnJlbnRUYXJnZXQiLCJtYXRjaCIsInJlbmRlciIsIk9iamVjdCIsInZhbHVlcyIsImxlbmd0aCIsInJlc2V0IiwiYmluU2FtcGxlIiwiaW50ZXJ2YWxzIiwiYmlucyIsImRvbWFpbiIsIm1hcCIsImQiLCJNYXRoIiwicm91bmQiLCJ2U3RhcnQiLCJ2RW5kIiwiYXhlcyIsImF4aXNCb3R0b20iLCJzY2FsZSIsImF4aXNMZWZ0IiwidGlja3MiLCJyZW1vdmUiLCJjYWxsIiwidGV4dCIsIm1lYXN1cmVDb3VudCIsImxheWVyIiwic2VsZWN0QWxsIiwiY29sb3IiLCJlbnRlciIsImkiLCJiYW5kd2lkdGgiLCJ0b1N0cmluZyIsIm1lcmdlIiwidHJhbnNpdGlvbiIsImVhc2UiLCJlYXNlTGluZWFyIiwidmFsdWUiLCJleGl0IiwicmVkdWNlIiwidiIsImMiLCJmcmVxdWVuY3kiLCJodG1sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFR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QUE3QjtBQUFBLGFBWHBCO0FBWUF4QyxpQkFBS3lDLElBQUwsR0FBWWhCLE1BQVo7QUFDQUcsMkJBQWVoQixLQUFLOEIsTUFBTCxDQUFZLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLHFCQUFVRCxJQUFJQyxFQUFFQyxTQUFoQjtBQUFBLGFBQVosRUFBdUMsQ0FBdkMsQ0FBZjtBQUNEO0FBQ0QsZUFBS3hELEdBQUwsQ0FBU0MsSUFBVCx3QkFBbUN1QyxLQUFuQyxFQUE0Q2lCLElBQTVDLENBQW9EbEIsWUFBcEQ7QUFDRDtBQUNGO0FBMUdIO0FBQUE7QUFBQSw4QkE0R1U7QUFDTixhQUFLLElBQUkxQyxHQUFULElBQWdCLEtBQUtKLElBQXJCLEVBQTJCO0FBQ3pCLGVBQUtBLElBQUwsQ0FBVUksR0FBVixFQUFlNEMsU0FBZixDQUF5Qix5QkFBekIsRUFBb0RMLE1BQXBEO0FBQ0EsZUFBSzNDLElBQUwsQ0FBVUksR0FBVixFQUFlNEMsU0FBZixDQUF5QixpQkFBekIsRUFBNENMLE1BQTVDO0FBQ0Q7QUFDRCxhQUFLcEMsR0FBTCxDQUFTQyxJQUFULENBQWMsdUJBQWQsRUFBdUN3RCxJQUF2QyxDQUE0QyxFQUE1QztBQUNEO0FBbEhIOztBQUFBO0FBQUEsSUFBbUMxRSxPQUFuQztBQW9IRCxDQTdIRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvaGlzdG9ncmFtZ3JhcGgvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBkMyA9IHJlcXVpcmUoJ2QzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vaGlzdG9ncmFtZ3JhcGguaHRtbCcpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vaGlzdG9ncmFtZ3JhcGguY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEhpc3RvZ3JhbVZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJ10pXG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpO1xuXG4gICAgICBpZiAobW9kZWwuZ2V0KCdtb2RlJykgPT0gXCJjb21wb25lbnRcIikge1xuICAgICAgICB0aGlzLnN2Z3MgPSB7XG4gICAgICAgICAgeDogbnVsbCxcbiAgICAgICAgICB5OiBudWxsXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3ZncyA9IHtcbiAgICAgICAgICB0b3RhbDogbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5zdmdzKSB7XG4gICAgICAgIGxldCBzdmcgPSBkMy5zZWxlY3QodGhpcy4kZWwuZmluZCgnLmhpc3RvZ3JhbV9fZ3JhcGgnKS5nZXQoMCkpLmFwcGVuZCgnc3ZnJyk7XG4gICAgICAgIHN2Zy5jbGFzc2VkKGBoaXN0b2dyYW1fX2dyYXBoX18ke2tleX1gLCB0cnVlKTtcbiAgICAgICAgc3ZnLmF0dHIoJ3dpZHRoJywgbW9kZWwuZ2V0KCd3aWR0aCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5yaWdodCcpKTtcbiAgICAgICAgc3ZnLmF0dHIoJ2hlaWdodCcsIG1vZGVsLmdldCgnaGVpZ2h0JykgKyBtb2RlbC5nZXQoJ21hcmdpbnMudG9wJykgKyBtb2RlbC5nZXQoJ21hcmdpbnMuYm90dG9tJykpO1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XSA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7bW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKX0sICR7bW9kZWwuZ2V0KCdtYXJnaW5zLnRvcCcpfSlgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2NhbGVzID0ge307XG4gICAgICB0aGlzLnNjYWxlcy54ID0gZDMuc2NhbGVCYW5kKCkucmFuZ2UoWzAsIG1vZGVsLmdldCgnd2lkdGgnKV0pLnBhZGRpbmcoMC4xKTtcbiAgICAgIHRoaXMuc2NhbGVzLnkgPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFttb2RlbC5nZXQoJ2hlaWdodCcpLCAwXSk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSAnZGF0YScpIHtcbiAgICAgICAgdGhpcy5zZXR1cChldnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnBhdGgubWF0Y2goL15oaXN0b2dyYW0vKSkge1xuICAgICAgICB0aGlzLnJlbmRlcihldnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXAobW9kZWwpIHtcbiAgICAgIGlmIChPYmplY3QudmFsdWVzKG1vZGVsLmdldCgnZGF0YScpKS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICBsZXQgYmluU2FtcGxlID0gT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSlbMF0uaW50ZXJ2YWxzWzBdLmJpbnM7XG4gICAgICAgIGlmIChtb2RlbC5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgIGJpblNhbXBsZSA9IGJpblNhbXBsZS54O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJpblNhbXBsZSA9IGJpblNhbXBsZS50b3RhbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjYWxlcy54LmRvbWFpbihiaW5TYW1wbGUubWFwKChkKSA9PiBNYXRoLnJvdW5kKChkLnZTdGFydCArIGQudkVuZCkgLyAyKSkpO1xuICAgICAgICAvLyB0aGlzLnNjYWxlcy55LmRvbWFpbihbMCwgT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCB2YWwubWF4QmluVmFsdWUpLCAwKV0pO1xuICAgICAgICB0aGlzLnNjYWxlcy55LmRvbWFpbihbMCwxMDBdKTtcbiAgICAgICAgdGhpcy5heGVzID0ge1xuICAgICAgICAgIHg6IGQzLmF4aXNCb3R0b20oKS5zY2FsZSh0aGlzLnNjYWxlcy54KSxcbiAgICAgICAgICB5OiBkMy5heGlzTGVmdCgpLnNjYWxlKHRoaXMuc2NhbGVzLnkpLnRpY2tzKDUpXG4gICAgICAgIH07XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnN2Z3MpIHtcbiAgICAgICAgICB0aGlzLnN2Z3Nba2V5XS5zZWxlY3QoJy5oaXN0b2dyYW1fX2dyYXBoX19heGlzJykucmVtb3ZlKCk7XG4gICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdoaXN0b2dyYW1fX2dyYXBoX19heGlzIGhpc3RvZ3JhbV9fZ3JhcGhfX2F4aXMteCcpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21vZGVsLmdldCgnaGVpZ2h0Jyl9KWApXG4gICAgICAgICAgICAuY2FsbCh0aGlzLmF4ZXMueClcbiAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnaGlzdG9ncmFtX19ncmFwaF9fYXhpcy1sYWJlbCcpXG4gICAgICAgICAgICAgIC50ZXh0KGBTcGVlZCAoJHtrZXl9KWApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgbW9kZWwuZ2V0KCd3aWR0aCcpIC8gMilcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCAzMCk7XG4gICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdoaXN0b2dyYW1fX2dyYXBoX19heGlzIGhpc3RvZ3JhbV9fZ3JhcGhfX2F4aXMteScpXG4gICAgICAgICAgICAuY2FsbCh0aGlzLmF4ZXMueSlcbiAgICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnaGlzdG9ncmFtX19ncmFwaF9fYXhpcy1sYWJlbCcpXG4gICAgICAgICAgICAgIC50ZXh0KCdGcmVxdWVuY3kgKCUgdG90YWwpJylcbiAgICAgICAgICAgICAgLmF0dHIoJ3knLCAtMzApXG4gICAgICAgICAgICAgIC5hdHRyKCd4JywgLW1vZGVsLmdldCgnaGVpZ2h0JykgLyAyKVxuICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3JvdGF0ZSgtOTApJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVzZXQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcihtb2RlbCkge1xuICAgICAgbGV0IG1lYXN1cmVDb3VudCA9IDA7XG4gICAgICBmb3IgKGxldCBsYXllciBpbiBtb2RlbC5nZXQoJ2hpc3RvZ3JhbScpKSB7XG4gICAgICAgIGlmICghbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LnNob3dMYXllcmApKSB7Y29udGludWV9XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBtb2RlbC5nZXQoYGhpc3RvZ3JhbS4ke2xheWVyfWApKSB7XG4gICAgICAgICAgbGV0IGJpbnMgPSBtb2RlbC5nZXQoYGhpc3RvZ3JhbS4ke2xheWVyfS4ke2tleX1gKTtcbiAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMuc3Znc1trZXldLnNlbGVjdEFsbChgLmhpc3RvZ3JhbV9fYmFyX18ke2xheWVyfWApXG4gICAgICAgICAgICAuZGF0YShiaW5zKTtcbiAgICAgICAgICBsZXQgY29sb3IgPSBtb2RlbC5nZXQoYGRhdGEuJHtsYXllcn0uY29sb3JgKVxuICAgICAgICAgIGRhdGEuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBgaGlzdG9ncmFtX19iYXIgaGlzdG9ncmFtX19iYXJfXyR7bGF5ZXJ9YClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQsIGkpID0+IHRoaXMuc2NhbGVzLngoTWF0aC5yb3VuZCgoZC52U3RhcnQgKyBkLnZFbmQpIC8gMikpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5zY2FsZXMueC5iYW5kd2lkdGgoKSlcbiAgICAgICAgICAgIC5hdHRyKCd5JywgdGhpcy5zY2FsZXMueSgwKSlcbiAgICAgICAgICAgIC5hdHRyKCdzdHlsZScsIGNvbG9yID8gYGZpbGw6ICMke2NvbG9yLnRvU3RyaW5nKDE2KX1gIDogbnVsbClcbiAgICAgICAgICAgIC5tZXJnZShkYXRhKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAuZWFzZShkMy5lYXNlTGluZWFyKVxuICAgICAgICAgICAgICAuYXR0cigneScsIChkKSA9PiB0aGlzLnNjYWxlcy55KGQudmFsdWUgKiAxMDApKVxuICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGQpID0+IG1vZGVsLmdldCgnaGVpZ2h0JykgLSB0aGlzLnNjYWxlcy55KGQudmFsdWUgKiAxMDApKTtcbiAgICAgICAgICBkYXRhLmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgICAgICBtZWFzdXJlQ291bnQgPSBiaW5zLnJlZHVjZSgodiwgYykgPT4gdiArIGMuZnJlcXVlbmN5LCAwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRlbC5maW5kKGAuaGlzdG9ncmFtX19tZXRhX18ke2xheWVyfWApLmh0bWwoYCR7bWVhc3VyZUNvdW50fSBzYW1wbGVzYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5zdmdzKSB7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLnNlbGVjdEFsbCgnLmhpc3RvZ3JhbV9fZ3JhcGhfX2F4aXMnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcuaGlzdG9ncmFtX19iYXInKS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuaGlzdG9ncmFtX19tZXRhIHNwYW5cIikuaHRtbCgnJyk7XG4gICAgfVxuICB9XG59KVxuIl19
