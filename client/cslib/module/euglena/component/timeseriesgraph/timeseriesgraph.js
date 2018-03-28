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

    return TimeSeries;
  }(Component);

  TimeSeries.create = function (data) {
    return new TimeSeries({ modelData: data });
  };

  return TimeSeries;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdGltZXNlcmllc2dyYXBoLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVTZXJpZXMiLCJjb25maWciLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsImxheWVyIiwibGlnaHRDb25maWciLCJjb2xvciIsInBhcnNlRGF0YSIsInNob3dMYXllckxpdmUiLCJzZXRMYXllckxpdmUiLCJ0aW1lc3RhbXAiLCJ2aWV3IiwidXBkYXRlIiwicmVzZXQiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7O0FBRGtCLE1BT1pLLFVBUFk7QUFBQTs7QUFRaEIsMEJBQXlCO0FBQUEsVUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUN2QkEsYUFBT0MsVUFBUCxHQUFvQkQsT0FBT0MsVUFBUCxJQUFxQkwsS0FBekM7QUFDQUksYUFBT0UsU0FBUCxHQUFtQkYsT0FBT0UsU0FBUCxJQUFvQkwsSUFBdkM7QUFGdUIscUhBR2pCRyxNQUhpQjtBQUl4Qjs7QUFaZTtBQUFBO0FBQUEsMkJBY1g7QUFDSCxlQUFPLEtBQUtHLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFoQmU7QUFBQTtBQUFBLGlDQWtCTEMsSUFsQkssRUFrQndDO0FBQUEsWUFBdkNDLEtBQXVDLHVFQUEvQixTQUErQjtBQUFBLFlBQXBCQyxXQUFvQjtBQUFBLFlBQVBDLEtBQU87O0FBQ3RELGFBQUtMLE1BQUwsQ0FBWU0sU0FBWixDQUFzQkosSUFBdEIsRUFBNEJDLEtBQTVCLEVBQW1DQyxXQUFuQyxFQUFnREMsS0FBaEQ7QUFDRDtBQXBCZTtBQUFBO0FBQUEsOEJBc0JSRSxhQXRCUSxFQXNCTztBQUNyQixhQUFLUCxNQUFMLENBQVlRLFlBQVosQ0FBeUJELGFBQXpCO0FBQ0Q7QUF4QmU7QUFBQTtBQUFBLDZCQTBCVEUsU0ExQlMsRUEwQkU7QUFDaEIsYUFBS0MsSUFBTCxHQUFZQyxNQUFaLENBQW1CRixTQUFuQixFQUE4QixLQUFLVCxNQUFuQztBQUNEO0FBNUJlO0FBQUE7QUFBQSw4QkE4QlI7QUFDTixhQUFLQSxNQUFMLENBQVlZLEtBQVo7QUFDRDtBQWhDZTs7QUFBQTtBQUFBLElBT09wQixTQVBQOztBQW1DbEJJLGFBQVdpQixNQUFYLEdBQW9CLFVBQUNYLElBQUQ7QUFBQSxXQUFVLElBQUlOLFVBQUosQ0FBZSxFQUFFa0IsV0FBV1osSUFBYixFQUFmLENBQVY7QUFBQSxHQUFwQjs7QUFFQSxTQUFPTixVQUFQO0FBQ0QsQ0F0Q0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3RpbWVzZXJpZXNncmFwaC90aW1lc2VyaWVzZ3JhcGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIGNsYXNzIFRpbWVTZXJpZXMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25maWcubW9kZWxDbGFzcyA9IGNvbmZpZy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgY29uZmlnLnZpZXdDbGFzcyA9IGNvbmZpZy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIGhhbmRsZURhdGEoZGF0YSwgbGF5ZXIgPSAnZGVmYXVsdCcsIGxpZ2h0Q29uZmlnLCBjb2xvcikge1xuICAgICAgdGhpcy5fbW9kZWwucGFyc2VEYXRhKGRhdGEsIGxheWVyLCBsaWdodENvbmZpZywgY29sb3IpO1xuICAgIH1cblxuICAgIHNldExpdmUoc2hvd0xheWVyTGl2ZSkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0TGF5ZXJMaXZlKHNob3dMYXllckxpdmUpO1xuICAgIH1cblxuICAgIHVwZGF0ZSh0aW1lc3RhbXApIHtcbiAgICAgIHRoaXMudmlldygpLnVwZGF0ZSh0aW1lc3RhbXAsIHRoaXMuX21vZGVsKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnJlc2V0KCk7XG4gICAgfVxuICB9XG5cbiAgVGltZVNlcmllcy5jcmVhdGUgPSAoZGF0YSkgPT4gbmV3IFRpbWVTZXJpZXMoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG5cbiAgcmV0dXJuIFRpbWVTZXJpZXM7XG59KVxuIl19
