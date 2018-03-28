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
    selected: false
  };

  var defaultConfigs = require('./listofconfigs');

  return function (_Model) {
    _inherits(BodyConfigurationsModel, _Model);

    function BodyConfigurationsModel() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, BodyConfigurationsModel);

      settings.data.id = settings.data.id || Utils.guid4();
      settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (BodyConfigurationsModel.__proto__ || Object.getPrototypeOf(BodyConfigurationsModel)).call(this, settings));

      Utils.bindMethods(_this, ['setConfigs', 'getConfigId', 'getConfigJSON']);

      return _this;
    }

    _createClass(BodyConfigurationsModel, [{
      key: 'setConfigs',
      value: function setConfigs() {
        this.defaultConfigs = defaultConfigs;
        //      this.defaultConfigs['labels'] = {id:'labels'};
        this.defaultConfigs['bodybackground'] = { id: 'bodybckgrnd' };
      }
    }, {
      key: 'getConfigId',
      value: function getConfigId(configName) {
        return this.defaultConfigs[configName].id;
      }
    }, {
      key: 'getConfigJSON',
      value: function getConfigJSON(configName) {
        return this.defaultConfigs[configName].config;
      }
    }, {
      key: 'getNumberOfSensors',
      value: function getNumberOfSensors(configName) {
        var numSensors = 0;
        Object.keys(this.defaultConfigs[configName].config).forEach(function (key) {
          if (key.toLowerCase().match('sensor')) numSensors += 1;
        });
        return numSensors;
      }
    }]);

    return BodyConfigurationsModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiZGVmYXVsdHMiLCJpZCIsInNlbGVjdGVkIiwiZGVmYXVsdENvbmZpZ3MiLCJzZXR0aW5ncyIsImRhdGEiLCJndWlkNCIsImVuc3VyZURlZmF1bHRzIiwiYmluZE1ldGhvZHMiLCJjb25maWdOYW1lIiwiY29uZmlnIiwibnVtU2Vuc29ycyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwidG9Mb3dlckNhc2UiLCJtYXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXO0FBQ1RDLFFBQUksQ0FESztBQUVUQyxjQUFVO0FBRkQsR0FGYjs7QUFPQSxNQUFNQyxpQkFBaUJOLFFBQVEsaUJBQVIsQ0FBdkI7O0FBR0E7QUFBQTs7QUFDRSx1Q0FBMkI7QUFBQSxVQUFmTyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxJQUFULENBQWNKLEVBQWQsR0FBbUJHLFNBQVNDLElBQVQsQ0FBY0osRUFBZCxJQUFvQkYsTUFBTU8sS0FBTixFQUF2QztBQUNBRixlQUFTSixRQUFULEdBQW9CRCxNQUFNUSxjQUFOLENBQXFCSCxTQUFTSixRQUE5QixFQUF3Q0EsUUFBeEMsQ0FBcEI7O0FBRnlCLG9KQUduQkksUUFIbUI7O0FBS3pCTCxZQUFNUyxXQUFOLFFBQXdCLENBQUMsWUFBRCxFQUFjLGFBQWQsRUFBNEIsZUFBNUIsQ0FBeEI7O0FBTHlCO0FBTzFCOztBQVJIO0FBQUE7QUFBQSxtQ0FVZTtBQUNYLGFBQUtMLGNBQUwsR0FBc0JBLGNBQXRCO0FBQ047QUFDTSxhQUFLQSxjQUFMLENBQW9CLGdCQUFwQixJQUF3QyxFQUFDRixJQUFHLGFBQUosRUFBeEM7QUFDRDtBQWRIO0FBQUE7QUFBQSxrQ0FnQmNRLFVBaEJkLEVBZ0IwQjtBQUN0QixlQUFPLEtBQUtOLGNBQUwsQ0FBb0JNLFVBQXBCLEVBQWdDUixFQUF2QztBQUNEO0FBbEJIO0FBQUE7QUFBQSxvQ0FvQmdCUSxVQXBCaEIsRUFvQjRCO0FBQ3hCLGVBQU8sS0FBS04sY0FBTCxDQUFvQk0sVUFBcEIsRUFBZ0NDLE1BQXZDO0FBQ0Q7QUF0Qkg7QUFBQTtBQUFBLHlDQXdCcUJELFVBeEJyQixFQXdCaUM7QUFDN0IsWUFBSUUsYUFBYSxDQUFqQjtBQUNBQyxlQUFPQyxJQUFQLENBQVksS0FBS1YsY0FBTCxDQUFvQk0sVUFBcEIsRUFBZ0NDLE1BQTVDLEVBQW9ESSxPQUFwRCxDQUE0RCxlQUFPO0FBQUUsY0FBSUMsSUFBSUMsV0FBSixHQUFrQkMsS0FBbEIsQ0FBd0IsUUFBeEIsQ0FBSixFQUF1Q04sY0FBYyxDQUFkO0FBQWtCLFNBQTlIO0FBQ0EsZUFBT0EsVUFBUDtBQUNEO0FBNUJIOztBQUFBO0FBQUEsSUFBNkNiLEtBQTdDO0FBOEJELENBekNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBpZDogMCxcbiAgICAgIHNlbGVjdGVkOiBmYWxzZVxuICAgIH1cblxuICBjb25zdCBkZWZhdWx0Q29uZmlncyA9IHJlcXVpcmUoJy4vbGlzdG9mY29uZmlncycpXG5cblxuICByZXR1cm4gY2xhc3MgQm9keUNvbmZpZ3VyYXRpb25zTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MuZGF0YS5pZCA9IHNldHRpbmdzLmRhdGEuaWQgfHwgVXRpbHMuZ3VpZDQoKTtcbiAgICAgIHNldHRpbmdzLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoc2V0dGluZ3MuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydzZXRDb25maWdzJywnZ2V0Q29uZmlnSWQnLCdnZXRDb25maWdKU09OJ10pXG5cbiAgICB9XG5cbiAgICBzZXRDb25maWdzKCkge1xuICAgICAgdGhpcy5kZWZhdWx0Q29uZmlncyA9IGRlZmF1bHRDb25maWdzO1xuLy8gICAgICB0aGlzLmRlZmF1bHRDb25maWdzWydsYWJlbHMnXSA9IHtpZDonbGFiZWxzJ307XG4gICAgICB0aGlzLmRlZmF1bHRDb25maWdzWydib2R5YmFja2dyb3VuZCddID0ge2lkOidib2R5YmNrZ3JuZCd9O1xuICAgIH1cblxuICAgIGdldENvbmZpZ0lkKGNvbmZpZ05hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRDb25maWdzW2NvbmZpZ05hbWVdLmlkXG4gICAgfVxuXG4gICAgZ2V0Q29uZmlnSlNPTihjb25maWdOYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0Q29uZmlnc1tjb25maWdOYW1lXS5jb25maWdcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZlNlbnNvcnMoY29uZmlnTmFtZSkge1xuICAgICAgdmFyIG51bVNlbnNvcnMgPSAwO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5kZWZhdWx0Q29uZmlnc1tjb25maWdOYW1lXS5jb25maWcpLmZvckVhY2goa2V5ID0+IHsgaWYgKGtleS50b0xvd2VyQ2FzZSgpLm1hdGNoKCdzZW5zb3InKSkgbnVtU2Vuc29ycyArPSAxOyB9KVxuICAgICAgcmV0dXJuIG51bVNlbnNvcnNcbiAgICB9XG4gIH1cbn0pO1xuIl19
