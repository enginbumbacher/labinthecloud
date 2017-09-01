'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseModel = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    id: null,
    title: '',
    content: null,
    selected: false,
    disabled: false
  };

  return function (_BaseModel) {
    _inherits(TabModel, _BaseModel);

    function TabModel(config) {
      _classCallCheck(this, TabModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      if (!config.data.id) config.data.id = Utils.guid4();
      return _possibleConstructorReturn(this, (TabModel.__proto__ || Object.getPrototypeOf(TabModel)).call(this, config));
    }

    return TabModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZU1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsImlkIiwidGl0bGUiLCJjb250ZW50Iiwic2VsZWN0ZWQiLCJkaXNhYmxlZCIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwiZGF0YSIsImd1aWQ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLGtCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFHRUcsV0FBVztBQUNUQyxRQUFJLElBREs7QUFFVEMsV0FBTyxFQUZFO0FBR1RDLGFBQVMsSUFIQTtBQUlUQyxjQUFVLEtBSkQ7QUFLVEMsY0FBVTtBQUxELEdBSGI7O0FBV0E7QUFBQTs7QUFDRSxzQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT04sUUFBUCxHQUFrQkQsTUFBTVEsY0FBTixDQUFxQkQsT0FBT04sUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBQ0EsVUFBSSxDQUFDTSxPQUFPRSxJQUFQLENBQVlQLEVBQWpCLEVBQXFCSyxPQUFPRSxJQUFQLENBQVlQLEVBQVosR0FBaUJGLE1BQU1VLEtBQU4sRUFBakI7QUFGSCxpSEFHWkgsTUFIWTtBQUluQjs7QUFMSDtBQUFBLElBQThCUixTQUE5QjtBQU9ELENBbkJEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
