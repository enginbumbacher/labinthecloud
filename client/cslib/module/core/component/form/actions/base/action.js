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

      return _possibleConstructorReturn(this, Object.getPrototypeOf(FormAction).call(this));
    }

    _createClass(FormAction, [{
      key: 'getButton',
      value: function getButton() {}
    }]);

    return FormAction;
  }(Action);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2FjdGlvbnMvYmFzZS9hY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxTQUFTLFFBQVEsdUJBQVIsQ0FBZjs7QUFFQTtBQUFBOztBQUNFLDBCQUFjO0FBQUE7O0FBQUE7QUFFYjs7QUFISDtBQUFBO0FBQUEsa0NBS2MsQ0FBRTtBQUxoQjs7QUFBQTtBQUFBLElBQWdDLE1BQWhDO0FBT0QsQ0FWRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS9hY3Rpb25zL2Jhc2UvYWN0aW9uLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
