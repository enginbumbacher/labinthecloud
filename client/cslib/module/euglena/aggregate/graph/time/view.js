'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./graph.html'),
      LightGrid = require('euglena/aggregate/graph/lightgrid/grid'),
      d3 = require('d3');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(AggregateTimeGraphView, _DomView);

    function AggregateTimeGraphView(model, tmpl) {
      _classCallCheck(this, AggregateTimeGraphView);

      var _this = _possibleConstructorReturn(this, (AggregateTimeGraphView.__proto__ || Object.getPrototypeOf(AggregateTimeGraphView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);

      var svg = d3.select(_this.$el.find('.graph').get(0)).append('svg');
      svg.classed(model.get('graph_class'), true);
      svg.attr('width', '100%')
      // .attr('height', '100%')
      .attr('viewBox', '0 0 ' + (model.get('width') + model.get('margins.left') + model.get('margins.right')) + ' ' + (model.get('height') + model.get('margins.top') + model.get('margins.bottom'))).attr('preserveAspectRatio', 'xMinYMin');
      _this.svg = svg.append('g').attr('transform', 'translate(' + model.get('margins.left') + ', ' + model.get('margins.top') + ')');
      _this.scales = {};
      _this.scales.x = d3.scaleLinear().range([0, model.get('width')]);
      _this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);

      _this.grid = LightGrid.create();
      _this.addChild(_this.grid.view(), '.timegraph__lightgrid');

      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(AggregateTimeGraphView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == 'graph') {
          this.reset(evt.currentTarget);
          if (evt.data.value) {
            this.render(evt.currentTarget);
          }
        }
      }
    }, {
      key: 'reset',
      value: function reset(model) {
        this.svg.selectAll('.aggregate_time__line').remove();
        this.grid.reset();
      }
    }, {
      key: 'render',
      value: function render(model) {
        var _this2 = this;

        this.grid.update(model.get('graph.lights'));

        this.scales.x.domain([0, model.get('graph.runTime')]);

        var maxValue = Math.max(Math.abs(model.get('graph.minValue')), Math.abs(model.get('graph.maxValue')));
        this.scales.y.domain([model.get('graph.minValue') < 0 ? -maxValue : 0, maxValue]);
        this.axes = {
          x: d3.axisBottom().scale(this.scales.x),
          y: d3.axisLeft().scale(this.scales.y)
        };

        this.svg.selectAll('.aggregate_time__axis').remove();
        this.svg.append('g').attr('class', 'aggregate_time__axis aggregate_time__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(this.axes.x).append('text').attr('class', 'aggregate_time__axis-label').text('Time').attr('x', model.get('width') / 2).attr('y', 30);
        this.svg.append('g').attr('class', 'aggregate_time__axis aggregate_time__axis-y').call(this.axes.y).append('text').attr('class', 'aggregate_time__axis-label').text(model.get('axis_label')).attr('transform', 'rotate(-90)').attr('y', -30).attr('x', -model.get('height') / 2);

        for (var lineId in model.get('graph.lines')) {
          var ldata = model.get('graph.lines.' + lineId + '.data');
          var line = d3.line().x(function (d) {
            return _this2.scales.x(d.time);
          }).y(function (d) {
            return _this2.scales.y(d.value);
          });
          this.svg.append('path').datum(ldata).attr('class', 'aggregate_time__line aggregate_time__line__' + lineId).attr('d', line).style('stroke', model.get('graph.lines.' + lineId + '.color'));
        }
      }
    }, {
      key: 'toggleResult',
      value: function toggleResult(resId, shown) {
        this.svg.selectAll('.aggregate_time__line__' + resId).style("opacity", shown ? 0.8 : 0);
      }
    }]);

    return AggregateTimeGraphView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC90aW1lL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiTGlnaHRHcmlkIiwiZDMiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsInN2ZyIsInNlbGVjdCIsIiRlbCIsImZpbmQiLCJnZXQiLCJhcHBlbmQiLCJjbGFzc2VkIiwiYXR0ciIsInNjYWxlcyIsIngiLCJzY2FsZUxpbmVhciIsInJhbmdlIiwieSIsImdyaWQiLCJjcmVhdGUiLCJhZGRDaGlsZCIsInZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxDaGFuZ2UiLCJldnQiLCJkYXRhIiwicGF0aCIsInJlc2V0IiwiY3VycmVudFRhcmdldCIsInZhbHVlIiwicmVuZGVyIiwic2VsZWN0QWxsIiwicmVtb3ZlIiwidXBkYXRlIiwiZG9tYWluIiwibWF4VmFsdWUiLCJNYXRoIiwibWF4IiwiYWJzIiwiYXhlcyIsImF4aXNCb3R0b20iLCJzY2FsZSIsImF4aXNMZWZ0IiwiY2FsbCIsInRleHQiLCJsaW5lSWQiLCJsZGF0YSIsImxpbmUiLCJkIiwidGltZSIsImRhdHVtIiwic3R5bGUiLCJyZXNJZCIsInNob3duIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxVQUFVSixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUssV0FBV0wsUUFBUSxtQkFBUixDQURiO0FBQUEsTUFFRU0sWUFBWU4sUUFBUSx3Q0FBUixDQUZkO0FBQUEsTUFHRU8sS0FBS1AsUUFBUSxJQUFSLENBSFA7O0FBS0FBLFVB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Q0FsR0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL3RpbWUvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJylcbiAgXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9ncmFwaC5odG1sJyksXG4gICAgTGlnaHRHcmlkID0gcmVxdWlyZSgnZXVnbGVuYS9hZ2dyZWdhdGUvZ3JhcGgvbGlnaHRncmlkL2dyaWQnKSxcbiAgICBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBBZ2dyZWdhdGVUaW1lR3JhcGhWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Nb2RlbENoYW5nZSddKVxuXG4gICAgICBsZXQgc3ZnID0gZDMuc2VsZWN0KHRoaXMuJGVsLmZpbmQoJy5ncmFwaCcpLmdldCgwKSkuYXBwZW5kKCdzdmcnKTtcbiAgICAgIHN2Zy5jbGFzc2VkKG1vZGVsLmdldCgnZ3JhcGhfY2xhc3MnKSwgdHJ1ZSk7XG4gICAgICBzdmcuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAgIC8vIC5hdHRyKCdoZWlnaHQnLCAnMTAwJScpXG4gICAgICAgIC5hdHRyKCd2aWV3Qm94JywgYDAgMCAke21vZGVsLmdldCgnd2lkdGgnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5sZWZ0JykgKyBtb2RlbC5nZXQoJ21hcmdpbnMucmlnaHQnKX0gJHttb2RlbC5nZXQoJ2hlaWdodCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLnRvcCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLmJvdHRvbScpfWApXG4gICAgICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaW5ZTWluJylcbiAgICAgIHRoaXMuc3ZnID0gc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7bW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKX0sICR7bW9kZWwuZ2V0KCdtYXJnaW5zLnRvcCcpfSlgKTtcbiAgICAgIHRoaXMuc2NhbGVzID0ge307XG4gICAgICB0aGlzLnNjYWxlcy54ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgbW9kZWwuZ2V0KCd3aWR0aCcpXSk7XG4gICAgICB0aGlzLnNjYWxlcy55ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbbW9kZWwuZ2V0KCdoZWlnaHQnKSwgMF0pO1xuXG4gICAgICB0aGlzLmdyaWQgPSBMaWdodEdyaWQuY3JlYXRlKCk7XG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuZ3JpZC52aWV3KCksICcudGltZWdyYXBoX19saWdodGdyaWQnKVxuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gJ2dyYXBoJykge1xuICAgICAgICB0aGlzLnJlc2V0KGV2dC5jdXJyZW50VGFyZ2V0KVxuICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlcihldnQuY3VycmVudFRhcmdldClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KG1vZGVsKSB7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoYC5hZ2dyZWdhdGVfdGltZV9fbGluZWApLnJlbW92ZSgpXG4gICAgICB0aGlzLmdyaWQucmVzZXQoKTtcbiAgICB9XG5cbiAgICByZW5kZXIobW9kZWwpIHtcbiAgICAgIHRoaXMuZ3JpZC51cGRhdGUobW9kZWwuZ2V0KCdncmFwaC5saWdodHMnKSk7XG5cbiAgICAgIHRoaXMuc2NhbGVzLnguZG9tYWluKFswLCBtb2RlbC5nZXQoJ2dyYXBoLnJ1blRpbWUnKV0pO1xuXG4gICAgICBjb25zdCBtYXhWYWx1ZSA9IE1hdGgubWF4KE1hdGguYWJzKG1vZGVsLmdldCgnZ3JhcGgubWluVmFsdWUnKSksIE1hdGguYWJzKG1vZGVsLmdldCgnZ3JhcGgubWF4VmFsdWUnKSkpXG4gICAgICB0aGlzLnNjYWxlcy55LmRvbWFpbihbbW9kZWwuZ2V0KCdncmFwaC5taW5WYWx1ZScpIDwgMCA/IC1tYXhWYWx1ZSA6IDAsIG1heFZhbHVlXSk7XG4gICAgICB0aGlzLmF4ZXMgPSB7XG4gICAgICAgIHg6IGQzLmF4aXNCb3R0b20oKS5zY2FsZSh0aGlzLnNjYWxlcy54KSxcbiAgICAgICAgeTogZDMuYXhpc0xlZnQoKS5zY2FsZSh0aGlzLnNjYWxlcy55KVxuICAgICAgfTtcblxuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKGAuYWdncmVnYXRlX3RpbWVfX2F4aXNgKS5yZW1vdmUoKTtcbiAgICAgIHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsIGBhZ2dyZWdhdGVfdGltZV9fYXhpcyBhZ2dyZWdhdGVfdGltZV9fYXhpcy14YClcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttb2RlbC5nZXQoJ2hlaWdodCcpfSlgKVxuICAgICAgICAuY2FsbCh0aGlzLmF4ZXMueClcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYGFnZ3JlZ2F0ZV90aW1lX19heGlzLWxhYmVsYClcbiAgICAgICAgICAudGV4dCgnVGltZScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyKVxuICAgICAgICAgIC5hdHRyKCd5JywgMzApO1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgYGFnZ3JlZ2F0ZV90aW1lX19heGlzIGFnZ3JlZ2F0ZV90aW1lX19heGlzLXlgKVxuICAgICAgICAuY2FsbCh0aGlzLmF4ZXMueSlcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYGFnZ3JlZ2F0ZV90aW1lX19heGlzLWxhYmVsYClcbiAgICAgICAgICAudGV4dChtb2RlbC5nZXQoJ2F4aXNfbGFiZWwnKSlcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3JvdGF0ZSgtOTApJylcbiAgICAgICAgICAuYXR0cigneScsIC0zMClcbiAgICAgICAgICAuYXR0cigneCcsIC1tb2RlbC5nZXQoJ2hlaWdodCcpIC8gMik7XG5cbiAgICAgIGZvciAobGV0IGxpbmVJZCBpbiBtb2RlbC5nZXQoJ2dyYXBoLmxpbmVzJykpIHtcbiAgICAgICAgbGV0IGxkYXRhID0gbW9kZWwuZ2V0KGBncmFwaC5saW5lcy4ke2xpbmVJZH0uZGF0YWApXG4gICAgICAgIGxldCBsaW5lID0gZDMubGluZSgpXG4gICAgICAgICAgLngoKGQpID0+IHRoaXMuc2NhbGVzLngoZC50aW1lKSlcbiAgICAgICAgICAueSgoZCkgPT4gdGhpcy5zY2FsZXMueShkLnZhbHVlKSlcbiAgICAgICAgdGhpcy5zdmcuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgICAuZGF0dW0obGRhdGEpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYGFnZ3JlZ2F0ZV90aW1lX19saW5lIGFnZ3JlZ2F0ZV90aW1lX19saW5lX18ke2xpbmVJZH1gKVxuICAgICAgICAgIC5hdHRyKCdkJywgbGluZSlcbiAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIG1vZGVsLmdldChgZ3JhcGgubGluZXMuJHtsaW5lSWR9LmNvbG9yYCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZVJlc3VsdChyZXNJZCwgc2hvd24pIHtcbiAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbChgLmFnZ3JlZ2F0ZV90aW1lX19saW5lX18ke3Jlc0lkfWApLnN0eWxlKFwib3BhY2l0eVwiLCBzaG93biA/IDAuOCA6IDApXG4gICAgfVxuICB9XG59KSJdfQ==
