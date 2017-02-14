'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FormView = require('module/form/view'),
      Template = require('text!./login.html');

  return function (_FormView) {
    _inherits(LoginFormView, _FormView);

    function LoginFormView(model, tmpl) {
      _classCallCheck(this, LoginFormView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LoginFormView).call(this, model, tmpl || Template));

      _this._onKeyUp = _this._onKeyUp.bind(_this);

      _this.$dom().on('keyup keypress', _this._onKeyUp);
      return _this;
    }

    _createClass(LoginFormView, [{
      key: '_onKeyUp',
      value: function _onKeyUp(jqevt) {
        var keyCode = jqevt.keyCode || jqevt.which;
        if (keyCode === 13) {
          this.dispatchEvent('Login.Submit', {});
          jqevt.preventDefault();
          return false;
        }
      }
    }]);

    return LoginFormView;
  }(FormView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL2Zvcm0vdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFdBQVcsUUFBUSxrQkFBUixDQUFqQjtBQUFBLE1BQ0UsV0FBVyxRQUFRLG1CQUFSLENBRGI7O0FBR0E7QUFBQTs7QUFDRSwyQkFBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsbUdBQ2pCLEtBRGlCLEVBQ1YsUUFBUSxRQURFOztBQUV2QixZQUFLLFFBQUwsR0FBZ0IsTUFBSyxRQUFMLENBQWMsSUFBZCxPQUFoQjs7QUFFQSxZQUFLLElBQUwsR0FBWSxFQUFaLENBQWUsZ0JBQWYsRUFBaUMsTUFBSyxRQUF0QztBQUp1QjtBQUt4Qjs7QUFOSDtBQUFBO0FBQUEsK0JBUVcsS0FSWCxFQVFrQjtBQUNkLFlBQUksVUFBVSxNQUFNLE9BQU4sSUFBaUIsTUFBTSxLQUFyQztBQUNBLFlBQUksWUFBWSxFQUFoQixFQUFvQjtBQUNsQixlQUFLLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUMsRUFBbkM7QUFDQSxnQkFBTSxjQUFOO0FBQ0EsaUJBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFmSDs7QUFBQTtBQUFBLElBQW1DLFFBQW5DO0FBaUJELENBckJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2xvZ2luL2Zvcm0vdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
