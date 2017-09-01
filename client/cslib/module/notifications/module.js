'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils');

  var Module = require('core/app/module'),
      NotificationCenter = require('./center/notificationcenter'),
      Note = require('./note/note');

  require('link!./style.css');

  return function (_Module) {
    _inherits(NotificationsModule, _Module);

    function NotificationsModule() {
      _classCallCheck(this, NotificationsModule);

      var _this = _possibleConstructorReturn(this, (NotificationsModule.__proto__ || Object.getPrototypeOf(NotificationsModule)).call(this));

      Utils.bindMethods(_this, ['_onAddRequest', '_onRemoveRequest', '_onClearRequest']);
      _this._center = NotificationCenter.create({});
      return _this;
    }

    _createClass(NotificationsModule, [{
      key: 'init',
      value: function init() {
        Globals.get('Relay').addEventListener('Notifications.Add', this._onAddRequest);
        Globals.get('Relay').addEventListener('Notifications.Remove', this._onRemoveRequest);
        Globals.get('Relay').addEventListener('Notifications.Clear', this._onClearRequest);
      }
    }, {
      key: 'run',
      value: function run() {
        Globals.get('App.view').addChild(this._center.view());
      }
    }, {
      key: '_onAddRequest',
      value: function _onAddRequest(evt) {
        this._center.addNote(Note.create(evt.data));
      }
    }, {
      key: '_onRemoveRequest',
      value: function _onRemoveRequest(evt) {
        this._center.removeNote(evt.data.noteId);
      }
    }, {
      key: '_onClearRequest',
      value: function _onClearRequest(evt) {
        this._center.clear();
      }
    }]);

    return NotificationsModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ub3RpZmljYXRpb25zL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkhNIiwiVXRpbHMiLCJNb2R1bGUiLCJOb3RpZmljYXRpb25DZW50ZXIiLCJOb3RlIiwiYmluZE1ldGhvZHMiLCJfY2VudGVyIiwiY3JlYXRlIiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkFkZFJlcXVlc3QiLCJfb25SZW1vdmVSZXF1ZXN0IiwiX29uQ2xlYXJSZXF1ZXN0IiwiYWRkQ2hpbGQiLCJ2aWV3IiwiZXZ0IiwiYWRkTm90ZSIsImRhdGEiLCJyZW1vdmVOb3RlIiwibm90ZUlkIiwiY2xlYXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLEtBQUtGLFFBQVEseUJBQVIsQ0FEUDtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxxQkFBcUJMLFFBQVEsNkJBQVIsQ0FEdkI7QUFBQSxNQUVFTSxPQUFPTixRQUFRLGFBQVIsQ0FGVDs7QUFJQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLG1DQUFjO0FBQUE7O0FBQUE7O0FBRVpHLFlBQU1JLFdBQU4sUUFBd0IsQ0FBQyxlQUFELEVBQWtCLGtCQUFsQixFQUFzQyxpQkFBdEMsQ0FBeEI7QUFDQSxZQUFLQyxPQUFMLEdBQWVILG1CQUFtQkksTUFBbkIsQ0FBMEIsRUFBMUIsQ0FBZjtBQUhZO0FBSWI7O0FBTEg7QUFBQTtBQUFBLDZCQU9TO0FBQ0xSLGdCQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQkMsZ0JBQXJCLENBQXNDLG1CQUF0QyxFQUEyRCxLQUFLQyxhQUFoRTtBQUNBWCxnQkFBUVMsR0FBUixDQUFZLE9BQVosRUFBcUJDLGdCQUFyQixDQUFzQyxzQkFBdEMsRUFBOEQsS0FBS0UsZ0JBQW5FO0FBQ0FaLGdCQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQkMsZ0JBQXJCLENBQXNDLHFCQUF0QyxFQUE2RCxLQUFLRyxlQUFsRTtBQUNEO0FBWEg7QUFBQTtBQUFBLDRCQWFRO0FBQ0piLGdCQUFRUyxHQUFSLENBQVksVUFBWixFQUF3QkssUUFBeEIsQ0FBaUMsS0FBS1AsT0FBTCxDQUFhUSxJQUFiLEVBQWpDO0FBQ0Q7QUFmSDtBQUFBO0FBQUEsb0NBaUJnQkMsR0FqQmhCLEVBaUJxQjtBQUNqQixhQUFLVCxPQUFMLENBQWFVLE9BQWIsQ0FBcUJaLEtBQUtHLE1BQUwsQ0FBWVEsSUFBSUUsSUFBaEIsQ0FBckI7QUFDRDtBQW5CSDtBQUFBO0FBQUEsdUNBcUJtQkYsR0FyQm5CLEVBcUJ3QjtBQUNwQixhQUFLVCxPQUFMLENBQWFZLFVBQWIsQ0FBd0JILElBQUlFLElBQUosQ0FBU0UsTUFBakM7QUFDRDtBQXZCSDtBQUFBO0FBQUEsc0NBeUJrQkosR0F6QmxCLEVBeUJ1QjtBQUNuQixhQUFLVCxPQUFMLENBQWFjLEtBQWI7QUFDRDtBQTNCSDs7QUFBQTtBQUFBLElBQXlDbEIsTUFBekM7QUE2QkQsQ0F4Q0QiLCJmaWxlIjoibW9kdWxlL25vdGlmaWNhdGlvbnMvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBOb3RpZmljYXRpb25DZW50ZXIgPSByZXF1aXJlKCcuL2NlbnRlci9ub3RpZmljYXRpb25jZW50ZXInKSxcbiAgICBOb3RlID0gcmVxdWlyZSgnLi9ub3RlL25vdGUnKTtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIE5vdGlmaWNhdGlvbnNNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKVxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25BZGRSZXF1ZXN0JywgJ19vblJlbW92ZVJlcXVlc3QnLCAnX29uQ2xlYXJSZXF1ZXN0J10pXG4gICAgICB0aGlzLl9jZW50ZXIgPSBOb3RpZmljYXRpb25DZW50ZXIuY3JlYXRlKHt9KTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5BZGQnLCB0aGlzLl9vbkFkZFJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLCB0aGlzLl9vblJlbW92ZVJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5DbGVhcicsIHRoaXMuX29uQ2xlYXJSZXF1ZXN0KTtcbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICBHbG9iYWxzLmdldCgnQXBwLnZpZXcnKS5hZGRDaGlsZCh0aGlzLl9jZW50ZXIudmlldygpKTtcbiAgICB9XG5cbiAgICBfb25BZGRSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fY2VudGVyLmFkZE5vdGUoTm90ZS5jcmVhdGUoZXZ0LmRhdGEpKTtcbiAgICB9XG5cbiAgICBfb25SZW1vdmVSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fY2VudGVyLnJlbW92ZU5vdGUoZXZ0LmRhdGEubm90ZUlkKTtcbiAgICB9XG5cbiAgICBfb25DbGVhclJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9jZW50ZXIuY2xlYXIoKTtcbiAgICB9XG4gIH07XG59KSJdfQ==
