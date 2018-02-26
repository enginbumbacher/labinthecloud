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

      if (_this.modelRepresentation === 'functional') {
        _this.activeConfigs = { 'sensorConfig': null, 'reaction': null, 'motor': null, 'roll': null };
      } else if (_this.modelRepresentation === 'mechanistic') {
        _this.activeConfigs = { 'sensorConfig': null, 'reaction': null, 'motor': null, 'motion': null };
      }
      _this.opacity = settings.modelData.initialConfig.opacity ? settings.modelData.initialConfig.opacity : 0;

      // MOVE THE FOLLOWING PARTS TO VIEW()

      _this.imgPath = '/cslib/module/euglena/model_blockly/bodyConfigurations/imgs/';
      _this._importAllImages();

      _this.setActiveConfiguration(settings.modelData.initialConfig.bodyConfigurationName);
      _this.setActiveConfiguration(settings.modelData.initialConfig.v);
      if (_this.modelRepresentation === 'functional') {
        _this.setActiveConfiguration(settings.modelData.initialConfig.omega);
      } else if (_this.modelRepresentation === 'mechanistic') {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJHbG9iYWxzIiwiVXRpbHMiLCJCb2R5Q29uZmlndXJhdGlvbnMiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9tb2RlbCIsInNldENvbmZpZ3MiLCJtb2RlbFJlcHJlc2VudGF0aW9uIiwibW9kZWxEYXRhIiwiYWxsb3dlZENvbmZpZ3MiLCJwYXJhbU9wdGlvbnMiLCJhY3RpdmVDb25maWdzIiwib3BhY2l0eSIsImluaXRpYWxDb25maWciLCJpbWdQYXRoIiwiX2ltcG9ydEFsbEltYWdlcyIsInNldEFjdGl2ZUNvbmZpZ3VyYXRpb24iLCJib2R5Q29uZmlndXJhdGlvbk5hbWUiLCJ2Iiwib21lZ2EiLCJtb3Rpb24iLCJrIiwic2V0Qm9keU9wYWNpdHkiLCJjb25maWdOYW1lIiwiY29uZmlnVHlwZSIsInF1YWxpdGF0aXZlVmFsdWUiLCJPYmplY3QiLCJrZXlzIiwic29tZSIsImNvbmZpZyIsIm1hdGNoIiwiaW1nTmFtZSIsInByZXZOdW1TZW5zb3JzIiwiZ2V0TnVtYmVyT2ZTZW5zb3JzIiwiaGlkZSIsImdldENvbmZpZ0lkIiwiY3Vyck51bVNlbnNvcnMiLCJnZXQiLCJkaXNwYXRjaEV2ZW50IiwibnVtU2Vuc29ycyIsInNob3ciLCJ0b0xvd2VyQ2FzZSIsInNwbGl0Iiwic3Vic3RyIiwiaW5kZXhPZiIsImluZGV4IiwiZ2V0Q29uZmlnSlNPTiIsInBhcnNlSW50IiwibGVuZ3RoIiwibnVtZXJpY1ZhbHVlIiwidmlldyIsIl9zZXRCb2R5T3BhY2l0eSIsImNvbmZpZ0lkIiwiX2hpZGVDb25maWciLCJfc2hvd0NvbmZpZyIsImRlZmF1bHRDb25maWdzIiwibWFwIiwiX2FkZExheWVyIiwiY29uZmlndXJhdGlvbiIsImlkIiwiZmlsZU5hbWUiLCJzZW5zb3JDb25maWdzIiwiZm9yRWFjaCIsInNlbnNvckNvbmZpZyIsInN0cmVuZ3RoIiwibW90aW9uVHlwZSIsInNldCIsImNyZWF0ZSIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxVQUFVSixRQUFRLG9CQUFSLENBSFo7QUFBQSxNQUlFSyxRQUFRTCxRQUFRLGlCQUFSLENBSlY7O0FBRGtCLE1BUVpNLGtCQVJZO0FBQUE7O0FBU2hCLGtDQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJOLEtBQTdDO0FBQ0FLLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JOLElBQTNDOztBQUZ5QiwwSUFHbkJJLFFBSG1COztBQUl6QkYsWUFBTUssV0FBTixRQUF3QixDQUFDLGtCQUFELEVBQW9CLGdCQUFwQixFQUFzQyx3QkFBdEMsRUFBZ0UsTUFBaEUsRUFBd0UsTUFBeEUsQ0FBeEI7O0FBRUEsWUFBS0MsTUFBTCxDQUFZQyxVQUFaO0FBQ0EsWUFBS0MsbUJBQUwsR0FBMkJOLFNBQVNPLFNBQVQsQ0FBbUJELG1CQUE5QztBQUNBLFlBQUtFLGNBQUwsR0FBc0JSLFNBQVNPLFNBQVQsQ0FBbUJDLGNBQXpDO0FBQ0EsWUFBS0MsWUFBTCxHQUFvQlQsU0FBU08sU0FBVCxDQUFtQkUsWUFBdkM7O0FBRUEsVUFBSSxNQUFLSCxtQkFBTCxLQUE2QixZQUFqQyxFQUErQztBQUM3QyxjQUFLSSxhQUFMLEdBQXFCLEVBQUMsZ0JBQWdCLElBQWpCLEVBQXVCLFlBQVksSUFBbkMsRUFBeUMsU0FBUyxJQUFsRCxFQUF3RCxRQUFRLElBQWhFLEVBQXJCO0FBQ0QsT0FGRCxNQUVPLElBQUksTUFBS0osbUJBQUwsS0FBNkIsYUFBakMsRUFBZ0Q7QUFDckQsY0FBS0ksYUFBTCxHQUFxQixFQUFDLGdCQUFnQixJQUFqQixFQUF1QixZQUFZLElBQW5DLEVBQXlDLFNBQVMsSUFBbEQsRUFBd0QsVUFBVSxJQUFsRSxFQUFyQjtBQUNEO0FBQ0QsWUFBS0MsT0FBTCxHQUFlWCxTQUFTTyxTQUFULENBQW1CSyxhQUFuQixDQUFpQ0QsT0FBakMsR0FBMENYLFNBQVNPLFNBQVQsQ0FBbUJLLGFBQW5CLENBQWlDRCxPQUEzRSxHQUFxRixDQUFwRzs7QUFFQTs7QUFFQSxZQUFLRSxPQUFMLEdBQWUsOERBQWY7QUFDQSxZQUFLQyxnQkFBTDs7QUFFQSxZQUFLQyxzQkFBTCxDQUE0QmYsU0FBU08sU0FBVCxDQUFtQkssYUFBbkIsQ0FBaUNJLHFCQUE3RDtBQUNBLFlBQUtELHNCQUFMLENBQTRCZixTQUFTTyxTQUFULENBQW1CSyxhQUFuQixDQUFpQ0ssQ0FBN0Q7QUFDQSxVQUFJLE1BQUtYLG1CQUFMLEtBQTZCLFlBQWpDLEVBQStDO0FBQzdDLGNBQUtTLHNCQUFMLENBQTRCZixTQUFTTyxTQUFULENBQW1CSyxhQUFuQixDQUFpQ00sS0FBN0Q7QUFDRCxPQUZELE1BRU8sSUFBSSxNQUFLWixtQkFBTCxLQUE2QixhQUFqQyxFQUFnRDtBQUNyRCxjQUFLUyxzQkFBTCxDQUE0QmYsU0FBU08sU0FBVCxDQUFtQkssYUFBbkIsQ0FBaUNPLE1BQTdEO0FBQ0Q7QUFDRCxZQUFLSixzQkFBTCxDQUE0QmYsU0FBU08sU0FBVCxDQUFtQkssYUFBbkIsQ0FBaUNRLENBQTdEO0FBQ0EsWUFBS0MsY0FBTCxDQUFvQixNQUFLVixPQUF6Qjs7QUEvQnlCO0FBaUMxQjs7QUExQ2U7QUFBQTtBQUFBLDZDQTRDT1csVUE1Q1AsRUE0Q21COztBQUVqQyxZQUFJQyxhQUFhLElBQWpCO0FBQ0EsWUFBSUQsV0FBV0UsZ0JBQWYsRUFBaUM7QUFDL0JELHVCQUFhRCxXQUFXRSxnQkFBeEI7QUFDRCxTQUZELE1BRU87QUFDTEQsdUJBQWFELFVBQWI7QUFDRDtBQUNERyxlQUFPQyxJQUFQLENBQVksS0FBS2hCLGFBQWpCLEVBQWdDaUIsSUFBaEMsQ0FBcUMsVUFBU0MsTUFBVCxFQUFpQjtBQUNwRCxjQUFHTCxXQUFXTSxLQUFYLENBQWlCRCxNQUFqQixDQUFILEVBQTZCO0FBQzNCTCx5QkFBYUssTUFBYjtBQUNBLG1CQUFPLElBQVA7QUFDRDtBQUNGLFNBTEQ7O0FBT0EsWUFBSUUsVUFBVSxJQUFkO0FBQ0EsZ0JBQVFQLFVBQVI7QUFDRSxlQUFLLGNBQUw7QUFDQSxnQkFBSVEsaUJBQWlCLENBQXJCO0FBQ0UsZ0JBQUksS0FBS3JCLGFBQUwsQ0FBbUIsY0FBbkIsQ0FBSixFQUF3QztBQUN0Q3FCLCtCQUFpQixLQUFLM0IsTUFBTCxDQUFZNEIsa0JBQVosQ0FBK0IsS0FBS3RCLGFBQUwsQ0FBbUIsY0FBbkIsQ0FBL0IsQ0FBakI7QUFDQSxtQkFBS3VCLElBQUwsQ0FBVSxLQUFLN0IsTUFBTCxDQUFZOEIsV0FBWixDQUF3QixLQUFLeEIsYUFBTCxDQUFtQixjQUFuQixDQUF4QixDQUFWOztBQUVBLGtCQUFJLEtBQUtBLGFBQUwsQ0FBbUIsVUFBbkIsQ0FBSixFQUFvQztBQUNsQyxxQkFBS3VCLElBQUwsQ0FBVSxLQUFLdkIsYUFBTCxDQUFtQixVQUFuQixDQUFWO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLGdCQUFJeUIsaUJBQWlCLEtBQUsvQixNQUFMLENBQVk0QixrQkFBWixDQUErQlYsVUFBL0IsQ0FBckI7QUFDQSxnQkFBSWEsa0JBQWtCSixjQUF0QixFQUFzQztBQUNwQ2xDLHNCQUFRdUMsR0FBUixDQUFZLE9BQVosRUFBcUJDLGFBQXJCLENBQW1DLGFBQW5DLEVBQWtELEVBQUNDLFlBQVlILGNBQWIsRUFBbEQ7QUFDRDs7QUFFRCxpQkFBS3pCLGFBQUwsQ0FBbUIsY0FBbkIsSUFBcUNZLFVBQXJDO0FBQ0EsaUJBQUtpQixJQUFMLENBQVUsS0FBS25DLE1BQUwsQ0FBWThCLFdBQVosQ0FBd0IsS0FBS3hCLGFBQUwsQ0FBbUIsY0FBbkIsQ0FBeEIsQ0FBVjs7QUFFQSxnQkFBSSxLQUFLQSxhQUFMLENBQW1CLFVBQW5CLENBQUosRUFBb0M7QUFDbENvQix3QkFBVSxhQUFhLEdBQWIsR0FBbUIsS0FBS3hCLG1CQUF4QixHQUE4QyxHQUE5QyxHQUFvRCxLQUFLRixNQUFMLENBQVk4QixXQUFaLENBQXdCLEtBQUt4QixhQUFMLENBQW1CLGNBQW5CLENBQXhCLEVBQTREOEIsV0FBNUQsR0FBMEVDLEtBQTFFLENBQWdGLEdBQWhGLEVBQXFGLENBQXJGLENBQXBELEdBQThJLEdBQXhKO0FBQ0FYLHlCQUFXLEtBQUtwQixhQUFMLENBQW1CLFVBQW5CLEVBQStCK0IsS0FBL0IsQ0FBcUMsR0FBckMsRUFBMEMsQ0FBMUMsQ0FBWDtBQUNBLG1CQUFLL0IsYUFBTCxDQUFtQixVQUFuQixJQUFpQ29CLE9BQWpDO0FBQ0EsbUJBQUtTLElBQUwsQ0FBVSxLQUFLN0IsYUFBTCxDQUFtQixVQUFuQixDQUFWO0FBQ0Q7QUFDSDtBQUNBLGVBQUssVUFBTDtBQUNFLGdCQUFJLEtBQUtBLGFBQUwsQ0FBbUIsY0FBbkIsQ0FBSixFQUF3QztBQUN0QyxrQkFBSSxLQUFLQSxhQUFMLENBQW1CLFVBQW5CLENBQUosRUFBb0M7QUFDbEMscUJBQUt1QixJQUFMLENBQVUsS0FBS3ZCLGFBQUwsQ0FBbUIsVUFBbkIsQ0FBVjtBQUNEO0FBQ0RvQix3QkFBVSxhQUFhLEdBQWIsR0FBbUIsS0FBS3hCLG1CQUF4QixHQUE4QyxHQUE5QyxHQUFvRCxLQUFLRixNQUFMLENBQVk4QixXQUFaLENBQXdCLEtBQUt4QixhQUFMLENBQW1CLGNBQW5CLENBQXhCLEVBQTREOEIsV0FBNUQsR0FBMEVDLEtBQTFFLENBQWdGLEdBQWhGLEVBQXFGLENBQXJGLENBQXBELEdBQThJLEdBQXhKO0FBQ0FYLHlCQUFXUixXQUFXb0IsTUFBWCxDQUFrQnBCLFdBQVdxQixPQUFYLENBQW1CLEdBQW5CLElBQXdCLENBQTFDLENBQVg7QUFDQSxtQkFBS2pDLGFBQUwsQ0FBbUIsVUFBbkIsSUFBaUNvQixPQUFqQztBQUNBLG1CQUFLUyxJQUFMLENBQVUsS0FBSzdCLGFBQUwsQ0FBbUIsVUFBbkIsQ0FBVjtBQUNEO0FBQ0w7QUFDRSxlQUFLLE9BQUw7QUFDQSxlQUFLLE1BQUw7QUFDRSxnQkFBSSxLQUFLQSxhQUFMLENBQW1CYSxVQUFuQixDQUFKLEVBQW9DO0FBQ2xDLG1CQUFLVSxJQUFMLENBQVUsS0FBS3ZCLGFBQUwsQ0FBbUJhLFVBQW5CLENBQVY7QUFDRDtBQUNETyxzQkFBVVAsYUFBYSxHQUFiLEdBQW1CLEtBQUtqQixtQkFBeEIsR0FBOEMsR0FBeEQ7QUFDQXdCLHVCQUFXUixXQUFXb0IsTUFBWCxDQUFrQnBCLFdBQVdxQixPQUFYLENBQW1CLEdBQW5CLElBQXdCLENBQTFDLENBQVg7QUFDQSxpQkFBS2pDLGFBQUwsQ0FBbUJhLFVBQW5CLElBQWlDTyxPQUFqQztBQUNBLGlCQUFLUyxJQUFMLENBQVUsS0FBSzdCLGFBQUwsQ0FBbUJhLFVBQW5CLENBQVY7QUFDRjs7QUFFQSxlQUFLLFFBQUw7QUFDRSxnQkFBSSxLQUFLYixhQUFMLENBQW1CYSxVQUFuQixDQUFKLEVBQW9DO0FBQ2xDLG1CQUFLVSxJQUFMLENBQVUsS0FBS3ZCLGFBQUwsQ0FBbUJhLFVBQW5CLENBQVY7QUFDRDtBQUNETyxzQkFBVVIsV0FBV29CLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBb0JwQixXQUFXTyxLQUFYLENBQWlCLEtBQWpCLEVBQXdCZSxLQUF4QixHQUE4QixDQUFsRCxDQUFWO0FBQ0EsaUJBQUtsQyxhQUFMLENBQW1CYSxVQUFuQixJQUFpQ08sT0FBakM7QUFDQSxpQkFBS1MsSUFBTCxDQUFVLEtBQUs3QixhQUFMLENBQW1CYSxVQUFuQixDQUFWO0FBQ0Y7QUF6REY7QUEyREQ7QUF2SGU7QUFBQTtBQUFBLHFEQXlIZTtBQUMzQixZQUFJLEtBQUtiLGFBQUwsQ0FBbUIsY0FBbkIsQ0FBSixFQUF3QztBQUN0QyxpQkFBTyxLQUFLTixNQUFMLENBQVl5QyxhQUFaLENBQTBCLEtBQUtuQyxhQUFMLENBQW1CLGNBQW5CLENBQTFCLENBQVA7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBTyxJQUFQO0FBQ0Q7QUFDSjtBQS9IZTtBQUFBO0FBQUEscUNBaUlEQyxPQWpJQyxFQWlJUTtBQUN0QixZQUFJLE9BQU9BLE9BQVAsS0FBa0IsUUFBdEIsRUFBZ0M7QUFDOUJBLG9CQUFVbUMsU0FBU25DLFFBQVErQixNQUFSLENBQWUvQixRQUFRZ0MsT0FBUixDQUFnQixHQUFoQixJQUFxQixDQUFwQyxDQUFULElBQW1ELEdBQTdEO0FBQ0QsU0FGRCxNQUVPLElBQUlsQixPQUFPQyxJQUFQLENBQVlmLE9BQVosRUFBcUJvQyxNQUF6QixFQUFpQztBQUN0Q3BDLG9CQUFVQSxRQUFRcUMsWUFBbEI7QUFDRDtBQUNELGFBQUtyQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxhQUFLc0MsSUFBTCxHQUFZQyxlQUFaLENBQTRCdkMsT0FBNUI7QUFDRDtBQXpJZTtBQUFBO0FBQUEsMkJBMklYd0MsUUEzSVcsRUEySUQ7QUFDYixhQUFLRixJQUFMLEdBQVlHLFdBQVosQ0FBd0JELFFBQXhCO0FBQ0Q7QUE3SWU7QUFBQTtBQUFBLDJCQStJWEEsUUEvSVcsRUErSUQ7QUFDYixhQUFLRixJQUFMLEdBQVlJLFdBQVosQ0FBd0JGLFFBQXhCO0FBQ0Q7QUFqSmU7QUFBQTtBQUFBLHlDQW1KRztBQUFBOztBQUNqQjtBQUNBMUIsZUFBT0MsSUFBUCxDQUFZLEtBQUt0QixNQUFMLENBQVlrRCxjQUF4QixFQUF3Q0MsR0FBeEMsQ0FBNEMseUJBQWlCOztBQUUzRCxpQkFBS04sSUFBTCxHQUFZTyxTQUFaLENBQXNCLE9BQUtwRCxNQUFMLENBQVlrRCxjQUFaLENBQTJCRyxhQUEzQixFQUEwQ0MsRUFBaEUsRUFBb0UsT0FBSzdDLE9BQXpFO0FBQ0QsU0FIRDs7QUFLQSxZQUFJOEMsV0FBVyxJQUFmOztBQUVBO0FBQ0FBLG1CQUFXLFlBQVksS0FBS3JELG1CQUE1QjtBQUNBLGFBQUsyQyxJQUFMLEdBQVlPLFNBQVosQ0FBc0JHLFFBQXRCLEVBQWdDLEtBQUs5QyxPQUFyQzs7QUFFQTtBQUNBLFlBQUkrQyxnQkFBZ0IsQ0FBQyxNQUFELEVBQVEsT0FBUixFQUFnQixVQUFoQixFQUEyQixXQUEzQixFQUF1QyxXQUF2QyxFQUFtRCxZQUFuRCxFQUFnRSxhQUFoRSxDQUFwQjs7QUFFQSxhQUFLbkQsWUFBTCxDQUFrQixVQUFsQixFQUE4Qm9ELE9BQTlCLENBQXNDLG9CQUFZO0FBQ2hERCx3QkFBY0MsT0FBZCxDQUFzQix3QkFBZ0I7QUFDcENGLHVCQUFXLGFBQWEsR0FBYixHQUFtQixPQUFLckQsbUJBQXhCLEdBQThDLEdBQTlDLEdBQW9Ed0QsWUFBcEQsR0FBbUUsR0FBbkUsR0FBeUVDLFNBQVNyQixNQUFULENBQWdCcUIsU0FBU3BCLE9BQVQsQ0FBaUIsR0FBakIsSUFBc0IsQ0FBdEMsQ0FBcEY7QUFDQSxtQkFBS00sSUFBTCxHQUFZTyxTQUFaLENBQXNCRyxRQUF0QixFQUFnQyxPQUFLOUMsT0FBckM7QUFDRCxXQUhEO0FBSUQsU0FMRDs7QUFPQTtBQUNBLGFBQUtKLFlBQUwsQ0FBa0IsT0FBbEIsRUFBMkJvRCxPQUEzQixDQUFtQyxvQkFBWTtBQUM3Q0YscUJBQVcsVUFBVSxHQUFWLEdBQWdCLE9BQUtyRCxtQkFBckIsR0FBMkMsR0FBdEQ7QUFDQXFELHNCQUFZSSxTQUFTckIsTUFBVCxDQUFnQnFCLFNBQVNwQixPQUFULENBQWlCLEdBQWpCLElBQXNCLENBQXRDLENBQVo7O0FBRUEsaUJBQUtNLElBQUwsR0FBWU8sU0FBWixDQUFzQkcsUUFBdEIsRUFBZ0MsT0FBSzlDLE9BQXJDO0FBQ0QsU0FMRDs7QUFRQTtBQUNBLFlBQUlZLE9BQU9DLElBQVAsQ0FBWSxLQUFLakIsWUFBakIsRUFBK0JrQyxPQUEvQixDQUF1QyxNQUF2QyxJQUErQyxDQUFDLENBQXBELEVBQXVEO0FBQ3JELGVBQUtsQyxZQUFMLENBQWtCLE1BQWxCLEVBQTBCb0QsT0FBMUIsQ0FBa0Msb0JBQVk7QUFDNUNGLHVCQUFXLFNBQVMsR0FBVCxHQUFlLE9BQUtyRCxtQkFBcEIsR0FBMEMsR0FBckQ7QUFDQXFELHdCQUFZSSxTQUFTckIsTUFBVCxDQUFnQnFCLFNBQVNwQixPQUFULENBQWlCLEdBQWpCLElBQXNCLENBQXRDLENBQVo7O0FBRUEsbUJBQUtNLElBQUwsR0FBWU8sU0FBWixDQUFzQkcsUUFBdEIsRUFBZ0MsT0FBSzlDLE9BQXJDO0FBQ0QsV0FMRDtBQU1ELFNBUEQsTUFPTyxJQUFJWSxPQUFPQyxJQUFQLENBQVksS0FBS2pCLFlBQWpCLEVBQStCa0MsT0FBL0IsQ0FBdUMsUUFBdkMsSUFBaUQsQ0FBQyxDQUF0RCxFQUF5RDtBQUM5RCxlQUFLbEMsWUFBTCxDQUFrQixRQUFsQixFQUE0Qm9ELE9BQTVCLENBQW9DLHNCQUFjO0FBQ2hERix1QkFBVyxXQUFXLEdBQVgsR0FBaUJLLFdBQVd2QixLQUFYLENBQWlCLEdBQWpCLEVBQXNCLENBQXRCLENBQTVCOztBQUVBLG1CQUFLUSxJQUFMLEdBQVlPLFNBQVosQ0FBc0JHLFFBQXRCLEVBQWdDLE9BQUs5QyxPQUFyQztBQUNELFdBSkQ7QUFNRDtBQUVGO0FBcE1lO0FBQUE7QUFBQSwyQkFzTVg7QUFDSCxlQUFPLEtBQUtULE1BQUwsQ0FBWWdDLEdBQVosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBeE1lO0FBQUE7QUFBQSwrQkEwTVA7QUFDUCxhQUFLaEMsTUFBTCxDQUFZNkQsR0FBWixDQUFnQixVQUFoQixFQUE0QixJQUE1QjtBQUNEO0FBNU1lO0FBQUE7QUFBQSxpQ0E4TUw7QUFDVCxhQUFLN0QsTUFBTCxDQUFZNkQsR0FBWixDQUFnQixVQUFoQixFQUE0QixLQUE1QjtBQUNEO0FBaE5lO0FBQUE7QUFBQSxnQ0FrTlA7QUFDUCxlQUFPLEtBQUs3RCxNQUFMLENBQVlnQyxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQXBOZTs7QUFBQTtBQUFBLElBUWUxQyxTQVJmOztBQXFOakI7O0FBRURLLHFCQUFtQm1FLE1BQW5CLEdBQTRCLFVBQUNDLElBQUQsRUFBVTtBQUNwQyxXQUFPLElBQUlwRSxrQkFBSixDQUF1QixFQUFFUSxXQUFXNEQsSUFBYixFQUF2QixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPcEUsa0JBQVA7QUFDRCxDQTVORCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9ib2R5Y29uZmlncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIGNsYXNzIEJvZHlDb25maWd1cmF0aW9ucyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX2ltcG9ydEFsbEltYWdlcycsJ3NldEJvZHlPcGFjaXR5JywgJ3NldEFjdGl2ZUNvbmZpZ3VyYXRpb24nLCAnaGlkZScsICdzaG93J10pXG5cbiAgICAgIHRoaXMuX21vZGVsLnNldENvbmZpZ3MoKSA7XG4gICAgICB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gPSBzZXR0aW5ncy5tb2RlbERhdGEubW9kZWxSZXByZXNlbnRhdGlvbjtcbiAgICAgIHRoaXMuYWxsb3dlZENvbmZpZ3MgPSBzZXR0aW5ncy5tb2RlbERhdGEuYWxsb3dlZENvbmZpZ3M7XG4gICAgICB0aGlzLnBhcmFtT3B0aW9ucyA9IHNldHRpbmdzLm1vZGVsRGF0YS5wYXJhbU9wdGlvbnM7XG5cbiAgICAgIGlmICh0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gPT09ICdmdW5jdGlvbmFsJykge1xuICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3MgPSB7J3NlbnNvckNvbmZpZyc6IG51bGwsICdyZWFjdGlvbic6IG51bGwsICdtb3Rvcic6IG51bGwsICdyb2xsJzogbnVsbH07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiA9PT0gJ21lY2hhbmlzdGljJykge1xuICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3MgPSB7J3NlbnNvckNvbmZpZyc6IG51bGwsICdyZWFjdGlvbic6IG51bGwsICdtb3Rvcic6IG51bGwsICdtb3Rpb24nOiBudWxsfTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3BhY2l0eSA9IHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLm9wYWNpdHk/IHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLm9wYWNpdHkgOiAwO1xuXG4gICAgICAvLyBNT1ZFIFRIRSBGT0xMT1dJTkcgUEFSVFMgVE8gVklFVygpXG5cbiAgICAgIHRoaXMuaW1nUGF0aCA9ICcvY3NsaWIvbW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvaW1ncy8nO1xuICAgICAgdGhpcy5faW1wb3J0QWxsSW1hZ2VzKCk7XG5cbiAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5ib2R5Q29uZmlndXJhdGlvbk5hbWUpO1xuICAgICAgdGhpcy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKHNldHRpbmdzLm1vZGVsRGF0YS5pbml0aWFsQ29uZmlnLnYpO1xuICAgICAgaWYgKHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiA9PT0gJ2Z1bmN0aW9uYWwnKSB7XG4gICAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5vbWVnYSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiA9PT0gJ21lY2hhbmlzdGljJykge1xuICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oc2V0dGluZ3MubW9kZWxEYXRhLmluaXRpYWxDb25maWcubW90aW9uKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuaW5pdGlhbENvbmZpZy5rKTtcbiAgICAgIHRoaXMuc2V0Qm9keU9wYWNpdHkodGhpcy5vcGFjaXR5KTtcblxuICAgIH1cblxuICAgIHNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oY29uZmlnTmFtZSkge1xuXG4gICAgICB2YXIgY29uZmlnVHlwZSA9IG51bGw7XG4gICAgICBpZiAoY29uZmlnTmFtZS5xdWFsaXRhdGl2ZVZhbHVlKSB7XG4gICAgICAgIGNvbmZpZ1R5cGUgPSBjb25maWdOYW1lLnF1YWxpdGF0aXZlVmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpZ1R5cGUgPSBjb25maWdOYW1lO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmtleXModGhpcy5hY3RpdmVDb25maWdzKS5zb21lKGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBpZihjb25maWdUeXBlLm1hdGNoKGNvbmZpZykpIHtcbiAgICAgICAgICBjb25maWdUeXBlID0gY29uZmlnO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgaW1nTmFtZSA9IG51bGw7XG4gICAgICBzd2l0Y2ggKGNvbmZpZ1R5cGUpIHtcbiAgICAgICAgY2FzZSAnc2Vuc29yQ29uZmlnJzpcbiAgICAgICAgdmFyIHByZXZOdW1TZW5zb3JzID0gMDtcbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkge1xuICAgICAgICAgICAgcHJldk51bVNlbnNvcnMgPSB0aGlzLl9tb2RlbC5nZXROdW1iZXJPZlNlbnNvcnModGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSk7XG4gICAgICAgICAgICB0aGlzLmhpZGUodGhpcy5fbW9kZWwuZ2V0Q29uZmlnSWQodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKSB7XG4gICAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBudW1iZXIgb2Ygc2Vuc29ycyBjaGFuZ2VzLCBhY3RpdmF0ZSBhbmQgZGUtYWN0aXZhdGUgY29ycmVzcG9uZGluZyBibG9ja3MgaW4gdGhlIHRvb2xraXQgYW5kIHRoZSB3b3JzcGFjZS5cbiAgICAgICAgICB2YXIgY3Vyck51bVNlbnNvcnMgPSB0aGlzLl9tb2RlbC5nZXROdW1iZXJPZlNlbnNvcnMoY29uZmlnTmFtZSk7XG4gICAgICAgICAgaWYgKGN1cnJOdW1TZW5zb3JzICE9IHByZXZOdW1TZW5zb3JzKSB7XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdCb2R5LkNoYW5nZScsIHtudW1TZW5zb3JzOiBjdXJyTnVtU2Vuc29yc30pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSA9IGNvbmZpZ05hbWU7XG4gICAgICAgICAgdGhpcy5zaG93KHRoaXMuX21vZGVsLmdldENvbmZpZ0lkKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pKTtcblxuICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pIHtcbiAgICAgICAgICAgIGltZ05hbWUgPSAncmVhY3Rpb24nICsgJ18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uICsgJ18nICsgdGhpcy5fbW9kZWwuZ2V0Q29uZmlnSWQodGhpcy5hY3RpdmVDb25maWdzWydzZW5zb3JDb25maWcnXSkudG9Mb3dlckNhc2UoKS5zcGxpdCgnXycpWzFdICsgJ18nO1xuICAgICAgICAgICAgaW1nTmFtZSArPSB0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10uc3BsaXQoJ18nKVszXTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSA9IGltZ05hbWU7XG4gICAgICAgICAgICB0aGlzLnNob3codGhpcy5hY3RpdmVDb25maWdzWydyZWFjdGlvbiddKTtcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWFjdGlvbic6XG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10pIHtcbiAgICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbWdOYW1lID0gJ3JlYWN0aW9uJyArICdfJyArIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiArICdfJyArIHRoaXMuX21vZGVsLmdldENvbmZpZ0lkKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pLnRvTG93ZXJDYXNlKCkuc3BsaXQoJ18nKVsxXSArICdfJztcbiAgICAgICAgICAgIGltZ05hbWUgKz0gY29uZmlnTmFtZS5zdWJzdHIoY29uZmlnTmFtZS5pbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3JlYWN0aW9uJ10gPSBpbWdOYW1lO1xuICAgICAgICAgICAgdGhpcy5zaG93KHRoaXMuYWN0aXZlQ29uZmlnc1sncmVhY3Rpb24nXSk7XG4gICAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21vdG9yJzpcbiAgICAgICAgY2FzZSAncm9sbCc6XG4gICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYWN0aXZlQ29uZmlnc1tjb25maWdUeXBlXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltZ05hbWUgPSBjb25maWdUeXBlICsgJ18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uICsgJ18nO1xuICAgICAgICAgIGltZ05hbWUgKz0gY29uZmlnTmFtZS5zdWJzdHIoY29uZmlnTmFtZS5pbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdID0gaW1nTmFtZTtcbiAgICAgICAgICB0aGlzLnNob3codGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnbW90aW9uJzpcbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUodGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1nTmFtZSA9IGNvbmZpZ05hbWUuc3Vic3RyKDAsY29uZmlnTmFtZS5tYXRjaCgnMHwxJykuaW5kZXgtMSk7XG4gICAgICAgICAgdGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdID0gaW1nTmFtZTtcbiAgICAgICAgICB0aGlzLnNob3codGhpcy5hY3RpdmVDb25maWdzW2NvbmZpZ1R5cGVdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QWN0aXZlU2Vuc29yQ29uZmlndXJhdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnc1snc2Vuc29yQ29uZmlnJ10pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0Q29uZmlnSlNPTih0aGlzLmFjdGl2ZUNvbmZpZ3NbJ3NlbnNvckNvbmZpZyddKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRCb2R5T3BhY2l0eShvcGFjaXR5KSB7XG4gICAgICBpZiAodHlwZW9mKG9wYWNpdHkpPT09J3N0cmluZycpIHtcbiAgICAgICAgb3BhY2l0eSA9IHBhcnNlSW50KG9wYWNpdHkuc3Vic3RyKG9wYWNpdHkuaW5kZXhPZignXycpKzEpKSAvIDEwMDtcbiAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LmtleXMob3BhY2l0eSkubGVuZ3RoKSB7XG4gICAgICAgIG9wYWNpdHkgPSBvcGFjaXR5Lm51bWVyaWNWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3BhY2l0eSA9IG9wYWNpdHk7XG4gICAgICB0aGlzLnZpZXcoKS5fc2V0Qm9keU9wYWNpdHkob3BhY2l0eSk7XG4gICAgfVxuXG4gICAgaGlkZShjb25maWdJZCkge1xuICAgICAgdGhpcy52aWV3KCkuX2hpZGVDb25maWcoY29uZmlnSWQpO1xuICAgIH1cblxuICAgIHNob3coY29uZmlnSWQpIHtcbiAgICAgIHRoaXMudmlldygpLl9zaG93Q29uZmlnKGNvbmZpZ0lkKTtcbiAgICB9XG5cbiAgICBfaW1wb3J0QWxsSW1hZ2VzKCkge1xuICAgICAgLy8gQWRkIHRoZSBzZW5zb3IgY29uZmlndXJhdGlvbnNcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmRlZmF1bHRDb25maWdzKS5tYXAoY29uZmlndXJhdGlvbiA9PiB7XG5cbiAgICAgICAgdGhpcy52aWV3KCkuX2FkZExheWVyKHRoaXMuX21vZGVsLmRlZmF1bHRDb25maWdzW2NvbmZpZ3VyYXRpb25dLmlkLCB0aGlzLmltZ1BhdGgpO1xuICAgICAgfSlcblxuICAgICAgbGV0IGZpbGVOYW1lID0gbnVsbDtcblxuICAgICAgLy8gQWRkIHRoZSBsYWJlbCwgbWVjaGFuaXN0aWMgb3IgZnVuY3Rpb25hbFxuICAgICAgZmlsZU5hbWUgPSAnbGFiZWxzXycgKyB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb247XG4gICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIoZmlsZU5hbWUsIHRoaXMuaW1nUGF0aCk7XG5cbiAgICAgIC8vIEFkZCB0aGUgcmVhY3Rpb24gY29uZmlndXJhdGlvbnNcbiAgICAgIHZhciBzZW5zb3JDb25maWdzID0gWydiYWNrJywnZnJvbnQnLCdiYWNrbGVmdCcsJ2JhY2tyaWdodCcsJ2Zyb250bGVmdCcsJ2Zyb250cmlnaHQnLCdmcm9udGNlbnRlciddXG5cbiAgICAgIHRoaXMucGFyYW1PcHRpb25zWydyZWFjdGlvbiddLmZvckVhY2goc3RyZW5ndGggPT4ge1xuICAgICAgICBzZW5zb3JDb25maWdzLmZvckVhY2goc2Vuc29yQ29uZmlnID0+IHtcbiAgICAgICAgICBmaWxlTmFtZSA9ICdyZWFjdGlvbicgKyAnXycgKyB0aGlzLm1vZGVsUmVwcmVzZW50YXRpb24gKyAnXycgKyBzZW5zb3JDb25maWcgKyAnXycgKyBzdHJlbmd0aC5zdWJzdHIoc3RyZW5ndGguaW5kZXhPZignXycpKzEpO1xuICAgICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFkZCB0aGUgbW90b3IgLyBzcGVlZCBjb25maWd1cmF0aW9ucywgbWVjaGFuaXN0aWMgb3IgZnVuY3Rpb25hbFxuICAgICAgdGhpcy5wYXJhbU9wdGlvbnNbJ21vdG9yJ10uZm9yRWFjaChzdHJlbmd0aCA9PiB7XG4gICAgICAgIGZpbGVOYW1lID0gJ21vdG9yJyArICdfJyArIHRoaXMubW9kZWxSZXByZXNlbnRhdGlvbiArICdfJztcbiAgICAgICAgZmlsZU5hbWUgKz0gc3RyZW5ndGguc3Vic3RyKHN0cmVuZ3RoLmluZGV4T2YoJ18nKSsxKVxuXG4gICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcbiAgICAgIH0pXG5cblxuICAgICAgLy8gQWRkIHRoZSByb2xsIGNvbmZpZ3VyYXRpb25zLCBtZWNoYW5pc3RpYyBvciBmdW5jdGlvbmFsXG4gICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5wYXJhbU9wdGlvbnMpLmluZGV4T2YoJ3JvbGwnKT4tMSkge1xuICAgICAgICB0aGlzLnBhcmFtT3B0aW9uc1sncm9sbCddLmZvckVhY2goc3RyZW5ndGggPT4ge1xuICAgICAgICAgIGZpbGVOYW1lID0gJ3JvbGwnICsgJ18nICsgdGhpcy5tb2RlbFJlcHJlc2VudGF0aW9uICsgJ18nO1xuICAgICAgICAgIGZpbGVOYW1lICs9IHN0cmVuZ3RoLnN1YnN0cihzdHJlbmd0aC5pbmRleE9mKCdfJykrMSlcblxuICAgICAgICAgIHRoaXMudmlldygpLl9hZGRMYXllcihmaWxlTmFtZSwgdGhpcy5pbWdQYXRoKTtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LmtleXModGhpcy5wYXJhbU9wdGlvbnMpLmluZGV4T2YoJ21vdGlvbicpPi0xKSB7XG4gICAgICAgIHRoaXMucGFyYW1PcHRpb25zWydtb3Rpb24nXS5mb3JFYWNoKG1vdGlvblR5cGUgPT4ge1xuICAgICAgICAgIGZpbGVOYW1lID0gJ21vdGlvbicgKyAnXycgKyBtb3Rpb25UeXBlLnNwbGl0KCdfJylbMV07XG5cbiAgICAgICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIoZmlsZU5hbWUsIHRoaXMuaW1nUGF0aCk7XG4gICAgICAgIH0pXG5cbiAgICAgIH1cblxuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgIH1cblxuICAgIHNlbGVjdCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBkZXNlbGVjdCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG4gIH07XG5cbiAgQm9keUNvbmZpZ3VyYXRpb25zLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBCb2R5Q29uZmlndXJhdGlvbnMoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gQm9keUNvbmZpZ3VyYXRpb25zO1xufSk7XG4iXX0=
