define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const FieldModel = require('core/component/form/field/model'),
    defaults = {
      min: 0,
      max: 1,
      steps: 0,
      defaultValue: {
        base: 0.5,
        delta: 0.1
      },
      unitValue: 0.5,
      deltaUnitValue: 0.1
    };

  return class SymmetricSliderFieldModel extends FieldModel {
    constructor(conf) {
      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      super(conf);

      const min = this.get('min'),
        max = this.get('max');
      this.set('unitValue', (this.value().base - min) / (max - min));
      this.set('deltaUnitValue', this.value().delta / (max - min));
    }

    setBaseValue(val) {
      this.setUnitValue((val - this.get('min')) / (this.get('max') - this.get('min')));
    }
    setDeltaValue(val) {
      this.setDeltaUnitValue(val / (this.get('max') - this.get('min')));
    }

    setUnitValue(val) {
      val = Math.min(1, Math.max(0, val))
      const steps = this.get('steps')
      if (steps > 1) {
        val = Math.round(val * steps) / steps
      }
      this.set('unitValue', val);
      if (val < this.get('deltaUnitValue')) {
        this.set('deltaUnitValue', val);
      }
      if ((1 - val) < this.get('deltaUnitValue')) {
        this.set('deltaUnitValue', 1 - val);
      }
      this._updateValue();
    }
    setDeltaUnitValue(val) {
      val = Math.min(this.get('unitValue'), 1 - this.get('unitValue'), val)
      const steps = this.get('steps')
      if (steps > 1) {
        val = Math.round(val * steps) / steps;
      }
      this.set('deltaUnitValue', val);
      this._updateValue();
    }

    _updateValue() {
      const max = this.get('max'),
        min = this.get('min'),
        steps = this.get('steps');
      let v;
      if (steps > 1) {
        const stepSize = (max - min) / steps;
        let exp = stepSize.toExponential().split('e');
        exp = exp[1] ? +exp[1] : 0;
        v = {
          base: Utils.roundDecimal(this.get('unitValue') * steps * stepSize + min, exp),
          delta: Utils.roundDecimal(this.get('deltaUnitValue') * steps * stepSize, exp)
        }
      } else {
        v = {
          base: this.get('unitValue') * (max - min) + min,
          delta: this.get('deltaUnitValue') * (max - min)
        }
      }
      this.set('value', v);
    }
  }
});