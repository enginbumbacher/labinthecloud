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
      Template = require('text!./tab.html');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(ModelingTabView, _DomView);

    function ModelingTabView(model, tmpl) {
      _classCallCheck(this, ModelingTabView);

      var _this = _possibleConstructorReturn(this, (ModelingTabView.__proto__ || Object.getPrototypeOf(ModelingTabView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onTabClick', '_onModelChange']);

      model.addEventListener('Model.Change', _this._onModelChange);

      _this.$el.find('.modeling__tab').click(_this._onTabClick);
      _this.disableFields();
      return _this;
    }

    _createClass(ModelingTabView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "open") {
          this.$el.toggleClass('modeling__open', evt.data.value);
          this.updateFieldStatus(evt.currentTarget);
        }
      }
    }, {
      key: 'updateFieldStatus',
      value: function updateFieldStatus(model) {
        if (model.get('open')) {
          this.enableFields();
        } else {
          this.disableFields();
        }
      }
    }, {
      key: 'enableFields',
      value: function enableFields() {
        //this._graphSelect.enable();
        this.$el.find('input, button').removeProp('disabled');
      }
    }, {
      key: 'disableFields',
      value: function disableFields() {
        //this._graphSelect.disable();
        this.$el.find('input, button').prop('disabled', true);
      }
    }, {
      key: '_onTabClick',
      value: function _onTabClick(jqevt) {
        this.dispatchEvent('ModelingTab.ToggleRequest', {}, true);
      }
    }]);

    return ModelingTabView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsaW5nL3RhYi92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiJGVsIiwiZmluZCIsImNsaWNrIiwiX29uVGFiQ2xpY2siLCJkaXNhYmxlRmllbGRzIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ0b2dnbGVDbGFzcyIsInZhbHVlIiwidXBkYXRlRmllbGRTdGF0dXMiLCJjdXJyZW50VGFyZ2V0IiwiZ2V0IiwiZW5hYmxlRmllbGRzIiwicmVtb3ZlUHJvcCIsInByb3AiLCJqcWV2dCIsImRpc3BhdGNoRXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLGlCQUFSLENBRGI7O0FBR0FBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSw2QkFBWU0sS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxvSUFDakJBLFFBQVFGLFFBRFM7O0FBRXZCSixZQUFNTyxXQUFOLFFBQXdCLENBQ3RCLGFBRHNCLEVBQ1AsZ0JBRE8sQ0FBeEI7O0FBR0FGLFlBQU1HLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLGNBQTVDOztBQUVBLFlBQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGdCQUFkLEVBQWdDQyxLQUFoQyxDQUFzQyxNQUFLQyxXQUEzQztBQUNBLFlBQUtDLGFBQUw7QUFSdUI7QUFTeEI7O0FBVkg7QUFBQTtBQUFBLHFDQVlpQkMsR0FaakIsRUFZc0I7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxJQUFULElBQWlCLE1BQXJCLEVBQTZCO0FBQzNCLGVBQUtQLEdBQUwsQ0FBU1EsV0FBVCxDQUFxQixnQkFBckIsRUFBdUNILElBQUlDLElBQUosQ0FBU0csS0FBaEQ7QUFDQSxlQUFLQyxpQkFBTCxDQUF1QkwsSUFBSU0sYUFBM0I7QUFDRDtBQUNGO0FBakJIO0FBQUE7QUFBQSx3Q0FtQm9CaEIsS0FuQnBCLEVBbUIyQjtBQUN2QixZQUFJQSxNQUFNaUIsR0FBTixDQUFVLE1BQVYsQ0FBSixFQUF1QjtBQUNyQixlQUFLQyxZQUFMO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBS1QsYUFBTDtBQUNEO0FBQ0Y7QUF6Qkg7QUFBQTtBQUFBLHFDQTJCaUI7QUFDYjtBQUNBLGFBQUtKLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGVBQWQsRUFBK0JhLFVBQS9CLENBQTBDLFVBQTFDO0FBQ0Q7QUE5Qkg7QUFBQTtBQUFBLHNDQWdDa0I7QUFDZDtBQUNBLGFBQUtkLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGVBQWQsRUFBK0JjLElBQS9CLENBQW9DLFVBQXBDLEVBQWdELElBQWhEO0FBQ0Q7QUFuQ0g7QUFBQTtBQUFBLGtDQXFDY0MsS0FyQ2QsRUFxQ3FCO0FBQ2pCLGFBQUtDLGFBQUwsQ0FBbUIsMkJBQW5CLEVBQWdELEVBQWhELEVBQW9ELElBQXBEO0FBQ0Q7QUF2Q0g7O0FBQUE7QUFBQSxJQUFxQ3hCLE9BQXJDO0FBeUNELENBbkREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsaW5nL3RhYi92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vdGFiLmh0bWwnKTtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIE1vZGVsaW5nVGFiVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vblRhYkNsaWNrJywgJ19vbk1vZGVsQ2hhbmdlJ10pXG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpXG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5tb2RlbGluZ19fdGFiJykuY2xpY2sodGhpcy5fb25UYWJDbGljaylcbiAgICAgIHRoaXMuZGlzYWJsZUZpZWxkcygpO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJvcGVuXCIpIHtcbiAgICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ21vZGVsaW5nX19vcGVuJywgZXZ0LmRhdGEudmFsdWUpXG4gICAgICAgIHRoaXMudXBkYXRlRmllbGRTdGF0dXMoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUZpZWxkU3RhdHVzKG1vZGVsKSB7XG4gICAgICBpZiAobW9kZWwuZ2V0KCdvcGVuJykpIHtcbiAgICAgICAgdGhpcy5lbmFibGVGaWVsZHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZUZpZWxkcygpIHtcbiAgICAgIC8vdGhpcy5fZ3JhcGhTZWxlY3QuZW5hYmxlKCk7XG4gICAgICB0aGlzLiRlbC5maW5kKCdpbnB1dCwgYnV0dG9uJykucmVtb3ZlUHJvcCgnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlRmllbGRzKCkge1xuICAgICAgLy90aGlzLl9ncmFwaFNlbGVjdC5kaXNhYmxlKCk7XG4gICAgICB0aGlzLiRlbC5maW5kKCdpbnB1dCwgYnV0dG9uJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBfb25UYWJDbGljayhqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0Jywge30sIHRydWUpO1xuICAgIH1cbiAgfVxufSlcbiJdfQ==
