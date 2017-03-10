'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    id: 0,
    selected: false,
    trigger: ".dragitem__grip"
  };

  return function (_Model) {
    _inherits(DragItemModel, _Model);

    function DragItemModel() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, DragItemModel);

      settings.data.id = settings.data.id || Utils.guid4();
      settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(DragItemModel).call(this, settings));
    }

    return DragItemModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcmFnaXRlbS9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxRQUFRLFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFdBQVc7QUFDVCxRQUFJLENBREs7QUFFVCxjQUFVLEtBRkQ7QUFHVCxhQUFTO0FBSEEsR0FGYjs7QUFRQTtBQUFBOztBQUNFLDZCQUEyQjtBQUFBLFVBQWYsUUFBZSx5REFBSixFQUFJOztBQUFBOztBQUN6QixlQUFTLElBQVQsQ0FBYyxFQUFkLEdBQW1CLFNBQVMsSUFBVCxDQUFjLEVBQWQsSUFBb0IsTUFBTSxLQUFOLEVBQXZDO0FBQ0EsZUFBUyxRQUFULEdBQW9CLE1BQU0sY0FBTixDQUFxQixTQUFTLFFBQTlCLEVBQXdDLFFBQXhDLENBQXBCO0FBRnlCLDhGQUduQixRQUhtQjtBQUkxQjs7QUFMSDtBQUFBLElBQW1DLEtBQW5DO0FBT0QsQ0FoQkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2RyYWdkcm9wL2RyYWdpdGVtL21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
