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

      var _this = _possibleConstructorReturn(this, (FieldWrapView.__proto__ || Object.getPrototypeOf(FieldWrapView)).call(this, Template));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkd3JhcC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJCdXR0b24iLCJzZXR0aW5ncyIsIl9idG5Db250YWluZXIiLCIkZWwiLCJmaW5kIiwic3ViZmllbGQiLCJmaWVsZCIsInN1YnZpZXciLCJ2aWV3IiwiYWRkQ2hpbGQiLCJjbGFzc2VzIiwiYWRkQ2xhc3MiLCJqb2luIiwiY2xvc2VCdG4iLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwiZXZlbnROYW1lIiwiZXZlbnREYXRhIiwicmVtb3ZlQ2hpbGQiLCJkaXNhYmxlIiwiZW5hYmxlIiwiaGlkZSIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsdUJBQVIsQ0FEYjtBQUFBLE1BRUVHLFNBQVNILFFBQVEsNkJBQVIsQ0FGWDs7QUFJQTtBQUFBOztBQUNFLDJCQUFZSSxRQUFaLEVBQXNCO0FBQUE7O0FBQUEsZ0lBQ2RGLFFBRGM7O0FBRXBCLFlBQUtHLGFBQUwsR0FBcUIsTUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsNEJBQWQsQ0FBckI7QUFDQSxZQUFLQyxRQUFMLEdBQWdCSixTQUFTSyxLQUF6QjtBQUNBLFlBQUtDLE9BQUwsR0FBZSxNQUFLRixRQUFMLENBQWNHLElBQWQsRUFBZjtBQUNBLFlBQUtDLFFBQUwsQ0FBYyxNQUFLRixPQUFuQixFQUE0QixvQkFBNUI7QUFDQSxVQUFJTixTQUFTUyxPQUFiLEVBQXNCLE1BQUtQLEdBQUwsQ0FBU1EsUUFBVCxDQUFrQlYsU0FBU1MsT0FBVCxDQUFpQkUsSUFBakIsQ0FBc0IsR0FBdEIsQ0FBbEI7O0FBRXRCLFlBQUtDLFFBQUwsR0FBZ0JiLE9BQU9jLE1BQVAsQ0FBYztBQUM1QkMsWUFBSSxjQUR3QjtBQUU1QkMsZUFBTyxTQUZxQjtBQUc1QkMsbUJBQVcsK0JBSGlCO0FBSTVCQyxtQkFBVztBQUNUSCxjQUFJLE1BQUtWLFFBQUwsQ0FBY1UsRUFBZDtBQURLO0FBSmlCLE9BQWQsQ0FBaEI7O0FBU0EsWUFBS04sUUFBTCxDQUFjLE1BQUtJLFFBQUwsQ0FBY0wsSUFBZCxFQUFkLEVBQW9DLE1BQUtOLGFBQXpDO0FBakJvQjtBQWtCckI7O0FBbkJIO0FBQUE7QUFBQSw2QkFxQlM7QUFDTCxhQUFLaUIsV0FBTCxDQUFpQixLQUFLTixRQUFMLENBQWNMLElBQWQsRUFBakI7QUFDQSxhQUFLSCxRQUFMLENBQWNlLE9BQWQ7QUFDRDtBQXhCSDtBQUFBO0FBQUEsK0JBMEJXO0FBQ1AsYUFBS1gsUUFBTCxDQUFjLEtBQUtJLFFBQUwsQ0FBY0wsSUFBZCxFQUFkLEVBQW9DLEtBQUtOLGFBQXpDO0FBQ0EsYUFBS0csUUFBTCxDQUFjZ0IsTUFBZDtBQUNEO0FBN0JIO0FBQUE7QUFBQSx5Q0ErQnFCO0FBQ2pCLGFBQUtSLFFBQUwsQ0FBY0wsSUFBZCxHQUFxQmMsSUFBckI7QUFDRDtBQWpDSDtBQUFBO0FBQUEseUNBbUNxQjtBQUNqQixhQUFLVCxRQUFMLENBQWNMLElBQWQsR0FBcUJlLElBQXJCO0FBQ0Q7QUFyQ0g7O0FBQUE7QUFBQSxJQUFtQ3pCLE9BQW5DO0FBdUNELENBNUNEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkd3JhcC92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
