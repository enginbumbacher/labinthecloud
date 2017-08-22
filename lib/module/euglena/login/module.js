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
      Utils.bindMethods(this, ['_beforeWindowClose'])
      this._onPhaseChange = this._onPhaseChange.bind(this);
      this._onLoginSubmit = this._onLoginSubmit.bind(this);
      this._onLogout = this._onLogout.bind(this);
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
      this.form = new LoginForm();
      this.form.view().addEventListener('Login.Submit', this._onLoginSubmit);

      this.profile = new Profile();
      this.profile.addEventListener('Login.Logout', this._onLogout);
      window.addEventListener('beforeunload', this._beforeWindowClose);
    }

    init() {
      HM.hook('Panel.Contents', (subject, meta) => {
        if (meta.id == "interactive") {
          subject.push(this.profile);
        }
        return subject;
      }, 10);
      return super.init();
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "login") {
        const userId = Utils.urlParam('uid');
        if (userId) {
          Utils.promiseAjax('/api/v1/Students/login', {
            data: {
              source_id: userId,
              source: 'mook',
              lab: Globals.get('AppConfig.lab')
            },
            method: 'POST'
          }).then((data) => {

            Globals.set('user', data.source_id);
            Globals.set('student_id', data.student_id);

            if (!(Globals.get('AppConfig.system.maxLoginTime') && data.disabled_login)) {

              Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });

              this.form.clear();

              Globals.get('Logger').log({
                type: 'login',
                category: 'app',
                data: {}
              })

            } else {
              //window.location.href =  window.location.href.split("?")[0];
              window.history.pushState("object or string", "Title", window.location.href.split("?")[0]);

              Globals.get('Logger').log({
                type: 'login',
                category: 'app',
                data: 'attempted login'
              });

              Globals.get('Relay').dispatchEvent('Notifications.Add', {
                id: "attempted_login",
                type: "notice",
                message: "You ran out of time."
              })

              Globals.set('user', null);
              Globals.set('student_id', null);
              Globals.get('Relay').dispatchEvent('Help.Show', {});

              // Display login form
              Globals.get('Layout').getPanel('interactive').addContent(this.form.view());
            }

          })
        } else {
          // Open help
          Globals.get('Relay').dispatchEvent('Help.Show', {});

          // Display login form
          Globals.get('Layout').getPanel('interactive').addContent(this.form.view());
        }
      } else {
        if (Globals.get('AppConfig.system.maxLoginTime')) {
          setTimeout(this._onLogout,Globals.get('AppConfig.system.maxLoginTime'));
        }
        Globals.get('Layout').getPanel('interactive').removeContent(this.form.view());
      }
    }

    _onLoginSubmit(evt) {
      this.form.validate().then((validation) => {
        if (validation.isValid) {
          Utils.promiseAjax('/api/v1/Students/login', {
            data: {
              source_id: this.form.export().email,
              source: 'webapp',
              lab: Globals.get('AppConfig.lab')
            },
            method: 'POST'
          }).then((data) => {

            Globals.set('user', data.source_id);
            Globals.set('student_id', data.student_id);

            if (!(Globals.get('AppConfig.system.maxLoginTime') && data.disabled_login)) {

              Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
              Globals.get('Relay').dispatchEvent('Help.Hide', {});
              this.form.clear();
              Globals.get('Logger').log({
                type: 'login',
                category: 'app',
                data: {}
              })
            } else {
              //Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });

              this.form.clear();
              Globals.get('Logger').log({
                type: 'login',
                category: 'app',
                data: 'attempted login'
              });

              Globals.get('Relay').dispatchEvent('Notifications.Add', {
                id: "attempted_login",
                type: "notice",
                message: "You ran out of time."
              })

              Globals.set('user', null);
              Globals.set('student_id', null);
            }
          })
        }
      });
    }

    _onLogout(evt) {

      Utils.promiseAjax('/api/v1/Students/logout', {
        data: {
          source_id: Globals.get('user'),
          student_id: Globals.get('student_id'),
          disabled_login: Globals.get('AppConfig.system.maxLoginTime') ? true : false
        },
        method: 'POST'
      }).then((data) => {

        Globals.get('Logger').log({
          type: 'logout',
          category: 'app',
          data: Globals.get('AppConfig.system.maxLoginTime') ? 'forced logout' : {}
        });

        Globals.set('user', null);
        Globals.set('student_id', null);
        Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
      })
    }

    _beforeWindowClose(e) {
      if (Globals.get('student_id')) {
        Globals.get('Logger').log({
          type: 'logout',
          category: 'app',
          data: {}
        })
      }
    }

  };
});
