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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FormModel).call(this, settings));

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
            children: tests
          };
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = tests[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var child = _step2.value;

              if (!child.isValid) {
                valid.isValid = false;
                break;
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

          return valid;
        });
      }
    }, {
      key: 'addField',
      value: function addField(field) {
        var region = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];

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
        var ind = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.getFields()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var field = _step5.value;

            field.clear();
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
      }
    }]);

    return FormModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sUUFBUSxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFLFFBQVEsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRSxXQUFXO0FBQ1QsUUFBSSxFQURLO0FBRVQsV0FBTyxJQUZFO0FBR1QsVUFBTSxJQUhHO0FBSVQsYUFBUyxFQUpBO0FBS1QsYUFBUyxFQUxBO0FBTVQsYUFBUyxFQU5BO0FBT1QsWUFBUTtBQVBDLEdBRmI7O0FBWUE7QUFBQTs7QUFDRSx1QkFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCLFVBQUksU0FBUyxJQUFULENBQWMsTUFBbEIsRUFBMEI7QUFDeEIsaUJBQVMsSUFBVCxDQUFjLE9BQWQsR0FBd0IsU0FBUyxJQUFULENBQWMsT0FBZCxJQUF5QixFQUFqRDtBQUNBLGlCQUFTLElBQVQsQ0FBYyxPQUFkLENBQXNCLE9BQXRCLEdBQWdDLFNBQVMsSUFBVCxDQUFjLE1BQTlDO0FBQ0EsZUFBTyxTQUFTLElBQVQsQ0FBYyxNQUFyQjtBQUNEO0FBQ0QsZUFBUyxRQUFULEdBQW9CLE1BQU0sY0FBTixDQUFxQixTQUFTLFFBQTlCLEVBQXdDLFFBQXhDLENBQXBCOztBQU5vQiwrRkFPZCxRQVBjOztBQVFwQixZQUFLLGVBQUwsR0FBdUIsTUFBSyxlQUFMLENBQXFCLElBQXJCLE9BQXZCOztBQVJvQjtBQUFBO0FBQUE7O0FBQUE7QUFVcEIsNkJBQWtCLE1BQUssU0FBTCxFQUFsQiw4SEFBb0M7QUFBQSxjQUEzQixLQUEyQjs7QUFDbEMsZ0JBQU0sZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBSyxlQUE1QztBQUNEO0FBWm1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFhckI7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OztBQUFBO0FBQ2xCLGdDQUFnQixLQUFLLEdBQUwsQ0FBUyxTQUFULENBQWhCLG1JQUFxQztBQUFBLGdCQUE1QixHQUE0Qjs7QUFDbkMsZ0JBQUksSUFBSSxFQUFKLE1BQVksUUFBaEIsRUFBMEI7QUFDeEIscUJBQU8sR0FBUDtBQUNEO0FBQ0Y7QUFMaUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFNbEIsZUFBTyxJQUFQO0FBQ0Q7QUEvR0g7QUFBQTtBQUFBLHNDQWlIa0IsR0FqSGxCLEVBaUh1QjtBQUNuQixhQUFLLGFBQUwsQ0FBbUIsbUJBQW5CLEVBQXdDO0FBQ3RDLGlCQUFPLElBQUksYUFEMkI7QUFFdEMsaUJBQU8sSUFBSTtBQUYyQixTQUF4QztBQUlEO0FBdEhIO0FBQUE7QUFBQSw4QkF3SFU7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDTixnQ0FBa0IsS0FBSyxTQUFMLEVBQWxCLG1JQUFvQztBQUFBLGdCQUEzQixLQUEyQjs7QUFDbEMsa0JBQU0sS0FBTjtBQUNEO0FBSEs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlQO0FBNUhIOztBQUFBO0FBQUEsSUFBK0IsS0FBL0I7QUE4SEQsQ0EzSUQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2Zvcm0vbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
