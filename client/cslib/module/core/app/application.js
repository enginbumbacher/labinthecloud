'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Application
// ===========
// 
// Base class for an application. Handles module integration.
// 
// All modules are deal with in phases:
// 
// * `load`: All modules are loaded
// * `init`: An initialization step allows modules an opportunity to run whatever setup is necessary before the application kicks off.
// * `run`: All modules are assumed to be in a ready state, and are notified 

define(function (require) {
  var $ = require('jquery'),
      EventDispatcher = require('core/event/dispatcher'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager'),
      Globals = require('core/model/globals');

  return function (_EventDispatcher) {
    _inherits(Application, _EventDispatcher);

    // `new Application(domRoot)`

    // Constructor method. Accepts a single argument of the application's root
    // DOM element.
    function Application(domRoot) {
      _classCallCheck(this, Application);

      var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

      _this._domRoot = $(domRoot);
      Globals.set('App', _this);
      return _this;
    }

    _createClass(Application, [{
      key: '_buildModuleRequirements',
      value: function _buildModuleRequirements(module, reqSet) {
        var _this2 = this;

        if (module.requires && module.requires.length) module.requires.forEach(function (req) {
          if (!reqSet.has(req)) {
            reqSet.add(req);
            _this2._buildModuleRequirements(req, reqSet);
          }
        });
      }

      // `load()`

    }, {
      key: 'load',
      value: function load() {
        var _this3 = this;

        var promises = void 0,
            moduleClasses = void 0;
        promises = [];
        // First, the application invoke the `Application.Modules` hook to obtain
        // a set of all desired modules.
        moduleClasses = HM.invoke('Application.Modules', new Set());
        // The set is then modified to ensure any requirements are also managed
        Array.from(moduleClasses).forEach(function (mc) {
          _this3._buildModuleRequirements(mc, moduleClasses);
        });

        // Then the modules are set to load, with the promises returned from their
        // load functions stored in an array.
        this._modules = [];
        moduleClasses.forEach(function (mc) {
          var module = new mc();
          _this3._modules.push(module);
          promises.push(module.load());
        });
        // Finally, the View class load promise is created and added to the array.
        var viewClassPath = HM.invoke('Application.ViewClass', 'core/app/view');
        promises.push(Utils.promiseRequire(viewClassPath).then(function (reqs) {
          var viewClass = reqs[0];
          _this3.view = new viewClass();
          _this3._domRoot.append(_this3.view.$dom()); // REACT EDIT
          _this3.dispatchEvent('Application.ViewReady', {});
        }));
        return Promise.all(promises);
      }

      // `init()`

      // Initializes all modules.

    }, {
      key: 'init',
      value: function init() {
        return Promise.all(this._modules.map(function (pi) {
          return pi.init();
        }));
      }

      // `run()`

      // Runs the application by running all modules.

    }, {
      key: 'run',
      value: function run() {
        this._modules.forEach(function (pi) {
          return pi.run();
        });
        this.dispatchEvent('Application.Run', {});
      }
    }]);

    return Application;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2FwcC9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiJCIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwiSE0iLCJHbG9iYWxzIiwiZG9tUm9vdCIsIl9kb21Sb290Iiwic2V0IiwibW9kdWxlIiwicmVxU2V0IiwicmVxdWlyZXMiLCJsZW5ndGgiLCJmb3JFYWNoIiwicmVxIiwiaGFzIiwiYWRkIiwiX2J1aWxkTW9kdWxlUmVxdWlyZW1lbnRzIiwicHJvbWlzZXMiLCJtb2R1bGVDbGFzc2VzIiwiaW52b2tlIiwiU2V0IiwiQXJyYXkiLCJmcm9tIiwibWMiLCJfbW9kdWxlcyIsInB1c2giLCJsb2FkIiwidmlld0NsYXNzUGF0aCIsInByb21pc2VSZXF1aXJlIiwidGhlbiIsInJlcXMiLCJ2aWV3Q2xhc3MiLCJ2aWV3IiwiYXBwZW5kIiwiJGRvbSIsImRpc3BhdGNoRXZlbnQiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwicGkiLCJpbml0IiwicnVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLElBQUlELFFBQVEsUUFBUixDQUFWO0FBQUEsTUFDRUUsa0JBQWtCRixRQUFRLHVCQUFSLENBRHBCO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksS0FBS0osUUFBUSx5QkFBUixDQUhQO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaOztBQU1BO0FBQUE7O0FBQ0Y7O0FBRUE7QUFDQTtBQUNJLHlCQUFZTSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBRW5CLFlBQUtDLFFBQUwsR0FBZ0JOLEVBQUVLLE9BQUYsQ0FBaEI7QUFDQUQsY0FBUUcsR0FBUixDQUFZLEtBQVo7QUFIbUI7QUFJcEI7O0FBVEg7QUFBQTtBQUFBLCtDQVcyQkMsTUFYM0IsRUFXbUNDLE1BWG5DLEVBVzJDO0FBQUE7O0FBQ3ZDLFlBQUlELE9BQU9FLFFBQVAsSUFBbUJGLE9BQU9FLFFBQVAsQ0FBZ0JDLE1BQXZDLEVBQStDSCxPQUFPRSxRQUFQLENBQWdCRSxPQUFoQixDQUF3QixVQUFDQyxHQUFELEVBQVM7QUFDOUUsY0FBSSxDQUFDSixPQUFPSyxHQUFQLENBQVdELEdBQVgsQ0FBTCxFQUFzQjtBQUNwQkosbUJBQU9NLEdBQVAsQ0FBV0YsR0FBWDtBQUNBLG1CQUFLRyx3QkFBTCxDQUE4QkgsR0FBOUIsRUFBbUNKLE1BQW5DO0FBQ0Q7QUFDRixTQUw4QztBQU1oRDs7QUFFTDs7QUFwQkU7QUFBQTtBQUFBLDZCQXFCUztBQUFBOztBQUNMLFlBQUlRLGlCQUFKO0FBQUEsWUFBY0Msc0JBQWQ7QUFDQUQsbUJBQVcsRUFBWDtBQUNOO0FBQ0E7QUFDTUMsd0JBQWdCZixHQUFHZ0IsTUFBSCxDQUFVLHFCQUFWLEVBQWlDLElBQUlDLEdBQUosRUFBakMsQ0FBaEI7QUFDTjtBQUNNQyxjQUFNQyxJQUFOLENBQVdKLGFBQVgsRUFBMEJOLE9BQTFCLENBQWtDLFVBQUNXLEVBQUQsRUFBUTtBQUN4QyxpQkFBS1Asd0JBQUwsQ0FBOEJPLEVBQTlCLEVBQWtDTCxhQUFsQztBQUNELFNBRkQ7O0FBSU47QUFDQTtBQUNNLGFBQUtNLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQU4sc0JBQWNOLE9BQWQsQ0FBc0IsVUFBQ1csRUFBRCxFQUFRO0FBQzVCLGNBQUlmLFNBQVMsSUFBSWUsRUFBSixFQUFiO0FBQ0EsaUJBQUtDLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQmpCLE1BQW5CO0FBQ0FTLG1CQUFTUSxJQUFULENBQWNqQixPQUFPa0IsSUFBUCxFQUFkO0FBQ0QsU0FKRDtBQUtOO0FBQ00sWUFBSUMsZ0JBQWdCeEIsR0FBR2dCLE1BQUgsQ0FBVSx1QkFBVixFQUFtQyxlQUFuQyxDQUFwQjtBQUNBRixpQkFBU1EsSUFBVCxDQUFjdkIsTUFBTTBCLGNBQU4sQ0FBcUJELGFBQXJCLEVBQW9DRSxJQUFwQyxDQUF5QyxVQUFDQyxJQUFELEVBQVU7QUFDL0QsY0FBSUMsWUFBWUQsS0FBSyxDQUFMLENBQWhCO0FBQ0EsaUJBQUtFLElBQUwsR0FBWSxJQUFJRCxTQUFKLEVBQVo7QUFDQSxpQkFBS3pCLFFBQUwsQ0FBYzJCLE1BQWQsQ0FBcUIsT0FBS0QsSUFBTCxDQUFVRSxJQUFWLEVBQXJCLEVBSCtELENBR3ZCO0FBQ3hDLGlCQUFLQyxhQUFMLENBQW1CLHVCQUFuQixFQUE0QyxFQUE1QztBQUNELFNBTGEsQ0FBZDtBQU1BLGVBQU9DLFFBQVFDLEdBQVIsQ0FBWXBCLFFBQVosQ0FBUDtBQUNEOztBQUVMOztBQUVBOztBQXJERTtBQUFBO0FBQUEsNkJBc0RTO0FBQ0wsZUFBT21CLFFBQVFDLEdBQVIsQ0FBWSxLQUFLYixRQUFMLENBQWNjLEdBQWQsQ0FBa0IsVUFBQ0MsRUFBRDtBQUFBLGlCQUFRQSxHQUFHQyxJQUFILEVBQVI7QUFBQSxTQUFsQixDQUFaLENBQVA7QUFDRDs7QUFFTDs7QUFFQTs7QUE1REU7QUFBQTtBQUFBLDRCQTZEUTtBQUNKLGFBQUtoQixRQUFMLENBQWNaLE9BQWQsQ0FBc0IsVUFBQzJCLEVBQUQ7QUFBQSxpQkFBUUEsR0FBR0UsR0FBSCxFQUFSO0FBQUEsU0FBdEI7QUFDQSxhQUFLTixhQUFMLENBQW1CLGlCQUFuQixFQUFzQyxFQUF0QztBQUNEO0FBaEVIOztBQUFBO0FBQUEsSUFBaUNsQyxlQUFqQztBQWtFRCxDQXpFRCIsImZpbGUiOiJtb2R1bGUvY29yZS9hcHAvYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
