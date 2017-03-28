define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const Module = require('core/app/module');

  return class OneEyeModelModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, [
        '_hookModelForm'
      ]);

      HM.hook('EuglenaModel.Fields', this._hookModelFields);
    }

    _hookModelForm(fields, meta) {
      if (meta.type == "oneEye") {
        fields = fields.concat([RangedSliderField.create({
        }), RangedSliderField.create({
        }), RangedSliderField.create({
        }), SliderField.create({
        })])
      } else {
        return fields;
      }
    }
  }  
})