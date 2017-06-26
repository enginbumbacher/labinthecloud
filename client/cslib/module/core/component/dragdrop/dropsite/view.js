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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJVdGlscyIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiX2N1cnNvciIsIiRlbCIsImZpbmQiLCJkZXRhY2giLCJfaXRlbVZpZXdzIiwiX3JlbmRlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25DaGFuZ2UiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImdldCIsImxlbmd0aCIsInJlbW92ZUNoaWxkIiwicG9wIiwiZm9yRWFjaCIsIml0ZW0iLCJhZGRDaGlsZCIsInZpZXciLCJwdXNoIiwicHJveHkiLCJtb3VzZVBvcyIsInNvcnRQb3MiLCJib3VuZHMiLCJvZmZzZXQiLCJ3aWR0aCIsImhlaWdodCIsIml2IiwiJGRvbSIsImlzIiwidG9wIiwibGVmdCIsInkiLCJ4IiwiY291bnQiLCJvdmVybGFwVHlwZSIsImhhc093blByb3BlcnR5IiwiX2NoZWNrT3ZlcmxhcF9tb3VzZSIsInByb3h5Qm91bmRzIiwic3VtQm91bmRzIiwicG9zIiwiaW5zZXJ0QmVmb3JlIiwiaW5zZXJ0QWZ0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsc0JBQVIsQ0FEYjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjs7QUFLQTtBQUFBOztBQUNFLDBCQUFZSSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLDhIQUNqQkEsUUFBUUgsUUFEUzs7QUFFdkJDLFlBQU1HLFdBQU4sUUFBd0IsQ0FBQyxXQUFELENBQXhCO0FBQ0EsWUFBS0MsT0FBTCxHQUFlLE1BQUtDLEdBQUwsQ0FB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QU9RLElBQVAsR0FBY08sWUFBWWIsS0FEbEI7QUFFZEssZUFBS1AsT0FBT08sR0FBUCxHQUFhUSxZQUFZWixNQUZoQjtBQUdkRCxpQkFBT0YsT0FBT0UsS0FBUCxHQUFlYSxZQUFZYixLQUhwQjtBQUlkQyxrQkFBUUgsT0FBT0csTUFBUCxHQUFnQlksWUFBWVo7QUFKdEIsU0FBaEI7QUFNQSxlQUFPYSxVQUFVUixJQUFWLElBQWtCTyxZQUFZUCxJQUE5QixJQUFzQ1EsVUFBVVIsSUFBVixHQUFpQlEsVUFBVWQsS0FBakUsSUFBMEVjLFVBQVVULEdBQVYsSUFBaUJRLFlBQVlSLEdBQTdCLElBQW9DUyxVQUFVVCxHQUFWLEdBQWdCUyxVQUFVYixNQUEvSTtBQUNEO0FBL0ZIO0FBQUE7QUFBQSxzQ0FpR2tCYyxHQWpHbEIsRUFpR3VCO0FBQ25CLFlBQUlBLE9BQU8sQ0FBWCxFQUFjO0FBQ1osZUFBS3pDLE9BQUwsQ0FBYTBDLFlBQWIsQ0FBMEIsS0FBS3RDLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUJ5QixJQUFuQixFQUExQjtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUs3QixPQUFMLENBQWEyQyxXQUFiLENBQXlCLEtBQUt2QyxVQUFMLENBQWdCcUMsTUFBSSxDQUFwQixFQUF1QlosSUFBdkIsRUFBekI7QUFDRDtBQUNGO0FBdkdIO0FBQUE7QUFBQSxvQ0F5R2dCO0FBQ1osYUFBSzdCLE9BQUwsQ0FBYUcsTUFBYjtBQUNEO0FBM0dIOztBQUFBO0FBQUEsSUFBa0NULE9BQWxDO0FBNkdELENBbkhEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
