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
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, LoginForm);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(LoginForm).call(this, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxPQUFPLFFBQVEsMEJBQVIsQ0FBYjtBQUFBOztBQUVFLGNBQVksUUFBUSxnQ0FBUixDQUZkO0FBQUEsTUFHRSxTQUFTLFFBQVEsNkJBQVIsQ0FIWDs7QUFLQTtBQUFBOztBQUNFLHlCQUEyQjtBQUFBLFVBQWYsUUFBZSx5REFBSixFQUFJOztBQUFBOztBQUFBLDBGQUNuQjtBQUNKLG1CQUFXO0FBQ1QsY0FBSSxPQURLO0FBRVQsbUJBQVMsQ0FBQyxhQUFELENBRkE7QUFHVCxpQkFBTyxTQUhFO0FBSVQsa0JBQVEsQ0FBQyxVQUFVLE1BQVYsQ0FBaUI7QUFDeEIsZ0JBQUksT0FEb0I7QUFFeEIseUJBQWEsZUFGVztBQUd4QiwwQkFBYyxhQUhVO0FBSXhCLHdCQUFZO0FBQ1Ysc0JBQVE7QUFDTiw4QkFBYztBQURSLGVBREU7QUFJVixxQkFBTztBQUNMLDhCQUFjO0FBRFQ7QUFKRztBQUpZLFdBQWpCLENBQUQsQ0FKQztBQWlCVCxtQkFBUyxDQUFDLE9BQU8sTUFBUCxDQUFjO0FBQ3RCLGdCQUFJLFFBRGtCO0FBRXRCLG1CQUFPLFNBRmU7QUFHdEIsdUJBQVc7QUFIVyxXQUFkLENBQUQ7QUFqQkE7QUFEUCxPQURtQjtBQTBCMUI7O0FBM0JIO0FBQUEsSUFBK0IsSUFBL0I7QUE2QkQsQ0FuQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbG9naW4vZm9ybS9mb3JtLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
