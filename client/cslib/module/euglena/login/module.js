'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Globals = require('core/model/globals'),
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
      key: 'run',
      value: function run() {
        Globals.get('Layout.panels.left').addChild(this.profile);
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        var _this2 = this;

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
              _this2.form.clear();
            });
          } else {
            // Open help
            Globals.get('Relay').dispatchEvent('Help.Show', {});

            // Display login form
            Globals.get('Layout.panels.left').addChild(this.form.view());
          }
        } else {
          Globals.get('Layout.panels.left').removeChild(this.form.view());
        }
      }
    }, {
      key: '_onLoginSubmit',
      value: function _onLoginSubmit(evt) {
        var _this3 = this;

        this.form.validate().then(function (validation) {
          if (validation.isValid) {
            Utils.promiseAjax('/api/v1/Students/login', {
              data: {
                source_id: _this3.form.export().email,
                source: 'webapp'
              },
              method: 'POST'
            }).then(function (data) {
              Globals.set('user', data.source_id);
              Globals.set('user_id', data.user_id);
              Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "experiment" });
              _this3.form.clear();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL21vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFNBQVMsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRSxVQUFVLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUUsWUFBWSxRQUFRLGFBQVIsQ0FGZDtBQUFBLE1BR0UsUUFBUSxRQUFRLGlCQUFSLENBSFY7QUFBQSxNQUlFLFVBQVUsUUFBUSxnQkFBUixDQUpaOztBQU9BO0FBQUE7O0FBQ0UsMkJBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFLLGNBQUwsR0FBc0IsTUFBSyxjQUFMLENBQW9CLElBQXBCLE9BQXRCO0FBQ0EsWUFBSyxjQUFMLEdBQXNCLE1BQUssY0FBTCxDQUFvQixJQUFwQixPQUF0QjtBQUNBLFlBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCO0FBQ0EsY0FBUSxHQUFSLENBQVksT0FBWixFQUFxQixnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUssY0FBOUQ7QUFDQSxZQUFLLElBQUwsR0FBWSxJQUFJLFNBQUosRUFBWjtBQUNBLFlBQUssSUFBTCxDQUFVLElBQVYsR0FBaUIsZ0JBQWpCLENBQWtDLGNBQWxDLEVBQWtELE1BQUssY0FBdkQ7O0FBRUEsWUFBSyxPQUFMLEdBQWUsSUFBSSxPQUFKLEVBQWY7QUFDQSxZQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUE4QixjQUE5QixFQUE4QyxNQUFLLFNBQW5EO0FBVlk7QUFXYjs7QUFaSDtBQUFBO0FBQUEsNEJBY1E7QUFDSixnQkFBUSxHQUFSLENBQVksb0JBQVosRUFBa0MsUUFBbEMsQ0FBMkMsS0FBSyxPQUFoRDtBQUNEO0FBaEJIO0FBQUE7QUFBQSxxQ0FrQmlCLEdBbEJqQixFQWtCc0I7QUFBQTs7QUFDbEIsWUFBSSxJQUFJLElBQUosQ0FBUyxLQUFULElBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGNBQU0sU0FBUyxNQUFNLFFBQU4sQ0FBZSxLQUFmLENBQWY7QUFDQSxjQUFJLE1BQUosRUFBWTtBQUNWLGtCQUFNLFdBQU4sQ0FBa0Isd0JBQWxCLEVBQTRDO0FBQzFDLG9CQUFNO0FBQ0osMkJBQVcsTUFEUDtBQUVKLHdCQUFRO0FBRkosZUFEb0M7QUFLMUMsc0JBQVE7QUFMa0MsYUFBNUMsRUFNRyxJQU5ILENBTVEsVUFBQyxJQUFELEVBQVU7QUFDaEIsc0JBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsS0FBSyxTQUF6QjtBQUNBLHNCQUFRLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLEtBQUssT0FBNUI7QUFDQSxzQkFBUSxHQUFSLENBQVksT0FBWixFQUFxQixhQUFyQixDQUFtQyxpQkFBbkMsRUFBc0QsRUFBRSxPQUFPLFlBQVQsRUFBdEQ7QUFDQSxxQkFBSyxJQUFMLENBQVUsS0FBVjtBQUNELGFBWEQ7QUFZRCxXQWJELE1BYU87O0FBRUwsb0JBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsYUFBckIsQ0FBbUMsV0FBbkMsRUFBZ0QsRUFBaEQ7OztBQUdBLG9CQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxRQUFsQyxDQUEyQyxLQUFLLElBQUwsQ0FBVSxJQUFWLEVBQTNDO0FBQ0Q7QUFDRixTQXRCRCxNQXNCTztBQUNMLGtCQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxXQUFsQyxDQUE4QyxLQUFLLElBQUwsQ0FBVSxJQUFWLEVBQTlDO0FBQ0Q7QUFDRjtBQTVDSDtBQUFBO0FBQUEscUNBOENpQixHQTlDakIsRUE4Q3NCO0FBQUE7O0FBQ2xCLGFBQUssSUFBTCxDQUFVLFFBQVYsR0FBcUIsSUFBckIsQ0FBMEIsVUFBQyxVQUFELEVBQWdCO0FBQ3hDLGNBQUksV0FBVyxPQUFmLEVBQXdCO0FBQ3RCLGtCQUFNLFdBQU4sQ0FBa0Isd0JBQWxCLEVBQTRDO0FBQzFDLG9CQUFNO0FBQ0osMkJBQVcsT0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixLQUQxQjtBQUVKLHdCQUFRO0FBRkosZUFEb0M7QUFLMUMsc0JBQVE7QUFMa0MsYUFBNUMsRUFNRyxJQU5ILENBTVEsVUFBQyxJQUFELEVBQVU7QUFDaEIsc0JBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsS0FBSyxTQUF6QjtBQUNBLHNCQUFRLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLEtBQUssT0FBNUI7QUFDQSxzQkFBUSxHQUFSLENBQVksT0FBWixFQUFxQixhQUFyQixDQUFtQyxpQkFBbkMsRUFBc0QsRUFBRSxPQUFPLFlBQVQsRUFBdEQ7QUFDQSxxQkFBSyxJQUFMLENBQVUsS0FBVjtBQUNELGFBWEQ7QUFZRDtBQUNGLFNBZkQ7QUFnQkQ7QUEvREg7QUFBQTtBQUFBLGdDQWlFWSxHQWpFWixFQWlFaUI7QUFDYixnQkFBUSxHQUFSLENBQVksTUFBWixFQUFvQixJQUFwQjtBQUNBLGdCQUFRLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLElBQXZCO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsYUFBckIsQ0FBbUMsaUJBQW5DLEVBQXNELEVBQUUsT0FBTyxPQUFULEVBQXREO0FBQ0Q7QUFyRUg7O0FBQUE7QUFBQSxJQUFpQyxNQUFqQztBQXdFRCxDQWhGRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9sb2dpbi9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
