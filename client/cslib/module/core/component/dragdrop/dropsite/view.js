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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DropSiteView).call(this, tmpl || Template));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sVUFBVSxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRSxXQUFXLFFBQVEsc0JBQVIsQ0FEYjtBQUFBLE1BRUUsUUFBUSxRQUFRLGlCQUFSLENBRlY7O0FBS0E7QUFBQTs7QUFDRSwwQkFBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsa0dBQ2pCLFFBQVEsUUFEUzs7QUFFdkIsWUFBTSxXQUFOLFFBQXdCLENBQUMsV0FBRCxDQUF4QjtBQUNBLFlBQUssT0FBTCxHQUFlLE1BQUssR0FBTCxDQUFTLElBQVQsQ0FBYyx5QkFBZCxDQUFmO0FBQ0EsWUFBSyxPQUFMLENBQWEsTUFBYjtBQUNBLFlBQUssVUFBTCxHQUFrQixFQUFsQjs7QUFFQSxZQUFLLE9BQUwsQ0FBYSxLQUFiO0FBQ0EsWUFBTSxnQkFBTixDQUF1QixvQkFBdkIsRUFBNkMsTUFBSyxTQUFsRDtBQUNBLFlBQU0sZ0JBQU4sQ0FBdUIsc0JBQXZCLEVBQStDLE1BQUssU0FBcEQ7QUFUdUI7QUFVeEI7O0FBWEg7QUFBQTtBQUFBLGdDQWFZLEdBYlosRUFhaUI7QUFDYixhQUFLLE9BQUwsQ0FBYSxJQUFJLGFBQWpCLEVBQWdDLElBQWhDO0FBQ0Q7QUFmSDtBQUFBO0FBQUEsOEJBaUJVLEtBakJWLEVBaUJpQjtBQUFBOztBQUNiLGFBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsaUNBQXJCLEVBQXdELFFBQXhELGdCQUE4RSxNQUFNLEdBQU4sQ0FBVSxPQUFWLENBQTlFO0FBQ0EsZUFBTyxLQUFLLFVBQUwsQ0FBZ0IsTUFBdkIsRUFBK0I7QUFDN0IsZUFBSyxXQUFMLENBQWlCLEtBQUssVUFBTCxDQUFnQixHQUFoQixFQUFqQjtBQUNEOztBQUVELGNBQU0sR0FBTixDQUFVLE9B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QUE0QixPQUFPLEdBQVAsR0FBYSxPQUFPLE1BQWxIO0FBQ0Q7QUFuRkg7QUFBQTtBQUFBLDhDQXFGMEIsS0FyRjFCLEVBcUZpQyxRQXJGakMsRUFxRjJDLEtBckYzQyxFQXFGa0Q7QUFDOUMsWUFBSSxTQUFTLEtBQUssTUFBTCxFQUFiO0FBQ0EsWUFBSSxjQUFjLE1BQU0sTUFBTixFQUFsQjtBQUNBLFlBQUksWUFBWTtBQUNkLGdCQUFNLE9BQU8sSUFBUCxHQUFjLFlBQVksS0FEbEI7QUFFZCxlQUFLLE9BQU8sR0FBUCxHQUFhLFlBQVksTUFGaEI7QUFHZCxpQkFBTyxPQUFPLEtBQVAsR0FBZSxZQUFZLEtBSHBCO0FBSWQsa0JBQVEsT0FBTyxNQUFQLEdBQWdCLFlBQVk7QUFKdEIsU0FBaEI7QUFNQSxlQUFPLFVBQVUsSUFBVixJQUFrQixZQUFZLElBQTlCLElBQXNDLFVBQVUsSUFBVixHQUFpQixVQUFVLEtBQWpFLElBQTBFLFVBQVUsR0FBVixJQUFpQixZQUFZLEdBQTdCLElBQW9DLFVBQVUsR0FBVixHQUFnQixVQUFVLE1BQS9JO0FBQ0Q7QUEvRkg7QUFBQTtBQUFBLHNDQWlHa0IsR0FqR2xCLEVBaUd1QjtBQUNuQixZQUFJLE9BQU8sQ0FBWCxFQUFjO0FBQ1osZUFBSyxPQUFMLENBQWEsWUFBYixDQUEwQixLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUIsSUFBbkIsRUFBMUI7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLLE9BQUwsQ0FBYSxXQUFiLENBQXlCLEtBQUssVUFBTCxDQUFnQixNQUFJLENBQXBCLEVBQXVCLElBQXZCLEVBQXpCO0FBQ0Q7QUFDRjtBQXZHSDtBQUFBO0FBQUEsb0NBeUdnQjtBQUNaLGFBQUssT0FBTCxDQUFhLE1BQWI7QUFDRDtBQTNHSDs7QUFBQTtBQUFBLElBQWtDLE9BQWxDO0FBNkdELENBbkhEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
