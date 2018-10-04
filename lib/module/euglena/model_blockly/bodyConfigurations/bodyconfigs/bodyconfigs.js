import Component from 'core/component/component';
import Model from './model';
import View from './view';
import Globals from 'core/model/globals';
import Utils from 'core/util/utils';

// ADD DEFAULT VALUES FOR EVERY PARAMETER THAT IS NECESSARY FOR VISUALIZATION
const defaults = {
  values: {
    type: 'type_1side',
    shape: 'shape_50',
    position: 'position_0',
    reaction: 'reaction_50',
    motor: 'motor_50',
    roll: 'roll_25',
    motion: 'motion_spiral'
  },
  options: {
    type: ['type_1side', 'type_1middle', 'type_2sensors'],
    shape: ['shape_50', 'shape_100'],
    position: ['position_0', 'position_100'],
    reaction: ['reaction_25', 'reaction_50', 'reaction_75'],
    motor: ['motor_25', 'motor_50', 'motor_75'],
    roll: ['roll_0', 'roll_25', 'roll_50', 'roll_75'],
    motion: ['motion_wave', 'motion_spiral']
  }
};

/*
filename structure:
sensor configurations: type_[1side|1middle|2sensors|eyespot] + _ + shape_[%] + _ + position_[%]
reaction: [function|mechanistic] + _reaction_ + type_[...] + position_[%] + strength_[%]
motor: [functional|mechanistic] + _motor_ + strength_[%]
roll: [functional|mechanistic] + _roll_ + strength_[%]
motion: motion_ + [wave|spiral]
*/


class BodyConfigurations extends Component {
  constructor(settings = {}) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
    Utils.bindMethods(this, ['_importAllImages','_getDivId','setBodyOpacity', 'setActiveConfiguration', 'hide', 'show'])

    this.modelForm = settings.modelData.modelForm;
    this.parameterForm = settings.modelData.parameterForm;
    this.paramOptions = settings.modelData.paramOptions;

    this.activeConfigs = {'type': defaults['values']['type'], 'shape': defaults['values']['shape'], 'position': defaults['values']['position'], 'reaction': defaults['values']['reaction'], 'motor': defaults['values']['motor'], 'roll': defaults['values']['roll'], 'motion': defaults['values']['motion']};
    this.opacity = settings.modelData.initialConfig.opacity ? settings.modelData.initialConfig.opacity : 0.2;

    // MOVE THE FOLLOWING PARTS TO VIEW()
    this.imgPath = '/cslib/module/euglena/model_blockly/bodyConfigurations/imgs/';
    this._importAllImages();

