'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Action = require('modules/action/action');

  return function (_Action) {
    _inherits(FormAction, _Action);

    function FormAction() {
      _classCallCheck(this, FormAction);

      return _possibleConstructorReturn(this, (FormAction.__proto__ || Object.getPrototypeOf(FormAction)).call(this));
    }

    _createClass(FormAction, [{
      key: 'getButton',
      value: function getButton() {}
    }]);

    return FormAction;
  }(Action);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2FjdGlvbnMvYmFzZS9hY3Rpb24uanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkFjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxRQUFRLHVCQUFSLENBQWY7O0FBRUE7QUFBQTs7QUFDRSwwQkFBYztBQUFBOztBQUFBO0FBRWI7O0FBSEg7QUFBQTtBQUFBLGtDQUtjLENBQUU7QUFMaEI7O0FBQUE7QUFBQSxJQUFnQ0MsTUFBaEM7QUFPRCxDQVZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2FjdGlvbnMvYmFzZS9hY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQWN0aW9uID0gcmVxdWlyZSgnbW9kdWxlcy9hY3Rpb24vYWN0aW9uJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEZvcm1BY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBnZXRCdXR0b24oKSB7fVxuICB9O1xufSk7Il19
