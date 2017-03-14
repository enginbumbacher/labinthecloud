'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Model
// =====
//
// A base class for models. Provides support for default-driven models

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Utils = require('core/util/utils'),
      defaults = {
    data: {},
    defaults: {}
  };

  return function (_EventDispatcher) {
    _inherits(Model, _EventDispatcher);

    // `new Model({data: {}, defaults: {}})`

    // The constructor accepts two parameters, the desired data object and the default
    // data object. The merge of these two gets set to the private `this._data` attribute.

    function Model() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Model);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this));

      settings = Utils.ensureDefaults(settings, defaults);
      _this._data = Utils.ensureDefaults(settings.data, settings.defaults);
      return _this;
    }

    // Public API
    // ----------
    //
    // `get(path, trace = false)`
    //
    // Returns the value found in `path`.
    //
    // This method drills down into `this._data` along the specified dot-separated path.

    _createClass(Model, [{
      key: 'get',
      value: function get(path) {
        var trace = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        var parts = void 0,
            target = void 0,
            targets = void 0;
        parts = path.split('.');
        target = this._data;

        if (trace) targets = [target];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var part = _step.value;

            if (target.get && typeof target.get == 'function' && target.get(part)) {
              target = target.get(part);
            } else if (target[part] !== null) {
              target = target[part];
            } else {
              target = null;
              break;
            }
            if (trace) targets.push(target);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (trace) {
          return targets;
        } else {
          return target;
        }
      }

      // `set(path, value)`

      // Sets the value to the provided dot-separated path. If elements of the path do
      // not currently exist, they are created as objects.

    }, {
      key: 'set',
      value: function set(path, value) {
        var forceEvent = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        var paths = void 0,
            target = void 0,
            part = void 0,
            old = void 0;
        if (value != this.get(path)) {
          paths = path.split('.');
          target = this._data;

          for (var i = 0; i < paths.length; i++) {
            part = paths[i];
            if (i == paths.length - 1) {
              if (target.set && typeof target.set == 'function') {
                old = target.get(part);
                target.set(part, value);
              } else {
                old = target[part];
                if (value == null) {
                  target[part] = null;
                  delete target[part];
                } else {
                  target[part] = value;
                }
              }
              this.dispatchEvent('Model.Change', { path: path, value: value, old: old }, true);
            } else {
              if (target.get && typeof target.get == 'function') {
                if (!target.get(part)) target.set(part, {});
                target = target.get(part);
              } else {
                if (!target[part]) target[part] = {};
                target = target[part];
              }
            }
          }
        } else if (forceEvent || value instanceof Array) {
          this.dispatchEvent('Model.Change', { path: path, value: value }, true);
        }
      }

      // `update(data)`

      // Wholesale update of the model's data. This will only overwrite the keys defined
      // by the provided update data object, and will not remove unrelated data.

    }, {
      key: 'update',
      value: function update(data) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            var val = data[key];
            if (key == "id" && this._data.id) {
              continue;
            }
            this._data[key] = val;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.dispatchEvent('Model.Change', { path: null, value: data }, true);
      }

      // Events
      // ------

      // `Model.Change`

      // Fires whenever a value in the model is changed via the `set` method.

    }]);

    return Model;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL21vZGVsL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUtBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxrQkFBa0IsUUFBUSx1QkFBUixDQUF4QjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFdBQVc7QUFDVCxVQUFNLEVBREc7QUFFVCxjQUFVO0FBRkQsR0FGYjs7QUFPQTtBQUFBOzs7Ozs7O0FBT0UscUJBQTJCO0FBQUEsVUFBZixRQUFlLHlEQUFKLEVBQUk7O0FBQUE7O0FBQUE7O0FBRXpCLGlCQUFXLE1BQU0sY0FBTixDQUFxQixRQUFyQixFQUErQixRQUEvQixDQUFYO0FBQ0EsWUFBSyxLQUFMLEdBQWEsTUFBTSxjQUFOLENBQXFCLFNBQVMsSUFBOUIsRUFBb0MsU0FBUyxRQUE3QyxDQUFiO0FBSHlCO0FBSTFCOzs7Ozs7Ozs7OztBQVhIO0FBQUE7QUFBQSwwQkFzQk0sSUF0Qk4sRUFzQjJCO0FBQUEsWUFBZixLQUFlLHlEQUFQLEtBQU87O0FBQ3ZCLFlBQUksY0FBSjtBQUFBLFlBQVcsZUFBWDtBQUFBLFlBQW1CLGdCQUFuQjtBQUNBLGdCQUFRLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBUjtBQUNBLGlCQUFTLEtBQUssS0FBZDs7QUFFQSxZQUFJLEtBQUosRUFBVyxVQUFVLENBQUMsTUFBRCxDQUFWOztBQUxZO0FBQUE7QUFBQTs7QUFBQTtBQU92QiwrQkFBaUIsS0FBakIsOEhBQXdCO0FBQUEsZ0JBQWYsSUFBZTs7QUFDdEIsZ0JBQUksT0FBTyxHQUFQLElBQWMsT0FBTyxPQUFPLEdBQWQsSUFBcUIsVUFBbkMsSUFBaUQsT0FBTyxHQUFQLENBQVcsSUFBWCxDQUFyRCxFQUF1RTtBQUNyRSx1QkFBUyxPQUFPLEdBQVAsQ0FBVyxJQUFYLENBQVQ7QUFDRCxhQUZELE1BRU8sSUFBSSxPQUFPLElBQVAsTUFBaUIsSUFBckIsRUFBMkI7QUFDaEMsdUJBQVMsT0FBTyxJQUFQLENBQVQ7QUFDRCxhQUZNLE1BRUE7QUFDTCx1QkFBUyxJQUFUO0FBQ0E7QUFDRDtBQUNELGdCQUFJLEtBQUosRUFBVyxRQUFRLElBQVIsQ0FBYSxNQUFiO0FBQ1o7QUFqQnNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBbUJ2QixZQUFJLEtBQUosRUFBVztBQUNULGlCQUFPLE9BQVA7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBTyxNQUFQO0FBQ0Q7QUFDRjs7Ozs7OztBQTlDSDtBQUFBO0FBQUEsMEJBc0RNLElBdEROLEVBc0RZLEtBdERaLEVBc0R1QztBQUFBLFlBQXBCLFVBQW9CLHlEQUFQLEtBQU87O0FBQ25DLFlBQUksY0FBSjtBQUFBLFlBQVcsZUFBWDtBQUFBLFlBQW1CLGFBQW5CO0FBQUEsWUFBeUIsWUFBekI7QUFDQSxZQUFJLFNBQVMsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFiLEVBQTZCO0FBQzNCLGtCQUFRLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBUjtBQUNBLG1CQUFTLEtBQUssS0FBZDs7QUFFQSxlQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxtQkFBTyxNQUFNLENBQU4sQ0FBUDtBQUNBLGdCQUFJLEtBQUssTUFBTSxNQUFOLEdBQWUsQ0FBeEIsRUFBMkI7QUFDekIsa0JBQUksT0FBTyxHQUFQLElBQWMsT0FBTyxPQUFPLEdBQWQsSUFBcUIsVUFBdkMsRUFBbUQ7QUFDakQsc0JBQU0sT0FBTyxHQUFQLENBQVcsSUFBWCxDQUFOO0FBQ0EsdUJBQU8sR0FBUCxDQUFXLElBQVgsRUFBaUIsS0FBakI7QUFDRCxlQUhELE1BR087QUFDTCxzQkFBTSxPQUFPLElBQVAsQ0FBTjtBQUNBLG9CQUFJLFNBQVMsSUFBYixFQUFtQjtBQUNqQix5QkFBTyxJQUFQLElBQWUsSUFBZjtBQUNBLHlCQUFPLE9BQU8sSUFBUCxDQUFQO0FBQ0QsaUJBSEQsTUFHTztBQUNMLHlCQUFPLElBQVAsSUFBZSxLQUFmO0FBQ0Q7QUFDRjtBQUNELG1CQUFLLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUMsRUFBRSxNQUFNLElBQVIsRUFBYyxPQUFPLEtBQXJCLEVBQTRCLEtBQUssR0FBakMsRUFBbkMsRUFBMkUsSUFBM0U7QUFDRCxhQWRELE1BY087QUFDTCxrQkFBSSxPQUFPLEdBQVAsSUFBYyxPQUFPLE9BQU8sR0FBZCxJQUFxQixVQUF2QyxFQUFtRDtBQUNqRCxvQkFBSSxDQUFDLE9BQU8sR0FBUCxDQUFXLElBQVgsQ0FBTCxFQUF1QixPQUFPLEdBQVAsQ0FBVyxJQUFYLEVBQWlCLEVBQWpCO0FBQ3ZCLHlCQUFTLE9BQU8sR0FBUCxDQUFXLElBQVgsQ0FBVDtBQUNELGVBSEQsTUFHTztBQUNMLG9CQUFJLENBQUMsT0FBTyxJQUFQLENBQUwsRUFBbUIsT0FBTyxJQUFQLElBQWUsRUFBZjtBQUNuQix5QkFBUyxPQUFPLElBQVAsQ0FBVDtBQUNEO0FBQ0Y7QUFDRjtBQUNGLFNBOUJELE1BOEJPLElBQUksY0FBYyxpQkFBaUIsS0FBbkMsRUFBMEM7QUFDL0MsZUFBSyxhQUFMLENBQW1CLGNBQW5CLEVBQW1DLEVBQUUsTUFBTSxJQUFSLEVBQWMsT0FBTyxLQUFyQixFQUFuQyxFQUFpRSxJQUFqRTtBQUNEO0FBQ0Y7Ozs7Ozs7QUF6Rkg7QUFBQTtBQUFBLDZCQWdHUyxJQWhHVCxFQWdHZTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNYLGdDQUFnQixJQUFoQixtSUFBc0I7QUFBQSxnQkFBYixHQUFhOztBQUNwQixnQkFBSSxNQUFNLEtBQUssR0FBTCxDQUFWO0FBQ0EsZ0JBQUksT0FBTyxJQUFQLElBQWUsS0FBSyxLQUFMLENBQVcsRUFBOUIsRUFBa0M7QUFDaEM7QUFDRDtBQUNELGlCQUFLLEtBQUwsQ0FBVyxHQUFYLElBQWtCLEdBQWxCO0FBQ0Q7QUFQVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVFYLGFBQUssYUFBTCxDQUFtQixjQUFuQixFQUFtQyxFQUFFLE1BQU0sSUFBUixFQUFjLE9BQU8sSUFBckIsRUFBbkMsRUFBZ0UsSUFBaEU7QUFDRDs7Ozs7Ozs7O0FBekdIOztBQUFBO0FBQUEsSUFBMkIsZUFBM0I7QUFtSEQsQ0EzSEQiLCJmaWxlIjoibW9kdWxlL2NvcmUvbW9kZWwvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
