'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./fieldwrap.html'),
      Button = require('core/component/button/field');

  return function (_DomView) {
    _inherits(FieldWrapView, _DomView);

    function FieldWrapView(settings) {
      _classCallCheck(this, FieldWrapView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldWrapView).call(this, Template));

      _this._btnContainer = _this.$el.find(".multifield__field__remove");
      _this.subfield = settings.field;
      _this.subview = _this.subfield.view();
      _this.addChild(_this.subview, ".multifield__field");
      if (settings.classes) _this.$el.addClass(settings.classes.join(' '));

      _this.closeBtn = Button.create({
        id: "field__close",
        label: "&times;",
        eventName: "MultiField.RemoveFieldRequest",
        eventData: {
          id: _this.subfield.id()
        }
      });

      _this.addChild(_this.closeBtn.view(), _this._btnContainer);
      return _this;
    }

    _createClass(FieldWrapView, [{
      key: 'lock',
      value: function lock() {
        this.removeChild(this.closeBtn.view());
        this.subfield.disable();
      }
    }, {
      key: 'unlock',
      value: function unlock() {
        this.addChild(this.closeBtn.view(), this._btnContainer);
        this.subfield.enable();
      }
    }, {
      key: 'hideRemoveButton',
      value: function hideRemoveButton() {
        this.closeBtn.view().hide();
      }
    }, {
      key: 'showRemoveButton',
      value: function showRemoveButton() {
        this.closeBtn.view().show();
      }
    }]);

    return FieldWrapView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkd3JhcC92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sVUFBVSxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRSxXQUFXLFFBQVEsdUJBQVIsQ0FEYjtBQUFBLE1BRUUsU0FBUyxRQUFRLDZCQUFSLENBRlg7O0FBSUE7QUFBQTs7QUFDRSwyQkFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQUEsbUdBQ2QsUUFEYzs7QUFFcEIsWUFBSyxhQUFMLEdBQXFCLE1BQUssR0FBTCxDQUFTLElBQVQsQ0FBYyw0QkFBZCxDQUFyQjtBQUNBLFlBQUssUUFBTCxHQUFnQixTQUFTLEtBQXpCO0FBQ0EsWUFBSyxPQUFMLEdBQWUsTUFBSyxRQUFMLENBQWMsSUFBZCxFQUFmO0FBQ0EsWUFBSyxRQUFMLENBQWMsTUFBSyxPQUFuQixFQUE0QixvQkFBNUI7QUFDQSxVQUFJLFNBQVMsT0FBYixFQUFzQixNQUFLLEdBQUwsQ0FBUyxRQUFULENBQWtCLFNBQVMsT0FBVCxDQUFpQixJQUFqQixDQUFzQixHQUF0QixDQUFsQjs7QUFFdEIsWUFBSyxRQUFMLEdBQWdCLE9BQU8sTUFBUCxDQUFjO0FBQzVCLFlBQUksY0FEd0I7QUFFNUIsZUFBTyxTQUZxQjtBQUc1QixtQkFBVywrQkFIaUI7QUFJNUIsbUJBQVc7QUFDVCxjQUFJLE1BQUssUUFBTCxDQUFjLEVBQWQ7QUFESztBQUppQixPQUFkLENBQWhCOztBQVNBLFlBQUssUUFBTCxDQUFjLE1BQUssUUFBTCxDQUFjLElBQWQsRUFBZCxFQUFvQyxNQUFLLGFBQXpDO0FBakJvQjtBQWtCckI7O0FBbkJIO0FBQUE7QUFBQSw2QkFxQlM7QUFDTCxhQUFLLFdBQUwsQ0FBaUIsS0FBSyxRQUFMLENBQWMsSUFBZCxFQUFqQjtBQUNBLGFBQUssUUFBTCxDQUFjLE9BQWQ7QUFDRDtBQXhCSDtBQUFBO0FBQUEsK0JBMEJXO0FBQ1AsYUFBSyxRQUFMLENBQWMsS0FBSyxRQUFMLENBQWMsSUFBZCxFQUFkLEVBQW9DLEtBQUssYUFBekM7QUFDQSxhQUFLLFFBQUwsQ0FBYyxNQUFkO0FBQ0Q7QUE3Qkg7QUFBQTtBQUFBLHlDQStCcUI7QUFDakIsYUFBSyxRQUFMLENBQWMsSUFBZCxHQUFxQixJQUFyQjtBQUNEO0FBakNIO0FBQUE7QUFBQSx5Q0FtQ3FCO0FBQ2pCLGFBQUssUUFBTCxDQUFjLElBQWQsR0FBcUIsSUFBckI7QUFDRDtBQXJDSDs7QUFBQTtBQUFBLElBQW1DLE9BQW5DO0FBdUNELENBNUNEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkd3JhcC92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
