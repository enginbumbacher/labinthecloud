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
          this.svgs[key].append('g').attr('class', 'time-series__graph__axis time-series__graph__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(this.axes.x).append('text').attr('class', 'time-series__graph__axis-label').text('Time [seconds]').attr('x', model.get('width') / 2).attr('y', 30);
          this.svgs[key].append('g').attr('class', 'time-series__graph__axis time-series__graph__axis-y').call(this.axes.y).append('text').attr('class', 'time-series__graph__axis-label').text('Avg Path Length per Second (' + key + ') [micrometers / second]').attr('transform', 'rotate(-90)').attr('y', -30).attr('x', -model.get('height') / 2);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9hbmdsZWNoYW5nZWdyYXBoL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJVdGlscyIsImQzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsImdldCIsInN2Z3MiLCJ4IiwieSIsInRvdGFsIiwia2V5Iiwic3ZnIiwic2VsZWN0IiwiJGVsIiwiZmluZCIsImFwcGVuZCIsImNsYXNzZWQiLCJhdHRyIiwic2NhbGVzIiwic2NhbGVMaW5lYXIiLCJyYW5nZSIsImV2dCIsImRhdGEiLCJwYXRoIiwidmFsdWUiLCJyZXNldCIsInNldHVwIiwiY3VycmVudFRhcmdldCIsImRvbWFpbiIsIk9iamVjdCIsInZhbHVlcyIsInJlZHVjZSIsImFjYyIsInZhbCIsIk1hdGgiLCJtYXgiLCJydW5UaW1lIiwibWF4VmFsdWUiLCJheGVzIiwiYXhpc0JvdHRvbSIsInNjYWxlIiwiYXhpc0xlZnQiLCJiZ3MiLCJyZW1vdmUiLCJjYWxsIiwidGV4dCIsImxheWVyIiwiZ3JhcGhkYXRhIiwiZmlsdGVyIiwiaXRlbSIsIm1lYW4iLCJjb2xvciIsInN0ZCIsImFyZWEiLCJkIiwidGltZSIsInkwIiwicyIsInkxIiwiZGF0dW0iLCJ0b1N0cmluZyIsImxpbmUiLCJ0aW1lc3RhbXAiLCJydW50aW1lIiwidGltZWJhbmQiLCJzZWxlY3RBbGwiLCJlbnRlciIsIm1lcmdlIiwidHJhbnNpdGlvbiIsImR1cmF0aW9uIiwibWluIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSxJQUFSLENBRlA7QUFB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cGgvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBkMyA9IHJlcXVpcmUoJ2QzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vdGltZXNlcmllc2dyYXBoLmh0bWwnKVxuICA7XG4gIHJlcXVpcmUoJ2xpbmshLi90aW1lc2VyaWVzZ3JhcGguY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFRpbWVTZXJpZXNWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Nb2RlbENoYW5nZSddKTtcblxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSk7XG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ21vZGUnKSA9PSBcImNvbXBvbmVudFwiKSB7XG4gICAgICAgIHRoaXMuc3ZncyA9IHtcbiAgICAgICAgICB4OiBudWxsLFxuICAgICAgICAgIHk6IG51bGxcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdmdzID0ge1xuICAgICAgICAgIHRvdGFsOiBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnN2Z3MpIHtcbiAgICAgICAgbGV0IHN2ZyA9IGQzLnNlbGVjdCh0aGlzLiRlbC5maW5kKCcudGltZS1zZXJpZXNfX2dyYXBoJykuZ2V0KDApKS5hcHBlbmQoJ3N2ZycpO1xuICAgICAgICBzdmcuY2xhc3NlZChgdGltZS1zZXJpZXNfX2dyYXBoX18ke2tleX1gLCB0cnVlKTtcbiAgICAgICAgc3ZnLmF0dHIoJ3dpZHRoJywgbW9kZWwuZ2V0KCd3aWR0aCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5yaWdodCcpKTtcbiAgICAgICAgc3ZnLmF0dHIoJ2hlaWdodCcsIG1vZGVsLmdldCgnaGVpZ2h0JykgKyBtb2RlbC5nZXQoJ21hcmdpbnMudG9wJykgKyBtb2RlbC5nZXQoJ21hcmdpbnMuYm90dG9tJykpO1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XSA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7bW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKX0sICR7bW9kZWwuZ2V0KCdtYXJnaW5zLnRvcCcpfSlgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2NhbGVzID0ge307XG4gICAgICB0aGlzLnNjYWxlcy54ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgbW9kZWwuZ2V0KCd3aWR0aCcpXSk7XG4gICAgICB0aGlzLnNjYWxlcy55ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbbW9kZWwuZ2V0KCdoZWlnaHQnKSwgMF0pO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoIChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgXCJkYXRhXCI6XG4gICAgICAgICAgaWYgKGV2dC5kYXRhLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLnNldHVwKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cChtb2RlbCkge1xuICAgICAgdGhpcy5zY2FsZXMueC5kb21haW4oWzAsIE9iamVjdC52YWx1ZXMobW9kZWwuZ2V0KCdkYXRhJykpLnJlZHVjZSgoYWNjLCB2YWwpID0+IE1hdGgubWF4KGFjYywgdmFsLnJ1blRpbWUpLCAwKV0pO1xuXG4gICAgICBsZXQgbWF4VmFsdWUgPSBPYmplY3QudmFsdWVzKG1vZGVsLmdldCgnZGF0YScpKS5yZWR1Y2UoKGFjYywgdmFsKSA9PiBNYXRoLm1heChhY2MsIHZhbC5tYXhWYWx1ZSksIDApO1xuICAgICAgdGhpcy5zY2FsZXMueS5kb21haW4oW21vZGVsLmdldCgnbW9kZScpID09ICdjb21wb25lbnQnID8gLW1heFZhbHVlIDogMCwgbWF4VmFsdWVdKTtcbiAgICAgIHRoaXMuYXhlcyA9IHtcbiAgICAgICAgeDogZDMuYXhpc0JvdHRvbSgpLnNjYWxlKHRoaXMuc2NhbGVzLngpLFxuICAgICAgICB5OiBkMy5heGlzTGVmdCgpLnNjYWxlKHRoaXMuc2NhbGVzLnkpXG4gICAgICB9O1xuICAgICAgdGhpcy5iZ3MgPSB7fTtcbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnN2Z3MpIHtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0KCcudGltZS1zZXJpZXNfX2dyYXBoX19heGlzJykucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYXhpcyB0aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMteCcpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttb2RlbC5nZXQoJ2hlaWdodCcpfSlgKVxuICAgICAgICAgIC5jYWxsKHRoaXMuYXhlcy54KVxuICAgICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYXhpcy1sYWJlbCcpXG4gICAgICAgICAgICAudGV4dCgnVGltZSBbc2Vjb25kc10nKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAzMCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYXhpcyB0aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMteScpXG4gICAgICAgICAgLmNhbGwodGhpcy5heGVzLnkpXG4gICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGltZS1zZXJpZXNfX2dyYXBoX19heGlzLWxhYmVsJylcbiAgICAgICAgICAgIC50ZXh0KGBBdmcgUGF0aCBMZW5ndGggcGVyIFNlY29uZCAoJHtrZXl9KSBbbWljcm9tZXRlcnMgLyBzZWNvbmRdYClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAncm90YXRlKC05MCknKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAtMzApXG4gICAgICAgICAgICAuYXR0cigneCcsIC1tb2RlbC5nZXQoJ2hlaWdodCcpIC8gMik7XG5cbiAgICAgICAgdGhpcy5iZ3Nba2V5XSA9IHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYmFja2dyb3VuZCcpO1xuXG4gICAgICAgIGZvciAobGV0IGxheWVyIGluIG1vZGVsLmdldCgnZGF0YScpKSB7XG4gICAgICAgICAgaWYgKCFtb2RlbC5nZXQoYGRhdGEuJHtsYXllcn0uc2hvd0xheWVyYCkpIHtjb250aW51ZX1cbiAgICAgICAgICBsZXQgZ3JhcGhkYXRhID0gbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LmdyYXBocy4ke2tleX1gKS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ubWVhbik7XG4gICAgICAgICAgbGV0IGNvbG9yID0gbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LmNvbG9yYClcbiAgICAgICAgICBpZiAobW9kZWwuZ2V0KCdzdGRCYW5kJykpIHtcbiAgICAgICAgICAgIGxldCBzdGQgPSBkMy5hcmVhKClcbiAgICAgICAgICAgICAgLngoKGQpID0+IHRoaXMuc2NhbGVzLngoZC50aW1lKSlcbiAgICAgICAgICAgICAgLnkwKChkKSA9PiB0aGlzLnNjYWxlcy55KGQubWVhbiAtIGQucykpXG4gICAgICAgICAgICAgIC55MSgoZCkgPT4gdGhpcy5zY2FsZXMueShkLm1lYW4gKyBkLnMpKTtcbiAgICAgICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAgIC5kYXR1bShncmFwaGRhdGEpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGB0aW1lLXNlcmllc19fZ3JhcGhfX3N0ZCB0aW1lLXNlcmllc19fZ3JhcGhfX3N0ZF9fJHtsYXllcn1gKVxuICAgICAgICAgICAgICAuYXR0cignc3R5bGUnLCBjb2xvciA/IGBmaWxsOiAjJHtjb2xvci50b1N0cmluZygxNil9YCA6IG51bGwpXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgc3RkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGdW5jdGlvbiB0byBiZSB1c2VkIGZvciBwbG90dGluZ1xuICAgICAgICAgIC8vIEl0IGRlZmluZXMgdGhhdCBpdCB0YWtlcyBmb3IgZWFjaCBkYXRhIHBvaW50IHRoZSB0aW1lIGVsZW1lbnQgYW5kIHRoZSBtZWFuIGFuZCBwbG90cyBpdCBpbiB4LHkuXG4gICAgICAgICAgLy8gLmRhdHVtKGdyYXBoZGF0YSk6IFRoYXQncyB0aGUgZGF0YSBvbiB3aGljaCB0byBhcHBseSB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgLy8gLmF0dHIoKTogQ2hhcmFjdGVyaXN0aWNzIG9mIHRoZSBzdmcuXG4gICAgICAgICAgLy8gLmF0dHIoJ2QnLGxpbmUpIGlzIHdoZXJlIHRoZSBkYXR1bSBnZXRzIHRyYW5zZm9ybWVkIGludG8gdGhlIGxpbmUuXG4gICAgICAgICAgbGV0IGxpbmUgPSBkMy5saW5lKClcbiAgICAgICAgICAgIC54KChkKSA9PiB0aGlzLnNjYWxlcy54KGQudGltZSkpXG4gICAgICAgICAgICAueSgoZCkgPT4gdGhpcy5zY2FsZXMueShkLm1lYW4pKVxuICAgICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAuZGF0dW0oZ3JhcGhkYXRhKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYHRpbWUtc2VyaWVzX19ncmFwaF9fbGluZSB0aW1lLXNlcmllc19fZ3JhcGhfX2xpbmVfXyR7bGF5ZXJ9YClcbiAgICAgICAgICAgIC5hdHRyKCdzdHlsZScsIGNvbG9yID8gYHN0cm9rZTogIyR7Y29sb3IudG9TdHJpbmcoMTYpfWAgOiBudWxsKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCBsaW5lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZSh0aW1lc3RhbXAsIG1vZGVsKSB7XG4gICAgICBsZXQgcnVudGltZSA9IE9iamVjdC52YWx1ZXMobW9kZWwuZ2V0KCdkYXRhJykpLnJlZHVjZSgoYWNjLCB2YWwpID0+IE1hdGgubWF4KGFjYywgdmFsLnJ1blRpbWUpLCAwKTtcbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnN2Z3MpIHtcbiAgICAgICAgbGV0IHRpbWViYW5kID0gdGhpcy5iZ3Nba2V5XS5zZWxlY3RBbGwoJy50aW1lLXNlcmllc19fZ3JhcGhfX3RpbWUtYmFuZCcpXG4gICAgICAgICAgLmRhdGEoW3RpbWVzdGFtcF0pXG4gICAgICAgIHRpbWViYW5kLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGltZS1zZXJpZXNfX2dyYXBoX190aW1lLWJhbmQnKVxuICAgICAgICAgIC5hdHRyKCd5JywgMClcbiAgICAgICAgICAuYXR0cignaGVpZ2h0JywgbW9kZWwuZ2V0KCdoZWlnaHQnKSlcbiAgICAgICAgICAubWVyZ2UodGltZWJhbmQpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDApXG4gICAgICAgICAgICAuYXR0cigneCcsIChkKSA9PiB0aGlzLnNjYWxlcy54KE1hdGgubWluKHJ1bnRpbWUsIE1hdGgubWF4KDAsIGQgLSBtb2RlbC5nZXQoJ2RUJykgLyAyKSkpKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpID0+IHRoaXMuc2NhbGVzLngobW9kZWwuZ2V0KCdkVCcpICsgTWF0aC5taW4oMCwgZCAtIG1vZGVsLmdldCgnZFQnKSAvIDIpICsgTWF0aC5taW4oMCwgcnVudGltZSAtIGQgLSBtb2RlbC5nZXQoJ2RUJykgLyAyKSkpXG4gICAgICAgIHRpbWViYW5kLmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnN2Z3MpIHtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX19heGlzJykucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLnNlbGVjdEFsbCgnLnRpbWUtc2VyaWVzX19ncmFwaF9fdGltZS1iYW5kJykucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLnNlbGVjdEFsbCgnLnRpbWUtc2VyaWVzX19ncmFwaF9fc3RkJykucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLnNlbGVjdEFsbCgnLnRpbWUtc2VyaWVzX19ncmFwaF9fbGluZScpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdfQ==
