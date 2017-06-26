'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FieldView = require('core/component/form/field/view'),
      Template = require('text!./container.html'),
      Button = require('core/component/button/field'),
      FieldWrap = require('./fieldwrap/fieldwrap'),
      DropSite = require('core/component/dragdrop/dropsite/dropsite'),
      DragDropManager = require('core/component/dragdrop/manager'),
      Utils = require('core/util/utils'),
      DomView = require('core/view/dom_view');
  require('link!./multifield.css');

  return function (_FieldView) {
    _inherits(MultifieldView, _FieldView);

    function MultifieldView(model, tmpl) {
      _classCallCheck(this, MultifieldView);

      var _this = _possibleConstructorReturn(this, (MultifieldView.__proto__ || Object.getPrototypeOf(MultifieldView)).call(this, model, tmpl || Template));

      Utils.bindMethods(_this, ['_onOrderChange', '_onModelChange']);

      _this._labelContainer = _this.$el.find(".multifield__label");
      _this._fieldWraps = {};

      _this._ddm = new DragDropManager({
        modelData: {
          bounds: new DomView(_this.$el.find(".multifield__fields")),
          allowMultiSelect: true
        }
      });

      _this._ddm.addEventListener('DragDrop.ContainmentChange', _this._onOrderChange);

      _this._subfieldContainer = new DropSite();
      _this.addChild(_this._subfieldContainer.view(), ".multifield__fields");
      _this._ddm.addDropSite(_this._subfieldContainer);

      _this.buttons = {
        add: Button.create({
          id: "multifield__add",
          label: model.get('addButtonLabel'),
          eventName: "MultiField.AddFieldRequest",
          style: "add"
        })
      };

      _this.addChild(_this.buttons.add.view(), ".multifield__buttons");

      _this._render(model);
      _this._renderFields(model);
      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(MultifieldView, [{
      key: '_onOrderChange',
      value: function _onOrderChange(evt) {
        this.dispatchEvent('MultiField.OrderChangeRequest', {
          order: this._subfieldContainer.export()
        });
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(MultifieldView.prototype.__proto__ || Object.getPrototypeOf(MultifieldView.prototype), '_onModelChange', this).call(this, evt);
        if (evt.data.path == "locked") {
          this._handleLockedFields(evt.data.value);
        } else if (evt.data.path == "fields") {
          this._renderFields(evt.currentTarget);
        } else {
          this._render(evt.currentTarget);
        }
      }
    }, {
      key: '_render',
      value: function _render(model) {
        this._labelContainer.html(model.get('label'));

        this.$el.toggleClass("field__error", model.get('hasError'));
        if (model.get('disabled')) {
          Object.values(this._fieldWraps).forEach(function (fw) {
            fw.lock();
          });
          this._ddm.disable();
          Object.values(this.buttons).forEach(function (btn) {
            btn.disable();
          });
        } else {
          if (model.get('sortable')) {
            this._ddm.enable();
          } else {
            this._ddm.disable();
          }
          this._handleLockedFields(model.get('locked'));
          Object.values(this.buttons).forEach(function (btn) {
            btn.enable();
          });
        }
      }
    }, {
      key: '_renderFields',
      value: function _renderFields(model) {
        var _this2 = this;

        this._subfieldContainer.empty();

        model.get('fields').forEach(function (field, ind) {
          var wrap = void 0;
          if (Utils.exists(!_this2._fieldWraps[field.id()])) {
            wrap = new FieldWrap({
              modelData: {
                trigger: model.get('dragTrigger'),
                field: field,
                classes: model.get('dragClasses')
              }
            });
            _this2._fieldWraps[field.id()] = wrap;
            _this2._ddm.addDragItem(wrap);
          } else {
            wrap = _this2._fieldWraps[field.id()];
          }
          _this2._subfieldContainer.receive([wrap]);
        });

        if (Utils.exists(model.get('max')) && this._subfieldContainer.count() >= model.get('max')) {
          this.buttons.add.view().hide();
        } else {
          this.buttons.add.view().show();
        }

        var item = void 0;
        if (this._subfieldContainer.count() <= model.get('min')) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this._subfieldContainer.items()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              item = _step.value;

              item.hideRemoveButton();
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
        } else {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this._subfieldContainer.items()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              item = _step2.value;

              item.showRemoveButton();
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
        }
      }
    }, {
      key: '_handleLockedFields',
      value: function _handleLockedFields(locked) {
        var lockedViews = Array.from(locked).map(function (field) {
          return field.view();
        });
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this._subfieldContainer.items()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var field = _step3.value;

            if (lockedViews.includes(field.fieldView())) {
              field.lock();
            } else {
              field.unlock();
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
    }, {
      key: 'focus',
      value: function focus() {
        if (this._subfieldContainer.items().length) {
          this._subfieldContainer.items()[0].focus();
        }
      }
    }]);

    return MultifieldView;
  }(FieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkZpZWxkVmlldyIsIlRlbXBsYXRlIiwiQnV0dG9uIiwiRmllbGRXcmFwIiwiRHJvcFNpdGUiLCJEcmFnRHJvcE1hbmFnZXIiLCJVdGlscyIsIkRvbVZpZXciLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9sYWJlbENvbnRhaW5lciIsIiRlbCIsImZpbmQiLCJfZmllbGRXcmFwcyIsIl9kZG0iLCJtb2RlbERhdGEiLCJib3VuZHMiLCJhbGxvd011bHRpU2VsZWN0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk9yZGVyQ2hhbmdlIiwiX3N1YmZpZWxkQ29udGFpbmVyIiwiYWRkQ2hpbGQiLCJ2aWV3IiwiYWRkRHJvcFNpdGUiLCJidXR0b25zIiwiYWRkIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsImdldCIsImV2ZW50TmFtZSIsInN0eWxlIiwiX3JlbmRlciIsIl9yZW5kZXJGaWVsZHMiLCJfb25Nb2RlbENoYW5nZSIsImV2dCIsImRpc3BhdGNoRXZlbnQiLCJvcmRlciIsImV4cG9ydCIsImRhdGEiLCJwYXRoIiwiX2hhbmRsZUxvY2tlZEZpZWxkcyIsInZhbHVlIiwiY3VycmVudFRhcmdldCIsImh0bWwiLCJ0b2dnbGVDbGFzcyIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJmdyIsImxvY2siLCJkaXNhYmxlIiwiYnRuIiwiZW5hYmxlIiwiZW1wdHkiLCJmaWVsZCIsImluZCIsIndyYXAiLCJleGlzdHMiLCJ0cmlnZ2VyIiwiY2xhc3NlcyIsImFkZERyYWdJdGVtIiwicmVjZWl2ZSIsImNvdW50IiwiaGlkZSIsInNob3ciLCJpdGVtIiwiaXRlbXMiLCJoaWRlUmVtb3ZlQnV0dG9uIiwic2hvd1JlbW92ZUJ1dHRvbiIsImxvY2tlZCIsImxvY2tlZFZpZXdzIiwiQXJyYXkiLCJmcm9tIiwibWFwIiwiaW5jbHVkZXMi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QTtBQUN2RCxpQ0FBYSxLQUFLVCxrQkFBTCxDQUF3QitDLEtBQXhCLEVBQWIsOEhBQThDO0FBQXpDRCxrQkFBeUM7O0FBQzVDQSxtQkFBS0UsZ0JBQUw7QUFDRDtBQUhzRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSXhELFNBSkQsTUFLSztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNILGtDQUFhLEtBQUtoRCxrQkFBTCxDQUF3QitDLEtBQXhCLEVBQWIsbUlBQThDO0FBQXpDRCxrQkFBeUM7O0FBQzVDQSxtQkFBS0csZ0JBQUw7QUFDRDtBQUhFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJSjtBQUNGO0FBdEhIO0FBQUE7QUFBQSwwQ0F3SHNCQyxNQXhIdEIsRUF3SDhCO0FBQzFCLFlBQUlDLGNBQWNDLE1BQU1DLElBQU4sQ0FBV0gsTUFBWCxFQUFtQkksR0FBbkIsQ0FBdUIsVUFBQ25CLEtBQUQ7QUFBQSxpQkFBV0EsTUFBTWpDLElBQU4sRUFBWDtBQUFBLFNBQXZCLENBQWxCO0FBRDBCO0FBQUE7QUFBQTs7QUFBQTtBQUUxQixnQ0FBa0IsS0FBS0Ysa0JBQUwsQ0FBd0IrQyxLQUF4QixFQUFsQixtSUFBbUQ7QUFBQSxnQkFBMUNaLEtBQTBDOztBQUNqRCxnQkFBSWdCLFlBQVlJLFFBQVosQ0FBcUJwQixNQUFNcUIsU0FBTixFQUFyQixDQUFKLEVBQTZDO0FBQzNDckIsb0JBQU1MLElBQU47QUFDRCxhQUZELE1BRU87QUFDTEssb0JBQU1zQixNQUFOO0FBQ0Q7QUFDRjtBQVJ5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUzNCO0FBaklIO0FBQUE7QUFBQSw4QkFtSVU7QUFDTixZQUFJLEtBQUt6RCxrQkFBTCxDQUF3QitDLEtBQXhCLEdBQWdDVyxNQUFwQyxFQUE0QztBQUMxQyxlQUFLMUQsa0JBQUwsQ0FBd0IrQyxLQUF4QixHQUFnQyxDQUFoQyxFQUFtQ1ksS0FBbkM7QUFDRDtBQUNGO0FBdklIOztBQUFBO0FBQUEsSUFBb0NoRixTQUFwQztBQXlJRCxDQXJKRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvbXVsdGlmaWVsZC92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
