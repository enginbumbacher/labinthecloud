'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Application View
// ================
// 
// Provides a default template for an application.

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./app.html');

  return function (_DomView) {
    _inherits(AppView, _DomView);

    function AppView(tmpl) {
      _classCallCheck(this, AppView);

      tmpl = tmpl || Template;
      return _possibleConstructorReturn(this, (AppView.__proto__ || Object.getPrototypeOf(AppView)).call(this, tmpl));
    }

    return AppView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2FwcC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJ0bXBsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSxpQkFBUixDQURiOztBQUdBO0FBQUE7O0FBQ0UscUJBQVlHLElBQVosRUFBa0I7QUFBQTs7QUFDaEJBLGFBQU9BLFFBQVFELFFBQWY7QUFEZ0IsK0dBRVZDLElBRlU7QUFHakI7O0FBSkg7QUFBQSxJQUE2QkYsT0FBN0I7QUFNRCxDQVZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2FwcC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQXBwbGljYXRpb24gVmlld1xuLy8gPT09PT09PT09PT09PT09PVxuLy8gXG4vLyBQcm92aWRlcyBhIGRlZmF1bHQgdGVtcGxhdGUgZm9yIGFuIGFwcGxpY2F0aW9uLlxuXG5kZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL2FwcC5odG1sJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEFwcFZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcih0bXBsKSB7XG4gICAgICB0bXBsID0gdG1wbCB8fCBUZW1wbGF0ZTtcbiAgICAgIHN1cGVyKHRtcGwpO1xuICAgIH1cbiAgfVxufSk7XG4iXX0=
