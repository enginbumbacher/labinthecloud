import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Utils from "core/util/utils";

import TextField from "core/component/textfield/field";
import MultiField from "core/component/multifield/field";
import ModelTabConfigField from "./modeltab/configfield";
import NumberField from "core/component/numberfield/field";
import SimpleKeyValueField from "core/component/simplekeyvaluefield/field";
import BlockConfig from "./modeltab/blockconfig";
import ProxyField from "core/component/proxyfield/field";

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
          ProxyField.create({
            id: 'blocks',
            fields: [
              FieldGroup.create({
                id: 'blockly',
                label: 'Allowed Blocks',
                showLabel: true,
                collapsible: true,
                collapsed: true,
                fields: [
                  FieldGroup.create({
                    id: 'turning',
                    label: 'Turning',
                    showLabel: true,
                    collapsed: true,
                    collapsible: true,
                    fields: [
                      BlockConfig.create({
                        id: 'turn_at_1sensor',
                        label: 'Turn at 1 Sensor'
                      }),
                      BlockConfig.create({
                        id: 'turn_at_2sensor',
                        label: 'Turn at 2 Sensor'
                      }),
                      BlockConfig.create({
                        id: 'turn_randomly',
                        label: 'Turn Randomly'
                      }),
                      BlockConfig.create({
                        id: 'turn_change',
                        label: 'Turn Change'
                      })
                    ]
                  }),
                  FieldGroup.create({
                    id: 'forward',
                    label: 'Forward',
                    showLabel: true,
                    collapsed: true,
                    collapsible: true,
                    fields: [
                      BlockConfig.create({
                        id: 'move_normal',
                        label: 'Move Normal'
                      }),
                      BlockConfig.create({
                        id: 'move_change',
                        label: 'Move Change'
                      })
                    ]
                  }),
                  FieldGroup.create({
                    id: 'rotation',
                    label: 'Rotation',
                    showLabel: true,
                    collapsed: true,
                    collapsible: true,
                    fields: [
                      BlockConfig.create({
                        id: 'roll_normal',
                        label: 'Roll Normal'
                      }),
                      BlockConfig.create({
                        id: 'roll_change',
                        label: 'Roll Change'
                      })
                    ]
                  }),
                  FieldGroup.create({
                    id: 'additional',
                    label: 'Additional Blocks',
                    showLabel: true,
                    collapsed: true,
                    collapsible: true,
                    fields: [
                      BlockConfig.create({
                        id: 'see_light_quantity',
                        label: 'See Light Quantity'
                      })
                    ]
                  })
                ]
              })
            ]
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
    });
    Utils.bindMethods(this, ['_onTabChange']);
    this.getSubField('tabs').addEventListener('Field.Change', this._onTabChange);
  }

  _onTabChange(evt) {
    let tabs = evt.currentTarget.value();
    let showBlocks = false;
    tabs.forEach((tab) => {
      if (tab.modelType == "blockly") {
        showBlocks = true;
      }
    })
    this.getSubField('blocks').setCurrentFieldId(showBlocks ? 'blockly' : null);
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
    value.euglenaCount = value.euglenaCount ? Object.values(value.euglenaCount.options) : [];
    super.setValue(value);
  }

  addToHistory(model, tab) {
    this.getSubField('tabs').getFields()[tab].addToHistory(model);
  }
}

ModelFields.create = (data = {}) => {
  return new ModelFields({ modelData: data })
}

export default ModelFields;