'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LoginModule).call(this));

      _this._onPhaseChange = _this._onPhaseChange.bind(_this);
      _this._onLoginSubmit = _this._onLoginSubmit.bind(_this);
      _this._onLogout = _this._onLogout.bind(_this);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      _this.form = new LoginForm();
      _this.form.view().addEventListener('Login.Submit', _this._onLoginSubmit);

      _this.profile = new Profile();
      _this.profile.addEventListener('Login.Logout', _this._onLogout);
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
                source: 'mook'
              },
              method: 'POST'
            }).then(function (data) {
              Globals.set('user', data.source_id);
              Globals.set('user_id', data.user_id);
              Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
              _this3.form.clear();
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
                source: 'webapp'
              },
              method: 'POST'
            }).then(function (data) {
              Globals.set('user', data.source_id);
              Globals.set('user_id', data.user_id);
              Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
              Globals.get('Relay').dispatchEvent('Help.Hide', {});
              _this4.form.clear();
            });
          }
        });
      }
    }, {
      key: '_onLogout',
      value: function _onLogout(evt) {
        Globals.set('user', null);
        Globals.set('user_id', null);
        Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
      }
    }]);

    return LoginModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL21vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFNBQVMsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRSxVQUFVLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUUsS0FBSyxRQUFRLHlCQUFSLENBRlA7QUFBQSxNQUdFLFlBQVksUUFBUSxhQUFSLENBSGQ7QUFBQSxNQUlFLFFBQVEsUUFBUSxpQkFBUixDQUpWO0FBQUEsTUFLRSxVQUFVLFFBQVEsZ0JBQVIsQ0FMWjs7QUFRQTtBQUFBOztBQUNFLDJCQUFjO0FBQUE7O0FBQUE7O0FBRVosWUFBSyxjQUFMLEdBQXNCLE1BQUssY0FBTCxDQUFvQixJQUFwQixPQUF0QjtBQUNBLFlBQUssY0FBTCxHQUFzQixNQUFLLGNBQUwsQ0FBb0IsSUFBcEIsT0FBdEI7QUFDQSxZQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQUNBLGNBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLLGNBQTlEO0FBQ0EsWUFBSyxJQUFMLEdBQVksSUFBSSxTQUFKLEVBQVo7QUFDQSxZQUFLLElBQUwsQ0FBVSxJQUFWLEdBQWlCLGdCQUFqQixDQUFrQyxjQUFsQyxFQUFrRCxNQUFLLGNBQXZEOztBQUVBLFlBQUssT0FBTCxHQUFlLElBQUksT0FBSixFQUFmO0FBQ0EsWUFBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBOEIsY0FBOUIsRUFBOEMsTUFBSyxTQUFuRDtBQVZZO0FBV2I7O0FBWkg7QUFBQTtBQUFBLDZCQWNTO0FBQUE7O0FBQ0wsV0FBRyxJQUFILENBQVEsZ0JBQVIsRUFBMEIsVUFBQyxPQUFELEVBQVUsSUFBVixFQUFtQjtBQUMzQyxjQUFJLEtBQUssRUFBTCxJQUFXLGFBQWYsRUFBOEI7QUFDNUIsb0JBQVEsSUFBUixDQUFhLE9BQUssT0FBbEI7QUFDRDtBQUNELGlCQUFPLE9BQVA7QUFDRCxTQUxELEVBS0csRUFMSDtBQU1EO0FBckJIO0FBQUE7QUFBQSxxQ0F1QmlCLEdBdkJqQixFQXVCc0I7QUFBQTs7QUFDbEIsWUFBSSxJQUFJLElBQUosQ0FBUyxLQUFULElBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGNBQU0sU0FBUyxNQUFNLFFBQU4sQ0FBZSxLQUFmLENBQWY7QUFDQSxjQUFJLE1BQUosRUFBWTtBQUNWLGtCQUFNLFdBQU4sQ0FBa0Isd0JBQWxCLEVBQTRDO0FBQzFDLG9CQUFNO0FBQ0osMkJBQVcsTUFEUDtBQUVKLHdCQUFRO0FBRkosZUFEb0M7QUFLMUMsc0JBQVE7QUFMa0MsYUFBNUMsRUFNRyxJQU5ILENBTVEsVUFBQyxJQUFELEVBQVU7QUFDaEIsc0JBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsS0FBSyxTQUF6QjtBQUNBLHNCQUFRLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLEtBQUssT0FBNUI7QUFDQSxzQkFBUSxHQUFSLENBQVksT0FBWixFQUFxQixhQUFyQixDQUFtQyxpQkFBbkMsRUFBc0QsRUFBRSxPQUFPLFlBQVQsRUFBdEQ7QUFDQSxxQkFBSyxJQUFMLENBQVUsS0FBVjtBQUNELGFBWEQ7QUFZRCxXQWJELE1BYU87O0FBRUwsb0JBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsYUFBckIsQ0FBbUMsV0FBbkMsRUFBZ0QsRUFBaEQ7OztBQUdBLG9CQUFRLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLFFBQXRCLENBQStCLGFBQS9CLEVBQThDLFVBQTlDLENBQXlELEtBQUssSUFBTCxDQUFVLElBQVYsRUFBekQ7QUFDRDtBQUNGLFNBdEJELE1Bc0JPO0FBQ0wsa0JBQVEsR0FBUixDQUFZLFFBQVosRUFBc0IsUUFBdEIsQ0FBK0IsYUFBL0IsRUFBOEMsYUFBOUMsQ0FBNEQsS0FBSyxJQUFMLENBQVUsSUFBVixFQUE1RDtBQUNEO0FBQ0Y7QUFqREg7QUFBQTtBQUFBLHFDQW1EaUIsR0FuRGpCLEVBbURzQjtBQUFBOztBQUNsQixhQUFLLElBQUwsQ0FBVSxRQUFWLEdBQXFCLElBQXJCLENBQTBCLFVBQUMsVUFBRCxFQUFnQjtBQUN4QyxjQUFJLFdBQVcsT0FBZixFQUF3QjtBQUN0QixrQkFBTSxXQUFOLENBQWtCLHdCQUFsQixFQUE0QztBQUMxQyxvQkFBTTtBQUNKLDJCQUFXLE9BQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsS0FEMUI7QUFFSix3QkFBUTtBQUZKLGVBRG9DO0FBSzFDLHNCQUFRO0FBTGtDLGFBQTVDLEVBTUcsSUFOSCxDQU1RLFVBQUMsSUFBRCxFQUFVO0FBQ2hCLHNCQUFRLEdBQVIsQ0FBWSxNQUFaLEVBQW9CLEtBQUssU0FBekI7QUFDQSxzQkFBUSxHQUFSLENBQVksU0FBWixFQUF1QixLQUFLLE9BQTVCO0FBQ0Esc0JBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsYUFBckIsQ0FBbUMsaUJBQW5DLEVBQXNELEVBQUUsT0FBTyxZQUFULEVBQXREO0FBQ0Esc0JBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsYUFBckIsQ0FBbUMsV0FBbkMsRUFBZ0QsRUFBaEQ7QUFDQSxxQkFBSyxJQUFMLENBQVUsS0FBVjtBQUNELGFBWkQ7QUFhRDtBQUNGLFNBaEJEO0FBaUJEO0FBckVIO0FBQUE7QUFBQSxnQ0F1RVksR0F2RVosRUF1RWlCO0FBQ2IsZ0JBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsSUFBcEI7QUFDQSxnQkFBUSxHQUFSLENBQVksU0FBWixFQUF1QixJQUF2QjtBQUNBLGdCQUFRLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLGFBQXJCLENBQW1DLGlCQUFuQyxFQUFzRCxFQUFFLE9BQU8sT0FBVCxFQUF0RDtBQUNEO0FBM0VIOztBQUFBO0FBQUEsSUFBaUMsTUFBakM7QUE4RUQsQ0F2RkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbG9naW4vbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
