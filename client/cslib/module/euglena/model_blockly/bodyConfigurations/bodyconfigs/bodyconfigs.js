'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  var BodyConfigurations = function (_Component) {
    _inherits(BodyConfigurations, _Component);

    function BodyConfigurations() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, BodyConfigurations);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (BodyConfigurations.__proto__ || Object.getPrototypeOf(BodyConfigurations)).call(this, settings));

      Utils.bindMethods(_this, ['_importAllImages', 'setBodyOpacity', 'setActiveConfiguration', 'hide', 'show']);

      _this.activeConfigs = { 'sensorConfig': null, 'reaction': null, 'forward': null, 'roll': null };
      _this.opacity = null;

      _this._model.setConfigs();
      _this.modelModality = settings.modelData.modelModality;
      _this.allowedConfigs = settings.modelData.allowedConfigs;
      _this.paramOptions = settings.modelData.paramOptions;

      // MOVE THE FOLLOWING PARTS TO VIEW()

      _this.imgPath = 'cslib/module/euglena/model_blockly/bodyConfigurations/imgs/';
      _this._importAllImages();

      _this.setActiveConfiguration(settings.modelData.initialConfig.bodyConfigurationName);
      _this.setActiveConfiguration(settings.modelData.initialConfig.v);
      _this.setActiveConfiguration(settings.modelData.initialConfig.omega);
      _this.setActiveConfiguration(settings.modelData.initialConfig.k);
      _this.setBodyOpacity(settings.modelData.initialConfig.opacity);

      return _this;
    }

    _createClass(BodyConfigurations, [{
      key: 'setActiveConfiguration',
      value: function setActiveConfiguration(configName) {

        var configType = null;
        if (configName.qualitativeValue) {
          configType = configName.qualitativeValue;
        } else {
          configType = configName;
        }
        Object.keys(this.activeConfigs).some(function (config) {
          if (configType.match(config)) {
            configType = config;
            return true;
          }
        });

        var imgName = null;
        switch (configType) {
          case 'sensorConfig':
            if (this.activeConfigs['sensorConfig']) {
              this.hide(this._model.getConfigId(this.activeConfigs['sensorConfig']));

              if (this.activeConfigs['reaction']) {
                this.hide(this.activeConfigs['reaction']);
              }
            }
            this.activeConfigs['sensorConfig'] = configName;
            this.show(this._model.getConfigId(this.activeConfigs['sensorConfig']));

            if (this.activeConfigs['reaction']) {
              imgName = 'reaction' + '_' + this.modelModality + '_' + this._model.getConfigId(this.activeConfigs['sensorConfig']).toLowerCase().split('_')[1] + '_';
              imgName += this.activeConfigs['reaction'].split('_')[3];
              this.activeConfigs['reaction'] = imgName;
              this.show(this.activeConfigs['reaction']);
            }
            break;
          case 'reaction':
            if (this.activeConfigs['sensorConfig']) {
              if (this.activeConfigs['reaction']) {
                this.hide(this.activeConfigs['reaction']);
              }
              imgName = 'reaction' + '_' + this.modelModality + '_' + this._model.getConfigId(this.activeConfigs['sensorConfig']).toLowerCase().split('_')[1] + '_';
              imgName += configName.substr(configName.indexOf('_') + 1);
              this.activeConfigs['reaction'] = imgName;
              this.show(this.activeConfigs['reaction']);
            }
            break;
          case 'forward':
          case 'roll':
            if (this.activeConfigs[configType]) {
              this.hide(this.activeConfigs[configType]);
            }
            imgName = configType + '_' + this.modelModality + '_';
            imgName += configName.substr(configName.indexOf('_') + 1);
            this.activeConfigs[configType] = imgName;
            this.show(this.activeConfigs[configType]);
            break;
        }
      }
    }, {
      key: 'getActiveSensorConfiguration',
      value: function getActiveSensorConfiguration() {
        if (this.activeConfigs['sensorConfig']) {
          return this._model.getConfigJSON(this.activeConfigs['sensorConfig']);
        } else {
          return null;
        }
      }
    }, {
      key: 'setBodyOpacity',
      value: function setBodyOpacity(opacity) {
        if (typeof opacity === 'string') {
          opacity = parseInt(opacity.substr(opacity.indexOf('_') + 1)) / 100;
        } else {
          opacity = opacity.numericValue;
        }
        this.opacity = opacity;
        this.view()._setBodyOpacity(opacity);
      }
    }, {
      key: 'hide',
      value: function hide(configId) {
        this.view()._hideConfig(configId);
      }
    }, {
      key: 'show',
      value: function show(configId) {
        this.view()._showConfig(configId);
      }
    }, {
      key: '_importAllImages',
      value: function _importAllImages() {
        var _this2 = this;

        // Add the sensor configurations
        Object.keys(this._model.defaultConfigs).map(function (configuration) {

          _this2.view()._addLayer(_this2._model.defaultConfigs[configuration].id, _this2.imgPath);
        });

        var fileName = null;

        // Add the forward speed configurations, mechanistic or functional
        this.paramOptions['forward'].forEach(function (strength) {
          fileName = 'forward' + '_' + _this2.modelModality + '_';
          fileName += strength.substr(strength.indexOf('_') + 1);

          _this2.view()._addLayer(fileName, _this2.imgPath);
        });

        // Add the reaction configurations
        var sensorConfigs = ['back', 'front', 'backleft', 'backright', 'frontleft', 'frontright', 'frontcenter'];

        this.paramOptions['reaction'].forEach(function (strength) {
          sensorConfigs.forEach(function (sensorConfig) {
            fileName = 'reaction' + '_' + _this2.modelModality + '_' + sensorConfig + '_' + strength.substr(strength.indexOf('_') + 1);
            _this2.view()._addLayer(fileName, _this2.imgPath);
          });
        });

        // Add the roll configurations, mechanistic or functional
        this.paramOptions['roll'].forEach(function (strength) {
          fileName = 'roll' + '_' + _this2.modelModality + '_';
          fileName += strength.substr(strength.indexOf('_') + 1);

          _this2.view()._addLayer(fileName, _this2.imgPath);
        });
      }
    }, {
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'select',
      value: function select() {
        this._model.set('selected', true);
      }
    }, {
      key: 'deselect',
      value: function deselect() {
        this._model.set('selected', false);
      }
    }, {
      key: 'export',
      value: function _export() {
        return this._model.get('id');
      }
    }]);

    return BodyConfigurations;
  }(Component);

  ;

  BodyConfigurations.create = function (data) {
    return new BodyConfigurations({ modelData: data });
  };

  return BodyConfigurations;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIkJvZHlDb25maWd1cmF0aW9ucyIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiYWN0aXZlQ29uZmlncyIsIm9wYWNpdHkiLCJfbW9kZWwiLCJzZXRDb25maWdzIiwibW9kZWxNb2RhbGl0eSIsIm1vZGVsRGF0YSIsImFsbG93ZWRDb25maWdzIiwicGFyYW1PcHRpb25zIiwiaW1nUGF0aCIsIl9pbXBvcnRBbGxJbWFnZXMiLCJzZXRBY3RpdmVDb25maWd1cmF0aW9uIiwiaW5pdGlhbENvbmZpZyIsImJvZHlDb25maWd1cmF0aW9uTmFtZSIsInYiLCJvbWVnYSIsImsiLCJzZXRCb2R5T3BhY2l0eSIsImNvbmZpZ05hbWUiLCJjb25maWdUeXBlIiwicXVhbGl0YXRpdmVWYWx1ZSIsIk9iamVjdCIsImtleXMiLCJzb21lIiwiY29uZmlnIiwibWF0Y2giLCJpbWdOYW1lIiwiaGlkZSIsImdldENvbmZpZ0lkIiwic2hvdyIsInRvTG93ZXJDYXNlIiwic3BsaXQiLCJzdWJzdHIiLCJpbmRleE9mIiwiZ2V0Q29uZmlnSlNPTiIsInBhcnNlSW50IiwibnVtZXJpY1ZhbHVlIiwidmlldyIsIl9zZXRCb2R5T3BhY2l0eSIsImNvbmZpZ0lkIiwiX2hpZGVDb25maWciLCJfc2hvd0NvbmZpZyIsImRlZmF1bHRDb25maWdzIiwibWFwIiwiX2FkZExheWVyIiwiY29uZmlndXJhdGlvbiIsImlkIiwiZmlsZU5hbWUiLCJmb3JFYWNoIiwic3RyZW5ndGgiLCJzZW5zb3JDb25maWdzIiwic2Vuc29yQ29uZmlnIiwiZ2V0Iiwic2V0IiwiY3JlYXRlIiwiZGF0YSJdLCJtYXBwaW5ncyI6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QkFBbUIwRCxNQUFuQixHQUE0QixVQUFDQyxJQUFELEVBQVU7QUFDcEMsV0FBTyxJQUFJM0Qsa0JBQUosQ0FBdUIsRUFBRVUsV0FBV2lELElBQWIsRUFBdkIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBTzNELGtCQUFQO0FBQ0QsQ0FuTEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvYm9keWNvbmZpZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIGNsYXNzIEJvZHlDb25maWd1cmF0aW9ucyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX2ltcG9ydEFsbEltYWdlcycsJ3NldEJvZHlPcGFjaXR5JywgJ3NldEFjdGl2ZUNvbmZpZ3VyYXRpb24nLCAnaGlkZScsICdzaG93J10pXG5cbiAgICAgIHRoaXMuYWN0aXZlQ29uZmlncyA9IHsnc2Vuc29yQ29uZmlnJzogbnVsbCwgJ3JlYWN0aW9uJzogbnVsbCwgJ2ZvcndhcmQnOiBudWxsLCAncm9sbCc6IG51bGx9O1xuICAgICAgdGhpcy5vcGFjaXR5ID0gbnVsbDtcblxuICAgICAgdGhpcy5fbW9kZWwuc2V0Q29uZmlncygpIDtcbiAgICAgIHRoaXMubW9kZWxNb2RhbGl0eSA9IHNldHRpbmdzLm1vZGVsRGF0YS5tb2RlbE1vZGFsaXR5O1xuICAgICAgdGhpcy5hbGxvd2VkQ29uZmlncyA9IHNldHRpbmdzLm1vZGVsRGF0YS5hbGxvd2VkQ29uZmlncztcbiAgICAgIHRoaXMucGFyYW1PcHRpb25zID0gc2V0dGluZ3MubW9kZWxEYXRhLnBhcmFtT3B0aW9ucztcblxuICAgICAgLy8gTU9WRSBUSEUgRk9MTE9XSU5HIFBBUlRTIFRPIFZJRVcoKVxuXG4gICAgICB0aGlzLmltZ1BhdGggPSAnY3NsaWIvbW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvaW1ncy8nO1xuICAgICAgdGhpcy5faW1wb3J0QWxsSW1hZ2VzKCk7XG5cbiAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5ib2R5Q29uZmlndXJhdGlvbk5hbWUpO1xuICAgICAgdGhpcy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLnYpO1xuICAgICAgdGhpcy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLm9tZWdhKTtcbiAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5rKTtcbiAgICAgIHRoaXMuc2V0Qm9keU9wYWNpdHkoc2V0dGluZ3MubW9kZWxEYXRhLmluaXRpYWxDb25maWcub3BhY2l0eSk7XG5cbiAgICB9XG5cbiAgICBzZXRBY3RpdmVDb25maWd1cmF0aW9uKGNvbmZpZ05hbWUpIHtcblxuICAgICAgdmFyIGNvbmZpZ1R5cGUgPSBudWxsO1xuICAgICAgaWYgKGNvbmZpZ05hbWUucXVhbGl0YXRpdmVWYWx1ZSkge1xuICAgICAgICBjb25maWdUeXBlID0gY29uZmlnTmFtZS5xdWFsaXRhdGl2ZVZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maWdUeXBlID0gY29uZmlnTmFtZTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuYWN0aXZlQ29uZmlncykuc29tZShmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgaWYoY29uZmlnVHlwZS5tYXRjaChjb25maWcpKSB7XG4gICAgICAgICAgY29uZmlnVHlwZSA9IGNvbmZpZztcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgbGV0IGltZ05hbWUgPSBudWxsO1xuICAgICAgc3dpdGNoIChjb25maWdUeXBlKSB7XG4gICAgICAgIGNhc2UgJ3NlbnNvckNvbmZpZyc6XG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLl9tb2RlbC5nZXRDb25maWdJZCh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pIHtcbiAgICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10gPSBjb25maWdOYW1lO1xuICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLl9tb2RlbC5nZXRDb25maWdJZCh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKSB7XG4gICAgICAgICAgICBpbWdOYW1lID0gJ3JlYWN0aW9uJyArICdfJyArIHRoaXMubW9kZWxNb2RhbGl0eSArICdfJyArIHRoaXMuX21vZGVsLmdldENvbmZpZ0lkKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pLnRvTG93ZXJDYXNlKCkuc3BsaXQoJ18nKVsxXSArICdfJztcbiAgICAgICAgICAgIGltZ05hbWUgKz0gdGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddLnNwbGl0KCdfJylbM107XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10gPSBpbWdOYW1lO1xuICAgICAgICAgICAgdGhpcy5zaG93KHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSk7XG4gICAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVhY3Rpb24nOlxuICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKSB7XG4gICAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW1nTmFtZSA9ICdyZWFjdGlvbicgKyAnXycgKyB0aGlzLm1vZGVsTW9kYWxpdHkgKyAnXycgKyB0aGlzLl9tb2RlbC5nZXRDb25maWdJZCh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCdfJylbMV0gKyAnXyc7XG4gICAgICAgICAgICBpbWdOYW1lICs9IGNvbmZpZ05hbWUuc3Vic3RyKGNvbmZpZ05hbWUuaW5kZXhPZignXycpKzEpO1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddID0gaW1nTmFtZTtcbiAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pO1xuICAgICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmb3J3YXJkJzpcbiAgICAgICAgY2FzZSAncm9sbCc6XG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltZ05hbWUgPSBjb25maWdUeXBlICsgJ18nICsgdGhpcy5tb2RlbE1vZGFsaXR5ICsgJ18nO1xuICAgICAgICAgIGltZ05hbWUgKz0gY29uZmlnTmFtZS5zdWJzdHIoY29uZmlnTmFtZS5pbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdID0gaW1nTmFtZTtcbiAgICAgICAgICB0aGlzLnNob3codGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QWN0aXZlU2Vuc29yQ29uZmlndXJhdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0Q29uZmlnSlNPTih0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRCb2R5T3BhY2l0eShvcGFjaXR5KSB7XG4gICAgICBpZiAodHlwZW9mKG9wYWNpdHkpPT09J3N0cmluZycpIHtcbiAgICAgICAgb3BhY2l0eSA9IHBhcnNlSW50KG9wYWNpdHkuc3Vic3RyKG9wYWNpdHkuaW5kZXhPZignXycpKzEpKSAvIDEwMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wYWNpdHkgPSBvcGFjaXR5Lm51bWVyaWNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3BhY2l0eSA9IG9wYWNpdHk7XG4gICAgICB0aGlzLnZpZXcoKS5fc2V0Qm9keU9wYWNpdHkob3BhY2l0eSk7XG4gICAgfVxuXG4gICAgaGlkZShjb25maWdJZCkge1xuICAgICAgdGhpcy52aWV3KCkuX2hpZGVDb25maWcoY29uZmlnSWQpO1xuICAgIH1cblxuICAgIHNob3coY29uZmlnSWQpIHtcbiAgICAgIHRoaXMudmlldygpLl9zaG93Q29uZmlnKGNvbmZpZ0lkKTtcbiAgICB9XG5cbiAgICBfaW1wb3J0QWxsSW1hZ2VzKCkge1xuICAgICAgLy8gQWRkIHRoZSBzZW5zb3IgY29uZmlndXJhdGlvbnNcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmRlZmF1bHRDb25maWdzKS5tYXAoY29uZmlndXJhdGlvbiA9PiB7XG5cbiAgICAgICAgdGhpcy52aWV3KCkuX2FkZExheWVyKHRoaXMuX21vZGVsLmRlZmF1bHRDb25maWdzW2NvbmZpZ3VyYXRpb25dLmlkLCB0aGlzLmltZ1BhdGgpO1xuICAgICAgfSlcblxuICAgICAgbGV0IGZpbGVOYW1lID0gbnVsbDtcblxuICAgICAgLy8gQWRkIHRoZSBmb3J3YXJkIHNwZWVkIGNvbmZpZ3VyYXRpb25zLCBtZWNoYW5pc3RpYyBvciBmdW5jdGlvbmFsXG4gICAgICB0aGlzLnBhcmFtT3B0aW9uc1snZm9yd2FyZCddLmZvckVhY2goc3RyZW5ndGggPT4ge1xuICAgICAgICBmaWxlTmFtZSA9ICdmb3J3YXJkJyArICdfJyArIHRoaXMubW9kZWxNb2RhbGl0eSArICdfJztcbiAgICAgICAgZmlsZU5hbWUgKz0gc3RyZW5ndGguc3Vic3RyKHN0cmVuZ3RoLmluZGV4T2YoJ18nKSsxKVxuXG4gICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcbiAgICAgIH0pXG5cblxuICAgICAgLy8gQWRkIHRoZSByZWFjdGlvbiBjb25maWd1cmF0aW9uc1xuICAgICAgdmFyIHNlbnNvckNvbmZpZ3MgPSBbJ2JhY2snLCdmcm9udCcsJ2JhY2tsZWZ0JywnYmFja3JpZ2h0JywnZnJvbnRsZWZ0JywnZnJvbnRyaWdodCcsJ2Zyb250Y2VudGVyJ11cblxuICAgICAgdGhpcy5wYXJhbU9wdGlvbnNbJ3JlYWN0aW9uJ10uZm9yRWFjaChzdHJlbmd0aCA9PiB7XG4gICAgICAgIHNlbnNvckNvbmZpZ3MuZm9yRWFjaChzZW5zb3JDb25maWcgPT4ge1xuICAgICAgICAgIGZpbGVOYW1lID0gJ3JlYWN0aW9uJyArICdfJyArIHRoaXMubW9kZWxNb2RhbGl0eSArICdfJyArIHNlbnNvckNvbmZpZyArICdfJyArIHN0cmVuZ3RoLnN1YnN0cihzdHJlbmd0aC5pbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgdGhpcy52aWV3KCkuX2FkZExheWVyKGZpbGVOYW1lLCB0aGlzLmltZ1BhdGgpO1xuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgLy8gQWRkIHRoZSByb2xsIGNvbmZpZ3VyYXRpb25zLCBtZWNoYW5pc3RpYyBvciBmdW5jdGlvbmFsXG4gICAgICB0aGlzLnBhcmFtT3B0aW9uc1sncm9sbCddLmZvckVhY2goc3RyZW5ndGggPT4ge1xuICAgICAgICBmaWxlTmFtZSA9ICdyb2xsJyArICdfJyArIHRoaXMubW9kZWxNb2RhbGl0eSArICdfJztcbiAgICAgICAgZmlsZU5hbWUgKz0gc3RyZW5ndGguc3Vic3RyKHN0cmVuZ3RoLmluZGV4T2YoJ18nKSsxKVxuXG4gICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgfVxuXG4gICAgc2VsZWN0KCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdzZWxlY3RlZCcsIHRydWUpO1xuICAgIH1cblxuICAgIGRlc2VsZWN0KCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdzZWxlY3RlZCcsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cbiAgfTtcblxuICBCb2R5Q29uZmlndXJhdGlvbnMuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IEJvZHlDb25maWd1cmF0aW9ucyh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBCb2R5Q29uZmlndXJhdGlvbnM7XG59KTtcbiJdfQ==
