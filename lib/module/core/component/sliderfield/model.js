define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');
  
  const FieldModel = require('core/component/form/field/model'),
    defaults = {
      min: 0,
      max: 1,
      steps: 0,
      unitValue: [0.5]
    };

  return class SliderFieldModel extends FieldModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    setUnitValue(val, ind = 0) {
      const uv = this.get('unitValue');
      if (ind < uv.length) {
        let work = Math.min(1, Math.max(0, val));
        let tmp;
        for (let i = 0; i < uv.length; i++) {
          if ((ind >= i && work < uv[i]) || (ind <= i && work > uv[i])) {
            tmp = uv[i];
            uv[i] = work;
            work = tmp;
          }
        }
        this.set('unitValue', uv);
      }
    }

    unitValue() {
      return this.get('unitValue');
    }
  }
})