    this.initializeActiveConfiguration(settings.modelData.initialConfig);
    this.setBodyOpacity(this.opacity);

  }

  initializeActiveConfiguration(initialConfig) {
    this.initializeMapping = {'type': 'sensorType', 'shape': 'sensorShape', 'position': 'sensorPosition', 'reaction': 'k', 'motion': 'motion', 'motor': 'v', 'roll': 'omega' }

    Object.keys(this.initializeMapping).forEach(params => {
      if (Object.keys(initialConfig).indexOf(this.initializeMapping[params]) >-1) {
        this.setActiveConfiguration(initialConfig[this.initializeMapping[params]], this.initializeMapping[params])
      }
    })
  }

  setActiveConfiguration(configName, varName) {

    var configType = null;
    if (configName) {
      if (configName.qualitativeValue) {
        configType = configName.qualitativeValue
      } else if (configName.base!=null) {
        for (let mapping of Object.keys(this.initializeMapping)) {
          if(this.initializeMapping[mapping]===varName) {
            configType = mapping;
            break;
          }
        }
        configName = configName.base
      }
      else {
        configType = configName;
      }
    }

    if (configType) {
      Object.keys(this.activeConfigs).some(function(config) {
        if((''+configType).match(config)) {
          configType = config;
          return true;
        }
      })
    }

    let imgName = null;
    switch (configType) {
      case 'type':
        var prevNumSensors = this.activeConfigs[configType].match('2sensors')? 2 : 1;
        this.hide(this._getDivId(configType));
        if (this.activeConfigs['reaction']) {
          this.hide(this._getDivId('reaction'));
        }
        // If the number of sensors changes, activate and de-activate corresponding blocks in the toolkit and the worspace.
        var currNumSensors = configName.match('2sensors')? 2 : 1
        if (currNumSensors != prevNumSensors) {
          Globals.get('Relay').dispatchEvent('Body.Change', {numSensors: currNumSensors})
        }

        this.activeConfigs[configType] = configName;
        this.show(this._getDivId(configType));
        if (this.activeConfigs['reaction']) {
          this.show(this._getDivId('reaction'));
        }
      break;
      case 'position':
        this.hide(this._getDivId(configType));
        if (this.activeConfigs['reaction']) {
          this.hide(this._getDivId('reaction'));
        }

        this.activeConfigs[configType] = configName;
        this.show(this._getDivId(configType));
        if (this.activeConfigs['reaction']) {
          this.show(this._getDivId('reaction'));
        }
      break;
      case 'roll':
      case 'shape':
      case 'reaction':
      case 'motion':
        this.hide(this._getDivId(configType));
        this.activeConfigs[configType] = configName;
        this.show(this._getDivId(configType));
      case 'motor':
        if (this.parameterForm === 'qualitative') {
          this.hide(this._getDivId(configType));
          this.activeConfigs[configType] = configName;
          this.show(this._getDivId(configType));
        } else if (this.parameterForm === 'quantitative') {
          this.hide(this._getDivId(configType));
          this.show(this._getDivId(configType));
        }
      }
  }

  getActiveSensorConfiguration() {
    /*
    sensorPosition:
    - z in [-1, 1]; if position is 0%, z is 1, and if it is 100%, z is -1.
    - y in [-1,1]; if type is 1side, y is -1, if type is 1middle or eyespot, y is 0, and if type is 2sensors, y is -1 for one and 1 for the together

    sensorOrientation: either 0 or Math.PI;
    if type is 1side, sensorField not 2*Math.PI, then sensorOrientation is Math.PI;
    if type is 2sensors, then sensorOrientation is Math.PI for the sensor with y = -1, and 0 for the together
    if sensorField is 2*Math.PI, sensorOrientation is 0

    sensorField: between 0 and 2*Math.PI
    sensorField is shape (in %) * 2*Math.PI

    */
    var JSONConfig = {
      sensor_1: {
        sensorPosition: {z: null, y: null},
        sensorOrientation: null,
        sensorField: null
      },
      spotPositions: [],
      motorConnection: true
    }

    JSONConfig['sensor_1']['sensorPosition'].z = 1 - 2 * parseInt(this.activeConfigs['position'].substr(this.activeConfigs['position'].indexOf('_')+1)) / 100;
    JSONConfig['sensor_1']['sensorPosition'].y = -1;
    JSONConfig['sensor_1']['sensorField'] = parseInt(this.activeConfigs['shape'].substr(this.activeConfigs['shape'].indexOf('_')+1)) / 100 * 2 * Math.PI

    if (this.activeConfigs['shape'].match('100')) {
      JSONConfig['sensor_1']['sensorOrientation'] = 0;
    } else {
      JSONConfig['sensor_1']['sensorOrientation'] = Math.PI;
    }

    if (this.activeConfigs['type'].match('2sensors')) {
      JSONConfig['sensor_2'] = {
        sensorPosition: {z: null, y: null},
        sensorOrientation: null,
        sensorField: null
      }
      JSONConfig['sensor_2']['sensorPosition'].z = 1 - 2 * parseInt(this.activeConfigs['position'].substr(this.activeConfigs['position'].indexOf('_')+1)) / 100;
      JSONConfig['sensor_2']['sensorPosition'].y = 1;
      if (this.activeConfigs['shape'].match('100')) {
        JSONConfig['sensor_2']['sensorOrientation'] = 0;
      } else {
        JSONConfig['sensor_2']['sensorOrientation'] = 0;
      }
      JSONConfig['sensor_2']['sensorField'] = parseInt(this.activeConfigs['shape'].substr(this.activeConfigs['shape'].indexOf('_')+1)) / 100 * 2 * Math.PI;
    } else if (this.activeConfigs['type'].match('eyespot')) {
      JSONConfig['spotPositions'] = [{z:1, y:-1}];
    }

    JSONConfig.id = this.activeConfigs['type'] + '_' + this.activeConfigs['shape'] + '_' + this.activeConfigs['position'];

    return JSONConfig

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

  hide(configId) { //configId is the ID given to the corresponding div, as assigned in _importAllImages; it is created based on the filename
    this.view()._hideConfig(configId);
  }

  show(configId) {
    this.view()._showConfig(configId);
  }

  _importAllImages() {
    // CHANGE Add the sensor configurations
    var sensorOptions = {'type': [defaults['values']['type']], 'shape': [defaults['values']['shape']], 'position': [defaults['values']['position']]}
    // Extract sensor type
    if (this.paramOptions.type) {
      sensorOptions['type'] = this.paramOptions['type']
    }
    // Extract sensor shape
    if (this.paramOptions.shape) {
      sensorOptions['shape'] = this.paramOptions['shape']
    }
    // Extract sensor position
    if (this.paramOptions.position) {
      sensorOptions['position'] = this.paramOptions['position']
    }

    var existingConfigNamesForParams = [];
    sensorOptions['type'].forEach(sensorType => {
      sensorOptions['position'].forEach(sensorPosition => {
        existingConfigNamesForParams.push(sensorType + '_' + sensorPosition);
        sensorOptions['shape'].forEach(sensorShape => {
          this.view()._addLayer(sensorType + '_' + sensorShape + '_' + sensorPosition, this.imgPath)
        })
      })
    })

    let fileName = null;

    // Add the label, mechanistic or functional
    fileName = 'labels_' + this.modelForm;
    this.view()._addLayer(fileName, this.imgPath);

    // Add the body background
    this.view()._addLayer('bodybckgrnd', this.imgPath);

    // Add the reaction configurations
    if (Object.keys(this.paramOptions).indexOf('reaction')>-1) {
      this.paramOptions['reaction'].forEach(strength => {
        existingConfigNamesForParams.forEach(sensorConfig => {
          fileName = this.modelForm + '_' + 'reaction' + '_' + sensorConfig + '_' + 'strength' + '_' + strength.substr(strength.indexOf('_')+1);
          this.view()._addLayer(fileName, this.imgPath);
        })
      })
    } else {
      defaults['options']['reaction'].forEach(strength => {
        existingConfigNamesForParams.forEach(sensorConfig => {
          fileName = this.modelForm + '_' + 'reaction' + '_' + sensorConfig + '_' + 'strength' + '_' + strength.substr(strength.indexOf('_')+1);
          this.view()._addLayer(fileName, this.imgPath);
        })
      })
    }

    // Add the motor / speed configurations, mechanistic or functional
    if(Object.keys(this.paramOptions).indexOf('motor')>-1) {
      this.paramOptions['motor'].forEach(strength => {
        fileName = this.modelForm + '_' + 'motor' + '_' + 'strength' + '_' + strength.substr(strength.indexOf('_')+1);
        this.view()._addLayer(fileName, this.imgPath);
      })
    } else {
      defaults['options']['motor'].forEach(strength => {
        fileName = this.modelForm + '_' + 'motor' + '_' + 'strength' + '_' + strength.substr(strength.indexOf('_')+1);
        this.view()._addLayer(fileName, this.imgPath);
      })
    }


    // Add the roll configurations, mechanistic or functional
    if (Object.keys(this.paramOptions).indexOf('roll')>-1) {
      this.paramOptions['roll'].forEach(strength => {
        fileName = this.modelForm + '_' + 'roll' + '_' + 'strength' + '_' + strength.substr(strength.indexOf('_')+1);
        this.view()._addLayer(fileName, this.imgPath);
      })
    } else if (Object.keys(this.paramOptions).indexOf('motion')>-1) {
      this.paramOptions['motion'].forEach(motionType => {
        fileName = 'motion' + '_' + motionType.substr(motionType.indexOf('_')+1);
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

  _getDivId(variableName) { //variableName is either 'type','shape','position','reaction','motor','roll','motion'
    /*
    filename structure:
    sensor configurations: type_[1side|1middle|2sensors|eyespot] + _ + shape_[%] + _ + position_[%]
    reaction: [function|mechanistic] + _reaction_ + type_[...] + position_[%] + strength_[%]
    motor: [functional|mechanistic] + _motor_ + strength_[%]
    roll: [functional|mechanistic] + _roll_ + strength_[%]
    motion: motion_ + [wave|spiral]
    */
    if (variableName.match('type|shape|position')) {
      return this.activeConfigs['type'] + '_' + this.activeConfigs['shape'] + '_' + this.activeConfigs['position']
    } else if (variableName.match('reaction')) {
      return this.modelForm + '_reaction_' + this.activeConfigs['type'] + '_' + this.activeConfigs['position'] + '_strength_' + this.activeConfigs['reaction'].substr(this.activeConfigs['reaction'].indexOf('_')+1)
    } else if (variableName.match('motion')) {
      return 'motion_' + this.activeConfigs['motion'].substr(this.activeConfigs['motion'].indexOf('_')+1)
    } else if (variableName.match('motor|roll')) {
      return this.modelForm + '_' + variableName + '_strength_' + this.activeConfigs[variableName].substr(this.activeConfigs[variableName].indexOf('_')+1)
    }
  }

};

BodyConfigurations.create = (data) => {
  return new BodyConfigurations({ modelData: data });
}

export default BodyConfigurations;
