'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    id: '',
    title: null,
    help: null,
    regions: {},
    buttons: [],
    classes: [],
    errors: []
  };

  return function (_Model) {
    _inherits(FormModel, _Model);

    function FormModel(settings) {
      _classCallCheck(this, FormModel);

      if (settings.data.fields) {
        settings.data.regions = settings.data.regions || {};
        settings.data.regions.default = settings.data.fields;
        delete settings.data.fields;
      }
      settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (FormModel.__proto__ || Object.getPrototypeOf(FormModel)).call(this, settings));

      _this._onFieldChanged = _this._onFieldChanged.bind(_this);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this.getFields()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var field = _step.value;

          field.addEventListener('Field.Change', _this._onFieldChanged);
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

      return _this;
    }

    _createClass(FormModel, [{
      key: 'validate',
      value: function validate() {
        var _this2 = this;

        return Promise.all(this.getFields().map(function (field) {
          return field.validate();
        })).then(function (tests) {
          var valid = {
            id: _this2.get('id'),
            isValid: true,
            children: tests,
            errors: []
          };
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = tests[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var child = _step2.value;

              if (!child.isValid) {
                valid.isValid = false;
                valid.errors = valid.errors.concat(child.errors);
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

          if (valid.isValid) {
            return valid;
          } else {
            var err = new Error("Validation failed");
            err.validation = valid;
            return Promise.reject(err);
          }
        });
      }
    }, {
      key: 'addField',
      value: function addField(field) {
        var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

        var regions = this.get('regions');
        regions[region] = regions[region] || [];
        var fields = regions[region];
        fields.push(field);
        field.addEventListener('Field.Change', this._onFieldChanged);
        this.set('regions', regions);
        this.dispatchEvent('Form.FieldAdded', {
          added: field,
          region: region
        });
      }
    }, {
      key: 'removeField',
      value: function removeField(field) {
        var regions = void 0,
            region = void 0,
            regionId = void 0,
            fields = void 0;
        regions = this.get('regions');
        for (region in regions) {
          fields = regions[region];
          if (fields.includes(field)) {
            regionId = region;
            break;
          }
        }
        if (regionId) {
          fields = regions[regionId];
          fields.splice(fields.indexOf(field), 1);
          field.removeEventListener('Field.Change', this._onFieldChanged);
          this.set('regions', regions);
          this.dispatchEvent('Form.FieldRemoved', {
            removed: field,
            region: regionId
          });
        }
      }
    }, {
      key: 'getFields',
      value: function getFields() {
        var all = void 0,
            regions = void 0,
            regionId = void 0,
            field = void 0;
        all = [];
        regions = this.get('regions');
        for (regionId in regions) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = regions[regionId][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              field = _step3.value;

              all.push(field);
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
        return all;
      }
    }, {
      key: 'addButton',
      value: function addButton(button) {
        var ind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!this.get('buttons').map(function (btn) {
          return btn.id();
        }).includes(button.id())) {
          var buttons = this.get('buttons');
          if (ind) {
            buttons.splice(ind, 0, button);
          } else {
            buttons.push(button);
          }
          this.set('buttons', buttons);
        }
      }
    }, {
      key: 'removeButton',
      value: function removeButton(buttonId) {
        var _this3 = this;

        var buttons = void 0,
            ind = void 0;
        ind = this.get('buttons').filter(function (btn) {
          return btn.id() === buttonId;
        }).map(function (btn) {
          return _this3.get('buttons').indexOf(btn);
        });
        if (ind.length) {
          ind = ind[0];
          buttons = this.get('buttons');
          buttons.splice(ind, 1);
          this.set('buttons', buttons);
        }
      }
    }, {
      key: 'getButton',
      value: function getButton(buttonId) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.get('buttons')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var btn = _step4.value;

            if (btn.id() == buttonId) {
              return btn;
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

        return null;
      }
    }, {
      key: '_onFieldChanged',
      value: function _onFieldChanged(evt) {
        this.dispatchEvent('Form.FieldChanged', {
          field: evt.currentTarget,
          delta: evt.data
        });
      }
    }, {
      key: 'clear',
      value: function clear() {
        var clearProm = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.getFields()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var field = _step5.value;

            clearProm.push(field.clear());
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

        return Promise.all(clearProm);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.getFields().forEach(function (field) {
          field.enable();
        });
        this.get('buttons').forEach(function (btn) {
          btn.enable();
        });
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.getFields().forEach(function (field) {
          field.disable();
        });
        this.get('buttons').forEach(function (btn) {
          btn.enable();
        });
      }
    }]);

    return FormModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiZGVmYXVsdHMiLCJpZCIsInRpdGxlIiwiaGVscCIsInJlZ2lvbnMiLCJidXR0b25zIiwiY2xhc3NlcyIsImVycm9ycyIsInNldHRpbmdzIiwiZGF0YSIsImZpZWxkcyIsImRlZmF1bHQiLCJlbnN1cmVEZWZhdWx0cyIsIl9vbkZpZWxkQ2hhbmdlZCIsImJpbmQiLCJnZXRGaWVsZHMiLCJmaWVsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwidmFsaWRhdGUiLCJ0aGVuIiwidGVzdHMiLCJ2YWxpZCIsImdldCIsImlzVmFsaWQiLCJjaGlsZHJlbiIsImNoaWxkIiwiY29uY2F0IiwiZXJyIiwiRXJyb3IiLCJ2YWxpZGF0aW9uIiwicmVqZWN0IiwicmVnaW9uIiwicHVzaCIsInNldCIsImRpc3BhdGNoRXZlbnQiLCJhZGRlZCIsInJlZ2lvbklkIiwiaW5jbHVkZXMiLCJzcGxpY2UiLCJpbmRleE9mIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInJlbW92ZWQiLCJidXR0b24iLCJpbmQiLCJidG4iLCJidXR0b25JZCIsImZpbHRlciIsImxlbmd0aCIsImV2dCIsImN1cnJlbnRUYXJnZXQiLCJkZWx0YSIsImNsZWFyUHJvbSIsImNsZWFyIiwiZm9yRWFjaCIsImVuYWJsZSIsImRpc2FibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsV0FBVztBQUNUQyxRQUFJLEVBREs7QUFFVEMsV0FBTyxJQUZFO0FBR1RDLFVBQU0sSUFIRztBQUlUQyxhQUFTLEVBSkE7QUFLVEMsYUFBUyxFQUxBO0FBTVRDLGFB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WixDQUFQO0FBQ0Q7QUFySUg7QUFBQTtBQUFBLCtCQXVJVztBQUNQLGFBQUt2QyxTQUFMLEdBQWlCeUMsT0FBakIsQ0FBeUIsVUFBQ3hDLEtBQUQsRUFBVztBQUNsQ0EsZ0JBQU15QyxNQUFOO0FBQ0QsU0FGRDtBQUdBLGFBQUtoQyxHQUFMLENBQVMsU0FBVCxFQUFvQitCLE9BQXBCLENBQTRCLFVBQUNULEdBQUQsRUFBUztBQUNuQ0EsY0FBSVUsTUFBSjtBQUNELFNBRkQ7QUFHRDtBQTlJSDtBQUFBO0FBQUEsZ0NBZ0pZO0FBQ1IsYUFBSzFDLFNBQUwsR0FBaUJ5QyxPQUFqQixDQUF5QixVQUFDeEMsS0FBRCxFQUFXO0FBQ2xDQSxnQkFBTTBDLE9BQU47QUFDRCxTQUZEO0FBR0EsYUFBS2pDLEdBQUwsQ0FBUyxTQUFULEVBQW9CK0IsT0FBcEIsQ0FBNEIsVUFBQ1QsR0FBRCxFQUFTO0FBQ25DQSxjQUFJVSxNQUFKO0FBQ0QsU0FGRDtBQUdEO0FBdkpIOztBQUFBO0FBQUEsSUFBK0IzRCxLQUEvQjtBQXlKRCxDQXRLRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
