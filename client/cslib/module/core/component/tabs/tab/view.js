'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      Template = require('text!./tab_page.html');

  return function (_DomView) {
    _inherits(TabPageView, _DomView);

    function TabPageView(model, tmpl) {
      _classCallCheck(this, TabPageView);

      var _this = _possibleConstructorReturn(this, (TabPageView.__proto__ || Object.getPrototypeOf(TabPageView)).call(this, tmpl || Template));

      _this.addChild(model.get('content'));
      return _this;
    }

    return TabPageView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVXRpbHMiLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsImFkZENoaWxkIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFHRUcsV0FBV0gsUUFBUSxzQkFBUixDQUhiOztBQUtBO0FBQUE7O0FBQ0UseUJBQVlJLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsNEhBQ2pCQSxRQUFRRixRQURTOztBQUV2QixZQUFLRyxRQUFMLENBQWNGLE1BQU1HLEdBQU4sQ0FBVSxTQUFWLENBQWQ7QUFGdUI7QUFHeEI7O0FBSkg7QUFBQSxJQUFpQ04sT0FBakM7QUFNRCxDQVpEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vdGFiX3BhZ2UuaHRtbCcpO1xuXG4gIHJldHVybiBjbGFzcyBUYWJQYWdlVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIHRoaXMuYWRkQ2hpbGQobW9kZWwuZ2V0KCdjb250ZW50JykpO1xuICAgIH1cbiAgfVxufSkiXX0=
