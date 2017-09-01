'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./proxyview.html');
  require('link!./dragdrop.css');

  return function (_DomView) {
    _inherits(DragProxyView, _DomView);

    function DragProxyView(data) {
      _classCallCheck(this, DragProxyView);

      var _this = _possibleConstructorReturn(this, (DragProxyView.__proto__ || Object.getPrototypeOf(DragProxyView)).call(this, Template));

      _this._data = data;
      _this.$el.find(".dragdrop__selected__count").text(_this._data.selected.size);
      return _this;
    }

    _createClass(DragProxyView, [{
      key: 'updatePosition',
      value: function updatePosition(pos) {
        this.$el.css({
          left: Math.min(pos.maxWidth - this.$el.outerWidth(), Math.max(0, pos.left - this.$el.outerWidth() / 2)),
          top: Math.min(pos.maxHeight - this.$el.outerHeight(), Math.max(0, pos.top - this.$el.outerHeight() / 2))
        });
      }
    }, {
      key: 'reveal',
      value: function reveal() {}
    }, {
      key: 'enter',
      value: function enter(dropsite) {
        this.dispatchEvent('DragProxy.RequestRemoval');
      }
    }, {
      key: 'revert',
      value: function revert() {
        var _this2 = this;

        this.$el.animate({
          top: this._data.referencePosition.top - this._data.boundsPosition.top - this.$el.outerHeight() / 2,
          left: this._data.referencePosition.left - this._data.boundsPosition.left - this.$el.outerWidth() / 2,
          opacity: 0
        }, {
          duration: 300,
          complete: function complete() {
            _this2.dispatchEvent('DragProxy.RequestRemoval');
          }
        });
      }
    }]);

    return DragProxyView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9wcm94eXZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsImRhdGEiLCJfZGF0YSIsIiRlbCIsImZpbmQiLCJ0ZXh0Iiwic2VsZWN0ZWQiLCJzaXplIiwicG9zIiwiY3NzIiwibGVmdCIsIk1hdGgiLCJtaW4iLCJtYXhXaWR0aCIsIm91dGVyV2lkdGgiLCJtYXgiLCJ0b3AiLCJtYXhIZWlnaHQiLCJvdXRlckhlaWdodCIsImRyb3BzaXRlIiwiZGlzcGF0Y2hFdmVudCIsImFuaW1hdGUiLCJyZWZlcmVuY2VQb3NpdGlvbiIsImJvdW5kc1Bvc2l0aW9uIiwib3BhY2l0eSIsImR1cmF0aW9uIiwiY29tcGxldGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsdUJBQVIsQ0FEYjtBQUVBQSxVQUFRLHFCQUFSOztBQUVBO0FBQUE7O0FBQ0UsMkJBQVlHLElBQVosRUFBa0I7QUFBQTs7QUFBQSxnSUFDVkQsUUFEVTs7QUFFaEIsWUFBS0UsS0FBTCxHQUFhRCxJQUFiO0FBQ0EsWUFBS0UsR0FBTCxDQUFTQyxJQUFULENBQWMsNEJBQWQsRUFBNENDLElBQTVDLENBQWlELE1BQUtILEtBQUwsQ0FBV0ksUUFBWCxDQUFvQkMsSUFBckU7QUFIZ0I7QUFJakI7O0FBTEg7QUFBQTtBQUFBLHFDQU9pQkMsR0FQakIsRUFPc0I7QUFDbEIsYUFBS0wsR0FBTCxDQUFTTSxHQUFULENBQWE7QUFDWEMsZ0JBQU1DLEtBQUtDLEdBQUwsQ0FBU0osSUFBSUssUUFBSixHQUFlLEtBQUtWLEdBQUwsQ0FBU1csVUFBVCxFQUF4QixFQUErQ0gsS0FBS0ksR0FBTCxDQUFTLENBQVQsRUFBWVAsSUFBSUUsSUFBSixHQUFXLEtBQUtQLEdBQUwsQ0FBU1csVUFBVCxLQUF3QixDQUEvQyxDQUEvQyxDQURLO0FBRVhFLGVBQUtMLEtBQUtDLEdBQUwsQ0FBU0osSUFBSVMsU0FBSixHQUFnQixLQUFLZCxHQUFMLENBQVNlLFdBQVQsRUFBekIsRUFBaURQLEtBQUtJLEdBQUwsQ0FBUyxDQUFULEVBQVlQLElBQUlRLEdBQUosR0FBVSxLQUFLYixHQUFMLENBQVNlLFdBQVQsS0FBeUIsQ0FBL0MsQ0FBakQ7QUFGTSxTQUFiO0FBSUQ7QUFaSDtBQUFBO0FBQUEsK0JBY1csQ0FBRTtBQWRiO0FBQUE7QUFBQSw0QkFnQlFDLFFBaEJSLEVBZ0JrQjtBQUNkLGFBQUtDLGFBQUwsQ0FBbUIsMEJBQW5CO0FBQ0Q7QUFsQkg7QUFBQTtBQUFBLCtCQW9CVztBQUFBOztBQUNQLGFBQUtqQixHQUFMLENBQVNrQixPQUFULENBQWlCO0FBQ2ZMLGVBQUssS0FBS2QsS0FBTCxDQUFXb0IsaUJBQVgsQ0FBNkJOLEdBQTdCLEdBQW1DLEtBQUtkLEtBQUwsQ0FBV3FCLGNBQVgsQ0FBMEJQLEdBQTdELEdBQW1FLEtBQUtiLEdBQUwsQ0FBU2UsV0FBVCxLQUF5QixDQURsRjtBQUVmUixnQkFBTSxLQUFLUixLQUFMLENBQVdvQixpQkFBWCxDQUE2QlosSUFBN0IsR0FBb0MsS0FBS1IsS0FBTCxDQUFXcUIsY0FBWCxDQUEwQmIsSUFBOUQsR0FBcUUsS0FBS1AsR0FBTCxDQUFTVyxVQUFULEtBQXdCLENBRnBGO0FBR2ZVLG1CQUFTO0FBSE0sU0FBakIsRUFJRztBQUNEQyxvQkFBVSxHQURUO0FBRURDLG9CQUFVLG9CQUFNO0FBQ2QsbUJBQUtOLGFBQUwsQ0FBbUIsMEJBQW5CO0FBQ0Q7QUFKQSxTQUpIO0FBVUQ7QUEvQkg7O0FBQUE7QUFBQSxJQUFtQ3JCLE9BQW5DO0FBaUNELENBdENEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9wcm94eXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Byb3h5dmlldy5odG1sJyk7XG4gIHJlcXVpcmUoJ2xpbmshLi9kcmFnZHJvcC5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgRHJhZ1Byb3h5VmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICAgIHN1cGVyKFRlbXBsYXRlKTtcbiAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgdGhpcy4kZWwuZmluZChcIi5kcmFnZHJvcF9fc2VsZWN0ZWRfX2NvdW50XCIpLnRleHQodGhpcy5fZGF0YS5zZWxlY3RlZC5zaXplKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQb3NpdGlvbihwb3MpIHtcbiAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgIGxlZnQ6IE1hdGgubWluKHBvcy5tYXhXaWR0aCAtIHRoaXMuJGVsLm91dGVyV2lkdGgoKSwgTWF0aC5tYXgoMCwgcG9zLmxlZnQgLSB0aGlzLiRlbC5vdXRlcldpZHRoKCkgLyAyKSksXG4gICAgICAgIHRvcDogTWF0aC5taW4ocG9zLm1heEhlaWdodCAtIHRoaXMuJGVsLm91dGVySGVpZ2h0KCksIE1hdGgubWF4KDAsIHBvcy50b3AgLSB0aGlzLiRlbC5vdXRlckhlaWdodCgpIC8gMikpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXZlYWwoKSB7fVxuXG4gICAgZW50ZXIoZHJvcHNpdGUpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRHJhZ1Byb3h5LlJlcXVlc3RSZW1vdmFsJyk7XG4gICAgfVxuXG4gICAgcmV2ZXJ0KCkge1xuICAgICAgdGhpcy4kZWwuYW5pbWF0ZSh7XG4gICAgICAgIHRvcDogdGhpcy5fZGF0YS5yZWZlcmVuY2VQb3NpdGlvbi50b3AgLSB0aGlzLl9kYXRhLmJvdW5kc1Bvc2l0aW9uLnRvcCAtIHRoaXMuJGVsLm91dGVySGVpZ2h0KCkgLyAyLFxuICAgICAgICBsZWZ0OiB0aGlzLl9kYXRhLnJlZmVyZW5jZVBvc2l0aW9uLmxlZnQgLSB0aGlzLl9kYXRhLmJvdW5kc1Bvc2l0aW9uLmxlZnQgLSB0aGlzLiRlbC5vdXRlcldpZHRoKCkgLyAyLFxuICAgICAgICBvcGFjaXR5OiAwXG4gICAgICB9LCB7XG4gICAgICAgIGR1cmF0aW9uOiAzMDAsXG4gICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdEcmFnUHJveHkuUmVxdWVzdFJlbW92YWwnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7Il19
