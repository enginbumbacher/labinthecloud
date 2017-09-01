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
        if (!Globals.get('student_id')) return Promise.resolve(true); // let it go, but don't save the log

        return Utils.promiseAjax('/api/v1/Logs', {
          method: 'POST',
          data: JSON.stringify({
            type: conf.type,
            category: conf.category,
            data: conf.data,
            studentId: Globals.get('student_id'),
            lab: Globals.get('AppConfig.lab')
          }),
          contentType: 'application/json'
        });
      }
    }]);

    return Logger;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2dpbmcvbG9nZ2VyLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJITSIsIlV0aWxzIiwiR2xvYmFscyIsIkV2ZW50RGlzcGF0Y2hlciIsImNvbmYiLCJ0eXBlIiwiUHJvbWlzZSIsInJlamVjdCIsImdldCIsInJlc29sdmUiLCJwcm9taXNlQWpheCIsIm1ldGhvZCIsImRhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiY2F0ZWdvcnkiLCJzdHVkZW50SWQiLCJsYWIiLCJjb250ZW50VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxRQUFRLHlCQUFSLENBQVg7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7O0FBSUEsTUFBTUksa0JBQWtCSixRQUFRLHVCQUFSLENBQXhCOztBQUVBO0FBQUE7O0FBQ0Usc0JBQWM7QUFBQTs7QUFBQTtBQUViOztBQUhIO0FBQUE7QUFBQSwwQkFLTUssSUFMTixFQUtZO0FBQ1IsWUFBSSxDQUFDQSxLQUFLQyxJQUFWLEVBQWdCLE9BQU9DLFFBQVFDLE1BQVIsQ0FBZSw4QkFBZixDQUFQO0FBQ2hCLFlBQUksQ0FBQ0wsUUFBUU0sR0FBUixDQUFZLFlBQVosQ0FBTCxFQUFnQyxPQUFPRixRQUFRRyxPQUFSLENBQWdCLElBQWhCLENBQVAsQ0FGeEIsQ0FFcUQ7O0FBRTdELGVBQU9SLE1BQU1TLFdBQU4sQ0FBa0IsY0FBbEIsRUFBa0M7QUFDdkNDLGtCQUFRLE1BRCtCO0FBRXZDQyxnQkFBTUMsS0FBS0MsU0FBTCxDQUFlO0FBQ25CVCxrQkFBTUQsS0FBS0MsSUFEUTtBQUVuQlUsc0JBQVVYLEtBQUtXLFFBRkk7QUFHbkJILGtCQUFNUixLQUFLUSxJQUhRO0FBSW5CSSx1QkFBV2QsUUFBUU0sR0FBUixDQUFZLFlBQVosQ0FKUTtBQUtuQlMsaUJBQUtmLFFBQVFNLEdBQVIsQ0FBWSxlQUFaO0FBTGMsV0FBZixDQUZpQztBQVN2Q1UsdUJBQWE7QUFUMEIsU0FBbEMsQ0FBUDtBQVdEO0FBcEJIOztBQUFBO0FBQUEsSUFBNEJmLGVBQTVCO0FBc0JELENBN0JEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2xvZ2dpbmcvbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcblxuICBjb25zdCBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdjb3JlL2V2ZW50L2Rpc3BhdGNoZXInKTtcblxuICByZXR1cm4gY2xhc3MgTG9nZ2VyIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgbG9nKGNvbmYpIHtcbiAgICAgIGlmICghY29uZi50eXBlKSByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJMb2dzIHJlcXVpcmUgYSB0eXBlIHByb3BlcnR5XCIpO1xuICAgICAgaWYgKCFHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpIC8vIGxldCBpdCBnbywgYnV0IGRvbid0IHNhdmUgdGhlIGxvZ1xuXG4gICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvTG9ncycsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICB0eXBlOiBjb25mLnR5cGUsXG4gICAgICAgICAgY2F0ZWdvcnk6IGNvbmYuY2F0ZWdvcnksXG4gICAgICAgICAgZGF0YTogY29uZi5kYXRhLFxuICAgICAgICAgIHN0dWRlbnRJZDogR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKSxcbiAgICAgICAgICBsYWI6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJylcbiAgICAgICAgfSksXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KSJdfQ==
