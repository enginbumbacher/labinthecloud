'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      d3 = require('d3'),
      Template = require('text!./orientationchangegraph.html');
  require('link!./orientationchangegraph.css');

  return function (_DomView) {
    _inherits(OrientationChangeView, _DomView);

    function OrientationChangeView(model, tmpl) {
      _classCallCheck(this, OrientationChangeView);

      var _this = _possibleConstructorReturn(this, (OrientationChangeView.__proto__ || Object.getPrototypeOf(OrientationChangeView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);

      model.addEventListener('Model.Change', _this._onModelChange);

      _this.svgs = {
        angleDiff: null
      };
      for (var key in _this.svgs) {
        var svg = d3.select(_this.$el.find('.orientation-change__graph').get(0)).append('svg');
        svg.classed('orientation-change__graph__' + key, true);
        svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
        svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
        _this.svgs[key] = svg.append('g').attr('transform', 'translate(' + model.get('margins.left') + ', ' + model.get('margins.top') + ')');
      }
      _this.scales = {};
      _this.scales.x = d3.scaleLinear().range([0, model.get('width')]);
      _this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);
      return _this;
    }

    _createClass(OrientationChangeView, [{
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
          this.svgs[key].select('.orientation-change__graph__axis').remove();
          this.svgs[key].append('g').attr('class', 'orientation-change__graph__axis orientation-change__graph__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(this.axes.x).append('text').attr('class', 'orientation-change__graph__axis-label').text('Time [seconds]').attr('x', model.get('width') / 2).attr('y', 30);
          this.svgs[key].append('g').attr('class', 'orientation-change__graph__axis orientation-change__graph__axis-y').call(this.axes.y).append('text').attr('class', 'orientation-change__graph__axis-label').text('Avg Change in orientation per Second (' + key + ') [degrees / second]').attr('transform', 'rotate(-90)').attr('y', -30).attr('x', -model.get('height') / 2);

          this.bgs[key] = this.svgs[key].append('g').attr('class', 'orientation-change__graph__background');

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
              this.svgs[key].append('path').datum(graphdata).attr('class', 'orientation-change__graph__std orientation-change__graph__std__' + layer).attr('style', color ? 'fill: #' + color.toString(16) : null).attr('d', std);
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
            this.svgs[key].append('path').datum(graphdata).attr('class', 'orientation-change__graph__line orientation-change__graph__line__' + layer).attr('style', color ? 'stroke: #' + color.toString(16) : null).attr('d', line);
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
          var timeband = this.bgs[key].selectAll('.orientation-change__graph__time-band').data([timestamp]);
          timeband.enter().append('rect').attr('class', 'orientation-change__graph__time-band').attr('y', 0).attr('height', model.get('height')).merge(timeband).transition().duration(0).attr('x', function (d) {
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
          this.svgs[key].selectAll('.orientation-change__graph__axis').remove();
          this.svgs[key].selectAll('.orientation-change__graph__time-band').remove();
          this.svgs[key].selectAll('.orientation-change__graph__std').remove();
          this.svgs[key].selectAll('.orientation-change__graph__line').remove();
        }
      }
    }]);

    return OrientationChangeView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9vcmllbnRhdGlvbmNoYW5nZWdyYXBoL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJVdGlscyIsImQzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsInN2Z3MiLCJhbmdsZURpZmYiLCJrZXkiLCJzdmciLCJzZWxlY3QiLCIkZWwiLCJmaW5kIiwiZ2V0IiwiYXBwZW5kIiwiY2xhc3NlZCIsImF0dHIiLCJzY2FsZXMiLCJ4Iiwic2NhbGVMaW5lYXIiLCJyYW5nZSIsInkiLCJldnQiLCJkYXRhIiwicGF0aCIsInZhbHVlIiwicmVzZXQiLCJzZXR1cCIsImN1cnJlbnRUYXJnZXQiLCJkb21haW4iLCJPYmplY3QiLCJ2YWx1ZXMiLCJyZWR1Y2UiLCJhY2MiLCJ2YWwiLCJNYXRoIiwibWF4IiwicnVuVGltZSIsIm1heFZhbHVlIiwiYXhlcyIsImF4aXNCb3R0b20iLCJzY2FsZSIsImF4aXNMZWZ0IiwiYmdzIiwicmVtb3ZlIiwiY2FsbCIsInRleHQiLCJsYXllciIsImdyYXBoZGF0YSIsImZpbHRlciIsIml0ZW0iLCJtZWFuIiwiY29sb3IiLCJzdGQiLCJhcmVhIiwiZCIsInRpbWUiLCJ5MCIsInMiLCJ5MSIsImRhdHVtIiwidG9TdHJpbmciLCJsaW5lIiwidGltZXN0YW1wIiwicnVudGltZSIsInRpbWViYW5kIiwic2VsZWN0QWxsIiwiZW50ZXIiLCJtZXJnZSIsInRyYW5zaXRpb24iLCJkdXJhdGlvbiIsIm1pbiIsImV4aXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEsSUFB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ZixFQVFLRyxJQVJMLENBUVUsT0FSVixFQVFtQixVQUFDdUMsQ0FBRDtBQUFBLG1CQUFPLE9BQUt0QyxNQUFMLENBQVlDLENBQVosQ0FBY2pCLE1BQU1ZLEdBQU4sQ0FBVSxJQUFWLElBQWtCc0IsS0FBS29DLEdBQUwsQ0FBUyxDQUFULEVBQVloQixJQUFJdEQsTUFBTVksR0FBTixDQUFVLElBQVYsSUFBa0IsQ0FBbEMsQ0FBbEIsR0FBeURzQixLQUFLb0MsR0FBTCxDQUFTLENBQVQsRUFBWVAsVUFBVVQsQ0FBVixHQUFjdEQsTUFBTVksR0FBTixDQUFVLElBQVYsSUFBa0IsQ0FBNUMsQ0FBdkUsQ0FBUDtBQUFBLFdBUm5CO0FBU0FvRCxtQkFBU08sSUFBVCxHQUFnQjVCLE1BQWhCO0FBQ0Q7QUFDRjtBQXZISDtBQUFBO0FBQUEsOEJBeUhVO0FBQ04sYUFBSyxJQUFJcEMsR0FBVCxJQUFnQixLQUFLRixJQUFyQixFQUEyQjtBQUN6QixlQUFLQSxJQUFMLENBQVVFLEdBQVYsRUFBZTBELFNBQWYsQ0FBeUIsa0NBQXpCLEVBQTZEdEIsTUFBN0Q7QUFDQSxlQUFLdEMsSUFBTCxDQUFVRSxHQUFWLEVBQWUwRCxTQUFmLENBQXlCLHVDQUF6QixFQUFrRXRCLE1BQWxFO0FBQ0EsZUFBS3RDLElBQUwsQ0FBVUUsR0FBVixFQUFlMEQsU0FBZixDQUF5QixpQ0FBekIsRUFBNER0QixNQUE1RDtBQUNBLGVBQUt0QyxJQUFMLENBQVVFLEdBQVYsRUFBZTBELFNBQWYsQ0FBeUIsa0NBQXpCLEVBQTZEdEIsTUFBN0Q7QUFDRDtBQUNGO0FBaElIOztBQUFBO0FBQUEsSUFBMkMvQyxPQUEzQztBQWtJRCxDQTFJRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvb3JpZW50YXRpb25jaGFuZ2VncmFwaC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGQzID0gcmVxdWlyZSgnZDMnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9vcmllbnRhdGlvbmNoYW5nZWdyYXBoLmh0bWwnKVxuICA7XG4gIHJlcXVpcmUoJ2xpbmshLi9vcmllbnRhdGlvbmNoYW5nZWdyYXBoLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBPcmllbnRhdGlvbkNoYW5nZVZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJ10pO1xuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcblxuICAgICAgdGhpcy5zdmdzID0ge1xuICAgICAgICBhbmdsZURpZmY6IG51bGxcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnN2Z3MpIHtcbiAgICAgICAgbGV0IHN2ZyA9IGQzLnNlbGVjdCh0aGlzLiRlbC5maW5kKCcub3JpZW50YXRpb24tY2hhbmdlX19ncmFwaCcpLmdldCgwKSkuYXBwZW5kKCdzdmcnKTtcbiAgICAgICAgc3ZnLmNsYXNzZWQoYG9yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfXyR7a2V5fWAsIHRydWUpO1xuICAgICAgICBzdmcuYXR0cignd2lkdGgnLCBtb2RlbC5nZXQoJ3dpZHRoJykgKyBtb2RlbC5nZXQoJ21hcmdpbnMubGVmdCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLnJpZ2h0JykpO1xuICAgICAgICBzdmcuYXR0cignaGVpZ2h0JywgbW9kZWwuZ2V0KCdoZWlnaHQnKSArIG1vZGVsLmdldCgnbWFyZ2lucy50b3AnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5ib3R0b20nKSk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldID0gc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHttb2RlbC5nZXQoJ21hcmdpbnMubGVmdCcpfSwgJHttb2RlbC5nZXQoJ21hcmdpbnMudG9wJyl9KWApO1xuICAgICAgfVxuICAgICAgdGhpcy5zY2FsZXMgPSB7fTtcbiAgICAgIHRoaXMuc2NhbGVzLnggPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFswLCBtb2RlbC5nZXQoJ3dpZHRoJyldKTtcbiAgICAgIHRoaXMuc2NhbGVzLnkgPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFttb2RlbC5nZXQoJ2hlaWdodCcpLCAwXSk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzd2l0Y2ggKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSBcImRhdGFcIjpcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0dXAoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwKG1vZGVsKSB7XG4gICAgICB0aGlzLnNjYWxlcy54LmRvbWFpbihbMCwgT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCB2YWwucnVuVGltZSksIDApXSk7XG5cbiAgICAgIGxldCBtYXhWYWx1ZSA9IE9iamVjdC52YWx1ZXMobW9kZWwuZ2V0KCdkYXRhJykpLnJlZHVjZSgoYWNjLCB2YWwpID0+IE1hdGgubWF4KGFjYywgdmFsLm1heFZhbHVlKSwgMCk7XG4gICAgICB0aGlzLnNjYWxlcy55LmRvbWFpbihbbW9kZWwuZ2V0KCdtb2RlJykgPT0gJ2NvbXBvbmVudCcgPyAtbWF4VmFsdWUgOiAwLCBtYXhWYWx1ZV0pO1xuICAgICAgdGhpcy5heGVzID0ge1xuICAgICAgICB4OiBkMy5heGlzQm90dG9tKCkuc2NhbGUodGhpcy5zY2FsZXMueCksXG4gICAgICAgIHk6IGQzLmF4aXNMZWZ0KCkuc2NhbGUodGhpcy5zY2FsZXMueSlcbiAgICAgIH07XG4gICAgICB0aGlzLmJncyA9IHt9O1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XS5zZWxlY3QoJy5vcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoX19heGlzJykucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ29yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX2F4aXMgb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fYXhpcy14JylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21vZGVsLmdldCgnaGVpZ2h0Jyl9KWApXG4gICAgICAgICAgLmNhbGwodGhpcy5heGVzLngpXG4gICAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fYXhpcy1sYWJlbCcpXG4gICAgICAgICAgICAudGV4dCgnVGltZSBbc2Vjb25kc10nKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAzMCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ29yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX2F4aXMgb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fYXhpcy15JylcbiAgICAgICAgICAuY2FsbCh0aGlzLmF4ZXMueSlcbiAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdvcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoX19heGlzLWxhYmVsJylcbiAgICAgICAgICAgIC50ZXh0KGBBdmcgQ2hhbmdlIGluIG9yaWVudGF0aW9uIHBlciBTZWNvbmQgKCR7a2V5fSkgW2RlZ3JlZXMgLyBzZWNvbmRdYClcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAncm90YXRlKC05MCknKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAtMzApXG4gICAgICAgICAgICAuYXR0cigneCcsIC1tb2RlbC5nZXQoJ2hlaWdodCcpIC8gMik7XG5cbiAgICAgICAgdGhpcy5iZ3Nba2V5XSA9IHRoaXMuc3Znc1trZXldLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ29yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX2JhY2tncm91bmQnKTtcblxuICAgICAgICBmb3IgKGxldCBsYXllciBpbiBtb2RlbC5nZXQoJ2RhdGEnKSkge1xuICAgICAgICAgIGlmICghbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LnNob3dMYXllcmApKSB7Y29udGludWV9XG4gICAgICAgICAgbGV0IGdyYXBoZGF0YSA9IG1vZGVsLmdldChgZGF0YS4ke2xheWVyfS5ncmFwaHMuJHtrZXl9YCkuZmlsdGVyKChpdGVtKSA9PiBpdGVtLm1lYW4pO1xuICAgICAgICAgIGxldCBjb2xvciA9IG1vZGVsLmdldChgZGF0YS4ke2xheWVyfS5jb2xvcmApXG4gICAgICAgICAgaWYgKG1vZGVsLmdldCgnc3RkQmFuZCcpKSB7XG4gICAgICAgICAgICBsZXQgc3RkID0gZDMuYXJlYSgpXG4gICAgICAgICAgICAgIC54KChkKSA9PiB0aGlzLnNjYWxlcy54KGQudGltZSkpXG4gICAgICAgICAgICAgIC55MCgoZCkgPT4gdGhpcy5zY2FsZXMueShkLm1lYW4gLSBkLnMpKVxuICAgICAgICAgICAgICAueTEoKGQpID0+IHRoaXMuc2NhbGVzLnkoZC5tZWFuICsgZC5zKSk7XG4gICAgICAgICAgICB0aGlzLnN2Z3Nba2V5XS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgICAgICAuZGF0dW0oZ3JhcGhkYXRhKVxuICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCBgb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fc3RkIG9yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX3N0ZF9fJHtsYXllcn1gKVxuICAgICAgICAgICAgICAuYXR0cignc3R5bGUnLCBjb2xvciA/IGBmaWxsOiAjJHtjb2xvci50b1N0cmluZygxNil9YCA6IG51bGwpXG4gICAgICAgICAgICAgIC5hdHRyKCdkJywgc3RkKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGdW5jdGlvbiB0byBiZSB1c2VkIGZvciBwbG90dGluZ1xuICAgICAgICAgIC8vIEl0IGRlZmluZXMgdGhhdCBpdCB0YWtlcyBmb3IgZWFjaCBkYXRhIHBvaW50IHRoZSB0aW1lIGVsZW1lbnQgYW5kIHRoZSBtZWFuIGFuZCBwbG90cyBpdCBpbiB4LHkuXG4gICAgICAgICAgLy8gLmRhdHVtKGdyYXBoZGF0YSk6IFRoYXQncyB0aGUgZGF0YSBvbiB3aGljaCB0byBhcHBseSB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgLy8gLmF0dHIoKTogQ2hhcmFjdGVyaXN0aWNzIG9mIHRoZSBzdmcuXG4gICAgICAgICAgLy8gLmF0dHIoJ2QnLGxpbmUpIGlzIHdoZXJlIHRoZSBkYXR1bSBnZXRzIHRyYW5zZm9ybWVkIGludG8gdGhlIGxpbmUuXG4gICAgICAgICAgbGV0IGxpbmUgPSBkMy5saW5lKClcbiAgICAgICAgICAgIC54KChkKSA9PiB0aGlzLnNjYWxlcy54KGQudGltZSkpXG4gICAgICAgICAgICAueSgoZCkgPT4gdGhpcy5zY2FsZXMueShkLm1lYW4pKVxuICAgICAgICAgIHRoaXMuc3Znc1trZXldLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAuZGF0dW0oZ3JhcGhkYXRhKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYG9yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX2xpbmUgb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fbGluZV9fJHtsYXllcn1gKVxuICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgY29sb3IgPyBgc3Ryb2tlOiAjJHtjb2xvci50b1N0cmluZygxNil9YCA6IG51bGwpXG4gICAgICAgICAgICAuYXR0cignZCcsIGxpbmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlKHRpbWVzdGFtcCwgbW9kZWwpIHtcbiAgICAgIGxldCBydW50aW1lID0gT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCB2YWwucnVuVGltZSksIDApO1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuc3Zncykge1xuICAgICAgICBsZXQgdGltZWJhbmQgPSB0aGlzLmJnc1trZXldLnNlbGVjdEFsbCgnLm9yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX3RpbWUtYmFuZCcpXG4gICAgICAgICAgLmRhdGEoW3RpbWVzdGFtcF0pXG4gICAgICAgIHRpbWViYW5kLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCAnb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fdGltZS1iYW5kJylcbiAgICAgICAgICAuYXR0cigneScsIDApXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIG1vZGVsLmdldCgnaGVpZ2h0JykpXG4gICAgICAgICAgLm1lcmdlKHRpbWViYW5kKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigwKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZCkgPT4gdGhpcy5zY2FsZXMueChNYXRoLm1pbihydW50aW1lLCBNYXRoLm1heCgwLCBkIC0gbW9kZWwuZ2V0KCdkVCcpIC8gMikpKSlcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkKSA9PiB0aGlzLnNjYWxlcy54KG1vZGVsLmdldCgnZFQnKSArIE1hdGgubWluKDAsIGQgLSBtb2RlbC5nZXQoJ2RUJykgLyAyKSArIE1hdGgubWluKDAsIHJ1bnRpbWUgLSBkIC0gbW9kZWwuZ2V0KCdkVCcpIC8gMikpKVxuICAgICAgICB0aW1lYmFuZC5leGl0KCkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5zdmdzKSB7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLnNlbGVjdEFsbCgnLm9yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX2F4aXMnKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5zdmdzW2tleV0uc2VsZWN0QWxsKCcub3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fdGltZS1iYW5kJykucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3Znc1trZXldLnNlbGVjdEFsbCgnLm9yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX3N0ZCcpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnN2Z3Nba2V5XS5zZWxlY3RBbGwoJy5vcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoX19saW5lJykucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl19
