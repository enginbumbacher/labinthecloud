'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      d3 = require('d3'),
      Template = require('text!./circlegraph.html'),
      LightDisplay = require('euglena/component/lightdisplay/lightdisplay');
  require('link!./circlegraph.css');

  return function (_DomView) {
    _inherits(CircleHistogramView, _DomView);

    function CircleHistogramView(model, tmpl) {
      _classCallCheck(this, CircleHistogramView);

      var _this = _possibleConstructorReturn(this, (CircleHistogramView.__proto__ || Object.getPrototypeOf(CircleHistogramView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);
      _this._lightDisplay = LightDisplay.create({
        width: model.get('width') + model.get('margins.left') + model.get('margins.right'),
        height: model.get('height') + model.get('margins.top') + model.get('margins.bottom')
      });
      _this._lightDisplay.render({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      });
      _this.addChild(_this._lightDisplay.view(), ".circle-graph__lights");

      model.addEventListener('Model.Change', _this._onModelChange);
      var svg = d3.select(_this.$el.find('.circle-graph__graph').get(0)).append('svg');
      svg.attr('width', model.get('width') + model.get('margins.left') + model.get('margins.right'));
      svg.attr('height', model.get('height') + model.get('margins.top') + model.get('margins.bottom'));
      _this.svg = svg.append('g');
      _this.svg.attr('transform', 'translate(' + (model.get('margins.left') + model.get('width') / 2) + ',' + (model.get('margins.top') + model.get('height') / 2) + ')');
      return _this;
    }

    _createClass(CircleHistogramView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path.match(/^histogram/)) {
          this.render(evt.currentTarget);
        } else if (evt.data.path == "lights") {
          this._lightDisplay.render(evt.data.value);
        } else if (evt.data.path.match(/^data/)) {
          if (evt.currentTarget.get('data') == {}) {
            this.reset();
          } else {
            this.reset();
            this.setup(evt.currentTarget);
          }
        }
      }
    }, {
      key: 'setup',
      value: function setup(model) {
        var _this2 = this;

        var w = model.get('width');
        this.arcs = this.arcs || {};

        var _loop = function _loop(layer) {
          var mbv = model.get('data.' + layer + '.maxBinValue');
          _this2.arcs[layer] = d3.arc().outerRadius(function (d) {
            return Math.max(0.1, w * d.data.frequency / (2 * mbv));
          }).innerRadius(0);
        };

        for (var layer in model.get('data')) {
          _loop(layer);
        }
        this.pie = d3.pie().value(function (d) {
          return 1;
        }).sort(function (a, b) {
          return b.thetaStart - a.thetaStart;
        });
      }
    }, {
      key: 'render',
      value: function render(model) {
        for (var layer in model.get('histogram')) {
          if (!model.get('data.' + layer + '.showLayer')) {
            continue;
          }
          var bins = model.get('histogram.' + layer);
          var data = this.svg.selectAll('.circle-graph__slice__' + layer).data(this.pie(bins));
          var color = model.get('data.' + layer + '.color');
          data.enter().append('path').attr('style', color ? 'fill: #' + color.toString(16) : null).attr('class', 'circle-graph__slice circle-graph__slice__' + layer).attr('transform', 'rotate(90)').merge(data).transition().ease(function (t) {
            return t;
          }).duration(model.get('tStep') * 500).attr('d', this.arcs[layer]);
          data.exit().remove();

          var measureCount = bins.reduce(function (v, c) {
            return v + c.frequency;
          }, 0);
          this.$el.find('.circle-graph__meta__' + layer).html(measureCount + ' samples');
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.svg.selectAll('.circle-graph__slice').remove();
        this.$el.find(".circle-graph__meta span").html('');
        this._lightDisplay.render({
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        });
      }
    }]);

    return CircleHistogramView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVXRpbHMiLCJkMyIsIlRlbXBsYXRlIiwiTGlnaHREaXNwbGF5IiwibW9kZWwiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfbGlnaHREaXNwbGF5IiwiY3JlYXRlIiwid2lkdGgiLCJnZXQiLCJoZWlnaHQiLCJyZW5kZXIiLCJ0b3AiLCJsZWZ0IiwicmlnaHQiLCJib3R0b20iLCJhZGRDaGlsZCIsInZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxDaGFuZ2UiLCJzdmciLCJzZWxlY3QiLCIkZWwiLCJmaW5kIiwiYXBwZW5kIiwiYXR0ciIsImV2dCIsImRhdGEiLCJwYXRoIiwibWF0Y2giLCJjdXJyZW50VGFyZ2V0IiwidmFsdWUiLCJyZXNldCIsInNldHVwIiwidyIsImFyY3MiLCJsYXllciIsIm1idiIsImFyYyIsIm91dGVyUmFkaXVzIiwiZCIsIk1hdGgiLCJtYXgiLCJmcmVxdWVuY3kiLCJpbm5lclJhZGl1cyIsInBpZSIsInNvcnQiLCJhIiwiYiIsInRoZXRhU3RhcnQiLCJiaW5zIiwic2VsZWN0QWxsIiwiY29sb3IiLCJlbnRlciIsInRvU3RyaW5nIiwibWVyZ2UiLCJ0cmFuc2l0aW9uIiwiZWFzZSIsInQiLCJkdXJhdGlvbiIsImV4aXQiLCJyZW1vdmUiLCJtZWFzdXJlQ291bnQiLCJyZWR1Y2UiLCJ2IiwiYyIsImh0bWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEsSUFBUixDQUZQO0FBQUEsTUFHRUksV0FBV0osUUFBUSx5QkFBUixDQUhiO0FBQUEsTUFJRUssZUFBZUwsUUFB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Q0FBMEI7QUFDeEJDLGVBQUssQ0FEbUI7QUFFeEJHLGtCQUFRLENBRmdCO0FBR3hCRixnQkFBTSxDQUhrQjtBQUl4QkMsaUJBQU87QUFKaUIsU0FBMUI7QUFNRDtBQXhGSDs7QUFBQTtBQUFBLElBQXlDaEIsT0FBekM7QUEwRkQsQ0FuR0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgZDMgPSByZXF1aXJlKCdkMycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL2NpcmNsZWdyYXBoLmh0bWwnKSxcbiAgICBMaWdodERpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5JylcbiAgO1xuICByZXF1aXJlKCdsaW5rIS4vY2lyY2xlZ3JhcGguY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIENpcmNsZUhpc3RvZ3JhbVZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJ10pXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgd2lkdGg6IG1vZGVsLmdldCgnd2lkdGgnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5sZWZ0JykgKyBtb2RlbC5nZXQoJ21hcmdpbnMucmlnaHQnKSxcbiAgICAgICAgaGVpZ2h0OiBtb2RlbC5nZXQoJ2hlaWdodCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLnRvcCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLmJvdHRvbScpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheS5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICBib3R0b206IDBcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9saWdodERpc3BsYXkudmlldygpLCBcIi5jaXJjbGUtZ3JhcGhfX2xpZ2h0c1wiKTtcblxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSk7XG4gICAgICBsZXQgc3ZnID0gZDMuc2VsZWN0KHRoaXMuJGVsLmZpbmQoJy5jaXJjbGUtZ3JhcGhfX2dyYXBoJykuZ2V0KDApKS5hcHBlbmQoJ3N2ZycpO1xuICAgICAgc3ZnLmF0dHIoJ3dpZHRoJywgbW9kZWwuZ2V0KCd3aWR0aCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLmxlZnQnKSArIG1vZGVsLmdldCgnbWFyZ2lucy5yaWdodCcpKTtcbiAgICAgIHN2Zy5hdHRyKCdoZWlnaHQnLCBtb2RlbC5nZXQoJ2hlaWdodCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLnRvcCcpICsgbW9kZWwuZ2V0KCdtYXJnaW5zLmJvdHRvbScpKTtcbiAgICAgIHRoaXMuc3ZnID0gc3ZnLmFwcGVuZCgnZycpO1xuICAgICAgdGhpcy5zdmcuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21vZGVsLmdldCgnbWFyZ2lucy5sZWZ0JykgKyBtb2RlbC5nZXQoJ3dpZHRoJykgLyAyfSwke21vZGVsLmdldCgnbWFyZ2lucy50b3AnKSArIG1vZGVsLmdldCgnaGVpZ2h0JykgLyAyfSlgKTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoLm1hdGNoKC9eaGlzdG9ncmFtLykpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5wYXRoID09IFwibGlnaHRzXCIpIHtcbiAgICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihldnQuZGF0YS52YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnBhdGgubWF0Y2goL15kYXRhLykpIHtcbiAgICAgICAgaWYgKGV2dC5jdXJyZW50VGFyZ2V0LmdldCgnZGF0YScpID09IHt9KSB7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICB0aGlzLnNldHVwKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldHVwKG1vZGVsKSB7XG4gICAgICBsZXQgdyA9IG1vZGVsLmdldCgnd2lkdGgnKTtcbiAgICAgIHRoaXMuYXJjcyA9IHRoaXMuYXJjcyB8fCB7fTtcbiAgICAgIGZvciAobGV0IGxheWVyIGluIG1vZGVsLmdldCgnZGF0YScpKSB7XG4gICAgICAgIGxldCBtYnYgPSBtb2RlbC5nZXQoYGRhdGEuJHtsYXllcn0ubWF4QmluVmFsdWVgKVxuICAgICAgICB0aGlzLmFyY3NbbGF5ZXJdID0gZDMuYXJjKClcbiAgICAgICAgICAub3V0ZXJSYWRpdXMoKGQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCgwLjEsIHcgKiBkLmRhdGEuZnJlcXVlbmN5IC8gKDIgKiBtYnYpKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmlubmVyUmFkaXVzKDApO1xuICAgICAgfVxuICAgICAgdGhpcy5waWUgPSBkMy5waWUoKVxuICAgICAgICAudmFsdWUoKGQpID0+IDEpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBiLnRoZXRhU3RhcnQgLSBhLnRoZXRhU3RhcnQpO1xuICAgIH1cblxuICAgIHJlbmRlcihtb2RlbCkge1xuICAgICAgZm9yIChsZXQgbGF5ZXIgaW4gbW9kZWwuZ2V0KCdoaXN0b2dyYW0nKSkge1xuICAgICAgICBpZiAoIW1vZGVsLmdldChgZGF0YS4ke2xheWVyfS5zaG93TGF5ZXJgKSkge2NvbnRpbnVlfVxuICAgICAgICBsZXQgYmlucyA9IG1vZGVsLmdldChgaGlzdG9ncmFtLiR7bGF5ZXJ9YCk7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5zdmcuc2VsZWN0QWxsKGAuY2lyY2xlLWdyYXBoX19zbGljZV9fJHtsYXllcn1gKVxuICAgICAgICAgIC5kYXRhKHRoaXMucGllKGJpbnMpKTtcbiAgICAgICAgbGV0IGNvbG9yID0gbW9kZWwuZ2V0KGBkYXRhLiR7bGF5ZXJ9LmNvbG9yYClcbiAgICAgICAgZGF0YS5lbnRlcigpXG4gICAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgLmF0dHIoJ3N0eWxlJywgY29sb3IgPyBgZmlsbDogIyR7Y29sb3IudG9TdHJpbmcoMTYpfWAgOiBudWxsKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGBjaXJjbGUtZ3JhcGhfX3NsaWNlIGNpcmNsZS1ncmFwaF9fc2xpY2VfXyR7bGF5ZXJ9YClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3JvdGF0ZSg5MCknKVxuICAgICAgICAgIC5tZXJnZShkYXRhKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5lYXNlKCh0KSA9PiB0KVxuICAgICAgICAgICAgLmR1cmF0aW9uKG1vZGVsLmdldCgndFN0ZXAnKSAqIDUwMClcbiAgICAgICAgICAgIC5hdHRyKCdkJywgdGhpcy5hcmNzW2xheWVyXSlcbiAgICAgICAgZGF0YS5leGl0KCkucmVtb3ZlKCk7XG5cbiAgICAgICAgbGV0IG1lYXN1cmVDb3VudCA9IGJpbnMucmVkdWNlKCh2LCBjKSA9PiB2ICsgYy5mcmVxdWVuY3ksIDApXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoYC5jaXJjbGUtZ3JhcGhfX21ldGFfXyR7bGF5ZXJ9YCkuaHRtbChgJHttZWFzdXJlQ291bnR9IHNhbXBsZXNgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuc3ZnLnNlbGVjdEFsbCgnLmNpcmNsZS1ncmFwaF9fc2xpY2UnKS5yZW1vdmUoKVxuICAgICAgdGhpcy4kZWwuZmluZChcIi5jaXJjbGUtZ3JhcGhfX21ldGEgc3BhblwiKS5odG1sKCcnKTtcbiAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheS5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KVxuIl19
