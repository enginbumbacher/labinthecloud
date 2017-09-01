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
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, DropSite);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      return _possibleConstructorReturn(this, (DropSite.__proto__ || Object.getPrototypeOf(DropSite)).call(this, settings));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS9kcm9wc2l0ZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJfbW9kZWwiLCJnZXQiLCJkcm9wSXRlbSIsImRyb3BJdGVtcyIsInBvc2l0aW9uIiwiaXNBcnJheSIsIndvcmtJdGVtcyIsImZpbHRlciIsIml0ZW0iLCJjb250YWlucyIsInJlY2VpdmUiLCJoYW5kbGVSZWNlcHRpb24iLCJfdmlldyIsImNsZWFyQ3Vyc29yIiwicmVtb3ZlIiwiZW1wdHkiLCJwcm94eSIsIm1vdXNlUG9zIiwiY2hlY2tPdmVybGFwIiwic29ydFBvc2l0aW9uIiwiZGlzcGF0Y2hFdmVudCIsImhhbmRsZUNhbmRpZGFjeSIsImxlbmd0aCIsImV4cG9ydCIsImRyYWdJdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWOztBQUtBO0FBQUE7O0FBQ0Usd0JBQTJCO0FBQUEsVUFBZkssUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QkosS0FBN0M7QUFDQUcsZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQkosSUFBM0M7QUFGeUIsaUhBR25CRSxRQUhtQjtBQUkxQjs7QUFMSDtBQUFBO0FBQUEsMkJBT087QUFDSCxlQUFPLEtBQUtHLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFUSDtBQUFBO0FBQUEsOEJBV1VDLFFBWFYsRUFXb0I7QUFDaEIsZUFBTyxJQUFQO0FBQ0Q7QUFiSDtBQUFBO0FBQUEsOEJBZVVDLFNBZlYsRUFlcUJDLFFBZnJCLEVBZStCO0FBQUE7O0FBQzNCLFlBQUksQ0FBQ1IsTUFBTVMsT0FBTixDQUFjRixTQUFkLENBQUwsRUFBK0I7QUFDN0JBLHNCQUFZLENBQUNBLFNBQUQsQ0FBWjtBQUNEO0FBQ0QsWUFBSUcsWUFBWUgsU0FBaEI7QUFDQSxZQUFJLENBQUMsS0FBS0gsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLENBQUwsRUFBa0M7QUFDaENLLHNCQUFZSCxVQUFVSSxNQUFWLENBQWlCLFVBQUNDLElBQUQ7QUFBQSxtQkFBVSxDQUFDLE9BQUtDLFFBQUwsQ0FBY0QsSUFBZCxDQUFYO0FBQUEsV0FBakIsQ0FBWjtBQUNEO0FBQ0QsYUFBS1IsTUFBTCxDQUFZVSxPQUFaLENBQW9CSixTQUFwQixFQUErQkYsUUFBL0I7QUFSMkI7QUFBQTtBQUFBOztBQUFBO0FBUzNCLCtCQUFpQkQsU0FBakIsOEhBQTRCO0FBQUEsZ0JBQW5CSyxJQUFtQjs7QUFDMUJBLGlCQUFLRyxlQUFMLENBQXFCLElBQXJCO0FBQ0Q7QUFYMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFZM0IsYUFBS0MsS0FBTCxDQUFXQyxXQUFYO0FBQ0Q7QUE1Qkg7QUFBQTtBQUFBLDZCQThCU1gsUUE5QlQsRUE4Qm1CO0FBQ2YsYUFBS0YsTUFBTCxDQUFZYyxNQUFaLENBQW1CWixRQUFuQjtBQUNEO0FBaENIO0FBQUE7QUFBQSw4QkFrQ1U7QUFDTixhQUFLRixNQUFMLENBQVllLEtBQVo7QUFDRDtBQXBDSDtBQUFBO0FBQUEsbUNBc0NlQyxLQXRDZixFQXNDc0JDLFFBdEN0QixFQXNDZ0M7QUFDNUIsWUFBSSxLQUFLTCxLQUFMLENBQVdNLFlBQVgsQ0FBd0JGLEtBQXhCLEVBQStCQyxRQUEvQixFQUF5QyxLQUFLakIsTUFBOUMsQ0FBSixFQUEyRDtBQUN6RCxjQUFJSSxXQUFXLEtBQUtRLEtBQUwsQ0FBV08sWUFBWCxDQUF3QkgsS0FBeEIsRUFBK0JDLFFBQS9CLEVBQXlDLEtBQUtqQixNQUE5QyxDQUFmO0FBQ0EsZUFBS29CLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFEO0FBQ25EaEIsc0JBQVVBO0FBRHlDLFdBQXJEO0FBR0QsU0FMRCxNQUtPO0FBQ0wsZUFBS2dCLGFBQUwsQ0FBbUIsOEJBQW5CLEVBQW1ELEVBQW5EO0FBQ0Q7QUFDRjtBQS9DSDtBQUFBO0FBQUEsc0NBaURrQmhCLFFBakRsQixFQWlENEI7QUFDeEIsYUFBS1EsS0FBTCxDQUFXUyxlQUFYLENBQTJCakIsUUFBM0I7QUFDRDtBQW5ESDtBQUFBO0FBQUEsNENBcUR3QjtBQUNwQixhQUFLUSxLQUFMLENBQVdDLFdBQVg7QUFDRDtBQXZESDtBQUFBO0FBQUEsOEJBeURVO0FBQ04sZUFBTyxLQUFLYixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUJxQixNQUFoQztBQUNEO0FBM0RIO0FBQUE7QUFBQSw4QkE2RFU7QUFDTixlQUFPLEtBQUt0QixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBUDtBQUNEO0FBL0RIO0FBQUE7QUFBQSxnQ0FpRVc7QUFDUCxlQUFPLEtBQUtELE1BQUwsQ0FBWXVCLE1BQVosRUFBUDtBQUNEO0FBbkVIO0FBQUE7QUFBQSwrQkFxRVdDLFFBckVYLEVBcUVxQjtBQUNqQixlQUFPLEtBQUt4QixNQUFMLENBQVlTLFFBQVosQ0FBcUJlLFFBQXJCLENBQVA7QUFDRDtBQXZFSDs7QUFBQTtBQUFBLElBQThCL0IsU0FBOUI7QUF5RUQsQ0EvRUQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2RyYWdkcm9wL2Ryb3BzaXRlL2Ryb3BzaXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpO1xuXG4gIHJldHVybiBjbGFzcyBEcm9wU2l0ZSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgYWNjZXB0cyhkcm9wSXRlbSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmVjZWl2ZShkcm9wSXRlbXMsIHBvc2l0aW9uKSB7XG4gICAgICBpZiAoIVV0aWxzLmlzQXJyYXkoZHJvcEl0ZW1zKSkge1xuICAgICAgICBkcm9wSXRlbXMgPSBbZHJvcEl0ZW1zXTtcbiAgICAgIH1cbiAgICAgIGxldCB3b3JrSXRlbXMgPSBkcm9wSXRlbXM7XG4gICAgICBpZiAoIXRoaXMuX21vZGVsLmdldCgnc29ydGFibGUnKSkge1xuICAgICAgICB3b3JrSXRlbXMgPSBkcm9wSXRlbXMuZmlsdGVyKChpdGVtKSA9PiAhdGhpcy5jb250YWlucyhpdGVtKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9tb2RlbC5yZWNlaXZlKHdvcmtJdGVtcywgcG9zaXRpb24pO1xuICAgICAgZm9yIChsZXQgaXRlbSBvZiBkcm9wSXRlbXMpIHtcbiAgICAgICAgaXRlbS5oYW5kbGVSZWNlcHRpb24odGhpcyk7XG4gICAgICB9XG4gICAgICB0aGlzLl92aWV3LmNsZWFyQ3Vyc29yKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGRyb3BJdGVtKSB7XG4gICAgICB0aGlzLl9tb2RlbC5yZW1vdmUoZHJvcEl0ZW0pO1xuICAgIH1cblxuICAgIGVtcHR5KCkge1xuICAgICAgdGhpcy5fbW9kZWwuZW1wdHkoKVxuICAgIH1cblxuICAgIGNoZWNrT3ZlcmxhcChwcm94eSwgbW91c2VQb3MpIHtcbiAgICAgIGlmICh0aGlzLl92aWV3LmNoZWNrT3ZlcmxhcChwcm94eSwgbW91c2VQb3MsIHRoaXMuX21vZGVsKSkge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLl92aWV3LnNvcnRQb3NpdGlvbihwcm94eSwgbW91c2VQb3MsIHRoaXMuX21vZGVsKVxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0Ryb3BTaXRlLk5vbWluYXRlRHJvcENhbmRpZGF0ZScsIHtcbiAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0Ryb3BTaXRlLlJldm9rZURyb3BDYW5kaWRhY3knLCB7fSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlQ2FuZGlkYWN5KHBvc2l0aW9uKSB7XG4gICAgICB0aGlzLl92aWV3LmhhbmRsZUNhbmRpZGFjeShwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaGFuZGxlTG9zdENhbmRpZGFjeSgpIHtcbiAgICAgIHRoaXMuX3ZpZXcuY2xlYXJDdXJzb3IoKTtcbiAgICB9XG5cbiAgICBjb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2l0ZW1zJykubGVuZ3RoO1xuICAgIH1cbiAgICBcbiAgICBpdGVtcygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2l0ZW1zJyk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmV4cG9ydCgpO1xuICAgIH1cblxuICAgIGNvbnRhaW5zKGRyYWdJdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuY29udGFpbnMoZHJhZ0l0ZW0pO1xuICAgIH1cbiAgfTtcbn0pOyJdfQ==
