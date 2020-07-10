import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Globals from 'core/model/globals';

import NumberField from "core/component/numberfield/field";
import HiddenField from 'core/component/hiddenfield/field';

class CakeConfig extends FieldGroup {
  constructor(conf) {
    let fields = [
      NumberField.create({
        id: "binCount",
        label: "Bin Count",
        defaultValue: 12
      }),
      NumberField.create({
        id: 'dT',
        label: 'Delta Time in Seconds',
        defaultValue: 1
      }),
      NumberField.create({
        id: 'tStep',
        label: 'Time Step in Seconds',
        defaultValue: 0.5
      })
    ];
    if (Globals.get('EditLabConfig.isAdmin')) {
      fields = fields.concat([
        NumberField.create({
          id: 'width',
          label: 'Graph Width',
          defaultValue: 320
        }),
        NumberField.create({
          id: 'height',
          label: 'Graph Height',
          defaultValue: 320
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
              defaultValue: 30
            }),
            NumberField.create({
              id: 'right',
              label: 'Right',
              defaultValue: 30
            }),
            NumberField.create({
              id: 'bottom',
              label: 'Bottom',
              defaultValue: 30
            }),
            NumberField.create({
              id: 'left',
              label: 'Left',
              defaultValue: 30
            })
          ]
        })
      ])
    } else {
      fields = fields.concat([
        HiddenField.create({
          id: 'width',
          defaultValue: 320
        }),
        HiddenField.create({
          id: 'height',
          defaultValue: 320
        }),
        HiddenField.create({
          id: 'margins',
          defaultValue: {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
          }
        })
      ])
    }

    conf.modelData.fields = conf.modelData.fields || [];
    conf.modelData.fields = conf.modelData.fields.concat(fields);
    super(conf);
  }
}

CakeConfig.create = (data = {}) => {
  return new CakeConfig({ modelData: data })
}

export default CakeConfig;