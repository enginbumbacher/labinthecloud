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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DragProxyView).call(this, Template));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9wcm94eXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxVQUFVLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFLFdBQVcsUUFBUSx1QkFBUixDQURiO0FBRUEsVUFBUSxxQkFBUjs7QUFFQTtBQUFBOztBQUNFLDJCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFBQSxtR0FDVixRQURVOztBQUVoQixZQUFLLEtBQUwsR0FBYSxJQUFiO0FBQ0EsWUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLDRCQUFkLEVBQTRDLElBQTVDLENBQWlELE1BQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsSUFBckU7QUFIZ0I7QUFJakI7O0FBTEg7QUFBQTtBQUFBLHFDQU9pQixHQVBqQixFQU9zQjtBQUNsQixhQUFLLEdBQUwsQ0FBUyxHQUFULENBQWE7QUFDWCxnQkFBTSxLQUFLLEdBQUwsQ0FBUyxJQUFJLFFBQUosR0FBZSxLQUFLLEdBQUwsQ0FBUyxVQUFULEVBQXhCLEVBQStDLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLElBQUosR0FBVyxLQUFLLEdBQUwsQ0FBUyxVQUFULEtBQXdCLENBQS9DLENBQS9DLENBREs7QUFFWCxlQUFLLEtBQUssR0FBTCxDQUFTLElBQUksU0FBSixHQUFnQixLQUFLLEdBQUwsQ0FBUyxXQUFULEVBQXpCLEVBQWlELEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLEdBQUosR0FBVSxLQUFLLEdBQUwsQ0FBUyxXQUFULEtBQXlCLENBQS9DLENBQWpEO0FBRk0sU0FBYjtBQUlEO0FBWkg7QUFBQTtBQUFBLCtCQWNXLENBQUU7QUFkYjtBQUFBO0FBQUEsNEJBZ0JRLFFBaEJSLEVBZ0JrQjtBQUNkLGFBQUssYUFBTCxDQUFtQiwwQkFBbkI7QUFDRDtBQWxCSDtBQUFBO0FBQUEsK0JBb0JXO0FBQUE7O0FBQ1AsYUFBSyxHQUFMLENBQVMsT0FBVCxDQUFpQjtBQUNmLGVBQUssS0FBSyxLQUFMLENBQVcsaUJBQVgsQ0FBNkIsR0FBN0IsR0FBbUMsS0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixHQUE3RCxHQUFtRSxLQUFLLEdBQUwsQ0FBUyxXQUFULEtBQXlCLENBRGxGO0FBRWYsZ0JBQU0sS0FBSyxLQUFMLENBQVcsaUJBQVgsQ0FBNkIsSUFBN0IsR0FBb0MsS0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixJQUE5RCxHQUFxRSxLQUFLLEdBQUwsQ0FBUyxVQUFULEtBQXdCLENBRnBGO0FBR2YsbUJBQVM7QUFITSxTQUFqQixFQUlHO0FBQ0Qsb0JBQVUsR0FEVDtBQUVELG9CQUFVLG9CQUFNO0FBQ2QsbUJBQUssYUFBTCxDQUFtQiwwQkFBbkI7QUFDRDtBQUpBLFNBSkg7QUFVRDtBQS9CSDs7QUFBQTtBQUFBLElBQW1DLE9BQW5DO0FBaUNELENBdENEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9wcm94eXZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
