'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      PageView = require('./view'),
      TabView = require('./tab_view');

  var Tab = function (_Component) {
    _inherits(Tab, _Component);

    function Tab(settings) {
      _classCallCheck(this, Tab);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || PageView;

      var _this = _possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).call(this, settings));

      _this._tab = new TabView(_this._model);
      return _this;
    }

    _createClass(Tab, [{
      key: 'title',
      value: function title() {
        return this._model.get('title');
      }
    }, {
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'tab',
      value: function tab() {
        return this._tab;
      }
    }, {
      key: 'select',
      value: function select(isSelected) {
        this._model.set('selected', isSelected);
      }
    }]);

    return Tab;
  }(Component);

  Tab.create = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new Tab({ modelData: data });
  };

  return Tab;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiUGFnZVZpZXciLCJUYWJWaWV3IiwiVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX3RhYiIsIl9tb2RlbCIsImdldCIsImlzU2VsZWN0ZWQiLCJzZXQiLCJjcmVhdGUiLCJkYXRhIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVdILFFBQVEsUUFBUixDQUZiO0FBQUEsTUFHRUksVUFBVUosUUFBUSxZQUFSLENBSFo7O0FBRGtCLE1BTVpLLEdBTlk7QUFBQTs7QUFPaEIsaUJBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFDcEJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJMLEtBQTdDO0FBQ0FJLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JMLFFBQTNDOztBQUZvQiw0R0FHZEcsUUFIYzs7QUFLcEIsWUFBS0csSUFBTCxHQUFZLElBQUlMLE9BQUosQ0FBWSxNQUFLTSxNQUFqQixDQUFaO0FBTG9CO0FBTXJCOztBQWJlO0FBQUE7QUFBQSw4QkFlUjtBQUNOLGVBQU8sS0FBS0EsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQVA7QUFDRDtBQWpCZTtBQUFBO0FBQUEsMkJBbUJYO0FBQ0gsZUFBTyxLQUFLRCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBckJlO0FBQUE7QUFBQSw0QkF1QlY7QUFDSixlQUFPLEtBQUtGLElBQVo7QUFDRDtBQXpCZTtBQUFBO0FBQUEsNkJBMkJURyxVQTNCUyxFQTJCRztBQUNqQixhQUFLRixNQUFMLENBQVlHLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEJELFVBQTVCO0FBQ0Q7QUE3QmU7O0FBQUE7QUFBQSxJQU1BWCxTQU5BOztBQWdDbEJJLE1BQUlTLE1BQUosR0FBYSxZQUFlO0FBQUEsUUFBZEMsSUFBYyx1RUFBUCxFQUFPOztBQUMxQixXQUFPLElBQUlWLEdBQUosQ0FBUSxFQUFFVyxXQUFXRCxJQUFiLEVBQVIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT1YsR0FBUDtBQUNELENBckNEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi90YWIuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
