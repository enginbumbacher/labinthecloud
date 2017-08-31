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
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, DragItemModel);

      settings.data.id = settings.data.id || Utils.guid4();
      settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
      return _possibleConstructorReturn(this, (DragItemModel.__proto__ || Object.getPrototypeOf(DragItemModel)).call(this, settings));
    }

    return DragItemModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcmFnaXRlbS9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsImRlZmF1bHRzIiwiaWQiLCJzZWxlY3RlZCIsInRyaWdnZXIiLCJzZXR0aW5ncyIsImRhdGEiLCJndWlkNCIsImVuc3VyZURlZmF1bHRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXO0FBQ1RDLFFBQUksQ0FESztBQUVUQyxjQUFVLEtBRkQ7QUFHVEMsYUFBUztBQUhBLEdBRmI7O0FBUUE7QUFBQTs7QUFDRSw2QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxJQUFULENBQWNKLEVBQWQsR0FBbUJHLFNBQVNDLElBQVQsQ0FBY0osRUFBZCxJQUFvQkYsTUFBTU8sS0FBTixFQUF2QztBQUNBRixlQUFTSixRQUFULEdBQW9CRCxNQUFNUSxjQUFOLENBQXFCSCxTQUFTSixRQUE5QixFQUF3Q0EsUUFBeEMsQ0FBcEI7QUFGeUIsMkhBR25CSSxRQUhtQjtBQUkxQjs7QUFMSDtBQUFBLElBQW1DTixLQUFuQztBQU9ELENBaEJEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcmFnaXRlbS9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgaWQ6IDAsXG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICB0cmlnZ2VyOiBcIi5kcmFnaXRlbV9fZ3JpcFwiXG4gICAgfVxuXG4gIHJldHVybiBjbGFzcyBEcmFnSXRlbU1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLmRhdGEuaWQgPSBzZXR0aW5ncy5kYXRhLmlkIHx8IFV0aWxzLmd1aWQ0KCk7XG4gICAgICBzZXR0aW5ncy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKHNldHRpbmdzLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgfVxuICB9XG59KTsiXX0=
