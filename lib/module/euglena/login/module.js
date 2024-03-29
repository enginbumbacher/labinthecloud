import Module from 'core/app/module';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import LoginForm from './form/form';
import Utils from 'core/util/utils';
import Timer from 'core/util/timer';
import Profile from './profile/view';
import $ from 'jquery';

export default class LoginModule extends Module {
  constructor(ctx) {
    super(ctx);
    Utils.bindMethods(this, ['_beforeWindowClose', '_onPhaseChange', '_onLoginSubmit', '_onLogout', '_hookPanelContents'])
    Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
    this.form = new LoginForm();
    this.form.view().addEventListener('Login.Submit', this._onLoginSubmit);

    this.profile = new Profile();
    this.profile.addEventListener('Login.Logout', this._onLogout);
    window.addEventListener('beforeunload', this._beforeWindowClose);

    this._timer = new Timer({
      duration: Globals.get('AppConfig.system.maxLoginTime')
    });
    this._timer.addEventListener('Timer.End', this._onLogout);
  }

  init() {
    HM.hook('Panel.Contents', this._hookPanelContents, 10);
    return super.init();
  }

  _hookPanelContents(subject, meta) {
    if (meta.app == this.context.app && meta.id == "interactive") {
      subject.push(this.profile);
    }
    return subject;
  }

  _onPhaseChange(evt) {
    if (evt.data.phase == "login") {
      const userId = Utils.urlParam('uid') || Globals.get('AppConfig.system.userId');

      if (userId) {
        Utils.promiseAjax('/api/v1/Students/login', {
          data: {
            source_id: userId,
            source: 'mook',
            lab: Globals.get('AppConfig.lab'),
            studentGroup: Globals.get('AppConfig.studentGroup.uuid')
          },
          method: 'POST'
        }).then((data) => {

          if (!Globals.get('AppConfig.system.maxLoginTime')
          || !(data.disabled_login == Globals.get('AppConfig.lab') ? 1 : (data.disabled_login == 'true' ? 1 : 0))) {


            Globals.set('user', data.source_id);
            Globals.set('student_id', data.student_id);
            Globals.set('login_time',new Date(data.last_login.$data));

            Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
            Globals.get('Relay').dispatchEvent('Help.Hide', {});
            this.form.clear();

            Globals.get('Logger').log({
              type: 'login',
              category: 'app',
              data: {}
            })

          } else {
              Globals.get('Logger').log({
                type: 'login',
                category: 'app',
                data: 'attempted login',
                studentId: data.student_id
              });

              Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login_attempted" });
          }
        })
      } else {

        // Open help
        Globals.get('Relay').dispatchEvent('Help.Show', {});
        // Display login form
        Globals.get(`${this.context.app}.Layout`).getPanel('interactive').addContent(this.form.view());

      }
    } else if (evt.data.phase == "experiment") {

      if (Globals.get('AppConfig.system.maxLoginTime')) {
        //setTimeout(this._onLogout,Globals.get('AppConfig.system.maxLoginTime')*1000);
        this._timer.setSource(null);
        this._timer.start();
      }
      Globals.get(`${this.context.app}.Layout`).getPanel('interactive').removeContent(this.form.view());

    } else if (evt.data.phase == "login_attempted") {

      window.history.pushState({}, $('title').text(), window.location.href.split("?")[0]);

      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        app: this.context.app,
        id: "attempted_login",
        type: "notice",
        message: "You ran out of time."
      })

      Globals.set('user', null);
      Globals.set('student_id', null);
      Globals.set('login_time',null);
      Globals.get('Relay').dispatchEvent('Help.Show', {});

      // Hide login form
      this.form.hide();
      console.log('adding login form view');
      Globals.get(`${this.context.app}.Layout`).getPanel('interactive').addContent(this.form.view());

    }
  }

  _onLoginSubmit(evt) {
    this.form.validate().then((validation) => {
      if (validation.isValid) {
        Utils.promiseAjax('/api/v1/Students/login', {
          data: {
            source_id: this.form.export().email,
            source: 'webapp',
            lab: Globals.get('AppConfig.lab'),
            studentGroup: Globals.get('AppConfig.studentGroup.uuid')
          },
          method: 'POST'
        }).then((data) => {

          if (!Globals.get('AppConfig.system.maxLoginTime')
          || !(data.disabled_login == Globals.get('AppConfig.lab') ? 1 : (data.disabled_login == 'true' ? 1 : 0))) {

            Globals.set('student_id', data.student_id);
            Globals.set('user', data.source_id);
            Globals.set('login_time',new Date(data.last_login.$data));

            Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
            Globals.get('Relay').dispatchEvent('Help.Hide', {});
            this.form.clear();

            Globals.get('Logger').log({
              type: 'login',
              category: 'app',
              data: {}
            })
          } else {

            Globals.get('Logger').log({
              type: 'login',
              category: 'app',
              data: 'attempted login',
              studentId: data.student_id
            });

            //Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
            Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login_attempted" });

          }
        }, (err) => {
          Globals.get('Relay').dispatchEvent('Notifications.Add', {
            app: this.context.app,
            id: 'login_fialure',
            type: 'error',
            message: 'Login failed'
          })
        })
      }
    }, (err) => {
      // let it go.
      console.log(err);
    });
  }

  _onLogout(evt) {
    this._timer.stop();
    this._timer.seek(0);
    if (Globals.get('user')) {
      var logged_time = new Date().getTime()-Globals.get("login_time").getTime();
      var disabled = false;

      if (Globals.get('AppConfig.system.maxLoginTime') && (logged_time / 1000 >= (Globals.get('AppConfig.system.maxLoginTime')-0.1))) {
        disabled = Globals.get('AppConfig.lab') ? Globals.get('AppConfig.lab') : true;
      }

      Utils.promiseAjax('/api/v1/Students/logout', {
        data: {
          source_id: Globals.get('user'),
          student_id: Globals.get('student_id'),
          disabled_login: disabled
        },
        method: 'POST'
      }).then((data) => {

        window.history.pushState({}, $('title').text(), window.location.href.split("?")[0]);

        if (!evt.data.quietly) {
          Globals.get('Logger').log({
            type: 'logout',
            category: 'app',
            data: disabled
          });
        }

        Globals.set('user', null);
        Globals.set('student_id', null);
        Globals.set('last_login',null);

        if (Globals.get('AppConfig.system.maxLoginTime') && (logged_time / 1000 >= (Globals.get('AppConfig.system.maxLoginTime')-0.1))) {
          Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login_attempted" });
        } else {
          Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
        }

      })
    }
  }

  _beforeWindowClose(e) {
    this.profile.dispatchEvent('Login.Logout',{});
    //if (Globals.get('student_id')) {
    //  Globals.get('Logger').log({
    //    type: 'logout',
    //    category: 'app',
    //    data: {}
    //  })
    //}
  }

  destroy() {
    this.profile.dispatchEvent('Login.Logout', {
      quietly: true
    });
    window.removeEventListener('beforeunload', this._beforeWindowClose);
    Globals.set('user', null);
    Globals.set('student_id', null);
    Globals.set('login_time', null);
    Globals.set('last_login',null);
    HM.unhook('Panel.Contents', this._hookPanelContents);
    Globals.get('Relay').removeEventListener('AppPhase.Change', this._onPhaseChange);

    return Promise.all([
      this.form.destroy(),
      this.profile.destroy(),
      super.destroy()
    ])
  }
};
