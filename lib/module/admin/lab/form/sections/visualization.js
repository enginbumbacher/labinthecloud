import FieldGroup from "core/component/fieldgroup/fieldgroup";

import VisualizationConfig from "./visualization/config";
import MultiField from "core/component/multifield/field";

class VisualizationFields extends FieldGroup {
  constructor(conf) {
    super({
      modelData: {
        id: "visualization",
        label: "Data Visualization",
        fields: [
          MultiField.create({
            id: "visualizationTypes",
            label: "Graphs",
            childClass: VisualizationConfig
          })
        ]
      }
    })
  }
}

VisualizationFields.create = (data = {}) => {
  return new VisualizationFields({ modelData: data })
}

export default VisualizationFields;