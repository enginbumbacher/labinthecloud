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
      return _possibleConstructorReturn(this, (FieldGroupModel.__proto__ || Object.getPrototypeOf(FieldGroupModel)).call(this, settings));
    }

    _createClass(FieldGroupModel, [{
      key: 'set',
      value: function set(key, val) {
        if (key == "value" && Utils.exists(val)) {
          this._setValue(val);
        }
        _get(FieldGroupModel.prototype.__proto__ || Object.getPrototypeOf(FieldGroupModel.prototype), 'set', this).call(this, key, val);
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
        return Promise.all([_get(FieldGroupModel.prototype.__proto__ || Object.getPrototypeOf(FieldGroupModel.prototype), 'validate', this).call(this), Promise.all(subvalidations)]).then(function (validations) {
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
                sup.errors = sup.errors.concat(child.errors);
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
    }, {
      key: 'enable',
      value: function enable() {
        this.get('fields').forEach(function (field) {
          field.enable();
        });
        _get(FieldGroupModel.prototype.__proto__ || Object.getPrototypeOf(FieldGroupModel.prototype), 'enable', this).call(this);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.get('fields').forEach(function (field) {
          field.disable();
        });
        _get(FieldGroupModel.prototype.__proto__ || Object.getPrototypeOf(FieldGroupModel.prototype), 'disable', this).call(this);
      }
    }]);

    return FieldGroupModel;
  }(FieldModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJGaWVsZE1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsImZpZWxkcyIsInNldHRpbmdzIiwiZW5zdXJlRGVmYXVsdHMiLCJrZXkiLCJ2YWwiLCJleGlzdHMiLCJfc2V0VmFsdWUiLCJnZXQiLCJmaWVsZCIsIk9iamVjdCIsImtleXMiLCJpbmNsdWRlcyIsImlkIiwic2V0VmFsdWUiLCJ2YWx1ZSIsImYiLCJFcnJvciIsInB1c2giLCJzZXQiLCJmb3VuZEluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsInN1YnZhbGlkYXRpb25zIiwiZmlsdGVyIiwiaXNFbXB0eSIsIm1hcCIsInZhbGlkYXRlIiwiUHJvbWlzZSIsImFsbCIsInRoZW4iLCJ2YWxpZGF0aW9ucyIsInN1cCIsImNoaWxkcmVuIiwiY2hpbGQiLCJpc1ZhbGlkIiwiZXJyb3JzIiwiY29uY2F0IiwiZm9yRWFjaCIsImVuYWJsZSIsImRpc2FibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxhQUFhRCxRQUFRLGlDQUFSLENBQW5CO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsV0FBVztBQUNUQyxZQUFRO0FBREMsR0FGYjs7QUFNQTtBQUFBOztBQUNFLDZCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTRixRQUFULEdBQW9CRCxNQUFNSSxjQUFOLENBQXFCRCxTQUFTRixRQUE5QixFQUF3Q0EsUUFBeEMsQ0FBcEI7QUFEb0IsK0hBRWRFLFFBRmM7QUFHckI7O0FBSkg7QUFBQTtBQUFBLDBCQU1NRSxHQU5OLEVBTVdDLEdBTlgsRUFNZ0I7QUFDWixZQUFJRCxPQUFPLE9BQVAsSUFBa0JMLE1BQU1PLE1BQU4sQ0FBYUQsR0FBYixDQUF0QixFQUF5QztBQUN2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QUtaLEdBQUwsQ0FBUyxRQUFULEVBQW1CYyxNQUFuQixDQUEwQkYsVUFBMUIsRUFBc0MsQ0FBdEM7QUFDQSxlQUFLRCxHQUFMLENBQVMsUUFBVCxFQUFtQixLQUFLWCxHQUFMLENBQVMsUUFBVCxDQUFuQjtBQUNEO0FBQ0Y7QUE3REg7QUFBQTtBQUFBLGlDQStEYTtBQUNULFlBQUllLGlCQUFpQixLQUFLZixHQUFMLENBQVMsUUFBVCxFQUNsQmdCLE1BRGtCLENBQ1gsVUFBQ2YsS0FBRDtBQUFBLGlCQUFXLENBQUNWLE1BQU0wQixPQUFOLENBQWNoQixNQUFNTSxLQUFOLEVBQWQsQ0FBWjtBQUFBLFNBRFcsRUFFbEJXLEdBRmtCLENBRWQsVUFBQ2pCLEtBQUQ7QUFBQSxpQkFBV0EsTUFBTWtCLFFBQU4sRUFBWDtBQUFBLFNBRmMsQ0FBckI7QUFHQSxlQUFPQyxRQUFRQyxHQUFSLENBQVksNkhBQW1CRCxRQUFRQyxHQUFSLENBQVlOLGNBQVosQ0FBbkIsQ0FBWixFQUNKTyxJQURJLENBQ0MsVUFBQ0MsV0FBRCxFQUFpQjtBQUNyQixjQUFJQyxNQUFNRCxZQUFZLENBQVosQ0FBVjtBQUNBQyxjQUFJQyxRQUFKLEdBQWVGLFlBQVksQ0FBWixDQUFmO0FBRnFCO0FBQUE7QUFBQTs7QUFBQTtBQUdyQixrQ0FBa0JDLElBQUlDLFFBQXRCLG1JQUFnQztBQUFBLGtCQUF2QkMsS0FBdUI7O0FBQzlCLGtCQUFJLENBQUNBLE1BQU1DLE9BQVgsRUFBb0I7QUFDbEJILG9CQUFJRyxPQUFKLEdBQWMsS0FBZDtBQUNBSCxvQkFBSUksTUFBSixHQUFhSixJQUFJSSxNQUFKLENBQVdDLE1BQVgsQ0FBa0JILE1BQU1FLE1BQXhCLENBQWI7QUFDRDtBQUNGO0FBUm9CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBU3JCLGlCQUFPSixHQUFQO0FBQ0QsU0FYSSxDQUFQO0FBWUQ7QUEvRUg7QUFBQTtBQUFBLCtCQWlGVztBQUNQLGFBQUt4QixHQUFMLENBQVMsUUFBVCxFQUFtQjhCLE9BQW5CLENBQTJCLFVBQUM3QixLQUFELEVBQVc7QUFDcENBLGdCQUFNOEIsTUFBTjtBQUNELFNBRkQ7QUFHQTtBQUNEO0FBdEZIO0FBQUE7QUFBQSxnQ0F3Rlk7QUFDUixhQUFLL0IsR0FBTCxDQUFTLFFBQVQsRUFBbUI4QixPQUFuQixDQUEyQixVQUFDN0IsS0FBRCxFQUFXO0FBQ3BDQSxnQkFBTStCLE9BQU47QUFDRCxTQUZEO0FBR0E7QUFDRDtBQTdGSDs7QUFBQTtBQUFBLElBQXFDMUMsVUFBckM7QUErRkQsQ0F0R0QiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2ZpZWxkZ3JvdXAvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
