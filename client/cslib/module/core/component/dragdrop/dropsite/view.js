'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./dropsite.html'),
      Utils = require('core/util/utils');

  return function (_DomView) {
    _inherits(DropSiteView, _DomView);

    function DropSiteView(model, tmpl) {
      _classCallCheck(this, DropSiteView);

      var _this = _possibleConstructorReturn(this, (DropSiteView.__proto__ || Object.getPrototypeOf(DropSiteView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onChange']);
      _this._cursor = _this.$el.find(".dropsite__sort__cursor");
      _this._cursor.detach();
      _this._itemViews = [];

      _this._render(model);
      model.addEventListener('DropSite.ItemAdded', _this._onChange);
      model.addEventListener('DropSite.ItemRemoved', _this._onChange);
      return _this;
    }

    _createClass(DropSiteView, [{
      key: '_onChange',
      value: function _onChange(evt) {
        this._render(evt.currentTarget, true);
      }
    }, {
      key: '_render',
      value: function _render(model) {
        var _this2 = this;

        this.$el.removeClass("dropsite__list dropsite__inline").addClass('dropsite__' + model.get('style'));
        while (this._itemViews.length) {
          this.removeChild(this._itemViews.pop());
        }

        model.get('items').forEach(function (item) {
          _this2.addChild(item.view(), ".dropsite__contents");
          _this2._itemViews.push(item.view());
        });
      }
    }, {
      key: 'sortPosition',
      value: function sortPosition(proxy, mousePos, model) {
        if (model.get('sortable')) {
          var sortPos = 0;
          var bounds = this.$el.find(".dropsite__contents").offset();
          bounds.width = 0;
          bounds.height = 0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this._itemViews[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var iv = _step.value;

              if (!iv.$dom().is(':visible')) {
                //invisible elements report a (left,top) of (0,0), so we use the previous bounds as reference
                bounds = {
                  top: bounds.top + bounds.height,
                  left: bounds.left + bounds.width,
                  width: 0,
                  height: 0
                };
              } else {
                bounds = iv.bounds();
              }
              if (model.get('style') == "list") {
                if (mousePos.y < mousePos.top) {
                  break;
                }
                if (mousePos.y > bounds.top + bounds.height / 2) {
                  sortPos += 1;
                }
              } else if (model.get('style') == "inline") {
                if (mousePos.x < bounds.left || bounds.top > mousePos.y) {
                  break;
                }
                if (mousePos.x > bounds.left + bounds.width / 2) {
                  sortPos += 1;
                }
              } else {
                sortPos += 1;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return sortPos;
        } else {
          return model.count();
        }
      }
    }, {
      key: 'checkOverlap',
      value: function checkOverlap(proxy, mousePos, model) {
        var overlapType = model.get('overlap');
        if (this.hasOwnProperty('_checkOverlap_' + overlapType)) {
          return this['_checkOverlap_' + overlapType](proxy, mousePos, model);
        } else {
          return this._checkOverlap_mouse(proxy, mousePos);
        }
      }
    }, {
      key: '_checkOverlap_mouse',
      value: function _checkOverlap_mouse(proxy, mousePos, model) {
        var bounds = this.bounds();
        return bounds.left <= mousePos.x <= bounds.left + bounds.width && bounds.top <= mousePos.y <= bounds.top + bounds.height;
      }
    }, {
      key: '_checkOverlap_minkowski',
      value: function _checkOverlap_minkowski(proxy, mousePos, model) {
        var bounds = this.bounds();
        var proxyBounds = proxy.bounds();
        var sumBounds = {
          left: bounds.left - proxyBounds.width,
          top: bounds.top - proxyBounds.height,
          width: bounds.width + proxyBounds.width,
          height: bounds.height + proxyBounds.height
        };
        return sumBounds.left <= proxyBounds.left <= sumBounds.left + sumBounds.width && sumBounds.top <= proxyBounds.top <= sumBounds.top + sumBounds.height;
      }
    }, {
      key: 'handleCandidacy',
      value: function handleCandidacy(pos) {
        if (pos == 0) {
          this._cursor.insertBefore(this._itemViews[0].$dom());
        } else {
          this._cursor.insertAfter(this._itemViews[pos - 1].$dom());
        }
      }
    }, {
      key: 'clearCursor',
      value: function clearCursor() {
        this._cursor.detach();
      }
    }]);

    return DropSiteView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJVdGlscyIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiX2N1cnNvciIsIiRlbCIsImZpbmQiLCJkZXRhY2giLCJfaXRlbVZpZXdzIiwiX3JlbmRlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25DaGFuZ2UiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImdldCIsImxlbmd0aCIsInJlbW92ZUNoaWxkIiwicG9wIiwiZm9yRWFjaCIsIml0ZW0iLCJhZGRDaGlsZCIsInZpZXciLCJwdXNoIiwicHJveHkiLCJtb3VzZVBvcyIsInNvcnRQb3MiLCJib3VuZHMiLCJvZmZzZXQiLCJ3aWR0aCIsImhlaWdodCIsIml2IiwiJGRvbSIsImlzIiwidG9wIiwibGVmdCIsInkiLCJ4IiwiY291bnQiLCJvdmVybGFwVHlwZSIsImhhc093blByb3BlcnR5IiwiX2NoZWNrT3ZlcmxhcF9tb3VzZSIsInByb3h5Qm91bmRzIiwic3VtQm91bmRzIiwicG9zIiwiaW5zZXJ0QmVmb3JlIiwiaW5zZXJ0QWZ0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsc0JBQVIsQ0FEYjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjs7QUFLQTtBQUFBOztBQUNFLDBCQUFZSSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLDhIQUNqQkEsUUFBUUgsUUFEUzs7QUFFdkJDLFlBQU1HLFdBQU4sUUFBd0IsQ0FBQyxXQUFELENBQXhCO0FBQ0EsWUFBS0MsT0FBTCxHQUFlLE1BQUtDLEdBQUwsQ0FB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QU9RLElBQVAsR0FBY08sWUFBWWIsS0FEbEI7QUFFZEssZUFBS1AsT0FBT08sR0FBUCxHQUFhUSxZQUFZWixNQUZoQjtBQUdkRCxpQkFBT0YsT0FBT0UsS0FBUCxHQUFlYSxZQUFZYixLQUhwQjtBQUlkQyxrQkFBUUgsT0FBT0csTUFBUCxHQUFnQlksWUFBWVo7QUFKdEIsU0FBaEI7QUFNQSxlQUFPYSxVQUFVUixJQUFWLElBQWtCTyxZQUFZUCxJQUE5QixJQUFzQ1EsVUFBVVIsSUFBVixHQUFpQlEsVUFBVWQsS0FBakUsSUFBMEVjLFVBQVVULEdBQVYsSUFBaUJRLFlBQVlSLEdBQTdCLElBQW9DUyxVQUFVVCxHQUFWLEdBQWdCUyxVQUFVYixNQUEvSTtBQUNEO0FBL0ZIO0FBQUE7QUFBQSxzQ0FpR2tCYyxHQWpHbEIsRUFpR3VCO0FBQ25CLFlBQUlBLE9BQU8sQ0FBWCxFQUFjO0FBQ1osZUFBS3pDLE9BQUwsQ0FBYTBDLFlBQWIsQ0FBMEIsS0FBS3RDLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUJ5QixJQUFuQixFQUExQjtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUs3QixPQUFMLENBQWEyQyxXQUFiLENBQXlCLEtBQUt2QyxVQUFMLENBQWdCcUMsTUFBSSxDQUFwQixFQUF1QlosSUFBdkIsRUFBekI7QUFDRDtBQUNGO0FBdkdIO0FBQUE7QUFBQSxvQ0F5R2dCO0FBQ1osYUFBSzdCLE9BQUwsQ0FBYUcsTUFBYjtBQUNEO0FBM0dIOztBQUFBO0FBQUEsSUFBa0NULE9BQWxDO0FBNkdELENBbkhEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9kcm9wc2l0ZS5odG1sJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIERyb3BTaXRlVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uQ2hhbmdlJ10pXG4gICAgICB0aGlzLl9jdXJzb3IgPSB0aGlzLiRlbC5maW5kKFwiLmRyb3BzaXRlX19zb3J0X19jdXJzb3JcIik7XG4gICAgICB0aGlzLl9jdXJzb3IuZGV0YWNoKCk7XG4gICAgICB0aGlzLl9pdGVtVmlld3MgPSBbXTtcblxuICAgICAgdGhpcy5fcmVuZGVyKG1vZGVsKTtcbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ0Ryb3BTaXRlLkl0ZW1BZGRlZCcsIHRoaXMuX29uQ2hhbmdlKTtcbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ0Ryb3BTaXRlLkl0ZW1SZW1vdmVkJywgdGhpcy5fb25DaGFuZ2UpO1xuICAgIH1cblxuICAgIF9vbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX3JlbmRlcihldnQuY3VycmVudFRhcmdldCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgX3JlbmRlcihtb2RlbCkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoXCJkcm9wc2l0ZV9fbGlzdCBkcm9wc2l0ZV9faW5saW5lXCIpLmFkZENsYXNzKGBkcm9wc2l0ZV9fJHttb2RlbC5nZXQoJ3N0eWxlJyl9YCk7XG4gICAgICB3aGlsZSAodGhpcy5faXRlbVZpZXdzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX2l0ZW1WaWV3cy5wb3AoKSk7XG4gICAgICB9XG5cbiAgICAgIG1vZGVsLmdldCgnaXRlbXMnKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoaXRlbS52aWV3KCksIFwiLmRyb3BzaXRlX19jb250ZW50c1wiKTtcbiAgICAgICAgdGhpcy5faXRlbVZpZXdzLnB1c2goaXRlbS52aWV3KCkpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc29ydFBvc2l0aW9uKHByb3h5LCBtb3VzZVBvcywgbW9kZWwpIHtcbiAgICAgIGlmIChtb2RlbC5nZXQoJ3NvcnRhYmxlJykpIHtcbiAgICAgICAgbGV0IHNvcnRQb3MgPSAwO1xuICAgICAgICBsZXQgYm91bmRzID0gdGhpcy4kZWwuZmluZChcIi5kcm9wc2l0ZV9fY29udGVudHNcIikub2Zmc2V0KCk7XG4gICAgICAgIGJvdW5kcy53aWR0aCA9IDA7XG4gICAgICAgIGJvdW5kcy5oZWlnaHQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpdiBvZiB0aGlzLl9pdGVtVmlld3MpIHtcbiAgICAgICAgICBpZiAoIWl2LiRkb20oKS5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgLy9pbnZpc2libGUgZWxlbWVudHMgcmVwb3J0IGEgKGxlZnQsdG9wKSBvZiAoMCwwKSwgc28gd2UgdXNlIHRoZSBwcmV2aW91cyBib3VuZHMgYXMgcmVmZXJlbmNlXG4gICAgICAgICAgICBib3VuZHMgPSB7XG4gICAgICAgICAgICAgIHRvcDogYm91bmRzLnRvcCArIGJvdW5kcy5oZWlnaHQsXG4gICAgICAgICAgICAgIGxlZnQ6IGJvdW5kcy5sZWZ0ICsgYm91bmRzLndpZHRoLFxuICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvdW5kcyA9IGl2LmJvdW5kcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobW9kZWwuZ2V0KCdzdHlsZScpID09IFwibGlzdFwiKSB7XG4gICAgICAgICAgICBpZiAobW91c2VQb3MueSA8IG1vdXNlUG9zLnRvcCkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb3VzZVBvcy55ID4gYm91bmRzLnRvcCArIGJvdW5kcy5oZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICAgIHNvcnRQb3MgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKG1vZGVsLmdldCgnc3R5bGUnKSA9PSBcImlubGluZVwiKSB7XG4gICAgICAgICAgICBpZiAobW91c2VQb3MueCA8IGJvdW5kcy5sZWZ0IHx8IGJvdW5kcy50b3AgPiBtb3VzZVBvcy55KSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdXNlUG9zLnggPiBib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCAvIDIpIHtcbiAgICAgICAgICAgICAgc29ydFBvcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzb3J0UG9zICs9IDFcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvcnRQb3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbW9kZWwuY291bnQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja092ZXJsYXAocHJveHksIG1vdXNlUG9zLCBtb2RlbCkge1xuICAgICAgbGV0IG92ZXJsYXBUeXBlID0gbW9kZWwuZ2V0KCdvdmVybGFwJyk7XG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShgX2NoZWNrT3ZlcmxhcF8ke292ZXJsYXBUeXBlfWApKSB7XG4gICAgICAgIHJldHVybiB0aGlzW2BfY2hlY2tPdmVybGFwXyR7b3ZlcmxhcFR5cGV9YF0ocHJveHksIG1vdXNlUG9zLCBtb2RlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hlY2tPdmVybGFwX21vdXNlKHByb3h5LCBtb3VzZVBvcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2NoZWNrT3ZlcmxhcF9tb3VzZShwcm94eSwgbW91c2VQb3MsIG1vZGVsKSB7XG4gICAgICBsZXQgYm91bmRzID0gdGhpcy5ib3VuZHMoKTtcbiAgICAgIHJldHVybiBib3VuZHMubGVmdCA8PSBtb3VzZVBvcy54IDw9IGJvdW5kcy5sZWZ0ICsgYm91bmRzLndpZHRoICYmIGJvdW5kcy50b3AgPD0gbW91c2VQb3MueSA8PSBib3VuZHMudG9wICsgYm91bmRzLmhlaWdodDtcbiAgICB9XG5cbiAgICBfY2hlY2tPdmVybGFwX21pbmtvd3NraShwcm94eSwgbW91c2VQb3MsIG1vZGVsKSB7XG4gICAgICBsZXQgYm91bmRzID0gdGhpcy5ib3VuZHMoKVxuICAgICAgbGV0IHByb3h5Qm91bmRzID0gcHJveHkuYm91bmRzKClcbiAgICAgIGxldCBzdW1Cb3VuZHMgPSB7XG4gICAgICAgIGxlZnQ6IGJvdW5kcy5sZWZ0IC0gcHJveHlCb3VuZHMud2lkdGgsXG4gICAgICAgIHRvcDogYm91bmRzLnRvcCAtIHByb3h5Qm91bmRzLmhlaWdodCxcbiAgICAgICAgd2lkdGg6IGJvdW5kcy53aWR0aCArIHByb3h5Qm91bmRzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGJvdW5kcy5oZWlnaHQgKyBwcm94eUJvdW5kcy5oZWlnaHRcbiAgICAgIH07XG4gICAgICByZXR1cm4gc3VtQm91bmRzLmxlZnQgPD0gcHJveHlCb3VuZHMubGVmdCA8PSBzdW1Cb3VuZHMubGVmdCArIHN1bUJvdW5kcy53aWR0aCAmJiBzdW1Cb3VuZHMudG9wIDw9IHByb3h5Qm91bmRzLnRvcCA8PSBzdW1Cb3VuZHMudG9wICsgc3VtQm91bmRzLmhlaWdodDtcbiAgICB9XG5cbiAgICBoYW5kbGVDYW5kaWRhY3kocG9zKSB7XG4gICAgICBpZiAocG9zID09IDApIHtcbiAgICAgICAgdGhpcy5fY3Vyc29yLmluc2VydEJlZm9yZSh0aGlzLl9pdGVtVmlld3NbMF0uJGRvbSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2N1cnNvci5pbnNlcnRBZnRlcih0aGlzLl9pdGVtVmlld3NbcG9zLTFdLiRkb20oKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJDdXJzb3IoKSB7XG4gICAgICB0aGlzLl9jdXJzb3IuZGV0YWNoKClcbiAgICB9XG4gIH07XG59KTsiXX0=
