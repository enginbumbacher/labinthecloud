import FieldGroup from "core/component/fieldgroup/fieldgroup";

import NumberField from "core/component/numberfield/field";

class AggregationFields extends FieldGroup {
  constructor(conf) {
    super({
      modelData: {
        id: "aggregate",
        label: "Aggregation",
        fields: [
          NumberField.create({
            id: 'timeWindow',
            label: "Time Window",
            defaultValue: 2,
            help: 'Time span, in seconds, which is considered at each point of the aggregate graphs'
          })
        ]
      }
    })
  }
}

AggregationFields.create = (data = {}) => {
  return new AggregationFields({ modelData: data })
}

export default AggregationFields;