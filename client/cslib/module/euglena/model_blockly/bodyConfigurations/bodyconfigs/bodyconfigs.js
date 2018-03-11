'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Globals = require('core/model/globals'),
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

      if (settings.modelData.initialConfig.omega) {
        _this.activeConfigs = { 'sensorConfig': null, 'reaction': null, 'motor': null, 'roll': null };
      } else if (settings.modelData.initialConfig.motion) {
        _this.activeConfigs = { 'sensorConfig': null, 'reaction': null, 'motor': null, 'motion': null };
      }
      _this.opacity = settings.modelData.initialConfig.opacity ? settings.modelData.initialConfig.opacity : 0.2;

      // MOVE THE FOLLOWING PARTS TO VIEW()

      _this.imgPath = '/cslib/module/euglena/model_blockly/bodyConfigurations/imgs/';
      _this._importAllImages();

      _this.setActiveConfiguration(settings.modelData.initialConfig.bodyConfigurationName);
      _this.setActiveConfiguration(settings.modelData.initialConfig.v);
      if (settings.modelData.initialConfig.omega) {
        _this.setActiveConfiguration(settings.modelData.initialConfig.omega);
      } else if (settings.modelData.initialConfig.motion) {
        _this.setActiveConfiguration(settings.modelData.initialConfig.motion);
      }
      _this.setActiveConfiguration(settings.modelData.initialConfig.k);
      _this.setBodyOpacity(_this.opacity);

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
            var prevNumSensors = 0;
            if (this.activeConfigs['sensorConfig']) {
              prevNumSensors = this._model.getNumberOfSensors(this.activeConfigs['sensorConfig']);
              this.hide(this._model.getConfigId(this.activeConfigs['sensorConfig']));

              if (this.activeConfigs['reaction']) {
                this.hide(this.activeConfigs['reaction']);
              }
            }

            // If the number of sensors changes, activate and de-activate corresponding blocks in the toolkit and the worspace.
            var currNumSensors = this._model.getNumberOfSensors(configName);
            if (currNumSensors != prevNumSensors) {
              Globals.get('Relay').dispatchEvent('Body.Change', { numSensors: currNumSensors });
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
        } else if (Object.keys(opacity).length) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJHbG9iYWxzIiwiVXRpbHMiLCJCb2R5Q29uZmlndXJhdGlvbnMiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9tb2RlbCIsInNldENvbmZpZ3MiLCJtb2RlbFJlcHJlc2VudGF0aW9uIiwibW9kZWxEYXRhIiwiYWxsb3dlZENvbmZpZ3MiLCJwYXJhbU9wdGlvbnMiLCJpbml0aWFsQ29uZmlnIiwib21lZ2EiLCJhY3RpdmVDb25maWdzIiwibW90aW9uIiwib3BhY2l0eSIsImltZ1BhdGgiLCJfaW1wb3J0QWxsSW1hZ2VzIiwic2V0QWN0aXZlQ29uZmlndXJhdGlvbiIsImJvZHlDb25maWd1cmF0aW9uTmFtZSIsInYiLCJrIiwic2V0Qm9keU9wYWNpdHkiLCJjb25maWdOYW1lIiwiY29uZmlnVHlwZSIsInF1YWxpdGF0aXZlVmFsdWUiLCJPYmplY3QiLCJrZXlzIiwic29tZSIsImNvbmZpZyIsIm1hdGNoIiwiaW1nTmFtZSIsInByZXZOdW1TZW5zb3JzIiwiZ2V0TnVtYmVyT2ZTZW5zb3JzIiwiaGlkZSIsImdldENvbmZpZ0lkIiwiY3Vyck51bVNlbnNvcnMiLCJnZXQiLCJkaXNwYXRjaEV2ZW50IiwibnVtU2Vuc29ycyIsInNob3ciLCJ0b0xvd2VyQ2FzZSIsInNwbGl0Iiwic3Vic3RyIiwiaW5kZXhPZiIsImluZGV4IiwiZ2V0Q29uZmlnSlNPTiIsInBhcnNlSW50IiwibGVuZ3RoIiwibnVtZXJpY1ZhbHVlIiwidmlldyIsIl9zZXRCb2R5T3BhY2l0eSIsImNvbmZpZ0lkIiwiX2hpZGVDb25maWciLCJfc2hvd0NvbmZpZyIsImRlZmF1bHRDb25maWdzIiwibWFwIiwiX2FkZExheWVyIiwiY29uZmlndXJhdGlvbiIsImlkIiwiZmlsZU5hbWUiLCJzZW5zb3JDb25maWdzIiwiZm9yRWFjaCIsInNlbnNvckNvbmZpZyIsInN0cmVuZ3RoIiwibW90aW9uVHlwZSIsInNldCIsImNyZWF0ZSIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxVQUFVSixRQUFRLG9CQUFSLENBSFo7QUFBQSxNQUlFSyxRQUFRTCxRQUFRLGlCQUFSLENBSlY7O0FBRGtCLE1BUVpNLGtCQVJZO0FBQUE7O0FBU2hCLGtDQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJOLEtBQTdDO0FBQ0FLLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JOLElBQTNDOztBQUZ5QiwwSUFHbkJJLFFBSG1COztBQUl6QkYsWUFBTUssV0FBTixRQUF3QixDQUFDLGtCQUFELEVBQW9CLGdCQUFwQixFQUFzQyx3QkFBdEMsRUFBZ0UsTUFBaEUsRUFBd0UsTUFBeEUsQ0FBeEI7O0FBRUEsWUFBS0MsTUFBTCxDQUFZQyxVQUFaO0FBQ0EsWUFBS0MsbUJBQUwsR0FBMkJOLFNBQVNPLFNBQVQsQ0FBbUJELG1CQUE5QztBQUNBLFlBQUtFLGNBQUwsR0FBc0JSLFNBQVNPLFNBQVQsQ0FBbUJDLGNBQXpDO0FBQ0EsWUFBS0MsWUFBTCxHQUFvQlQsU0FBU08sU0FBVCxDQUFtQkUsWUFBdkM7O0FBRUEsVUFBSVQsU0FBU08sU0FBVCxDQUFtQkcsYUFBbkIsQ0FBaUNDLEtBQXJDLEVBQTRDO0FBQzFDLGNBQUtDLGFBQUwsR0FBcUIsRUFBQyxnQkFBZ0IsSUFBakIsRUFBdUIsWUFB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QXFOakI7O0FBRURLLHFCQUFtQm1FLE1BQW5CLEdBQTRCLFVBQUNDLElBQUQsRUFBVTtBQUNwQyxXQUFPLElBQUlwRSxrQkFBSixDQUF1QixFQUFFUSxXQUFXNEQsSUFBYixFQUF2QixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPcEUsa0JBQVA7QUFDRCxDQTVORCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9ib2R5Y29uZmlncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIGNsYXNzIEJvZHlDb25maWd1cmF0aW9ucyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX2ltcG9ydEFsbEltYWdlcycsJ3NldEJvZHlPcGFjaXR5JywgJ3NldEFjdGl2ZUNvbmZpZ3VyYXRpb24nLCAnaGlkZScsICdzaG93J10pXG5cbiAgICAgIHRoaXMuX21vZGVsLnNldENvbmZpZ3MoKSA7XG4gICAgICB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gPSBzZXR0aW5ncy5tb2RlbERhdGEubW9kZWxSZXByZXNlbnRhdGlvbjtcbiAgICAgIHRoaXMuYWxsb3dlZENvbmZpZ3MgPSBzZXR0aW5ncy5tb2RlbERhdGEuYWxsb3dlZENvbmZpZ3M7XG4gICAgICB0aGlzLnBhcmFtT3B0aW9ucyA9IHNldHRpbmdzLm1vZGVsRGF0YS5wYXJhbU9wdGlvbnM7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5vbWVnYSkge1xuICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3MgPSB7J3NlbnNvckNvbmZpZyc6IG51bGwsICdyZWFjdGlvbic6IG51bGwsICdtb3Rvcic6IG51bGwsICdyb2xsJzogbnVsbH07XG4gICAgICB9IGVsc2UgaWYgKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLm1vdGlvbikge1xuICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3MgPSB7J3NlbnNvckNvbmZpZyc6IG51bGwsICdyZWFjdGlvbic6IG51bGwsICdtb3Rvcic6IG51bGwsICdtb3Rpb24nOiBudWxsfTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3BhY2l0eSA9IHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLm9wYWNpdHk/IHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLm9wYWNpdHkgOiAwLjI7XG5cbiAgICAgIC8vIE1PVkUgVEhFIEZPTExPV0lORyBQQVJUUyBUTyBWSUVXKClcblxuICAgICAgdGhpcy5pbWdQYXRoID0gJy9jc2xpYi9tb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9pbWdzLyc7XG4gICAgICB0aGlzLl9pbXBvcnRBbGxJbWFnZXMoKTtcblxuICAgICAgdGhpcy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLmJvZHlDb25maWd1cmF0aW9uTmFtZSk7XG4gICAgICB0aGlzLnNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oc2V0dGluZ3MubW9kZWxEYXRhLmluaXRpYWxDb25maWcudik7XG4gICAgICBpZiAoc2V0dGluZ3MubW9kZWxEYXRhLmluaXRpYWxDb25maWcub21lZ2EpIHtcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLm9tZWdhKTtcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MubW9kZWxEYXRhLmluaXRpYWxDb25maWcubW90aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5tb3Rpb24pO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLmspO1xuICAgICAgdGhpcy5zZXRCb2R5T3BhY2l0eSh0aGlzLm9wYWNpdHkpO1xuXG4gICAgfVxuXG4gICAgc2V0QWN0aXZlQ29uZmlndXJhdGlvbihjb25maWdOYW1lKSB7XG5cbiAgICAgIHZhciBjb25maWdUeXBlID0gbnVsbDtcbiAgICAgIGlmIChjb25maWdOYW1lLnF1YWxpdGF0aXZlVmFsdWUpIHtcbiAgICAgICAgY29uZmlnVHlwZSA9IGNvbmZpZ05hbWUucXVhbGl0YXRpdmVWYWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmlnVHlwZSA9IGNvbmZpZ05hbWU7XG4gICAgICB9XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmFjdGl2ZUNvbmZpZ3MpLnNvbWUoZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgIGlmKGNvbmZpZ1R5cGUubWF0Y2goY29uZmlnKSkge1xuICAgICAgICAgIGNvbmZpZ1R5cGUgPSBjb25maWc7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGxldCBpbWdOYW1lID0gbnVsbDtcbiAgICAgIHN3aXRjaCAoY29uZmlnVHlwZSkge1xuICAgICAgICBjYXNlICdzZW5zb3JDb25maWcnOlxuICAgICAgICB2YXIgcHJldk51bVNlbnNvcnMgPSAwO1xuICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKSB7XG4gICAgICAgICAgICBwcmV2TnVtU2Vuc29ycyA9IHRoaXMuX21vZGVsLmdldE51bWJlck9mU2Vuc29ycyh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKTtcbiAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLl9tb2RlbC5nZXRDb25maWdJZCh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pIHtcbiAgICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhlIG51bWJlciBvZiBzZW5zb3JzIGNoYW5nZXMsIGFjdGl2YXRlIGFuZCBkZS1hY3RpdmF0ZSBjb3JyZXNwb25kaW5nIGJsb2NrcyBpbiB0aGUgdG9vbGtpdCBhbmQgdGhlIHdvcnNwYWNlLlxuICAgICAgICAgIHZhciBjdXJyTnVtU2Vuc29ycyA9IHRoaXMuX21vZGVsLmdldE51bWJlck9mU2Vuc29ycyhjb25maWdOYW1lKTtcbiAgICAgICAgICBpZiAoY3Vyck51bVNlbnNvcnMgIT0gcHJldk51bVNlbnNvcnMpIHtcbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0JvZHkuQ2hhbmdlJywge251bVNlbnNvcnM6IGN1cnJOdW1TZW5zb3JzfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddID0gY29uZmlnTmFtZTtcbiAgICAgICAgICB0aGlzLnNob3codGhpcy5fbW9kZWwuZ2V0Q29uZmlnSWQodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSkge1xuICAgICAgICAgICAgaW1nTmFtZSA9ICdyZWFjdGlvbicgKyAnXycgKyB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gKyAnXycgKyB0aGlzLl9tb2RlbC5nZXRDb25maWdJZCh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCdfJylbMV0gKyAnXyc7XG4gICAgICAgICAgICBpbWdOYW1lICs9IHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXS5zcGxpdCgnXycpWzNdO1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddID0gaW1nTmFtZTtcbiAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pO1xuICAgICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlYWN0aW9uJzpcbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSkge1xuICAgICAgICAgICAgICB0aGlzLmhpZGUodGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGltZ05hbWUgPSAncmVhY3Rpb24nICsgJ18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uICsgJ18nICsgdGhpcy5fbW9kZWwuZ2V0Q29uZmlnSWQodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkudG9Mb3dlckNhc2UoKS5zcGxpdCgnXycpWzFdICsgJ18nO1xuICAgICAgICAgICAgaW1nTmFtZSArPSBjb25maWdOYW1lLnN1YnN0cihjb25maWdOYW1lLmluZGV4T2YoJ18nKSsxKTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSA9IGltZ05hbWU7XG4gICAgICAgICAgICB0aGlzLnNob3codGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKTtcbiAgICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbW90b3InOlxuICAgICAgICBjYXNlICdyb2xsJzpcbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUodGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1nTmFtZSA9IGNvbmZpZ1R5cGUgKyAnXycgKyB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gKyAnXyc7XG4gICAgICAgICAgaW1nTmFtZSArPSBjb25maWdOYW1lLnN1YnN0cihjb25maWdOYW1lLmluZGV4T2YoJ18nKSsxKTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3NbY29uZmlnVHlwZV0gPSBpbWdOYW1lO1xuICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmFjdGl2ZUNvbmZpZ3NbY29uZmlnVHlwZV0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdtb3Rpb24nOlxuICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbY29uZmlnVHlwZV0pIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLmFjdGl2ZUNvbmZpZ3NbY29uZmlnVHlwZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbWdOYW1lID0gY29uZmlnTmFtZS5zdWJzdHIoMCxjb25maWdOYW1lLm1hdGNoKCcwfDEnKS5pbmRleC0xKTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3NbY29uZmlnVHlwZV0gPSBpbWdOYW1lO1xuICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmFjdGl2ZUNvbmZpZ3NbY29uZmlnVHlwZV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRBY3RpdmVTZW5zb3JDb25maWd1cmF0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXRDb25maWdKU09OKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEJvZHlPcGFjaXR5KG9wYWNpdHkpIHtcbiAgICAgIGlmICh0eXBlb2Yob3BhY2l0eSk9PT0nc3RyaW5nJykge1xuICAgICAgICBvcGFjaXR5ID0gcGFyc2VJbnQob3BhY2l0eS5zdWJzdHIob3BhY2l0eS5pbmRleE9mKCdfJykrMSkpIC8gMTAwO1xuICAgICAgfSBlbHNlIGlmIChPYmplY3Qua2V5cyhvcGFjaXR5KS5sZW5ndGgpIHtcbiAgICAgICAgb3BhY2l0eSA9IG9wYWNpdHkubnVtZXJpY1ZhbHVlO1xuICAgICAgfVxuICAgICAgdGhpcy5vcGFjaXR5ID0gb3BhY2l0eTtcbiAgICAgIHRoaXMudmlldygpLl9zZXRCb2R5T3BhY2l0eShvcGFjaXR5KTtcbiAgICB9XG5cbiAgICBoaWRlKGNvbmZpZ0lkKSB7XG4gICAgICB0aGlzLnZpZXcoKS5faGlkZUNvbmZpZyhjb25maWdJZCk7XG4gICAgfVxuXG4gICAgc2hvdyhjb25maWdJZCkge1xuICAgICAgdGhpcy52aWV3KCkuX3Nob3dDb25maWcoY29uZmlnSWQpO1xuICAgIH1cblxuICAgIF9pbXBvcnRBbGxJbWFnZXMoKSB7XG4gICAgICAvLyBBZGQgdGhlIHNlbnNvciBjb25maWd1cmF0aW9uc1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZGVmYXVsdENvbmZpZ3MpLm1hcChjb25maWd1cmF0aW9uID0+IHtcblxuICAgICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIodGhpcy5fbW9kZWwuZGVmYXVsdENvbmZpZ3NbY29uZmlndXJhdGlvbl0uaWQsIHRoaXMuaW1nUGF0aCk7XG4gICAgICB9KVxuXG4gICAgICBsZXQgZmlsZU5hbWUgPSBudWxsO1xuXG4gICAgICAvLyBBZGQgdGhlIGxhYmVsLCBtZWNoYW5pc3RpYyBvciBmdW5jdGlvbmFsXG4gICAgICBmaWxlTmFtZSA9ICdsYWJlbHNfJyArIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbjtcbiAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcblxuICAgICAgLy8gQWRkIHRoZSByZWFjdGlvbiBjb25maWd1cmF0aW9uc1xuICAgICAgdmFyIHNlbnNvckNvbmZpZ3MgPSBbJ2JhY2snLCdmcm9udCcsJ2JhY2tsZWZ0JywnYmFja3JpZ2h0JywnZnJvbnRsZWZ0JywnZnJvbnRyaWdodCcsJ2Zyb250Y2VudGVyJ11cblxuICAgICAgdGhpcy5wYXJhbU9wdGlvbnNbJ3JlYWN0aW9uJ10uZm9yRWFjaChzdHJlbmd0aCA9PiB7XG4gICAgICAgIHNlbnNvckNvbmZpZ3MuZm9yRWFjaChzZW5zb3JDb25maWcgPT4ge1xuICAgICAgICAgIGZpbGVOYW1lID0gJ3JlYWN0aW9uJyArICdfJyArIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiArICdfJyArIHNlbnNvckNvbmZpZyArICdfJyArIHN0cmVuZ3RoLnN1YnN0cihzdHJlbmd0aC5pbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgdGhpcy52aWV3KCkuX2FkZExheWVyKGZpbGVOYW1lLCB0aGlzLmltZ1BhdGgpO1xuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgLy8gQWRkIHRoZSBtb3RvciAvIHNwZWVkIGNvbmZpZ3VyYXRpb25zLCBtZWNoYW5pc3RpYyBvciBmdW5jdGlvbmFsXG4gICAgICB0aGlzLnBhcmFtT3B0aW9uc1snbW90b3InXS5mb3JFYWNoKHN0cmVuZ3RoID0+IHtcbiAgICAgICAgZmlsZU5hbWUgPSAnbW90b3InICsgJ18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uICsgJ18nO1xuICAgICAgICBmaWxlTmFtZSArPSBzdHJlbmd0aC5zdWJzdHIoc3RyZW5ndGguaW5kZXhPZignXycpKzEpXG5cbiAgICAgICAgdGhpcy52aWV3KCkuX2FkZExheWVyKGZpbGVOYW1lLCB0aGlzLmltZ1BhdGgpO1xuICAgICAgfSlcblxuXG4gICAgICAvLyBBZGQgdGhlIHJvbGwgY29uZmlndXJhdGlvbnMsIG1lY2hhbmlzdGljIG9yIGZ1bmN0aW9uYWxcbiAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnBhcmFtT3B0aW9ucykuaW5kZXhPZigncm9sbCcpPi0xKSB7XG4gICAgICAgIHRoaXMucGFyYW1PcHRpb25zWydyb2xsJ10uZm9yRWFjaChzdHJlbmd0aCA9PiB7XG4gICAgICAgICAgZmlsZU5hbWUgPSAncm9sbCcgKyAnXycgKyB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gKyAnXyc7XG4gICAgICAgICAgZmlsZU5hbWUgKz0gc3RyZW5ndGguc3Vic3RyKHN0cmVuZ3RoLmluZGV4T2YoJ18nKSsxKVxuXG4gICAgICAgICAgdGhpcy52aWV3KCkuX2FkZExheWVyKGZpbGVOYW1lLCB0aGlzLmltZ1BhdGgpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChPYmplY3Qua2V5cyh0aGlzLnBhcmFtT3B0aW9ucykuaW5kZXhPZignbW90aW9uJyk+LTEpIHtcbiAgICAgICAgdGhpcy5wYXJhbU9wdGlvbnNbJ21vdGlvbiddLmZvckVhY2gobW90aW9uVHlwZSA9PiB7XG4gICAgICAgICAgZmlsZU5hbWUgPSAnbW90aW9uJyArICdfJyArIG1vdGlvblR5cGUuc3BsaXQoJ18nKVsxXTtcblxuICAgICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcbiAgICAgICAgfSlcblxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgfVxuXG4gICAgc2VsZWN0KCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdzZWxlY3RlZCcsIHRydWUpO1xuICAgIH1cblxuICAgIGRlc2VsZWN0KCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdzZWxlY3RlZCcsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cbiAgfTtcblxuICBCb2R5Q29uZmlndXJhdGlvbnMuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IEJvZHlDb25maWd1cmF0aW9ucyh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBCb2R5Q29uZmlndXJhdGlvbnM7XG59KTtcbiJdfQ==
