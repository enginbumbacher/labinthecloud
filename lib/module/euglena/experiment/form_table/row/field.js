import FieldGroup from 'core/component/fieldgroup/fieldgroup';
import SelectField from 'core/component/selectfield/field';
import NumberField from 'core/component/numberfield/field';
import View from './view';
import Utils from 'core/util/utils';

export default class ExperimentRow extends FieldGroup {
  constructor(settings) {
    settings.viewClass = settings.viewClass || View;
    settings.modelData = settings.modelData || {};
    settings.modelData.value = settings.modelData.value || {};
    settings.modelData = Utils.ensureDefaults(settings.modelData, {
      fields: [SelectField.create({
        id: "left",
        options: {
          0: 0,
          25: 25,
          50: 50,
          75: 75,
          100: 100
        },
        defaultValue: 0,
        value: settings.modelData.value.left
      }), SelectField.create({
        id: "top",
        options: {
          0: 0,
          25: 25,
          50: 50,
          75: 75,
          100: 100
        },
        defaultValue: 0,
        value: settings.modelData.value.top
      }), SelectField.create({
        id: "bottom",
        options: {
          0: 0,
          25: 25,
          50: 50,
          75: 75,
          100: 100
        },
        defaultValue: 0,
        value: settings.modelData.value.bottom
      }), SelectField.create({
        id: "right",
        options: {
          0: 0,
          25: 25,
          50: 50,
          75: 75,
          100: 100
        },
        defaultValue: 0,
        value: settings.modelData.value.right
      }) , NumberField.create({
        id: 'duration', 
        min: 0,
        changeEvents: 'change blur',
        defaultValue: 0,
        value: settings.modelData.value.duration
      })]
    });
    super(settings)
  }

  value() {
    let val = super.value();
    ['left', 'top', 'bottom', 'right', 'duration'].forEach((key) => {
      val[key] = parseFloat(val[key]);
    })
    return val;
  }
}
