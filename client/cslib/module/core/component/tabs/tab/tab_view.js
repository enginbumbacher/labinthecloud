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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi90YWJfdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9pZCIsImdldCIsIl9yZW5kZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uQ2hhbmdlIiwiJGVsIiwiZmluZCIsImNsaWNrIiwiX29uVGFiQ2xpY2siLCJqcWV2dCIsImRpc3BhdGNoRXZlbnQiLCJpZCIsImh0bWwiLCJ0b2dnbGVDbGFzcyIsImV2dCIsImN1cnJlbnRUYXJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BR0VHLFdBQVdILFFBQVEscUJBQVIsQ0FIYjs7QUFLQTtBQUFBOztBQUNFLHdCQUFZSSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLDBIQUNqQkEsUUFBUUYsUUFEUzs7QUFFdkJELFlBQU1JLFdBQU4sUUFBd0IsQ0FBQyxXQUFELEVBQWMsYUFBZCxDQUF4Qjs7QUFFQSxZQUFLQyxHQUFMLEdBQVdILE1BQU1JLEdBQU4sQ0FBVSxJQUFWLENBQVg7O0FBRUEsWUFBS0MsT0FBTCxDQUFhTCxLQUFiO0FBQ0FBLFlBQU1NLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLFNBQTVDO0FBQ0EsWUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsYUFBZCxFQUE2QkMsS0FBN0IsQ0FBbUMsTUFBS0MsV0FBeEM7QUFSdUI7QUFTeEI7O0FBVkg7QUFBQTtBQUFBLGtDQVljQyxLQVpkLEVBWXFCO0FBQ2pCLGFBQUtDLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUMsRUFBRUMsSUFBSSxLQUFLWCxHQUFYLEVBQW5DLEVBQXFELElBQXJEO0FBQ0EsZUFBTyxLQUFQO0FBQ0Q7QUFmSDtBQUFBO0FBQUEsOEJBaUJVSCxLQWpCVixFQWlCaUI7QUFDYixhQUFLUSxHQUFMLENBQVNDLElBQVQsQ0FBYyxhQUFkLEVBQTZCTSxJQUE3QixDQUFrQ2YsTUFBTUksR0FBTixDQUFVLE9BQVYsQ0FBbEM7QUFDQSxhQUFLSSxHQUFMLENBQVNRLFdBQVQsQ0FBcUIsZUFBckIsRUFBc0NoQixNQUFNSSxHQUFOLENBQVUsVUFBVixDQUF0QztBQUNEO0FBcEJIO0FBQUE7QUFBQSxnQ0FzQllhLEdBdEJaLEVBc0JpQjtBQUNiLGFBQUtaLE9BQUwsQ0FBYVksSUFBSUMsYUFBakI7QUFDRDtBQXhCSDs7QUFBQTtBQUFBLElBQWdDckIsT0FBaEM7QUEwQkQsQ0FoQ0QiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3RhYnMvdGFiL3RhYl92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
