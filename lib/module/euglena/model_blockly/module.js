define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Module = require('core/app/module'),
    ModelingDataTab = require('./blocklytab/tab'),
    //SymSliderField = require('core/component/symsliderfield/field'),
    //SliderField = require('core/component/sliderfield/field'),
    SelectField = require('core/component/selectfield/field'),
    SymSelectField = require('core/component/symselectfield/field'),
    ModelView = require('./threeview');

  const defaultConfigs = require('./bodyConfigurations/bodyconfigs/listofconfigs')


  class ModelingDataModule extends Module {
    constructor() {
      super();
      if (Globals.get('AppConfig.modeling')) {
          Utils.bindMethods(this, ['_onPhaseChange', '_onExperimentCountChange',
        '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView'])

        if (Globals.get('AppConfig.model.tabs').length) {
          this.tab = new ModelingDataTab();
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
      if (meta.type == "blockly") {
        var bodyConfigs = Array.apply(null, {length:Object.keys(defaultConfigs).length}).map((number,ind) => 'sensorConfig_' + (ind+1));
        // Filter out the options that are not in allowedConfigs
        if (meta.config.allowedConfigs.length) {
          for (let idx = bodyConfigs.length - 1; idx >= 0; idx--) {
            if ((meta.config.allowedConfigs.indexOf(defaultConfigs[bodyConfigs[idx]].id.toLowerCase()) == -1)) {
              bodyConfigs.splice(idx,1)
            }
          }
        }
        this.bodyConfigOptions = {}
        bodyConfigs.map(bodyconfig => this.bodyConfigOptions[bodyconfig] = defaultConfigs[bodyconfig]['id'])
        fields = fields.concat([SelectField.create({
            id: "bodyConfigurationName",
            inverse_order: true,
            color: meta.config.bodyConfiguration.color ? meta.config.bodyConfiguration.color : null,
            label: meta.config.bodyConfiguration.label,
            value: meta.config.bodyConfiguration.initialValue,
            min_width: meta.config.bodyConfiguration.min_width,
            description: meta.config.bodyConfiguration.description,
            classes: [],
            options: this.bodyConfigOptions
          }), SymSelectField.create({
            id: 'v',
            inverse_order: true,
            varOptions: meta.config.v.varOptions,
            label: meta.config.v.label,
            color: meta.config.v.color ? meta.config.v.color : null,
            value: meta.config.v.initialValue,
            maxValue: meta.config.v.maxValue,
            description: meta.config.v.description,
            classes: [],
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
            classes: [],
            options: meta.config.K.options
          })
        ])

        // Add either roll or motion type option
        if (meta.config.omega) {
          fields.splice(3,0,SymSelectField.create({
            id: 'omega',
            inverse_order: true,
            varOptions: meta.config.omega.varOptions,
            label: meta.config.omega.label,
            color: meta.config.omega.color ? meta.config.omega.color : null,
            value: meta.config.omega.initialValue,
            maxValue: meta.config.omega.maxValue,
            description: meta.config.omega.description,
            classes: [],
            options: meta.config.omega.options
          }))
        } else if (meta.config.motion) {
          fields.splice(3,0,SymSelectField.create({
            id: 'motion',
            inverse_order: true,
            label: meta.config.motion.label,
            color: meta.config.motion.color ? meta.config.motion.color : null,
            value: meta.config.motion.initialValue,
            maxValue: meta.config.motion.maxValue,
            description: meta.config.motion.description,
            classes: [],
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
            classes: [],
            options: meta.config.opacity.options
          }))
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

  return ModelingDataModule;
})
