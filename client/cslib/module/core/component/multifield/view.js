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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultifieldView).call(this, model, tmpl || Template));

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
        _get(Object.getPrototypeOf(MultifieldView.prototype), '_onModelChange', this).call(this, evt);
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
        if (model.get('sortable')) {
          this._ddm.enable();
        } else {
          this._ddm.disable();
        }

        this._labelContainer.html(model.get('label'));

        this.$el.toggleClass("field__error", model.get('hasError'));
        this._handleLockedFields(model.get('locked'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFlBQVksUUFBUSxnQ0FBUixDQUFsQjtBQUFBLE1BQ0UsV0FBVyxRQUFRLHVCQUFSLENBRGI7QUFBQSxNQUVFLFNBQVMsUUFBUSw2QkFBUixDQUZYO0FBQUEsTUFHRSxZQUFZLFFBQVEsdUJBQVIsQ0FIZDtBQUFBLE1BSUUsV0FBVyxRQUFRLDJDQUFSLENBSmI7QUFBQSxNQUtFLGtCQUFrQixRQUFRLGlDQUFSLENBTHBCO0FBQUEsTUFNRSxRQUFRLFFBQVEsaUJBQVIsQ0FOVjtBQUFBLE1BT0UsVUFBVSxRQUFRLG9CQUFSLENBUFo7QUFTQSxVQUFRLHVCQUFSOztBQUVBO0FBQUE7O0FBQ0UsNEJBQVksS0FBWixFQUFtQixJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9HQUNqQixLQURpQixFQUNWLFFBQVEsUUFERTs7QUFFdkIsWUFBTSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsZ0JBQW5CLENBQXhCOztBQUVBLFlBQUssZUFBTCxHQUF1QixNQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsb0JBQWQsQ0FBdkI7QUFDQSxZQUFLLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUEsWUFBSyxJQUFMLEdBQVksSUFBSSxlQUFKLENBQW9CO0FBQzlCLG1CQUFXO0FBQ1Qsa0JBQVEsSUFBSSxPQUFKLENBQVksTUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLHFCQUFkLENBQVosQ0FEQztBQUVULDRCQUFrQjtBQUZUO0FBRG1CLE9BQXBCLENBQVo7O0FBT0EsWUFBSyxJQUFMLENBQVUsZ0JBQVYsQ0FBMkIsNEJBQTNCLEVBQXlELE1BQUssY0FBOUQ7O0FBRUEsWUFBSyxrQkFBTCxHQUEwQixJQUFJLFFBQUosRUFBMUI7QUFDQSxZQUFLLFFBQUwsQ0FBYyxNQUFLLGtCQUFMLENB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VixDQUFiLEtBQWtDLEtBQUssa0JBQUwsQ0FBd0IsS0FBeEIsTUFBbUMsTUFBTSxHQUFOLENBQVUsS0FBVixDQUF6RSxFQUEyRjtBQUN6RixlQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLElBQWpCLEdBQXdCLElBQXhCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBSyxPQUFMLENBQWEsR0FBYixDQUFpQixJQUFqQixHQUF3QixJQUF4QjtBQUNEOztBQUVELFlBQUksYUFBSjtBQUNBLFlBQUksS0FBSyxrQkFBTCxDQUF3QixLQUF4QixNQUFtQyxNQUFNLEdBQU4sQ0FBVSxLQUFWLENBQXZDLEVBQXlEO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3ZELGlDQUFhLEtBQUssa0JBQUwsQ0FBd0IsS0FBeEIsRUFBYiw4SEFBOEM7QUFBekMsa0JBQXlDOztBQUM1QyxtQkFBSyxnQkFBTDtBQUNEO0FBSHNEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJeEQsU0FKRCxNQUtLO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0gsa0NBQWEsS0FBSyxrQkFBTCxDQUF3QixLQUF4QixFQUFiLG1JQUE4QztBQUF6QyxrQkFBeUM7O0FBQzVDLG1CQUFLLGdCQUFMO0FBQ0Q7QUFIRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUo7QUFDRjtBQXpHSDtBQUFBO0FBQUEsMENBMkdzQixNQTNHdEIsRUEyRzhCO0FBQzFCLFlBQUksY0FBYyxNQUFNLElBQU4sQ0FBVyxNQUFYLEVBQW1CLEdBQW5CLENBQXVCLFVBQUMsS0FBRDtBQUFBLGlCQUFXLE1BQU0sSUFBTixFQUFYO0FBQUEsU0FBdkIsQ0FBbEI7QUFEMEI7QUFBQTtBQUFBOztBQUFBO0FBRTFCLGdDQUFrQixLQUFLLGtCQUFMLENBQXdCLEtBQXhCLEVBQWxCLG1JQUFtRDtBQUFBLGdCQUExQyxLQUEwQzs7QUFDakQsZ0JBQUksWUFBWSxRQUFaLENBQXFCLE1BQU0sU0FBTixFQUFyQixDQUFKLEVBQTZDO0FBQzNDLG9CQUFNLElBQU47QUFDRCxhQUZELE1BRU87QUFDTCxvQkFBTSxNQUFOO0FBQ0Q7QUFDRjtBQVJ5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUzNCO0FBcEhIO0FBQUE7QUFBQSw4QkFzSFU7QUFDTixZQUFJLEtBQUssa0JBQUwsQ0FBd0IsS0FBeEIsR0FBZ0MsTUFBcEMsRUFBNEM7QUFDMUMsZUFBSyxrQkFBTCxDQUF3QixLQUF4QixHQUFnQyxDQUFoQyxFQUFtQyxLQUFuQztBQUNEO0FBQ0Y7QUExSEg7O0FBQUE7QUFBQSxJQUFvQyxTQUFwQztBQTRIRCxDQXhJRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvbXVsdGlmaWVsZC92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
