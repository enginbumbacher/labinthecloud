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
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, DragDropManagerModel);

      config.data = config.data || {};
      config.data.selected = config.data.selected || new Set();
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (DragDropManagerModel.__proto__ || Object.getPrototypeOf(DragDropManagerModel)).call(this, config));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsImRlZmF1bHRzIiwiYm91bmRzIiwiZHJhZ0l0ZW1zIiwiZHJvcFNpdGVzIiwicHJveHlWaWV3IiwiYWxsb3dNdWx0aVNlbGVjdCIsInNlbGVjdGVkIiwiY29uZmlnIiwiZGF0YSIsIlNldCIsImVuc3VyZURlZmF1bHRzIiwiZHJvcCIsInNldCIsImlkIiwiZ2V0IiwiaGFzIiwiZHJhZyIsIl9kZXNlbGVjdCIsImNsZWFyU2VsZWN0aW9uIiwiX3NlbGVjdCIsImFkZCIsInNlbGVjdCIsInJlbW92ZSIsImRlc2VsZWN0IiwiY29udGFpbnMiLCJmb3JFYWNoIiwiaXRlbSIsImNsZWFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVc7QUFDVEMsWUFBUSxNQURDO0FBRVRDLGVBQVcsRUFGRjtBQUdUQyxlQUFXLEVBSEY7QUFJVEMsZUFBVyxJQUpGO0FBS1RDLHNCQUFrQixLQUxUO0FBTVRDLGNBQVU7QUFORCxHQUZiOztBQVdBO0FBQUE7O0FBQ0Usb0NBQXlCO0FBQUEsVUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUN2QkEsYUFBT0MsSUFBUCxHQUFjRCxPQUFPQyxJQUFQLElBQWUsRUFBN0I7QUFDQUQsYUFBT0MsSUFBUCxDQUFZRixRQUFaLEdBQXVCQyxPQUFPQyxJQUFQLENBQVlGLFFBQVosSUFBd0IsSUFBSUcsR0FBSixFQUEvQztBQUNBRixhQUFPUCxRQUFQLEdBQWtCRCxNQUFNVyxjQUFOLENBQXFCSCxPQUFPUCxRQUE1QixFQUFzQ0EsUUFBdEMsQ0FBbEI7QUFIdUIseUlBSWpCTyxNQUppQjtBQUt4Qjs7QUFOSDtBQUFBO0FBQUEsa0NBUWNJLElBUmQsRUFRb0I7QUFDaEIsYUFBS0MsR0FBTCxnQkFBc0JELEtBQUtFLEVBQUwsRUFBdEIsRUFBbUNGLElBQW5DO0FBQ0Q7QUFWSDtBQUFBO0FBQUEscUNBWWlCQSxJQVpqQixFQVl1QjtBQUNuQixZQUFJLEtBQUtHLEdBQUwsQ0FBUyxVQUFULEVBQXFCQyxHQUFyQixDQUF5QkMsSUFBekIsQ0FBSixFQUFvQztBQUNsQyxlQUFLQyxTQUFMLENBQWVELElBQWY7QUFDRDtBQUNELGFBQUtKLEdBQUwsZ0JBQXNCRCxLQUFLRSxFQUFMLEVBQXRCLEVBQW1DLElBQW5DO0FBQ0Q7QUFqQkg7QUFBQTtBQUFBLGtDQW1CY0csSUFuQmQsRUFtQm9CO0FBQ2hCLGFBQUtKLEdBQUwsZ0JBQXNCSSxLQUFLSCxFQUFMLEVBQXRCLEVBQW1DRyxJQUFuQztBQUNEO0FBckJIO0FBQUE7QUFBQSxxQ0F1QmlCQSxJQXZCakIsRUF1QnVCO0FBQ25CLGFBQUtKLEdBQUwsZ0JBQXNCSSxLQUFLSCxFQUFMLEVBQXRCLEVBQW1DLElBQW5DO0FBQ0Q7QUF6Qkg7QUFBQTtBQUFBLDZCQTJCU0csSUEzQlQsRUEyQmU7QUFDWCxhQUFLRSxjQUFMO0FBQ0EsYUFBS0MsT0FBTCxDQUFhSCxJQUFiO0FBQ0Q7QUE5Qkg7QUFBQTtBQUFBLDhCQWdDVUEsSUFoQ1YsRUFnQ2dCO0FBQ1osYUFBS0YsR0FBTCxDQUFTLFVBQVQsRUFBcUJNLEdBQXJCLENBQXlCSixJQUF6QjtBQUNBQSxhQUFLSyxNQUFMO0FBQ0Q7QUFuQ0g7QUFBQTtBQUFBLGdDQXFDWUwsSUFyQ1osRUFxQ2tCO0FBQ2QsYUFBS0YsR0FBTCxDQUFTLFVBQVQsRUFBcUJRLE1BQXJCLENBQTRCTixJQUE1QjtBQUNBQSxhQUFLTyxRQUFMO0FBQ0Q7QUF4Q0g7QUFBQTtBQUFBLGtDQTBDY1AsSUExQ2QsRUEwQ29CO0FBQ2hCLFlBQUksS0FBS0YsR0FBTCxDQUFTLGtCQUFULENBQUosRUFBa0M7QUFDaEMsY0FBSSxLQUFLQSxHQUFMLENBQVMsVUFBVCxFQUFxQlUsUUFBckIsQ0FBOEJSLElBQTlCLENBQUosRUFBeUM7QUFDdkMsaUJBQUtDLFNBQUwsQ0FBZUQsSUFBZjtBQUNELFdBRkQsTUFFTztBQUNMLGlCQUFLRyxPQUFMLENBQWFILElBQWI7QUFDRDtBQUNGLFNBTkQsTUFNTztBQUNMLGVBQUtLLE1BQUwsQ0FBWUwsSUFBWjtBQUNEO0FBQ0Y7QUFwREg7QUFBQTtBQUFBLHVDQXNEbUI7QUFDZixhQUFLRixHQUFMLENBQVMsVUFBVCxFQUFxQlcsT0FBckIsQ0FBNkIsVUFBQ0MsSUFBRCxFQUFVO0FBQ3JDQSxlQUFLSCxRQUFMO0FBQ0QsU0FGRDtBQUdBLGFBQUtULEdBQUwsQ0FBUyxVQUFULEVBQXFCYSxLQUFyQjtBQUNEO0FBM0RIOztBQUFBO0FBQUEsSUFBMEM3QixLQUExQztBQTZERCxDQXpFRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZHJhZ2Ryb3AvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
