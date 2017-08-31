'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      LoginForm = require('./form/form'),
      Utils = require('core/util/utils'),
      Timer = require('core/util/timer'),
      Profile = require('./profile/view'),
      $ = require('jquery');

  return function (_Module) {
    _inherits(LoginModule, _Module);

    function LoginModule() {
      _classCallCheck(this, LoginModule);

      var _this = _possibleConstructorReturn(this, (LoginModule.__proto__ || Object.getPrototypeOf(LoginModule)).call(this));

      Utils.bindMethods(_this, ['_beforeWindowClose']);
      _this._onPhaseChange = _this._onPhaseChange.bind(_this);
      _this._onLoginSubmit = _this._onLoginSubmit.bind(_this);
      _this._onLogout = _this._onLogout.bind(_this);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      _this.form = new LoginForm();
      _this.form.view().addEventListener('Login.Submit', _this._onLoginSubmit);

      _this.profile = new Profile();
      _this.profile.addEventListener('Login.Logout', _this._onLogout);
      window.addEventListener('beforeunload', _this._beforeWindowClose);

      _this._timer = new Timer({
        duration: Globals.get('AppConfig.system.maxLoginTime')
      });
      _this._timer.addEventListener('Timer.End', _this._onLogout);
      return _this;
    }

    _createClass(LoginModule, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        HM.hook('Panel.Contents', function (subject, meta) {
          if (meta.id == "interactive") {
            subject.push(_this2.profile);
          }
          return subject;
        }, 10);
        return _get(LoginModule.prototype.__proto__ || Object.getPrototypeOf(LoginModule.prototype), 'init', this).call(this);
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        var _this3 = this;

        if (evt.data.phase == "login") {
          var userId = Utils.urlParam('uid');
          if (userId) {
            Utils.promiseAjax('/api/v1/Students/login', {
              data: {
                source_id: userId,
                source: 'mook',
                lab: Globals.get('AppConfig.lab')
              },
              method: 'POST'
            }).then(function (data) {

              Globals.set('user', data.source_id);
              Globals.set('student_id', data.student_id);
              Globals.set('login_time', new Date(data.last_login.$data));

              if (!Globals.get('AppConfig.system.maxLoginTime') || !(data.disabled_login == Globals.get('AppConfig.lab') ? 1 : data.disabled_login == 'true' ? 1 : 0)) {
                Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });

                _this3.form.clear();

                Globals.get('Logger').log({
                  type: 'login',
                  category: 'app',
                  data: {}
                });
              } else {
                //window.location.href =  window.location.href.split("?")[0];
                window.history.pushState({}, $('title').text(), window.location.href.split("?")[0]);

                Globals.get('Logger').log({
                  type: 'login',
                  category: 'app',
                  data: 'attempted login'
                });

                Globals.get('Relay').dispatchEvent('Notifications.Add', {
                  id: "attempted_login",
                  type: "notice",
                  message: "You ran out of time."
                });

                Globals.set('user', null);
                Globals.set('student_id', null);
                Globals.set('login_time', null);
                Globals.get('Relay').dispatchEvent('Help.Show', {});

                // Display login form
                Globals.get('Layout').getPanel('interactive').addContent(_this3.form.view());
              }
            });
          } else {
            // Open help
            Globals.get('Relay').dispatchEvent('Help.Show', {});
            // Display login form
            Globals.get('Layout').getPanel('interactive').addContent(this.form.view());
          }
        } else {
          if (Globals.get('AppConfig.system.maxLoginTime')) {
            //setTimeout(this._onLogout,Globals.get('AppConfig.system.maxLoginTime')*1000);
            this._timer.setSource(null);
            this._timer.start();
          }
          Globals.get('Layout').getPanel('interactive').removeContent(this.form.view());
        }
      }
    }, {
      key: '_onLoginSubmit',
      value: function _onLoginSubmit(evt) {
        var _this4 = this;

        this.form.validate().then(function (validation) {
          if (validation.isValid) {
            Utils.promiseAjax('/api/v1/Students/login', {
              data: {
                source_id: _this4.form.export().email,
                source: 'webapp',
                lab: Globals.get('AppConfig.lab')
              },
              method: 'POST'
            }).then(function (data) {

              Globals.set('user', data.source_id);
              Globals.set('student_id', data.student_id);
              Globals.set('login_time', new Date(data.last_login.$data));

              if (!Globals.get('AppConfig.system.maxLoginTime') || !(data.disabled_login == Globals.get('AppConfig.lab') ? 1 : data.disabled_login == 'true' ? 1 : 0)) {

                Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
                Globals.get('Relay').dispatchEvent('Help.Hide', {});
                _this4.form.clear();
                Globals.get('Logger').log({
                  type: 'login',
                  category: 'app',
                  data: {}
                });
              } else {
                //Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });

                _this4.form.clear();
                Globals.get('Logger').log({
                  type: 'login',
                  category: 'app',
                  data: 'attempted login'
                });

                Globals.get('Relay').dispatchEvent('Notifications.Add', {
                  id: "attempted_login",
                  type: "notice",
                  message: "You ran out of time."
                });

                Globals.set('user', null);
                Globals.set('student_id', null);
                Globals.set('login_time', null);
              }
            });
          }
        });
      }
    }, {
      key: '_onLogout',
      value: function _onLogout(evt) {

        this._timer.stop();
        this._timer.seek(0);
        var logged_time = new Date().getTime() - Globals.get("login_time").getTime();
        var disabled = false;
        console.log(Globals.get("login_time").getTime());
        console.log(logged_time / 1000);
        console.log(Globals.get('AppConfig.system.maxLoginTime'));
        if (Globals.get('AppConfig.system.maxLoginTime') && logged_time / 1000 >= Globals.get('AppConfig.system.maxLoginTime') - 0.1) {
          disabled = Globals.get('AppConfig.lab') ? Globals.get('AppConfig.lab') : true;
          console.log('I should be here');
        }
        console.log(disabled);
        Utils.promiseAjax('/api/v1/Students/logout', {
          data: {
            source_id: Globals.get('user'),
            student_id: Globals.get('student_id'),
            disabled_login: disabled
          },
          method: 'POST'
        }).then(function (data) {

          Globals.get('Logger').log({
            type: 'logout',
            category: 'app',
            data: disabled
          });

          Globals.set('user', null);
          Globals.set('student_id', null);
          Globals.set('last_login', null);
          window.history.pushState({}, $('title').text(), window.location.href.split("?")[0]);
          Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
        });
      }
    }, {
      key: '_beforeWindowClose',
      value: function _beforeWindowClose(e) {
        this.profile.dispatchEvent('Login.Logout', {});
        //if (Globals.get('student_id')) {
        //  Globals.get('Logger').log({
        //    type: 'logout',
        //    category: 'app',
        //    data: {}
        //  })
        //}
      }
    }]);

    return LoginModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiR2xvYmFscyIsIkhNIiwiTG9naW5Gb3JtIiwiVXRpbHMiLCJUaW1lciIsIlByb2ZpbGUiLCIkIiwiYmluZE1ldGhvZHMiLCJfb25QaGFzZUNoYW5nZSIsImJpbmQiLCJfb25Mb2dpblN1Ym1pdCIsIl9vbkxvZ291dCIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJmb3JtIiwidmlldyIsInByb2ZpbGUiLCJ3aW5kb3ciLCJfYmVmb3JlV2luZG93Q2xvc2UiLCJfdGltZXIiLCJkdXJhdGlvbiIsImhvb2siLCJzdWJqZWN0IiwibWV0YSIsImlkIiwicHVzaCIsImV2dCIsImRhdGEiLCJwaGFzZSIsInVzZXJJZCIsInVybFBhcmFtIiwicHJvbWlzZUFqYXgiLCJzb3VyY2VfaWQiLCJzb3VyY2UiLCJsYWIiLCJtZXRob2QiLCJ0aGVuIiwic2V0Iiwic3R1ZGVudF9pZCIsIkRhdGUiLCJsYXN0X2xvZ2luIiwiJGRhdGEiLCJkaXNhYmxlZF9sb2dpbiIsImRpc3BhdGNoRXZlbnQiLCJjbGVhciIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ0ZXh0IiwibG9jYXRpb24iLCJocmVmIiwic3BsaXQiLCJtZXNzYWdlIiwiZ2V0UGFuZWwiLCJhZGRDb250ZW50Iiwic2V0U291cmNlIiwic3RhcnQiLCJyZW1vdmVDb250ZW50IiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwiaXNWYWxpZCIsImV4cG9ydCIsImVtYWlsIiwic3RvcCIsInNlZWsiLCJsb2dnZWRfdGltZSIsImdldFRpbWUiLCJkaXNhYmxlZCIsImNvbnNvbGUiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUs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
