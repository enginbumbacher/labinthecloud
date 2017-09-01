"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require) {
  return function () {
    function Action() {
      _classCallCheck(this, Action);
    }

    _createClass(Action, [{
      key: "execute",
      value: function execute() {
        return Promise.resolve(true);
      }
    }, {
      key: "undo",
      value: function undo() {
        return Promise.resolve(true);
      }
    }]);

    return Action;
  }();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9hY3Rpb24vYWN0aW9uLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJQcm9taXNlIiwicmVzb2x2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxnQ0FDWTtBQUNSLGVBQU9DLFFBQVFDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBSEg7QUFBQTtBQUFBLDZCQUtTO0FBQ0wsZUFBT0QsUUFBUUMsT0FBUixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFQSDs7QUFBQTtBQUFBO0FBU0QsQ0FWRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvYWN0aW9uL2FjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICByZXR1cm4gY2xhc3MgQWN0aW9uIHtcbiAgICBleGVjdXRlKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG5cbiAgICB1bmRvKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG4gIH07XG59KTsiXX0=
