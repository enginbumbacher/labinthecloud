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
            } else if (target[part]) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL21vZGVsL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUtBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxrQkFBa0IsUUFBUSx1QkFBUixDQUF4QjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFdBQVc7QUFDVCxVQUFNLEVBREc7QUFFVCxjQUFVO0FBRkQsR0FGYjs7QUFPQTtBQUFBOzs7Ozs7O0FBT0UscUJBQTJCO0FBQUEsVUFBZixRQUFlLHlEQUFKLEVBQUk7O0FBQUE7O0FBQUE7O0FBRXpCLGlCQUFXLE1BQU0sY0FBTixDQUFxQixRQUFyQixFQUErQixRQUEvQixDQUFYO0FBQ0EsWUFBSyxLQUFMLEdBQWEsTUFBTSxjQUFOLENBQXFCLFNBQVMsSUFBOUIsRUFBb0MsU0FBUyxRQUE3QyxDQUFiO0FBSHlCO0FBSTFCOzs7Ozs7Ozs7OztBQVhIO0FBQUE7QUFBQSwwQkFzQk0sSUF0Qk4sRUFzQjJCO0FBQUEsWUFBZixLQUFlLHlEQUFQLEtBQU87O0FBQ3ZCLFlBQUksY0FBSjtBQUFBLFlBQVcsZUFBWDtBQUFBLFlBQW1CLGdCQUFuQjtBQUNBLGdCQUFRLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBUjtBQUNBLGlCQUFTLEtBQUssS0FBZDs7QUFFQSxZQUFJLEtBQUosRUFBVyxVQUFVLENBQUMsTUFBRCxDQUFWOztBQUxZO0FBQUE7QUFBQTs7QUFBQTtBQU92QiwrQkFBaUIsS0FBakIsOEhBQXdCO0FBQUEsZ0JBQWYsSUFBZTs7QUFDdEIsZ0JBQUksT0FBTyxHQUFQLElBQWMsT0FBTyxPQUFPLEdBQWQsSUFBcUIsVUFBbkMsSUFBaUQsT0FBTyxHQUFQLENBQVcsSUFBWCxDQUFyRCxFQUF1RTtBQUNyRSx1QkFBUyxPQUFPLEdBQVAsQ0FBVyxJQUFYLENBQVQ7QUFDRCxhQUZELE1BRU8sSUFBSSxPQUFPLElBQVAsQ0FBSixFQUFrQjtBQUN2Qix1QkFBUyxPQUFPLElBQVAsQ0FBVDtBQUNELGFBRk0sTUFFQTtBQUNMLHVCQUFTLElBQVQ7QUFDQTtBQUNEO0FBQ0QsZ0JBQUksS0FBSixFQUFXLFFBQVEsSUFBUixDQUFhLE1BQWI7QUFDWjtBQWpCc0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFtQnZCLFlBQUksS0FBSixFQUFXO0FBQ1QsaUJBQU8sT0FBUDtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLE1BQVA7QUFDRDtBQUNGOzs7Ozs7O0FBOUNIO0FBQUE7QUFBQSwwQkFzRE0sSUF0RE4sRUFzRFksS0F0RFosRUFzRHVDO0FBQUEsWUFBcEIsVUFBb0IseURBQVAsS0FBTzs7QUFDbkMsWUFBSSxjQUFKO0FBQUEsWUFBVyxlQUFYO0FBQUEsWUFBbUIsYUFBbkI7QUFBQSxZQUF5QixZQUF6QjtBQUNBLFlBQUksU0FBUyxLQUFLLEdBQUwsQ0FBUyxJQUFULENBQWIsRUFBNkI7QUFDM0Isa0JBQVEsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFSO0FBQ0EsbUJBQVMsS0FBSyxLQUFkOztBQUVBLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ3JDLG1CQUFPLE1BQU0sQ0FBTixDQUFQO0FBQ0EsZ0JBQUksS0FBSyxNQUFNLE1BQU4sR0FBZSxDQUF4QixFQUEyQjtBQUN6QixrQkFBSSxPQUFPLEdBQVAsSUFBYyxPQUFPLE9BQU8sR0FBZCxJQUFxQixVQUF2QyxFQUFtRDtBQUNqRCxzQkFBTSxPQUFPLEdBQVAsQ0FBVyxJQUFYLENBQU47QUFDQSx1QkFBTyxHQUFQLENBQVcsSUFBWCxFQUFpQixLQUFqQjtBQUNELGVBSEQsTUFHTztBQUNMLHNCQUFNLE9BQU8sSUFBUCxDQUFOO0FBQ0Esb0JBQUksU0FBUyxJQUFiLEVBQW1CO0FBQ2pCLHlCQUFPLElBQVAsSUFBZSxJQUFmO0FBQ0EseUJBQU8sT0FBTyxJQUFQLENBQVA7QUFDRCxpQkFIRCxNQUdPO0FBQ0wseUJBQU8sSUFBUCxJQUFlLEtBQWY7QUFDRDtBQUNGO0FBQ0QsbUJBQUssYUFBTCxDQUFtQixjQUFuQixFQUFtQyxFQUFFLE1BQU0sSUFBUixFQUFjLE9BQU8sS0FBckIsRUFBNEIsS0FBSyxHQUFqQyxFQUFuQyxFQUEyRSxJQUEzRTtBQUNELGFBZEQsTUFjTztBQUNMLGtCQUFJLE9BQU8sR0FBUCxJQUFjLE9BQU8sT0FBTyxHQUFkLElBQXFCLFVBQXZDLEVBQW1EO0FBQ2pELG9CQUFJLENBQUMsT0FBTyxHQUFQLENBQVcsSUFBWCxDQUFMLEVBQXVCLE9BQU8sR0FBUCxDQUFXLElBQVgsRUFBaUIsRUFBakI7QUFDdkIseUJBQVMsT0FBTyxHQUFQLENBQVcsSUFBWCxDQUFUO0FBQ0QsZUFIRCxNQUdPO0FBQ0wsb0JBQUksQ0FBQyxPQUFPLElBQVAsQ0FBTCxFQUFtQixPQUFPLElBQVAsSUFBZSxFQUFmO0FBQ25CLHlCQUFTLE9BQU8sSUFBUCxDQUFUO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsU0E5QkQsTUE4Qk8sSUFBSSxjQUFjLGlCQUFpQixLQUFuQyxFQUEwQztBQUMvQyxlQUFLLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUMsRUFBRSxNQUFNLElBQVIsRUFBYyxPQUFPLEtBQXJCLEVBQW5DLEVBQWlFLElBQWpFO0FBQ0Q7QUFDRjs7Ozs7OztBQXpGSDtBQUFBO0FBQUEsNkJBZ0dTLElBaEdULEVBZ0dlO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ1gsZ0NBQWdCLElBQWhCLG1JQUFzQjtBQUFBLGdCQUFiLEdBQWE7O0FBQ3BCLGdCQUFJLE1BQU0sS0FBSyxHQUFMLENBQVY7QUFDQSxnQkFBSSxPQUFPLElBQVAsSUFBZSxLQUFLLEtBQUwsQ0FBVyxFQUE5QixFQUFrQztBQUNoQztBQUNEO0FBQ0QsaUJBQUssS0FBTCxDQUFXLEdBQVgsSUFBa0IsR0FBbEI7QUFDRDtBQVBVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBUVgsYUFBSyxhQUFMLENBQW1CLGNBQW5CLEVBQW1DLEVBQUUsTUFBTSxJQUFSLEVBQWMsT0FBTyxJQUFyQixFQUFuQyxFQUFnRSxJQUFoRTtBQUNEOzs7Ozs7Ozs7QUF6R0g7O0FBQUE7QUFBQSxJQUEyQixlQUEzQjtBQW1IRCxDQTNIRCIsImZpbGUiOiJtb2R1bGUvY29yZS9tb2RlbC9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
