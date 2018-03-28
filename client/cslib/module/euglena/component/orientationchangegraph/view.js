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

      _this.svg = d3.select(_this.$el.find('.orientation-change__graph').get(0)).append('svg');
      _this.svg.classed('orientation-change__graph', true);
      _this.svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
      _this.svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
      _this.svg.append('g').attr('transform', 'translate(' + model.get('margins.left') + ', ' + model.get('margins.top') + ')');

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
        this.scales.y.domain([0, Object.values(model.get('data')).reduce(function (acc, val) {
          return Math.max(acc, 90);
        }, 0)]);

        this.axes = {
          x: d3.axisBottom().scale(this.scales.x),
          y: d3.axisLeft().scale(this.scales.y)
        };
        this.svg.select('.orientation-change__graph__axis').remove();
        this.svg.append('g').attr('class', 'orientation-change__graph__axis orientation-change__graph__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(this.axes.x).append('text').attr('class', 'orientation-change__graph__axis-label').text('Time [seconds]').attr('x', model.get('width') / 2).attr('y', 30);
        this.svg.append('g').attr('class', 'orientation-change__graph__axis orientation-change__graph__axis-y').call(this.axes.y).append('text').attr('class', 'orientation-change__graph__axis-label').text('Avg Change in orientation per Second [degrees / second]').attr('transform', 'rotate(-90)').attr('y', -30).attr('x', -model.get('height') / 2);

        this.bgs = this.svg.append('g').attr('class', 'orientation-change__graph__background');

        for (var layer in model.get('data')) {
          if (!model.get('data.' + layer + '.showLayer')) {
            continue;
          }
          var graphdata = model.get('data.' + layer + '.graphs').filter(function (item) {
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
            this.svg.append('path').datum(graphdata).attr('class', 'orientation-change__graph__std orientation-change__graph__std__' + layer).attr('style', color ? 'fill: #' + color.toString(16) : null).attr('d', std);
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
          this.svg.append('path').datum(graphdata).attr('class', 'orientation-change__graph__line orientation-change__graph__line__' + layer).attr('style', color ? 'stroke: #' + color.toString(16) : null).attr('d', line);
        }
      }
    }, {
      key: 'update',
      value: function update(timestamp, model) {
        var _this3 = this;

        var runtime = Object.values(model.get('data')).reduce(function (acc, val) {
          return Math.max(acc, val.runTime);
        }, 0);
        var timeband = this.bgs.selectAll('.orientation-change__graph__time-band').data([timestamp]);
        timeband.enter().append('rect').attr('class', 'orientation-change__graph__time-band').attr('y', 0).attr('height', model.get('height')).merge(timeband).transition().duration(0).attr('x', function (d) {
          return _this3.scales.x(Math.min(runtime, Math.max(0, d - model.get('dT') / 2)));
        }).attr('width', function (d) {
          return _this3.scales.x(model.get('dT') + Math.min(0, d - model.get('dT') / 2) + Math.min(0, runtime - d - model.get('dT') / 2));
        });
        timeband.exit().remove();
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.svg.selectAll('.orientation-change__graph__axis').remove();
        this.svg.selectAll('.orientation-change__graph__time-band').remove();
        this.svg.selectAll('.orientation-change__graph__std').remove();
        this.svg.selectAll('.orientation-change__graph__line').remove();
      }
    }]);

    return OrientationChangeView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9vcmllbnRhdGlvbmNoYW5nZWdyYXBoL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJVdGlscyIsImQzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsInN2ZyIsInNlbGVjdCIsIiRlbCIsImZpbmQiLCJnZXQiLCJhcHBlbmQiLCJjbGFzc2VkIiwiYXR0ciIsInNjYWxlcyIsIngiLCJzY2FsZUxpbmVhciIsInJhbmdlIiwieSIsImV2dCIsImRhdGEiLCJwYXRoIiwidmFsdWUiLCJyZXNldCIsInNldHVwIiwiY3VycmVudFRhcmdldCIsImRvbWFpbiIsIk9iamVjdCIsInZhbHVlcyIsInJlZHVjZSIsImFjYyIsInZhbCIsIk1hdGgiLCJtYXgiLCJydW5UaW1lIiwiYXhlcyIsImF4aXNCb3R0b20iLCJzY2FsZSIsImF4aXNMZWZ0IiwicmVtb3ZlIiwiY2FsbCIsInRleHQiLCJiZ3MiLCJsYXllciIsImdyYXBoZGF0YSIsImZpbHRlciIsIml0ZW0iLCJtZWFuIiwiY29sb3IiLCJzdGQiLCJhcmVhIiwiZCIsInRpbWUiLCJ5MCIsInMiLCJ5MSIsImRhdHVtIiwidG9TdHJpbmciLCJsaW5lIiwidGltZXN0YW1wIiwicnVudGltZSIsInRpbWViYW5kIiwic2VsZWN0QWxsIiwiZW50ZXIiLCJtZXJnZSIsInRyYW5zaXRpb24iLCJkdXJhdGlvbiIsIm1pbiIsImV4aXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEsSUFBUixDQUZQO0FBQUEsTUFHRUksV0FBV0osUUFBUSxvQ0FBUixD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QyxHQUFMLENBQVN3RCxTQUFULENBQW1CLGlDQUFuQixFQUFzRHZCLE1BQXREO0FBQ0EsYUFBS2pDLEdBQUwsQ0FBU3dELFNBQVQsQ0FBbUIsa0NBQW5CLEVBQXVEdkIsTUFBdkQ7QUFDRDtBQXBISDs7QUFBQTtBQUFBLElBQTJDMUMsT0FBM0M7QUFzSEQsQ0E5SEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L29yaWVudGF0aW9uY2hhbmdlZ3JhcGgvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBkMyA9IHJlcXVpcmUoJ2QzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vb3JpZW50YXRpb25jaGFuZ2VncmFwaC5odG1sJylcbiAgO1xuICByZXF1aXJlKCdsaW5rIS4vb3JpZW50YXRpb25jaGFuZ2VncmFwaC5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgT3JpZW50YXRpb25DaGFuZ2VWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Nb2RlbENoYW5nZSddKTtcblxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSk7XG5cbiAgICAgIHRoaXMuc3ZnID0gZDMuc2VsZWN0KHRoaXMuJGVsLmZpbmQoJy5vcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoJykuZ2V0KDApKS5hcHBlbmQoJ3N2ZycpO1xuICAgICAgdGhpcy5zdmcuY2xhc3NlZChgb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaGAsIHRydWUpO1xuICAgICAgdGhpcy5zdmcuYXR0cignd2lkdGgnLCBtb2RlbC5nZXQoJ3dpZHRoJykgKyBtb2RlbC5nZXQoJ21hcmdpbnMubGVmdCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLnJpZ2h0JykpO1xuICAgICAgdGhpcy5zdmcuYXR0cignaGVpZ2h0JywgbW9kZWwuZ2V0KCdoZWlnaHQnKSArIG1vZGVsLmdldCgnbWFyZ2lucy50b3AnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5ib3R0b20nKSk7XG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7bW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKX0sICR7bW9kZWwuZ2V0KCdtYXJnaW5zLnRvcCcpfSlgKTtcblxuICAgICAgdGhpcy5zY2FsZXMgPSB7fTtcbiAgICAgIHRoaXMuc2NhbGVzLnggPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFswLCBtb2RlbC5nZXQoJ3dpZHRoJyldKTtcbiAgICAgIHRoaXMuc2NhbGVzLnkgPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFttb2RlbC5nZXQoJ2hlaWdodCcpLCAwXSk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzd2l0Y2ggKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSBcImRhdGFcIjpcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0dXAoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwKG1vZGVsKSB7XG4gICAgICB0aGlzLnNjYWxlcy54LmRvbWFpbihbMCwgT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCB2YWwucnVuVGltZSksIDApXSk7XG4gICAgICB0aGlzLnNjYWxlcy55LmRvbWFpbihbMCwgT2JqZWN0LnZhbHVlcyhtb2RlbC5nZXQoJ2RhdGEnKSkucmVkdWNlKChhY2MsIHZhbCkgPT4gTWF0aC5tYXgoYWNjLCA5MCksIDApXSk7XG5cbiAgICAgIHRoaXMuYXhlcyA9IHtcbiAgICAgICAgeDogZDMuYXhpc0JvdHRvbSgpLnNjYWxlKHRoaXMuc2NhbGVzLngpLFxuICAgICAgICB5OiBkMy5heGlzTGVmdCgpLnNjYWxlKHRoaXMuc2NhbGVzLnkpXG4gICAgICB9O1xuICAgICAgdGhpcy5zdmcuc2VsZWN0KCcub3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fYXhpcycpLnJlbW92ZSgpO1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ29yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX2F4aXMgb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fYXhpcy14JylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttb2RlbC5nZXQoJ2hlaWdodCcpfSlgKVxuICAgICAgICAuY2FsbCh0aGlzLmF4ZXMueClcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ29yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX2F4aXMtbGFiZWwnKVxuICAgICAgICAgIC50ZXh0KCdUaW1lIFtzZWNvbmRzXScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyKVxuICAgICAgICAgIC5hdHRyKCd5JywgMzApO1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ29yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX2F4aXMgb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fYXhpcy15JylcbiAgICAgICAgLmNhbGwodGhpcy5heGVzLnkpXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdvcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoX19heGlzLWxhYmVsJylcbiAgICAgICAgICAudGV4dChgQXZnIENoYW5nZSBpbiBvcmllbnRhdGlvbiBwZXIgU2Vjb25kIFtkZWdyZWVzIC8gc2Vjb25kXWApXG4gICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICdyb3RhdGUoLTkwKScpXG4gICAgICAgICAgLmF0dHIoJ3knLCAtMzApXG4gICAgICAgICAgLmF0dHIoJ3gnLCAtbW9kZWwuZ2V0KCdoZWlnaHQnKSAvIDIpO1xuXG4gICAgICB0aGlzLmJncyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdvcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoX19iYWNrZ3JvdW5kJyk7XG5cbiAgICAgIGZvciAobGV0IGxheWVyIGluIG1vZGVsLmdldCgnZGF0YScpKSB7XG4gICAgICAgIGlmICghbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LnNob3dMYXllcmApKSB7Y29udGludWV9XG4gICAgICAgIGxldCBncmFwaGRhdGEgPSBtb2RlbC5nZXQoYGRhdGEuJHtsYXllcn0uZ3JhcGhzYCkuZmlsdGVyKChpdGVtKSA9PiBpdGVtLm1lYW4pO1xuICAgICAgICBsZXQgY29sb3IgPSBtb2RlbC5nZXQoYGRhdGEuJHtsYXllcn0uY29sb3JgKVxuICAgICAgICBpZiAobW9kZWwuZ2V0KCdzdGRCYW5kJykpIHtcbiAgICAgICAgICBsZXQgc3RkID0gZDMuYXJlYSgpXG4gICAgICAgICAgICAueCgoZCkgPT4gdGhpcy5zY2FsZXMueChkLnRpbWUpKVxuICAgICAgICAgICAgLnkwKChkKSA9PiB0aGlzLnNjYWxlcy55KGQubWVhbiAtIGQucykpXG4gICAgICAgICAgICAueTEoKGQpID0+IHRoaXMuc2NhbGVzLnkoZC5tZWFuICsgZC5zKSk7XG4gICAgICAgICAgdGhpcy5zdmcuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAgIC5kYXR1bShncmFwaGRhdGEpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBgb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fc3RkIG9yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX3N0ZF9fJHtsYXllcn1gKVxuICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgY29sb3IgPyBgZmlsbDogIyR7Y29sb3IudG9TdHJpbmcoMTYpfWAgOiBudWxsKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCBzdGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRnVuY3Rpb24gdG8gYmUgdXNlZCBmb3IgcGxvdHRpbmdcbiAgICAgICAgLy8gSXQgZGVmaW5lcyB0aGF0IGl0IHRha2VzIGZvciBlYWNoIGRhdGEgcG9pbnQgdGhlIHRpbWUgZWxlbWVudCBhbmQgdGhlIG1lYW4gYW5kIHBsb3RzIGl0IGluIHgseS5cbiAgICAgICAgLy8gLmRhdHVtKGdyYXBoZGF0YSk6IFRoYXQncyB0aGUgZGF0YSBvbiB3aGljaCB0byBhcHBseSB0aGUgZnVuY3Rpb24uXG4gICAgICAgIC8vIC5hdHRyKCk6IENoYXJhY3RlcmlzdGljcyBvZiB0aGUgc3ZnLlxuICAgICAgICAvLyAuYXR0cignZCcsbGluZSkgaXMgd2hlcmUgdGhlIGRhdHVtIGdldHMgdHJhbnNmb3JtZWQgaW50byB0aGUgbGluZS5cbiAgICAgICAgbGV0IGxpbmUgPSBkMy5saW5lKClcbiAgICAgICAgICAueCgoZCkgPT4gdGhpcy5zY2FsZXMueChkLnRpbWUpKVxuICAgICAgICAgIC55KChkKSA9PiB0aGlzLnNjYWxlcy55KGQubWVhbikpXG4gICAgICAgIHRoaXMuc3ZnLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmRhdHVtKGdyYXBoZGF0YSlcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBgb3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fbGluZSBvcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoX19saW5lX18ke2xheWVyfWApXG4gICAgICAgICAgLmF0dHIoJ3N0eWxlJywgY29sb3IgPyBgc3Ryb2tlOiAjJHtjb2xvci50b1N0cmluZygxNil9YCA6IG51bGwpXG4gICAgICAgICAgLmF0dHIoJ2QnLCBsaW5lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGUodGltZXN0YW1wLCBtb2RlbCkge1xuICAgICAgbGV0IHJ1bnRpbWUgPSBPYmplY3QudmFsdWVzKG1vZGVsLmdldCgnZGF0YScpKS5yZWR1Y2UoKGFjYywgdmFsKSA9PiBNYXRoLm1heChhY2MsIHZhbC5ydW5UaW1lKSwgMCk7XG4gICAgICBsZXQgdGltZWJhbmQgPSB0aGlzLmJncy5zZWxlY3RBbGwoJy5vcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoX190aW1lLWJhbmQnKVxuICAgICAgICAuZGF0YShbdGltZXN0YW1wXSlcbiAgICAgIHRpbWViYW5kLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ29yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX3RpbWUtYmFuZCcpXG4gICAgICAgIC5hdHRyKCd5JywgMClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIG1vZGVsLmdldCgnaGVpZ2h0JykpXG4gICAgICAgIC5tZXJnZSh0aW1lYmFuZClcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbigwKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHRoaXMuc2NhbGVzLngoTWF0aC5taW4ocnVudGltZSwgTWF0aC5tYXgoMCwgZCAtIG1vZGVsLmdldCgnZFQnKSAvIDIpKSkpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQpID0+IHRoaXMuc2NhbGVzLngobW9kZWwuZ2V0KCdkVCcpICsgTWF0aC5taW4oMCwgZCAtIG1vZGVsLmdldCgnZFQnKSAvIDIpICsgTWF0aC5taW4oMCwgcnVudGltZSAtIGQgLSBtb2RlbC5nZXQoJ2RUJykgLyAyKSkpXG4gICAgICB0aW1lYmFuZC5leGl0KCkucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5vcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoX19heGlzJykucmVtb3ZlKCk7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5vcmllbnRhdGlvbi1jaGFuZ2VfX2dyYXBoX190aW1lLWJhbmQnKS5yZW1vdmUoKTtcbiAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLm9yaWVudGF0aW9uLWNoYW5nZV9fZ3JhcGhfX3N0ZCcpLnJlbW92ZSgpO1xuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcub3JpZW50YXRpb24tY2hhbmdlX19ncmFwaF9fbGluZScpLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxufSlcbiJdfQ==
