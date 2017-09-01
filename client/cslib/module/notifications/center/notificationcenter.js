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

  var NotificationCenter = function (_Component) {
    _inherits(NotificationCenter, _Component);

    function NotificationCenter(settings) {
      _classCallCheck(this, NotificationCenter);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      return _possibleConstructorReturn(this, (NotificationCenter.__proto__ || Object.getPrototypeOf(NotificationCenter)).call(this, settings));
    }

    _createClass(NotificationCenter, [{
      key: 'addNote',
      value: function addNote(note) {
        this._model.addNote(note);
      }
    }, {
      key: 'removeNote',
      value: function removeNote(noteId) {
        this._model.removeNote(noteId);
      }
    }, {
      key: 'clear',
      value: function clear() {
        this._model.clear();
      }
    }]);

    return NotificationCenter;
  }(Component);

  NotificationCenter.create = function (data) {
    return new NotificationCenter({ modelData: data });
  };

  return NotificationCenter;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ub3RpZmljYXRpb25zL2NlbnRlci9ub3RpZmljYXRpb25jZW50ZXIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJITSIsIlV0aWxzIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTm90aWZpY2F0aW9uQ2VudGVyIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwibm90ZSIsIl9tb2RlbCIsImFkZE5vdGUiLCJub3RlSWQiLCJyZW1vdmVOb3RlIiwiY2xlYXIiLCJjcmVhdGUiLCJkYXRhIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxLQUFLRixRQUFRLHlCQUFSLENBRFA7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7O0FBSUEsTUFBTUksWUFBWUosUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VLLFFBQVFMLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU0sT0FBT04sUUFBUSxRQUFSLENBRlQ7O0FBTGtCLE1BU1pPLGtCQVRZO0FBQUE7O0FBVWhCLGdDQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSixLQUE3QztBQUNBRyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCSixJQUEzQztBQUZvQixxSUFHZEUsUUFIYztBQUlyQjs7QUFkZTtBQUFBO0FBQUEsOEJBZ0JSRyxJQWhCUSxFQWdCRjtBQUNaLGFBQUtDLE1BQUwsQ0FBWUMsT0FBWixDQUFvQkYsSUFBcEI7QUFDRDtBQWxCZTtBQUFBO0FBQUEsaUNBb0JMRyxNQXBCSyxFQW9CRztBQUNqQixhQUFLRixNQUFMLENBQVlHLFVBQVosQ0FBdUJELE1BQXZCO0FBQ0Q7QUF0QmU7QUFBQTtBQUFBLDhCQXdCUjtBQUNOLGFBQUtGLE1BQUwsQ0FBWUksS0FBWjtBQUNEO0FBMUJlOztBQUFBO0FBQUEsSUFTZVosU0FUZjs7QUE2QmxCRyxxQkFBbUJVLE1BQW5CLEdBQTRCLFVBQUNDLElBQUQsRUFBVTtBQUNwQyxXQUFPLElBQUlYLGtCQUFKLENBQXVCLEVBQUVZLFdBQVdELElBQWIsRUFBdkIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT1gsa0JBQVA7QUFDRCxDQWxDRCIsImZpbGUiOiJtb2R1bGUvbm90aWZpY2F0aW9ucy9jZW50ZXIvbm90aWZpY2F0aW9uY2VudGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKTtcblxuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XG4gIFxuICBjbGFzcyBOb3RpZmljYXRpb25DZW50ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGFkZE5vdGUobm90ZSkge1xuICAgICAgdGhpcy5fbW9kZWwuYWRkTm90ZShub3RlKTtcbiAgICB9XG5cbiAgICByZW1vdmVOb3RlKG5vdGVJZCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVtb3ZlTm90ZShub3RlSWQpO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgdGhpcy5fbW9kZWwuY2xlYXIoKTtcbiAgICB9XG4gIH1cblxuICBOb3RpZmljYXRpb25DZW50ZXIuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbkNlbnRlcih7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBOb3RpZmljYXRpb25DZW50ZXI7XG59KSJdfQ==
