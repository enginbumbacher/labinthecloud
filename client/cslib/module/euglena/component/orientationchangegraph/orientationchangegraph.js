'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  var OrientationChange = function (_Component) {
    _inherits(OrientationChange, _Component);

    function OrientationChange() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, OrientationChange);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      return _possibleConstructorReturn(this, (OrientationChange.__proto__ || Object.getPrototypeOf(OrientationChange)).call(this, config));
    }

    _createClass(OrientationChange, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'handleData',
      value: function handleData(data) {
        var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
        var lightConfig = arguments[2];
        var color = arguments[3];

        this._model.parseData(data, layer, lightConfig, color);
      }
    }, {
      key: 'setLive',
      value: function setLive(showLayerLive) {
        this._model.setLayerLive(showLayerLive);
      }
    }, {
      key: 'update',
      value: function update(timestamp) {
        this.view().update(timestamp, this._model);
      }
    }, {
      key: 'reset',
      value: function reset() {
        this._model.reset();
      }
    }]);

    return OrientationChange;
  }(Component);

  OrientationChange.create = function (data) {
    return new OrientationChange({ modelData: data });
  };

  return OrientationChange;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9vcmllbnRhdGlvbmNoYW5nZWdyYXBoL29yaWVudGF0aW9uY2hhbmdlZ3JhcGguanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIlV0aWxzIiwiT3JpZW50YXRpb25DaGFuZ2UiLCJjb25maWciLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsImxheWVyIiwibGlnaHRDb25maWciLCJjb2xvciIsInBhcnNlRGF0YSIsInNob3dMYXllckxpdmUiLCJzZXRMYXllckxpdmUiLCJ0aW1lc3RhbXAiLCJ2aWV3IiwidXBkYXRlIiwicmVzZXQiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7O0FBRGtCLE1BT1pLLGlCQVBZO0FBQUE7O0FBUWhCLGlDQUF5QjtBQUFBLFVBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFDdkJBLGFBQU9DLFVBQVAsR0FBb0JELE9BQU9DLFVBQVAsSUFBcUJMLEtBQXpDO0FBQ0FJLGFBQU9FLFNBQVAsR0FBbUJGLE9BQU9FLFNBQVAsSUFBb0JMLElBQXZDO0FBRnVCLG1JQUdqQkcsTUFIaUI7QUFJeEI7O0FBWmU7QUFBQTtBQUFBLDJCQWNYO0FBQ0gsZUFBTyxLQUFLRyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBaEJlO0FBQUE7QUFBQSxpQ0FrQkxDLElBbEJLLEVBa0J3QztBQUFBLFlBQXZDQyxLQUF1Qyx1RUFBL0IsU0FBK0I7QUFBQSxZQUFwQkMsV0FBb0I7QUFBQSxZQUFQQyxLQUFPOztBQUN0RCxhQUFLTCxNQUFMLENBQVlNLFNBQVosQ0FBc0JKLElBQXRCLEVBQTRCQyxLQUE1QixFQUFtQ0MsV0FBbkMsRUFBZ0RDLEtBQWhEO0FBQ0Q7QUFwQmU7QUFBQTtBQUFBLDhCQXNCUkUsYUF0QlEsRUFzQk87QUFDckIsYUFBS1AsTUFBTCxDQUFZUSxZQUFaLENBQXlCRCxhQUF6QjtBQUNEO0FBeEJlO0FBQUE7QUFBQSw2QkEwQlRFLFNBMUJTLEVBMEJFO0FBQ2hCLGFBQUtDLElBQUwsR0FBWUMsTUFBWixDQUFtQkYsU0FBbkIsRUFBOEIsS0FBS1QsTUFBbkM7QUFDRDtBQTVCZTtBQUFBO0FBQUEsOEJBOEJSO0FBQ04sYUFBS0EsTUFBTCxDQUFZWSxLQUFaO0FBQ0Q7QUFoQ2U7O0FBQUE7QUFBQSxJQU9jcEIsU0FQZDs7QUFtQ2xCSSxvQkFBa0JpQixNQUFsQixHQUEyQixVQUFDWCxJQUFEO0FBQUEsV0FBVSxJQUFJTixpQkFBSixDQUFzQixFQUFFa0IsV0FBV1osSUFBYixFQUF0QixDQUFWO0FBQUEsR0FBM0I7O0FBRUEsU0FBT04saUJBQVA7QUFDRCxDQXRDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvb3JpZW50YXRpb25jaGFuZ2VncmFwaC9vcmllbnRhdGlvbmNoYW5nZWdyYXBoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpXG4gIDtcblxuICBjbGFzcyBPcmllbnRhdGlvbkNoYW5nZSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5tb2RlbENsYXNzID0gY29uZmlnLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBjb25maWcudmlld0NsYXNzID0gY29uZmlnLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgaGFuZGxlRGF0YShkYXRhLCBsYXllciA9ICdkZWZhdWx0JywgbGlnaHRDb25maWcsIGNvbG9yKSB7XG4gICAgICB0aGlzLl9tb2RlbC5wYXJzZURhdGEoZGF0YSwgbGF5ZXIsIGxpZ2h0Q29uZmlnLCBjb2xvcik7XG4gICAgfVxuXG4gICAgc2V0TGl2ZShzaG93TGF5ZXJMaXZlKSB7XG4gICAgICB0aGlzLl9tb2RlbC5zZXRMYXllckxpdmUoc2hvd0xheWVyTGl2ZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlKHRpbWVzdGFtcCkge1xuICAgICAgdGhpcy52aWV3KCkudXBkYXRlKHRpbWVzdGFtcCwgdGhpcy5fbW9kZWwpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICBPcmllbnRhdGlvbkNoYW5nZS5jcmVhdGUgPSAoZGF0YSkgPT4gbmV3IE9yaWVudGF0aW9uQ2hhbmdlKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuXG4gIHJldHVybiBPcmllbnRhdGlvbkNoYW5nZTtcbn0pXG4iXX0=
