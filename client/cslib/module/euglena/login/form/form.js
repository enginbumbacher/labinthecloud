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
            //value: 'engin@gmail.com',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRm9ybSIsIlRleHRGaWVsZCIsIkJ1dHRvbiIsInNldHRpbmdzIiwibW9kZWxEYXRhIiwiaWQiLCJjbGFzc2VzIiwidGl0bGUiLCJmaWVsZHMiLCJjcmVhdGUiLCJwbGFjZWhvbGRlciIsImNoYW5nZUV2ZW50cyIsInZhbGlkYXRpb24iLCJleGlzdHMiLCJlcnJvck1lc3NhZ2UiLCJlbWFpbCIsImJ1dHRvbnMiLCJsYWJlbCIsImV2ZW50TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsT0FBT0QsUUFBUSwwQkFBUixDQUFiOztBQUNFO0FBQ0FFLGNBQVlGLFFBQVEsZ0NBQVIsQ0FGZDtBQUFBLE1BR0VHLFNBQVNILFFBQVEsNkJBQVIsQ0FIWDs7QUFLQTtBQUFBOztBQUNFLHlCQUEyQjtBQUFBLFVBQWZJLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSxtSEFDbkI7QUFDSkMsbUJBQVc7QUFDVEMsY0FBSSxPQURLO0FBRVRDLG1CQUFTLENBQUMsYUFBRCxDQUZBO0FBR1RDLGlCQUFPLFNBSEU7QUFJVEMsa0JBQVEsQ0FBQ1AsVUFBVVEsTUFBVixDQUFpQjtBQUN4QkosZ0JBQUksT0FEb0I7QUFFeEJLLHlCQUFhLGVBRlc7QUFHeEJDLDBCQUFjLGFBSFU7QUFJeEI7QUFDQUMsd0JBQVk7QUFDVkMsc0JBQVE7QUFDTkMsOEJBQWM7QUFEUixlQURFO0FBSVZDLHFCQUFPO0FBQ0xELDhCQUFjO0FBRFQ7QUFKRztBQUxZLFdBQWpCLENBQUQsQ0FKQztBQWtCVEUsbUJBQVMsQ0FBQ2QsT0FBT08sTUFBUCxDQUFjO0FBQ3RCSixnQkFBSSxRQURrQjtBQUV0QlksbUJBQU8sU0FGZTtBQUd0QkMsdUJBQVc7QUFIVyxXQUFkLENBQUQ7QUFsQkE7QUFEUCxPQURtQjtBQTJCMUI7O0FBNUJIO0FBQUEsSUFBK0JsQixJQUEvQjtBQThCRCxDQXBDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9sb2dpbi9mb3JtL2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIC8vIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBUZXh0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC90ZXh0ZmllbGQvZmllbGQnKSxcbiAgICBCdXR0b24gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQnKTtcblxuICByZXR1cm4gY2xhc3MgTG9naW5Gb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc3VwZXIoe1xuICAgICAgICBtb2RlbERhdGE6IHtcbiAgICAgICAgICBpZDogXCJsb2dpblwiLFxuICAgICAgICAgIGNsYXNzZXM6IFtcImZvcm1fX2xvZ2luXCJdLFxuICAgICAgICAgIHRpdGxlOiBcIlNpZ24gSW5cIixcbiAgICAgICAgICBmaWVsZHM6IFtUZXh0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiBcImVtYWlsXCIsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJFbWFpbCBBZGRyZXNzXCIsXG4gICAgICAgICAgICBjaGFuZ2VFdmVudHM6ICdjaGFuZ2UgYmx1cicsXG4gICAgICAgICAgICAvL3ZhbHVlOiAnZW5naW5AZ21haWwuY29tJyxcbiAgICAgICAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgICAgICAgZXhpc3RzOiB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBcIkVtYWlsIGFkZHJlc3MgcmVxdWlyZWRcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBlbWFpbDoge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJOb3QgYSB2YWxpZCBlbWFpbFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KV0sXG4gICAgICAgICAgYnV0dG9uczogW0J1dHRvbi5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwic3VibWl0XCIsXG4gICAgICAgICAgICBsYWJlbDogXCJTaWduIEluXCIsXG4gICAgICAgICAgICBldmVudE5hbWU6IFwiTG9naW4uU3VibWl0XCJcbiAgICAgICAgICB9KV1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn0pXG4iXX0=
