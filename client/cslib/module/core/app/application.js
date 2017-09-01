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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2FwcC9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiJCIsIkV2ZW50RGlzcGF0Y2hlciIsIlV0aWxzIiwiSE0iLCJHbG9iYWxzIiwiZG9tUm9vdCIsIl9kb21Sb290Iiwic2V0IiwibW9kdWxlIiwicmVxU2V0IiwicmVxdWlyZXMiLCJsZW5ndGgiLCJmb3JFYWNoIiwicmVxIiwiaGFzIiwiYWRkIiwiX2J1aWxkTW9kdWxlUmVxdWlyZW1lbnRzIiwicHJvbWlzZXMiLCJtb2R1bGVDbGFzc2VzIiwiaW52b2tlIiwiU2V0IiwiQXJyYXkiLCJmcm9tIiwibWMiLCJfbW9kdWxlcyIsInB1c2giLCJsb2FkIiwidmlld0NsYXNzUGF0aCIsInByb21pc2VSZXF1aXJlIiwidGhlbiIsInJlcXMiLCJ2aWV3Q2xhc3MiLCJ2aWV3IiwiYXBwZW5kIiwiJGRvbSIsImRpc3BhdGNoRXZlbnQiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwicGkiLCJpbml0IiwicnVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLElBQUlELFFBQVEsUUFBUixDQUFWO0FBQUEsTUFDRUUsa0JBQWtCRixRQUFRLHVCQUFSLENBRHBCO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksS0FBS0osUUFBUSx5QkFBUixDQUhQO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaOztBQU1BO0FBQUE7O0FBQ0Y7O0FBRUE7QUFDQTtBQUNJLHlCQUFZTSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBRW5CLFlBQUtDLFFBQUwsR0FBZ0JOLEVBQUVLLE9BQUYsQ0FBaEI7QUFDQUQsY0FBUUcsR0FBUixDQUFZLEtBQVo7QUFIbUI7QUFJcEI7O0FBVEg7QUFBQTtBQUFBLCtDQVcyQkMsTUFYM0IsRUFXbUNDLE1BWG5DLEVBVzJDO0FBQUE7O0FBQ3ZDLFlBQUlELE9BQU9FLFFBQVAsSUFBbUJGLE9BQU9FLFFBQVAsQ0FBZ0JDLE1BQXZDLEVBQStDSCxPQUFPRSxRQUFQLENBQWdCRSxPQUFoQixDQUF3QixVQUFDQyxHQUFELEVBQVM7QUFDOUUsY0FBSSxDQUFDSixPQUFPSyxHQUFQLENBQVdELEdBQVgsQ0FBTCxFQUFzQjtBQUNwQkosbUJBQU9NLEdBQVAsQ0FBV0YsR0FBWDtBQUNBLG1CQUFLRyx3QkFBTCxDQUE4QkgsR0FBOUIsRUFBbUNKLE1BQW5DO0FBQ0Q7QUFDRixTQUw4QztBQU1oRDs7QUFFTDs7QUFwQkU7QUFBQTtBQUFBLDZCQXFCUztBQUFBOztBQUNMLFlBQUlRLGlCQUFKO0FBQUEsWUFBY0Msc0JBQWQ7QUFDQUQsbUJBQVcsRUFBWDtBQUNOO0FBQ0E7QUFDTUMsd0JBQWdCZixHQUFHZ0IsTUFBSCxDQUFVLHFCQUFWLEVBQWlDLElBQUlDLEdBQUosRUFBakMsQ0FBaEI7QUFDTjtBQUNNQyxjQUFNQyxJQUFOLENBQVdKLGFBQVgsRUFBMEJOLE9BQTFCLENBQWtDLFVBQUNXLEVBQUQsRUFBUTtBQUN4QyxpQkFBS1Asd0JBQUwsQ0FBOEJPLEVBQTlCLEVBQWtDTCxhQUFsQztBQUNELFNBRkQ7O0FBSU47QUFDQTtBQUNNLGFBQUtNLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQU4sc0JBQWNOLE9BQWQsQ0FBc0IsVUFBQ1csRUFBRCxFQUFRO0FBQzVCLGNBQUlmLFNBQVMsSUFBSWUsRUFBSixFQUFiO0FBQ0EsaUJBQUtDLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQmpCLE1BQW5CO0FBQ0FTLG1CQUFTUSxJQUFULENBQWNqQixPQUFPa0IsSUFBUCxFQUFkO0FBQ0QsU0FKRDtBQUtOO0FBQ00sWUFBSUMsZ0JBQWdCeEIsR0FBR2dCLE1BQUgsQ0FBVSx1QkFBVixFQUFtQyxlQUFuQyxDQUFwQjtBQUNBRixpQkFBU1EsSUFBVCxDQUFjdkIsTUFBTTBCLGNBQU4sQ0FBcUJELGFBQXJCLEVBQW9DRSxJQUFwQyxDQUF5QyxVQUFDQyxJQUFELEVBQVU7QUFDL0QsY0FBSUMsWUFBWUQsS0FBSyxDQUFMLENBQWhCO0FBQ0EsaUJBQUtFLElBQUwsR0FBWSxJQUFJRCxTQUFKLEVBQVo7QUFDQSxpQkFBS3pCLFFBQUwsQ0FBYzJCLE1BQWQsQ0FBcUIsT0FBS0QsSUFBTCxDQUFVRSxJQUFWLEVBQXJCLEVBSCtELENBR3ZCO0FBQ3hDLGlCQUFLQyxhQUFMLENBQW1CLHVCQUFuQixFQUE0QyxFQUE1QztBQUNELFNBTGEsQ0FBZDtBQU1BLGVBQU9DLFFBQVFDLEdBQVIsQ0FBWXBCLFFBQVosQ0FBUDtBQUNEOztBQUVMOztBQUVBOztBQXJERTtBQUFBO0FBQUEsNkJBc0RTO0FBQ0wsZUFBT21CLFFBQVFDLEdBQVIsQ0FBWSxLQUFLYixRQUFMLENBQWNjLEdBQWQsQ0FBa0IsVUFBQ0MsRUFBRDtBQUFBLGlCQUFRQSxHQUFHQyxJQUFILEVBQVI7QUFBQSxTQUFsQixDQUFaLENBQVA7QUFDRDs7QUFFTDs7QUFFQTs7QUE1REU7QUFBQTtBQUFBLDRCQTZEUTtBQUNKLGFBQUtoQixRQUFMLENBQWNaLE9BQWQsQ0FBc0IsVUFBQzJCLEVBQUQ7QUFBQSxpQkFBUUEsR0FBR0UsR0FBSCxFQUFSO0FBQUEsU0FBdEI7QUFDQSxhQUFLTixhQUFMLENBQW1CLGlCQUFuQixFQUFzQyxFQUF0QztBQUNEO0FBaEVIOztBQUFBO0FBQUEsSUFBaUNsQyxlQUFqQztBQWtFRCxDQXpFRCIsImZpbGUiOiJtb2R1bGUvY29yZS9hcHAvYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBcHBsaWNhdGlvblxuLy8gPT09PT09PT09PT1cbi8vIFxuLy8gQmFzZSBjbGFzcyBmb3IgYW4gYXBwbGljYXRpb24uIEhhbmRsZXMgbW9kdWxlIGludGVncmF0aW9uLlxuLy8gXG4vLyBBbGwgbW9kdWxlcyBhcmUgZGVhbCB3aXRoIGluIHBoYXNlczpcbi8vIFxuLy8gKiBgbG9hZGA6IEFsbCBtb2R1bGVzIGFyZSBsb2FkZWRcbi8vICogYGluaXRgOiBBbiBpbml0aWFsaXphdGlvbiBzdGVwIGFsbG93cyBtb2R1bGVzIGFuIG9wcG9ydHVuaXR5IHRvIHJ1biB3aGF0ZXZlciBzZXR1cCBpcyBuZWNlc3NhcnkgYmVmb3JlIHRoZSBhcHBsaWNhdGlvbiBraWNrcyBvZmYuXG4vLyAqIGBydW5gOiBBbGwgbW9kdWxlcyBhcmUgYXNzdW1lZCB0byBiZSBpbiBhIHJlYWR5IHN0YXRlLCBhbmQgYXJlIG5vdGlmaWVkIFxuXG5kZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuICAgIEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvZGlzcGF0Y2hlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcblxuICByZXR1cm4gY2xhc3MgQXBwbGljYXRpb24gZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuLy8gYG5ldyBBcHBsaWNhdGlvbihkb21Sb290KWBcblxuLy8gQ29uc3RydWN0b3IgbWV0aG9kLiBBY2NlcHRzIGEgc2luZ2xlIGFyZ3VtZW50IG9mIHRoZSBhcHBsaWNhdGlvbidzIHJvb3Rcbi8vIERPTSBlbGVtZW50LlxuICAgIGNvbnN0cnVjdG9yKGRvbVJvb3QpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLl9kb21Sb290ID0gJChkb21Sb290KTtcbiAgICAgIEdsb2JhbHMuc2V0KCdBcHAnLCB0aGlzKTtcbiAgICB9XG5cbiAgICBfYnVpbGRNb2R1bGVSZXF1aXJlbWVudHMobW9kdWxlLCByZXFTZXQpIHtcbiAgICAgIGlmIChtb2R1bGUucmVxdWlyZXMgJiYgbW9kdWxlLnJlcXVpcmVzLmxlbmd0aCkgbW9kdWxlLnJlcXVpcmVzLmZvckVhY2goKHJlcSkgPT4ge1xuICAgICAgICBpZiAoIXJlcVNldC5oYXMocmVxKSkge1xuICAgICAgICAgIHJlcVNldC5hZGQocmVxKTtcbiAgICAgICAgICB0aGlzLl9idWlsZE1vZHVsZVJlcXVpcmVtZW50cyhyZXEsIHJlcVNldCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4vLyBgbG9hZCgpYFxuICAgIGxvYWQoKSB7XG4gICAgICBsZXQgcHJvbWlzZXMsIG1vZHVsZUNsYXNzZXM7XG4gICAgICBwcm9taXNlcyA9IFtdO1xuLy8gRmlyc3QsIHRoZSBhcHBsaWNhdGlvbiBpbnZva2UgdGhlIGBBcHBsaWNhdGlvbi5Nb2R1bGVzYCBob29rIHRvIG9idGFpblxuLy8gYSBzZXQgb2YgYWxsIGRlc2lyZWQgbW9kdWxlcy5cbiAgICAgIG1vZHVsZUNsYXNzZXMgPSBITS5pbnZva2UoJ0FwcGxpY2F0aW9uLk1vZHVsZXMnLCBuZXcgU2V0KCkpO1xuLy8gVGhlIHNldCBpcyB0aGVuIG1vZGlmaWVkIHRvIGVuc3VyZSBhbnkgcmVxdWlyZW1lbnRzIGFyZSBhbHNvIG1hbmFnZWRcbiAgICAgIEFycmF5LmZyb20obW9kdWxlQ2xhc3NlcykuZm9yRWFjaCgobWMpID0+IHtcbiAgICAgICAgdGhpcy5fYnVpbGRNb2R1bGVSZXF1aXJlbWVudHMobWMsIG1vZHVsZUNsYXNzZXMpO1xuICAgICAgfSk7XG5cbi8vIFRoZW4gdGhlIG1vZHVsZXMgYXJlIHNldCB0byBsb2FkLCB3aXRoIHRoZSBwcm9taXNlcyByZXR1cm5lZCBmcm9tIHRoZWlyXG4vLyBsb2FkIGZ1bmN0aW9ucyBzdG9yZWQgaW4gYW4gYXJyYXkuXG4gICAgICB0aGlzLl9tb2R1bGVzID0gW107XG4gICAgICBtb2R1bGVDbGFzc2VzLmZvckVhY2goKG1jKSA9PiB7XG4gICAgICAgIGxldCBtb2R1bGUgPSBuZXcgbWMoKTtcbiAgICAgICAgdGhpcy5fbW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgICAgIHByb21pc2VzLnB1c2gobW9kdWxlLmxvYWQoKSk7XG4gICAgICB9KTtcbi8vIEZpbmFsbHksIHRoZSBWaWV3IGNsYXNzIGxvYWQgcHJvbWlzZSBpcyBjcmVhdGVkIGFuZCBhZGRlZCB0byB0aGUgYXJyYXkuXG4gICAgICBsZXQgdmlld0NsYXNzUGF0aCA9IEhNLmludm9rZSgnQXBwbGljYXRpb24uVmlld0NsYXNzJywgJ2NvcmUvYXBwL3ZpZXcnKTtcbiAgICAgIHByb21pc2VzLnB1c2goVXRpbHMucHJvbWlzZVJlcXVpcmUodmlld0NsYXNzUGF0aCkudGhlbigocmVxcykgPT4ge1xuICAgICAgICBsZXQgdmlld0NsYXNzID0gcmVxc1swXTtcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IHZpZXdDbGFzcygpO1xuICAgICAgICB0aGlzLl9kb21Sb290LmFwcGVuZCh0aGlzLnZpZXcuJGRvbSgpKTsgLy8gUkVBQ1QgRURJVFxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0FwcGxpY2F0aW9uLlZpZXdSZWFkeScsIHt9KTtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuXG4vLyBgaW5pdCgpYFxuXG4vLyBJbml0aWFsaXplcyBhbGwgbW9kdWxlcy5cbiAgICBpbml0KCkge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHRoaXMuX21vZHVsZXMubWFwKChwaSkgPT4gcGkuaW5pdCgpKSk7XG4gICAgfVxuXG4vLyBgcnVuKClgXG5cbi8vIFJ1bnMgdGhlIGFwcGxpY2F0aW9uIGJ5IHJ1bm5pbmcgYWxsIG1vZHVsZXMuXG4gICAgcnVuKCkge1xuICAgICAgdGhpcy5fbW9kdWxlcy5mb3JFYWNoKChwaSkgPT4gcGkucnVuKCkpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdBcHBsaWNhdGlvbi5SdW4nLCB7fSk7XG4gICAgfVxuICB9O1xufSk7Il19
