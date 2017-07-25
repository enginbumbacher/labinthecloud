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
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Model);

      var _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this));

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
        var trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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

            if (target && target.get && typeof target.get == 'function' && target.get(part)) {
              target = target.get(part);
            } else if (target && target[part] !== null) {
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
        var forceEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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
                if (value === null) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL21vZGVsL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJFdmVudERpc3BhdGNoZXIiLCJVdGlscyIsImRlZmF1bHRzIiwiZGF0YSIsInNldHRpbmdzIiwiZW5zdXJlRGVmYXVsdHMiLCJfZGF0YSIsInBhdGgiLCJ0cmFjZSIsInBhcnRzIiwidGFyZ2V0IiwidGFyZ2V0cyIsInNwbGl0IiwicGFydCIsImdldCIsInB1c2giLCJ2YWx1ZSIsImZvcmNlRXZlbnQiLCJwYXRocyIsIm9sZCIsImkiLCJsZW5ndGgiLCJzZXQiLCJkaXNwYXRjaEV2ZW50IiwiQXJyYXkiLCJrZXkiLCJ2YWwiLCJpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxrQkFBa0JELFFBQVEsdUJBQVIsQ0FBeEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXO0FBQ1RDLFVBQU0sRUFERztBQUVURCxjQUFVO0FBRkQsR0FGYjs7QUFPQTtBQUFBOztBQUVGOztBQUVBO0FBQ0E7O0FBRUkscUJBQTJCO0FBQUEsVUFBZkUsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUV6QkEsaUJBQVdILE1BQU1JLGNBQU4sQ0FBcUJELFFBQXJCLEVBQStCRixRQUEvQixDQUFYO0FBQ0EsWUFBS0ksS0FBTCxHQUFhTCxNQUFNSSxjQUFOLENBQXFCRCxTQUFTRCxJQUE5QixFQUFvQ0MsU0FBU0YsUUFBN0MsQ0FBYjtBQUh5QjtBQUkxQjs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQXBCRTtBQUFBO0FBQUEsMEJBc0JNSyxJQXRCTixFQXNCMkI7QUFBQSxZQUFmQyxLQUFlLHVFQUFQLEtBQU87O0FBQ3ZCLFlBQUlDLGNBQUo7QUFBQSxZQUFXQyxlQUFYO0FBQUEsWUFBbUJDLGdC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RUFBZjtBQUNuQkgseUJBQVNBLE9BQU9HLElBQVAsQ0FBVDtBQUNEO0FBQ0Y7QUFDRjtBQUNGLFNBOUJELE1BOEJPLElBQUlJLGNBQWNELGlCQUFpQlEsS0FBbkMsRUFBMEM7QUFDL0MsZUFBS0QsYUFBTCxDQUFtQixjQUFuQixFQUFtQyxFQUFFaEIsTUFBTUEsSUFBUixFQUFjUyxPQUFPQSxLQUFyQixFQUFuQyxFQUFpRSxJQUFqRTtBQUNEO0FBQ0Y7O0FBRUw7O0FBRUE7QUFDQTs7QUE5RkU7QUFBQTtBQUFBLDZCQWdHU2IsSUFoR1QsRUFnR2U7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDWCxnQ0FBZ0JBLElBQWhCLG1JQUFzQjtBQUFBLGdCQUFic0IsR0FBYTs7QUFDcEIsZ0JBQUlDLE1BQU12QixLQUFLc0IsR0FBTCxDQUFWO0FBQ0EsZ0JBQUlBLE9BQU8sSUFBUCxJQUFlLEtBQUtuQixLQUFMLENBQVdxQixFQUE5QixFQUFrQztBQUNoQztBQUNEO0FBQ0QsaUJBQUtyQixLQUFMLENBQVdtQixHQUFYLElBQWtCQyxHQUFsQjtBQUNEO0FBUFU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFRWCxhQUFLSCxhQUFMLENBQW1CLGNBQW5CLEVBQW1DLEVBQUVoQixNQUFNLElBQVIsRUFBY1MsT0FBT2IsSUFBckIsRUFBbkMsRUFBZ0UsSUFBaEU7QUFDRDs7QUFHTDtBQUNBOztBQUVBOztBQUVBOztBQWpIRTs7QUFBQTtBQUFBLElBQTJCSCxlQUEzQjtBQW1IRCxDQTNIRCIsImZpbGUiOiJtb2R1bGUvY29yZS9tb2RlbC9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
