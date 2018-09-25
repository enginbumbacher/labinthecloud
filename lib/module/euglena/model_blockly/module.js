import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Module from 'core/app/module';
import ModelingBlocklyTab from './blocklytab/tab';
import ModelingMechTab from './mechtab/tab';
import SelectField from 'core/component/selectfield/field';
import SymSelectField from 'core/component/symselectfield/field';
import ModelView from './threeview';

class ModelingDataModule extends Module {
  constructor() {
    super();
    if (Globals.get('AppConfig.modelingBlockly')) {
        Utils.bindMethods(this, ['_onPhaseChange', '_onExperimentCountChange',
      '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView'])

      if (Globals.get('AppConfig.model.tabs').length) {
        this.tab = new ModelingBlocklyTab();
        Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
        Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange)
      }

      HM.hook('ModelForm.Fields', this._hookModelFields);
      HM.hook('ModelForm.ModifyExport', this._hookModifyExport);
      HM.hook('ModelForm.ModifyImport', this._hookModifyImport);
      HM.hook('Euglena.3dView', this._hook3dView)

    } else if (Globals.get('AppConfig.modelingMech')) {
        Utils.bindMethods(this, ['_onPhaseChange', '_onExperimentCountChange',
      '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView'])

      if (Globals.get('AppConfig.model.tabs').length) {
        this.tab = new ModelingMechTab();
        Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
        Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange)

      }

      HM.hook('ModelForm.Fields', this._hookModelFields);
      HM.hook('ModelForm.ModifyExport', this._hookModifyExport);
      HM.hook('ModelForm.ModifyImport', this._hookModifyImport);
      HM.hook('Euglena.3dView', this._hook3dView)

    }
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
    if (meta.type == "blockly" || meta.type =="mech") {
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
        }), SymSelectField.create({
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
        }), SymSelectField.create({
          id: 'k',
          inverse_order: true,
          varOptions: meta.config.K.varOptions,
          label: meta.config.K.label,
          color: meta.config.K.color ? meta.config.K.color : null,
          value: meta.config.K.initialValue,
          maxValue: meta.config.K.maxValue,
          description: meta.config.K.description,
          region: meta.config.K.region ? meta.config.K.region : null,
          options: meta.config.K.options
        })
      ])

      // Add further specifications of sensors, if given
      let positionCounter = 0;
      if (meta.config.sensorPosition) {
        fields.splice(1+positionCounter,0,SelectField.create({
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
        }))
        positionCounter = positionCounter + 1;
      }

      if(meta.config.sensorShape) {
        fields.splice(1+positionCounter,0,SelectField.create({
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
        }))
        positionCounter = positionCounter + 1;
      }

      // Add either roll or motion type option
      if (meta.config.omega) {
        fields.splice(3+positionCounter,0,SymSelectField.create({
          id: 'omega',
          inverse_order: true,
          varOptions: meta.config.omega.varOptions,
          label: meta.config.omega.label,
          color: meta.config.omega.color ? meta.config.omega.color : null,
          value: meta.config.omega.initialValue,
          maxValue: meta.config.omega.maxValue,
          description: meta.config.omega.description,
          region: meta.config.omega.region ? meta.config.omega.region : null,
          options: meta.config.omega.options
        }))
      } else if (meta.config.motion) {
        fields.splice(3+positionCounter,0,SymSelectField.create({
          id: 'motion',
          inverse_order: true,
          label: meta.config.motion.label,
          color: meta.config.motion.color ? meta.config.motion.color : null,
          value: meta.config.motion.initialValue,
          maxValue: meta.config.motion.maxValue,
          description: meta.config.motion.description,
          region: meta.config.motion.region ? meta.config.motion.region : null,
          options: meta.config.motion.options
        }))
      }

      // Add opacity
      if (meta.config.opacity) {
        fields.splice(1,0,SymSelectField.create({
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
        }))
      }
    }
    return fields;
  }

  _hookModifyExport(exp, meta) {

    if (meta.type == "blockly" || meta.type == "mech") {
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
    if (meta.type == "blockly" || meta.type == "mech") {
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
    if (meta.config.modelType == "blockly" || meta.config.modelType == "mech") {
      // Here, extract the number of eyes

      var numSensors = 1;
      if (meta.config.configuration.sensorType === '2sensors') {
        numSensors = 2
      }

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
        var baseConfig = {
          baseColor: meta.color,
          addEye: 'right'
        }
      }

      return (new ModelView(baseConfig)).view()
    }
  }

}

export default ModelingDataModule;
