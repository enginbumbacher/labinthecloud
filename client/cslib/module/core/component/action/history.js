'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher');

  return function (_EventDispatcher) {
    _inherits(ActionHistory, _EventDispatcher);

    function ActionHistory() {
      _classCallCheck(this, ActionHistory);

      var _this = _possibleConstructorReturn(this, (ActionHistory.__proto__ || Object.getPrototypeOf(ActionHistory)).call(this));

      _this._history = [];
      return _this;
    }

    _createClass(ActionHistory, [{
      key: 'execute',
      value: function execute(action) {
        var _this2 = this;

        action.execute().then(function () {
          _this2._history.push(action);
          _this2.dispatchEvent('ActionHistory.ActionAdded', { action: action });
        });
      }
    }, {
      key: 'undo',
      value: function undo() {
        var _this3 = this;

        var action = this._history.pop();
        action.undo().then(function () {
          _this3.dispatchEvent('ActionHistory.ActionUndone', { action: action });
        });
      }
    }]);

    return ActionHistory;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9hY3Rpb24vaGlzdG9yeS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRXZlbnREaXNwYXRjaGVyIiwiX2hpc3RvcnkiLCJhY3Rpb24iLCJleGVjdXRlIiwidGhlbiIsInB1c2giLCJkaXNwYXRjaEV2ZW50IiwicG9wIiwidW5kbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxrQkFBa0JELFFBQVEsdUJBQVIsQ0FBeEI7O0FBRUE7QUFBQTs7QUFDRSw2QkFBYztBQUFBOztBQUFBOztBQUVaLFlBQUtFLFFBQUwsR0FBZ0IsRUFBaEI7QUFGWTtBQUdiOztBQUpIO0FBQUE7QUFBQSw4QkFNVUMsTUFOVixFQU1rQjtBQUFBOztBQUNkQSxlQUFPQyxPQUFQLEdBQ0dDLElBREgsQ0FDUSxZQUFNO0FBQ1YsaUJBQUtILFFBQUwsQ0FBY0ksSUFBZCxDQUFtQkgsTUFBbkI7QUFDQSxpQkFBS0ksYUFBTCxDQUFtQiwyQkFBbkIsRUFBZ0QsRUFBRUosUUFBUUEsTUFBVixFQUFoRDtBQUNELFNBSkg7QUFLRDtBQVpIO0FBQUE7QUFBQSw2QkFjUztBQUFBOztBQUNMLFlBQU1BLFNBQVMsS0FBS0QsUUFBTCxDQUFjTSxHQUFkLEVBQWY7QUFDQUwsZUFBT00sSUFBUCxHQUNHSixJQURILENBQ1EsWUFBTTtBQUNWLGlCQUFLRSxhQUFMLENBQW1CLDRCQUFuQixFQUFpRCxFQUFFSixRQUFRQSxNQUFWLEVBQWpEO0FBQ0QsU0FISDtBQUlEO0FBcEJIOztBQUFBO0FBQUEsSUFBbUNGLGVBQW5DO0FBc0JELENBekJEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9hY3Rpb24vaGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBFdmVudERpc3BhdGNoZXIgPSByZXF1aXJlKCdjb3JlL2V2ZW50L2Rpc3BhdGNoZXInKTtcblxuICByZXR1cm4gY2xhc3MgQWN0aW9uSGlzdG9yeSBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5faGlzdG9yeSA9IFtdO1xuICAgIH1cblxuICAgIGV4ZWN1dGUoYWN0aW9uKSB7XG4gICAgICBhY3Rpb24uZXhlY3V0ZSgpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnB1c2goYWN0aW9uKTtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0FjdGlvbkhpc3RvcnkuQWN0aW9uQWRkZWQnLCB7IGFjdGlvbjogYWN0aW9uIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1bmRvKCkge1xuICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5faGlzdG9yeS5wb3AoKTtcbiAgICAgIGFjdGlvbi51bmRvKClcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQWN0aW9uSGlzdG9yeS5BY3Rpb25VbmRvbmUnLCB7IGFjdGlvbjogYWN0aW9uIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH07XG59KTsiXX0=
