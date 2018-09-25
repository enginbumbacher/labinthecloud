import FieldGroup from "core/component/fieldgroup/fieldgroup";

import BooleanField from "core/component/booleanfield/field";
import NumberField from "core/component/numberfield/field";

class BlockConfigFields extends FieldGroup {
  constructor(conf) {
    conf.modelData.collapsible = true;
    conf.modelData.collapsed = true;
    conf.modelData.showLabel = true;
    conf.modelData.fields = (conf.modelData.fields || []).concat([
      BooleanField.create({
        id: 'allow',
        label: 'Allow',
        defaultValue: true
      }),
      NumberField.create({
        id: 'maxUse',
        label: 'Max # of Uses',
        defaultValue: 2
      })
    ])

    super(conf);
  }
}

BlockConfigFields.create = (data = {}) => {
  return new BlockConfigFields({ modelData: data })
}

export default BlockConfigFields;