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

              if (!Globals.get('AppConfig.system.maxLoginTime') || !(data.disabled_login == Globals.get('AppConfig.lab') ? 1 : data.disabled_login == 'true' ? 1 : 0)) {

                Globals.set('user', data.source_id);
                Globals.set('student_id', data.student_id);
                Globals.set('login_time', new Date(data.last_login.$data));

                Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
                Globals.get('Relay').dispatchEvent('Help.Hide', {});
                _this3.form.clear();

                Globals.get('Logger').log({
                  type: 'login',
                  category: 'app',
                  data: {}
                });
              } else {
                Globals.get('Logger').log({
                  type: 'login',
                  category: 'app',
                  data: 'attempted login',
                  studentId: data.student_id
                });

                Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login_attempted" });
              }
            });
          } else {

            // Open help
            Globals.get('Relay').dispatchEvent('Help.Show', {});
            // Display login form
            Globals.get('Layout').getPanel('interactive').addContent(this.form.view());
          }
        } else if (evt.data.phase == "experiment") {

          if (Globals.get('AppConfig.system.maxLoginTime')) {
            //setTimeout(this._onLogout,Globals.get('AppConfig.system.maxLoginTime')*1000);
            this._timer.setSource(null);
            this._timer.start();
          }
          Globals.get('Layout').getPanel('interactive').removeContent(this.form.view());
        } else if (evt.data.phase == "login_attempted") {

          window.history.pushState({}, $('title').text(), window.location.href.split("?")[0]);

          Globals.get('Relay').dispatchEvent('Notifications.Add', {
            id: "attempted_login",
            type: "notice",
            message: "You ran out of time."
          });

          Globals.set('user', null);
          Globals.set('student_id', null);
          Globals.set('login_time', null);
          Globals.get('Relay').dispatchEvent('Help.Show', {});

          // Hide login form
          this.form.hide();
          Globals.get('Layout').getPanel('interactive').addContent(this.form.view());
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

              if (!Globals.get('AppConfig.system.maxLoginTime') || !(data.disabled_login == Globals.get('AppConfig.lab') ? 1 : data.disabled_login == 'true' ? 1 : 0)) {

                Globals.set('student_id', data.student_id);
                Globals.set('user', data.source_id);
                Globals.set('login_time', new Date(data.last_login.$data));

                Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
                Globals.get('Relay').dispatchEvent('Help.Hide', {});
                _this4.form.clear();

                Globals.get('Logger').log({
                  type: 'login',
                  category: 'app',
                  data: {}
                });
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

        if (Globals.get('AppConfig.system.maxLoginTime') && logged_time / 1000 >= Globals.get('AppConfig.system.maxLoginTime') - 0.1) {
          disabled = Globals.get('AppConfig.lab') ? Globals.get('AppConfig.lab') : true;
        }

        Utils.promiseAjax('/api/v1/Students/logout', {
          data: {
            source_id: Globals.get('user'),
            student_id: Globals.get('student_id'),
            disabled_login: disabled
          },
          method: 'POST'
        }).then(function (data) {

          window.history.pushState({}, $('title').text(), window.location.href.split("?")[0]);

          Globals.get('Logger').log({
            type: 'logout',
            category: 'app',
            data: disabled
          });

          Globals.set('user', null);
          Globals.set('student_id', null);
          Globals.set('last_login', null);

          if (Globals.get('AppConfig.system.maxLoginTime') && logged_time / 1000 >= Globals.get('AppConfig.system.maxLoginTime') - 0.1) {
            Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login_attempted" });
          } else {
            Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
          }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiR2xvYmFscyIsIkhNIiwiTG9naW5Gb3JtIiwiVXRpbHMiLCJUaW1lciIsIlByb2ZpbGUiLCIkIiwiYmluZE1ldGhvZHMiLCJfb25QaGFzZUNoYW5nZSIsImJpbmQiLCJfb25Mb2dpblN1Ym1pdCIsIl9vbkxvZ291dCIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJmb3JtIiwidmlldyIsInByb2ZpbGUiLCJ3aW5kb3ciLCJfYmVmb3JlV2luZG93Q2xvc2UiLCJfdGltZXIiLCJkdXJhdGlvbiIsImhvb2siLCJzdWJqZWN0IiwibWV0YSIsImlkIiwicHVzaCIsImV2dCIsImRhdGEiLCJwaGFzZSIsInVzZXJJZCIsInVybFBhcmFtIiwicHJvbWlzZUFqYXgiLCJzb3VyY2VfaWQiLCJzb3VyY2UiLCJsYWIiLCJtZXRob2QiLCJ0aGVuIiwiZGlzYWJsZWRfbG9naW4iLCJzZXQiLCJzdHVkZW50X2lkIiwiRGF0ZSIsImxhc3RfbG9naW4iLCIkZGF0YSIsImRpc3BhdGNoRXZlbnQiLCJjbGVhciIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsInN0dWRlbnRJZCIsImdldFBhbmVsIiwiYWRkQ29udGVudCIsInNldFNvdXJjZSIsInN0YXJ0IiwicmVtb3ZlQ29udGVudCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ0ZXh0IiwibG9jYXRpb24iLCJocmVmIiwic3BsaXQiLCJtZXNzYWdlIiwiaGlkZSIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsImlzVmFsaWQiLCJleHBvcnQiLCJlbWFpbCIsInN0b3AiLCJzZWVrIiwibG9nZ2VkX3RpbWUiLCJnZXRUaW1lIiwiZGlzYWJsZWQiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FB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LEVBd013QjtBQUNwQixhQUFLeEQsT0FBTCxDQUFhMkIsYUFBYixDQUEyQixjQUEzQixFQUEwQyxFQUExQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7QUFqTkg7O0FBQUE7QUFBQSxJQUFpQzVDLE1BQWpDO0FBb05ELENBL05EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2xvZ2luL21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIExvZ2luRm9ybSA9IHJlcXVpcmUoJy4vZm9ybS9mb3JtJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBUaW1lciA9IHJlcXVpcmUoJ2NvcmUvdXRpbC90aW1lcicpLFxuICAgIFByb2ZpbGUgPSByZXF1aXJlKCcuL3Byb2ZpbGUvdmlldycpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIExvZ2luTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19iZWZvcmVXaW5kb3dDbG9zZSddKVxuICAgICAgdGhpcy5fb25QaGFzZUNoYW5nZSA9IHRoaXMuX29uUGhhc2VDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uTG9naW5TdWJtaXQgPSB0aGlzLl9vbkxvZ2luU3VibWl0LmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkxvZ291dCA9IHRoaXMuX29uTG9nb3V0LmJpbmQodGhpcyk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICAgIHRoaXMuZm9ybSA9IG5ldyBMb2dpbkZvcm0oKTtcbiAgICAgIHRoaXMuZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTG9naW4uU3VibWl0JywgdGhpcy5fb25Mb2dpblN1Ym1pdCk7XG5cbiAgICAgIHRoaXMucHJvZmlsZSA9IG5ldyBQcm9maWxlKCk7XG4gICAgICB0aGlzLnByb2ZpbGUuYWRkRXZlbnRMaXN0ZW5lcignTG9naW4uTG9nb3V0JywgdGhpcy5fb25Mb2dvdXQpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIHRoaXMuX2JlZm9yZVdpbmRvd0Nsb3NlKTtcblxuICAgICAgdGhpcy5fdGltZXIgPSBuZXcgVGltZXIoe1xuICAgICAgICBkdXJhdGlvbjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubWF4TG9naW5UaW1lJylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuRW5kJywgdGhpcy5fb25Mb2dvdXQpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIChzdWJqZWN0LCBtZXRhKSA9PiB7XG4gICAgICAgIGlmIChtZXRhLmlkID09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgICAgICAgIHN1YmplY3QucHVzaCh0aGlzLnByb2ZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgICAgfSwgMTApO1xuICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIpIHtcbiAgICAgICAgY29uc3QgdXNlcklkID0gVXRpbHMudXJsUGFyYW0oJ3VpZCcpO1xuXG4gICAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgICBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9TdHVkZW50cy9sb2dpbicsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgc291cmNlX2lkOiB1c2VySWQsXG4gICAgICAgICAgICAgIHNvdXJjZTogJ21vb2snLFxuICAgICAgICAgICAgICBsYWI6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tYXhMb2dpblRpbWUnKVxuICAgICAgICAgICAgfHwgIShkYXRhLmRpc2FibGVkX2xvZ2luID09IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJykgPyAxIDogKGRhdGEuZGlzYWJsZWRfbG9naW4gPT0gJ3RydWUnID8gMSA6IDApKSkge1xuXG5cbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ3VzZXInLCBkYXRhLnNvdXJjZV9pZCk7XG4gICAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdzdHVkZW50X2lkJywgZGF0YS5zdHVkZW50X2lkKTtcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2xvZ2luX3RpbWUnLG5ldyBEYXRlKGRhdGEubGFzdF9sb2dpbi4kZGF0YSkpO1xuXG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FwcFBoYXNlLkNoYW5nZScsIHsgcGhhc2U6IFwiZXhwZXJpbWVudFwiIH0pO1xuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdIZWxwLkhpZGUnLCB7fSk7XG4gICAgICAgICAgICAgIHRoaXMuZm9ybS5jbGVhcigpO1xuXG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsb2dpbicsXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6ICdhcHAnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHt9XG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnbG9naW4nLFxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6ICdhcHAnLFxuICAgICAgICAgICAgICAgICAgZGF0YTogJ2F0dGVtcHRlZCBsb2dpbicsXG4gICAgICAgICAgICAgICAgICBzdHVkZW50SWQ6IGRhdGEuc3R1ZGVudF9pZFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQXBwUGhhc2UuQ2hhbmdlJywgeyBwaGFzZTogXCJsb2dpbl9hdHRlbXB0ZWRcIiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLy8gT3BlbiBoZWxwXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnSGVscC5TaG93Jywge30pO1xuICAgICAgICAgIC8vIERpc3BsYXkgbG9naW4gZm9ybVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMYXlvdXQnKS5nZXRQYW5lbCgnaW50ZXJhY3RpdmUnKS5hZGRDb250ZW50KHRoaXMuZm9ybS52aWV3KCkpO1xuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJleHBlcmltZW50XCIpIHtcblxuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubWF4TG9naW5UaW1lJykpIHtcbiAgICAgICAgICAvL3NldFRpbWVvdXQodGhpcy5fb25Mb2dvdXQsR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubWF4TG9naW5UaW1lJykqMTAwMCk7XG4gICAgICAgICAgdGhpcy5fdGltZXIuc2V0U291cmNlKG51bGwpO1xuICAgICAgICAgIHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLnJlbW92ZUNvbnRlbnQodGhpcy5mb3JtLnZpZXcoKSk7XG5cbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuXG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJCgndGl0bGUnKS50ZXh0KCksIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KFwiP1wiKVswXSk7XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IFwiYXR0ZW1wdGVkX2xvZ2luXCIsXG4gICAgICAgICAgdHlwZTogXCJub3RpY2VcIixcbiAgICAgICAgICBtZXNzYWdlOiBcIllvdSByYW4gb3V0IG9mIHRpbWUuXCJcbiAgICAgICAgfSlcblxuICAgICAgICBHbG9iYWxzLnNldCgndXNlcicsIG51bGwpO1xuICAgICAgICBHbG9iYWxzLnNldCgnc3R1ZGVudF9pZCcsIG51bGwpO1xuICAgICAgICBHbG9iYWxzLnNldCgnbG9naW5fdGltZScsbnVsbCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0hlbHAuU2hvdycsIHt9KTtcblxuICAgICAgICAvLyBIaWRlIGxvZ2luIGZvcm1cbiAgICAgICAgdGhpcy5mb3JtLmhpZGUoKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLmFkZENvbnRlbnQodGhpcy5mb3JtLnZpZXcoKSk7XG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Mb2dpblN1Ym1pdChldnQpIHtcbiAgICAgIHRoaXMuZm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgaWYgKHZhbGlkYXRpb24uaXNWYWxpZCkge1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL1N0dWRlbnRzL2xvZ2luJywge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBzb3VyY2VfaWQ6IHRoaXMuZm9ybS5leHBvcnQoKS5lbWFpbCxcbiAgICAgICAgICAgICAgc291cmNlOiAnd2ViYXBwJyxcbiAgICAgICAgICAgICAgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubWF4TG9naW5UaW1lJylcbiAgICAgICAgICAgIHx8ICEoZGF0YS5kaXNhYmxlZF9sb2dpbiA9PSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpID8gMSA6IChkYXRhLmRpc2FibGVkX2xvZ2luID09ICd0cnVlJyA/IDEgOiAwKSkpIHtcblxuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnc3R1ZGVudF9pZCcsIGRhdGEuc3R1ZGVudF9pZCk7XG4gICAgICAgICAgICAgIEdsb2JhbHMuc2V0KCd1c2VyJywgZGF0YS5zb3VyY2VfaWQpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnbG9naW5fdGltZScsbmV3IERhdGUoZGF0YS5sYXN0X2xvZ2luLiRkYXRhKSk7XG5cbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQXBwUGhhc2UuQ2hhbmdlJywgeyBwaGFzZTogXCJleHBlcmltZW50XCIgfSk7XG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0hlbHAuSGlkZScsIHt9KTtcbiAgICAgICAgICAgICAgdGhpcy5mb3JtLmNsZWFyKCk7XG5cbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2xvZ2luJyxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogJ2FwcCcsXG4gICAgICAgICAgICAgICAgZGF0YToge31cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2xvZ2luJyxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogJ2FwcCcsXG4gICAgICAgICAgICAgICAgZGF0YTogJ2F0dGVtcHRlZCBsb2dpbicsXG4gICAgICAgICAgICAgICAgc3R1ZGVudElkOiBkYXRhLnN0dWRlbnRfaWRcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgLy9HbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBcHBQaGFzZS5DaGFuZ2UnLCB7IHBoYXNlOiBcImxvZ2luXCIgfSk7XG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FwcFBoYXNlLkNoYW5nZScsIHsgcGhhc2U6IFwibG9naW5fYXR0ZW1wdGVkXCIgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfb25Mb2dvdXQoZXZ0KSB7XG5cbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX3RpbWVyLnNlZWsoMCk7XG4gICAgICB2YXIgbG9nZ2VkX3RpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS1HbG9iYWxzLmdldChcImxvZ2luX3RpbWVcIikuZ2V0VGltZSgpO1xuICAgICAgdmFyIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tYXhMb2dpblRpbWUnKSAmJiAobG9nZ2VkX3RpbWUgLyAxMDAwID49IChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tYXhMb2dpblRpbWUnKS0wLjEpKSkge1xuICAgICAgICBkaXNhYmxlZCA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJykgPyBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpIDogdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvU3R1ZGVudHMvbG9nb3V0Jywge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgc291cmNlX2lkOiBHbG9iYWxzLmdldCgndXNlcicpLFxuICAgICAgICAgIHN0dWRlbnRfaWQ6IEdsb2JhbHMuZ2V0KCdzdHVkZW50X2lkJyksXG4gICAgICAgICAgZGlzYWJsZWRfbG9naW46IGRpc2FibGVkXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCAkKCd0aXRsZScpLnRleHQoKSwgd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCI/XCIpWzBdKTtcblxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiAnbG9nb3V0JyxcbiAgICAgICAgICBjYXRlZ29yeTogJ2FwcCcsXG4gICAgICAgICAgZGF0YTogZGlzYWJsZWRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgR2xvYmFscy5zZXQoJ3VzZXInLCBudWxsKTtcbiAgICAgICAgR2xvYmFscy5zZXQoJ3N0dWRlbnRfaWQnLCBudWxsKTtcbiAgICAgICAgR2xvYmFscy5zZXQoJ2xhc3RfbG9naW4nLG51bGwpO1xuXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubWF4TG9naW5UaW1lJykgJiYgKGxvZ2dlZF90aW1lIC8gMTAwMCA+PSAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubWF4TG9naW5UaW1lJyktMC4xKSkpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQXBwUGhhc2UuQ2hhbmdlJywgeyBwaGFzZTogXCJsb2dpbl9hdHRlbXB0ZWRcIiB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FwcFBoYXNlLkNoYW5nZScsIHsgcGhhc2U6IFwibG9naW5cIiB9KTtcbiAgICAgIH1cblxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfYmVmb3JlV2luZG93Q2xvc2UoZSkge1xuICAgICAgdGhpcy5wcm9maWxlLmRpc3BhdGNoRXZlbnQoJ0xvZ2luLkxvZ291dCcse30pO1xuICAgICAgLy9pZiAoR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKSkge1xuICAgICAgLy8gIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgLy8gICAgdHlwZTogJ2xvZ291dCcsXG4gICAgICAvLyAgICBjYXRlZ29yeTogJ2FwcCcsXG4gICAgICAvLyAgICBkYXRhOiB7fVxuICAgICAgLy8gIH0pXG4gICAgICAvL31cbiAgICB9XG5cbiAgfTtcbn0pO1xuIl19
