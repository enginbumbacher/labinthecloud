import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Module from 'core/app/module';
import ModelingDataTab from './blocklytab/tab';
import SelectField from 'core/component/selectfield/field';
import SymSelectField from 'core/component/symselectfield/field';
import ModelView from './threeview';
import defaultConfigs from './bodyConfigurations/bodyconfigs/listofconfigs';
import HiddenField from "core/component/hiddenfield/field";

class ModelingDataModule extends Module {
  constructor() {
    super();
    // if (Globals.get('AppConfig.modeling')) {
    Utils.bindMethods(this, ['_onPhaseChange', '_onExperimentCountChange', '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView'])

    if (Globals.get('AppConfig.model.tabs').length && Globals.get('AppConfig.model.tabs').map(t => t.modelType).includes('blockly')) {
      this.tab = new ModelingDataTab();
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
      Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange)
    }

    HM.hook('ModelForm.Fields', this._hookModelFields);
    HM.hook('ModelForm.ModifyExport', this._hookModifyExport);
    HM.hook('ModelForm.ModifyImport', this._hookModifyImport);
    HM.hook('Euglena.3dView', this._hook3dView)

    // }
  }

  run() {
    if (this.tab) Globals.get('Layout').getPanel('result').addContent(this.tab.view())
  }

  _onPhaseChange(evt) {
    if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
      this.tab.hide();
    }
  }

  _onExperimentCountChange(evt) {
    if (evt.data.count && !evt.data.old) {
      this.tab.show();
    } else if (!evt.data.count && Globals.get('blocklyLoaded')) {
      this.tab.hide();
    }
  }

  _hookModelFields(fields, meta) {
    if (meta.type == "blockly") {
      var bodyConfigs = Object.keys(defaultConfigs);
      // Filter out the options that are not in allowedConfigs
      if (meta.config.allowedConfigs.length) {
        bodyConfigs = bodyConfigs.filter((elem) => meta.config.allowedConfigs.includes(defaultConfigs[elem].id.toLowerCase()));
      }
      let bodyConfigOptions = {}
      bodyConfigs.forEach((bcon) => {
        bodyConfigOptions[bcon] = defaultConfigs[bcon].id;
      })
      fields.push(SelectField.create({
        id: "bodyConfigurationName",
        inverse_order: true,
        color: meta.config.bodyConfiguration.color || '#C00000',
        label: meta.config.bodyConfiguration.label || 'Light Sensor',
        value: meta.config.bodyConfiguration.initialValue,
        min_width: meta.config.bodyConfiguration.min_width || '210px',
        description: meta.config.bodyConfiguration.description || 'Select different configurations for the light sensor. You can change position, number and type of sensors.',
        classes: [],
        options: bodyConfigOptions
      }));

      if (meta.config.v.visible) {
        fields.push(SymSelectField.create({
          id: 'v',
          disabled: !meta.config.v.changeable,
          inverse_order: true,
          varOptions: meta.config.v.variation ? (meta.config.v.varOptions || {'variation_0': 'no', 'variation_10': 'small', 'variation_25': 'medium', 'variation_50': 'large'}) : null,
          label: meta.config.v.label || (meta.config.modelRepresentation == "functional" ? "Motor Speed": "Motor Strength"),
          color: meta.config.v.color || '#7030A0',
          value: meta.config.v.initialValue,
          maxValue: Utils.exists(meta.config.v.maxValue) ? meta.config.v.maxValue : 10,
          description: meta.config.v.description || 'Set the speed at which the model moves forward, if it is programmed to move. The percentage refers to the maximum possible intensity for any model. See how the red arrow changes when you change the value.',
          classes: [],
          options: meta.config.v.options || (
            meta.config.modelRepresentation == "functional" ? 
              {'roll_25': 'slow', 'roll_50': 'medium', 'roll_75': 'fast', 'roll_100': 'very fast'} : 
              {'roll_25': 'weak', 'roll_50': 'medium', 'roll_75': 'strong', 'roll_100': 'very strong'}
          )
        }));
      } else {
        fields.push(HiddenField.create({
          id: 'v',
          value: meta.config.v.initialValue
        }));
      }
      if (meta.config.K.visible) {
        fields.push(SymSelectField.create({
          id: 'k',
          disabled: !meta.config.K.changeable,
          inverse_order: true,
          varOptions: meta.config.K.varOptions || {'variation_0': 'no', 'variation_10': 'small', 'variation_25': 'medium', 'variation_50': 'large'},
          label: meta.config.K.label || (meta.config.modelRepresentation == "functional" ? "Reaction Speed" : "Reaction Strength"),
          color: meta.config.K.color || '#2F5597',
          value: meta.config.K.initialValue,
          maxValue: Utils.exists(meta.config.K.maxValue) ? meta.config.K.maxValue : 2,
          description: meta.config.K.description || 'Set the intensity at which the model is responding to light, if it is programmed to respond. The percentage refers to the maximum possible intensity for any model. See how the blue arrows change when you change the value.',
          classes: [],
          options: meta.config.K.options || (
            meta.config.modelRepresentation == "functional" ?
              {'reaction_25': 'slow', 'reaction_50': 'medium', 'reaction_75': 'fast', 'reaction_100': 'very fast'} :
              {'reaction_25': 'weak', 'reaction_50': 'medium', 'reaction_75': 'strong', 'reaction_100': 'very strong'}
          )
        }));
      } else {
        fields.push(HiddenField.create({
          id: 'k',
          value: meta.config.k.initialValue
        }))
      }

      // Add either roll or motion type option
      if (meta.config.omega) {
        let omegaField = null;
        if (meta.config.omega.visible) {
          omegaField = SymSelectField.create({
            id: 'omega',
            disabled: !meta.config.omega.changeable,
            inverse_order: true,
            varOptions: meta.config.omega.varOptions || {'variation_0': 'no', 'variation_10': 'small', 'variation_25': 'medium', 'variation_50': 'large'},
            label: meta.config.omega.label || (meta.config.modelRepresentation == "functional" ? "Roll Speed" : "Roll Strength"),
            color: meta.config.omega.color ? meta.config.omega.color : '#C55A11',
            value: meta.config.omega.initialValue,
            maxValue: Utils.exists(meta.config.omega.maxValue) ? meta.config.omega.maxValue : 6,
            description: meta.config.omega.description || 'Set the speed at which the model rotates around its long body axis normally, if it is programmed to rotate. The percentage refers to the maximum possible intensity for any model. See how the orange arrow changes when you change the value.',
            classes: [],
            options: meta.config.omega.options || (
              meta.config.modelRepresentation == "functional" ?
                {'roll_25': 'slow', 'roll_50': 'medium', 'roll_75': 'fast', 'roll_100': 'very fast'} :
                {'roll_25': 'weak', 'roll_50': 'medium', 'roll_75': 'strong', 'roll_100': 'very strong'}
            )
          })
        } else {
          omegaField = HiddenField.create({
            id: 'omega',
            value: meta.config.omega.initialValue
          })
        }
        fields.splice(3,0,omegaField);
      } else if (meta.config.motion) {
        let motionField = null;
        if (meta.config.motion.visible) {
          motionField = SymSelectField.create({
            id: 'motion',
            disabled: !meta.config.motion.changeable,
            inverse_order: true,
            label: meta.config.motion.label || "Forward Motion",
            color: meta.config.motion.color ? meta.config.motion.color : '#C55A11',
            value: meta.config.motion.initialValue,
            maxValue: Utils.exists(meta.config.motion.maxValue) ? meta.config.motion.maxValue : 0.7,
            description: meta.config.motion.description,
            classes: [],
            options: {'motion_flap_0': 'flapping', 'motion_twist_100': 'twisting'}
          })
        } else {
          motionField = HiddenField.create({
            id: 'motion',
            value: meta.config.motion.initialValue
          })
        }

        fields.splice(3,0,motionField)
      }

      // Add opacity
      if (meta.config.opacity) {
        let opacityField = null;
        if (meta.config.opacity.visible) {
          opacityField = SymSelectField.create({
            id: 'opacity',
            disabled: !meta.config.opacity.changeable,
            inverse_order: true,
            varOptions: meta.config.opacity.varOptions,
            label: meta.config.opacity.label || 'Body Opacity',
            color: meta.config.opacity.color || '#759364',
            value: meta.config.opacity.initialValue || 'opacity_20',
            maxValue: Utils.exists(meta.config.opacity.maxValue) ? meta.config.opacity.maxValue : 1,
            description: meta.config.opacity.description,
            classes: [],
            options: meta.config.opacity.options || {'opacity_0': '0 percent', 'opacity_20': '20 percent', 'opacity_40': '40 percent', 'opacity_60': '60 percent', 'opacity_80': '80 percent', 'opacity_100': '100 percent'}
          })
        } else {
          opacityField = HiddenField.create({
            id: 'opacity',
            value: meta.config.opacity.initialValue
          })
        }
        fields.splice(1,0,opacityField)
      }
    }
    return fields;
  }

  _hookModifyExport(exp, meta) {

    if (meta.type == "blockly") {
      ['k', 'v', 'omega','opacity','motion'].forEach((key) => {
        if (Object.keys(exp).indexOf(key) >-1) {
          exp[`${key}_numeric`] = exp[key].numericValue;
          exp[`${key}_variation`] = exp[key].variation;
          exp[key] = exp[key].qualitativeValue;
        }
      })
    }

    return exp
  }

  _hookModifyImport(data, meta) {
    if (meta.type == "blockly") {
      ['k', 'v', 'omega','opacity','motion'].forEach((key) => {
        if (Object.keys(data).indexOf(key) > -1) {
          data[key] = {
            qualitativeValue: data[key],
            numericValue: data[`${key}_numeric`],
            variation: data[`${key}_variation`]
          };
          delete data[`${key}_numeric`];
          delete data[`${key}_variation`];
        }
      }) // MAKE SURE THE INITIAL ONE IS WORKING TOO
    }
    return data;
  }

  _hook3dView(view, meta) {
    if (meta.config.modelType == "blockly") {
      // Here, extract the number of eyes
      if (Object.keys(defaultConfigs).indexOf(meta.config.configuration.bodyConfigurationName)==-1) {
        console.log('this is not good')
      } else {
        var numSensors = 0;
        var sensorName = null;
        var sensorConfig = defaultConfigs[meta.config.configuration.bodyConfigurationName].config;
        Object.keys(sensorConfig).forEach(key => {
            if (key.toLowerCase().match('sensor')) {
              numSensors += 1;
              sensorName = key;
            }
          })

        if (numSensors == 2) {
          var baseConfig = {
            baseColor: meta.color,
            addEye: 'both'
          }
        } else {
          if (sensorConfig[sensorName].sensorOrientation == 0) {
            var baseConfig = {
              baseColor: meta.color,
              addEye: 'right'
            }
          } else {
            var baseConfig = {
              baseColor: meta.color,
              addEye: 'left'
            }
          }
        }

      }

      return (new ModelView(baseConfig)).view()
    }
    return view;
  }
}

export default ModelingDataModule;
