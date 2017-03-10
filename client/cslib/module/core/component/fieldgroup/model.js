'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FieldModel = require('core/component/form/field/model'),
      Utils = require('core/util/utils'),
      defaults = {
    fields: []
  };

  return function (_FieldModel) {
    _inherits(FieldGroupModel, _FieldModel);

    function FieldGroupModel(settings) {
      _classCallCheck(this, FieldGroupModel);

      settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(FieldGroupModel).call(this, settings));
    }

    _createClass(FieldGroupModel, [{
      key: 'set',
      value: function set(key, val) {
        if (key == "value" && Utils.exists(val)) {
          this._setValue(val);
        }
        _get(Object.getPrototypeOf(FieldGroupModel.prototype), 'set', this).call(this, key, val);
      }
    }, {
      key: '_setValue',
      value: function _setValue(val) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.get('fields')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var field = _step.value;

            if (Object.keys(val).includes(field.id())) {
              field.setValue(val[field.id()]);
            } else {
              field.setValue(null);
            }
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
      }
    }, {
      key: 'value',
      value: function value() {
        var val = {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.get('fields')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var field = _step2.value;

            val[field.id()] = field.value();
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

        return val;
      }
    }, {
      key: 'getSubField',
      value: function getSubField(id) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.get('fields')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var field = _step3.value;

            if (field.id() == id) return field;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return null;
      }
    }, {
      key: 'addField',
      value: function addField(field) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.get('fields')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var f = _step4.value;

            if (f.id() == field.id()) {
              throw new Error("Field ID already exists in group");
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        this.get('fields').push(field);
        this.set('fields', this.get('fields'));
      }
    }, {
      key: 'removeField',
      value: function removeField(id) {
        var foundIndex = null;
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.get('fields')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var f = _step5.value;

            if (f.id() == id) {
              foundIndex = this.get('fields').indexOf(f);
              break;
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        if (Utils.exists(foundIndex)) {
          this.get('fields').splice(foundIndex, 1);
          this.set('fields', this.get('fields'));
        }
      }
    }, {
      key: 'validate',
      value: function validate() {
        var subvalidations = this.get('fields').filter(function (field) {
          return !Utils.isEmpty(field.value());
        }).map(function (field) {
          return field.validate();
        });
        return Promise.all([_get(Object.getPrototypeOf(FieldGroupModel.prototype), 'validate', this).call(this), Promise.all(subvalidations)]).then(function (validations) {
          var sup = validations[0];
          sup.children = validations[1];
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = sup.children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var child = _step6.value;

              if (!child.isValid) {
                sup.isValid = false;
                break;
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          return sup;
        });
      }
    }]);

    return FieldGroupModel;
  }(FieldModel);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxhQUFhLFFBQVEsaUNBQVIsQ0FBbkI7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxXQUFXO0FBQ1QsWUFBUTtBQURDLEdBRmI7O0FBTUE7QUFBQTs7QUFDRSw2QkFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCLGVBQVMsUUFBVCxHQUFvQixNQUFNLGNBQU4sQ0FBcUIsU0FBUyxRQUE5QixFQUF3QyxRQUF4QyxDQUFwQjtBQURvQixnR0FFZCxRQUZjO0FBR3JCOztBQUpIO0FBQUE7QUFBQSwwQkFNTSxHQU5OLEVBTVcsR0FOWCxFQU1nQjtBQUNaLFlBQUksT0FBTyxPQUFQLElBQWtCLE1BQU0sTUFBTixDQUFhLEdBQWIsQ0FBdEIsRUFBeUM7QUFDdkMsZUFBSyxTQUFMLENBQWUsR0FBZjtBQUNEO0FBQ0QsdUZBQVUsR0FBVixFQUFlLEdBQWY7QUFDRDtBQVhIO0FBQUE7QUFBQSxnQ0FhWSxHQWJaLEVBYWlCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ2IsK0JBQWtCLEtBQUssR0FBTCxDQUFTLFFBQVQsQ0FBbEIsOEhBQXNDO0FBQUEsZ0JBQTdCLEtBQTZCOztBQUNwQyxnQkFBSSxPQUFPLElBQVAsQ0FBWSxHQUFaLEVBQWlCLFFBQWpCLENBQTBCLE1BQU0sRUFBTixFQUExQixDQUFKLEVBQTJDO0FBQ3pDLG9CQUFNLFFBQU4sQ0FBZSxJQUFJLE1BQU0sRUFBTixFQUFKLENBQWY7QUFDRCxhQUZELE1BRU87QUFDTCxvQkFBTSxRQUFOLENBQWUsSUFBZjtBQUNEO0FBQ0Y7QUFQWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUWQ7QUFyQkg7QUFBQTtBQUFBLDhCQXVCVTtBQUNOLFlBQUksTUFBTSxFQUFWO0FBRE07QUFBQTtBQUFBOztBQUFBO0FBRU4sZ0NBQWtCLEtBQUssR0FBTCxDQUFTLFFBQVQsQ0FBbEIsbUlBQXNDO0FBQUEsZ0JBQTdCLEtBQTZCOztBQUNwQyxnQkFBSSxNQUFNLEVBQU4sRUFBSixJQUFrQixNQUFNLEtBQU4sRUFBbEI7QUFDRDtBQUpLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBS04sZUFBTyxHQUFQO0FBQ0Q7QUE3Qkg7QUFBQTtBQUFBLGtDQStCYyxFQS9CZCxFQStCa0I7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDZCxnQ0FBa0IsS0FBSyxHQUFMLENBQVMsUUFBVCxDQUFsQixtSUFBc0M7QUFBQSxnQkFBN0IsS0FBNkI7O0FBQ3BDLGdCQUFJLE1BQU0sRUFBTixNQUFjLEVBQWxCLEVBQXNCLE9BQU8sS0FBUDtBQUN2QjtBQUhhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBSWQsZUFBTyxJQUFQO0FBQ0Q7QUFwQ0g7QUFBQTtBQUFBLCtCQXNDVyxLQXRDWCxFQXNDa0I7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDZCxnQ0FBYyxLQUFLLEdBQUwsQ0FBUyxRQUFULENBQWQsbUlBQWtDO0FBQUEsZ0JBQXpCLENBQXlCOztBQUNoQyxnQkFBSSxFQUFFLEVBQUYsTUFBVSxNQUFNLEVBQU4sRUFBZCxFQUEwQjtBQUN4QixvQkFBTSxJQUFJLEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0Q7QUFDRjtBQUxhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT2QsYUFBSyxHQUFMLENBQVMsUUFBVCxFQUFtQixJQUFuQixDQUF3QixLQUF4QjtBQUNBLGFBQUssR0FBTCxDQUFTLFFBQVQsRUFBbUIsS0FBSyxHQUFMLENBQVMsUUFBVCxDQUFuQjtBQUNEO0FBL0NIO0FBQUE7QUFBQSxrQ0FpRGMsRUFqRGQsRUFpRGtCO0FBQ2QsWUFBSSxhQUFhLElBQWpCO0FBRGM7QUFBQTtBQUFBOztBQUFBO0FBRWQsZ0NBQWMsS0FBSyxHQUFMLENBQVMsUUFBVCxDQUFkLG1JQUFrQztBQUFBLGdCQUF6QixDQUF5Qjs7QUFDaEMsZ0JBQUksRUFBRSxFQUFGLE1BQVUsRUFBZCxFQUFrQjtBQUNoQiwyQkFBYSxLQUFLLEdBQUwsQ0FBUyxRQUFULEVBQW1CLE9BQW5CLENBQTJCLENBQTNCLENBQWI7QUFDQTtBQUNEO0FBQ0Y7QUFQYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVFkLFlBQUksTUFBTSxNQUFOLENBQWEsVUFBYixDQUFKLEVBQThCO0FBQzVCLGVBQUssR0FBTCxDQUFTLFFBQVQsRUFBbUIsTUFBbkIsQ0FBMEIsVUFBMUIsRUFBc0MsQ0FBdEM7QUFDQSxlQUFLLEdBQUwsQ0FBUyxRQUFULEVBQW1CLEtBQUssR0FBTCxDQUFTLFFBQVQsQ0FBbkI7QUFDRDtBQUNGO0FBN0RIO0FBQUE7QUFBQSxpQ0ErRGE7QUFDVCxZQUFJLGlCQUFpQixLQUFLLEdBQUwsQ0FBUyxRQUFULEVBQ2xCLE1BRGtCLENBQ1gsVUFBQyxLQUFEO0FBQUEsaUJBQVcsQ0FBQyxNQUFNLE9BQU4sQ0FBYyxNQUFNLEtBQU4sRUFBZCxDQUFaO0FBQUEsU0FEVyxFQUVsQixHQUZrQixDQUVkLFVBQUMsS0FBRDtBQUFBLGlCQUFXLE1BQU0sUUFBTixFQUFYO0FBQUEsU0FGYyxDQUFyQjtBQUdBLGVBQU8sUUFBUSxHQUFSLENBQVksc0ZBQW1CLFFBQVEsR0FBUixDQUFZLGNBQVosQ0FBbkIsQ0FBWixFQUNKLElBREksQ0FDQyxVQUFDLFdBQUQsRUFBaUI7QUFDckIsY0FBSSxNQUFNLFlBQVksQ0FBWixDQUFWO0FBQ0EsY0FBSSxRQUFKLEdBQWUsWUFBWSxDQUFaLENBQWY7QUFGcUI7QUFBQTtBQUFBOztBQUFBO0FBR3JCLGtDQUFrQixJQUFJLFFBQXRCLG1JQUFnQztBQUFBLGtCQUF2QixLQUF1Qjs7QUFDOUIsa0JBQUksQ0FBQyxNQUFNLE9BQVgsRUFBb0I7QUFDbEIsb0JBQUksT0FBSixHQUFjLEtBQWQ7QUFDQTtBQUNEO0FBQ0Y7QUFSb0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFTckIsaUJBQU8sR0FBUDtBQUNELFNBWEksQ0FBUDtBQVlEO0FBL0VIOztBQUFBO0FBQUEsSUFBcUMsVUFBckM7QUFpRkQsQ0F4RkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2ZpZWxkZ3JvdXAvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
