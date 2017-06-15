define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const Module = require('core/app/module'),
    SymSliderField = require('core/component/symsliderfield/field'),
    SliderField = require('core/component/sliderfield/field');

  return class TwoEyeModelModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, [
        '_hookModelFields', '_hookModifyExport', '_hookModifyImport'
      ]);

      HM.hook('ModelForm.Fields', this._hookModelFields);
      HM.hook('ModelForm.ModifyExport', this._hookModifyExport);
      HM.hook('ModelForm.ModifyImport', this._hookModifyImport);
    }

    _hookModelFields(fields, meta) {
      if (meta.type == "twoEye") {
        fields = fields.concat([SymSliderField.create({
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
      if (meta.type == "twoEye") {
        ['k', 'v', 'omega'].forEach((key) => {
          exp[`${key}_delta`] = exp[key].delta;
          exp[key] = exp[key].base;
        })
      }
      return exp
    }

    _hookModifyImport(data, meta) {
      if (meta.type == "twoEye") {
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
  }
})