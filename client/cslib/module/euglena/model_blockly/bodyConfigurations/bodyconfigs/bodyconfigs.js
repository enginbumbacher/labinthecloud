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
      } else {
        _this.activeConfigs = { 'sensorConfig': null, 'reaction': null, 'motor': null, 'roll': null };
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJHbG9iYWxzIiwiVXRpbHMiLCJCb2R5Q29uZmlndXJhdGlvbnMiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9tb2RlbCIsInNldENvbmZpZ3MiLCJtb2RlbFJlcHJlc2VudGF0aW9uIiwibW9kZWxEYXRhIiwiYWxsb3dlZENvbmZpZ3MiLCJwYXJhbU9wdGlvbnMiLCJpbml0aWFsQ29uZmlnIiwib21lZ2EiLCJhY3RpdmVDb25maWdzIiwibW90aW9uIiwib3BhY2l0eSIsImltZ1BhdGgiLCJfaW1wb3J0QWxsSW1hZ2VzIiwic2V0QWN0aXZlQ29uZmlndXJhdGlvbiIsImJvZHlDb25maWd1cmF0aW9uTmFtZSIsInYiLCJrIiwic2V0Qm9keU9wYWNpdHkiLCJjb25maWdOYW1lIiwiY29uZmlnVHlwZSIsInF1YWxpdGF0aXZlVmFsdWUiLCJPYmplY3QiLCJrZXlzIiwic29tZSIsImNvbmZpZyIsIm1hdGNoIiwiaW1nTmFtZSIsInByZXZOdW1TZW5zb3JzIiwiZ2V0TnVtYmVyT2ZTZW5zb3JzIiwiaGlkZSIsImdldENvbmZpZ0lkIiwiY3Vyck51bVNlbnNvcnMiLCJnZXQiLCJkaXNwYXRjaEV2ZW50IiwibnVtU2Vuc29ycyIsInNob3ciLCJ0b0xvd2VyQ2FzZSIsInNwbGl0Iiwic3Vic3RyIiwiaW5kZXhPZiIsImluZGV4IiwiZ2V0Q29uZmlnSlNPTiIsInBhcnNlSW50IiwibGVuZ3RoIiwibnVtZXJpY1ZhbHVlIiwidmlldyIsIl9zZXRCb2R5T3BhY2l0eSIsImNvbmZpZ0lkIiwiX2hpZGVDb25maWciLCJfc2hvd0NvbmZpZyIsImRlZmF1bHRDb25maWdzIiwibWFwIiwiX2FkZExheWVyIiwiY29uZmlndXJhdGlvbiIsImlkIiwiZmlsZU5hbWUiLCJzZW5zb3JDb25maWdzIiwiZm9yRWFjaCIsInNlbnNvckNvbmZpZyIsInN0cmVuZ3RoIiwibW90aW9uVHlwZSIsInNldCIsImNyZWF0ZSIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxVQUFVSixRQUFRLG9CQUFSLENBSFo7QUFBQSxNQUlFSyxRQUFRTCxRQUFRLGlCQUFSLENBSlY7O0FBRGtCLE1BUVpNLGtCQVJZO0FBQUE7O0FBU2hCLGtDQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJOLEtBQTdDO0FBQ0FLLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JOLElBQTNDOztBQUZ5QiwwSUFHbkJJLFFBSG1COztBQUl6QkYsWUFBTUssV0FBTixRQUF3QixDQUFDLGtCQUFELEVBQW9CLGdCQUFwQixFQUFzQyx3QkFBdEMsRUFBZ0UsTUFBaEUsRUFBd0UsTUFBeEUsQ0FBeEI7O0FBRUEsWUFBS0MsTUFBTCxDQUFZQyxVQUFaO0FBQ0EsWUFBS0MsbUJBQUwsR0FBMkJOLFNBQVNPLFNBQVQsQ0FBbUJELG1CQUE5QztBQUNBLFlBQUtFLGNBQUwsR0FBc0JSLFNBQVNPLFNBQVQsQ0FBbUJDLGNBQXpDO0FBQ0EsWUFBS0MsWUFBTCxHQUFvQlQsU0FBU08sU0FBVCxDQUFtQkUsWUFBdkM7O0FBRUEsVUFBSVQsU0FBU08sU0FBVCxDQUFtQkcsYUFBbkIsQ0FBaUNDLEtBQXJDLEVBQTRDO0FBQzFDLGNBQUtDLGFBQUwsR0FBcUIsRUFBQyxnQkFBZ0IsSUFBakIsRUFBdUIsWUFBWSxJQUFuQyxFQUF5QyxTQUFTLElBQWxELEVBQXdELFFBQVEsSUFBaEUsRUFBckI7QUFDRCxPQUZELE1BRU8sSUFBSVosU0FBU08sU0FBVCxDQUFtQkcsYUFBbkIsQ0FBaUNHLE1BQXJDLEVBQTZDO0FBQ2xELGNBQUtELGFBQUwsR0FBcUIsRUFBQyxnQkFBZ0IsSUFBakIsRUFBdUIsWUFBWSxJQUFuQyxFQUF5QyxTQUFTLElBQWxELEVBQXdELFVBQVUsSUFBbEUsRUFBckI7QUFDRCxPQUZNLE1BRUE7QUFDTCxjQUFLQSxhQUFMLEdBQXFCLEVBQUMsZ0JBQWdCLElBQWpCLEVBQXVCLFlBQVksSUFBbkMsRUFBeUMsU0FBUyxJQUFsRCxFQUF3RCxRQUFRLElBQWhFLEVBQXJCO0FBQ0Q7QUFDRCxZQUFLRSxPQUFMLEdBQWVkLFNBQVNPLFNBQVQsQ0FBbUJHLGFBQW5CLENBQWlDSSxPQUFqQyxHQUEwQ2QsU0FBU08sU0FBVCxDQUFtQkcsYUFBbkIsQ0FBaUNJLE9BQTNFLEdBQXFGLEdBQXBHOztBQUVBOztBQUVBLFlBQUtDLE9BQUwsR0FBZSw4REFBZjtBQUNBLFlBQUtDLGdCQUFMOztBQUVBLFlBQUtDLHNCQUFMLENBQTRCakIsU0FBU08sU0FBVCxDQUFtQkcsYUFBbkIsQ0FBaUNRLHFCQUE3RDtBQUNBLFlBQUtELHNCQUFMLENBQTRCakIsU0FBU08sU0FBVCxDQUFtQkcsYUFBbkIsQ0FBaUNTLENBQTdEO0FBQ0EsVUFBSW5CLFNBQVNPLFNBQVQsQ0FBbUJHLGFBQW5CLENBQWlDQyxLQUFyQyxFQUE0QztBQUMxQyxjQUFLTSxzQkFBTCxDQUE0QmpCLFNBQVNPLFNBQVQsQ0FBbUJHLGFBQW5CLENBQWlDQyxLQUE3RDtBQUNELE9BRkQsTUFFTyxJQUFJWCxTQUFTTyxTQUFULENBQW1CRyxhQUFuQixDQUFpQ0csTUFBckMsRUFBNkM7QUFDbEQsY0FBS0ksc0JBQUwsQ0FBNEJqQixTQUFTTyxTQUFULENBQW1CRyxhQUFuQixDQUFpQ0csTUFBN0Q7QUFDRDtBQUNELFlBQUtJLHNCQUFMLENBQTRCakIsU0FBU08sU0FBVCxDQUFtQkcsYUFBbkIsQ0FBaUNVLENBQTdEO0FBQ0EsWUFBS0MsY0FBTCxDQUFvQixNQUFLUCxPQUF6Qjs7QUFqQ3lCO0FBbUMxQjs7QUE1Q2U7QUFBQTtBQUFBLDZDQThDT1EsVUE5Q1AsRUE4Q21COztBQUVqQyxZQUFJQyxhQUFhLElBQWpCO0FBQ0EsWUFBSUQsV0FBV0UsZ0JBQWYsRUFBaUM7QUFDL0JELHVCQUFhRCxXQUFXRSxnQkFBeEI7QUFDRCxTQUZELE1BRU87QUFDTEQsdUJBQWFELFVBQWI7QUFDRDtBQUNERyxlQUFPQyxJQUFQLENBQVksS0FBS2QsYUFBakIsRUFBZ0NlLElBQWhDLENBQXFDLFVBQVNDLE1BQVQsRUFBaUI7QUFDcEQsY0FBR0wsV0FBV00sS0FBWCxDQUFpQkQsTUFBakIsQ0FBSCxFQUE2QjtBQUMzQkwseUJBQWFLLE1BQWI7QUFDQSxtQkFBTyxJQUFQO0FBQ0Q7QUFDRixTQUxEOztBQU9BLFlBQUlFLFVBQVUsSUFBZDtBQUNBLGdCQUFRUCxVQUFSO0FBQ0UsZUFBSyxjQUFMO0FBQ0EsZ0JBQUlRLGlCQUFpQixDQUFyQjtBQUNFLGdCQUFJLEtBQUtuQixhQUFMLENBQW1CLGNBQW5CLENBQUosRUFBd0M7QUFDdENtQiwrQkFBaUIsS0FBSzNCLE1BQUwsQ0FBWTRCLGtCQUFaLENBQStCLEtBQUtwQixhQUFMLENBQW1CLGNBQW5CLENBQS9CLENBQWpCO0FBQ0EsbUJBQUtxQixJQUFMLENBQVUsS0FBSzdCLE1BQUwsQ0FBWThCLFdBQVosQ0FBd0IsS0FBS3RCLGFBQUwsQ0FBbUIsY0FBbkIsQ0FBeEIsQ0FBVjs7QUFFQSxrQkFBSSxLQUFLQSxhQUFMLENBQW1CLFVBQW5CLENBQUosRUFBb0M7QUFDbEMscUJBQUtxQixJQUFMLENBQVUsS0FBS3JCLGFBQUwsQ0FBbUIsVUFBbkIsQ0FBVjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxnQkFBSXVCLGlCQUFpQixLQUFLL0IsTUFBTCxDQUFZNEIsa0JBQVosQ0FBK0JWLFVBQS9CLENBQXJCO0FBQ0EsZ0JBQUlhLGtCQUFrQkosY0FBdEIsRUFBc0M7QUFDcENsQyxzQkFBUXVDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxhQUFyQixDQUFtQyxhQUFuQyxFQUFrRCxFQUFDQyxZQUFZSCxjQUFiLEVBQWxEO0FBQ0Q7O0FBRUQsaUJBQUt2QixhQUFMLENBQW1CLGNBQW5CLElBQXFDVSxVQUFyQztBQUNBLGlCQUFLaUIsSUFBTCxDQUFVLEtBQUtuQyxNQUFMLENBQVk4QixXQUFaLENBQXdCLEtBQUt0QixhQUFMLENBQW1CLGNBQW5CLENBQXhCLENBQVY7O0FBRUEsZ0JBQUksS0FBS0EsYUFBTCxDQUFtQixVQUFuQixDQUFKLEVBQW9DO0FBQ2xDa0Isd0JBQVUsYUFBYSxHQUFiLEdBQW1CLEtBQUt4QixtQkFBeEIsR0FBOEMsR0FBOUMsR0FBb0QsS0FBS0YsTUFBTCxDQUFZOEIsV0FBWixDQUF3QixLQUFLdEIsYUFBTCxDQUFtQixjQUFuQixDQUF4QixFQUE0RDRCLFdBQTVELEdBQTBFQyxLQUExRSxDQUFnRixHQUFoRixFQUFxRixDQUFyRixDQUFwRCxHQUE4SSxHQUF4SjtBQUNBWCx5QkFBVyxLQUFLbEIsYUFBTCxDQUFtQixVQUFuQixFQUErQjZCLEtBQS9CLENBQXFDLEdBQXJDLEVBQTBDLENBQTFDLENBQVg7QUFDQSxtQkFBSzdCLGFBQUwsQ0FBbUIsVUFBbkIsSUFBaUNrQixPQUFqQztBQUNBLG1CQUFLUyxJQUFMLENBQVUsS0FBSzNCLGFBQUwsQ0FBbUIsVUFBbkIsQ0FBVjtBQUNEO0FBQ0g7QUFDQSxlQUFLLFVBQUw7QUFDRSxnQkFBSSxLQUFLQSxhQUFMLENBQW1CLGNBQW5CLENBQUosRUFBd0M7QUFDdEMsa0JBQUksS0FBS0EsYUFBTCxDQUFtQixVQUFuQixDQUFKLEVBQW9DO0FBQ2xDLHFCQUFLcUIsSUFBTCxDQUFVLEtBQUtyQixhQUFMLENBQW1CLFVBQW5CLENBQVY7QUFDRDtBQUNEa0Isd0JBQVUsYUFBYSxHQUFiLEdBQW1CLEtBQUt4QixtQkFBeEIsR0FBOEMsR0FBOUMsR0FBb0QsS0FBS0YsTUFBTCxDQUFZOEIsV0FBWixDQUF3QixLQUFLdEIsYUFBTCxDQUFtQixjQUFuQixDQUF4QixFQUE0RDRCLFdBQTVELEdBQTBFQyxLQUExRSxDQUFnRixHQUFoRixFQUFxRixDQUFyRixDQUFwRCxHQUE4SSxHQUF4SjtBQUNBWCx5QkFBV1IsV0FBV29CLE1BQVgsQ0FBa0JwQixXQUFXcUIsT0FBWCxDQUFtQixHQUFuQixJQUF3QixDQUExQyxDQUFYO0FBQ0EsbUJBQUsvQixhQUFMLENBQW1CLFVBQW5CLElBQWlDa0IsT0FBakM7QUFDQSxtQkFBS1MsSUFBTCxDQUFVLEtBQUszQixhQUFMLENBQW1CLFVBQW5CLENBQVY7QUFDRDtBQUNMO0FBQ0UsZUFBSyxPQUFMO0FBQ0EsZUFBSyxNQUFMO0FBQ0UsZ0JBQUksS0FBS0EsYUFBTCxDQUFtQlcsVUFBbkIsQ0FBSixFQUFvQztBQUNsQyxtQkFBS1UsSUFBTCxDQUFVLEtBQUtyQixhQUFMLENBQW1CVyxVQUFuQixDQUFWO0FBQ0Q7QUFDRE8sc0JBQVVQLGFBQWEsR0FBYixHQUFtQixLQUFLakIsbUJBQXhCLEdBQThDLEdBQXhEO0FBQ0F3Qix1QkFBV1IsV0FBV29CLE1BQVgsQ0FBa0JwQixXQUFXcUIsT0FBWCxDQUFtQixHQUFuQixJQUF3QixDQUExQyxDQUFYO0FBQ0EsaUJBQUsvQixhQUFMLENBQW1CVyxVQUFuQixJQUFpQ08sT0FBakM7QUFDQSxpQkFBS1MsSUFBTCxDQUFVLEtBQUszQixhQUFMLENBQW1CVyxVQUFuQixDQUFWO0FBQ0Y7O0FBRUEsZUFBSyxRQUFMO0FBQ0UsZ0JBQUksS0FBS1gsYUFBTCxDQUFtQlcsVUFBbkIsQ0FBSixFQUFvQztBQUNsQyxtQkFBS1UsSUFBTCxDQUFVLEtBQUtyQixhQUFMLENBQW1CVyxVQUFuQixDQUFWO0FBQ0Q7QUFDRE8sc0JBQVVSLFdBQVdvQixNQUFYLENBQWtCLENBQWxCLEVBQW9CcEIsV0FBV08sS0FBWCxDQUFpQixLQUFqQixFQUF3QmUsS0FBeEIsR0FBOEIsQ0FBbEQsQ0FBVjtBQUNBLGlCQUFLaEMsYUFBTCxDQUFtQlcsVUFBbkIsSUFBaUNPLE9BQWpDO0FBQ0EsaUJBQUtTLElBQUwsQ0FBVSxLQUFLM0IsYUFBTCxDQUFtQlcsVUFBbkIsQ0FBVjtBQUNGO0FBekRGO0FBMkREO0FBekhlO0FBQUE7QUFBQSxxREEySGU7QUFDM0IsWUFBSSxLQUFLWCxhQUFMLENBQW1CLGNBQW5CLENBQUosRUFBd0M7QUFDdEMsaUJBQU8sS0FBS1IsTUFBTCxDQUFZeUMsYUFBWixDQUEwQixLQUFLakMsYUFBTCxDQUFtQixjQUFuQixDQUExQixDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsaUJBQU8sSUFBUDtBQUNEO0FBQ0o7QUFqSWU7QUFBQTtBQUFBLHFDQW1JREUsT0FuSUMsRUFtSVE7QUFDdEIsWUFBSSxPQUFPQSxPQUFQLEtBQWtCLFFBQXRCLEVBQWdDO0FBQzlCQSxvQkFBVWdDLFNBQVNoQyxRQUFRNEIsTUFBUixDQUFlNUIsUUFBUTZCLE9BQVIsQ0FBZ0IsR0FBaEIsSUFBcUIsQ0FBcEMsQ0FBVCxJQUFtRCxHQUE3RDtBQUNELFNBRkQsTUFFTyxJQUFJbEIsT0FBT0MsSUFBUCxDQUFZWixPQUFaLEVBQXFCaUMsTUFBekIsRUFBaUM7QUFDdENqQyxvQkFBVUEsUUFBUWtDLFlBQWxCO0FBQ0Q7QUFDRCxhQUFLbEMsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsYUFBS21DLElBQUwsR0FBWUMsZUFBWixDQUE0QnBDLE9BQTVCO0FBQ0Q7QUEzSWU7QUFBQTtBQUFBLDJCQTZJWHFDLFFBN0lXLEVBNklEO0FBQ2IsYUFBS0YsSUFBTCxHQUFZRyxXQUFaLENBQXdCRCxRQUF4QjtBQUNEO0FBL0llO0FBQUE7QUFBQSwyQkFpSlhBLFFBakpXLEVBaUpEO0FBQ2IsYUFBS0YsSUFBTCxHQUFZSSxXQUFaLENBQXdCRixRQUF4QjtBQUNEO0FBbkplO0FBQUE7QUFBQSx5Q0FxSkc7QUFBQTs7QUFDakI7QUFDQTFCLGVBQU9DLElBQVAsQ0FBWSxLQUFLdEIsTUFBTCxDQUFZa0QsY0FBeEIsRUFBd0NDLEdBQXhDLENBQTRDLHlCQUFpQjs7QUFFM0QsaUJBQUtOLElBQUwsR0FBWU8sU0FBWixDQUFzQixPQUFLcEQsTUFBTCxDQUFZa0QsY0FBWixDQUEyQkcsYUFBM0IsRUFBMENDLEVBQWhFLEVBQW9FLE9BQUszQyxPQUF6RTtBQUNELFNBSEQ7O0FBS0EsWUFBSTRDLFdBQVcsSUFBZjs7QUFFQTtBQUNBQSxtQkFBVyxZQUFZLEtBQUtyRCxtQkFBNUI7QUFDQSxhQUFLMkMsSUFBTCxHQUFZTyxTQUFaLENBQXNCRyxRQUF0QixFQUFnQyxLQUFLNUMsT0FBckM7O0FBRUE7QUFDQSxZQUFJNkMsZ0JBQWdCLENBQUMsTUFBRCxFQUFRLE9BQVIsRUFBZ0IsVUFBaEIsRUFBMkIsV0FBM0IsRUFBdUMsV0FBdkMsRUFBbUQsWUFBbkQsRUFBZ0UsYUFBaEUsQ0FBcEI7O0FBRUEsYUFBS25ELFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEJvRCxPQUE5QixDQUFzQyxvQkFBWTtBQUNoREQsd0JBQWNDLE9BQWQsQ0FBc0Isd0JBQWdCO0FBQ3BDRix1QkFBVyxhQUFhLEdBQWIsR0FBbUIsT0FBS3JELG1CQUF4QixHQUE4QyxHQUE5QyxHQUFvRHdELFlBQXBELEdBQW1FLEdBQW5FLEdBQXlFQyxTQUFTckIsTUFBVCxDQUFnQnFCLFNBQVNwQixPQUFULENBQWlCLEdBQWpCLElBQXNCLENBQXRDLENBQXBGO0FBQ0EsbUJBQUtNLElBQUwsR0FBWU8sU0FBWixDQUFzQkcsUUFBdEIsRUFBZ0MsT0FBSzVDLE9BQXJDO0FBQ0QsV0FIRDtBQUlELFNBTEQ7O0FBT0E7QUFDQSxhQUFLTixZQUFMLENBQWtCLE9BQWxCLEVBQTJCb0QsT0FBM0IsQ0FBbUMsb0JBQVk7QUFDN0NGLHFCQUFXLFVBQVUsR0FBVixHQUFnQixPQUFLckQsbUJBQXJCLEdBQTJDLEdBQXREO0FBQ0FxRCxzQkFBWUksU0FBU3JCLE1BQVQsQ0FBZ0JxQixTQUFTcEIsT0FBVCxDQUFpQixHQUFqQixJQUFzQixDQUF0QyxDQUFaOztBQUVBLGlCQUFLTSxJQUFMLEdBQVlPLFNBQVosQ0FBc0JHLFFBQXRCLEVBQWdDLE9BQUs1QyxPQUFyQztBQUNELFNBTEQ7O0FBUUE7QUFDQSxZQUFJVSxPQUFPQyxJQUFQLENBQVksS0FBS2pCLFlBQWpCLEVBQStCa0MsT0FBL0IsQ0FBdUMsTUFBdkMsSUFBK0MsQ0FBQyxDQUFwRCxFQUF1RDtBQUNyRCxlQUFLbEMsWUFBTCxDQUFrQixNQUFsQixFQUEwQm9ELE9BQTFCLENBQWtDLG9CQUFZO0FBQzVDRix1QkFBVyxTQUFTLEdBQVQsR0FBZSxPQUFLckQsbUJBQXBCLEdBQTBDLEdBQXJEO0FBQ0FxRCx3QkFBWUksU0FBU3JCLE1BQVQsQ0FBZ0JxQixTQUFTcEIsT0FBVCxDQUFpQixHQUFqQixJQUFzQixDQUF0QyxDQUFaOztBQUVBLG1CQUFLTSxJQUFMLEdBQVlPLFNBQVosQ0FBc0JHLFFBQXRCLEVBQWdDLE9BQUs1QyxPQUFyQztBQUNELFdBTEQ7QUFNRCxTQVBELE1BT08sSUFBSVUsT0FBT0MsSUFBUCxDQUFZLEtBQUtqQixZQUFqQixFQUErQmtDLE9BQS9CLENBQXVDLFFBQXZDLElBQWlELENBQUMsQ0FBdEQsRUFBeUQ7QUFDOUQsZUFBS2xDLFlBQUwsQ0FBa0IsUUFBbEIsRUFBNEJvRCxPQUE1QixDQUFvQyxzQkFBYztBQUNoREYsdUJBQVcsV0FBVyxHQUFYLEdBQWlCSyxXQUFXdkIsS0FBWCxDQUFpQixHQUFqQixFQUFzQixDQUF0QixDQUE1Qjs7QUFFQSxtQkFBS1EsSUFBTCxHQUFZTyxTQUFaLENBQXNCRyxRQUF0QixFQUFnQyxPQUFLNUMsT0FBckM7QUFDRCxXQUpEO0FBTUQ7QUFFRjtBQXRNZTtBQUFBO0FBQUEsMkJBd01YO0FBQ0gsZUFBTyxLQUFLWCxNQUFMLENBQVlnQyxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQTFNZTtBQUFBO0FBQUEsK0JBNE1QO0FBQ1AsYUFBS2hDLE1BQUwsQ0FBWTZELEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsSUFBNUI7QUFDRDtBQTlNZTtBQUFBO0FBQUEsaUNBZ05MO0FBQ1QsYUFBSzdELE1BQUwsQ0FBWTZELEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsS0FBNUI7QUFDRDtBQWxOZTtBQUFBO0FBQUEsZ0NBb05QO0FBQ1AsZUFBTyxLQUFLN0QsTUFBTCxDQUFZZ0MsR0FBWixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUF0TmU7O0FBQUE7QUFBQSxJQVFlMUMsU0FSZjs7QUF1TmpCOztBQUVESyxxQkFBbUJtRSxNQUFuQixHQUE0QixVQUFDQyxJQUFELEVBQVU7QUFDcEMsV0FBTyxJQUFJcEUsa0JBQUosQ0FBdUIsRUFBRVEsV0FBVzRELElBQWIsRUFBdkIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT3BFLGtCQUFQO0FBQ0QsQ0E5TkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvYm9keWNvbmZpZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpXG4gIDtcblxuICBjbGFzcyBCb2R5Q29uZmlndXJhdGlvbnMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19pbXBvcnRBbGxJbWFnZXMnLCdzZXRCb2R5T3BhY2l0eScsICdzZXRBY3RpdmVDb25maWd1cmF0aW9uJywgJ2hpZGUnLCAnc2hvdyddKVxuXG4gICAgICB0aGlzLl9tb2RlbC5zZXRDb25maWdzKCkgO1xuICAgICAgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uID0gc2V0dGluZ3MubW9kZWxEYXRhLm1vZGVsUmVwcmVzZW50YXRpb247XG4gICAgICB0aGlzLmFsbG93ZWRDb25maWdzID0gc2V0dGluZ3MubW9kZWxEYXRhLmFsbG93ZWRDb25maWdzO1xuICAgICAgdGhpcy5wYXJhbU9wdGlvbnMgPSBzZXR0aW5ncy5tb2RlbERhdGEucGFyYW1PcHRpb25zO1xuXG4gICAgICBpZiAoc2V0dGluZ3MubW9kZWxEYXRhLmluaXRpYWxDb25maWcub21lZ2EpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzID0geydzZW5zb3JDb25maWcnOiBudWxsLCAncmVhY3Rpb24nOiBudWxsLCAnbW90b3InOiBudWxsLCAncm9sbCc6IG51bGx9O1xuICAgICAgfSBlbHNlIGlmIChzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5tb3Rpb24pIHtcbiAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzID0geydzZW5zb3JDb25maWcnOiBudWxsLCAncmVhY3Rpb24nOiBudWxsLCAnbW90b3InOiBudWxsLCAnbW90aW9uJzogbnVsbH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3MgPSB7J3NlbnNvckNvbmZpZyc6IG51bGwsICdyZWFjdGlvbic6IG51bGwsICdtb3Rvcic6IG51bGwsICdyb2xsJzogbnVsbH07XG4gICAgICB9XG4gICAgICB0aGlzLm9wYWNpdHkgPSBzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5vcGFjaXR5PyBzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5vcGFjaXR5IDogMC4yO1xuXG4gICAgICAvLyBNT1ZFIFRIRSBGT0xMT1dJTkcgUEFSVFMgVE8gVklFVygpXG5cbiAgICAgIHRoaXMuaW1nUGF0aCA9ICcvY3NsaWIvbW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvaW1ncy8nO1xuICAgICAgdGhpcy5faW1wb3J0QWxsSW1hZ2VzKCk7XG5cbiAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5ib2R5Q29uZmlndXJhdGlvbk5hbWUpO1xuICAgICAgdGhpcy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLnYpO1xuICAgICAgaWYgKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLm9tZWdhKSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5vbWVnYSk7XG4gICAgICB9IGVsc2UgaWYgKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLm1vdGlvbikge1xuICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oc2V0dGluZ3MubW9kZWxEYXRhLmluaXRpYWxDb25maWcubW90aW9uKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5rKTtcbiAgICAgIHRoaXMuc2V0Qm9keU9wYWNpdHkodGhpcy5vcGFjaXR5KTtcblxuICAgIH1cblxuICAgIHNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oY29uZmlnTmFtZSkge1xuXG4gICAgICB2YXIgY29uZmlnVHlwZSA9IG51bGw7XG4gICAgICBpZiAoY29uZmlnTmFtZS5xdWFsaXRhdGl2ZVZhbHVlKSB7XG4gICAgICAgIGNvbmZpZ1R5cGUgPSBjb25maWdOYW1lLnF1YWxpdGF0aXZlVmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpZ1R5cGUgPSBjb25maWdOYW1lO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmtleXModGhpcy5hY3RpdmVDb25maWdzKS5zb21lKGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBpZihjb25maWdUeXBlLm1hdGNoKGNvbmZpZykpIHtcbiAgICAgICAgICBjb25maWdUeXBlID0gY29uZmlnO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgaW1nTmFtZSA9IG51bGw7XG4gICAgICBzd2l0Y2ggKGNvbmZpZ1R5cGUpIHtcbiAgICAgICAgY2FzZSAnc2Vuc29yQ29uZmlnJzpcbiAgICAgICAgdmFyIHByZXZOdW1TZW5zb3JzID0gMDtcbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkge1xuICAgICAgICAgICAgcHJldk51bVNlbnNvcnMgPSB0aGlzLl9tb2RlbC5nZXROdW1iZXJPZlNlbnNvcnModGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSk7XG4gICAgICAgICAgICB0aGlzLmhpZGUodGhpcy5fbW9kZWwuZ2V0Q29uZmlnSWQodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKSB7XG4gICAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBudW1iZXIgb2Ygc2Vuc29ycyBjaGFuZ2VzLCBhY3RpdmF0ZSBhbmQgZGUtYWN0aXZhdGUgY29ycmVzcG9uZGluZyBibG9ja3MgaW4gdGhlIHRvb2xraXQgYW5kIHRoZSB3b3JzcGFjZS5cbiAgICAgICAgICB2YXIgY3Vyck51bVNlbnNvcnMgPSB0aGlzLl9tb2RlbC5nZXROdW1iZXJPZlNlbnNvcnMoY29uZmlnTmFtZSk7XG4gICAgICAgICAgaWYgKGN1cnJOdW1TZW5zb3JzICE9IHByZXZOdW1TZW5zb3JzKSB7XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdCb2R5LkNoYW5nZScsIHtudW1TZW5zb3JzOiBjdXJyTnVtU2Vuc29yc30pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSA9IGNvbmZpZ05hbWU7XG4gICAgICAgICAgdGhpcy5zaG93KHRoaXMuX21vZGVsLmdldENvbmZpZ0lkKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pKTtcblxuICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pIHtcbiAgICAgICAgICAgIGltZ05hbWUgPSAncmVhY3Rpb24nICsgJ18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uICsgJ18nICsgdGhpcy5fbW9kZWwuZ2V0Q29uZmlnSWQodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkudG9Mb3dlckNhc2UoKS5zcGxpdCgnXycpWzFdICsgJ18nO1xuICAgICAgICAgICAgaW1nTmFtZSArPSB0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10uc3BsaXQoJ18nKVszXTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSA9IGltZ05hbWU7XG4gICAgICAgICAgICB0aGlzLnNob3codGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKTtcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWFjdGlvbic6XG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pIHtcbiAgICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbWdOYW1lID0gJ3JlYWN0aW9uJyArICdfJyArIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiArICdfJyArIHRoaXMuX21vZGVsLmdldENvbmZpZ0lkKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pLnRvTG93ZXJDYXNlKCkuc3BsaXQoJ18nKVsxXSArICdfJztcbiAgICAgICAgICAgIGltZ05hbWUgKz0gY29uZmlnTmFtZS5zdWJzdHIoY29uZmlnTmFtZS5pbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10gPSBpbWdOYW1lO1xuICAgICAgICAgICAgdGhpcy5zaG93KHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSk7XG4gICAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21vdG9yJzpcbiAgICAgICAgY2FzZSAncm9sbCc6XG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltZ05hbWUgPSBjb25maWdUeXBlICsgJ18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uICsgJ18nO1xuICAgICAgICAgIGltZ05hbWUgKz0gY29uZmlnTmFtZS5zdWJzdHIoY29uZmlnTmFtZS5pbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdID0gaW1nTmFtZTtcbiAgICAgICAgICB0aGlzLnNob3codGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnbW90aW9uJzpcbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUodGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1nTmFtZSA9IGNvbmZpZ05hbWUuc3Vic3RyKDAsY29uZmlnTmFtZS5tYXRjaCgnMHwxJykuaW5kZXgtMSk7XG4gICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdID0gaW1nTmFtZTtcbiAgICAgICAgICB0aGlzLnNob3codGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QWN0aXZlU2Vuc29yQ29uZmlndXJhdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0Q29uZmlnSlNPTih0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRCb2R5T3BhY2l0eShvcGFjaXR5KSB7XG4gICAgICBpZiAodHlwZW9mKG9wYWNpdHkpPT09J3N0cmluZycpIHtcbiAgICAgICAgb3BhY2l0eSA9IHBhcnNlSW50KG9wYWNpdHkuc3Vic3RyKG9wYWNpdHkuaW5kZXhPZignXycpKzEpKSAvIDEwMDtcbiAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LmtleXMob3BhY2l0eSkubGVuZ3RoKSB7XG4gICAgICAgIG9wYWNpdHkgPSBvcGFjaXR5Lm51bWVyaWNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3BhY2l0eSA9IG9wYWNpdHk7XG4gICAgICB0aGlzLnZpZXcoKS5fc2V0Qm9keU9wYWNpdHkob3BhY2l0eSk7XG4gICAgfVxuXG4gICAgaGlkZShjb25maWdJZCkge1xuICAgICAgdGhpcy52aWV3KCkuX2hpZGVDb25maWcoY29uZmlnSWQpO1xuICAgIH1cblxuICAgIHNob3coY29uZmlnSWQpIHtcbiAgICAgIHRoaXMudmlldygpLl9zaG93Q29uZmlnKGNvbmZpZ0lkKTtcbiAgICB9XG5cbiAgICBfaW1wb3J0QWxsSW1hZ2VzKCkge1xuICAgICAgLy8gQWRkIHRoZSBzZW5zb3IgY29uZmlndXJhdGlvbnNcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmRlZmF1bHRDb25maWdzKS5tYXAoY29uZmlndXJhdGlvbiA9PiB7XG5cbiAgICAgICAgdGhpcy52aWV3KCkuX2FkZExheWVyKHRoaXMuX21vZGVsLmRlZmF1bHRDb25maWdzW2NvbmZpZ3VyYXRpb25dLmlkLCB0aGlzLmltZ1BhdGgpO1xuICAgICAgfSlcblxuICAgICAgbGV0IGZpbGVOYW1lID0gbnVsbDtcblxuICAgICAgLy8gQWRkIHRoZSBsYWJlbCwgbWVjaGFuaXN0aWMgb3IgZnVuY3Rpb25hbFxuICAgICAgZmlsZU5hbWUgPSAnbGFiZWxzXycgKyB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb247XG4gICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIoZmlsZU5hbWUsIHRoaXMuaW1nUGF0aCk7XG5cbiAgICAgIC8vIEFkZCB0aGUgcmVhY3Rpb24gY29uZmlndXJhdGlvbnNcbiAgICAgIHZhciBzZW5zb3JDb25maWdzID0gWydiYWNrJywnZnJvbnQnLCdiYWNrbGVmdCcsJ2JhY2tyaWdodCcsJ2Zyb250bGVmdCcsJ2Zyb250cmlnaHQnLCdmcm9udGNlbnRlciddXG5cbiAgICAgIHRoaXMucGFyYW1PcHRpb25zWydyZWFjdGlvbiddLmZvckVhY2goc3RyZW5ndGggPT4ge1xuICAgICAgICBzZW5zb3JDb25maWdzLmZvckVhY2goc2Vuc29yQ29uZmlnID0+IHtcbiAgICAgICAgICBmaWxlTmFtZSA9ICdyZWFjdGlvbicgKyAnXycgKyB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gKyAnXycgKyBzZW5zb3JDb25maWcgKyAnXycgKyBzdHJlbmd0aC5zdWJzdHIoc3RyZW5ndGguaW5kZXhPZignXycpKzEpO1xuICAgICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFkZCB0aGUgbW90b3IgLyBzcGVlZCBjb25maWd1cmF0aW9ucywgbWVjaGFuaXN0aWMgb3IgZnVuY3Rpb25hbFxuICAgICAgdGhpcy5wYXJhbU9wdGlvbnNbJ21vdG9yJ10uZm9yRWFjaChzdHJlbmd0aCA9PiB7XG4gICAgICAgIGZpbGVOYW1lID0gJ21vdG9yJyArICdfJyArIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiArICdfJztcbiAgICAgICAgZmlsZU5hbWUgKz0gc3RyZW5ndGguc3Vic3RyKHN0cmVuZ3RoLmluZGV4T2YoJ18nKSsxKVxuXG4gICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcbiAgICAgIH0pXG5cblxuICAgICAgLy8gQWRkIHRoZSByb2xsIGNvbmZpZ3VyYXRpb25zLCBtZWNoYW5pc3RpYyBvciBmdW5jdGlvbmFsXG4gICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5wYXJhbU9wdGlvbnMpLmluZGV4T2YoJ3JvbGwnKT4tMSkge1xuICAgICAgICB0aGlzLnBhcmFtT3B0aW9uc1sncm9sbCddLmZvckVhY2goc3RyZW5ndGggPT4ge1xuICAgICAgICAgIGZpbGVOYW1lID0gJ3JvbGwnICsgJ18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uICsgJ18nO1xuICAgICAgICAgIGZpbGVOYW1lICs9IHN0cmVuZ3RoLnN1YnN0cihzdHJlbmd0aC5pbmRleE9mKCdfJykrMSlcblxuICAgICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LmtleXModGhpcy5wYXJhbU9wdGlvbnMpLmluZGV4T2YoJ21vdGlvbicpPi0xKSB7XG4gICAgICAgIHRoaXMucGFyYW1PcHRpb25zWydtb3Rpb24nXS5mb3JFYWNoKG1vdGlvblR5cGUgPT4ge1xuICAgICAgICAgIGZpbGVOYW1lID0gJ21vdGlvbicgKyAnXycgKyBtb3Rpb25UeXBlLnNwbGl0KCdfJylbMV07XG5cbiAgICAgICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIoZmlsZU5hbWUsIHRoaXMuaW1nUGF0aCk7XG4gICAgICAgIH0pXG5cbiAgICAgIH1cblxuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgIH1cblxuICAgIHNlbGVjdCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBkZXNlbGVjdCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG4gIH07XG5cbiAgQm9keUNvbmZpZ3VyYXRpb25zLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBCb2R5Q29uZmlndXJhdGlvbnMoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gQm9keUNvbmZpZ3VyYXRpb25zO1xufSk7XG4iXX0=
