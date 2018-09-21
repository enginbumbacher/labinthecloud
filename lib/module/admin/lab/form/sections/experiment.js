import FieldGroup from "core/component/fieldgroup/fieldgroup";

import NumberField from "core/component/numberfield/field";
import SelectField from "core/component/selectfield/field";

class ExperimentFields extends FieldGroup {
  constructor(conf) {
    super({
      modelData: {
        id: 'experiment',
        label: 'Experimenting',
        fields: [
          SelectField.create({
            id: 'server',
            label: 'Server',
            options: {
              dev: 'Dev',
              prod: 'Production'
            },
            defaultValue: 'prod'
          }),
          SelectField.create({
            id: 'experimentForm',
            label: 'Experiment Form Type',
            options: {
              narrative: 'Narrative',
              table: 'Table'
            },
            defaultValue: 'narrative'
          }),
          NumberField.create({
            id: 'maxDuration',
            label: 'Max. Experiment Duration',
            defaultValue: 60
          }),
          SelectField.create({
            id: 'bpuId',
            label: 'BPUs',
            multiple: true,
            options: {
              eug1: 'BPU 1',
              eug2: 'BPU 2',
              eug3: 'BPU 3',
              eug4: 'BPU 4',
              eug5: 'BPU 5',
              eug6: 'BPU 6',
              eug7: 'BPU 7',
              eug8: 'BPU 8',
              eug9: 'BPU 9',
              eug10: 'BPU 10',
              eug11: 'BPU 11',
              eug12: 'BPU 12',
              eug13: 'BPU 13',
              eug14: 'BPU 14',
              eug15: 'BPU 15',
              eug16: 'BPU 16',
            }
          }),
          SelectField.create({
            id: 'euglenaServerMode',
            label: 'Server Mode',
            options: {
              simulate: 'Simulate',
              demo: 'Demo',
              historical: 'Historical'
            },
            defaultValue: 'historical'
          }),
          SelectField.create({
            id: 'formOptions',
            label: 'Form Options',
            options: {
              complete: 'Complete',
              partial: 'Partial'
            }
          })
        ]
      }
    });
  }
}

ExperimentFields.create = (data = {}) => {
  return new ExperimentFields({ modelData: data })
}

export default ExperimentFields;