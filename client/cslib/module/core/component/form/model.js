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
          btn.disable();
        });
      }
    }, {
      key: 'disableFields',
      value: function disableFields() {
        this.getFields().forEach(function (field) {
          field.disable();
        });
      }
    }, {
      key: 'hide',
      value: function hide() {
        this.getFields().forEach(function (field) {
          field.hide();
        });
        this.get('buttons').forEach(function (btn) {
          btn.hide();
        });
      }
    }, {
      key: 'hideFields',
      value: function hideFields() {
        this.getFields().forEach(function (field) {
          field.hide();
        });
      }
    }]);

    return FormModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiZGVmYXVsdHMiLCJpZCIsInRpdGxlIiwiaGVscCIsInJlZ2lvbnMiLCJidXR0b25zIiwiY2xhc3NlcyIsImVycm9ycyIsInNldHRpbmdzIiwiZGF0YSIsImZpZWxkcyIsImRlZmF1bHQiLCJlbnN1cmVEZWZhdWx0cyIsIl9vbkZpZWxkQ2hhbmdlZCIsImJpbmQiLCJnZXRGaWVsZHMiLCJmaWVsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwidmFsaWRhdGUiLCJ0aGVuIiwidGVzdHMiLCJ2YWxpZCIsImdldCIsImlzVmFsaWQiLCJjaGlsZHJlbiIsImNoaWxkIiwiY29uY2F0IiwiZXJyIiwiRXJyb3IiLCJ2YWxpZGF0aW9uIiwicmVqZWN0IiwicmVnaW9uIiwicHVzaCIsInNldCIsImRpc3BhdGNoRXZlbnQiLCJhZGRlZCIsInJlZ2lvbklkIiwiaW5jbHVkZXMiLCJzcGxpY2UiLCJpbmRleE9mIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInJlbW92ZWQiLCJidXR0b24iLCJpbmQiLCJidG4iLCJidXR0b25JZCIsImZpbHRlciIsImxlbmd0aCIsImV2dCIsImN1cnJlbnRUYXJnZXQiLCJkZWx0YSIsImNsZWFyUHJvbSIsImNsZWFyIiwiZm9yRWFjaCIsImVuYWJsZSIsImRpc2FibGUiLCJoaWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVc7QUFDVEMsUUFBSSxFQURLO0FBRVRDLFdBQU8sSUFGRTtBQUdUQyxVQUFNLElBSEc7QUFJVEMsYUFBUyxFQUpBO0FBS1RDLGFBQVMsRUFMQTtB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bGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgaWQ6ICcnLFxuICAgICAgdGl0bGU6IG51bGwsXG4gICAgICBoZWxwOiBudWxsLFxuICAgICAgcmVnaW9uczoge30sXG4gICAgICBidXR0b25zOiBbXSxcbiAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgZXJyb3JzOiBbXVxuICAgIH07XG5cbiAgcmV0dXJuIGNsYXNzIEZvcm1Nb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgICAgaWYgKHNldHRpbmdzLmRhdGEuZmllbGRzKSB7XG4gICAgICAgIHNldHRpbmdzLmRhdGEucmVnaW9ucyA9IHNldHRpbmdzLmRhdGEucmVnaW9ucyB8fCB7fTtcbiAgICAgICAgc2V0dGluZ3MuZGF0YS5yZWdpb25zLmRlZmF1bHQgPSBzZXR0aW5ncy5kYXRhLmZpZWxkcztcbiAgICAgICAgZGVsZXRlIHNldHRpbmdzLmRhdGEuZmllbGRzO1xuICAgICAgfVxuICAgICAgc2V0dGluZ3MuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhzZXR0aW5ncy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgdGhpcy5fb25GaWVsZENoYW5nZWQgPSB0aGlzLl9vbkZpZWxkQ2hhbmdlZC5iaW5kKHRoaXMpO1xuXG4gICAgICBmb3IgKGxldCBmaWVsZCBvZiB0aGlzLmdldEZpZWxkcygpKSB7XG4gICAgICAgIGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLkNoYW5nZScsIHRoaXMuX29uRmllbGRDaGFuZ2VkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YWxpZGF0ZSgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLmdldEZpZWxkcygpLm1hcCgoZmllbGQpID0+IGZpZWxkLnZhbGlkYXRlKCkpKVxuICAgICAgICAudGhlbigodGVzdHMpID0+IHtcbiAgICAgICAgICBsZXQgdmFsaWQgPSB7XG4gICAgICAgICAgICBpZDogdGhpcy5nZXQoJ2lkJyksXG4gICAgICAgICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgICAgICAgY2hpbGRyZW46IHRlc3RzLFxuICAgICAgICAgICAgZXJyb3JzOiBbXVxuICAgICAgICAgIH07XG4gICAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGVzdHMpIHtcbiAgICAgICAgICAgIGlmICghY2hpbGQuaXNWYWxpZCkge1xuICAgICAgICAgICAgICB2YWxpZC5pc1ZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgICAgdmFsaWQuZXJyb3JzID0gdmFsaWQuZXJyb3JzLmNvbmNhdChjaGlsZC5lcnJvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFsaWQuaXNWYWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJWYWxpZGF0aW9uIGZhaWxlZFwiKTtcbiAgICAgICAgICAgIGVyci52YWxpZGF0aW9uID0gdmFsaWQ7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkRmllbGQoZmllbGQsIHJlZ2lvbiA9ICdkZWZhdWx0Jykge1xuICAgICAgbGV0IHJlZ2lvbnMgPSB0aGlzLmdldCgncmVnaW9ucycpO1xuICAgICAgcmVnaW9uc1tyZWdpb25dID0gcmVnaW9uc1tyZWdpb25dIHx8IFtdO1xuICAgICAgbGV0IGZpZWxkcyA9IHJlZ2lvbnNbcmVnaW9uXTtcbiAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgIGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLkNoYW5nZScsIHRoaXMuX29uRmllbGRDaGFuZ2VkKTtcbiAgICAgIHRoaXMuc2V0KCdyZWdpb25zJywgcmVnaW9ucyk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0Zvcm0uRmllbGRBZGRlZCcsIHtcbiAgICAgICAgYWRkZWQ6IGZpZWxkLFxuICAgICAgICByZWdpb246IHJlZ2lvblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlRmllbGQoZmllbGQpIHtcbiAgICAgIGxldCByZWdpb25zLCByZWdpb24sIHJlZ2lvbklkLCBmaWVsZHM7XG4gICAgICByZWdpb25zID0gdGhpcy5nZXQoJ3JlZ2lvbnMnKTtcbiAgICAgIGZvciAocmVnaW9uIGluIHJlZ2lvbnMpIHtcbiAgICAgICAgZmllbGRzID0gcmVnaW9uc1tyZWdpb25dO1xuICAgICAgICBpZiAoZmllbGRzLmluY2x1ZGVzKGZpZWxkKSkge1xuICAgICAgICAgIHJlZ2lvbklkID0gcmVnaW9uO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVnaW9uSWQpIHtcbiAgICAgICAgZmllbGRzID0gcmVnaW9uc1tyZWdpb25JZF07XG4gICAgICAgIGZpZWxkcy5zcGxpY2UoZmllbGRzLmluZGV4T2YoZmllbGQpLCAxKTtcbiAgICAgICAgZmllbGQucmVtb3ZlRXZlbnRMaXN0ZW5lcignRmllbGQuQ2hhbmdlJywgdGhpcy5fb25GaWVsZENoYW5nZWQpO1xuICAgICAgICB0aGlzLnNldCgncmVnaW9ucycsIHJlZ2lvbnMpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0Zvcm0uRmllbGRSZW1vdmVkJywge1xuICAgICAgICAgIHJlbW92ZWQ6IGZpZWxkLFxuICAgICAgICAgIHJlZ2lvbjogcmVnaW9uSWRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RmllbGRzKCkge1xuICAgICAgbGV0IGFsbCwgcmVnaW9ucywgcmVnaW9uSWQsIGZpZWxkO1xuICAgICAgYWxsID0gW107XG4gICAgICByZWdpb25zID0gdGhpcy5nZXQoJ3JlZ2lvbnMnKVxuICAgICAgZm9yIChyZWdpb25JZCBpbiByZWdpb25zKSB7XG4gICAgICAgIGZvciAoZmllbGQgb2YgcmVnaW9uc1tyZWdpb25JZF0pIHtcbiAgICAgICAgICBhbGwucHVzaChmaWVsZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhbGw7XG4gICAgfVxuXG4gICAgYWRkQnV0dG9uKGJ1dHRvbiwgaW5kID0gbnVsbCkge1xuICAgICAgaWYgKCF0aGlzLmdldCgnYnV0dG9ucycpLm1hcCgoYnRuKSA9PiBidG4uaWQoKSkuaW5jbHVkZXMoYnV0dG9uLmlkKCkpKSB7XG4gICAgICAgIGxldCBidXR0b25zID0gdGhpcy5nZXQoJ2J1dHRvbnMnKVxuICAgICAgICBpZiAoaW5kKSB7XG4gICAgICAgICAgYnV0dG9ucy5zcGxpY2UoaW5kLCAwLCBidXR0b24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1dHRvbnMucHVzaChidXR0b24pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXQoJ2J1dHRvbnMnLCBidXR0b25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVCdXR0b24oYnV0dG9uSWQpIHtcbiAgICAgIGxldCBidXR0b25zLCBpbmQ7XG4gICAgICBpbmQgPSB0aGlzLmdldCgnYnV0dG9ucycpLmZpbHRlcigoYnRuKSA9PiBidG4uaWQoKSA9PT0gYnV0dG9uSWQpLm1hcCgoYnRuKSA9PiB0aGlzLmdldCgnYnV0dG9ucycpLmluZGV4T2YoYnRuKSk7XG4gICAgICBpZiAoaW5kLmxlbmd0aCkge1xuICAgICAgICBpbmQgPSBpbmRbMF07XG4gICAgICAgIGJ1dHRvbnMgPSB0aGlzLmdldCgnYnV0dG9ucycpXG4gICAgICAgIGJ1dHRvbnMuc3BsaWNlKGluZCwgMSlcbiAgICAgICAgdGhpcy5zZXQoJ2J1dHRvbnMnLCBidXR0b25zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRCdXR0b24oYnV0dG9uSWQpIHtcbiAgICAgIGZvciAobGV0IGJ0biBvZiB0aGlzLmdldCgnYnV0dG9ucycpKSB7XG4gICAgICAgIGlmIChidG4uaWQoKSA9PSBidXR0b25JZCkge1xuICAgICAgICAgIHJldHVybiBidG47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIF9vbkZpZWxkQ2hhbmdlZChldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRm9ybS5GaWVsZENoYW5nZWQnLCB7XG4gICAgICAgIGZpZWxkOiBldnQuY3VycmVudFRhcmdldCxcbiAgICAgICAgZGVsdGE6IGV2dC5kYXRhXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgY29uc3QgY2xlYXJQcm9tID0gW11cbiAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuZ2V0RmllbGRzKCkpIHtcbiAgICAgICAgY2xlYXJQcm9tLnB1c2goZmllbGQuY2xlYXIoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2xlYXJQcm9tKTtcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICB0aGlzLmdldEZpZWxkcygpLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgIGZpZWxkLmVuYWJsZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldCgnYnV0dG9ucycpLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uZW5hYmxlKCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLmdldEZpZWxkcygpLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5nZXQoJ2J1dHRvbnMnKS5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgYnRuLmRpc2FibGUoKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZGlzYWJsZUZpZWxkcygpIHtcbiAgICAgIHRoaXMuZ2V0RmllbGRzKCkuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMuZ2V0RmllbGRzKCkuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgZmllbGQuaGlkZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldCgnYnV0dG9ucycpLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uaGlkZSgpO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBoaWRlRmllbGRzKCkge1xuICAgICAgdGhpcy5nZXRGaWVsZHMoKS5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICBmaWVsZC5oaWRlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfTtcbn0pO1xuIl19
