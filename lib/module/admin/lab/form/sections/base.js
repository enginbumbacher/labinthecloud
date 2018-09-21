import FieldGroup from "core/component/fieldgroup/fieldgroup";

import TextField from "core/component/textfield/field";
import BooleanField from "core/component/booleanfield/field";

class BaseFields extends FieldGroup {
  constructor(conf) {
    super({
      modelData: {
        id: "base",
        label: "Base",
        fields: [
          TextField.create({
            id: 'title',
            label: 'Title'
          }),
          TextField.create({
            id: 'path',
            label: "URL"
          }),
          BooleanField.create({
            id: 'useExperiment',
            label: 'Use Experiments',
            defaultValue: true
          }),
          BooleanField.create({
            id: 'useModel',
            label: 'Use Modeling',
            defaultValue: true
          }),
          BooleanField.create({
            id: 'useVisualization',
            label: 'Use Data Visualizations',
            defaultValue: true
          }),
          BooleanField.create({
            id: 'useAggregate',
            label: 'Use Aggregate Tab',
            defaultValue: true
          })
        ]
      }
    })
  }
}

BaseFields.create = (data = {}) => {
  return new BaseFields({ modelData: data })
}

export default BaseFields;