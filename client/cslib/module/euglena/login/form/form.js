'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Form = require('core/component/form/form'),

  // View = require('./view'),
  TextField = require('core/component/textfield/field'),
      Button = require('core/component/button/field');

  return function (_Form) {
    _inherits(LoginForm, _Form);

    function LoginForm() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, LoginForm);

      return _possibleConstructorReturn(this, (LoginForm.__proto__ || Object.getPrototypeOf(LoginForm)).call(this, {
        modelData: {
          id: "login",
          classes: ["form__login"],
          title: "Sign In",
          fields: [TextField.create({
            id: "email",
            placeholder: "Email Address",
            changeEvents: 'change blur',
            validation: {
              exists: {
                errorMessage: "Email address required"
              },
              email: {
                errorMessage: "Not a valid email"
              }
            }
          })],
          buttons: [Button.create({
            id: "submit",
            label: "Sign In",
            eventName: "Login.Submit"
          })]
        }
      }));
    }

    return LoginForm;
  }(Form);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRm9ybSIsIlRleHRGaWVsZCIsIkJ1dHRvbiIsInNldHRpbmdzIiwibW9kZWxEYXRhIiwiaWQiLCJjbGFzc2VzIiwidGl0bGUiLCJmaWVsZHMiLCJjcmVhdGUiLCJwbGFjZWhvbGRlciIsImNoYW5nZUV2ZW50cyIsInZhbGlkYXRpb24iLCJleGlzdHMiLCJlcnJvck1lc3NhZ2UiLCJlbWFpbCIsImJ1dHRvbnMiLCJsYWJlbCIsImV2ZW50TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsT0FBT0QsUUFBUSwwQkFBUixDQUFiOztBQUNFO0FBQ0FFLGNBQVlGLFFBQVEsZ0NBQVIsQ0FGZDtBQUFBLE1BR0VHLFNBQVNILFFBQVEsNkJBQVIsQ0FIWDs7QUFLQTtBQUFBOztBQUNFLHlCQUEyQjtBQUFBLFVBQWZJLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSxtSEFDbkI7QUFDSkMsbUJBQVc7QUFDVEMsY0FBSSxPQURLO0FBRVRDLG1CQUFTLENBQUMsYUFBRCxDQUZBO0FBR1RDLGlCQUFPLFNBSEU7QUFJVEMsa0JBQVEsQ0FBQ1AsVUFBVVEsTUFBVixDQUFpQjtBQUN4QkosZ0JBQUksT0FEb0I7QUFFeEJLLHlCQUFhLGVBRlc7QUFHeEJDLDBCQUFjLGFBSFU7QUFJeEJDLHdCQUFZO0FBQ1ZDLHNCQUFRO0FBQ05DLDhCQUFjO0FBRFIsZUFERTtBQUlWQyxxQkFBTztBQUNMRCw4QkFBYztBQURUO0FBSkc7QUFKWSxXQUFqQixDQUFELENBSkM7QUFpQlRFLG1CQUFTLENBQUNkLE9BQU9PLE1BQVAsQ0FBYztBQUN0QkosZ0JBQUksUUFEa0I7QUFFdEJZLG1CQUFPLFNBRmU7QUFHdEJDLHVCQUFXO0FBSFcsV0FBZCxDQUFEO0FBakJBO0FBRFAsT0FEbUI7QUEwQjFCOztBQTNCSDtBQUFBLElBQStCbEIsSUFBL0I7QUE2QkQsQ0FuQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbG9naW4vZm9ybS9mb3JtLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
