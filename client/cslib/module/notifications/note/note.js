'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils');

  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view');

  var NotificationNote = function (_Component) {
    _inherits(NotificationNote, _Component);

    function NotificationNote(settings) {
      _classCallCheck(this, NotificationNote);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (NotificationNote.__proto__ || Object.getPrototypeOf(NotificationNote)).call(this, settings));

      Utils.bindMethods(_this, ['_onExpirationRequest', '_onExpired']);

      _this.view().addEventListener('Note.ExpirationRequest', _this._onExpirationRequest);
      _this.view().addEventListener('Note.Expired', _this._onExpired);
      return _this;
    }

    _createClass(NotificationNote, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'live',
      value: function live() {
        this._model.set('alive', true);
      }
    }, {
      key: 'expire',
      value: function expire() {
        this.view().expire();
      }
    }, {
      key: '_onExpirationRequest',
      value: function _onExpirationRequest(evt) {
        this._model.set('alive', false);
      }
    }, {
      key: '_onExpired',
      value: function _onExpired(evt) {
        this.dispatchEvent(evt);
      }
    }]);

    return NotificationNote;
  }(Component);

  NotificationNote.create = function (data) {
    return new NotificationNote({ modelData: data });
  };

  return NotificationNote;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ub3RpZmljYXRpb25zL25vdGUvbm90ZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkhNIiwiVXRpbHMiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJOb3RpZmljYXRpb25Ob3RlIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkV4cGlyYXRpb25SZXF1ZXN0IiwiX29uRXhwaXJlZCIsIl9tb2RlbCIsImdldCIsInNldCIsImV4cGlyZSIsImV2dCIsImRpc3BhdGNoRXZlbnQiLCJjcmVhdGUiLCJkYXRhIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxLQUFLRixRQUFRLHlCQUFSLENBRFA7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7O0FBSUEsTUFBTUksWUFBWUosUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VLLFFBQVFMLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU0sT0FBT04sUUFBUSxRQUFSLENBRlQ7O0FBTGtCLE1BU1pPLGdCQVRZO0FBQUE7O0FBVWhCLDhCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSixLQUE3QztBQUNBRyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCSixJQUEzQzs7QUFGb0Isc0lBR2RFLFFBSGM7O0FBSXBCTCxZQUFNUSxXQUFOLFFBQXdCLENBQUMsc0JBQUQsRUFBeUIsWUFBekIsQ0FBeEI7O0FBRUEsWUFBS0MsSUFBTCxHQUFZQyxnQkFBWixDQUE2Qix3QkFBN0IsRUFBdUQsTUFBS0Msb0JBQTVEO0FBQ0EsWUFBS0YsSUFBTCxHQUFZQyxnQkFBWixDQUE2QixjQUE3QixFQUE2QyxNQUFLRSxVQUFsRDtBQVBvQjtBQVFyQjs7QUFsQmU7QUFBQTtBQUFBLDJCQW9CWDtBQUNILGVBQU8sS0FBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQXRCZTtBQUFBO0FBQUEsNkJBd0JUO0FBQ0wsYUFBS0QsTUFBTCxDQUFZRSxHQUFaLENBQWdCLE9BQWhCLEVBQXlCLElBQXpCO0FBQ0Q7QUExQmU7QUFBQTtBQUFBLCtCQTRCUDtBQUNQLGFBQUtOLElBQUwsR0FBWU8sTUFBWjtBQUNEO0FBOUJlO0FBQUE7QUFBQSwyQ0FnQ0tDLEdBaENMLEVBZ0NVO0FBQ3hCLGFBQUtKLE1BQUwsQ0FBWUUsR0FBWixDQUFnQixPQUFoQixFQUF5QixLQUF6QjtBQUNEO0FBbENlO0FBQUE7QUFBQSxpQ0FvQ0xFLEdBcENLLEVBb0NBO0FBQ2QsYUFBS0MsYUFBTCxDQUFtQkQsR0FBbkI7QUFDRDtBQXRDZTs7QUFBQTtBQUFBLElBU2FoQixTQVRiOztBQXlDbEJHLG1CQUFpQmUsTUFBakIsR0FBMEIsVUFBQ0MsSUFBRCxFQUFVO0FBQ2xDLFdBQU8sSUFBSWhCLGdCQUFKLENBQXFCLEVBQUVpQixXQUFXRCxJQUFiLEVBQXJCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9oQixnQkFBUDtBQUNELENBOUNEIiwiZmlsZSI6Im1vZHVsZS9ub3RpZmljYXRpb25zL25vdGUvbm90ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuICBcbiAgY2xhc3MgTm90aWZpY2F0aW9uTm90ZSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkV4cGlyYXRpb25SZXF1ZXN0JywgJ19vbkV4cGlyZWQnXSk7XG5cbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGUuRXhwaXJhdGlvblJlcXVlc3QnLCB0aGlzLl9vbkV4cGlyYXRpb25SZXF1ZXN0KTtcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGUuRXhwaXJlZCcsIHRoaXMuX29uRXhwaXJlZCk7XG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIGxpdmUoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ2FsaXZlJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZXhwaXJlKCkge1xuICAgICAgdGhpcy52aWV3KCkuZXhwaXJlKCk7XG4gICAgfVxuXG4gICAgX29uRXhwaXJhdGlvblJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ2FsaXZlJywgZmFsc2UpO1xuICAgIH1cblxuICAgIF9vbkV4cGlyZWQoZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICB9XG4gIH1cblxuICBOb3RpZmljYXRpb25Ob3RlLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb25Ob3RlKHsgbW9kZWxEYXRhOiBkYXRhIH0pXG4gIH1cblxuICByZXR1cm4gTm90aWZpY2F0aW9uTm90ZTtcbn0pIl19
