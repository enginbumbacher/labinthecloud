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

  const defaultConfigs = require('./bodyConfigurations/bodyconfigs/listofconfigs')


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
        var bodyConfigs = Array.apply(null, {length:Object.keys(defaultConfigs).length}).map((number,ind) => 'configuration_' + (ind+1))
        this.bodyConfigOptions = {}
        bodyConfigs.map(bodyconfig => this.bodyConfigOptions[bodyconfig] = defaultConfigs[bodyconfig]['id'])
        fields = fields.concat([SelectField.create({
          id: "bodyConfigurationName",
          inverse_order: true,
          color: meta.config.bodyConfiguration.color ? meta.config.bodyConfiguration.color : null,
          label: meta.config.bodyConfiguration.label,
          value: meta.config.bodyConfiguration.initialValue,
          defaultValue: meta.config.bodyConfiguration.initialValue,
          classes: [],
          options: this.bodyConfigOptions
        }), SelectField.create({
          id: 'opacity',
          inverse_order: true,
          label: meta.config.opacity.label,
          color: meta.config.opacity.color ? meta.config.opacity.color : null,
          value: meta.config.opacity.initialValue,
          defaultValue: meta.config.opacity.initialValue,
          classes: [],
          options: meta.config.opacity.options
        }), SelectField.create({
          id: 'k',
          inverse_order: true,
          label: meta.config.K.label,
          color: meta.config.K.color ? meta.config.K.color : null,
          value: meta.config.K.initialValue,
          defaultValue: meta.config.K.initialValue,
          classes: [],
          options: meta.config.K.options
        }), SelectField.create({
          id: 'v',
          inverse_order: true,
          label: meta.config.v.label,
          color: meta.config.v.color ? meta.config.v.color : null,
          value: meta.config.v.initialValue,
          defaultValue: meta.config.v.initialValue,
          classes: [],
          options: meta.config.v.options
        }), SelectField.create({
          id: 'omega',
          inverse_order: true,
          label: meta.config.omega.label,
          color: meta.config.omega.color ? meta.config.omega.color : null,
          value: meta.config.omega.initialValue,
          defaultValue: meta.config.omega.initialValue,
          classes: [],
          options: meta.config.omega.options
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
