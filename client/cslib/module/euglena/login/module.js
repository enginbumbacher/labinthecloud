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
      Profile = require('./profile/view');

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
              Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
              _this3.form.clear();
              Globals.get('Logger').log({
                type: 'login',
                category: 'app',
                data: {}
              });
            });
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
              Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
              Globals.get('Relay').dispatchEvent('Help.Hide', {});
              _this4.form.clear();
              Globals.get('Logger').log({
                type: 'login',
                category: 'app',
                data: {}
              });
            });
          }
        });
      }
    }, {
      key: '_onLogout',
      value: function _onLogout(evt) {
        Globals.get('Logger').log({
          type: 'logout',
          category: 'app',
          data: {}
        });
        Globals.set('user', null);
        Globals.set('student_id', null);
        Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
      }
    }, {
      key: '_beforeWindowClose',
      value: function _beforeWindowClose(e) {
        if (Globals.get('student_id')) {
          Globals.get('Logger').log({
            type: 'logout',
            category: 'app',
            data: {}
          });
        }
      }
    }]);

    return LoginModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiR2xvYmFscyIsIkhNIiwiTG9naW5Gb3JtIiwiVXRpbHMiLCJQcm9maWxlIiwiYmluZE1ldGhvZHMiLCJfb25QaGFzZUNoYW5nZSIsImJpbmQiLCJfb25Mb2dpblN1Ym1pdCIsIl9vbkxvZ291dCIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJmb3JtIiwidmlldyIsInByb2ZpbGUiLCJ3aW5kb3ciLCJfYmVmb3JlV2luZG93Q2xvc2UiLCJob29rIiwic3ViamVjdCIsIm1ldGEiLCJpZCIsInB1c2giLCJldnQiLCJkYXRhIiwicGhhc2UiLCJ1c2VySWQiLCJ1cmxQYXJhbSIsInByb21pc2VBamF4Iiwic291cmNlX2lkIiwic291cmNlIiwibGFiIiwibWV0aG9kIiwidGhlbiIsInNldCIsInN0dWRlbnRfaWQiLCJkaXNwYXRjaEV2ZW50IiwiY2xlYXIiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJyZW1vdmVDb250ZW50IiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwiaXNWYWxpZCIsImV4cG9ydCIsImVtYWlsIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDtBQUFBLE1BR0VJLFlBQVlKLFFBQVEsYUFBUixDQUhkO0FBQUEsTUFJRUssUUFBUUwsUUFBUSxpQkFBUixDQUpWO0FBQUEsTUFLRU0sVUFBVU4sUUFBUSxnQkFBUixDQUxaOztBQVFBO0FBQUE7O0FBQ0UsMkJBQWM7QUFBQTs7QUFBQTs7QUFFWkssWUFBTUUsV0FBTixRQUF3QixDQUFDLG9CQUFE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LE1BQVosRUFBb0IsSUFBcEI7QUFDQWpDLGdCQUFRaUMsR0FBUixDQUFZLFlBQVosRUFBMEIsSUFBMUI7QUFDQWpDLGdCQUFRVSxHQUFSLENBQVksT0FBWixFQUFxQnlCLGFBQXJCLENBQW1DLGlCQUFuQyxFQUFzRCxFQUFFWCxPQUFPLE9BQVQsRUFBdEQ7QUFDRDtBQS9GSDtBQUFBO0FBQUEseUNBaUdxQndCLENBakdyQixFQWlHd0I7QUFDcEIsWUFBSWhELFFBQVFVLEdBQVIsQ0FBWSxZQUFaLENBQUosRUFBK0I7QUFDN0JWLGtCQUFRVSxHQUFSLENBQVksUUFBWixFQUFzQjJCLEdBQXRCLENBQTBCO0FBQ3hCQyxrQkFBTSxRQURrQjtBQUV4QkMsc0JBQVUsS0FGYztBQUd4QmhCLGtCQUFNO0FBSGtCLFdBQTFCO0FBS0Q7QUFDRjtBQXpHSDs7QUFBQTtBQUFBLElBQWlDeEIsTUFBakM7QUE0R0QsQ0FySEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbG9naW4vbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgTG9naW5Gb3JtID0gcmVxdWlyZSgnLi9mb3JtL2Zvcm0nKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFByb2ZpbGUgPSByZXF1aXJlKCcuL3Byb2ZpbGUvdmlldycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgTG9naW5Nb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX2JlZm9yZVdpbmRvd0Nsb3NlJ10pXG4gICAgICB0aGlzLl9vblBoYXNlQ2hhbmdlID0gdGhpcy5fb25QaGFzZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Mb2dpblN1Ym1pdCA9IHRoaXMuX29uTG9naW5TdWJtaXQuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uTG9nb3V0ID0gdGhpcy5fb25Mb2dvdXQuYmluZCh0aGlzKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgICAgdGhpcy5mb3JtID0gbmV3IExvZ2luRm9ybSgpO1xuICAgICAgdGhpcy5mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdMb2dpbi5TdWJtaXQnLCB0aGlzLl9vbkxvZ2luU3VibWl0KTtcblxuICAgICAgdGhpcy5wcm9maWxlID0gbmV3IFByb2ZpbGUoKTtcbiAgICAgIHRoaXMucHJvZmlsZS5hZGRFdmVudExpc3RlbmVyKCdMb2dpbi5Mb2dvdXQnLCB0aGlzLl9vbkxvZ291dCk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdGhpcy5fYmVmb3JlV2luZG93Q2xvc2UpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIChzdWJqZWN0LCBtZXRhKSA9PiB7XG4gICAgICAgIGlmIChtZXRhLmlkID09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgICAgICAgIHN1YmplY3QucHVzaCh0aGlzLnByb2ZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgICAgfSwgMTApO1xuICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIpIHtcbiAgICAgICAgY29uc3QgdXNlcklkID0gVXRpbHMudXJsUGFyYW0oJ3VpZCcpO1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvU3R1ZGVudHMvbG9naW4nLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHNvdXJjZV9pZDogdXNlcklkLFxuICAgICAgICAgICAgICBzb3VyY2U6ICdtb29rJyxcbiAgICAgICAgICAgICAgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgndXNlcicsIGRhdGEuc291cmNlX2lkKTtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdzdHVkZW50X2lkJywgZGF0YS5zdHVkZW50X2lkKTtcbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FwcFBoYXNlLkNoYW5nZScsIHsgcGhhc2U6IFwiZXhwZXJpbWVudFwiIH0pO1xuICAgICAgICAgICAgdGhpcy5mb3JtLmNsZWFyKCk7XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgICAgdHlwZTogJ2xvZ2luJyxcbiAgICAgICAgICAgICAgY2F0ZWdvcnk6ICdhcHAnLFxuICAgICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE9wZW4gaGVscFxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0hlbHAuU2hvdycsIHt9KTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBEaXNwbGF5IGxvZ2luIGZvcm1cbiAgICAgICAgICBHbG9iYWxzLmdldCgnTGF5b3V0JykuZ2V0UGFuZWwoJ2ludGVyYWN0aXZlJykuYWRkQ29udGVudCh0aGlzLmZvcm0udmlldygpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdpbnRlcmFjdGl2ZScpLnJlbW92ZUNvbnRlbnQodGhpcy5mb3JtLnZpZXcoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTG9naW5TdWJtaXQoZXZ0KSB7XG4gICAgICB0aGlzLmZvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIGlmICh2YWxpZGF0aW9uLmlzVmFsaWQpIHtcbiAgICAgICAgICBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9TdHVkZW50cy9sb2dpbicsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgc291cmNlX2lkOiB0aGlzLmZvcm0uZXhwb3J0KCkuZW1haWwsXG4gICAgICAgICAgICAgIHNvdXJjZTogJ3dlYmFwcCcsXG4gICAgICAgICAgICAgIGxhYjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ3VzZXInLCBkYXRhLnNvdXJjZV9pZCk7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnc3R1ZGVudF9pZCcsIGRhdGEuc3R1ZGVudF9pZCk7XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBcHBQaGFzZS5DaGFuZ2UnLCB7IHBoYXNlOiBcImV4cGVyaW1lbnRcIiB9KTtcbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0hlbHAuSGlkZScsIHt9KTtcbiAgICAgICAgICAgIHRoaXMuZm9ybS5jbGVhcigpO1xuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdsb2dpbicsXG4gICAgICAgICAgICAgIGNhdGVnb3J5OiAnYXBwJyxcbiAgICAgICAgICAgICAgZGF0YToge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX29uTG9nb3V0KGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdsb2dvdXQnLFxuICAgICAgICBjYXRlZ29yeTogJ2FwcCcsXG4gICAgICAgIGRhdGE6IHt9XG4gICAgICB9KVxuICAgICAgR2xvYmFscy5zZXQoJ3VzZXInLCBudWxsKTtcbiAgICAgIEdsb2JhbHMuc2V0KCdzdHVkZW50X2lkJywgbnVsbCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBcHBQaGFzZS5DaGFuZ2UnLCB7IHBoYXNlOiBcImxvZ2luXCIgfSk7XG4gICAgfVxuXG4gICAgX2JlZm9yZVdpbmRvd0Nsb3NlKGUpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpKSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6ICdsb2dvdXQnLFxuICAgICAgICAgIGNhdGVnb3J5OiAnYXBwJyxcbiAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICB9O1xufSk7Il19
