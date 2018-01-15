'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      Template = require('text!./tab_tab.html');

  return function (_DomView) {
    _inherits(TabTabView, _DomView);

    function TabTabView(model, tmpl) {
      _classCallCheck(this, TabTabView);

      var _this = _possibleConstructorReturn(this, (TabTabView.__proto__ || Object.getPrototypeOf(TabTabView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onChange', '_onTabClick']);

      _this._id = model.get('id');

      _this._render(model);
      model.addEventListener('Model.Change', _this._onChange);
      _this.$el.find('.tab__label').click(_this._onTabClick);
      return _this;
    }

    _createClass(TabTabView, [{
      key: '_onTabClick',
      value: function _onTabClick(jqevt) {
        this.dispatchEvent('Tab.Selected', { id: this._id }, true);

        return false;
      }
    }, {
      key: '_render',
      value: function _render(model) {
        this.$el.find('.tab__label').html(model.get('title'));
        this.$el.toggleClass('tab__selected', model.get('selected'));
        this.$el.toggleClass('tab__disabled', model.get('disabled'));
      }
    }, {
      key: '_onChange',
      value: function _onChange(evt) {
        this._render(evt.currentTarget);
      }
    }]);

    return TabTabView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi90YWJfdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9pZCIsImdldCIsIl9yZW5kZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uQ2hhbmdlIiwiJGVsIiwiZmluZCIsImNsaWNrIiwiX29uVGFiQ2xpY2siLCJqcWV2dCIsImRpc3BhdGNoRXZlbnQiLCJpZCIsImh0bWwiLCJ0b2dnbGVDbGFzcyIsImV2dCIsImN1cnJlbnRUYXJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVdILFFBQVEscUJBQVIsQ0FGYjs7QUFJQTtBQUFBOztBQUNFLHdCQUFZSSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLDBIQUNqQkEsUUFBUUYsUUFEUzs7QUFFdkJELFlBQU1JLFdBQU4sUUFBd0IsQ0FBQyxXQUFELEVBQWMsYUFBZCxDQUF4Qjs7QUFFQSxZQUFLQyxHQUFMLEdBQVdILE1BQU1JLEdBQU4sQ0FBVSxJQUFWLENBQVg7O0FBRUEsWUFBS0MsT0FBTCxDQUFhTCxLQUFiO0FBQ0FBLFlBQU1NLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLFNBQTVDO0FBQ0EsWUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsYUFBZCxFQUE2QkMsS0FBN0IsQ0FBbUMsTUFBS0MsV0FBeEM7QUFSdUI7QUFTeEI7O0FBVkg7QUFBQTtBQUFBLGtDQVljQyxLQVpkLEVBWXFCO0FBQ2pCLGFBQUtDLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUMsRUFBRUMsSUFBSSxLQUFLWCxHQUFYLEVBQW5DLEVBQXFELElBQXJEOztBQUVBLGVBQU8sS0FBUDtBQUNEO0FBaEJIO0FBQUE7QUFBQSw4QkFrQlVILEtBbEJWLEVBa0JpQjtBQUNiLGFBQUtRLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGFBQWQsRUFBNkJNLElBQTdCLENBQWtDZixNQUFNSSxHQUFOLENBQVUsT0FBVixDQUFsQztBQUNBLGFBQUtJLEdBQUwsQ0FBU1EsV0FBVCxDQUFxQixlQUFyQixFQUFzQ2hCLE1BQU1JLEdBQU4sQ0FBVSxVQUFWLENBQXRDO0FBQ0EsYUFBS0ksR0FBTCxDQUFTUSxXQUFULENBQXFCLGVBQXJCLEVBQXNDaEIsTUFBTUksR0FBTixDQUFVLFVBQVYsQ0FBdEM7QUFDRDtBQXRCSDtBQUFBO0FBQUEsZ0NBd0JZYSxHQXhCWixFQXdCaUI7QUFDYixhQUFLWixPQUFMLENBQWFZLElBQUlDLGFBQWpCO0FBQ0Q7QUExQkg7O0FBQUE7QUFBQSxJQUFnQ3JCLE9BQWhDO0FBNEJELENBakNEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi90YWJfdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi90YWJfdGFiLmh0bWwnKTtcblxuICByZXR1cm4gY2xhc3MgVGFiVGFiVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uQ2hhbmdlJywgJ19vblRhYkNsaWNrJ10pXG5cbiAgICAgIHRoaXMuX2lkID0gbW9kZWwuZ2V0KCdpZCcpO1xuXG4gICAgICB0aGlzLl9yZW5kZXIobW9kZWwpO1xuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25DaGFuZ2UpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnRhYl9fbGFiZWwnKS5jbGljayh0aGlzLl9vblRhYkNsaWNrKTtcbiAgICB9XG5cbiAgICBfb25UYWJDbGljayhqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUYWIuU2VsZWN0ZWQnLCB7IGlkOiB0aGlzLl9pZCB9LCB0cnVlKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIF9yZW5kZXIobW9kZWwpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy50YWJfX2xhYmVsJykuaHRtbChtb2RlbC5nZXQoJ3RpdGxlJykpO1xuICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ3RhYl9fc2VsZWN0ZWQnLCBtb2RlbC5nZXQoJ3NlbGVjdGVkJykpO1xuICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ3RhYl9fZGlzYWJsZWQnLCBtb2RlbC5nZXQoJ2Rpc2FibGVkJykpO1xuICAgIH1cblxuICAgIF9vbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX3JlbmRlcihldnQuY3VycmVudFRhcmdldCk7XG4gICAgfVxuICB9XG59KVxuIl19
