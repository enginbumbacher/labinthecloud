import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Utils from "core/util/utils";

import SelectField from "core/component/selectfield/field";
import ColorField from "core/component/colorfield/field";
import ProxyField from "core/component/proxyfield/field";

import BlocklyConfig from "./blockly";
import OneEyeConfig from "./oneeye";
import TwoEyeConfig from "./twoeye";

const colorMap = ["#2222ff", "#dd0000"]

class ModelTabConfigField extends FieldGroup {
  constructor(conf) {
    let typeSelector = SelectField.create({
      id: 'modelType',
      label: 'Model Type',
      options: {
        blockly: 'Blockly',
        oneEye: 'Parameters - One Eye',
        twoEye: 'Parameters - Two Eyes'
      }
    })
    if (conf.modelData.value) {
      typeSelector.setValue(conf.modelData.value.modelType);
    }
    conf.modelData.fields = conf.modelData.fields || [];
    conf.modelData.fields.push(typeSelector);
    conf.modelData.fields.push(ColorField.create({
      id: 'color',
      label: "Color",
      // value: conf.modelData.value ? `#${conf.modelData.value.color.toString(16)}` : null,
      defaultValue: Utils.exists(conf.modelData._multifield_count) ? colorMap[conf.modelData._multifield_count] : "#000000"
    }));
    conf.modelData.fields.push(ProxyField.create({
      id: 'parameters',
      fields: [
        BlocklyConfig.create({
          id: 'blockly',
          label: 'Blockly Settings',
          showLabel: true,
          collapsible: true
        }),
        OneEyeConfig.create({
          id: 'oneEye',
          label: 'One Eye Settings',
          showLabel: true,
          collapsible: true
        }),
        TwoEyeConfig.create({
          id: 'twoEye',
          label: 'Two Eye Settings',
          showLabel: true,
          collapsible: true
        })
      ],
      proxyControl: typeSelector
    }))
    super(conf);
  }

  value() {
    let value = super.value();
    value.color = parseInt(value.color.replace('#', ''), 16);
    return value;
  }

  setValue(val) {
    let value = Utils.ensureDefaults(val, {});
    value.color = `#${value.color.toString(16)}`;
    super.setValue(value);
  }
}

ModelTabConfigField.create = (data = {}) => {
  return new ModelTabConfigField({ modelData: data })
}

export default ModelTabConfigField;