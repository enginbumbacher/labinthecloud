'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./field.html');

  return function (_DomView) {
    _inherits(FieldView, _DomView);

    function FieldView(model, tmpl) {
      _classCallCheck(this, FieldView);

      var _this = _possibleConstructorReturn(this, (FieldView.__proto__ || Object.getPrototypeOf(FieldView)).call(this, tmpl ? tmpl : Template));

      _this._onModelChange = _this._onModelChange.bind(_this);

      model.addEventListener('Model.Change', _this._onModelChange);
      _this.$el.addClass(model.get('classes').join(' '));
      return _this;
    }

    _createClass(FieldView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          case "disabled":
            if (evt.data.value) {
              this.disable();
            } else {
              this.enable();
            }
            break;
        }
      }
    }, {
      key: 'focus',
      value: function focus() {}
    }, {
      key: 'disable',
      value: function disable() {}
    }, {
      key: 'enable',
      value: function enable() {}
    }]);

    return FieldView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsIl9vbk1vZGVsQ2hhbmdlIiwiYmluZCIsImFkZEV2ZW50TGlzdGVuZXIiLCIkZWwiLCJhZGRDbGFzcyIsImdldCIsImpvaW4iLCJldnQiLCJkYXRhIiwicGF0aCIsInZhbHVlIiwiZGlzYWJsZSIsImVuYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSxtQkFBUixDQURiOztBQUdBO0FBQUE7O0FBQ0UsdUJBQVlHLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsd0hBQ2pCQSxPQUFPQSxJQUFQLEdBQWNGLFFBREc7O0FBRXZCLFlBQUtHLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkMsSUFBcEIsT0FBdEI7O0FBRUFILFlBQU1JLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtGLGNBQTVDO0FBQ0EsWUFBS0csR0FBTCxDQUFTQyxRQUFULENBQWtCTixNQUFNTyxHQUFOLENBQVUsU0FBVixFQUFxQkMsSUFBckIsQ0FBMEIsR0FBMUIsQ0FBbEI7QUFMdUI7QUFNeEI7O0FBUEg7QUFBQTtBQUFBLHFDQVNpQkMsR0FUakIsRUFTc0I7QUFDbEIsZ0JBQVFBLElBQUlDLElBQUosQ0FBU0MsSUFBakI7QUFDRSxlQUFLLFVBQUw7QUFDRSxnQkFBSUYsSUFBSUMsSUFBSixDQUFTRSxLQUFiLEVBQW9CO0FBQ2xCLG1CQUFLQyxPQUFMO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsbUJBQUtDLE1BQUw7QUFDRDtBQUNEO0FBUEo7QUFTRDtBQW5CSDtBQUFBO0FBQUEsOEJBcUJVLENBQUU7QUFyQlo7QUFBQTtBQUFBLGdDQXVCWSxDQUFFO0FBdkJkO0FBQUE7QUFBQSwrQkF5QlcsQ0FBRTtBQXpCYjs7QUFBQTtBQUFBLElBQStCaEIsT0FBL0I7QUEyQkQsQ0EvQkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
