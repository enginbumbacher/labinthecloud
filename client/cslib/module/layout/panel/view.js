'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      Template = require('text!./panel.html');

  return function (_DomView) {
    _inherits(LayoutPanelView, _DomView);

    function LayoutPanelView(model, tmpl) {
      _classCallCheck(this, LayoutPanelView);

      var _this = _possibleConstructorReturn(this, (LayoutPanelView.__proto__ || Object.getPrototypeOf(LayoutPanelView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);

      _this.$el.addClass('panel__' + model.get('id'));
      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(LayoutPanelView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "contents") {
          this._render(evt.currentTarget);
        }
      }
    }, {
      key: '_render',
      value: function _render(model) {
        var _this2 = this;

        while (this._children.length) {
          this.removeChild(this._children[0]);
        }
        model.get('contents').forEach(function (cont, ind) {
          _this2.addChild(cont);
        });
      }
    }]);

    return LayoutPanelView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9sYXlvdXQvcGFuZWwvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImFkZENsYXNzIiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJfcmVuZGVyIiwiY3VycmVudFRhcmdldCIsIl9jaGlsZHJlbiIsImxlbmd0aCIsInJlbW92ZUNoaWxkIiwiZm9yRWFjaCIsImNvbnQiLCJpbmQiLCJhZGRDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsV0FBV0gsUUFBUSxtQkFBUixDQUZiOztBQUlBO0FBQUE7O0FBQ0UsNkJBQVlJLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsb0lBQ2pCQSxRQUFRRixRQURTOztBQUV2QkQsWUFBTUksV0FBTixRQUF3QixDQUFDLGdCQUFELENBQXhCOztBQUVBLFlBQUtDLEdBQUwsQ0FBU0MsUUFBVCxhQUE0QkosTUFBTUssR0FBTixDQUFVLElBQVYsQ0FBNUI7QUFDQUwsWUFBTU0sZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0MsY0FBNUM7QUFMdUI7QUFNeEI7O0FBUEg7QUFBQTtBQUFBLHFDQVNpQkMsR0FUakIsRUFTc0I7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxJQUFULElBQWlCLFVBQXJCLEVBQWlDO0FBQy9CLGVBQUtDLE9BQUwsQ0FBYUgsSUFBSUksYUFBakI7QUFDRDtBQUNGO0FBYkg7QUFBQTtBQUFBLDhCQWVVWixLQWZWLEVBZWlCO0FBQUE7O0FBQ2IsZUFBTyxLQUFLYSxTQUFMLENBQWVDLE1BQXRCLEVBQThCO0FBQzVCLGVBQUtDLFdBQUwsQ0FBaUIsS0FBS0YsU0FBTCxDQUFlLENBQWYsQ0FBakI7QUFDRDtBQUNEYixjQUFNSyxHQUFOLENBQVUsVUFBVixFQUFzQlcsT0FBdEIsQ0FBOEIsVUFBQ0MsSUFBRCxFQUFPQyxHQUFQLEVBQWU7QUFDM0MsaUJBQUtDLFFBQUwsQ0FBY0YsSUFBZDtBQUNELFNBRkQ7QUFHRDtBQXRCSDs7QUFBQTtBQUFBLElBQXFDcEIsT0FBckM7QUF3QkQsQ0E3QkQiLCJmaWxlIjoibW9kdWxlL2xheW91dC9wYW5lbC92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
