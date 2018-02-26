define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Globals = require('core/model/globals'),
    Utils = require('core/util/utils')
  ;

  class BodyConfigurations extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_importAllImages','setBodyOpacity', 'setActiveConfiguration', 'hide', 'show'])

      this._model.setConfigs() ;
      this.modelRepresentation = settings.modelData.modelRepresentation;
      this.allowedConfigs = settings.modelData.allowedConfigs;
      this.paramOptions = settings.modelData.paramOptions;

      if (this.modelRepresentation === 'functional') {
        this.activeConfigs = {'sensorConfig': null, 'reaction': null, 'motor': null, 'roll': null};
      } else if (this.modelRepresentation === 'mechanistic') {
        this.activeConfigs = {'sensorConfig': null, 'reaction': null, 'motor': null, 'motion': null};
      }
      this.opacity = settings.modelData.initialConfig.opacity? settings.modelData.initialConfig.opacity : 0;

      // MOVE THE FOLLOWING PARTS TO VIEW()

      this.imgPath = 'cslib/module/euglena/model_blockly/bodyConfigurations/imgs/';
      this._importAllImages();

      this.setActiveConfiguration(settings.modelData.initialConfig.bodyConfigurationName);
      this.setActiveConfiguration(settings.modelData.initialConfig.v);
      if (this.modelRepresentation === 'functional') {
        this.setActiveConfiguration(settings.modelData.initialConfig.omega);
      } else if (this.modelRepresentation === 'mechanistic') {
        this.setActiveConfiguration(settings.modelData.initialConfig.motion);
      }
      this.setActiveConfiguration(settings.modelData.initialConfig.k);
      this.setBodyOpacity(this.opacity);

    }

    setActiveConfiguration(configName) {

      var configType = null;
      if (configName.qualitativeValue) {
        configType = configName.qualitativeValue
      } else {
        configType = configName;
      }
      Object.keys(this.activeConfigs).some(function(config) {
        if(configType.match(config)) {
          configType = config;
          return true;
        }
      })

      let imgName = null;
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
            Globals.get('Relay').dispatchEvent('Body.Change', {numSensors: currNumSensors})
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
            imgName += configName.substr(configName.indexOf('_')+1);
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
          imgName += configName.substr(configName.indexOf('_')+1);
          this.activeConfigs[configType] = imgName;
          this.show(this.activeConfigs[configType]);
        break;

        case 'motion':
          if (this.activeConfigs[configType]) {
            this.hide(this.activeConfigs[configType]);
          }
          imgName = configName.substr(0,configName.match('0|1').index-1);
          this.activeConfigs[configType] = imgName;
          this.show(this.activeConfigs[configType]);
        break;
      }
    }

    getActiveSensorConfiguration() {
        if (this.activeConfigs['sensorConfig']) {
          return this._model.getConfigJSON(this.activeConfigs['sensorConfig'])
        } else {
          return null
        }
    }

    setBodyOpacity(opacity) {
      if (typeof(opacity)==='string') {
        opacity = parseInt(opacity.substr(opacity.indexOf('_')+1)) / 100;
      } else if (Object.keys(opacity).length) {
        opacity = opacity.numericValue;
      }
      this.opacity = opacity;
      this.view()._setBodyOpacity(opacity);
    }

    hide(configId) {
      this.view()._hideConfig(configId);
    }

    show(configId) {
      this.view()._showConfig(configId);
    }

    _importAllImages() {
      // Add the sensor configurations
      Object.keys(this._model.defaultConfigs).map(configuration => {

        this.view()._addLayer(this._model.defaultConfigs[configuration].id, this.imgPath);
      })

      let fileName = null;

      // Add the label, mechanistic or functional
      fileName = 'labels_' + this.modelRepresentation;
      this.view()._addLayer(fileName, this.imgPath);

      // Add the reaction configurations
      var sensorConfigs = ['back','front','backleft','backright','frontleft','frontright','frontcenter']

      this.paramOptions['reaction'].forEach(strength => {
        sensorConfigs.forEach(sensorConfig => {
          fileName = 'reaction' + '_' + this.modelRepresentation + '_' + sensorConfig + '_' + strength.substr(strength.indexOf('_')+1);
          this.view()._addLayer(fileName, this.imgPath);
        })
      })

      // Add the motor / speed configurations, mechanistic or functional
      this.paramOptions['motor'].forEach(strength => {
        fileName = 'motor' + '_' + this.modelRepresentation + '_';
        fileName += strength.substr(strength.indexOf('_')+1)

        this.view()._addLayer(fileName, this.imgPath);
      })


      // Add the roll configurations, mechanistic or functional
      if (Object.keys(this.paramOptions).indexOf('roll')>-1) {
        this.paramOptions['roll'].forEach(strength => {
          fileName = 'roll' + '_' + this.modelRepresentation + '_';
          fileName += strength.substr(strength.indexOf('_')+1)

          this.view()._addLayer(fileName, this.imgPath);
        })
      } else if (Object.keys(this.paramOptions).indexOf('motion')>-1) {
        this.paramOptions['motion'].forEach(motionType => {
          fileName = 'motion' + '_' + motionType.split('_')[1];

          this.view()._addLayer(fileName, this.imgPath);
        })

      }

    }

    id() {
      return this._model.get('id')
    }

    select() {
      this._model.set('selected', true);
    }

    deselect() {
      this._model.set('selected', false);
    }

    export() {
      return this._model.get('id');
    }
  };

  BodyConfigurations.create = (data) => {
    return new BodyConfigurations({ modelData: data });
  }

  return BodyConfigurations;
});
