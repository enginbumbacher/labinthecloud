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

    return TimeSeries;
  }(Component);

  TimeSeries.create = function (data) {
    return new TimeSeries({ modelData: data });
  };

  return TimeSeries;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9hbmdsZWNoYW5nZWdyYXBoL3RpbWVzZXJpZXNncmFwaC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJUaW1lU2VyaWVzIiwiY29uZmlnIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsIl9tb2RlbCIsImdldCIsImRhdGEiLCJsYXllciIsImNvbG9yIiwicGFyc2VEYXRhIiwic2hvd0xheWVyTGl2ZSIsInNldExheWVyTGl2ZSIsInRpbWVzdGFtcCIsInZpZXciLCJ1cGRhdGUiLCJyZXNldCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFPWkssVUFQWTtBQUFBOztBQVFoQiwwQkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCTCxLQUF6QztBQUNBSSxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CTCxJQUF2QztBQUZ1QixxSEFHakJHLE1BSGlCO0FBSXhCOztBQVplO0FBQUE7QUFBQSwyQkFjWDtBQUNILGVBQU8sS0FBS0csTUFBTCxDQUFZQyxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQWhCZTtBQUFBO0FBQUEsaUNBa0JMQyxJQWxCSyxFQWtCMkI7QUFBQSxZQUExQkMsS0FBMEIsdUVBQWxCLFNBQWtCO0FBQUEsWUFBUEMsS0FBTzs7QUFDekMsYUFBS0osTUFBTCxDQUFZSyxTQUFaLENBQXNCSCxJQUF0QixFQUE0QkMsS0FBNUIsRUFBbUNDLEtBQW5DO0FBQ0Q7QUFwQmU7QUFBQTtBQUFBLDhCQXNCUkUsYUF0QlEsRUFzQk87QUFDckIsYUFBS04sTUFBTCxDQUFZTyxZQUFaLENBQXlCRCxhQUF6QjtBQUNEO0FBeEJlO0FBQUE7QUFBQSw2QkEwQlRFLFNBMUJTLEVBMEJFO0FBQ2hCLGFBQUtDLElBQUwsR0FBWUMsTUFBWixDQUFtQkYsU0FBbkIsRUFBOEIsS0FBS1IsTUFBbkM7QUFDRDtBQTVCZTtBQUFBO0FBQUEsOEJBOEJSO0FBQ04sYUFBS0EsTUFBTCxDQUFZVyxLQUFaO0FBQ0Q7QUFoQ2U7O0FBQUE7QUFBQSxJQU9PbkIsU0FQUDs7QUFtQ2xCSSxhQUFXZ0IsTUFBWCxHQUFvQixVQUFDVixJQUFEO0FBQUEsV0FBVSxJQUFJTixVQUFKLENBQWUsRUFBRWlCLFdBQVdYLElBQWIsRUFBZixDQUFWO0FBQUEsR0FBcEI7O0FBRUEsU0FBT04sVUFBUDtBQUNELENBdENEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9hbmdsZWNoYW5nZWdyYXBoL3RpbWVzZXJpZXNncmFwaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgY2xhc3MgVGltZVNlcmllcyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5tb2RlbENsYXNzID0gY29uZmlnLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBjb25maWcudmlld0NsYXNzID0gY29uZmlnLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgaGFuZGxlRGF0YShkYXRhLCBsYXllciA9ICdkZWZhdWx0JywgY29sb3IpIHtcbiAgICAgIHRoaXMuX21vZGVsLnBhcnNlRGF0YShkYXRhLCBsYXllciwgY29sb3IpO1xuICAgIH1cblxuICAgIHNldExpdmUoc2hvd0xheWVyTGl2ZSkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0TGF5ZXJMaXZlKHNob3dMYXllckxpdmUpO1xuICAgIH1cbiAgICBcbiAgICB1cGRhdGUodGltZXN0YW1wKSB7XG4gICAgICB0aGlzLnZpZXcoKS51cGRhdGUodGltZXN0YW1wLCB0aGlzLl9tb2RlbCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIFRpbWVTZXJpZXMuY3JlYXRlID0gKGRhdGEpID0+IG5ldyBUaW1lU2VyaWVzKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuXG4gIHJldHVybiBUaW1lU2VyaWVzO1xufSlcbiJdfQ==
