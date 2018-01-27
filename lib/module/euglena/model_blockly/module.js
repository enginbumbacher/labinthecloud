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
        fields = fields.concat([SelectField.create({
          id: "body_configuration",
          label: 'body configuration',
          value: "configuration_1",
          classes: [],
          options: { "configuration_1": "With one eye", "configuration_2": "With two eyes" }
        }), SymSliderField.create({
          id: 'k',
          label: meta.config.K.label,
          min: meta.config.K.range[0],
          max: meta.config.K.range[1],
          steps: Math.round((meta.config.K.range[1] - meta.config.K.range[0]) / meta.config.K.resolution),
          defaultValue: meta.config.K.initialValue
        }), SymSliderField.create({
          id: 'v',
          label: meta.config.v.label,
          min: meta.config.v.range[0],
          max: meta.config.v.range[1],
          steps: Math.round((meta.config.v.range[1] - meta.config.v.range[0]) / meta.config.v.resolution),
          defaultValue: meta.config.v.initialValue
        }), SymSliderField.create({
          id: 'omega',
          label: meta.config.omega.label,
          min: meta.config.omega.range[0],
          max: meta.config.omega.range[1],
          steps: Math.round((meta.config.omega.range[1] - meta.config.omega.range[0]) / meta.config.omega.resolution),
          defaultValue: meta.config.omega.initialValue
        }), SliderField.create({
          id: 'randomness',
          label: meta.config.randomness.label,
          min: meta.config.randomness.range[0],
          max: meta.config.randomness.range[1],
          steps: Math.round((meta.config.randomness.range[1] - meta.config.randomness.range[0]) / meta.config.randomness.resolution),
          defaultValue: meta.config.randomness.initialValue
        })])
      }
      return fields;
    }

    _hookModifyExport(exp, meta) {
      if (meta.type == "blockly") {
        ['k', 'v', 'omega'].forEach((key) => {
          exp[`${key}_delta`] = exp[key].delta;
          exp[key] = exp[key].base;
        })
      }
      return exp
    }

    _hookModifyImport(data, meta) {
      if (meta.type == "blockly") {
        ['k', 'v', 'omega'].forEach((key) => {
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
