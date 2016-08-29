define((require) => {
  const FieldGroup = require('core/component/fieldgroup/fieldgroup'),
    SelectField = require('core/component/selectfield/field'),
    NumberField = require('core/component/numberfield/field'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

  return class ExperimentRow extends FieldGroup {
    constructor(settings) {
      settings.viewClass = settings.viewClass || View;
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
})