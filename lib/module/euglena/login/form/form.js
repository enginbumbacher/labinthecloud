import Form from 'core/component/form/form';
import TextField from 'core/component/textfield/field';
import Button from 'core/component/button/field';

export default class LoginForm extends Form {
  constructor(settings = {}) {
    super({
      modelData: {
        id: "login",
        classes: ["form__login"],
        title: "Sign In",
        fields: [TextField.create({
          id: "email",
          placeholder: "Group Name",
          changeEvents: 'change blur',
          //value: 'engin@gmail.com',
          validation: {
            exists: {
              errorMessage: "Correct group name address required"
            },
            email: {
              errorMessage: "Not a valid group name"
            }
          }
        })],
        buttons: [Button.create({
          id: "submit",
          label: "Sign In",
          eventName: "Login.Submit"
        })]
      }
    })
  }
}
