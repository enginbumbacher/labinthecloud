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

  var TimeSeries = function (_Component) {
    _inherits(TimeSeries, _Component);

    function TimeSeries() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, TimeSeries);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      return _possibleConstructorReturn(this, (TimeSeries.__proto__ || Object.getPrototypeOf(TimeSeries)).call(this, config));
    }

    _createClass(TimeSeries, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'handleData',
      value: function handleData(data) {
        var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
        var color = arguments[2];

        this._model.parseData(data, layer, color);
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

    return TimeSeries;
  }(Component);

  TimeSeries.create = function (data) {
    return new TimeSeries({ modelData: data });
  };

  return TimeSeries;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdGltZXNlcmllc2dyYXBoLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVTZXJpZXMiLCJjb25maWciLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsImxheWVyIiwiY29sb3IiLCJwYXJzZURhdGEiLCJ0aW1lc3RhbXAiLCJ2aWV3IiwidXBkYXRlIiwicmVzZXQiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7O0FBRGtCLE1BT1pLLFVBUFk7QUFBQTs7QUFRaEIsMEJBQXlCO0FBQUEsVUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUN2QkEsYUFBT0MsVUFBUCxHQUFvQkQsT0FBT0MsVUFBUCxJQUFxQkwsS0FBekM7QUFDQUksYUFBT0UsU0FBUCxHQUFtQkYsT0FBT0UsU0FBUCxJQUFvQkwsSUFBdkM7QUFGdUIscUhBR2pCRyxNQUhpQjtBQUl4Qjs7QUFaZTtBQUFBO0FBQUEsMkJBY1g7QUFDSCxlQUFPLEtBQUtHLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFoQmU7QUFBQTtBQUFBLGlDQWtCTEMsSUFsQkssRUFrQjJCO0FBQUEsWUFBMUJDLEtBQTBCLHVFQUFsQixTQUFrQjtBQUFBLFlBQVBDLEtBQU87O0FBQ3pDLGFBQUtKLE1BQUwsQ0FBWUssU0FBWixDQUFzQkgsSUFBdEIsRUFBNEJDLEtBQTVCLEVBQW1DQyxLQUFuQztBQUNEO0FBcEJlO0FBQUE7QUFBQSw2QkFzQlRFLFNBdEJTLEVBc0JFO0FBQ2hCLGFBQUtDLElBQUwsR0FBWUMsTUFBWixDQUFtQkYsU0FBbkIsRUFBOEIsS0FBS04sTUFBbkM7QUFDRDtBQXhCZTtBQUFBO0FBQUEsOEJBMEJSO0FBQ04sYUFBS0EsTUFBTCxDQUFZUyxLQUFaO0FBQ0Q7QUE1QmU7O0FBQUE7QUFBQSxJQU9PakIsU0FQUDs7QUErQmxCSSxhQUFXYyxNQUFYLEdBQW9CLFVBQUNSLElBQUQ7QUFBQSxXQUFVLElBQUlOLFVBQUosQ0FBZSxFQUFFZSxXQUFXVCxJQUFiLEVBQWYsQ0FBVjtBQUFBLEdBQXBCOztBQUVBLFNBQU9OLFVBQVA7QUFDRCxDQWxDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdGltZXNlcmllc2dyYXBoL3RpbWVzZXJpZXNncmFwaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgY2xhc3MgVGltZVNlcmllcyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5tb2RlbENsYXNzID0gY29uZmlnLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBjb25maWcudmlld0NsYXNzID0gY29uZmlnLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgaGFuZGxlRGF0YShkYXRhLCBsYXllciA9ICdkZWZhdWx0JywgY29sb3IpIHtcbiAgICAgIHRoaXMuX21vZGVsLnBhcnNlRGF0YShkYXRhLCBsYXllciwgY29sb3IpO1xuICAgIH1cblxuICAgIHVwZGF0ZSh0aW1lc3RhbXApIHtcbiAgICAgIHRoaXMudmlldygpLnVwZGF0ZSh0aW1lc3RhbXAsIHRoaXMuX21vZGVsKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnJlc2V0KCk7XG4gICAgfVxuICB9XG5cbiAgVGltZVNlcmllcy5jcmVhdGUgPSAoZGF0YSkgPT4gbmV3IFRpbWVTZXJpZXMoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIFxuICByZXR1cm4gVGltZVNlcmllcztcbn0pIl19
