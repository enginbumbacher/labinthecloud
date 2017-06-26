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
    selected: false
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZU1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsImlkIiwidGl0bGUiLCJjb250ZW50Iiwic2VsZWN0ZWQiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImRhdGEiLCJndWlkNCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSxrQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BR0VHLFdBQVc7QUFDVEMsUUFBSSxJQURLO0FBRVRDLFdBQU8sRUFGRTtBQUdUQyxhQUFTLElBSEE7QUFJVEMsY0FBVTtBQUpELEdBSGI7O0FBVUE7QUFBQTs7QUFDRSxzQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT0wsUUFBUCxHQUFrQkQsTUFBTU8sY0FBTixDQUFxQkQsT0FBT0wsUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBQ0EsVUFBSSxDQUFDSyxPQUFPRSxJQUFQLENBQVlOLEVBQWpCLEVBQXFCSSxPQUFPRSxJQUFQLENBQVlOLEVBQVosR0FBaUJGLE1BQU1TLEtBQU4sRUFBakI7QUFGSCxpSEFHWkgsTUFIWTtBQUluQjs7QUFMSDtBQUFBLElBQThCUCxTQUE5QjtBQU9ELENBbEJEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYi9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
