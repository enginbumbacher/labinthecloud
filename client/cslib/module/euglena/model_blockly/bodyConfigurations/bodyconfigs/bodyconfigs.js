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

      _this._model.setConfigs();
      _this.modelRepresentation = settings.modelData.modelRepresentation;
      _this.allowedConfigs = settings.modelData.allowedConfigs;
      _this.paramOptions = settings.modelData.paramOptions;

      if (_this.modelRepresentation === 'functional') {
        _this.activeConfigs = { 'sensorConfig': null, 'reaction': null, 'motor': null, 'roll': null };
      } else if (_this.modelRepresentation === 'mechanistic') {
        _this.activeConfigs = { 'sensorConfig': null, 'reaction': null, 'motor': null, 'motion': null };
      }
      _this.opacity = null;

      // MOVE THE FOLLOWING PARTS TO VIEW()

      _this.imgPath = 'cslib/module/euglena/model_blockly/bodyConfigurations/imgs/';
      _this._importAllImages();

      _this.setActiveConfiguration(settings.modelData.initialConfig.bodyConfigurationName);
      _this.setActiveConfiguration(settings.modelData.initialConfig.v);
      if (_this.modelRepresentation === 'functional') {
        _this.setActiveConfiguration(settings.modelData.initialConfig.omega);
      } else if (_this.modelRepresentation === 'mechanistic') {
        _this.setActiveConfiguration(settings.modelData.initialConfig.motion);
      }
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
              imgName = 'reaction' + '_' + this.modelRepresentation + '_' + this._model.getConfigId(this.activeConfigs['sensorConfig']).toLowerCase().split('_')[1] + '_';
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
              imgName = 'reaction' + '_' + this.modelRepresentation + '_' + this._model.getConfigId(this.activeConfigs['sensorConfig']).toLowerCase().split('_')[1] + '_';
              imgName += configName.substr(configName.indexOf('_') + 1);
              this.activeConfigs['reaction'] = imgName;
              this.show(this.activeConfigs['reaction']);
            }
            break;
          case 'motor':
          case 'roll':
            if (this.activeConfigs[configType]) {
              this.hide(this.activeConfigs[configType]);
            }
            imgName = configType + '_' + this.modelRepresentation + '_';
            imgName += configName.substr(configName.indexOf('_') + 1);
            this.activeConfigs[configType] = imgName;
            this.show(this.activeConfigs[configType]);
            break;

          case 'motion':
            if (this.activeConfigs[configType]) {
              this.hide(this.activeConfigs[configType]);
            }
            imgName = configName.substr(0, configName.match('0|1').index - 1);
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

        // Add the label, mechanistic or functional
        fileName = 'labels_' + this.modelRepresentation;
        this.view()._addLayer(fileName, this.imgPath);

        // Add the reaction configurations
        var sensorConfigs = ['back', 'front', 'backleft', 'backright', 'frontleft', 'frontright', 'frontcenter'];

        this.paramOptions['reaction'].forEach(function (strength) {
          sensorConfigs.forEach(function (sensorConfig) {
            fileName = 'reaction' + '_' + _this2.modelRepresentation + '_' + sensorConfig + '_' + strength.substr(strength.indexOf('_') + 1);
            _this2.view()._addLayer(fileName, _this2.imgPath);
          });
        });

        // Add the motor / speed configurations, mechanistic or functional
        this.paramOptions['motor'].forEach(function (strength) {
          fileName = 'motor' + '_' + _this2.modelRepresentation + '_';
          fileName += strength.substr(strength.indexOf('_') + 1);

          _this2.view()._addLayer(fileName, _this2.imgPath);
        });

        // Add the roll configurations, mechanistic or functional
        if (Object.keys(this.paramOptions).indexOf('roll') > -1) {
          this.paramOptions['roll'].forEach(function (strength) {
            fileName = 'roll' + '_' + _this2.modelRepresentation + '_';
            fileName += strength.substr(strength.indexOf('_') + 1);

            _this2.view()._addLayer(fileName, _this2.imgPath);
          });
        } else if (Object.keys(this.paramOptions).indexOf('motion') > -1) {
          this.paramOptions['motion'].forEach(function (motionType) {
            fileName = 'motion' + '_' + motionType.split('_')[1];

            _this2.view()._addLayer(fileName, _this2.imgPath);
          });
        }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIkJvZHlDb25maWd1cmF0aW9ucyIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX21vZGVsIiwic2V0Q29uZmlncyIsIm1vZGVsUmVwcmVzZW50YXRpb24iLCJtb2RlbERhdGEiLCJhbGxvd2VkQ29uZmlncyIsInBhcmFtT3B0aW9ucyIsImFjdGl2ZUNvbmZpZ3MiLCJvcGFjaXR5IiwiaW1nUGF0aCIsIl9pbXBvcnRBbGxJbWFnZXMiLCJzZXRBY3RpdmVDb25maWd1cmF0aW9uIiwiaW5pdGlhbENvbmZpZyIsImJvZHlDb25maWd1cmF0aW9uTmFtZSIsInYiLCJvbWVnYSIsIm1vdGlvbiIsImsiLCJzZXRCb2R5T3BhY2l0eSIsImNvbmZpZ05hbWUiLCJjb25maWdUeXBlIiwicXVhbGl0YXRpdmVWYWx1ZSIsIk9iamVjdCIsImtleXMiLCJzb21lIiwiY29uZmlnIiwibWF0Y2giLCJpbWdOYW1lIiwiaGlkZSIsImdldENvbmZpZ0lkIiwic2hvdyIsInRvTG93ZXJDYXNlIiwic3BsaXQiLCJzdWJzdHIiLCJpbmRleE9mIiwiaW5kZXgiLCJnZXRDb25maWdKU09OIiwicGFyc2VJbnQiLCJudW1lcmljVmFsdWUiLCJ2aWV3IiwiX3NldEJvZHlPcGFjaXR5IiwiY29uZmlnSWQiLCJfaGlkZUNvbmZpZyIsIl9zaG93Q29uZmlnIiwiZGVmYXVsdENvbmZpZ3MiLCJtYXAiLCJfYWRkTGF5ZXIiLCJjb25maWd1cmF0aW9uIiwiaWQiLCJmaWxlTmFtZSIsInNlbnNvckNvbmZpZ3MiLCJmb3JFYWNoIiwic2Vuc29yQ29uZmlnIiwic3RyZW5ndGgiLCJtb3Rpb25UeXBlIiwiZ2V0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Q0FBUDtBQUNEO0FBOUxlO0FBQUE7QUFBQSwrQkFnTVA7QUFDUCxhQUFLdEQsTUFBTCxDQUFZdUQsR0FBWixDQUFnQixVQUFoQixFQUE0QixJQUE1QjtBQUNEO0FBbE1lO0FBQUE7QUFBQSxpQ0FvTUw7QUFDVCxhQUFLdkQsTUFBTCxDQUFZdUQsR0FBWixDQUFnQixVQUFoQixFQUE0QixLQUE1QjtBQUNEO0FBdE1lO0FBQUE7QUFBQSxnQ0F3TVA7QUFDUCxlQUFPLEtBQUt2RCxNQUFMLENBQVlzRCxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQTFNZTs7QUFBQTtBQUFBLElBT2UvRCxTQVBmOztBQTJNakI7O0FBRURJLHFCQUFtQjZELE1BQW5CLEdBQTRCLFVBQUNDLElBQUQsRUFBVTtBQUNwQyxXQUFPLElBQUk5RCxrQkFBSixDQUF1QixFQUFFUSxXQUFXc0QsSUFBYixFQUF2QixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPOUQsa0JBQVA7QUFDRCxDQWxORCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9ib2R5Y29uZmlncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgY2xhc3MgQm9keUNvbmZpZ3VyYXRpb25zIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfaW1wb3J0QWxsSW1hZ2VzJywnc2V0Qm9keU9wYWNpdHknLCAnc2V0QWN0aXZlQ29uZmlndXJhdGlvbicsICdoaWRlJywgJ3Nob3cnXSlcblxuICAgICAgdGhpcy5fbW9kZWwuc2V0Q29uZmlncygpIDtcbiAgICAgIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiA9IHNldHRpbmdzLm1vZGVsRGF0YS5tb2RlbFJlcHJlc2VudGF0aW9uO1xuICAgICAgdGhpcy5hbGxvd2VkQ29uZmlncyA9IHNldHRpbmdzLm1vZGVsRGF0YS5hbGxvd2VkQ29uZmlncztcbiAgICAgIHRoaXMucGFyYW1PcHRpb25zID0gc2V0dGluZ3MubW9kZWxEYXRhLnBhcmFtT3B0aW9ucztcblxuICAgICAgaWYgKHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiA9PT0gJ2Z1bmN0aW9uYWwnKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlQ29uZmlncyA9IHsnc2Vuc29yQ29uZmlnJzogbnVsbCwgJ3JlYWN0aW9uJzogbnVsbCwgJ21vdG9yJzogbnVsbCwgJ3JvbGwnOiBudWxsfTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uID09PSAnbWVjaGFuaXN0aWMnKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlQ29uZmlncyA9IHsnc2Vuc29yQ29uZmlnJzogbnVsbCwgJ3JlYWN0aW9uJzogbnVsbCwgJ21vdG9yJzogbnVsbCwgJ21vdGlvbic6IG51bGx9O1xuICAgICAgfVxuICAgICAgdGhpcy5vcGFjaXR5ID0gbnVsbDtcblxuICAgICAgLy8gTU9WRSBUSEUgRk9MTE9XSU5HIFBBUlRTIFRPIFZJRVcoKVxuXG4gICAgICB0aGlzLmltZ1BhdGggPSAnY3NsaWIvbW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvaW1ncy8nO1xuICAgICAgdGhpcy5faW1wb3J0QWxsSW1hZ2VzKCk7XG5cbiAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5ib2R5Q29uZmlndXJhdGlvbk5hbWUpO1xuICAgICAgdGhpcy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLnYpO1xuICAgICAgaWYgKHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiA9PT0gJ2Z1bmN0aW9uYWwnKSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5vbWVnYSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiA9PT0gJ21lY2hhbmlzdGljJykge1xuICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oc2V0dGluZ3MubW9kZWxEYXRhLmluaXRpYWxDb25maWcubW90aW9uKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5rKTtcbiAgICAgIHRoaXMuc2V0Qm9keU9wYWNpdHkoc2V0dGluZ3MubW9kZWxEYXRhLmluaXRpYWxDb25maWcub3BhY2l0eSk7XG5cbiAgICB9XG5cbiAgICBzZXRBY3RpdmVDb25maWd1cmF0aW9uKGNvbmZpZ05hbWUpIHtcblxuICAgICAgdmFyIGNvbmZpZ1R5cGUgPSBudWxsO1xuICAgICAgaWYgKGNvbmZpZ05hbWUucXVhbGl0YXRpdmVWYWx1ZSkge1xuICAgICAgICBjb25maWdUeXBlID0gY29uZmlnTmFtZS5xdWFsaXRhdGl2ZVZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maWdUeXBlID0gY29uZmlnTmFtZTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuYWN0aXZlQ29uZmlncykuc29tZShmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgaWYoY29uZmlnVHlwZS5tYXRjaChjb25maWcpKSB7XG4gICAgICAgICAgY29uZmlnVHlwZSA9IGNvbmZpZztcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgbGV0IGltZ05hbWUgPSBudWxsO1xuICAgICAgc3dpdGNoIChjb25maWdUeXBlKSB7XG4gICAgICAgIGNhc2UgJ3NlbnNvckNvbmZpZyc6XG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLl9tb2RlbC5nZXRDb25maWdJZCh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pIHtcbiAgICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10gPSBjb25maWdOYW1lO1xuICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLl9tb2RlbC5nZXRDb25maWdJZCh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKSk7XG5cbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKSB7XG4gICAgICAgICAgICBpbWdOYW1lID0gJ3JlYWN0aW9uJyArICdfJyArIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiArICdfJyArIHRoaXMuX21vZGVsLmdldENvbmZpZ0lkKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pLnRvTG93ZXJDYXNlKCkuc3BsaXQoJ18nKVsxXSArICdfJztcbiAgICAgICAgICAgIGltZ05hbWUgKz0gdGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddLnNwbGl0KCdfJylbM107XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10gPSBpbWdOYW1lO1xuICAgICAgICAgICAgdGhpcy5zaG93KHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSk7XG4gICAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVhY3Rpb24nOlxuICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKSB7XG4gICAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW1nTmFtZSA9ICdyZWFjdGlvbicgKyAnXycgKyB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gKyAnXycgKyB0aGlzLl9tb2RlbC5nZXRDb25maWdJZCh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCdfJylbMV0gKyAnXyc7XG4gICAgICAgICAgICBpbWdOYW1lICs9IGNvbmZpZ05hbWUuc3Vic3RyKGNvbmZpZ05hbWUuaW5kZXhPZignXycpKzEpO1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddID0gaW1nTmFtZTtcbiAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pO1xuICAgICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtb3Rvcic6XG4gICAgICAgIGNhc2UgJ3JvbGwnOlxuICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbY29uZmlnVHlwZV0pIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLmFjdGl2ZUNvbmZpZ3NbY29uZmlnVHlwZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbWdOYW1lID0gY29uZmlnVHlwZSArICdfJyArIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiArICdfJztcbiAgICAgICAgICBpbWdOYW1lICs9IGNvbmZpZ05hbWUuc3Vic3RyKGNvbmZpZ05hbWUuaW5kZXhPZignXycpKzEpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSA9IGltZ05hbWU7XG4gICAgICAgICAgdGhpcy5zaG93KHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ21vdGlvbic6XG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltZ05hbWUgPSBjb25maWdOYW1lLnN1YnN0cigwLGNvbmZpZ05hbWUubWF0Y2goJzB8MScpLmluZGV4LTEpO1xuICAgICAgICAgIHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSA9IGltZ05hbWU7XG4gICAgICAgICAgdGhpcy5zaG93KHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldENvbmZpZ0pTT04odGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Qm9keU9wYWNpdHkob3BhY2l0eSkge1xuICAgICAgaWYgKHR5cGVvZihvcGFjaXR5KT09PSdzdHJpbmcnKSB7XG4gICAgICAgIG9wYWNpdHkgPSBwYXJzZUludChvcGFjaXR5LnN1YnN0cihvcGFjaXR5LmluZGV4T2YoJ18nKSsxKSkgLyAxMDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcGFjaXR5ID0gb3BhY2l0eS5udW1lcmljVmFsdWU7XG4gICAgICB9XG4gICAgICB0aGlzLm9wYWNpdHkgPSBvcGFjaXR5O1xuICAgICAgdGhpcy52aWV3KCkuX3NldEJvZHlPcGFjaXR5KG9wYWNpdHkpO1xuICAgIH1cblxuICAgIGhpZGUoY29uZmlnSWQpIHtcbiAgICAgIHRoaXMudmlldygpLl9oaWRlQ29uZmlnKGNvbmZpZ0lkKTtcbiAgICB9XG5cbiAgICBzaG93KGNvbmZpZ0lkKSB7XG4gICAgICB0aGlzLnZpZXcoKS5fc2hvd0NvbmZpZyhjb25maWdJZCk7XG4gICAgfVxuXG4gICAgX2ltcG9ydEFsbEltYWdlcygpIHtcbiAgICAgIC8vIEFkZCB0aGUgc2Vuc29yIGNvbmZpZ3VyYXRpb25zXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5kZWZhdWx0Q29uZmlncykubWFwKGNvbmZpZ3VyYXRpb24gPT4ge1xuXG4gICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcih0aGlzLl9tb2RlbC5kZWZhdWx0Q29uZmlnc1tjb25maWd1cmF0aW9uXS5pZCwgdGhpcy5pbWdQYXRoKTtcbiAgICAgIH0pXG5cbiAgICAgIGxldCBmaWxlTmFtZSA9IG51bGw7XG5cbiAgICAgIC8vIEFkZCB0aGUgbGFiZWwsIG1lY2hhbmlzdGljIG9yIGZ1bmN0aW9uYWxcbiAgICAgIGZpbGVOYW1lID0gJ2xhYmVsc18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uO1xuICAgICAgdGhpcy52aWV3KCkuX2FkZExheWVyKGZpbGVOYW1lLCB0aGlzLmltZ1BhdGgpO1xuXG4gICAgICAvLyBBZGQgdGhlIHJlYWN0aW9uIGNvbmZpZ3VyYXRpb25zXG4gICAgICB2YXIgc2Vuc29yQ29uZmlncyA9IFsnYmFjaycsJ2Zyb250JywnYmFja2xlZnQnLCdiYWNrcmlnaHQnLCdmcm9udGxlZnQnLCdmcm9udHJpZ2h0JywnZnJvbnRjZW50ZXInXVxuXG4gICAgICB0aGlzLnBhcmFtT3B0aW9uc1sncmVhY3Rpb24nXS5mb3JFYWNoKHN0cmVuZ3RoID0+IHtcbiAgICAgICAgc2Vuc29yQ29uZmlncy5mb3JFYWNoKHNlbnNvckNvbmZpZyA9PiB7XG4gICAgICAgICAgZmlsZU5hbWUgPSAncmVhY3Rpb24nICsgJ18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uICsgJ18nICsgc2Vuc29yQ29uZmlnICsgJ18nICsgc3RyZW5ndGguc3Vic3RyKHN0cmVuZ3RoLmluZGV4T2YoJ18nKSsxKTtcbiAgICAgICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIoZmlsZU5hbWUsIHRoaXMuaW1nUGF0aCk7XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBBZGQgdGhlIG1vdG9yIC8gc3BlZWQgY29uZmlndXJhdGlvbnMsIG1lY2hhbmlzdGljIG9yIGZ1bmN0aW9uYWxcbiAgICAgIHRoaXMucGFyYW1PcHRpb25zWydtb3RvciddLmZvckVhY2goc3RyZW5ndGggPT4ge1xuICAgICAgICBmaWxlTmFtZSA9ICdtb3RvcicgKyAnXycgKyB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gKyAnXyc7XG4gICAgICAgIGZpbGVOYW1lICs9IHN0cmVuZ3RoLnN1YnN0cihzdHJlbmd0aC5pbmRleE9mKCdfJykrMSlcblxuICAgICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIoZmlsZU5hbWUsIHRoaXMuaW1nUGF0aCk7XG4gICAgICB9KVxuXG5cbiAgICAgIC8vIEFkZCB0aGUgcm9sbCBjb25maWd1cmF0aW9ucywgbWVjaGFuaXN0aWMgb3IgZnVuY3Rpb25hbFxuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMucGFyYW1PcHRpb25zKS5pbmRleE9mKCdyb2xsJyk+LTEpIHtcbiAgICAgICAgdGhpcy5wYXJhbU9wdGlvbnNbJ3JvbGwnXS5mb3JFYWNoKHN0cmVuZ3RoID0+IHtcbiAgICAgICAgICBmaWxlTmFtZSA9ICdyb2xsJyArICdfJyArIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiArICdfJztcbiAgICAgICAgICBmaWxlTmFtZSArPSBzdHJlbmd0aC5zdWJzdHIoc3RyZW5ndGguaW5kZXhPZignXycpKzEpXG5cbiAgICAgICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIoZmlsZU5hbWUsIHRoaXMuaW1nUGF0aCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKE9iamVjdC5rZXlzKHRoaXMucGFyYW1PcHRpb25zKS5pbmRleE9mKCdtb3Rpb24nKT4tMSkge1xuICAgICAgICB0aGlzLnBhcmFtT3B0aW9uc1snbW90aW9uJ10uZm9yRWFjaChtb3Rpb25UeXBlID0+IHtcbiAgICAgICAgICBmaWxlTmFtZSA9ICdtb3Rpb24nICsgJ18nICsgbW90aW9uVHlwZS5zcGxpdCgnXycpWzFdO1xuXG4gICAgICAgICAgdGhpcy52aWV3KCkuX2FkZExheWVyKGZpbGVOYW1lLCB0aGlzLmltZ1BhdGgpO1xuICAgICAgICB9KVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICB9XG5cbiAgICBzZWxlY3QoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ3NlbGVjdGVkJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZGVzZWxlY3QoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ3NlbGVjdGVkJywgZmFsc2UpO1xuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuICB9O1xuXG4gIEJvZHlDb25maWd1cmF0aW9ucy5jcmVhdGUgPSAoZGF0YSkgPT4ge1xuICAgIHJldHVybiBuZXcgQm9keUNvbmZpZ3VyYXRpb25zKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcmV0dXJuIEJvZHlDb25maWd1cmF0aW9ucztcbn0pO1xuIl19
