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
<<<<<<< HEAD
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiR2xvYmFscyIsIkhNIiwiTG9naW5Gb3JtIiwiVXRpbHMiLCJUaW1lciIsIlByb2ZpbGUiLCIkIiwiYmluZE1ldGhvZHMiLCJfb25QaGFzZUNoYW5nZSIsImJpbmQiLCJfb25Mb2dpblN1Ym1pdCIsIl9vbkxvZ291dCIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJmb3JtIiwidmlldyIsInByb2ZpbGUiLCJ3aW5kb3ciLCJfYmVmb3JlV2luZG93Q2xvc2UiLCJfdGltZXIiLCJkdXJhdGlvbiIsImhvb2siLCJzdWJqZWN0IiwibWV0YSIsImlkIiwicHVzaCIsImV2dCIsImRhdGEiLCJwaGFzZSIsInVzZXJJZCIsInVybFBhcmFtIiwicHJvbWlzZUFqYXgiLCJzb3VyY2VfaWQiLCJzb3VyY2UiLCJsYWIiLCJtZXRob2QiLCJ0aGVuIiwic2V0Iiwic3R1ZGVudF9pZCIsIkRhdGUiLCJsYXN0X2xvZ2luIiwiJGRhdGEiLCJkaXNhYmxlZF9sb2dpbiIsImRpc3BhdGNoRXZlbnQiLCJjbGVhciIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ0ZXh0IiwibG9jYXRpb24iLCJocmVmIiwic3BsaXQiLCJtZXNzYWdlIiwiZ2V0UGFuZWwiLCJhZGRDb250ZW50Iiwic2V0U291cmNlIiwic3RhcnQiLCJyZW1vdmVDb250ZW50IiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwiaXNWYWxpZCIsImV4cG9ydCIsImVtYWlsIiwic3RvcCIsInNlZWsiLCJsb2dnZWRfdGltZSIsImdldFRpbWUiLCJkaXNhYmxlZCIsImNvbnNvbGUiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUs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
=======
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiR2xvYmFscyIsIkhNIiwiTG9naW5Gb3JtIiwiVXRpbHMiLCJQcm9maWxlIiwiYmluZE1ldGhvZHMiLCJfb25QaGFzZUNoYW5nZSIsImJpbmQiLCJfb25Mb2dpblN1Ym1pdCIsIl9vbkxvZ291dCIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJmb3JtIiwidmlldyIsInByb2ZpbGUiLCJ3aW5kb3ciLCJfYmVmb3JlV2luZG93Q2xvc2UiLCJob29rIiwic3ViamVjdCIsIm1ldGEiLCJpZCIsInB1c2giLCJldnQiLCJkYXRhIiwicGhhc2UiLCJ1c2VySWQiLCJ1cmxQYXJhbSIsInByb21pc2VBamF4Iiwic291cmNlX2lkIiwic291cmNlIiwibGFiIiwibWV0aG9kIiwidGhlbiIsInNldCIsInN0dWRlbnRfaWQiLCJkaXNwYXRjaEV2ZW50IiwiY2xlYXIiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJyZW1vdmVDb250ZW50IiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwiaXNWYWxpZCIsImV4cG9ydCIsImVtYWlsIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDtBQUFBLE1BR0VJLFlBQVlKLFFBQVEsYUFBUixDQUhkO0FBQUEsTUFJRUssUUFBUUwsUUFBUSxpQkFBUixDQUpWO0FBQUEsTUFLRU0sVUFBVU4sUUFBUSxnQkFBUixDQUxaOztBQVFBO0FBQUE7O0FBQ0UsMkJBQWM7QUFBQTs7QUFBQTs7QUFFWkssWUFBTUUsV0FBTixRQUF3QixDQUFDLG9CQUFE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LE1BQVosRUFBb0IsSUFBcEI7QUFDQWpDLGdCQUFRaUMsR0FBUixDQUFZLFlBQVosRUFBMEIsSUFBMUI7QUFDQWpDLGdCQUFRVSxHQUFSLENBQVksT0FBWixFQUFxQnlCLGFBQXJCLENBQW1DLGlCQUFuQyxFQUFzRCxFQUFFWCxPQUFPLE9BQVQsRUFBdEQ7QUFDRDtBQS9GSDtBQUFBO0FBQUEseUNBaUdxQndCLENBakdyQixFQWlHd0I7QUFDcEIsWUFBSWhELFFBQVFVLEdBQVIsQ0FBWSxZQUFaLENBQUosRUFBK0I7QUFDN0JWLGtCQUFRVSxHQUFSLENBQVksUUFBWixFQUFzQjJCLEdBQXRCLENBQTBCO0FBQ3hCQyxrQkFBTSxRQURrQjtBQUV4QkMsc0JBQVUsS0FGYztBQUd4QmhCLGtCQUFNO0FBSGtCLFdBQTFCO0FBS0Q7QUFDRjtBQXpHSDs7QUFBQTtBQUFBLElBQWlDeEIsTUFBakM7QUE0R0QsQ0FySEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbG9naW4vbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgTG9naW5Gb3JtID0gcmVxdWlyZSgnLi9mb3JtL2Zvcm0nKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFByb2ZpbGUgPSByZXF1aXJlKCcuL3Byb2ZpbGUvdmlldycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgTG9naW5Nb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX2JlZm9yZVdpbmRvd0Nsb3NlJ10pXG4gICAgICB0aGlzLl9vblBoYXNlQ2hhbmdlID0gdGhpcy5fb25QaGFzZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Mb2dpblN1Ym1pdCA9IHRoaXMuX29uTG9naW5TdWJtaXQuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uTG9nb3V0ID0gdGhpcy5fb25Mb2dvdXQuYmluZCh0aGlzKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgICAgdGhpcy5mb3JtID0gbmV3IExvZ2luRm9ybSgpO1xuICAgICAgdGhpcy5mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdMb2dpbi5TdWJtaXQnLCB0aGlzLl9vbkxvZ2luU3VibWl0KTtcblxuICAgICAgdGhpcy5wcm9maWxlID0gbmV3IFByb2ZpbGUoKTtcbiAgICAgIHRoaXMucHJvZmlsZS5hZGRFdmVudExpc3RlbmVyKCdMb2dpbi5Mb2dvdXQnLCB0aGlzLl9vbkxvZ291dCk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5fYmVmb3JlV2luZG93Q2xvc2UpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIChzdWJqZWN0LCBtZXRhKSA9PiB7XG4gICAgICAgIGlmIChtZXRhLmlkID09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgICAgICAgIHN1YmplY3QucHVzaCh0aGlzLnByb2ZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgICAgfSwgMTApO1xuICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIpIHtcbiAgICAgICAgY29uc3QgdXNlcklkID0gVXRpbHMudXJsUGFyYW0oJ3VpZCcpO1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvU3R1ZGVudHMvbG9naW4nLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHNvdXJjZV9pZDogdXNlcklkLFxuICAgICAgICAgICAgICBzb3VyY2U6ICdtb29rJyxcbiAgICAgICAgICAgICAgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgndXNlcicsIGRhdGEuc291cmNlX2lkKTtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdzdHVkZW50X2lkJywgZGF0YS5zdHVkZW50X2lkKTtcbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FwcFBoYXNlLkNoYW5nZScsIHsgcGhhc2U6IFwiZXhwZXJpbWVudFwiIH0pO1xuICAgICAgICAgICAgdGhpcy5mb3JtLmNsZWFyKCk7XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgICAgdHlwZTogJ2xvZ2luJyxcbiAgICAgICAgICAgICAgY2F0ZWdvcnk6ICdhcHAnLFxuICAgICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE9wZW4gaGVscFxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0hlbHAuU2hvdycsIHt9KTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBEaXNwbGF5IGxvZ2luIGZvcm1cbiAgICAgICAgICBHbG9iYWxzLmdldCgnTGF5b3V0JykuZ2V0UGFuZWwoJ2ludGVyYWN0aXZlJykuYWRkQ29udGVudCh0aGlzLmZvcm0udmlldygpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLnJlbW92ZUNvbnRlbnQodGhpcy5mb3JtLnZpZXcoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTG9naW5TdWJtaXQoZXZ0KSB7XG4gICAgICB0aGlzLmZvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIGlmICh2YWxpZGF0aW9uLmlzVmFsaWQpIHtcbiAgICAgICAgICBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9TdHVkZW50cy9sb2dpbicsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgc291cmNlX2lkOiB0aGlzLmZvcm0uZXhwb3J0KCkuZW1haWwsXG4gICAgICAgICAgICAgIHNvdXJjZTogJ3dlYmFwcCcsXG4gICAgICAgICAgICAgIGxhYjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ3VzZXInLCBkYXRhLnNvdXJjZV9pZCk7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnc3R1ZGVudF9pZCcsIGRhdGEuc3R1ZGVudF9pZCk7XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBcHBQaGFzZS5DaGFuZ2UnLCB7IHBoYXNlOiBcImV4cGVyaW1lbnRcIiB9KTtcbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0hlbHAuSGlkZScsIHt9KTtcbiAgICAgICAgICAgIHRoaXMuZm9ybS5jbGVhcigpO1xuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdsb2dpbicsXG4gICAgICAgICAgICAgIGNhdGVnb3J5OiAnYXBwJyxcbiAgICAgICAgICAgICAgZGF0YToge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX29uTG9nb3V0KGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdsb2dvdXQnLFxuICAgICAgICBjYXRlZ29yeTogJ2FwcCcsXG4gICAgICAgIGRhdGE6IHt9XG4gICAgICB9KVxuICAgICAgR2xvYmFscy5zZXQoJ3VzZXInLCBudWxsKTtcbiAgICAgIEdsb2JhbHMuc2V0KCdzdHVkZW50X2lkJywgbnVsbCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBcHBQaGFzZS5DaGFuZ2UnLCB7IHBoYXNlOiBcImxvZ2luXCIgfSk7XG4gICAgfVxuXG4gICAgX2JlZm9yZVdpbmRvd0Nsb3NlKGUpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpKSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6ICdsb2dvdXQnLFxuICAgICAgICAgIGNhdGVnb3J5OiAnYXBwJyxcbiAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICB9O1xufSk7Il19
>>>>>>> develop
