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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9hY3Rpb24vYWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGdDQUNZO0FBQ1IsZUFBTyxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBSEg7QUFBQTtBQUFBLDZCQUtTO0FBQ0wsZUFBTyxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBUEg7O0FBQUE7QUFBQTtBQVNELENBVkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2FjdGlvbi9hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
