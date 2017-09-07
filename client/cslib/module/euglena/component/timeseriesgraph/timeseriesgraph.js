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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdGltZXNlcmllc2dyYXBoLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVTZXJpZXMiLCJjb25maWciLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsImxheWVyIiwiY29sb3IiLCJwYXJzZURhdGEiLCJzaG93TGF5ZXJMaXZlIiwic2V0TGF5ZXJMaXZlIiwidGltZXN0YW1wIiwidmlldyIsInVwZGF0ZSIsInJlc2V0IiwiY3JlYXRlIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWOztBQURrQixNQU9aSyxVQVBZO0FBQUE7O0FBUWhCLDBCQUF5QjtBQUFBLFVBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFDdkJBLGFBQU9DLFVBQVAsR0FBb0JELE9BQU9DLFVBQVAsSUFBcUJMLEtBQXpDO0FBQ0FJLGFBQU9FLFNBQVAsR0FBbUJGLE9BQU9FLFNBQVAsSUFBb0JMLElBQXZDO0FBRnVCLHFIQUdqQkcsTUFIaUI7QUFJeEI7O0FBWmU7QUFBQTtBQUFBLDJCQWNYO0FBQ0gsZUFBTyxLQUFLRyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBaEJlO0FBQUE7QUFBQSxpQ0FrQkxDLElBbEJLLEVBa0IyQjtBQUFBLFlBQTFCQyxLQUEwQix1RUFBbEIsU0FBa0I7QUFBQSxZQUFQQyxLQUFPOztBQUN6QyxhQUFLSixNQUFMLENBQVlLLFNBQVosQ0FBc0JILElBQXRCLEVBQTRCQyxLQUE1QixFQUFtQ0MsS0FBbkM7QUFDRDtBQXBCZTtBQUFBO0FBQUEsOEJBc0JSRSxhQXRCUSxFQXNCTztBQUNyQixhQUFLTixNQUFMLENBQVlPLFlBQVosQ0FBeUJELGFBQXpCO0FBQ0Q7QUF4QmU7QUFBQTtBQUFBLDZCQTBCVEUsU0ExQlMsRUEwQkU7QUFDaEIsYUFBS0MsSUFBTCxHQUFZQyxNQUFaLENBQW1CRixTQUFuQixFQUE4QixLQUFLUixNQUFuQztBQUNEO0FBNUJlO0FBQUE7QUFBQSw4QkE4QlI7QUFDTixhQUFLQSxNQUFMLENBQVlXLEtBQVo7QUFDRDtBQWhDZTs7QUFBQTtBQUFBLElBT09uQixTQVBQOztBQW1DbEJJLGFBQVdnQixNQUFYLEdBQW9CLFVBQUNWLElBQUQ7QUFBQSxXQUFVLElBQUlOLFVBQUosQ0FBZSxFQUFFaUIsV0FBV1gsSUFBYixFQUFmLENBQVY7QUFBQSxHQUFwQjs7QUFFQSxTQUFPTixVQUFQO0FBQ0QsQ0F0Q0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3RpbWVzZXJpZXNncmFwaC90aW1lc2VyaWVzZ3JhcGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIGNsYXNzIFRpbWVTZXJpZXMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25maWcubW9kZWxDbGFzcyA9IGNvbmZpZy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgY29uZmlnLnZpZXdDbGFzcyA9IGNvbmZpZy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIGhhbmRsZURhdGEoZGF0YSwgbGF5ZXIgPSAnZGVmYXVsdCcsIGNvbG9yKSB7XG4gICAgICB0aGlzLl9tb2RlbC5wYXJzZURhdGEoZGF0YSwgbGF5ZXIsIGNvbG9yKTtcbiAgICB9XG5cbiAgICBzZXRMaXZlKHNob3dMYXllckxpdmUpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldExheWVyTGl2ZShzaG93TGF5ZXJMaXZlKTtcbiAgICB9XG4gICAgXG4gICAgdXBkYXRlKHRpbWVzdGFtcCkge1xuICAgICAgdGhpcy52aWV3KCkudXBkYXRlKHRpbWVzdGFtcCwgdGhpcy5fbW9kZWwpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICBUaW1lU2VyaWVzLmNyZWF0ZSA9IChkYXRhKSA9PiBuZXcgVGltZVNlcmllcyh7IG1vZGVsRGF0YTogZGF0YSB9KTtcblxuICByZXR1cm4gVGltZVNlcmllcztcbn0pXG4iXX0=
