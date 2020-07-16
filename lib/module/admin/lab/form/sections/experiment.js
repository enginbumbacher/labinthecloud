import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Utils from 'core/util/utils';
import NumberField from "core/component/numberfield/field";
import SelectField from "core/component/selectfield/field";
import ExperimentDisplayField from 'admin/component/experimentdisplayfield/field';
import MultiField from 'core/component/multifield/field';
import Globals from 'core/model/globals'
import HiddenField from "core/component/hiddenfield/field";

class ExperimentFields extends FieldGroup {
  constructor(conf) {
    let fields = [
      SelectField.create({
        id: 'experimentForm',
        label: 'Experiment Form Type',
        options: {
          narrative: 'Narrative',
          table: 'Table'
        },
        defaultValue: 'narrative'
      }),
      SelectField.create({
        id: 'formOptions',
        label: 'Form Options',
        options: {
          complete: 'Complete',
          partial: 'Partial'
        }
      }),
      MultiField.create({
        id: 'experimentHistory',
        label: 'Preset Experiments',
        childClass: ExperimentDisplayField,
        addOverride: true,
        addButtonLabel: 'Add Presets'
      })
    ];

    if (Globals.get('EditLabConfig.isAdmin')) {
      fields = fields.concat([
        SelectField.create({
          id: 'server',
          label: 'Server',
          options: {
            dev: 'Dev',
            prod: 'Production'
          },
          defaultValue: 'prod'
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
        })
      ])
    } else {
      fields = fields.concat([
        HiddenField.create({
          id: 'server',
          defaultValue: 'prod'
        }),
        HiddenField.create({
          id: 'maxDuration',
          defaultValue: 60
        }),
        HiddenField.create({
          id: 'bpuId',
          defaultValue: []
        }),
        HiddenField.create({
          id: 'euglenaServerMode',
          defaultValue: 'historical'
        })
      ])
    }

    super({
      modelData: {
        id: 'experiment',
        label: 'Experimenting',
        fields: fields
      }
    });

    Utils.bindMethods(this, ['_onHistoryAdd'])

    this.getSubField('experimentHistory').addEventListener('MultiField.AddOverride', this._onHistoryAdd)
  }

  _onHistoryAdd(evt) {
    console.log('I have been clicked')
    Globals.get('Relay').dispatchEvent('LabEdit.Sandbox', {});
  }

  value() {
    let val = super.value();
    if (val.experimentHistory.length == 0) {
      delete val.experimentHistory;
    }
    return val;
  }

  addToHistory(exp) {
    let history = this.getSubField('experimentHistory').value();
    this.getSubField('experimentHistory').setValue(history.concat(exp.id));
  }
}

ExperimentFields.create = (data = {}) => {
  return new ExperimentFields({ modelData: data })
}

export default ExperimentFields;
