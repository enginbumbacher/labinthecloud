'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FieldView = require('core/component/form/field/view'),
      Template = require('text!./button.html'),
      Utils = require('core/util/utils');

  require('link!./style.css');

  return function (_FieldView) {
    _inherits(ButtonFieldView, _FieldView);

    function ButtonFieldView(model, tmpl) {
      _classCallCheck(this, ButtonFieldView);

      var _this = _possibleConstructorReturn(this, (ButtonFieldView.__proto__ || Object.getPrototypeOf(ButtonFieldView)).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onModelChange', '_onClick', 'focus']);

      _this.$el.find('.button').html(model.get('label'));
      _this._eventName = model.get('eventName');
      _this._eventData = model.get('eventData');
      _this.$el.find('.button').on('click', _this._onClick);
      _this._killNative = model.get("killNativeEvent");

      if (model.get('style') != "button") {
        _this.$el.addClass(model.get('style'));
      }
      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(ButtonFieldView, [{
      key: 'focus',
      value: function focus() {
        this.$el.find('.button').focus();
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.button').prop('disabled', false);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.button').prop('disabled', true);
      }
    }, {
      key: '_onClick',
      value: function _onClick(jqevt) {
        this.dispatchEvent(this._eventName, this._eventData, true);
        if (this._killNative) return false;
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          case "label":
            this.$el.find('.button').html(evt.data.value);
            break;
          case "disabled":
            if (evt.data.value) {
              this.disable();
            } else {
              this.enable();
            }
            break;
        }
      }
    }]);

    return ButtonFieldView;
  }(FieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRmllbGRWaWV3IiwiVGVtcGxhdGUiLCJVdGlscyIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiJGVsIiwiZmluZCIsImh0bWwiLCJnZXQiLCJfZXZlbnROYW1lIiwiX2V2ZW50RGF0YSIsIm9uIiwiX29uQ2xpY2siLCJfa2lsbE5hdGl2ZSIsImFkZENsYXNzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiZm9jdXMiLCJwcm9wIiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsImRpc2FibGUiLCJlbmFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSxnQ0FBUixDQUFsQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsb0JBQVIsQ0FEYjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjs7QUFJQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDZCQUFZSSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkQsS0FEaUIsRUFDVkMsT0FBT0EsSUFBUCxHQUFjSCxRQURKOztBQUV2QkMsWUFBTUcsV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLFVBQW5CLEVBQStCLE9BQS9CLENBQXhCOztBQUVBLFlBQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJDLElBQXpCLENBQThCTCxNQUFNTSxHQUFOLENBQVUsT0FBVixDQUE5QjtBQUNBLFlBQUtDLFVBQUwsR0FBa0JQLE1BQU1NLEdBQU4sQ0FBVSxXQUFWLENBQWxCO0FBQ0EsWUFBS0UsVUFBTCxHQUFrQlIsTUFBTU0sR0FBTixDQUFVLFdBQVYsQ0FBbEI7QUFDQSxZQUFLSCxHQUFMLENBQVNDLElBQVQsQ0FBYyxTQUFkLEVBQXlCSyxFQUF6QixDQUE0QixPQUE1QixFQUFxQyxNQUFLQyxRQUExQztBQUNBLFlBQUtDLFdBQUwsR0FBbUJYLE1BQU1NLEdBQU4sQ0FBVSxpQkFBVixDQUFuQjs7QUFFQSxVQUFJTixNQUFNTSxHQUFOLENBQVUsT0FBVixLQUFzQixRQUExQixFQUFvQztBQUNsQyxjQUFLSCxHQUFMLENBQVNTLFFBQVQsQ0FBa0JaLE1BQU1NLEdBQU4sQ0FBVSxPQUFWLENBQWxCO0FBQ0Q7QUFDRE4sWUFBTWEsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0MsY0FBNUM7QUFidUI7QUFjeEI7O0FBZkg7QUFBQTtBQUFBLDhCQWlCVTtBQUNOLGFBQUtYLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJXLEtBQXpCO0FBQ0Q7QUFuQkg7QUFBQTtBQUFBLCtCQXFCVztBQUNQLGFBQUtaLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJZLElBQXpCLENBQThCLFVBQTlCLEVBQTBDLEtBQTFDO0FBQ0Q7QUF2Qkg7QUFBQTtBQUFBLGdDQXlCWTtBQUNSLGFBQUtiLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJZLElBQXpCLENBQThCLFVBQTlCLEVBQTBDLElBQTFDO0FBQ0Q7QUEzQkg7QUFBQTtBQUFBLCtCQTZCV0MsS0E3QlgsRUE2QmtCO0FBQ2QsYUFBS0MsYUFBTCxDQUFtQixLQUFLWCxVQUF4QixFQUFvQyxLQUFLQyxVQUF6QyxFQUFxRCxJQUFyRDtBQUNBLFlBQUksS0FBS0csV0FBVCxFQUFzQixPQUFPLEtBQVA7QUFDdkI7QUFoQ0g7QUFBQTtBQUFBLHFDQWtDaUJRLEdBbENqQixFQWtDc0I7QUFDbEIsZ0JBQVFBLElBQUlDLElBQUosQ0FBU0MsSUFBakI7QUFDRSxlQUFLLE9BQUw7QUFDRSxpQkFBS2xCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJDLElBQXpCLENBQThCYyxJQUFJQyxJQUFKLENBQVNFLEtBQXZDO0FBQ0Y7QUFDQSxlQUFLLFVBQUw7QUFDRSxnQkFBSUgsSUFBSUMsSUFBSixDQUFTRSxLQUFiLEVBQW9CO0FBQ2xCLG1CQUFLQyxPQUFMO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsbUJBQUtDLE1BQUw7QUFDRDtBQUNIO0FBVkY7QUFZRDtBQS9DSDs7QUFBQTtBQUFBLElBQXFDM0IsU0FBckM7QUFpREQsQ0F4REQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2J1dHRvbi92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
