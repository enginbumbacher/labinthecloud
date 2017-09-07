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

  var CircleHistogram = function (_Component) {
    _inherits(CircleHistogram, _Component);

    function CircleHistogram() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, CircleHistogram);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      return _possibleConstructorReturn(this, (CircleHistogram.__proto__ || Object.getPrototypeOf(CircleHistogram)).call(this, config));
    }

    _createClass(CircleHistogram, [{
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
      value: function update(timestamp, lights) {
        this._model.update(timestamp, lights);
      }
    }, {
      key: 'reset',
      value: function reset() {
        this._model.reset();
      }
    }]);

    return CircleHistogram;
  }(Component);

  CircleHistogram.create = function (data) {
    return new CircleHistogram({ modelData: data });
  };

  return CircleHistogram;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJDaXJjbGVIaXN0b2dyYW0iLCJjb25maWciLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsImxheWVyIiwiY29sb3IiLCJwYXJzZURhdGEiLCJzaG93TGF5ZXJMaXZlIiwic2V0TGF5ZXJMaXZlIiwidGltZXN0YW1wIiwibGlnaHRzIiwidXBkYXRlIiwicmVzZXQiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7O0FBRGtCLE1BT1pLLGVBUFk7QUFBQTs7QUFRaEIsK0JBQXlCO0FBQUEsVUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUN2QkEsYUFBT0MsVUFBUCxHQUFvQkQsT0FBT0MsVUFBUCxJQUFxQkwsS0FBekM7QUFDQUksYUFBT0UsU0FBUCxHQUFtQkYsT0FBT0UsU0FBUCxJQUFvQkwsSUFBdkM7QUFGdUIsK0hBR2pCRyxNQUhpQjtBQUl4Qjs7QUFaZTtBQUFBO0FBQUEsMkJBY1g7QUFDSCxlQUFPLEtBQUtHLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFoQmU7QUFBQTtBQUFBLGlDQWtCTEMsSUFsQkssRUFrQjJCO0FBQUEsWUFBMUJDLEtBQTBCLHVFQUFsQixTQUFrQjtBQUFBLFlBQVBDLEtBQU87O0FBQ3pDLGFBQUtKLE1BQUwsQ0FBWUssU0FBWixDQUFzQkgsSUFBdEIsRUFBNEJDLEtBQTVCLEVBQW1DQyxLQUFuQztBQUNEO0FBcEJlO0FBQUE7QUFBQSw4QkFzQlJFLGFBdEJRLEVBc0JPO0FBQ3JCLGFBQUtOLE1BQUwsQ0FBWU8sWUFBWixDQUF5QkQsYUFBekI7QUFDRDtBQXhCZTtBQUFBO0FBQUEsNkJBMEJURSxTQTFCUyxFQTBCRUMsTUExQkYsRUEwQlU7QUFDeEIsYUFBS1QsTUFBTCxDQUFZVSxNQUFaLENBQW1CRixTQUFuQixFQUE4QkMsTUFBOUI7QUFDRDtBQTVCZTtBQUFBO0FBQUEsOEJBOEJSO0FBQ04sYUFBS1QsTUFBTCxDQUFZVyxLQUFaO0FBQ0Q7QUFoQ2U7O0FBQUE7QUFBQSxJQU9ZbkIsU0FQWjs7QUFtQ2xCSSxrQkFBZ0JnQixNQUFoQixHQUF5QixVQUFDVixJQUFEO0FBQUEsV0FBVSxJQUFJTixlQUFKLENBQW9CLEVBQUVpQixXQUFXWCxJQUFiLEVBQXBCLENBQVY7QUFBQSxHQUF6Qjs7QUFFQSxTQUFPTixlQUFQO0FBQ0QsQ0F0Q0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2NpcmNsZWdyYXBoL2NpcmNsZWdyYXBoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpXG4gIDtcblxuICBjbGFzcyBDaXJjbGVIaXN0b2dyYW0gZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25maWcubW9kZWxDbGFzcyA9IGNvbmZpZy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgY29uZmlnLnZpZXdDbGFzcyA9IGNvbmZpZy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIGhhbmRsZURhdGEoZGF0YSwgbGF5ZXIgPSAnZGVmYXVsdCcsIGNvbG9yKSB7XG4gICAgICB0aGlzLl9tb2RlbC5wYXJzZURhdGEoZGF0YSwgbGF5ZXIsIGNvbG9yKTtcbiAgICB9XG5cbiAgICBzZXRMaXZlKHNob3dMYXllckxpdmUpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldExheWVyTGl2ZShzaG93TGF5ZXJMaXZlKTtcbiAgICB9XG5cbiAgICB1cGRhdGUodGltZXN0YW1wLCBsaWdodHMpIHtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZSh0aW1lc3RhbXAsIGxpZ2h0cyk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIENpcmNsZUhpc3RvZ3JhbS5jcmVhdGUgPSAoZGF0YSkgPT4gbmV3IENpcmNsZUhpc3RvZ3JhbSh7IG1vZGVsRGF0YTogZGF0YSB9KTtcblxuICByZXR1cm4gQ2lyY2xlSGlzdG9ncmFtO1xufSlcbiJdfQ==
