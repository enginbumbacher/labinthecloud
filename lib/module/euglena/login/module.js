define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
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

    init() {
      HM.hook('Panel.Contents', (subject, meta) => {
        if (meta.id == "interactive") {
          subject.push(this.profile);
        }
        return subject;
      }, 10);
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "login") {
        const userId = Utils.urlParam('uid');
        if (userId) {
          Utils.promiseAjax('/api/v1/Students/login', {
            data: {
              source_id: userId,
              source: 'mook'
            },
            method: 'POST'
          }).then((data) => {
            Globals.set('user', data.source_id);
            Globals.set('user_id', data.user_id);
            Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
            this.form.clear();
          })
        } else {
          // Open help
          Globals.get('Relay').dispatchEvent('Help.Show', {});
          
          // Display login form
          Globals.get('Layout').getPanel('interactive').addContent(this.form.view());
        }
      } else {
        Globals.get('Layout').getPanel('interactive').removeContent(this.form.view());
      }
    }

    _onLoginSubmit(evt) {
      this.form.validate().then((validation) => {
        if (validation.isValid) {
          Utils.promiseAjax('/api/v1/Students/login', {
            data: {
              source_id: this.form.export().email,
              source: 'webapp'
            },
            method: 'POST'
          }).then((data) => {
            Globals.set('user', data.source_id);
            Globals.set('user_id', data.user_id);
            Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
            Globals.get('Relay').dispatchEvent('Help.Hide', {});
            this.form.clear();
          })
        }
      });
    }

    _onLogout(evt) {
      Globals.set('user', null);
      Globals.set('user_id', null);
      Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
    }

  };
});