'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    bounds: 'body',
    dragItems: {},
    dropSites: {},
    proxyView: null,
    allowMultiSelect: false,
    selected: null
  };

  return function (_Model) {
    _inherits(DragDropManagerModel, _Model);

    function DragDropManagerModel() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, DragDropManagerModel);

      config.data = config.data || {};
      config.data.selected = config.data.selected || new Set();
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(DragDropManagerModel).call(this, config));
    }

    _createClass(DragDropManagerModel, [{
      key: 'addDropSite',
      value: function addDropSite(drop) {
        this.set('dropSites.' + drop.id(), drop);
      }
    }, {
      key: 'removeDropsite',
      value: function removeDropsite(drop) {
        if (this.get('selected').has(drag)) {
          this._deselect(drag);
        }
        this.set('dropSites.' + drop.id(), null);
      }
    }, {
      key: 'addDragItem',
      value: function addDragItem(drag) {
        this.set('dragItems.' + drag.id(), drag);
      }
    }, {
      key: 'removeDragItem',
      value: function removeDragItem(drag) {
        this.set('dragItems.' + drag.id(), null);
      }
    }, {
      key: 'select',
      value: function select(drag) {
        this.clearSelection();
        this._select(drag);
      }
    }, {
      key: '_select',
      value: function _select(drag) {
        this.get('selected').add(drag);
        drag.select();
      }
    }, {
      key: '_deselect',
      value: function _deselect(drag) {
        this.get('selected').remove(drag);
        drag.deselect();
      }
    }, {
      key: 'multiselect',
      value: function multiselect(drag) {
        if (this.get('allowMultiSelect')) {
          if (this.get('selected').contains(drag)) {
            this._deselect(drag);
          } else {
            this._select(drag);
          }
        } else {
          this.select(drag);
        }
      }
    }, {
      key: 'clearSelection',
      value: function clearSelection() {
        this.get('selected').forEach(function (item) {
          item.deselect();
        });
        this.get('selected').clear();
      }
    }]);

    return DragDropManagerModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFFBQVEsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsV0FBVztBQUNULFlBQVEsTUFEQztBQUVULGVBQVcsRUFGRjtBQUdULGVBQVcsRUFIRjtBQUlULGVBQVcsSUFKRjtBQUtULHNCQUFrQixLQUxUO0FBTVQsY0FBVTtBQU5ELEdBRmI7O0FBV0E7QUFBQTs7QUFDRSxvQ0FBeUI7QUFBQSxVQUFiLE1BQWEseURBQUosRUFBSTs7QUFBQTs7QUFDdkIsYUFBTyxJQUFQLEdBQWMsT0FBTyxJQUFQLElBQWUsRUFBN0I7QUFDQSxhQUFPLElBQVAsQ0FBWSxRQUFaLEdBQXVCLE9BQU8sSUFBUCxDQUFZLFFBQVosSUFBd0IsSUFBSSxHQUFKLEVBQS9DO0FBQ0EsYUFBTyxRQUFQLEdBQWtCLE1BQU0sY0FBTixDQUFxQixPQUFPLFFBQTVCLEVBQXNDLFFBQXRDLENBQWxCO0FBSHVCLHFHQUlqQixNQUppQjtBQUt4Qjs7QUFOSDtBQUFBO0FBQUEsa0NBUWMsSUFSZCxFQVFvQjtBQUNoQixhQUFLLEdBQUwsZ0JBQXNCLEtBQUssRUFBTCxFQUF0QixFQUFtQyxJQUFuQztBQUNEO0FBVkg7QUFBQTtBQUFBLHFDQVlpQixJQVpqQixFQVl1QjtBQUNuQixZQUFJLEtBQUssR0FBTCxDQUFTLFVBQVQsRUFBcUIsR0FBckIsQ0FBeUIsSUFBekIsQ0FBSixFQUFvQztBQUNsQyxlQUFLLFNBQUwsQ0FBZSxJQUFmO0FBQ0Q7QUFDRCxhQUFLLEdBQUwsZ0JBQXNCLEtBQUssRUFBTCxFQUF0QixFQUFtQyxJQUFuQztBQUNEO0FBakJIO0FBQUE7QUFBQSxrQ0FtQmMsSUFuQmQsRUFtQm9CO0FBQ2hCLGFBQUssR0FBTCxnQkFBc0IsS0FBSyxFQUFMLEVBQXRCLEVBQW1DLElBQW5DO0FBQ0Q7QUFyQkg7QUFBQTtBQUFBLHFDQXVCaUIsSUF2QmpCLEVBdUJ1QjtBQUNuQixhQUFLLEdBQUwsZ0JBQXNCLEtBQUssRUFBTCxFQUF0QixFQUFtQyxJQUFuQztBQUNEO0FBekJIO0FBQUE7QUFBQSw2QkEyQlMsSUEzQlQsRUEyQmU7QUFDWCxhQUFLLGNBQUw7QUFDQSxhQUFLLE9BQUwsQ0FBYSxJQUFiO0FBQ0Q7QUE5Qkg7QUFBQTtBQUFBLDhCQWdDVSxJQWhDVixFQWdDZ0I7QUFDWixhQUFLLEdBQUwsQ0FBUyxVQUFULEVBQXFCLEdBQXJCLENBQXlCLElBQXpCO0FBQ0EsYUFBSyxNQUFMO0FBQ0Q7QUFuQ0g7QUFBQTtBQUFBLGdDQXFDWSxJQXJDWixFQXFDa0I7QUFDZCxhQUFLLEdBQUwsQ0FBUyxVQUFULEVBQXFCLE1BQXJCLENBQTRCLElBQTVCO0FBQ0EsYUFBSyxRQUFMO0FBQ0Q7QUF4Q0g7QUFBQTtBQUFBLGtDQTBDYyxJQTFDZCxFQTBDb0I7QUFDaEIsWUFBSSxLQUFLLEdBQUwsQ0FBUyxrQkFBVCxDQUFKLEVBQWtDO0FBQ2hDLGNBQUksS0FBSyxHQUFMLENBQVMsVUFBVCxFQUFxQixRQUFyQixDQUE4QixJQUE5QixDQUFKLEVBQXlDO0FBQ3ZDLGlCQUFLLFNBQUwsQ0FBZSxJQUFmO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsaUJBQUssT0FBTCxDQUFhLElBQWI7QUFDRDtBQUNGLFNBTkQsTUFNTztBQUNMLGVBQUssTUFBTCxDQUFZLElBQVo7QUFDRDtBQUNGO0FBcERIO0FBQUE7QUFBQSx1Q0FzRG1CO0FBQ2YsYUFBSyxHQUFMLENBQVMsVUFBVCxFQUFxQixPQUFyQixDQUE2QixVQUFDLElBQUQsRUFBVTtBQUNyQyxlQUFLLFFBQUw7QUFDRCxTQUZEO0FBR0EsYUFBSyxHQUFMLENBQVMsVUFBVCxFQUFxQixLQUFyQjtBQUNEO0FBM0RIOztBQUFBO0FBQUEsSUFBMEMsS0FBMUM7QUE2REQsQ0F6RUQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2RyYWdkcm9wL21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
