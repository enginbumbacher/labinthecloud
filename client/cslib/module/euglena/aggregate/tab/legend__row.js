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
      Template = require('text!./legend__row.html'),
      Button = require('core/component/button/button');

  return function (_DomView) {
    _inherits(LegendRow, _DomView);

    function LegendRow(model, tmpl) {
      _classCallCheck(this, LegendRow);

      var _this = _possibleConstructorReturn(this, (LegendRow.__proto__ || Object.getPrototypeOf(LegendRow)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);

      _this.$el.find('.aggregate__legend__name').html();

      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(LegendRow, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {}
    }]);

    return LegendRow;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbGVnZW5kX19yb3cuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiQnV0dG9uIiwibW9kZWwiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCIkZWwiLCJmaW5kIiwiaHRtbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsImV2dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksVUFBVUosUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VLLFdBQVdMLFFBQVEseUJBQVIsQ0FEYjtBQUFBLE1BRUVNLFNBQVNOLFFBQVEsOEJBQVIsQ0FGWDs7QUFJQTtBQUFBOztBQUNFLHVCQUFZTyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHdIQUNqQkEsUUFBUUgsUUFEUzs7QUFFdkJKLFlBQU1RLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxDQUF4Qjs7QUFFQSxZQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYywwQkFBZCxFQUEwQ0MsSUFBMUM7O0FBRUFMLFlBQU1NLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLGNBQTVDO0FBTnVCO0FBT3hCOztBQVJIO0FBQUE7QUFBQSxxQ0FVaUJDLEdBVmpCLEVBVXNCLENBRW5CO0FBWkg7O0FBQUE7QUFBQSxJQUErQlgsT0FBL0I7QUFjRCxDQXZCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9hZ2dyZWdhdGUvdGFiL2xlZ2VuZF9fcm93LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
