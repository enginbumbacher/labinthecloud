'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      Template = require('text!./tabs.html');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(TabsView, _DomView);

    function TabsView(model, tmpl) {
      _classCallCheck(this, TabsView);

      var _this = _possibleConstructorReturn(this, (TabsView.__proto__ || Object.getPrototypeOf(TabsView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);

      _this._tabs = [];
      _this._page = null;

      _this._renderTabs(model);
      _this._renderPage(model);
      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(TabsView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        var model = evt.currentTarget;
        if (evt.data.path == "currentIndex") {
          this._renderPage(model);
        } else if (evt.data.path == "tabs") {
          this._renderTabs(model);
          this._renderPage(model);
        }
      }
    }, {
      key: '_renderTabs',
      value: function _renderTabs(model) {
        var _this2 = this;

        while (this._tabs.length) {
          this.removeChild(this._tabs.pop());
        }
        model.get('tabs').forEach(function (tab, ind) {
          var t = tab.tab();
          _this2._tabs.push(t);
          _this2.addChild(t, ".tabs__tabs");
        });
      }
    }, {
      key: '_renderPage',
      value: function _renderPage(model) {
        if (this._page) this.removeChild(this._page);
        if (model.currentTab()) {
          this._page = model.currentTab().view();
          this.addChild(this._page, ".tabs__page");
        }
      }
    }]);

    return TabsView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJVdGlscyIsIlRlbXBsYXRlIiwibW9kZWwiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfdGFicyIsIl9wYWdlIiwiX3JlbmRlclRhYnMiLCJfcmVuZGVyUGFnZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsImV2dCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhIiwicGF0aCIsImxlbmd0aCIsInJlbW92ZUNoaWxkIiwicG9wIiwiZ2V0IiwiZm9yRWFjaCIsInRhYiIsImluZCIsInQiLCJwdXNoIiwiYWRkQ2hpbGQiLCJjdXJyZW50VGFiIiwidmlldyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsV0FBV0gsUUFBUSxrQkFBUixDQUZiOztBQUlBQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0Usc0JBQVlJLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsc0hBQ2pCQSxRQUFRRixRQURTOztBQUd2QkQsWUFBTUksV0FBTixRQUF3QixDQUFDLGdCQUFELENBQXhCOztBQUVBLFlBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0EsWUFBS0MsS0FBTCxHQUFhLElBQWI7O0FBRUEsWUFBS0MsV0FBTCxDQUFpQkwsS0FBakI7QUFDQSxZQUFLTSxXQUFMLENBQWlCTixLQUFqQjtBQUNBQSxZQUFNTyxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLQyxjQUE1QztBQVZ1QjtBQVd4Qjs7QUFaSDtBQUFBO0FBQUEscUNBY2lCQyxHQWRqQixFQWNzQjtBQUNsQixZQUFNVCxRQUFRUyxJQUFJQyxhQUFsQjtBQUNBLFlBQUlELElBQUlFLElBQUosQ0FBU0MsSUFBVCxJQUFpQixjQUFyQixFQUFxQztBQUNuQyxlQUFLTixXQUFMLENBQWlCTixLQUFqQjtBQUNELFNBRkQsTUFFTyxJQUFJUyxJQUFJRSxJQUFKLENBQVNDLElBQVQsSUFBaUIsTUFBckIsRUFBNkI7QUFDbEMsZUFBS1AsV0FBTCxDQUFpQkwsS0FBakI7QUFDQSxlQUFLTSxXQUFMLENBQWlCTixLQUFqQjtBQUNEO0FBQ0Y7QUF0Qkg7QUFBQTtBQUFBLGtDQXdCY0EsS0F4QmQsRUF3QnFCO0FBQUE7O0FBQ2pCLGVBQU8sS0FBS0csS0FBTCxDQUFXVSxNQUFsQixFQUEwQjtBQUN4QixlQUFLQyxXQUFMLENBQWlCLEtBQUtYLEtBQUwsQ0FBV1ksR0FBWCxFQUFqQjtBQUNEO0FBQ0RmLGNBQU1nQixHQUFOLENBQVUsTUFBVixFQUFrQkMsT0FBbEIsQ0FBMEIsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDdEMsY0FBSUMsSUFBSUYsSUFBSUEsR0FBSixFQUFSO0FBQ0EsaUJBQUtmLEtBQUwsQ0FBV2tCLElBQVgsQ0FBZ0JELENBQWhCO0FBQ0EsaUJBQUtFLFFBQUwsQ0FBY0YsQ0FBZCxFQUFpQixhQUFqQjtBQUNELFNBSkQ7QUFLRDtBQWpDSDtBQUFBO0FBQUEsa0NBbUNjcEIsS0FuQ2QsRUFtQ3FCO0FBQ2pCLFlBQUksS0FBS0ksS0FBVCxFQUFnQixLQUFLVSxXQUFMLENBQWlCLEtBQUtWLEtBQXRCO0FBQ2hCLFlBQUlKLE1BQU11QixVQUFOLEVBQUosRUFBd0I7QUFDdEIsZUFBS25CLEtBQUwsR0FBYUosTUFBTXVCLFVBQU4sR0FBbUJDLElBQW5CLEVBQWI7QUFDQSxlQUFLRixRQUFMLENBQWMsS0FBS2xCLEtBQW5CLEVBQTBCLGFBQTFCO0FBQ0Q7QUFDRjtBQXpDSDs7QUFBQTtBQUFBLElBQThCUCxPQUE5QjtBQTJDRCxDQWxERCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvdGFicy92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
