'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var EuglenaDisplay = function (_Component) {
    _inherits(EuglenaDisplay, _Component);

    function EuglenaDisplay() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, EuglenaDisplay);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (EuglenaDisplay.__proto__ || Object.getPrototypeOf(EuglenaDisplay)).call(this, settings));

      _this._lastRender = 0;
      return _this;
    }

    _createClass(EuglenaDisplay, [{
      key: 'handleData',
      value: function handleData(results, model, color) {
        if (results.magnification) this._model.setMagnification(results.magnification);
        this._model.setTrackData(results.tracks, model, color);
      }
    }, {
      key: 'render',
      value: function render(lights, time) {
        this.view().render({
          lights: lights,
          time: time,
          model: this._model
        });
      }
    }]);

    return EuglenaDisplay;
  }(Component);

  EuglenaDisplay.create = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new EuglenaDisplay({ modelData: data });
  };

  return EuglenaDisplay;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hZGlzcGxheS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJITSIsIkV1Z2xlbmFEaXNwbGF5Iiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX2xhc3RSZW5kZXIiLCJyZXN1bHRzIiwibW9kZWwiLCJjb2xvciIsIm1hZ25pZmljYXRpb24iLCJfbW9kZWwiLCJzZXRNYWduaWZpY2F0aW9uIiwic2V0VHJhY2tEYXRhIiwidHJhY2tzIiwibGlnaHRzIiwidGltZSIsInZpZXciLCJyZW5kZXIiLCJjcmVhdGUiLCJkYXRhIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWO0FBQUEsTUFJRUssS0FBS0wsUUFBUSx5QkFBUixDQUpQOztBQURrQixNQVFaTSxjQVJZO0FBQUE7O0FBU2hCLDhCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJOLEtBQTdDO0FBQ0FLLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JOLElBQTNDOztBQUZ5QixrSUFHbkJJLFFBSG1COztBQUt6QixZQUFLRyxXQUFMLEdBQW1CLENBQW5CO0FBTHlCO0FBTTFCOztBQWZlO0FBQUE7QUFBQSxpQ0FpQkxDLE9BakJLLEVBaUJJQyxLQWpCSixFQWlCV0MsS0FqQlgsRUFpQmtCO0FBQ2hDLFlBQUlGLFFBQVFHLGFBQVosRUFBMkIsS0FBS0MsTUFBTCxDQUFZQyxnQkFBWixDQUE2QkwsUUFBUUcsYUFBckM7QUFDM0IsYUFBS0MsTUFBTCxDQUFZRSxZQUFaLENBQXlCTixRQUFRTyxNQUFqQyxFQUF5Q04sS0FBekMsRUFBZ0RDLEtBQWhEO0FBQ0Q7QUFwQmU7QUFBQTtBQUFBLDZCQXNCVE0sTUF0QlMsRUFzQkRDLElBdEJDLEVBc0JLO0FBQ25CLGFBQUtDLElBQUwsR0FBWUMsTUFBWixDQUFtQjtBQUNqQkgsa0JBQVFBLE1BRFM7QUFFakJDLGdCQUFNQSxJQUZXO0FBR2pCUixpQkFBTyxLQUFLRztBQUhLLFNBQW5CO0FBS0Q7QUE1QmU7O0FBQUE7QUFBQSxJQVFXZCxTQVJYOztBQStCbEJLLGlCQUFlaUIsTUFBZixHQUF3QjtBQUFBLFFBQUNDLElBQUQsdUVBQVEsRUFBUjtBQUFBLFdBQWUsSUFBSWxCLGNBQUosQ0FBbUIsRUFBRW1CLFdBQVdELElBQWIsRUFBbkIsQ0FBZjtBQUFBLEdBQXhCOztBQUVBLFNBQU9sQixjQUFQO0FBQ0QsQ0FsQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L2V1Z2xlbmFkaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKVxuICA7XG5cbiAgY2xhc3MgRXVnbGVuYURpc3BsYXkgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG5cbiAgICAgIHRoaXMuX2xhc3RSZW5kZXIgPSAwO1xuICAgIH1cblxuICAgIGhhbmRsZURhdGEocmVzdWx0cywgbW9kZWwsIGNvbG9yKSB7XG4gICAgICBpZiAocmVzdWx0cy5tYWduaWZpY2F0aW9uKSB0aGlzLl9tb2RlbC5zZXRNYWduaWZpY2F0aW9uKHJlc3VsdHMubWFnbmlmaWNhdGlvbik7XG4gICAgICB0aGlzLl9tb2RlbC5zZXRUcmFja0RhdGEocmVzdWx0cy50cmFja3MsIG1vZGVsLCBjb2xvcik7XG4gICAgfVxuXG4gICAgcmVuZGVyKGxpZ2h0cywgdGltZSkge1xuICAgICAgdGhpcy52aWV3KCkucmVuZGVyKHtcbiAgICAgICAgbGlnaHRzOiBsaWdodHMsXG4gICAgICAgIHRpbWU6IHRpbWUsXG4gICAgICAgIG1vZGVsOiB0aGlzLl9tb2RlbFxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBFdWdsZW5hRGlzcGxheS5jcmVhdGUgPSAoZGF0YSA9IHt9KSA9PiBuZXcgRXVnbGVuYURpc3BsYXkoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG5cbiAgcmV0dXJuIEV1Z2xlbmFEaXNwbGF5O1xufSkiXX0=
