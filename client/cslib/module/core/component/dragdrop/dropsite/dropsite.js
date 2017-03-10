'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  return function (_Component) {
    _inherits(DropSite, _Component);

    function DropSite() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, DropSite);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(DropSite).call(this, settings));
    }

    _createClass(DropSite, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'accepts',
      value: function accepts(dropItem) {
        return true;
      }
    }, {
      key: 'receive',
      value: function receive(dropItems, position) {
        var _this2 = this;

        if (!Utils.isArray(dropItems)) {
          dropItems = [dropItems];
        }
        var workItems = dropItems;
        if (!this._model.get('sortable')) {
          workItems = dropItems.filter(function (item) {
            return !_this2.contains(item);
          });
        }
        this._model.receive(workItems, position);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = dropItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            item.handleReception(this);
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

        this._view.clearCursor();
      }
    }, {
      key: 'remove',
      value: function remove(dropItem) {
        this._model.remove(dropItem);
      }
    }, {
      key: 'empty',
      value: function empty() {
        this._model.empty();
      }
    }, {
      key: 'checkOverlap',
      value: function checkOverlap(proxy, mousePos) {
        if (this._view.checkOverlap(proxy, mousePos, this._model)) {
          var position = this._view.sortPosition(proxy, mousePos, this._model);
          this.dispatchEvent('DropSite.NominateDropCandidate', {
            position: position
          });
        } else {
          this.dispatchEvent('DropSite.RevokeDropCandidacy', {});
        }
      }
    }, {
      key: 'handleCandidacy',
      value: function handleCandidacy(position) {
        this._view.handleCandidacy(position);
      }
    }, {
      key: 'handleLostCandidacy',
      value: function handleLostCandidacy() {
        this._view.clearCursor();
      }
    }, {
      key: 'count',
      value: function count() {
        return this._model.get('items').length;
      }
    }, {
      key: 'items',
      value: function items() {
        return this._model.get('items');
      }
    }, {
      key: 'export',
      value: function _export() {
        return this._model.export();
      }
    }, {
      key: 'contains',
      value: function contains(dragItem) {
        return this._model.contains(dragItem);
      }
    }]);

    return DropSite;
  }(Component);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS9kcm9wc2l0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFlBQVksUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0UsUUFBUSxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUUsT0FBTyxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0UsUUFBUSxRQUFRLGlCQUFSLENBSFY7O0FBS0E7QUFBQTs7QUFDRSx3QkFBMkI7QUFBQSxVQUFmLFFBQWUseURBQUosRUFBSTs7QUFBQTs7QUFDekIsZUFBUyxVQUFULEdBQXNCLFNBQVMsVUFBVCxJQUF1QixLQUE3QztBQUNBLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsSUFBM0M7QUFGeUIseUZBR25CLFFBSG1CO0FBSTFCOztBQUxIO0FBQUE7QUFBQSwyQkFPTztBQUNILGVBQU8sS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFUSDtBQUFBO0FBQUEsOEJBV1UsUUFYVixFQVdvQjtBQUNoQixlQUFPLElBQVA7QUFDRDtBQWJIO0FBQUE7QUFBQSw4QkFlVSxTQWZWLEVBZXFCLFFBZnJCLEVBZStCO0FBQUE7O0FBQzNCLFlBQUksQ0FBQyxNQUFNLE9BQU4sQ0FBYyxTQUFkLENBQUwsRUFBK0I7QUFDN0Isc0JBQVksQ0FBQyxTQUFELENBQVo7QUFDRDtBQUNELFlBQUksWUFBWSxTQUFoQjtBQUNBLFlBQUksQ0FBQyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFVBQWhCLENBQUwsRUFBa0M7QUFDaEMsc0JBQVksVUFBVSxNQUFWLENBQWlCLFVBQUMsSUFBRDtBQUFBLG1CQUFVLENBQUMsT0FBSyxRQUFMLENBQWMsSUFBZCxDQUFYO0FBQUEsV0FBakIsQ0FBWjtBQUNEO0FBQ0QsYUFBSyxNQUFMLENBQVksT0FBWixDQUFvQixTQUFwQixFQUErQixRQUEvQjtBQVIyQjtBQUFBO0FBQUE7O0FBQUE7QUFTM0IsK0JBQWlCLFNBQWpCLDhIQUE0QjtBQUFBLGdCQUFuQixJQUFtQjs7QUFDMUIsaUJBQUssZUFBTCxDQUFxQixJQUFyQjtBQUNEO0FBWDBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBWTNCLGFBQUssS0FBTCxDQUFXLFdBQVg7QUFDRDtBQTVCSDtBQUFBO0FBQUEsNkJBOEJTLFFBOUJULEVBOEJtQjtBQUNmLGFBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsUUFBbkI7QUFDRDtBQWhDSDtBQUFBO0FBQUEsOEJBa0NVO0FBQ04sYUFBSyxNQUFMLENBQVksS0FBWjtBQUNEO0FBcENIO0FBQUE7QUFBQSxtQ0FzQ2UsS0F0Q2YsRUFzQ3NCLFFBdEN0QixFQXNDZ0M7QUFDNUIsWUFBSSxLQUFLLEtBQUwsQ0FBVyxZQUFYLENBQXdCLEtBQXhCLEVBQStCLFFBQS9CLEVBQXlDLEtBQUssTUFBOUMsQ0FBSixFQUEyRDtBQUN6RCxjQUFJLFdBQVcsS0FBSyxLQUFMLENBQVcsWUFBWCxDQUF3QixLQUF4QixFQUErQixRQUEvQixFQUF5QyxLQUFLLE1BQTlDLENBQWY7QUFDQSxlQUFLLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFEO0FBQ25ELHNCQUFVO0FBRHlDLFdBQXJEO0FBR0QsU0FMRCxNQUtPO0FBQ0wsZUFBSyxhQUFMLENBQW1CLDhCQUFuQixFQUFtRCxFQUFuRDtBQUNEO0FBQ0Y7QUEvQ0g7QUFBQTtBQUFBLHNDQWlEa0IsUUFqRGxCLEVBaUQ0QjtBQUN4QixhQUFLLEtBQUwsQ0FBVyxlQUFYLENBQTJCLFFBQTNCO0FBQ0Q7QUFuREg7QUFBQTtBQUFBLDRDQXFEd0I7QUFDcEIsYUFBSyxLQUFMLENBQVcsV0FBWDtBQUNEO0FBdkRIO0FBQUE7QUFBQSw4QkF5RFU7QUFDTixlQUFPLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsTUFBaEM7QUFDRDtBQTNESDtBQUFBO0FBQUEsOEJBNkRVO0FBQ04sZUFBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE9BQWhCLENBQVA7QUFDRDtBQS9ESDtBQUFBO0FBQUEsZ0NBaUVXO0FBQ1AsZUFBTyxLQUFLLE1BQUwsQ0FBWSxNQUFaLEVBQVA7QUFDRDtBQW5FSDtBQUFBO0FBQUEsK0JBcUVXLFFBckVYLEVBcUVxQjtBQUNqQixlQUFPLEtBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsUUFBckIsQ0FBUDtBQUNEO0FBdkVIOztBQUFBO0FBQUEsSUFBOEIsU0FBOUI7QUF5RUQsQ0EvRUQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2RyYWdkcm9wL2Ryb3BzaXRlL2Ryb3BzaXRlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
