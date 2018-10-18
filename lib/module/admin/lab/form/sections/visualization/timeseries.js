import FieldGroup from "core/component/fieldgroup/fieldgroup";
import NumberField from "core/component/numberfield/field";
import BooleanField from "core/component/booleanfield/field";
import SelectField from "core/component/selectfield/field";

class TimeSeriesConfig extends FieldGroup {
  constructor(conf) {
    conf.modelData.fields = conf.modelData.fields || [];
    conf.modelData.fields = conf.modelData.fields.concat([
      NumberField.create({
        id: 'vRange',
        label: 'Y Axis Maximum',
        help: `Set to 0 to use the data maximum instead of a static value.`
      }),
      SelectField.create({
        id: 'mode',
        label: 'Velocity Mode',
        options: {
          total: 'Combined Speed (single graph)',
          component: 'Component Speed (separate graphs for X and Y speeds)'
        }
      }),
      BooleanField.create({
        id: 'stdBand',
        label: 'Show Standard Deviation band',
        defaultValue: true
      }),
      NumberField.create({
        id: 'dT',
        label: 'Delta Time in Seconds',
        defaultValue: 1
      }),
      NumberField.create({
        id: 'width',
        label: 'Graph Width',
        defaultValue: 400
      }),
      NumberField.create({
        id: 'height',
        label: 'Graph Height',
        defaultValue: 300
      }),
      FieldGroup.create({
        id: 'margins',
        label: 'Graph Margins',
        showLabel: true,
        collapsible: true,
        collapsed: true,
        fields: [
          NumberField.create({
            id: 'top',
            label: 'Top',
            defaultValue: 40
          }),
          NumberField.create({
            id: 'right',
            label: 'Right',
            defaultValue: 20
          }),
          NumberField.create({
            id: 'bottom',
            label: 'Bottom',
            defaultValue: 40
          }),
          NumberField.create({
            id: 'left',
            label: 'Left',
            defaultValue: 40
          })
        ]
      })      
    ])
    super(conf);
  }
}

TimeSeriesConfig.create = (data = {}) => {
  return new TimeSeriesConfig({ modelData: data })
}

export default TimeSeriesConfig;