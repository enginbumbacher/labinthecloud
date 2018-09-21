import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Utils from "core/util/utils";
import TextField from "core/component/textfield/field";
import NumberField from "core/component/numberfield/field";

class NEyeSliderConfig extends FieldGroup {
  constructor(conf) {
    conf.modelData.defaultValues = conf.modelData.defaultValues || {};
    conf.modelData.fields = conf.modelData.fields || [];
    conf.modelData.fields = conf.modelData.fields.concat([
      TextField.create({
        id: 'label',
        label: 'Display Label',
        defaultValue: conf.modelData.defaultValues.label
      }),
      NumberField.create({
        id: 'min',
        label: 'Minimum Allowed Value',
        defaultValue: conf.modelData.defaultValues.min
      }),
      NumberField.create({
        id: 'max',
        label: 'Maximum Allowed Value',
        defaultValue: conf.modelData.defaultValues.max
      }),
      NumberField.create({
        id: 'resolution',
        label: 'Resolution',
        defaultValue: conf.modelData.defaultValues.resolution
      })
    ]);
    if (conf.modelData.symSlider) {
      conf.modelData.defaultValues.initialValue = conf.modelData.defaultValues.initialValue || {};
      conf.modelData.fields.push(FieldGroup.create({
        id: 'initialValue',
        label: 'Starting Value',
        showLabel: true,
        collapsible: true,
        collapsed: true,
        fields: [
          NumberField.create({
            id: 'base',
            label: 'Base',
            defaultValue: conf.modelData.defaultValues.initialValue.base
          }),
          NumberField.create({
            id: 'delta',
            label: 'Delta',
            defaultValue: conf.modelData.defaultValues.initialValue.delta
          }),
        ]
      }));
    } else {
      conf.modelData.fields.push(NumberField.create({
        id: 'initialValue',
        label: 'Starting Value',
        defaultValue: conf.modelData.defaultValues.initialValue
      }));
    }
    super(conf);
  }

  value() {
    let base = super.value();
    base.range = [base.min, base.max];
    delete base.min;
    delete base.max;
    return base;
  }

  setValue(val) {
    let value = Utils.ensureDefaults(val, {});
    value.min = value.range[0];
    value.max = value.range[1];
    delete value.range;
    super.setValue(value);
  }
}

NEyeSliderConfig.create = (data = {}) => {
  return new NEyeSliderConfig({ modelData: data })
}

export default NEyeSliderConfig;