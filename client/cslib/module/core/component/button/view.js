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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRmllbGRWaWV3IiwiVGVtcGxhdGUiLCJVdGlscyIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiJGVsIiwiZmluZCIsImh0bWwiLCJnZXQiLCJfZXZlbnROYW1lIiwiX2V2ZW50RGF0YSIsIm9uIiwiX29uQ2xpY2siLCJfa2lsbE5hdGl2ZSIsImFkZENsYXNzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiZm9jdXMiLCJwcm9wIiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsImRpc2FibGUiLCJlbmFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSxnQ0FBUixDQUFsQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsb0JBQVIsQ0FEYjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjs7QUFJQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDZCQUFZSSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkQsS0FEaUIsRUFDVkMsT0FBT0EsSUFBUCxHQUFjSCxRQURKOztBQUV2QkMsWUFBTUcsV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLFVBQW5CLEVBQStCLE9BQS9CLENBQXhCOztBQUVBLFlBQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJDLElBQXpCLENBQThCTCxNQUFNTSxHQUFOLENBQVUsT0FBVixDQUE5QjtBQUNBLFlBQUtDLFVBQUwsR0FBa0JQLE1BQU1NLEdBQU4sQ0FBVSxXQUFWLENBQWxCO0FBQ0EsWUFBS0UsVUFBTCxHQUFrQlIsTUFBTU0sR0FBTixDQUFVLFdBQVYsQ0FBbEI7QUFDQSxZQUFLSCxHQUFMLENBQVNDLElBQVQsQ0FBYyxTQUFkLEVBQXlCSyxFQUF6QixDQUE0QixPQUE1QixFQUFxQyxNQUFLQyxRQUExQztBQUNBLFlBQUtDLFdBQUwsR0FBbUJYLE1BQU1NLEdBQU4sQ0FBVSxpQkFBVixDQUFuQjs7QUFFQSxVQUFJTixNQUFNTSxHQUFOLENBQVUsT0FBVixLQUFzQixRQUExQixFQUFvQztBQUNsQyxjQUFLSCxHQUFMLENBQVNTLFFBQVQsQ0FBa0JaLE1BQU1NLEdBQU4sQ0FBVSxPQUFWLENBQWxCO0FBQ0Q7QUFDRE4sWUFBTWEsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0MsY0FBNUM7QUFidUI7QUFjeEI7O0FBZkg7QUFBQTtBQUFBLDhCQWlCVTtBQUNOLGFBQUtYLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJXLEtBQXpCO0FBQ0Q7QUFuQkg7QUFBQTtBQUFBLCtCQXFCVztBQUNQLGFBQUtaLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJZLElBQXpCLENBQThCLFVBQTlCLEVBQTBDLEtBQTFDO0FBQ0Q7QUF2Qkg7QUFBQTtBQUFBLGdDQXlCWTtBQUNSLGFBQUtiLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJZLElBQXpCLENBQThCLFVBQTlCLEVBQTBDLElBQTFDO0FBQ0Q7QUEzQkg7QUFBQTtBQUFBLCtCQTZCV0MsS0E3QlgsRUE2QmtCO0FBQ2QsYUFBS0MsYUFBTCxDQUFtQixLQUFLWCxVQUF4QixFQUFvQyxLQUFLQyxVQUF6QyxFQUFxRCxJQUFyRDtBQUNBLFlBQUksS0FBS0csV0FBVCxFQUFzQixPQUFPLEtBQVA7QUFDdkI7QUFoQ0g7QUFBQTtBQUFBLHFDQWtDaUJRLEdBbENqQixFQWtDc0I7QUFDbEIsZ0JBQVFBLElBQUlDLElBQUosQ0FBU0MsSUFBakI7QUFDRSxlQUFLLE9BQUw7QUFDRSxpQkFBS2xCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJDLElBQXpCLENBQThCYyxJQUFJQyxJQUFKLENBQVNFLEtBQXZDO0FBQ0Y7QUFDQSxlQUFLLFVBQUw7QUFDRSxnQkFBSUgsSUFBSUMsSUFBSixDQUFTRSxLQUFiLEVBQW9CO0FBQ2xCLG1CQUFLQyxPQUFMO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsbUJBQUtDLE1BQUw7QUFDRDtBQUNIO0FBVkY7QUFZRDtBQS9DSDs7QUFBQTtBQUFBLElBQXFDM0IsU0FBckM7QUFpREQsQ0F4REQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2J1dHRvbi92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEZpZWxkVmlldyA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL2J1dHRvbi5odG1sJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKTtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEJ1dHRvbkZpZWxkVmlldyBleHRlbmRzIEZpZWxkVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKG1vZGVsLCB0bXBsID8gdG1wbCA6IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uTW9kZWxDaGFuZ2UnLCAnX29uQ2xpY2snLCAnZm9jdXMnXSk7XG4gICAgICBcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5idXR0b24nKS5odG1sKG1vZGVsLmdldCgnbGFiZWwnKSk7XG4gICAgICB0aGlzLl9ldmVudE5hbWUgPSBtb2RlbC5nZXQoJ2V2ZW50TmFtZScpO1xuICAgICAgdGhpcy5fZXZlbnREYXRhID0gbW9kZWwuZ2V0KCdldmVudERhdGEnKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5idXR0b24nKS5vbignY2xpY2snLCB0aGlzLl9vbkNsaWNrKTtcbiAgICAgIHRoaXMuX2tpbGxOYXRpdmUgPSBtb2RlbC5nZXQoXCJraWxsTmF0aXZlRXZlbnRcIik7XG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ3N0eWxlJykgIT0gXCJidXR0b25cIikge1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcyhtb2RlbC5nZXQoJ3N0eWxlJykpO1xuICAgICAgfVxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZSk7XG4gICAgfVxuXG4gICAgZm9jdXMoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuYnV0dG9uJykuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuYnV0dG9uJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5idXR0b24nKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgIH1cblxuICAgIF9vbkNsaWNrKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5fZXZlbnROYW1lLCB0aGlzLl9ldmVudERhdGEsIHRydWUpO1xuICAgICAgaWYgKHRoaXMuX2tpbGxOYXRpdmUpIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaCAoZXZ0LmRhdGEucGF0aCkge1xuICAgICAgICBjYXNlIFwibGFiZWxcIjpcbiAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuYnV0dG9uJykuaHRtbChldnQuZGF0YS52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzYWJsZWRcIjpcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7Il19
