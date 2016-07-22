define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals'),
    LoginForm = require('./form/form'),
    Utils = require('core/util/utils')
  ;

  return class LoginModule extends Module {
    constructor() {
      super();
      this._onPhaseChange = this._onPhaseChange.bind(this);
      this._onLoginSubmit = this._onLoginSubmit.bind(this);
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
      this.form = new LoginForm();
      this.form.view().addEventListener('Login.Submit', this._onLoginSubmit);
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "login") {
        // Open help
        Globals.get('Relay').dispatchEvent('Help.Show', {});
        
        // Display login form
        Globals.get('Layout.panels.left').addChild(this.form.view());
      } else {
        Globals.get('Layout.panels.left').removeChild(this.form.view());
      }
    }

    _onLoginSubmit(evt) {
      if (Utils.validateString(this.form.value().email, /@/)) {
        Globals.set('user', this.form.value().email)
        Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "setup" });
      } else {
        //register error
      }
    }

  };
});