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
    }]);

    return BodyConfigurationsModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2RlbCIsIlV0aWxzIiwiZGVmYXVsdHMiLCJpZCIsInNlbGVjdGVkIiwiZGVmYXVsdENvbmZpZ3MiLCJzZXR0aW5ncyIsImRhdGEiLCJndWlkNCIsImVuc3VyZURlZmF1bHRzIiwiYmluZE1ldGhvZHMiLCJjb25maWdOYW1lIiwiY29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVc7QUFDVEMsUUFBSSxDQURLO0FBRVRDLGNBQVU7QUFGRCxHQUZiOztBQU9BLE1BQU1DLGlCQUFpQk4sUUFBUSxpQkFBUixDQUF2Qjs7QUFHQTtBQUFBOztBQUNFLHVDQUEyQjtBQUFBLFVBQWZPLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLElBQVQsQ0FBY0osRUFBZCxHQUFtQkcsU0FBU0MsSUFBVCxDQUFjSixFQUFkLElBQW9CRixNQUFNTyxLQUFOLEVBQXZDO0FBQ0FGLGVBQVNKLFFBQVQsR0FBb0JELE1BQU1RLGNBQU4sQ0FBcUJILFNBQVNKLFFBQTlCLEVBQXdDQSxRQUF4QyxDQUFwQjs7QUFGeUIsb0pBR25CSSxRQUhtQjs7QUFLekJMLFlBQU1TLFdBQU4sUUFBd0IsQ0FBQyxZQUFELEVBQWMsYUFBZCxFQUE0QixlQUE1QixDQUF4Qjs7QUFMeUI7QUFPMUI7O0FBUkg7QUFBQTtBQUFBLG1DQVVlO0FBQ1gsYUFBS0wsY0FBTCxHQUFzQkEsY0FBdEI7QUFDTjtBQUNNLGFBQUtBLGNBQUwsQ0FBb0IsZ0JBQXBCLElBQXdDLEVBQUNGLElBQUcsYUFBSixFQUF4QztBQUNEO0FBZEg7QUFBQTtBQUFBLGtDQWdCY1EsVUFoQmQsRUFnQjBCO0FBQ3RCLGVBQU8sS0FBS04sY0FBTCxDQUFvQk0sVUFBcEIsRUFBZ0NSLEVBQXZDO0FBQ0Q7QUFsQkg7QUFBQTtBQUFBLG9DQW9CZ0JRLFVBcEJoQixFQW9CNEI7QUFDeEIsZUFBTyxLQUFLTixjQUFMLENBQW9CTSxVQUFwQixFQUFnQ0MsTUFBdkM7QUFDRDtBQXRCSDs7QUFBQTtBQUFBLElBQTZDWixLQUE3QztBQXdCRCxDQW5DRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgaWQ6IDAsXG4gICAgICBzZWxlY3RlZDogZmFsc2VcbiAgICB9XG5cbiAgY29uc3QgZGVmYXVsdENvbmZpZ3MgPSByZXF1aXJlKCcuL2xpc3RvZmNvbmZpZ3MnKVxuXG5cbiAgcmV0dXJuIGNsYXNzIEJvZHlDb25maWd1cmF0aW9uc01vZGVsIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLmRhdGEuaWQgPSBzZXR0aW5ncy5kYXRhLmlkIHx8IFV0aWxzLmd1aWQ0KCk7XG4gICAgICBzZXR0aW5ncy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKHNldHRpbmdzLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG5cbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnc2V0Q29uZmlncycsJ2dldENvbmZpZ0lkJywnZ2V0Q29uZmlnSlNPTiddKVxuXG4gICAgfVxuXG4gICAgc2V0Q29uZmlncygpIHtcbiAgICAgIHRoaXMuZGVmYXVsdENvbmZpZ3MgPSBkZWZhdWx0Q29uZmlncztcbi8vICAgICAgdGhpcy5kZWZhdWx0Q29uZmlnc1snbGFiZWxzJ10gPSB7aWQ6J2xhYmVscyd9O1xuICAgICAgdGhpcy5kZWZhdWx0Q29uZmlnc1snYm9keWJhY2tncm91bmQnXSA9IHtpZDonYm9keWJja2dybmQnfTtcbiAgICB9XG5cbiAgICBnZXRDb25maWdJZChjb25maWdOYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0Q29uZmlnc1tjb25maWdOYW1lXS5pZFxuICAgIH1cblxuICAgIGdldENvbmZpZ0pTT04oY29uZmlnTmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdENvbmZpZ3NbY29uZmlnTmFtZV0uY29uZmlnXG4gICAgfVxuICB9XG59KTtcbiJdfQ==
