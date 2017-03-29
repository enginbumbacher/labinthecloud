define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');
  
  const FieldModel = require('core/component/form/field/model'),
    defaults = {
      min: 0,
      max: 1,
      steps: 0,
      defaultValue: 0.5,
      unitValue: 0.5
    };

  return class SliderFieldModel extends FieldModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);

      const min = this.get('min'),
        max = this.get('max');
      this.set('unitValue', (this.value() - min) / (max - min));
    }

    setValue(val) {
      this.setUnitValue((val - this.get('min')) / (this.get('max') - this.get('min')));
    }

    setUnitValue(val) {
      const steps = this.get('steps'),
        min = this.get('min'),
        max = this.get('max');
      val = Math.min(1, Math.max(0, val));
      if (steps > 1) {
        val = Math.round(val * steps) / steps
      }
      this.set('unitValue', val);
      if (steps > 1) {
        const stepSize = (max - min) / steps;
        let exp = stepSize.toExponential().split('e');
        exp = exp[1] ? +exp[1] : 0;
        this.set('value', Utils.roundDecimal(this.get('unitValue') * steps * stepSize + min, exp));
      } else {
        this.set('value', this.get('unitValue') * (max - min) + min);
      }
    }

    unitValue() {
      return this.get('unitValue');
    }
  }
})