'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Controller = require('core/controller/controller'),
      Model = require('./model'),
      View = require('./view'),
      Globals = require('core/model/globals');

  return function (_Controller) {
    _inherits(HelpComponent, _Controller);

    function HelpComponent() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, HelpComponent);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (HelpComponent.__proto__ || Object.getPrototypeOf(HelpComponent)).call(this, settings));

      Globals.get('Relay').addEventListener('Help.Show', _this._onShowRequest.bind(_this));
      Globals.get('Relay').addEventListener('Help.Hide', _this._onHideRequest.bind(_this));
      _this.view().addEventListener('Help.ToggleOpen', _this._onToggleRequest.bind(_this));
      return _this;
    }

    _createClass(HelpComponent, [{
      key: '_onShowRequest',
      value: function _onShowRequest(evt) {
        this._model.show();
      }
    }, {
      key: '_onHideRequest',
      value: function _onHideRequest(evt) {
        this._model.hide();
      }
    }, {
      key: '_onToggleRequest',
      value: function _onToggleRequest(evt) {
        this._model.toggle();
        this._view.toggle(this._model.get('open'));
      }
    }]);

    return HelpComponent;
  }(Controller);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvaGVscC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29udHJvbGxlciIsIk1vZGVsIiwiVmlldyIsIkdsb2JhbHMiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU2hvd1JlcXVlc3QiLCJiaW5kIiwiX29uSGlkZVJlcXVlc3QiLCJ2aWV3IiwiX29uVG9nZ2xlUmVxdWVzdCIsImV2dCIsIl9tb2RlbCIsInNob3ciLCJoaWRlIiwidG9nZ2xlIiwiX3ZpZXciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsYUFBYUQsUUFBUSw0QkFBUixDQUFuQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxVQUFVSixRQUFRLG9CQUFSLENBSFo7O0FBTUE7QUFBQTs7QUFDRSw2QkFBMkI7QUFBQSxVQUFmSyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSixLQUE3QztBQUNBRyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCSixJQUEzQzs7QUFGeUIsZ0lBR25CRSxRQUhtQjs7QUFLekJELGNBQVFJLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxnQkFBckIsQ0FBc0MsV0FBdEMsRUFBbUQsTUFBS0MsY0FBTCxDQUFvQkMsSUFBcEIsT0FBbkQ7QUFDQVAsY0FBUUksR0FBUixDQUFZLE9BQVosRUFBcUJDLGdCQUFyQixDQUFzQyxXQUF0QyxFQUFtRCxNQUFLRyxjQUFMLENBQW9CRCxJQUFwQixPQUFuRDtBQUNBLFlBQUtFLElBQUwsR0FBWUosZ0JBQVosQ0FBNkIsaUJBQTdCLEVBQWdELE1BQUtLLGdCQUFMLENBQXNCSCxJQUF0QixPQUFoRDtBQVB5QjtBQVExQjs7QUFUSDtBQUFBO0FBQUEscUNBV2lCSSxHQVhqQixFQVdzQjtBQUNsQixhQUFLQyxNQUFMLENBQVlDLElBQVo7QUFDRDtBQWJIO0FBQUE7QUFBQSxxQ0FjaUJGLEdBZGpCLEVBY3NCO0FBQ2xCLGFBQUtDLE1BQUwsQ0FBWUUsSUFBWjtBQUNEO0FBaEJIO0FBQUE7QUFBQSx1Q0FpQm1CSCxHQWpCbkIsRUFpQndCO0FBQ3BCLGFBQUtDLE1BQUwsQ0FBWUcsTUFBWjtBQUNBLGFBQUtDLEtBQUwsQ0FBV0QsTUFBWCxDQUFrQixLQUFLSCxNQUFMLENBQVlSLEdBQVosQ0FBZ0IsTUFBaEIsQ0FBbEI7QUFDRDtBQXBCSDs7QUFBQTtBQUFBLElBQW1DUCxVQUFuQztBQXNCRCxDQTdCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9oZWxwL2hlbHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29udHJvbGxlciA9IHJlcXVpcmUoJ2NvcmUvY29udHJvbGxlci9jb250cm9sbGVyJyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKVxuICAgIDtcblxuICByZXR1cm4gY2xhc3MgSGVscENvbXBvbmVudCBleHRlbmRzIENvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0hlbHAuU2hvdycsIHRoaXMuX29uU2hvd1JlcXVlc3QuYmluZCh0aGlzKSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdIZWxwLkhpZGUnLCB0aGlzLl9vbkhpZGVSZXF1ZXN0LmJpbmQodGhpcykpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignSGVscC5Ub2dnbGVPcGVuJywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9vblNob3dSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2hvdygpO1xuICAgIH1cbiAgICBfb25IaWRlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX21vZGVsLmhpZGUoKTtcbiAgICB9XG4gICAgX29uVG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuICAgICAgdGhpcy5fdmlldy50b2dnbGUodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpXG4gICAgfVxuICB9XG59KTtcbiJdfQ==
