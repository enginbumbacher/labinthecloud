import FieldGroup from "core/component/fieldgroup/fieldgroup";

import NumberField from "core/component/numberfield/field";
import SelectField from "core/component/selectfield/field";
import BooleanField from "core/component/booleanfield/field";

class SystemFields extends FieldGroup {
  constructor(conf) {
    super({
      modelData: {
        id: 'system',
        label: 'System',
        fields: [
          NumberField.create({
            id: 'maxLoginTime',
            label: 'Maximum Login Time',
            defaultValue: 0,
            help: 'Automatically logs a student out after this number of seconds. Set to 0 for no limit'
          }),
          SelectField.create({
            id: 'experimentModality',
            label: 'Experiment Modality',
            options: {
              create: 'Create',
              createAndHistory: 'Create & History',
              observe: 'Observe',
              explore: 'Explore'
            },
            defaultValue: 'explore'
          }),
          SelectField.create({
            id: 'modelModality',
            label: 'Model Modality',
            options: {
              observe: 'Observe',
              explore: 'Explore',
              create: 'Create'
            },
            defaultValue: 'explore'
          }),
          SelectField.create({
            id: 'expModelModality',
            label: 'Experiment-Model Modality',
            options: {
              simultaneous: 'Simultaneous',
              sequential: 'Sequential',
              justmodel: 'Just Model'
            },
            defaultValue: 'simultaneous'
          }),
          BooleanField.create({
            id: 'enableDirectComparison',
            label: 'Enable Direct Comparison',
            defaultValue: false,
            help: 'Check to allow direct comparison between models'
          })
        ]
      }
    });
  }
}

SystemFields.create = (data = {}) => {
  return new SystemFields({ modelData: data })
}

export default SystemFields;