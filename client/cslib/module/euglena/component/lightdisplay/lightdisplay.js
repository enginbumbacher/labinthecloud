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
      EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay');

  var LightDisplay = function (_Component) {
    _inherits(LightDisplay, _Component);

    function LightDisplay() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, LightDisplay);

      config.viewClass = config.viewClass || View;
      config.modelClass = config.modelClass || Model;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(LightDisplay).call(this, config));
    }

    // handleVideo(data) {
    //   this._model.set('runTime', data.runTime);
    //   this._model.set('fps', data.fps);
    //   this._model.set('video', data.video);
    // }

    _createClass(LightDisplay, [{
      key: 'render',
      value: function render(lights) {
        this.view().render(lights);
      }
    }]);

    return LightDisplay;
  }(Component);

  LightDisplay.create = function (data) {
    return new LightDisplay({ modelData: data });
  };

  return LightDisplay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sWUFBWSxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRSxRQUFRLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRSxPQUFPLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRSxRQUFRLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BSUUsaUJBQWlCLFFBQVEsaURBQVIsQ0FKbkI7O0FBRGtCLE1BUVosWUFSWTtBQUFBOztBQVNoQiw0QkFBeUI7QUFBQSxVQUFiLE1BQWEseURBQUosRUFBSTs7QUFBQTs7QUFDdkIsYUFBTyxTQUFQLEdBQW1CLE9BQU8sU0FBUCxJQUFvQixJQUF2QztBQUNBLGFBQU8sVUFBUCxHQUFvQixPQUFPLFVBQVAsSUFBcUIsS0FBekM7QUFGdUIsNkZBR2pCLE1BSGlCO0FBSXhCOzs7Ozs7OztBQWJlO0FBQUE7QUFBQSw2QkFxQlQsTUFyQlMsRUFxQkQ7QUFDYixhQUFLLElBQUwsR0FBWSxNQUFaLENBQW1CLE1BQW5CO0FBQ0Q7QUF2QmU7O0FBQUE7QUFBQSxJQVFTLFNBUlQ7O0FBMEJsQixlQUFhLE1BQWIsR0FBc0IsVUFBQyxJQUFEO0FBQUEsV0FBVSxJQUFJLFlBQUosQ0FBaUIsRUFBRSxXQUFXLElBQWIsRUFBakIsQ0FBVjtBQUFBLEdBQXRCOztBQUVBLFNBQU8sWUFBUDtBQUNELENBN0JEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
