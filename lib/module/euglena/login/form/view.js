import FormView from 'module/form/view';
import Template from './login.html';

export default class LoginFormView extends FormView {
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
