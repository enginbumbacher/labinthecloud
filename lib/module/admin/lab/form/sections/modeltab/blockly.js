import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Utils from "core/util/utils";

import SelectField from "core/component/selectfield/field";
import ProxyField from "core/component/proxyfield/field";
import BlocklyParameterField from "./blocklyparameter";
import BlocklyConfigs from "euglena/model_blockly/bodyConfigurations/bodyconfigs/listofconfigs";
import SymSelectField from "core/component/symselectfield/field";

class BlocklyConfigFields extends FieldGroup {
  constructor(conf) {
    let configOptions = {};
    for (let k in BlocklyConfigs) {
      configOptions[k] = BlocklyConfigs[k].id
    }
    let modelRep = SelectField.create({
      id: 'modelRepresentation',
      label: 'Model Representation',
      options: {
        functional: 'Functional',
        mechanistic: 'Mechanistic'
      }
    });
    conf.modelData.fields = (conf.modelData.fields || []).concat([
      modelRep,
      SelectField.create({
        id: 'allowedConfigs',
        label: 'Allowed Configurations',
        multiple: true,
        options: configOptions
      }),
      ProxyField.create({
        id: 'motion',
        proxyControl: modelRep,
        fields: [BlocklyParameterField.create({
          id: 'mechanistic',
          label: 'Motion',
          valueField: SelectField.create({
            id: 'configurable',
            label: 'Set Value',
            options: {
              'motion_flap_0': 'flapping',
              'motion_twist_100': 'twisting'
            }
          })
        })]
      }),
      ProxyField.create({
        id: 'omega',
        proxyControl: modelRep,
        fields: [BlocklyParameterField.create({
          id: 'functional',
          label: 'Ω',
          valueField: SymSelectField.create({
            inverse_order: true,
            varOptions: {'variation_0': 'no', 'variation_10': 'small', 'variation_25': 'medium', 'variation_50': 'large'},
            maxValue: conf.modelData.maxValue || 1,
            options: {
              'roll_100': '100%',
              'roll_75': '75%',
              'roll_50': '50%',
              'roll_25': '25%'
            }
          })
        })]
      }),
      BlocklyParameterField.create({
        id: 'v',
        label: "V",
        valueField: SymSelectField.create({
          inverse_order: true,
          varOptions: {'variation_0': 'no', 'variation_10': 'small', 'variation_25': 'medium', 'variation_50': 'large'},
          maxValue: conf.modelData.maxValue || 1,
          options: {
            'roll_100': '100%',
            'roll_75': '75%',
            'roll_50': '50%',
            'roll_25': '25%'
          }
        })
      }),
      BlocklyParameterField.create({
        id: 'k',
        label: "K",
        valueField: SymSelectField.create({
          inverse_order: true,
          varOptions: {'variation_0': 'no', 'variation_10': 'small', 'variation_25': 'medium', 'variation_50': 'large'},
          maxValue: conf.modelData.maxValue || 1,
          options: {
            'reaction_100': '100%',
            'reaction_75': '75%',
            'reaction_50': '50%',
            'reaction_25': '25%'
          }
        })
      }),
      BlocklyParameterField.create({
        id: 'opacity',
        label: "Opacity",
        valueField: SymSelectField.create({
          inverse_order: true,
          varOptions: {'variation_0': 'no', 'variation_10': 'small', 'variation_25': 'medium', 'variation_50': 'large'},
          maxValue: conf.modelData.maxValue || 1,
          options: {
            'opacity_100': '100%',
            'opacity_75': '75%',
            'opacity_50': '50%',
            'opacity_25': '25%',
            'opacity_0': '0%'
          }
        })
      })
    ])
    super(conf);
  }
}

BlocklyConfigFields.create = (data) => {
  return new BlocklyConfigFields({ modelData: data });
}

export default BlocklyConfigFields;