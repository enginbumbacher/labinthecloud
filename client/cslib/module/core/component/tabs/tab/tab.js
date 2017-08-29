'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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
    }, {
      key: 'disable',
      value: function disable() {
        this._model.set('disabled', true);
        _get(Tab.prototype.__proto__ || Object.getPrototypeOf(Tab.prototype), 'disable', this).call(this);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this._model.set('disabled', false);
        _get(Tab.prototype.__proto__ || Object.getPrototypeOf(Tab.prototype), 'enable', this).call(this);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiUGFnZVZpZXciLCJUYWJWaWV3IiwiVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX3RhYiIsIl9tb2RlbCIsImdldCIsImlzU2VsZWN0ZWQiLCJzZXQiLCJjcmVhdGUiLCJkYXRhIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsV0FBV0gsUUFBUSxRQUFSLENBRmI7QUFBQSxNQUdFSSxVQUFVSixRQUFRLFlBQVIsQ0FIWjs7QUFEa0IsTUFNWkssR0FOWTtBQUFBOztBQU9oQixpQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUNwQkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QkwsS0FBN0M7QUFDQUksZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQkwsUUFBM0M7O0FBRm9CLDRHQUdkRyxRQUhjOztBQUtwQixZQUFLRyxJQUFMLEdBQVksSUFBSUwsT0FBSixDQUFZLE1BQUtNLE1BQWpCLENBQVo7QUFMb0I7QUFNckI7O0FBYmU7QUFBQTtBQUFBLDhCQWVSO0FBQ04sZUFBTyxLQUFLQSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBUDtBQUNEO0FBakJlO0FBQUE7QUFBQSwyQkFtQlg7QUFDSCxlQUFPLEtBQUtELE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFyQmU7QUFBQTtBQUFBLDRCQXVCVjtBQUNKLGVBQU8sS0FBS0YsSUFBWjtBQUNEO0FBekJlO0FBQUE7QUFBQSw2QkEyQlRHLFVBM0JTLEVBMkJHO0FBQ2pCLGFBQUtGLE1BQUwsQ0FBWUcsR0FBWixDQUFnQixVQUFoQixFQUE0QkQsVUFBNUI7QUFDRDtBQTdCZTtBQUFBO0FBQUEsZ0NBK0JOO0FBQ1IsYUFBS0YsTUFBTCxDQUFZRyxHQUFaLENBQWdCLFVBQWhCLEVBQTRCLElBQTVCO0FBQ0E7QUFDRDtBQWxDZTtBQUFBO0FBQUEsK0JBb0NQO0FBQ1AsYUFBS0gsTUFBTCxDQUFZRyxHQUFaLENBQWdCLFVBQWhCLEVBQTRCLEtBQTVCO0FBQ0E7QUFDRDtBQXZDZTs7QUFBQTtBQUFBLElBTUFaLFNBTkE7O0FBMENsQkksTUFBSVMsTUFBSixHQUFhLFlBQWU7QUFBQSxRQUFkQyxJQUFjLHVFQUFQLEVBQU87O0FBQzFCLFdBQU8sSUFBSVYsR0FBSixDQUFRLEVBQUVXLFdBQVdELElBQWIsRUFBUixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPVixHQUFQO0FBQ0QsQ0EvQ0QiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3RhYnMvdGFiL3RhYi5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
