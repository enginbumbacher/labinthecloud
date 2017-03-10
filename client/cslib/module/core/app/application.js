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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Application).call(this));

      _this._domRoot = $(domRoot);
      Globals.set('App', _this);
      return _this;
    }

    // `load()`


    _createClass(Application, [{
      key: 'load',
      value: function load() {
        var _this2 = this;

        var promises = void 0,
            moduleClasses = void 0;
        promises = [];
        // First, the application invoke the `Application.Modules` hook to obtain
        // a set of all desired modules.
        moduleClasses = HM.invoke('Application.Modules', new Set());
        // The set is then modified to ensure any first-level requirements
        // TODO: make requirements check recursive
        Array.from(moduleClasses).forEach(function (mc) {
          if (mc.requires && mc.requires.length) mc.forEach(function (req) {
            moduleClasses.add(req);
          });
        });

        // Then the modules are set to load, with the promises returned from their
        // load functions stored in an array.
        this._modules = [];
        moduleClasses.forEach(function (mc) {
          var module = new mc();
          _this2._modules.push(module);
          promises.push(module.load());
        });
        // Finally, the View class load promise is created and added to the array.
        var viewClassPath = HM.invoke('Application.ViewClass', 'core/app/view');
        promises.push(Utils.promiseRequire(viewClassPath).then(function (reqs) {
          var viewClass = reqs[0];
          _this2.view = new viewClass();
          _this2._domRoot.append(_this2.view.$dom()); // REACT EDIT
          _this2.dispatchEvent('Application.ViewReady', {});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2FwcC9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sSUFBSSxRQUFRLFFBQVIsQ0FBVjtBQUFBLE1BQ0Usa0JBQWtCLFFBQVEsdUJBQVIsQ0FEcEI7QUFBQSxNQUVFLFFBQVEsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRSxLQUFLLFFBQVEseUJBQVIsQ0FIUDtBQUFBLE1BSUUsVUFBVSxRQUFRLG9CQUFSLENBSlo7O0FBTUE7QUFBQTs7Ozs7OztBQUtFLHlCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQTs7QUFFbkIsWUFBSyxRQUFMLEdBQWdCLEVBQUUsT0FBRixDQUFoQjtBQUNBLGNBQVEsR0FBUixDQUFZLEtBQVo7QUFIbUI7QUFJcEI7Ozs7O0FBVEg7QUFBQTtBQUFBLDZCQVlTO0FBQUE7O0FBQ0wsWUFBSSxpQkFBSjtBQUFBLFlBQWMsc0JBQWQ7QUFDQSxtQkFBVyxFQUFYOzs7QUFHQSx3QkFBZ0IsR0FBRyxNQUFILENBQVUscUJBQVYsRUFBaUMsSUFBSSxHQUFKLEVBQWpDLENBQWhCOzs7QUFHQSxjQUFNLElBQU4sQ0FBVyxhQUFYLEVBQTBCLE9BQTFCLENBQWtDLFVBQUMsRUFBRCxFQUFRO0FBQ3hDLGNBQUksR0FBRyxRQUFILElBQWUsR0FBRyxRQUFILENBQVksTUFBL0IsRUFBdUMsR0FBRyxPQUFILENBQVcsVUFBQyxHQUFELEVBQVM7QUFDekQsMEJBQWMsR0FBZCxDQUFrQixHQUFsQjtBQUNELFdBRnNDO0FBR3hDLFNBSkQ7Ozs7QUFRQSxhQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxzQkFBYyxPQUFkLENBQXNCLFVBQUMsRUFBRCxFQUFRO0FBQzVCLGNBQUksU0FBUyxJQUFJLEVBQUosRUFBYjtBQUNBLGlCQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLE1BQW5CO0FBQ0EsbUJBQVMsSUFBVCxDQUFjLE9BQU8sSUFBUCxFQUFkO0FBQ0QsU0FKRDs7QUFNQSxZQUFJLGdCQUFnQixHQUFHLE1BQUgsQ0FBVSx1QkFBVixFQUFtQyxlQUFuQyxDQUFwQjtBQUNBLGlCQUFTLElBQVQsQ0FBYyxNQUFNLGNBQU4sQ0FBcUIsYUFBckIsRUFBb0MsSUFBcEMsQ0FBeUMsVUFBQyxJQUFELEVBQVU7QUFDL0QsY0FBSSxZQUFZLEtBQUssQ0FBTCxDQUFoQjtBQUNBLGlCQUFLLElBQUwsR0FBWSxJQUFJLFNBQUosRUFBWjtBQUNBLGlCQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLE9BQUssSUFBTCxDQUFVLElBQVYsRUFBckIsRTtBQUNBLGlCQUFLLGFBQUwsQ0FBbUIsdUJBQW5CLEVBQTRDLEVBQTVDO0FBQ0QsU0FMYSxDQUFkO0FBTUEsZUFBTyxRQUFRLEdBQVIsQ0FBWSxRQUFaLENBQVA7QUFDRDs7Ozs7O0FBM0NIO0FBQUE7QUFBQSw2QkFnRFM7QUFDTCxlQUFPLFFBQVEsR0FBUixDQUFZLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0IsVUFBQyxFQUFEO0FBQUEsaUJBQVEsR0FBRyxJQUFILEVBQVI7QUFBQSxTQUFsQixDQUFaLENBQVA7QUFDRDs7Ozs7O0FBbERIO0FBQUE7QUFBQSw0QkF1RFE7QUFDSixhQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLFVBQUMsRUFBRDtBQUFBLGlCQUFRLEdBQUcsR0FBSCxFQUFSO0FBQUEsU0FBdEI7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLEVBQXNDLEVBQXRDO0FBQ0Q7QUExREg7O0FBQUE7QUFBQSxJQUFpQyxlQUFqQztBQTRERCxDQW5FRCIsImZpbGUiOiJtb2R1bGUvY29yZS9hcHAvYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
