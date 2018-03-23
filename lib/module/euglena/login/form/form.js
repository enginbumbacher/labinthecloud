define((require) => {
  const Form = require('core/component/form/form'),
    // View = require('./view'),
    TextField = require('core/component/textfield/field'),
    Button = require('core/component/button/field');

  return class LoginForm extends Form {
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
})
