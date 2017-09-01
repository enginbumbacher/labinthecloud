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
      d3 = require('d3');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(OrientationIntensityGraphView, _DomView);

    function OrientationIntensityGraphView(model, tmpl) {
      _classCallCheck(this, OrientationIntensityGraphView);

      var _this = _possibleConstructorReturn(this, (OrientationIntensityGraphView.__proto__ || Object.getPrototypeOf(OrientationIntensityGraphView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);

      var svg = d3.select(_this.$el.find('.graph').get(0)).append('svg');
      svg.classed(model.get('graph_class'), true);
      svg.attr('width', '100%')
      // .attr('height', '100%')
      .attr('viewBox', '0 0 ' + (model.get('width') + model.get('margins.left') + model.get('margins.right')) + ' ' + (model.get('height') + model.get('margins.top') + model.get('margins.bottom'))).attr('preserveAspectRatio', 'xMinYMin');
      _this.svg = svg.append('g').attr('transform', 'translate(' + model.get('margins.left') + ', ' + model.get('margins.top') + ')');
      _this.scales = {};
      _this.scales.x = d3.scaleLinear().range([0, model.get('width')]).domain([-180, 180]);
      _this.scales.y = d3.scaleLinear().range([model.get('height'), 0]).domain([-180, 180]);
      _this.axes = {
        x: d3.axisBottom().scale(_this.scales.x).tickValues([-180, -135, -90, -45, 0, 45, 90, 135, 180]),
        y: d3.axisLeft().scale(_this.scales.y).tickValues([-180, -135, -90, -45, 0, 45, 90, 135, 180])
      };
      _this.svg.append('g').attr('class', 'ordir__axis ordir__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(_this.axes.x).append('text').attr('class', 'ordir__axis-label').text('Light Direction').attr('x', model.get('width') / 2).attr('y', 30);
      _this.svg.append('g').attr('class', 'ordir__axis ordir__axis-y').call(_this.axes.y).append('text').attr('class', 'ordir__axis-label').text('Avg. Orientation WRT Light Direction').attr('transform', 'rotate(-90)').attr('y', -30).attr('x', -model.get('height') / 2);

      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(OrientationIntensityGraphView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "graph") {
          this.reset();
          this.render(evt.currentTarget);
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.svg.selectAll('.ordir__pt').remove();
      }
    }, {
      key: 'render',
      value: function render(model) {
        var _this2 = this;

        var histograms = model.get('graph.histograms');
        var columns = [];
        Object.values(histograms).forEach(function (hist) {
          Object.keys(hist.data).forEach(function (key) {
            if (!columns.includes(key)) columns.push(key);
          });
        });
        columns.sort(function (a, b) {
          return +a - +b;
        });

        var circle = d3.symbol().size(20);

        histograms.forEach(function (hist) {
          Object.values(hist.data).forEach(function (hd) {
            _this2.svg.append('path').attr('d', circle).attr('class', 'ordir__pt ordir__pt__' + hist.id).attr('fill', hist.color).attr('transform', 'translate(' + _this2.scales.x(hd.angle * 180 / Math.PI) + ', ' + _this2.scales.y(hd.value) + ')').style('opacity', 0.95);
          });
        });
      }
    }, {
      key: 'toggleResult',
      value: function toggleResult(resId, shown) {
        this.svg.selectAll('.ordir__pt__' + resId).style("opacity", shown ? 0.75 : 0);
      }
    }]);

    return OrientationIntensityGraphView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9kaXJlY3Rpb24vdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJkMyIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwic3ZnIiwic2VsZWN0IiwiJGVsIiwiZmluZCIsImdldCIsImFwcGVuZCIsImNsYXNzZWQiLCJhdHRyIiwic2NhbGVzIiwieCIsInNjYWxlTGluZWFyIiwicmFuZ2UiLCJkb21haW4iLCJ5IiwiYXhlcyIsImF4aXNCb3R0b20iLCJzY2FsZSIsInRpY2tWYWx1ZXMiLCJheGlzTGVmdCIsImNhbGwiLCJ0ZXh0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJyZXNldCIsInJlbmRlciIsImN1cnJlbnRUYXJnZXQiLCJzZWxlY3RBbGwiLCJyZW1vdmUiLCJoaXN0b2dyYW1zIiwiY29sdW1ucyIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJoaXN0Iiwia2V5cyIsImtleSIsImluY2x1ZGVzIiwicHVzaCIsInNvcnQiLCJhIiwiYiIsImNpcmNsZSIsInN5bWJvbCIsInNpemUiLCJoZCIsImlkIiwiY29sb3IiLCJhbmdsZSIsIk1hdGgiLCJQSSIsInZhbHVlIiwic3R5bGUiLCJyZXNJZCIsInNob3duIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxVQUFVSixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUssV0FBV0wsUUFBUSxtQkFBUixDQURiO0FBQUEs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a0MwQixLQUFsQyxFQUEyQ0QsS0FBM0MsQ0FBaUQsU0FBakQsRUFBNERFLFFBQVEsSUFBUixHQUFlLENBQTNFO0FBQ0Q7QUFoRkg7O0FBQUE7QUFBQSxJQUFtRDlELE9BQW5EO0FBa0ZELENBN0ZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9kaXJlY3Rpb24vdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJylcbiAgXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9ncmFwaC5odG1sJyksXG4gICAgZDMgPSByZXF1aXJlKCdkMycpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgT3JpZW50YXRpb25JbnRlbnNpdHlHcmFwaFZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJ10pXG5cbiAgICAgIGxldCBzdmcgPSBkMy5zZWxlY3QodGhpcy4kZWwuZmluZCgnLmdyYXBoJykuZ2V0KDApKS5hcHBlbmQoJ3N2ZycpO1xuICAgICAgc3ZnLmNsYXNzZWQobW9kZWwuZ2V0KCdncmFwaF9jbGFzcycpLCB0cnVlKTtcbiAgICAgIHN2Zy5hdHRyKCd3aWR0aCcsICcxMDAlJylcbiAgICAgICAgLy8gLmF0dHIoJ2hlaWdodCcsICcxMDAlJylcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBgMCAwICR7bW9kZWwuZ2V0KCd3aWR0aCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5yaWdodCcpfSAke21vZGVsLmdldCgnaGVpZ2h0JykgKyBtb2RlbC5nZXQoJ21hcmdpbnMudG9wJykgKyBtb2RlbC5nZXQoJ21hcmdpbnMuYm90dG9tJyl9YClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pbllNaW4nKVxuICAgICAgdGhpcy5zdmcgPSBzdmcuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHttb2RlbC5nZXQoJ21hcmdpbnMubGVmdCcpfSwgJHttb2RlbC5nZXQoJ21hcmdpbnMudG9wJyl9KWApO1xuICAgICAgdGhpcy5zY2FsZXMgPSB7fTtcbiAgICAgIHRoaXMuc2NhbGVzLnggPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFswLCBtb2RlbC5nZXQoJ3dpZHRoJyldKS5kb21haW4oWy0xODAsIDE4MF0pO1xuICAgICAgdGhpcy5zY2FsZXMueSA9IGQzLnNjYWxlTGluZWFyKCkucmFuZ2UoW21vZGVsLmdldCgnaGVpZ2h0JyksIDBdKS5kb21haW4oWy0xODAsIDE4MF0pO1xuICAgICAgdGhpcy5heGVzID0ge1xuICAgICAgICB4OiBkMy5heGlzQm90dG9tKCkuc2NhbGUodGhpcy5zY2FsZXMueCkudGlja1ZhbHVlcyhbLTE4MCwtMTM1LC05MCwtNDUsMCw0NSw5MCwxMzUsMTgwXSksXG4gICAgICAgIHk6IGQzLmF4aXNMZWZ0KCkuc2NhbGUodGhpcy5zY2FsZXMueSkudGlja1ZhbHVlcyhbLTE4MCwtMTM1LC05MCwtNDUsMCw0NSw5MCwxMzUsMTgwXSlcbiAgICAgIH07XG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCBgb3JkaXJfX2F4aXMgb3JkaXJfX2F4aXMteGApXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bW9kZWwuZ2V0KCdoZWlnaHQnKX0pYClcbiAgICAgICAgLmNhbGwodGhpcy5heGVzLngpXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGBvcmRpcl9fYXhpcy1sYWJlbGApXG4gICAgICAgICAgLnRleHQoJ0xpZ2h0IERpcmVjdGlvbicpXG4gICAgICAgICAgLmF0dHIoJ3gnLCBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyKVxuICAgICAgICAgIC5hdHRyKCd5JywgMzApO1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgYG9yZGlyX19heGlzIG9yZGlyX19heGlzLXlgKVxuICAgICAgICAuY2FsbCh0aGlzLmF4ZXMueSlcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgYG9yZGlyX19heGlzLWxhYmVsYClcbiAgICAgICAgICAudGV4dCgnQXZnLiBPcmllbnRhdGlvbiBXUlQgTGlnaHQgRGlyZWN0aW9uJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3JvdGF0ZSgtOTApJylcbiAgICAgICAgICAuYXR0cigneScsIC0zMClcbiAgICAgICAgICAuYXR0cigneCcsIC1tb2RlbC5nZXQoJ2hlaWdodCcpIC8gMik7XG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJncmFwaFwiKSB7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5zdmcuc2VsZWN0QWxsKCcub3JkaXJfX3B0JykucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKG1vZGVsKSB7XG4gICAgICBjb25zdCBoaXN0b2dyYW1zID0gbW9kZWwuZ2V0KCdncmFwaC5oaXN0b2dyYW1zJylcbiAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXTtcbiAgICAgIE9iamVjdC52YWx1ZXMoaGlzdG9ncmFtcykuZm9yRWFjaCgoaGlzdCkgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhoaXN0LmRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmICghY29sdW1ucy5pbmNsdWRlcyhrZXkpKSBjb2x1bW5zLnB1c2goa2V5KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGNvbHVtbnMuc29ydCgoYSxiKSA9PiAoK2EpIC0gKCtiKSk7XG5cbiAgICAgIGxldCBjaXJjbGUgPSBkMy5zeW1ib2woKVxuICAgICAgICAuc2l6ZSgyMClcblxuICAgICAgaGlzdG9ncmFtcy5mb3JFYWNoKChoaXN0KSA9PiB7XG4gICAgICAgIE9iamVjdC52YWx1ZXMoaGlzdC5kYXRhKS5mb3JFYWNoKChoZCkgPT4ge1xuICAgICAgICAgIHRoaXMuc3ZnLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAuYXR0cignZCcsIGNpcmNsZSlcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGBvcmRpcl9fcHQgb3JkaXJfX3B0X18ke2hpc3QuaWR9YClcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgaGlzdC5jb2xvcilcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7dGhpcy5zY2FsZXMueChoZC5hbmdsZSAqIDE4MCAvIE1hdGguUEkpfSwgJHt0aGlzLnNjYWxlcy55KGhkLnZhbHVlKX0pYClcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDAuOTUpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRvZ2dsZVJlc3VsdChyZXNJZCwgc2hvd24pIHtcbiAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbChgLm9yZGlyX19wdF9fJHtyZXNJZH1gKS5zdHlsZShcIm9wYWNpdHlcIiwgc2hvd24gPyAwLjc1IDogMClcbiAgICB9XG4gIH1cbn0pOyJdfQ==
