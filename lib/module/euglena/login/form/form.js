define((require) => {
  const Form = require('module/form/form'),
    View = require('./view'),
    TextField = require('module/form/fields/text/field'),
    Button = require('module/form/fields/button/field');

  return class LoginForm extends Form {
    constructor() {
      super({
        viewClass: View,
        modelData: {
          fields: [TextField.create({
            id: "email",
            placeholder: "Email Address"
          })],
          buttons: [Button.create({
            label: "Sign In",
            event: "Login.Submit"
          })]
        }
      })
    }
  }
})