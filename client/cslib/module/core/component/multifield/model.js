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

      var _this = _possibleConstructorReturn(this, (MultiFieldModel.__proto__ || Object.getPrototypeOf(MultiFieldModel)).call(this, settings));

      _this._onFieldChange = _this._onFieldChange.bind(_this);
      _this._onFieldAdded = _this._onFieldAdded.bind(_this);

      _this.setValue(settings.data.value);
      return _this;
    }

    _createClass(MultiFieldModel, [{
      key: 'setValue',
      value: function setValue(value) {
        var _this2 = this;

        this.set('fields', []);
        return Promise.all(value.map(function (item) {
          return _this2.createField(item);
        })).then(function () {
          if (Utils.exists(_this2.get('childClass')) && _this2.get('fields').length < _this2.get('min')) {
            var minProm = [];
            for (var i = _this2.get('fields').length; i < _this2.get('min'); i++) {
              minProm.push(_this2.createField(null));
            }
            return Promise.all(minProm);
          }
        });
      }
    }, {
      key: 'createField',
      value: function createField(value) {
        var _this3 = this;

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
            child.addEventListener('Field.Change', _this3._onFieldChange);
            var fields = _this3.get('fields');
            fields.push(child);
            _this3.set('fields', fields);
            _this3._onFieldAdded();
          }
        }).catch(function (err) {
          _this3._handleChildError(err);
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
        return Promise.all([_get(MultiFieldModel.prototype.__proto__ || Object.getPrototypeOf(MultiFieldModel.prototype), 'validate', this).call(this), Promise.all(this.get('fields').filter(function (field) {
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
                sup.errors = sup.errors.concat(child.errors);
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
    }, {
      key: 'enable',
      value: function enable() {
        this.get('fields').forEach(function (field) {
          field.enable();
        });
        _get(MultiFieldModel.prototype.__proto__ || Object.getPrototypeOf(MultiFieldModel.prototype), 'enable', this).call(this);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.get('fields').forEach(function (field) {
          field.disable();
        });
        _get(MultiFieldModel.prototype.__proto__ || Object.getPrototypeOf(MultiFieldModel.prototype), 'disable', this).call(this);
      }
    }]);

    return MultiFieldModel;
  }(FieldModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJGaWVsZE1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsImNoaWxkQ2xhc3MiLCJjaGlsZFNldHRpbmdzIiwiY2hpbGRGYWN0b3J5IiwiZmllbGRzIiwibG9ja2VkIiwiZGVmYXVsdFZhbHVlIiwibWluIiwibWF4Iiwic29ydGFibGUiLCJkcmFnVHJpZ2dlciIsImRyYWdDbGFzc2VzIiwiYWRkQnV0dG9uTGFiZWwiLCJhZGRFdmVudCIsInNldHRpbmdzIiwiZGF0YSIsInZhbHVlIiwiZW5zdXJlRGVmYXVsdHMiLCJTZXQiLCJfb25GaWVsZENoYW5nZSIsImJpbmQiLCJfb25GaWVsZEFkZGVkIiwic2V0VmFsdWUiLCJzZXQiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwiaXRlbSIsImNyZWF0ZUZpZWxkIiwidGhlbiIsImV4aXN0cyIsImdldCIsImxlbmd0aCIsIm1pblByb20iLCJpIiwicHVzaCIsImZhY3RvcnkiLCJjaGlsZFByb21pc2UiLCJyZXNvbHZlIiwiaWQiLCJndWlkNCIsImNscyIsImNoaWxkRGVmYXVsdHMiLCJtb2RlbERhdGEiLCJjaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjYXRjaCIsImVyciIsIl9oYW5kbGVDaGlsZEVycm9yIiwiY29uc29sZSIsImxvZyIsImluZGV4IiwiaW5kIiwicmVtb3ZlZCIsImhhcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzcGxpY2UiLCJldnQiLCJmaWVsZCIsImluaXQiLCJyZXNldCIsImFkZCIsImRlbGV0ZSIsImZpbHRlciIsImlzRW1wdHkiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb25zIiwic3VwIiwiY2hpbGRyZW4iLCJpc1ZhbGlkIiwiZXJyb3JzIiwiY29uY2F0Iiwib3JkZXJlZElkcyIsImV4aXN0aW5nSWRzIiwiaW5jbHVkZXMiLCJFcnJvciIsIm5ld0ZpZWxkcyIsImZv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QUFMLENBQVMsUUFBVCxDQUFsQixtSUFBc0M7QUFBQSxvQkFBN0IyQixLQUE2Qjs7QUFDcEMsb0JBQUlBLE1BQU1uQixFQUFOLE1BQWNBLEVBQWxCLEVBQXNCO0FBQ3BCcUMsNEJBQVV6QyxJQUFWLENBQWV1QixLQUFmO0FBQ0E7QUFDRDtBQUNGO0FBTndCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPMUI7QUFkcUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFldEIsYUFBS25DLEdBQUwsQ0FBUyxRQUFULEVBQW1CcUQsU0FBbkI7QUFDQSxhQUFLekQsY0FBTDtBQUNEO0FBbEtIO0FBQUE7QUFBQSwrQkFvS1c7QUFDUCxhQUFLWSxHQUFMLENBQVMsUUFBVCxFQUFtQjhDLE9BQW5CLENBQTJCLFVBQUNuQixLQUFELEVBQVc7QUFDcENBLGdCQUFNb0IsTUFBTjtBQUNELFNBRkQ7QUFHQTtBQUNEO0FBektIO0FBQUE7QUFBQSxnQ0EyS1k7QUFDUixhQUFLL0MsR0FBTCxDQUFTLFFBQVQsRUFBbUI4QyxPQUFuQixDQUEyQixVQUFDbkIsS0FBRCxFQUFXO0FBQ3BDQSxnQkFBTXFCLE9BQU47QUFDRCxTQUZEO0FBR0E7QUFDRDtBQWhMSDs7QUFBQTtBQUFBLElBQXFDakYsVUFBckM7QUFrTEQsQ0F0TUQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L211bHRpZmllbGQvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
