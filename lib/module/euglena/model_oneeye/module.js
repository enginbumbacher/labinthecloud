import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Module from 'core/app/module';
import SymSliderField from 'core/component/symsliderfield/field';
import SliderField from 'core/component/sliderfield/field';
import OneEyeView from './threeview';

export default class OneEyeModelModule extends Module {
  constructor() {
    super();
    Utils.bindMethods(this, [
      '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView'
    ]);

    HM.hook('ModelForm.Fields', this._hookModelFields);
    HM.hook('ModelForm.ModifyExport', this._hookModifyExport);
    HM.hook('ModelForm.ModifyImport', this._hookModifyImport);
    HM.hook('Euglena.3dView', this._hook3dView)
  }

  _hookModelFields(fields, meta) {
    if (meta.type == "oneEye") {
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
    if (meta.type == "oneEye") {
      ['k', 'v', 'omega'].forEach((key) => {
        exp[`${key}_delta`] = exp[key].delta;
        exp[key] = exp[key].base;
      })
    }
    return exp
  }

  _hookModifyImport(data, meta) {
    if (meta.type == "oneEye") {
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
    if (meta.config.modelType == "oneEye") {
      return (new OneEyeView({ baseColor: meta.color })).view()
    }
    return view;
  }
}
