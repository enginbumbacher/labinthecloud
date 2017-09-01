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
      _this.scales.x = d3.scalePoint().range([0, model.get('width')]).padding(0.5);
      _this.scales.y = d3.scaleLinear().range([model.get('height'), 0]);

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
        this.svg.selectAll('.orin__axis').remove();
        this.svg.selectAll('.orin__pt').remove();
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
        this.scales.x.domain(columns);
        this.scales.y.domain([-180, 180]);
        this.axes = {
          x: d3.axisBottom().scale(this.scales.x),
          y: d3.axisLeft().scale(this.scales.y).tickValues([-180, -135, -90, -45, 0, 45, 90, 135, 180])
        };
        this.svg.selectAll('.orin__axis').remove();
        this.svg.append('g').attr('class', 'orin__axis orin__axis-x').attr('transform', 'translate(0, ' + model.get('height') + ')').call(this.axes.x).append('text').attr('class', 'orin__axis-label').text('Light Intensity').attr('x', model.get('width') / 2).attr('y', 30);
        this.svg.append('g').attr('class', 'orin__axis orin__axis-y').call(this.axes.y).append('text').attr('class', 'orin__axis-label').text('Avg. Orientation WRT Light Direction').attr('transform', 'rotate(-90)').attr('y', -30).attr('x', -model.get('height') / 2);

        var circle = d3.symbol().size(20);

        Object.values(histograms).forEach(function (hist) {
          for (var key in hist.data) {
            _this2.svg.append('path').attr('d', circle).attr('class', 'orin__pt orin__pt__' + hist.id).attr('fill', hist.color).attr('transform', 'translate(' + _this2.scales.x(key) + ', ' + _this2.scales.y(hist.data[key].value) + ')').style('opacity', 0.95);
          }
        });
      }
    }, {
      key: 'toggleResult',
      value: function toggleResult(resId, shown) {
        this.svg.selectAll('.orin__pt__' + resId).style("opacity", shown ? 0.75 : 0);
      }
    }]);

    return OrientationIntensityGraphView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9pbnRlbnNpdHkvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJkMyIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwic3ZnIiwic2VsZWN0IiwiJGVsIiwiZmluZCIsImdldCIsImFwcGVuZCIsImNsYXNzZWQiLCJhdHRyIiwic2NhbGVzIiwieCIsInNjYWxlUG9pbnQiLCJyYW5nZSIsInBhZGRpbmciLCJ5Iiwic2NhbGVMaW5lYXIiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxDaGFuZ2UiLCJldnQiLCJkYXRhIiwicGF0aCIsInJlc2V0IiwicmVuZGVyIiwiY3VycmVudFRhcmdldCIsInNlbGVjdEFsbCIsInJlbW92ZSIsImhpc3RvZ3JhbXMiLCJjb2x1bW5zIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsImhpc3QiLCJrZXlzIiwia2V5IiwiaW5jbHVkZXMiLCJwdXNoIiwic29ydCIsImEiLCJiIiwiZG9tYWluIiwiYXhlcyIsImF4aXNCb3R0b20iLCJzY2FsZSIsImF4aXNMZWZ0IiwidGlja1ZhbHVlcyIsImNhbGwiLCJ0ZXh0IiwiY2lyY2xlIiwic3ltYm9sIiwic2l6ZSIsImlkIiwiY29sb3IiLCJ2YWx1ZSIsInN0eWxlIiwicmVzSWQiLCJzaG93biJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksVUFBVUosUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VLLFdBQVdMLFFBQVEsbUJBQVIsQ0FEYjtBQUFBLE1B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QUFpQzhCLEtBQWpDLEVBQTBDRCxLQUExQyxDQUFnRCxTQUFoRCxFQUEyREUsUUFBUSxJQUFSLEdBQWUsQ0FBMUU7QUFDRDtBQXBGSDs7QUFBQTtBQUFBLElBQW1ENUQsT0FBbkQ7QUFzRkQsQ0FqR0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL29yaWVudGF0aW9uX2ludGVuc2l0eS92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKVxuICBcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL2dyYXBoLmh0bWwnKSxcbiAgICBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBPcmllbnRhdGlvbkludGVuc2l0eUdyYXBoVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uTW9kZWxDaGFuZ2UnXSlcblxuICAgICAgbGV0IHN2ZyA9IGQzLnNlbGVjdCh0aGlzLiRlbC5maW5kKCcuZ3JhcGgnKS5nZXQoMCkpLmFwcGVuZCgnc3ZnJyk7XG4gICAgICBzdmcuY2xhc3NlZChtb2RlbC5nZXQoJ2dyYXBoX2NsYXNzJyksIHRydWUpO1xuICAgICAgc3ZnLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgICAvLyAuYXR0cignaGVpZ2h0JywgJzEwMCUnKVxuICAgICAgICAuYXR0cigndmlld0JveCcsIGAwIDAgJHttb2RlbC5nZXQoJ3dpZHRoJykgKyBtb2RlbC5nZXQoJ21hcmdpbnMubGVmdCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLnJpZ2h0Jyl9ICR7bW9kZWwuZ2V0KCdoZWlnaHQnKSArIG1vZGVsLmdldCgnbWFyZ2lucy50b3AnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5ib3R0b20nKX1gKVxuICAgICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWluWU1pbicpXG4gICAgICB0aGlzLnN2ZyA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21vZGVsLmdldCgnbWFyZ2lucy5sZWZ0Jyl9LCAke21vZGVsLmdldCgnbWFyZ2lucy50b3AnKX0pYCk7XG4gICAgICB0aGlzLnNjYWxlcyA9IHt9O1xuICAgICAgdGhpcy5zY2FsZXMueCA9IGQzLnNjYWxlUG9pbnQoKS5yYW5nZShbMCwgbW9kZWwuZ2V0KCd3aWR0aCcpXSkucGFkZGluZygwLjUpO1xuICAgICAgdGhpcy5zY2FsZXMueSA9IGQzLnNjYWxlTGluZWFyKCkucmFuZ2UoW21vZGVsLmdldCgnaGVpZ2h0JyksIDBdKTtcblxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSBcImdyYXBoXCIpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB0aGlzLnJlbmRlcihldnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5vcmluX19heGlzJykucmVtb3ZlKCk7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoJy5vcmluX19wdCcpLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJlbmRlcihtb2RlbCkge1xuICAgICAgY29uc3QgaGlzdG9ncmFtcyA9IG1vZGVsLmdldCgnZ3JhcGguaGlzdG9ncmFtcycpXG4gICAgICBjb25zdCBjb2x1bW5zID0gW107XG4gICAgICBPYmplY3QudmFsdWVzKGhpc3RvZ3JhbXMpLmZvckVhY2goKGhpc3QpID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoaGlzdC5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoIWNvbHVtbnMuaW5jbHVkZXMoa2V5KSkgY29sdW1ucy5wdXNoKGtleSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBjb2x1bW5zLnNvcnQoKGEsYikgPT4gKCthKSAtICgrYikpO1xuICAgICAgdGhpcy5zY2FsZXMueC5kb21haW4oY29sdW1ucylcbiAgICAgIHRoaXMuc2NhbGVzLnkuZG9tYWluKFstMTgwLCAxODBdKVxuICAgICAgdGhpcy5heGVzID0ge1xuICAgICAgICB4OiBkMy5heGlzQm90dG9tKCkuc2NhbGUodGhpcy5zY2FsZXMueCksXG4gICAgICAgIHk6IGQzLmF4aXNMZWZ0KCkuc2NhbGUodGhpcy5zY2FsZXMueSkudGlja1ZhbHVlcyhbLTE4MCwtMTM1LC05MCwtNDUsMCw0NSw5MCwxMzUsMTgwXSlcbiAgICAgIH07XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoYC5vcmluX19heGlzYCkucmVtb3ZlKCk7XG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCBgb3Jpbl9fYXhpcyBvcmluX19heGlzLXhgKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21vZGVsLmdldCgnaGVpZ2h0Jyl9KWApXG4gICAgICAgIC5jYWxsKHRoaXMuYXhlcy54KVxuICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCBgb3Jpbl9fYXhpcy1sYWJlbGApXG4gICAgICAgICAgLnRleHQoJ0xpZ2h0IEludGVuc2l0eScpXG4gICAgICAgICAgLmF0dHIoJ3gnLCBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyKVxuICAgICAgICAgIC5hdHRyKCd5JywgMzApO1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgYG9yaW5fX2F4aXMgb3Jpbl9fYXhpcy15YClcbiAgICAgICAgLmNhbGwodGhpcy5heGVzLnkpXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGBvcmluX19heGlzLWxhYmVsYClcbiAgICAgICAgICAudGV4dCgnQXZnLiBPcmllbnRhdGlvbiBXUlQgTGlnaHQgRGlyZWN0aW9uJylcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3JvdGF0ZSgtOTApJylcbiAgICAgICAgICAuYXR0cigneScsIC0zMClcbiAgICAgICAgICAuYXR0cigneCcsIC1tb2RlbC5nZXQoJ2hlaWdodCcpIC8gMik7XG5cbiAgICAgIGxldCBjaXJjbGUgPSBkMy5zeW1ib2woKVxuICAgICAgICAuc2l6ZSgyMClcblxuICAgICAgT2JqZWN0LnZhbHVlcyhoaXN0b2dyYW1zKS5mb3JFYWNoKChoaXN0KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBoaXN0LmRhdGEpIHtcbiAgICAgICAgICB0aGlzLnN2Zy5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCBjaXJjbGUpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBgb3Jpbl9fcHQgb3Jpbl9fcHRfXyR7aGlzdC5pZH1gKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBoaXN0LmNvbG9yKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt0aGlzLnNjYWxlcy54KGtleSl9LCAke3RoaXMuc2NhbGVzLnkoaGlzdC5kYXRhW2tleV0udmFsdWUpfSlgKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMC45NSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0b2dnbGVSZXN1bHQocmVzSWQsIHNob3duKSB7XG4gICAgICB0aGlzLnN2Zy5zZWxlY3RBbGwoYC5vcmluX19wdF9fJHtyZXNJZH1gKS5zdHlsZShcIm9wYWNpdHlcIiwgc2hvd24gPyAwLjc1IDogMClcbiAgICB9XG4gIH1cbn0pOyJdfQ==
