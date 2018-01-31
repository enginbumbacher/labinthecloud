define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Module = require('core/app/module'),
    ModelingDataTab = require('./blocklytab/tab'),
    SymSliderField = require('core/component/symsliderfield/field'),
    SliderField = require('core/component/sliderfield/field'),
    SelectField = require('core/component/selectfield/field'),
    ModelView = require('./threeview');

  class ModelingDataModule extends Module {
    constructor() {
      super();
      if (Globals.get('AppConfig.modeling')) {
        Utils.bindMethods(this, ['_onPhaseChange', '_onExperimentCountChange',
      '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView'])

        this.tab = new ModelingDataTab();

        Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
        Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange)

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
      } else if (!evt.data.count) {
        this.tab.hide();
      }
    }

    _hookModelFields(fields, meta) {
      if (meta.type == "blockly") {
        var bodyConfigs = Array.apply(null, {length:15}).map((number,ind) => 'configuration_' + (ind+1))
        this.bodyConfigOptions = {}
        bodyConfigs.map(bodyconfig => this.bodyConfigOptions[bodyconfig] = bodyconfig)
        fields = fields.concat([SelectField.create({
          id: "bodyConfigurationName",
          color: meta.config.bodyConfiguration.color ? meta.config.bodyConfiguration.color : null,
          label: meta.config.bodyConfiguration.label,
          value: meta.config.bodyConfiguration.initialValue,
          classes: [],
          options: this.bodyConfigOptions
        }), SymSliderField.create({
          id: 'opacity',
          color: meta.config.opacity.color ? meta.config.opacity.color : null,
          label: meta.config.opacity.label,
          min: meta.config.opacity.range[0],
          max: meta.config.opacity.range[1],
          steps: Math.round((meta.config.opacity.range[1] - meta.config.opacity.range[0]) / meta.config.opacity.resolution),
          defaultValue: meta.config.opacity.initialValue
        }), SymSliderField.create({
          id: 'k',
          color: meta.config.K.color ? meta.config.K.color : null,
          label: meta.config.K.label,
          min: meta.config.K.range[0],
          max: meta.config.K.range[1],
          steps: Math.round((meta.config.K.range[1] - meta.config.K.range[0]) / meta.config.K.resolution),
          defaultValue: meta.config.K.initialValue
        }), SymSliderField.create({
          id: 'v',
          color: meta.config.v.color ? meta.config.v.color : null,
          label: meta.config.v.label,
          min: meta.config.v.range[0],
          max: meta.config.v.range[1],
          steps: Math.round((meta.config.v.range[1] - meta.config.v.range[0]) / meta.config.v.resolution),
          defaultValue: meta.config.v.initialValue
        }), SymSliderField.create({
          id: 'omega',
          color: meta.config.omega.color ? meta.config.omega.color : null,
          label: meta.config.omega.label,
          min: meta.config.omega.range[0],
          max: meta.config.omega.range[1],
          steps: Math.round((meta.config.omega.range[1] - meta.config.omega.range[0]) / meta.config.omega.resolution),
          defaultValue: meta.config.omega.initialValue
        })
      ])
      }
      return fields;
    }

    _hookModifyExport(exp, meta) {
      if (meta.type == "blockly") {
        ['k', 'v', 'omega','opacity'].forEach((key) => {
          exp[`${key}_delta`] = exp[key].delta;
          exp[key] = exp[key].base;
        })
      }
      return exp
    }

    _hookModifyImport(data, meta) {
      if (meta.type == "blockly") {
        ['k', 'v', 'omega','opacity'].forEach((key) => {
          data[key] = {
            base: data[key],
            delta: data[`${key}_delta`]
          };
          delete data[`${key}_delta`];
        })
      }
      return data;
    }

    _hook3dView(view, meta) {
      if (meta.config.modelType == "blockly") {
        return (new ModelView({ baseColor: meta.color })).view()
      }
      return view;
    }
  }

  return ModelingDataModule;
})
