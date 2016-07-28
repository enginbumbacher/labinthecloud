define((require) => {
  const FormView = require('module/form/view'),
    Template = require('text!./login.html');

  return class LoginFormView extends FormView {
    constructor(model, tmpl) {
      super(model, tmpl || Template);
      this._onKeyUp = this._onKeyUp.bind(this);

      this.$dom().on('keyup keypress', this._onKeyUp);
    }

    _onKeyUp(jqevt) {
      let keyCode = jqevt.keyCode || jqevt.which;
      if (keyCode === 13) {
        this.dispatchEvent('Login.Submit', {});
        jqevt.preventDefault();
        return false;
      }
    }
  }
})