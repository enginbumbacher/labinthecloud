define((require) => {
  const FormView = require('module/form/view'),
    Template = require('text!./login.html');

  return class LoginFormView extends FormView {
    constructor(model, tmpl) {
      super(model, tmpl || Template)
    }
  }
})