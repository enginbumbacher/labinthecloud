'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Module
// ======

// Base class for modules. As described in the Application class, modules are
// processed in the following order: load, init, run.

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Utils = require('core/util/utils');

  return function (_EventDispatcher) {
    _inherits(Module, _EventDispatcher);

    function Module() {
      _classCallCheck(this, Module);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Module).apply(this, arguments));
    }

    _createClass(Module, [{
      key: 'load',

      // Loading returns a Promise that gets resolved when the loading process is
      // completed.
      //
      // The requirements of the loading process may be different for each
      // module, but the default assumes that there are subresources that are
      // handled in a preload stage.
      value: function load() {
        var _this2 = this;

        Utils.promiseRequire(this.listPreload()).then(function (loaded) {
          return _this2.handlePreload.apply(null, loaded);
        });
      }

      // Assuming you are using the default process, `listPreload()` should return
      // an array of Promises that will load the prerequisites.

    }, {
      key: 'listPreload',
      value: function listPreload() {
        return [];
      }

      // `handlePreload()` will then accept and make use of those prerequisites
      // accordingly.

    }, {
      key: 'handlePreload',
      value: function handlePreload() {}

      // Once the loading process is complete, modules are given a chance to run any
      // initialization they might have. Generally speeking, this is where modules
      // are expected to set up event listeners or establish hooks with the
      // HookManager.

    }, {
      key: 'init',
      value: function init() {
        return Promise.resolve(true);
      }

      // After all modules have been initialized, they are allowed to `run`. This is
      // where the module is expected to kick into action.

    }, {
      key: 'run',
      value: function run() {}
    }]);

    return Module;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2FwcC9tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxrQkFBa0IsUUFBUSx1QkFBUixDQUF4QjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7O0FBR0E7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7Ozs7Ozs7QUFBQSw2QkFPUztBQUFBOztBQUNMLGNBQU0sY0FBTixDQUFxQixLQUFLLFdBQUwsRUFBckIsRUFDRyxJQURILENBQ1EsVUFBQyxNQUFEO0FBQUEsaUJBQVksT0FBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLElBQXpCLEVBQStCLE1BQS9CLENBQVo7QUFBQSxTQURSO0FBRUQ7Ozs7O0FBVkg7QUFBQTtBQUFBLG9DQWNnQjtBQUNaLGVBQU8sRUFBUDtBQUNEOzs7OztBQWhCSDtBQUFBO0FBQUEsc0NBb0JrQixDQUFFOzs7Ozs7O0FBcEJwQjtBQUFBO0FBQUEsNkJBMEJTO0FBQ0wsZUFBTyxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEOzs7OztBQTVCSDtBQUFBO0FBQUEsNEJBZ0NRLENBQUU7QUFoQ1Y7O0FBQUE7QUFBQSxJQUE0QixlQUE1QjtBQWtDRCxDQXRDRCIsImZpbGUiOiJtb2R1bGUvY29yZS9hcHAvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
