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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldView).call(this, tmpl ? tmpl : Template));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxVQUFVLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFLFdBQVcsUUFBUSxtQkFBUixDQURiOztBQUdBO0FBQUE7O0FBQ0UsdUJBQVksS0FBWixFQUFtQixJQUFuQixFQUF5QjtBQUFBOztBQUFBLCtGQUNqQixPQUFPLElBQVAsR0FBYyxRQURHOztBQUV2QixZQUFLLGNBQUwsR0FBc0IsTUFBSyxjQUFMLENBQW9CLElBQXBCLE9BQXRCOztBQUVBLFlBQU0sZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBSyxjQUE1QztBQUNBLFlBQUssR0FBTCxDQUFTLFFBQVQsQ0FBa0IsTUFBTSxHQUFOLENBQVUsU0FBVixFQUFxQixJQUFyQixDQUEwQixHQUExQixDQUFsQjtBQUx1QjtBQU14Qjs7QUFQSDtBQUFBO0FBQUEscUNBU2lCLEdBVGpCLEVBU3NCO0FBQ2xCLGdCQUFRLElBQUksSUFBSixDQUFTLElBQWpCO0FBQ0UsZUFBSyxVQUFMO0FBQ0UsZ0JBQUksSUFBSSxJQUFKLENBQVMsS0FBYixFQUFvQjtBQUNsQixtQkFBSyxPQUFMO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsbUJBQUssTUFBTDtBQUNEO0FBQ0Q7QUFQSjtBQVNEO0FBbkJIO0FBQUE7QUFBQSw4QkFxQlUsQ0FBRTtBQXJCWjtBQUFBO0FBQUEsZ0NBdUJZLENBQUU7QUF2QmQ7QUFBQTtBQUFBLCtCQXlCVyxDQUFFO0FBekJiOztBQUFBO0FBQUEsSUFBK0IsT0FBL0I7QUEyQkQsQ0EvQkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
