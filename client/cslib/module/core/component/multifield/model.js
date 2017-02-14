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
    childClass: null,
    childSettings: {},
    childFactory: null,
    fields: [],
    locked: null,
    defaultValue: [],
    min: 0,
    max: null,
    sortable: true,
    dragTrigger: ".dragitem__grip",
    dragClasses: [],
    addButtonLabel: "add",
    addEvent: true
  };

  return function (_FieldModel) {
    _inherits(MultiFieldModel, _FieldModel);

    function MultiFieldModel(settings) {
      _classCallCheck(this, MultiFieldModel);

      settings.data.value = settings.data.value || [];
      settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
      settings.defaults.locked = settings.defaults.locked || new Set();

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultiFieldModel).call(this, settings));

      _this._onFieldChange = _this._onFieldChange.bind(_this);
      _this._onFieldAdded = _this._onFieldAdded.bind(_this);

      Promise.all(settings.data.value.map(function (item) {
        return _this.createField(item);
      })).then(function () {
        if (Utils.exists(_this.get('childClass')) && _this.get('fields').length < _this.get('min')) {
          _this.createField(null);
        }
      });
      return _this;
    }

    _createClass(MultiFieldModel, [{
      key: 'createField',
      value: function createField(value) {
        var _this2 = this;

        var factory = void 0,
            childPromise = void 0;

        if (Utils.exists(this.get('max')) && this.get('fields').length >= this.get('max')) {
          return Promise.resolve(null);
        }

        if (factory = this.get('childFactory')) {
          childPromise = factory({
            id: Utils.guid4(),
            value: value
          });
        } else {
          var cls = this.get('childClass');
          var childDefaults = this.get('childSettings');
          childPromise = Promise.resolve(new cls({
            modelData: Utils.ensureDefaults({
              id: Utils.guid4(),
              value: value
            }, childDefaults)
          }));
        }

        return childPromise.then(function (child) {
          if (child) {
            child.addEventListener('Field.Change', _this2._onFieldChange);
            var fields = _this2.get('fields');
            fields.push(child);
            _this2.set('fields', fields);
            _this2._onFieldAdded();
          }
        }).catch(function (err) {
          _this2._handleChildError(err);
        });
      }
    }, {
      key: '_handleChildError',
      value: function _handleChildError(err) {
        console.log(err);
      }
    }, {
      key: 'removeField',
      value: function removeField(id) {
        if (this.get('fields').length <= this.get('min')) {
          return;
        }

        var fields = this.get('fields');
        var index = void 0;
        for (var ind = 0; ind < fields.length; ind++) {
          if (fields[ind].id() == id) {
            index = ind;
            break;
          }
        }
        var removed = fields[index];
        if (this.get('locked').has(removed)) {
          return;
        }
        removed.removeEventListener('Field.Change', this._onFieldChange);
        fields.splice(index, 1);
        this.set('fields', fields);
        this._onFieldChange();
      }
    }, {
      key: '_onFieldChange',
      value: function _onFieldChange(evt) {
        this.set('value', this.get('fields').map(function (field) {
          return field.value();
        }));
      }
    }, {
      key: '_onFieldAdded',
      value: function _onFieldAdded(evt) {
        if (this.get('addEvent')) {
          this._onFieldChange();
        }
      }
    }, {
      key: 'setChildMeta',
      value: function setChildMeta(cls, init) {
        this.set('childClass', cls);
        this.set('childDefaults', init);
        this.reset();
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.set('fields', []);
        while (this.get('fields').length < this.get('min')) {
          this.createField(null);
        }
      }
    }, {
      key: 'lockField',
      value: function lockField(ind) {
        var locked = this.get('locked');
        locked.add(this.get('fields')[ind]);
        this.set('locked', locked);
      }
    }, {
      key: 'unlockField',
      value: function unlockField(ind) {
        var locked = this.get('locked');
        locked.delete(this.get('fields')[ind]);
        this.set('locked', locked);
      }
    }, {
      key: 'validate',
      value: function validate() {
        return Promise.all([_get(Object.getPrototypeOf(MultiFieldModel.prototype), 'validate', this).call(this), Promise.all(this.get('fields').filter(function (field) {
          return !Utils.isEmpty(field.value());
        }).map(function (field) {
          return field.validate();
        }))]).then(function (validations) {
          var sup = validations[0];
          sup.children = validations[1];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = sup.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var child = _step.value;

              if (!child.isValid) {
                sup.isValid = false;
                break;
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

          return sup;
        });
      }
    }, {
      key: 'updateOrder',
      value: function updateOrder(orderedIds) {
        var existingIds = this.get('fields').map(function (field) {
          return field.id();
        });
        if (orderedIds.length != this.get('fields').length || orderedIds.filter(function (id) {
          return !existingIds.includes(id);
        }).length) {
          throw new Error("Attempt to change order also adds or removes content.");
        }

        var newFields = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = orderedIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var id = _step2.value;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = this.get('fields')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var field = _step3.value;

                if (field.id() == id) {
                  newFields.push(field);
                  break;
                }
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

        this.set('fields', newFields);
        this._onFieldChange();
      }
    }]);

    return MultiFieldModel;
  }(FieldModel);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxhQUFhLFFBQVEsaUNBQVIsQ0FBbkI7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxXQUFXO0FBQ1QsZ0JBQVksSUFESDtBQUVULG1CQUFlLEVBRk47QUFHVCxrQkFBYyxJQUhMO0FBSVQsWUFBUSxFQUpDO0FBS1QsWUFBUSxJQUxDO0FBTVQsa0JBQWMsRUFOTDtBQU9ULFNBQUssQ0FQSTtBQVFULFNBQUssSUFSSTtBQVNULGNBQVUsSUFURDtBQVVULGlCQUFhLGlCQVZKO0FBV1QsaUJBQWEsRUFYSjtBQVlULG9CQUFnQixLQVpQO0FBYVQsY0FBVTtBQWJELEdBRmI7O0FBbUJBO0FBQUE7O0FBQ0UsNkJBQVksUUFBWixFQUFzQjtBQUFBOztBQUNwQixlQUFTLElBQVQsQ0FBYyxLQUFkLEdBQXNCLFNBQVMsSUFBVCxDQUFjLEtBQWQsSUFBdUIsRUFBN0M7QUFDQSxlQUFTLFFBQVQsR0FBb0IsTUFBTSxjQUFOLENBQXFCLFNBQVMsUUFBOUIsRUFBd0MsUUFBeEMsQ0FBcEI7QUFDQSxlQUFTLFFBQVQsQ0FBa0IsTUFBbEIsR0FBMkIsU0FBUyxRQUFULENBQWtCLE1BQWxCLElBQTRCLElBQUksR0FBSixFQUF2RDs7QUFIb0IscUdBSWQsUUFKYzs7QUFLcEIsWUFBSyxjQUFMLEdBQXNCLE1BQUssY0FBTCxDQUFvQixJQUFwQixPQUF0QjtBQUNBLFlBQUssYUFBTCxHQUFxQixNQUFLLGFBQUwsQ0FBbUIsSUFBbkIsT0FBckI7O0FBRUEsY0FBUSxHQUFSLENBQVksU0FBUyxJQUFULENBQWMsS0FBZCxDQUFvQixHQUFwQixDQUF3QixVQUFDLElBQUQ7QUFBQSxlQUFVLE1BQUssV0FBTCxDQUFpQixJQUFqQixDQUFWO0FBQUEsT0FBeEIs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QUFZLFFBQVosQ0FBcUIsRUFBckIsQ0FBVDtBQUFBLFNBQWxCLEVBQXFELE1BQTNHLEVBQW1IO0FBQ2pILGdCQUFNLElBQUksS0FBSixDQUFVLHVEQUFWLENBQU47QUFDRDs7QUFFRCxZQUFJLFlBQVksRUFBaEI7QUFOc0I7QUFBQTtBQUFBOztBQUFBO0FBT3RCLGdDQUFlLFVBQWYsbUlBQTJCO0FBQUEsZ0JBQWxCLEVBQWtCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3pCLG9DQUFrQixLQUFLLEdBQUwsQ0FBUyxRQUFULENBQWxCLG1JQUFzQztBQUFBLG9CQUE3QixLQUE2Qjs7QUFDcEMsb0JBQUksTUFBTSxFQUFOLE1BQWMsRUFBbEIsRUFBc0I7QUFDcEIsNEJBQVUsSUFBVixDQUFlLEtBQWY7QUFDQTtBQUNEO0FBQ0Y7QUFOd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU8xQjtBQWRxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWV0QixhQUFLLEdBQUwsQ0FBUyxRQUFULEVBQW1CLFNBQW5CO0FBQ0EsYUFBSyxjQUFMO0FBQ0Q7QUF6Skg7O0FBQUE7QUFBQSxJQUFxQyxVQUFyQztBQTJKRCxDQS9LRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvbXVsdGlmaWVsZC9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
