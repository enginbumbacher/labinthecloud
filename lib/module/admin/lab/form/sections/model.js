import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Utils from "core/util/utils";

import TextField from "core/component/textfield/field";
import MultiField from "core/component/multifield/field";
import ModelTabConfigField from "./modeltab/configfield";
import NumberField from "core/component/numberfield/field";
import SimpleKeyValueField from "core/component/simplekeyvaluefield/field";

class ModelFields extends FieldGroup {
  constructor(conf) {
    super({
      modelData: {
        id: "model",
        label: "Modeling",
        fields: [
          TextField.create({
            id: "modelName",
            label: "Model Name"
          }),
          MultiField.create({
            id: "tabs",
            label: "Modeling Tabs",
            childClass: ModelTabConfigField,
            max: 2
          }),
          MultiField.create({
            id: 'euglenaCount',
            label: 'Euglena Count Options',
            childClass: NumberField,
            min: 1,
            defaultValue: [1,2,20]
          }),
          FieldGroup.create({
            id: "euglenaInit",
            label: "Euglena Initialization",
            showLabel: true,
            collapsible: true,
            fields: [
              SimpleKeyValueField.create({
                id: 'options',
                label: "Options",
                defaultValue: "1|random\n2|all point to right"
              }),
              TextField.create({
                id: 'initialValue',
                label: "Initial Value",
                defaultValue: "1"
              })
            ]
          }),
          NumberField.create({
            id: 'simulationFps',
            label: 'Simulation FPS',
            defaultValue: 12
          })
        ]
      }
    })
  }

  value() {
    let val = super.value();
    let euglenaCount = {
      options: {}
    };
    val.euglenaCount.forEach((count) => {
      euglenaCount.options[count] = count;
    })
    val.euglenaCount = euglenaCount;
    return val;
  }

  setValue(val) {
    let value = Utils.ensureDefaults(val, {});
    value.euglenaCount = Object.values(value.euglenaCount.options);
    super.setValue(value);
  }
}

ModelFields.create = (data = {}) => {
  return new ModelFields({ modelData: data })
}

export default ModelFields;