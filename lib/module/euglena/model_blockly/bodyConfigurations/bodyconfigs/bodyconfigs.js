define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

  class BodyConfigurations extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_importAllImages','setBodyOpacity', 'setActiveConfiguration', 'hide', 'show'])

      this.activeConfigs = {'sensorConfig': null, 'reaction': null, 'forward': null, 'roll': null};
      this.opacity = null;

      this._model.setConfigs() ;
      this.modelModality = settings.modelData.modelModality;
      this.allowedConfigs = settings.modelData.allowedConfigs;
      this.paramOptions = settings.modelData.paramOptions;

      // MOVE THE FOLLOWING PARTS TO VIEW()

      this.imgPath = 'cslib/module/euglena/model_blockly/bodyConfigurations/imgs/';
      this._importAllImages();

      this.setActiveConfiguration(settings.modelData.initialConfig.bodyConfigurationName);
      this.setActiveConfiguration(settings.modelData.initialConfig.v);
      this.setActiveConfiguration(settings.modelData.initialConfig.omega);
      this.setActiveConfiguration(settings.modelData.initialConfig.k);
      this.setBodyOpacity(settings.modelData.initialConfig.opacity);

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
            imgName += configName.substr(configName.indexOf('_')+1);
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
          imgName += configName.substr(configName.indexOf('_')+1);
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
      } else {
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

      // Add the forward speed configurations, mechanistic or functional
      this.paramOptions['forward'].forEach(strength => {
        fileName = 'forward' + '_' + this.modelModality + '_';
        fileName += strength.substr(strength.indexOf('_')+1)

        this.view()._addLayer(fileName, this.imgPath);
      })


      // Add the reaction configurations
      var sensorConfigs = ['back','front','backleft','backright','frontleft','frontright','frontcenter']

      this.paramOptions['reaction'].forEach(strength => {
        sensorConfigs.forEach(sensorConfig => {
          fileName = 'reaction' + '_' + this.modelModality + '_' + sensorConfig + '_' + strength.substr(strength.indexOf('_')+1);
          this.view()._addLayer(fileName, this.imgPath);
        })
      })

      // Add the roll configurations, mechanistic or functional
      this.paramOptions['roll'].forEach(strength => {
        fileName = 'roll' + '_' + this.modelModality + '_';
        fileName += strength.substr(strength.indexOf('_')+1)

        this.view()._addLayer(fileName, this.imgPath);
      })
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
