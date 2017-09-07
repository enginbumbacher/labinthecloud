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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiZDMiLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiZ2V0Iiwic3ZncyIsIngiLCJ5IiwidG90YWwiLCJrZXkiLCJzdmciLCJzZWxlY3QiLCIkZWwiLCJmaW5kIiwiYXBwZW5kIiwiY2xhc3NlZCIsImF0dHIiLCJzY2FsZXMiLCJzY2FsZUxpbmVhciIsInJhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsInJlc2V0Iiwic2V0dXAiLCJjdXJyZW50VGFyZ2V0IiwiZG9tYWluIiwiT2JqZWN0IiwidmFsdWVzIiwicmVkdWNlIiwiYWNjIiwidmFsIiwiTWF0aCIsIm1heCIsInJ1blRpbWUiLCJtYXhWYWx1ZSIsImF4ZXMiLCJheGlzQm90dG9tIiwic2NhbGUiLCJheGlzTGVmdCIsImJncyIsInJlbW92ZSIsImNhbGwiLCJ0ZXh0IiwibGF5ZXIiLCJncmFwaGRhdGEiLCJmaWx0ZXIiLCJpdGVtIiwibWVhbiIsImNvbG9yIiwic3RkIiwiYXJlYSIsImQiLCJ0aW1lIiwieTAiLCJzIiwieTEiLCJkYXR1bSIsInRvU3RyaW5nIiwibGluZSIsInRpbWVzdGFtcCIsInJ1bnRpbWUiLCJ0aW1lYmFuZCIsInNlbGVjdEFsbCIsImVudGVyIiwibWVyZ2UiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJtaW4iLCJleGl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLElBQVIsQ0FGUDtBQUFB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a0I3QixLQUFLQyxHQUFMLENBQVMsQ0FBVCxFQUFZbUIsSUFBSXRELE1BQU1LLEdBQU4sQ0FBVSxJQUFWLElBQWtCLENBQWxDLENBQWxCLENBQWQsQ0FBUDtBQUFBLFdBUGYsRUFRS1ksSUFSTCxDQVFVLE9BUlYsRUFRbUIsVUFBQ3FDLENBQUQ7QUFBQSxtQkFBTyxPQUFLcEMsTUFBTCxDQUFZWCxDQUFaLENBQWNQLE1BQU1LLEdBQU4sQ0FBVSxJQUFWLElBQWtCNkIsS0FBS29DLEdBQUwsQ0FBUyxDQUFULEVBQVloQixJQUFJdEQsTUFBTUssR0FBTixDQUFVLElBQVYsSUFBa0IsQ0FBbEMsQ0FBbEIsR0FBeUQ2QixLQUFLb0MsR0FBTCxDQUFTLENBQVQsRUFBWVAsVUFBVVQsQ0FBVixHQUFjdEQsTUFBTUssR0FBTixDQUFVLElBQVYsSUFBa0IsQ0FBNUMsQ0FBdkUsQ0FBUDtBQUFBLFdBUm5CO0FBU0EyRCxtQkFBU08sSUFBVCxHQUFnQjVCLE1BQWhCO0FBQ0Q7QUFDRjtBQXpISDtBQUFBO0FBQUEsOEJBMkhVO0FBQ04sYUFBSyxJQUFJakMsR0FBVCxJQUFnQixLQUFLSixJQUFyQixFQUEyQjtBQUN6QixlQUFLQSxJQUFMLENBQVVJLEdBQVYsRUFBZXVELFNBQWYsQ0FBeUIsMkJBQXpCLEVBQXNEdEIsTUFBdEQ7QUFDQSxlQUFLckMsSUFBTCxDQUFVSSxHQUFWLEVBQWV1RCxTQUFmLENBQXlCLGdDQUF6QixFQUEyRHRCLE1BQTNEO0FBQ0EsZUFBS3JDLElBQUwsQ0FBVUksR0FBVixFQUFldUQsU0FBZixDQUF5QiwwQkFBekIsRUFBcUR0QixNQUFyRDtBQUNBLGVBQUtyQyxJQUFMLENBQVVJLEdBQVYsRUFBZXVELFNBQWYsQ0FBeUIsMkJBQXpCLEVBQXNEdEIsTUFBdEQ7QUFDRDtBQUNGO0FBbElIOztBQUFBO0FBQUEsSUFBb0MvQyxPQUFwQztBQW9JRCxDQTVJRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdGltZXNlcmllc2dyYXBoL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgZDMgPSByZXF1aXJlKCdkMycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3RpbWVzZXJpZXNncmFwaC5odG1sJylcbiAgO1xuICByZXF1aXJlKCdsaW5rIS4vdGltZXNlcmllc2dyYXBoLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBUaW1lU2VyaWVzVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uTW9kZWxDaGFuZ2UnXSk7XG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpO1xuXG4gICAgICBpZiAobW9kZWwuZ2V0KCdtb2RlJykgPT0gXCJjb21wb25lbnRcIikge1xuICAgICAgICB0aGlzLnN2Z3MgPSB7XG4gICAgICAgICAgeDogbnVsbCxcbiAgICAgICAgICB5OiBudWxsXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3ZncyA9IHtcbiAgICAgICAgICB0b3RhbDogbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5zdmdzKSB7XG4gICAgICAgIGxldCBzdmcgPSBkMy5zZWxlY3QodGhpcy4kZWwuZmluZCgnLnRpbWUtc2VyaWVzX19ncmFwaCcpLmdldCgwKSkuYXBwZW5kKCdzdmcnKTtcbiAgICAgICAgc3ZnLmNsYXNzZWQoYHRpbWUtc2VyaWVzX19ncmFwaF9fJHtrZXl9YCwgdHJ1ZSk7XG4gICAgICAgIHN2Zy5hdHRyKCd3aWR0aCcsIG1vZGVsLmdldCgnd2lkdGgnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5sZWZ0JykgKyBtb2RlbC5nZXQoJ21hcmdpbnMucmlnaHQnKSk7XG4gICAgICAgIHN2Zy5hdHRyKCdoZWlnaHQnLCBtb2RlbC5nZXQoJ2hlaWdodCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLnRvcCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLmJvdHRvbScpKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0gPSBzdmcuYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21vZGVsLmdldCgnbWFyZ2lucy5sZWZ0Jyl9LCAke21vZGVsLmdldCgnbWFyZ2lucy50b3AnKX0pYCk7XG4gICAgICB9XG4gICAgICB0aGlzLnNjYWxlcyA9IHt9O1xuICAgICAgdGhpcy5zY2FsZXMueCA9IGQzLnNjYWxlTGluZWFyKCkucmFuZ2UoWzAsIG1vZGVsLmdldCgnd2lkdGgnKV0pO1xuICAgICAgdGhpcy5zY2FsZXMueSA9IGQzLnNjYWxlTGluZWFyKCkucmFuZ2UoW21vZGVsLmdldCgnaGVpZ2h0JyksIDBdKTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaCAoZXZ0LmRhdGEucGF0aCkge1xuICAgICAgICBjYXNlIFwiZGF0YVwiOlxuICAgICAgICAgIGlmIChldnQuZGF0YS52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5zZXR1cChldnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXAobW9kZWwpIHtcbiAgICAgIHRoaXMuc2NhbGVzLnguZG9tYWluKFswLCBPYmplY3QudmFsdWVzKG1vZGVsLmdldCgnZGF0YScpKS5yZWR1Y2UoKGFjYywgdmFsKSA9PiBNYXRoLm1heChhY2MsIHZhbC5ydW5UaW1lKSwgMCldKTtcblxuICAgICAgbGV0IG1heFZhbHVlID0gT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCB2YWwubWF4VmFsdWUpLCAwKTtcbiAgICAgIHRoaXMuc2NhbGVzLnkuZG9tYWluKFttb2RlbC5nZXQoJ21vZGUnKSA9PSAnY29tcG9uZW50JyA/IC1tYXhWYWx1ZSA6IDAsIG1heFZhbHVlXSk7XG4gICAgICB0aGlzLmF4ZXMgPSB7XG4gICAgICAgIHg6IGQzLmF4aXNCb3R0b20oKS5zY2FsZSh0aGlzLnNjYWxlcy54KSxcbiAgICAgICAgeTogZDMuYXhpc0xlZnQoKS5zY2FsZSh0aGlzLnNjYWxlcy55KVxuICAgICAgfTtcbiAgICAgIHRoaXMuYmdzID0ge307XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5zdmdzKSB7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLnNlbGVjdCgnLnRpbWUtc2VyaWVzX19ncmFwaF9fYXhpcycpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XS5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMgdGltZS1zZXJpZXNfX2dyYXBoX19heGlzLXgnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bW9kZWwuZ2V0KCdoZWlnaHQnKX0pYClcbiAgICAgICAgICAuY2FsbCh0aGlzLmF4ZXMueClcbiAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMtbGFiZWwnKVxuICAgICAgICAgICAgLnRleHQoJ1RpbWUnKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAzMCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYXhpcyB0aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMteScpXG4gICAgICAgICAgLmNhbGwodGhpcy5heGVzLnkpXG4gICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGltZS1zZXJpZXNfX2dyYXBoX19heGlzLWxhYmVsJylcbiAgICAgICAgICAgIC50ZXh0KGBBdmVyYWdlIFNwZWVkICgke2tleX0pYClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAncm90YXRlKC05MCknKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAtMzApXG4gICAgICAgICAgICAuYXR0cigneCcsIC1tb2RlbC5nZXQoJ2hlaWdodCcpIC8gMik7XG5cbiAgICAgICAgdGhpcy5iZ3Nba2V5XSA9IHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpbWUtc2VyaWVzX19ncmFwaF9fYmFja2dyb3VuZCcpO1xuXG4gICAgICAgIGZvciAobGV0IGxheWVyIGluIG1vZGVsLmdldCgnZGF0YScpKSB7XG4gICAgICAgICAgaWYgKCFtb2RlbC5nZXQoYGRhdGEuJHtsYXllcn0uc2hvd0xheWVyYCkpIHtjb250aW51ZX1cbiAgICAgICAgICBsZXQgZ3JhcGhkYXRhID0gbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LmdyYXBocy4ke2tleX1gKS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ubWVhbik7XG4gICAgICAgICAgbGV0IGNvbG9yID0gbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LmNvbG9yYClcbiAgICAgICAgICBpZiAobW9kZWwuZ2V0KCdzdGRCYW5kJykpIHtcbiAgICAgICAgICAgIGxldCBzdGQgPSBkMy5hcmVhKClcbiAgICAgICAgICAgICAgLngoKGQpID0+IHRoaXMuc2NhbGVzLngoZC50aW1lKSlcbiAgICAgICAgICAgICAgLnkwKChkKSA9PiB0aGlzLnNjYWxlcy55KGQubWVhbiAtIGQucykpXG4gICAgICAgICAgICAgIC55MSgoZCkgPT4gdGhpcy5zY2FsZXMueShkLm1lYW4gKyBkLnMpKTtcbiAgICAgICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAgIC5kYXR1bShncmFwaGRhdGEpXG4gICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGB0aW1lLXNlcmllc19fZ3JhcGhfX3N0ZCB0aW1lLXNlcmllc19fZ3JhcGhfX3N0ZF9fJHtsYXllcn1gKVxuICAgICAgICAgICAgICAuYXR0cignc3R5bGUnLCBjb2xvciA/IGBmaWxsOiAjJHtjb2xvci50b1N0cmluZygxNil9YCA6IG51bGwpXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgc3RkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgbGluZSA9IGQzLmxpbmUoKVxuICAgICAgICAgICAgLngoKGQpID0+IHRoaXMuc2NhbGVzLngoZC50aW1lKSlcbiAgICAgICAgICAgIC55KChkKSA9PiB0aGlzLnNjYWxlcy55KGQubWVhbikpXG4gICAgICAgICAgdGhpcy5zdmdzW2tleV0uYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5kYXR1bShncmFwaGRhdGEpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBgdGltZS1zZXJpZXNfX2dyYXBoX19saW5lIHRpbWUtc2VyaWVzX19ncmFwaF9fbGluZV9fJHtsYXllcn1gKVxuICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgY29sb3IgPyBgc3Ryb2tlOiAjJHtjb2xvci50b1N0cmluZygxNil9YCA6IG51bGwpXG4gICAgICAgICAgICAuYXR0cignZCcsIGxpbmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlKHRpbWVzdGFtcCwgbW9kZWwpIHtcbiAgICAgIGxldCBydW50aW1lID0gT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCB2YWwucnVuVGltZSksIDApO1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICBsZXQgdGltZWJhbmQgPSB0aGlzLmJnc1trZXldLnNlbGVjdEFsbCgnLnRpbWUtc2VyaWVzX19ncmFwaF9fdGltZS1iYW5kJylcbiAgICAgICAgICAuZGF0YShbdGltZXN0YW1wXSlcbiAgICAgICAgdGltZWJhbmQuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aW1lLXNlcmllc19fZ3JhcGhfX3RpbWUtYmFuZCcpXG4gICAgICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBtb2RlbC5nZXQoJ2hlaWdodCcpKVxuICAgICAgICAgIC5tZXJnZSh0aW1lYmFuZClcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMClcbiAgICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMuc2NhbGVzLngoTWF0aC5taW4ocnVudGltZSwgTWF0aC5tYXgoMCwgZCAtIG1vZGVsLmdldCgnZFQnKSAvIDIpKSkpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZCkgPT4gdGhpcy5zY2FsZXMueChtb2RlbC5nZXQoJ2RUJykgKyBNYXRoLm1pbigwLCBkIC0gbW9kZWwuZ2V0KCdkVCcpIC8gMikgKyBNYXRoLm1pbigwLCBydW50aW1lIC0gZCAtIG1vZGVsLmdldCgnZFQnKSAvIDIpKSlcbiAgICAgICAgdGltZWJhbmQuZXhpdCgpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XS5zZWxlY3RBbGwoJy50aW1lLXNlcmllc19fZ3JhcGhfX2F4aXMnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX190aW1lLWJhbmQnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX19zdGQnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcudGltZS1zZXJpZXNfX2dyYXBoX19saW5lJykucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl19
