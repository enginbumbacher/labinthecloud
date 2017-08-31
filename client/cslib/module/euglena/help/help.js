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
      }
    }]);

    return HelpComponent;
  }(Controller);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvaGVscC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29udHJvbGxlciIsIk1vZGVsIiwiVmlldyIsIkdsb2JhbHMiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU2hvd1JlcXVlc3QiLCJiaW5kIiwiX29uSGlkZVJlcXVlc3QiLCJ2aWV3IiwiX29uVG9nZ2xlUmVxdWVzdCIsImV2dCIsIl9tb2RlbCIsInNob3ciLCJoaWRlIiwidG9nZ2xlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGFBQWFELFFBQVEsNEJBQVIsQ0FBbkI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksVUFBVUosUUFBUSxvQkFBUixDQUhaOztBQU1BO0FBQUE7O0FBQ0UsNkJBQTJCO0FBQUEsVUFBZkssUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QkosS0FBN0M7QUFDQUcsZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQkosSUFBM0M7O0FBRnlCLGdJQUduQkUsUUFIbUI7O0FBS3pCRCxjQUFRSSxHQUFSLENBQVksT0FBWixFQUFxQkMsZ0JBQXJCLENBQXNDLFdBQXRDLEVBQW1ELE1BQUtDLGNBQUwsQ0FBb0JDLElBQXBCLE9BQW5EO0FBQ0FQLGNBQVFJLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxnQkFBckIsQ0FBc0MsV0FBdEMsRUFBbUQsTUFBS0csY0FBTCxDQUFvQkQsSUFBcEIsT0FBbkQ7QUFDQSxZQUFLRSxJQUFMLEdBQVlKLGdCQUFaLENBQTZCLGlCQUE3QixFQUFnRCxNQUFLSyxnQkFBTCxDQUFzQkgsSUFBdEIsT0FBaEQ7QUFQeUI7QUFRMUI7O0FBVEg7QUFBQTtBQUFBLHFDQVdpQkksR0FYakIsRUFXc0I7QUFDbEIsYUFBS0MsTUFBTCxDQUFZQyxJQUFaO0FBQ0Q7QUFiSDtBQUFBO0FBQUEscUNBY2lCRixHQWRqQixFQWNzQjtBQUNsQixhQUFLQyxNQUFMLENBQVlFLElBQVo7QUFDRDtBQWhCSDtBQUFBO0FBQUEsdUNBaUJtQkgsR0FqQm5CLEVBaUJ3QjtBQUNwQixhQUFLQyxNQUFMLENBQVlHLE1BQVo7QUFDRDtBQW5CSDs7QUFBQTtBQUFBLElBQW1DbEIsVUFBbkM7QUFxQkQsQ0E1QkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvaGVscC9oZWxwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlKCdjb3JlL2NvbnRyb2xsZXIvY29udHJvbGxlcicpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJylcbiAgICA7XG5cbiAgcmV0dXJuIGNsYXNzIEhlbHBDb21wb25lbnQgZXh0ZW5kcyBDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdIZWxwLlNob3cnLCB0aGlzLl9vblNob3dSZXF1ZXN0LmJpbmQodGhpcykpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignSGVscC5IaWRlJywgdGhpcy5fb25IaWRlUmVxdWVzdC5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0hlbHAuVG9nZ2xlT3BlbicsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBfb25TaG93UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNob3coKTtcbiAgICB9XG4gICAgX29uSGlkZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9tb2RlbC5oaWRlKCk7XG4gICAgfVxuICAgIF9vblRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICB9XG4gIH1cbn0pOyJdfQ==
