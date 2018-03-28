'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals');

  var EventDispatcher = require('core/event/dispatcher');

  return function (_EventDispatcher) {
    _inherits(Logger, _EventDispatcher);

    function Logger() {
      _classCallCheck(this, Logger);

      return _possibleConstructorReturn(this, (Logger.__proto__ || Object.getPrototypeOf(Logger)).call(this));
    }

    _createClass(Logger, [{
      key: 'log',
      value: function log(conf) {
        if (!conf.type) return Promise.reject("Logs require a type property");
        if (!(conf.studentId || Globals.get('student_id'))) return Promise.resolve(true); // let it go, but don't save the log

        return Utils.promiseAjax('/api/v1/Logs', {
          method: 'POST',
          data: JSON.stringify({
            type: conf.type,
            category: conf.category,
            data: conf.data,
            studentId: conf.studentId ? conf.studentId : Globals.get('student_id'),
            lab: Globals.get('AppConfig.lab')
          }),
          contentType: 'application/json'
        });
      }
    }]);

    return Logger;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2dpbmcvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJITSIsIlV0aWxzIiwiR2xvYmFscyIsIkV2ZW50RGlzcGF0Y2hlciIsImNvbmYiLCJ0eXBlIiwiUHJvbWlzZSIsInJlamVjdCIsInN0dWRlbnRJZCIsImdldCIsInJlc29sdmUiLCJwcm9taXNlQWpheCIsIm1ldGhvZCIsImRhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiY2F0ZWdvcnkiLCJsYWIiLCJjb250ZW50VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxRQUFRLHlCQUFSLENBQVg7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7O0FBSUEsTUFBTUksa0JBQWtCSixRQUFRLHVCQUFSLENBQXhCOztBQUVBO0FBQUE7O0FBQ0Usc0JBQWM7QUFBQTs7QUFBQTtBQUViOztBQUhIO0FBQUE7QUFBQSwwQkFLTUssSUFMTixFQUtZO0FBQ1IsWUFBSSxDQUFDQSxLQUFLQyxJQUFWLEVBQWdCLE9BQU9DLFFBQVFDLE1BQVIsQ0FBZSw4QkFBZixDQUFQO0FBQ2hCLFlBQUksRUFBRUgsS0FBS0ksU0FBTCxJQUFrQk4sUUFBUU8sR0FBUixDQUFZLFlBQVosQ0FBcEIsQ0FBSixFQUFvRCxPQUFPSCxRQUFRSSxPQUFSLENBQWdCLElBQWhCLENBQVAsQ0FGNUMsQ0FFeUU7O0FBRWpGLGVBQU9ULE1BQU1VLFdBQU4sQ0FBa0IsY0FBbEIsRUFBa0M7QUFDdkNDLGtCQUFRLE1BRCtCO0FBRXZDQyxnQkFBTUMsS0FBS0MsU0FBTCxDQUFlO0FBQ25CVixrQkFBTUQsS0FBS0MsSUFEUTtBQUVuQlcsc0JBQVVaLEtBQUtZLFFBRkk7QUFHbkJILGtCQUFNVCxLQUFLUyxJQUhRO0FBSW5CTCx1QkFBV0osS0FBS0ksU0FBTCxHQUFpQkosS0FBS0ksU0FBdEIsR0FBa0NOLFFBQVFPLEdBQVIsQ0FBWSxZQUFaLENBSjFCO0FBS25CUSxpQkFBS2YsUUFBUU8sR0FBUixDQUFZLGVBQVo7QUFMYyxXQUFmLENBRmlDO0FBU3ZDUyx1QkFBYTtBQVQwQixTQUFsQyxDQUFQO0FBV0Q7QUFwQkg7O0FBQUE7QUFBQSxJQUE0QmYsZUFBNUI7QUFzQkQsQ0E3QkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbG9nZ2luZy9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIGNvbnN0IEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvZGlzcGF0Y2hlcicpO1xuXG4gIHJldHVybiBjbGFzcyBMb2dnZXIgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBsb2coY29uZikge1xuICAgICAgaWYgKCFjb25mLnR5cGUpIHJldHVybiBQcm9taXNlLnJlamVjdChcIkxvZ3MgcmVxdWlyZSBhIHR5cGUgcHJvcGVydHlcIik7XG4gICAgICBpZiAoIShjb25mLnN0dWRlbnRJZCB8fCBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpKSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKSAvLyBsZXQgaXQgZ28sIGJ1dCBkb24ndCBzYXZlIHRoZSBsb2dcblxuICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0xvZ3MnLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgdHlwZTogY29uZi50eXBlLFxuICAgICAgICAgIGNhdGVnb3J5OiBjb25mLmNhdGVnb3J5LFxuICAgICAgICAgIGRhdGE6IGNvbmYuZGF0YSxcbiAgICAgICAgICBzdHVkZW50SWQ6IGNvbmYuc3R1ZGVudElkID8gY29uZi5zdHVkZW50SWQgOiBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpLFxuICAgICAgICAgIGxhYjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKVxuICAgICAgICB9KSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSlcbiAgICB9XG4gIH1cbn0pXG4iXX0=
