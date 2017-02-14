'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    id: 0,
    items: [],
    sortable: true,
    overlapType: "mouse",
    style: "list"
  };

  return function (_Model) {
    _inherits(DropSiteModel, _Model);

    function DropSiteModel() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, DropSiteModel);

      config.data = Utils.ensureDefaults(config.data, { id: Utils.guid4() });
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(DropSiteModel).call(this, config));
    }

    _createClass(DropSiteModel, [{
      key: 'receive',
      value: function receive(dragItems, index) {
        var items = this.get('items');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = dragItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            if (item.container()) {
              if (Utils.exists(index) && this.get('items').indexOf(item) < index) {
                index = Math.max(0, index - 1);
              }
              item.container().remove(item);
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

        if (Utils.exists(index) && this.get('sortable')) {
          var args = dragItems.slice(0);
          args.unshift(index, 0);
          Array.prototype.splice.apply(items, args);
        } else {
          items = items.concat(dragItems);
        }
        this.set('items', items);
        this.dispatchEvent('DropSite.ItemAdded', {
          items: dragItems,
          index: index
        });
      }
    }, {
      key: 'remove',
      value: function remove(dragItem) {
        var items = this.get('items');
        if (items.indexOf(dragItem) != -1) {
          items.splice(items.indexOf(dragItem), 1);
          this.set('items', items);
          this.dispatchEvent('DropSite.ItemRemoved', {
            item: dragItem
          });
        }
      }
    }, {
      key: 'empty',
      value: function empty() {
        while (this.get('items').length) {
          this.remove(this.get('items')[0]);
        }
      }
    }, {
      key: 'count',
      value: function count() {
        return this.get('items').length;
      }
    }, {
      key: 'export',
      value: function _export() {
        return this.get('items').map(function (item) {
          return item.export();
        });
      }
    }, {
      key: 'contains',
      value: function contains(dragItem) {
        return this.get('items').includes(dragItem);
      }
    }]);

    return DropSiteModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFFBQVEsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsV0FBVztBQUNULFFBQUksQ0FESztBQUVULFdBQU8sRUFGRTtBQUdULGNBQVUsSUFIRDtBQUlULGlCQUFhLE9BSko7QUFLVCxXQUFPO0FBTEUsR0FGYjs7QUFVQTtBQUFBOztBQUNFLDZCQUF5QjtBQUFBLFVBQWIsTUFBYSx5REFBSixFQUFJOztBQUFBOztBQUN2QixhQUFPLElBQVAsR0FBYyxNQUFNLGNBQU4sQ0FBcUIsT0FBTyxJQUE1QixFQUFrQyxFQUFFLElBQUksTUFBTSxLQUFOLEVBQU4sRUFBbEMsQ0FBZDtBQUNBLGFBQU8sUUFBUCxHQUFrQixNQUFNLGNBQU4sQ0FBcUIsT0FBTyxRQUE1QixFQUFzQyxRQUF0QyxDQUFsQjtBQUZ1Qiw4RkFHakIsTUFIaUI7QUFJeEI7O0FBTEg7QUFBQTtBQUFBLDhCQU9VLFNBUFYsRUFPcUIsS0FQckIsRUFPNEI7QUFDeEIsWUFBSSxRQUFRLEtBQUssR0FBTCxDQUFTLE9BQVQsQ0FBWjtBQUR3QjtBQUFBO0FBQUE7O0FBQUE7QUFFeEIsK0JBQWlCLFNBQWpCLDhIQUE0QjtBQUFBLGdCQUFuQixJQUFtQjs7QUFDMUIsZ0JBQUksS0FBSyxTQUFMLEVBQUosRUFBc0I7QUFDcEIsa0JBQUksTUFBTSxNQUFOLENBQWEsS0FBYixLQUF1QixLQUFLLEdBQUwsQ0FBUyxPQUFULEVBQWtCLE9BQWxCLENBQTBCLElBQTFCLElBQWtDLEtBQTdELEVBQW9FO0FBQ2xFLHdCQUFRLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxRQUFRLENBQXBCLENBQVI7QUFDRDtBQUNELG1CQUFLLFNBQUwsR0FBaUIsTUFBakIsQ0FBd0IsSUFBeEI7QUFDRDtBQUNGO0FBVHVCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBV3hCLFlBQUksTUFBTSxNQUFOLENBQWEsS0FBYixLQUF1QixLQUFLLEdBQUwsQ0FBUyxVQUFULENBQTNCLEVBQWlEO0FBQy9DLGNBQUksT0FBTyxVQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBWDtBQUNBLGVBQUssT0FBTCxDQUFhLEtBQWIsRUFBb0IsQ0FBcEI7QUFDQSxnQkFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLEtBQXZCLENBQTZCLEtBQTdCLEVBQW9DLElBQXBDO0FBQ0QsU0FKRCxNQUlPO0FBQ0wsa0JBQVEsTUFBTSxNQUFOLENBQWEsU0FBYixDQUFSO0FBQ0Q7QUFDRCxhQUFLLEdBQUwsQ0FBUyxPQUFULEVBQWtCLEtBQWxCO0FBQ0EsYUFBSyxhQUFMLENBQW1CLG9CQUFuQixFQUF5QztBQUN2QyxpQkFBTyxTQURnQztBQUV2QyxpQkFBTztBQUZnQyxTQUF6QztBQUlEO0FBOUJIO0FBQUE7QUFBQSw2QkFnQ1MsUUFoQ1QsRUFnQ21CO0FBQ2YsWUFBSSxRQUFRLEtBQUssR0FBTCxDQUFTLE9BQVQsQ0FBWjtBQUNBLFlBQUksTUFBTSxPQUFOLENBQWMsUUFBZCxLQUEyQixDQUFDLENBQWhDLEVBQW1DO0FBQ2pDLGdCQUFNLE1BQU4sQ0FBYSxNQUFNLE9BQU4sQ0FBYyxRQUFkLENBQWIsRUFBc0MsQ0FBdEM7QUFDQSxlQUFLLEdBQUwsQ0FBUyxPQUFULEVBQWtCLEtBQWxCO0FBQ0EsZUFBSyxhQUFMLENBQW1CLHNCQUFuQixFQUEyQztBQUN6QyxrQkFBTTtBQURtQyxXQUEzQztBQUdEO0FBQ0Y7QUF6Q0g7QUFBQTtBQUFBLDhCQTJDVTtBQUNOLGVBQU8sS0FBSyxHQUFMLENBQVMsT0FBVCxFQUFrQixNQUF6QixFQUFpQztBQUMvQixlQUFLLE1BQUwsQ0FBWSxLQUFLLEdBQUwsQ0FBUyxPQUFULEVBQWtCLENBQWxCLENBQVo7QUFDRDtBQUNGO0FBL0NIO0FBQUE7QUFBQSw4QkFpRFU7QUFDTixlQUFPLEtBQUssR0FBTCxDQUFTLE9BQVQsRUFBa0IsTUFBekI7QUFDRDtBQW5ESDtBQUFBO0FBQUEsZ0NBcURXO0FBQ1AsZUFBTyxLQUFLLEdBQUwsQ0FBUyxPQUFULEVBQWtCLEdBQWxCLENBQXNCLFVBQUMsSUFBRDtBQUFBLGlCQUFVLEtBQUssTUFBTCxFQUFWO0FBQUEsU0FBdEIsQ0FBUDtBQUNEO0FBdkRIO0FBQUE7QUFBQSwrQkF5RFcsUUF6RFgsRUF5RHFCO0FBQ2pCLGVBQU8sS0FBSyxHQUFMLENBQVMsT0FBVCxFQUFrQixRQUFsQixDQUEyQixRQUEzQixDQUFQO0FBQ0Q7QUEzREg7O0FBQUE7QUFBQSxJQUFtQyxLQUFuQztBQTZERCxDQXhFRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZHJhZ2Ryb3AvZHJvcHNpdGUvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
