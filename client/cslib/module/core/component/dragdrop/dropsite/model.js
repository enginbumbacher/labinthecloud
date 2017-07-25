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
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, DropSiteModel);

      config.data = Utils.ensureDefaults(config.data, { id: Utils.guid4() });
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (DropSiteModel.__proto__ || Object.getPrototypeOf(DropSiteModel)).call(this, config));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcm9wc2l0ZS9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsImRlZmF1bHRzIiwiaWQiLCJpdGVtcyIsInNvcnRhYmxlIiwib3ZlcmxhcFR5cGUiLCJzdHlsZSIsImNvbmZpZyIsImRhdGEiLCJlbnN1cmVEZWZhdWx0cyIsImd1aWQ0IiwiZHJhZ0l0ZW1zIiwiaW5kZXgiLCJnZXQiLCJpdGVtIiwiY29udGFpbmVyIiwiZXhpc3RzIiwiaW5kZXhPZiIsIk1hdGgiLCJtYXgiLCJyZW1vdmUiLCJhcmdzIiwic2xpY2UiLCJ1bnNoaWZ0IiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzcGxpY2UiLCJhcHBseSIsImNvbmNhdCIsInNldCIsImRpc3BhdGNoRXZlbnQiLCJkcmFnSXRlbSIsImxlbmd0aCIsIm1hcCIsImV4cG9ydCIsImluY2x1ZGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVc7QUFDVEMsUUFBSSxDQURLO0FBRVRDLFdBQU8sRUFGRTtBQUdUQyxjQUFVLElBSEQ7QUFJVEMsaUJBQWEsT0FKSjtBQUtUQyxXQUFPO0FBTEUsR0FGYjs7QUFVQTtBQUFBOztBQUNFLDZCQUF5QjtBQUFBLFVBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFDdkJBLGFBQU9DLElBQVAsR0FBY1IsTUFBTVMsY0FBTixDQUFxQkYsT0FBT0MsSUFBNUIsRUFBa0MsRUFBRU4sSUFBSUYsTUFBTVUsS0FBTixFQUFOLEVBQWxDLENBQWQ7QUFDQUgsYUFBT04sUUFBUCxHQUFrQkQsTUFBTVMsY0FBTixDQUFxQkYsT0FBT04sUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBRnVCLDJI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
