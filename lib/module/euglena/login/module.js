define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals'),
    LoginForm = require('./form/form'),
    Utils = require('core/util/utils'),
    Profile = require('./profile/view')
  ;

  return class LoginModule extends Module {
    constructor() {
      super();
      this._onPhaseChange = this._onPhaseChange.bind(this);
      this._onLoginSubmit = this._onLoginSubmit.bind(this);
      this._onLogout = this._onLogout.bind(this);
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
      this.form = new LoginForm();
      this.form.view().addEventListener('Login.Submit', this._onLoginSubmit);

      this.profile = new Profile();
      this.profile.addEventListener('Login.Logout', this._onLogout);
    }

    run() {
      Globals.get('Layout.panels.left').addChild(this.profile);      
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
      this.form.validate().then((validation) => {
        if (validation.isValid) {
          Globals.set('user', this.form.export().email);
          Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
          this.form.clear();
        }
      });
    }

    _onLogout(evt) {
      Globals.set('user', null);
      Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
    }

  };
});