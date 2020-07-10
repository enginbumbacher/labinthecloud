import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Module from 'core/app/module';
import ModelingBlocklyTab from './blocklytab/tab';
import ModelingMechTab from './mechtab/tab';
import SelectField from 'core/component/selectfield/field';
import SliderField from 'core/component/sliderfield/field';
import SymSelectField from 'core/component/symselectfield/field';
import SymSliderField from 'core/component/symsliderfield/field';
import ModelView from './threeview';
import $ from 'jquery';

class ModelingDataModule extends Module {
  constructor() {
    super();

    Utils.bindMethods(this, [
      '_onPhaseChange',
      '_onExperimentCountChange',
      '_hookModelFields',
      '_hookModifyExport',
      '_hookModifyImport',
      '_hook3dView',
      '_hookBlocklyConfigurations',
      '_hookModelStartCreate',
      '_hookExtractData'
    ])

    var tabs = Globals.get('AppConfig.model.tabs')
    var modelingType = 'blockly';
    var parameterForm = 'qualitative';
    if (tabs.length) {
      for (let tab of tabs) {
        if(tab.parameterForm) {
          parameterForm = tab.parameterForm;
        }
        if (tab.modelType.match('blockly')) {
          modelingType = 'blockly';
          break;
        } else if (tab.modelType.match('mech')) {
          modelingType = 'mech';
          break;
        }
      }

      if (Globals.get('AppConfig.modeling') && modelingType.match('blockly')) {
        this.tab = ModelingBlocklyTab.create();
        Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
        Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange)

      } else if (Globals.get('AppConfig.modeling') && modelingType.match('mech')) {
          this.tab = ModelingMechTab.create($.extend(Globals.get('AppConfig.modeling'), {parameterForm: parameterForm}));
  //        Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
  //        Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange)
      }
    }
    HM.hook('ModelSideTab.ModifySimulationData', this._hookExtractData)
    HM.hook('ModelForm.StartCreate', this._hookModelStartCreate);
    HM.hook('ModelForm.Fields', this._hookModelFields);
    HM.hook('ModelForm.ModifyExport', this._hookModifyExport);
    HM.hook('ModelForm.ModifyImport', this._hookModifyImport);
    HM.hook('Euglena.3dView', this._hook3dView);
    HM.hook('BlocklyConfig.Build', this._hookBlocklyConfigurations);

  }

  run() {
    if (this.tab) Globals.get(`${this.context.app}.Layout`).getPanel('result').addContent(this.tab.view())
  }

  _onPhaseChange(evt) {
    if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
      if(this.tab) this.tab.hide();
    }
  }

  _onExperimentCountChange(evt) {
    if (evt.data.count && !evt.data.old) {
      if (this.tab) this.tab.show();
    } else if (!evt.data.count && Globals.get('blocklyLoaded')) {
      if (this.tab) this.tab.hide();
    }
  }

  _hookModelStartCreate(form, meta) {
    if (form.modelType() == "blockly" && !["explore", "observe"].includes(meta.modality)) {
      ['v', 'k', 'omega', 'motion'].forEach((key) => {
        let field = form.getField(key);
        if (field && !meta.fieldConfig[key].changeable) {
          field.setValue(meta.fieldConfig[key].initialValue);
        }
      })
    }
  }

  _hookExtractData(fields, meta) {

    // if the active tab is 'blockly', then we have to compile and extract the blockly code.
    if (meta.modelType.match('blockly')) {
      let blocklyData = this.tab._extractData();
      fields = $.extend(fields,blocklyData);

    } else if (meta.modelType.match('mech')) {
      // DO SOMETHING HERE to modify conf.
      if (this.tab) {
        let mechData = this.tab._extractData();
        fields.configuration = $.extend(fields.configuration,mechData); // extend saveData.configuration
      }
    }
    return fields;
  }

  _hookModelFields(fields, meta) {

    this.parameterForm = meta.parameterForm ? meta.parameterForm : null;

    this.variationLimitation = null;
    if (meta.variationLimitation) {
      var variation = parseInt(meta.variationLimitation.split('_')[1])
      this.variationLimitation = Number.isInteger(variation) ? variation : null;
    }

    if (meta.type.match('blockly|mech')) {

      if (meta.config.sensorType) {
        fields = fields.concat([SelectField.create({
          id: "sensorType",
          inverse_order: true,
          standardizeFormat: true,
          color: meta.config.sensorType.color ? meta.config.sensorType.color : null,
          label: meta.config.sensorType.label,
          value: meta.config.sensorType.initialValue,
          min_width: meta.config.sensorType.min_width,
          description: meta.config.sensorType.description,
          region: meta.config.sensorType.region ? meta.config.sensorType.region : null,
          options: meta.config.sensorType.options
        })])
      }

      if (meta.config.sensorPosition) {
        fields = fields.concat([SelectField.create({
          id: "sensorPosition",
          inverse_order: true,
          standardizeFormat: true,
          color: meta.config.sensorPosition.color ? meta.config.sensorPosition.color : null,
          label: meta.config.sensorPosition.label,
          value: meta.config.sensorPosition.initialValue,
          min_width: meta.config.sensorPosition.min_width,
          description: meta.config.sensorPosition.description,
          region: meta.config.sensorPosition.region ? meta.config.sensorPosition.region : null,
          options: meta.config.sensorPosition.options
        })])
      }

      if(meta.config.sensorShape) {
        fields = fields.concat([SelectField.create({
          id: "sensorShape",
          inverse_order: true,
          standardizeFormat: true,
          color: meta.config.sensorShape.color ? meta.config.sensorShape.color : null,
          label: meta.config.sensorShape.label,
          value: meta.config.sensorShape.initialValue,
          min_width: meta.config.sensorShape.min_width,
          description: meta.config.sensorShape.description,
          region: meta.config.sensorShape.region ? meta.config.sensorShape.region : null,
          options: meta.config.sensorShape.options
        })])
      }

      // Add opacity
      if (meta.config.opacity) {
        if (!meta.variationLimitation) {
          fields = fields.concat([SymSelectField.create({
            id: 'opacity',
            inverse_order: true,
            varOptions: meta.config.opacity.varOptions,
            label: meta.config.opacity.label,
            color: meta.config.opacity.color ? meta.config.opacity.color : null,
            value: meta.config.opacity.initialValue,
            maxValue: meta.config.opacity.maxValue,
            description: meta.config.opacity.description,
            region: meta.config.opacity.region ? meta.config.opacity.region : null,
            options: meta.config.opacity.options
          })])
        } else if (meta.variationLimitation.match('fixVar')) {
          fields = fields.concat([SliderField.create({
            id: 'opacity',
            label: meta.config.opacity.label,
            color: meta.config.opacity.color ? meta.config.opacity.color : null,
            value: meta.config.opacity.initialValue,
            description: meta.config.opacity.description,
            region: meta.config.opacity.region ? meta.config.opacity.region : null,
            min: meta.config.opacity.min,
            max: meta.config.opacity.max,
            steps: meta.config.opacity.steps,
          })])
        }
      }

      if (meta.config.motion) {
        fields = fields.concat([SelectField.create({
          id: 'motion',
          inverse_order: true,
          standardizeFormat: true,
          label: meta.config.motion.label,
          color: meta.config.motion.color ? meta.config.motion.color : null,
          value: meta.config.motion.initialValue,
          description: meta.config.motion.description,
          min_width: meta.config.motion.min_width,
          region: meta.config.motion.region ? meta.config.motion.region : null,
          options: meta.config.motion.options
        })])
      }

      if (meta.config.roll) {
        if (this.parameterForm === 'qualitative') {
          fields = fields.concat([SymSelectField.create({
            id: 'roll',
            inverse_order: true,
            varOptions: meta.config.roll.varOptions,
            label: meta.config.roll.label,
            color: meta.config.roll.color ? meta.config.roll.color : null,
            value: meta.config.roll.initialValue,
            maxValue: meta.config.roll.maxValue,
            description: meta.config.roll.description,
            region: meta.config.roll.region ? meta.config.roll.region : null,
            options: meta.config.roll.options
          })])
        } else {
          if (!meta.variationLimitation) {
            fields = fields.concat([SymSliderField.create({
              id: 'roll',
              label: meta.config.roll.label,
              color: meta.config.roll.color ? meta.config.roll.color : null,
              value: meta.config.roll.initialValue,
              description: meta.config.roll.description,
              region: meta.config.roll.region ? meta.config.roll.region : null,
              min: meta.config.roll.min,
              max: meta.config.roll.max,
              steps: meta.config.roll.steps,
            })])
          } else if (meta.variationLimitation.match('fixVar')) {
            fields = fields.concat([SliderField.create({
              id: 'roll',
              label: meta.config.roll.label,
              color: meta.config.roll.color ? meta.config.roll.color : null,
              value: meta.config.roll.initialValue,
              description: meta.config.roll.description,
              region: meta.config.roll.region ? meta.config.roll.region : null,
              min: meta.config.roll.min,
              max: meta.config.roll.max,
              steps: meta.config.roll.steps,
            })])
          }
        }
      }

      if (meta.config.v) {
        if (this.parameterForm === 'qualitative') {
          fields = fields.concat([SymSelectField.create({
            id: 'v',
            inverse_order: true,
            varOptions: meta.config.v.varOptions,
            label: meta.config.v.label,
            color: meta.config.v.color ? meta.config.v.color : null,
            value: meta.config.v.initialValue,
            maxValue: meta.config.v.maxValue,
            description: meta.config.v.description,
            region: meta.config.v.region ? meta.config.v.region : null,
            options: meta.config.v.options
          })])
        } else {
          if (!meta.variationLimitation) {
            fields = fields.concat([SymSliderField.create({
              id: 'v',
              label: meta.config.v.label,
              color: meta.config.v.color ? meta.config.v.color : null,
              value: meta.config.v.initialValue,
              description: meta.config.v.description,
              region: meta.config.v.region ? meta.config.v.region : null,
              min: meta.config.v.min,
              max: meta.config.v.max,
              steps: meta.config.v.steps,
            })])
          } else if (meta.variationLimitation.match('fixVar')) {
            fields = fields.concat([SliderField.create({
              id: 'v',
              label: meta.config.v.label,
              color: meta.config.v.color ? meta.config.v.color : null,
              value: meta.config.v.initialValue,
              description: meta.config.v.description,
              region: meta.config.v.region ? meta.config.v.region : null,
              min: meta.config.v.min,
              max: meta.config.v.max,
              steps: meta.config.v.steps,
            })])
          }
        }
      }

      if (meta.config.reactionStrength) {
        fields = fields.concat([SymSelectField.create({
          id: 'reactionStrength',
          inverse_order: true,
          varOptions: meta.config.reactionStrength.varOptions,
          label: meta.config.reactionStrength.label,
          color: meta.config.reactionStrength.color ? meta.config.reactionStrength.color : null,
          value: meta.config.reactionStrength.initialValue,
          maxValue: meta.config.reactionStrength.maxValue,
          description: meta.config.reactionStrength.description,
          region: meta.config.reactionStrength.region ? meta.config.reactionStrength.region : null,
          options: meta.config.reactionStrength.options
        })])
      }

      if (meta.config.turnStrength) {
        fields = fields.concat([SymSelectField.create({
          id: 'turnStrength',
          inverse_order: true,
          varOptions: meta.config.turnStrength.varOptions,
          label: meta.config.turnStrength.label,
          color: meta.config.turnStrength.color ? meta.config.turnStrength.color : null,
          value: meta.config.turnStrength.initialValue,
          maxValue: meta.config.turnStrength.maxValue,
          description: meta.config.turnStrength.description,
          region: meta.config.turnStrength.region ? meta.config.turnStrength.region : null,
          options: meta.config.turnStrength.options
        })])
      }
    }
    return fields;
  }

  _hookModifyExport(exp, meta) {
    if (meta.type == "blockly" || meta.type == "mech") {
      if (this.parameterForm === 'qualitative') {
        ['k','v','roll','opacity'].forEach((key) => {
          if (Object.keys(exp).indexOf(key) >-1) {
            exp[`${key}_numeric`] = exp[key].numericValue;
            exp[`${key}_variation`] = exp[key].variation;
            exp[key] = exp[key].qualitativeValue;
          }
        })
      } else if (this.parameterForm === 'quantitative') {
        if (!Number.isInteger(this.variationLimitation)) {
          ['k','roll','v','opacity'].forEach((key) => {
            if (Object.keys(exp).indexOf(key) > -1) {
              exp[`${key}_numeric`] = exp[key].base;
              exp[`${key}_variation`] = exp[key].delta;
              exp[key] = exp[key];
            }
          })
        } else {
          ['k','roll','v','opacity'].forEach((key) => {
            if (Object.keys(exp).indexOf(key) > -1) {
              exp[`${key}_numeric`] = exp[key];
              exp[`${key}_variation`] = exp[key] * this.variationLimitation / 100;
              exp[key] = {'base': exp[key], 'delta': exp[key] * this.variationLimitation / 100};
            }
          })
        }
      } else {
        console.log('_hookModifyExport this.parameterForm not correctly defined')
      }

    }

    return exp
  }

  _hookModifyImport(data, meta) {
    if (meta.type == "blockly" || meta.type == "mech") {
      if (this.parameterForm === 'qualitative') {
        ['k', 'v', 'roll','opacity'].forEach((key) => {
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
      } else if (this.parameterForm === 'quantitative') {
        if (!Number.isInteger(this.variationLimitation)) {
          ['k', 'v', 'roll','opacity'].forEach((key) => {
            if (Object.keys(data).indexOf(key) > -1) {
              data[key] = {
                base: data[`${key}_numeric`],
                delta: data[`${key}_variation`]
              };
              delete data[`${key}_numeric`];
              delete data[`${key}_variation`];
            }
          })
        } else {
          ['k', 'v', 'roll','opacity'].forEach((key) => {
            if (Object.keys(data).indexOf(key) > -1) {
              data[key] = data[`${key}_numeric`]
              delete data[`${key}_numeric`];
              delete data[`${key}_variation`];
            }
          })
        }
      }
    }
    return data;
  }

  _hook3dView(view, meta) {
    if (meta.config.modelType.match("blockly|mech")) {
      // Extract the number of eyes
      var numSensors = 1;
      if (meta.config.configuration.sensorType.match('2sensors')) {
        numSensors = 2
      }

      if (numSensors == 2) {
        var baseConfig = {
          baseColor: meta.color,
          addEye: 'both'
        }
      } else {
        var baseConfig = {
          baseColor: meta.color,
          addEye: 'right'
        }
      }

      // Change eye color if eyespot
      if (meta.config.configuration.sensorType.match('eyespot')) {
        baseConfig.eyeColor = 0xF9001A;
      }

      return (new ModelView(baseConfig)).view()
    }
  }

  _hookBlocklyConfigurations(config, meta) {
    // Create body configuration model instance.
    let form = meta.form;
    var initialBody = form.export();
    var paramOptions = {
      reaction: Object.keys(this._formOptions.reaction),
      motor: Object.keys(this._formOptions.motor)
    }
    if (this._formOptions.roll) {
      paramOptions.roll = Object.keys(this._formOptions.roll);
    } else if (this._formOptions.motion) {
      paramOptions.motion = Object.keys(this._formOptions.motion);
    }
    return BodyConfigurations.create({initialConfig: initialBody, paramOptions: paramOptions, modelRepresentation: this._modelRep })
  }

  destroy() {
    Globals.get('Relay').removeEventListener('AppPhase.Change', this._onPhaseChange)
    Globals.get('Relay').removeEventListener('ExperimentCount.Change', this._onExperimentCountChange)

    HM.unhook('ModelSideTab.ModifySimulationData', this._hookExtractData)
    HM.unhook('ModelForm.StartCreate', this._hookModelStartCreate);
    HM.unhook('ModelForm.Fields', this._hookModelFields);
    HM.unhook('ModelForm.ModifyExport', this._hookModifyExport);
    HM.unhook('ModelForm.ModifyImport', this._hookModifyImport);
    HM.unhook('Euglena.3dView', this._hook3dView)
    HM.unhook('BlocklyConfig.Build', this._hookBlocklyConfigurations);

    if (this.tab) {
      return Promise.all([this.tab.destroy(), super.destroy()])
    }
    return super.destroy();
  }
}

export default ModelingDataModule;
