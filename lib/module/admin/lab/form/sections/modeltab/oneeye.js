import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Utils from "core/util/utils";

import NEyeSliderConfig from "./neyesliderconfig";

class OneEyeConfigFields extends FieldGroup {
  constructor(conf) {
    conf.modelData.fields = conf.modelData.fields || [];
    conf.modelData.fields = conf.modelData.fields.concat([
      NEyeSliderConfig.create({
        id: 'K',
        label: 'K',
        showLabel: true,
        collapsible: true,
        symSlider: true,
        collapsed: true,
        defaultValues: {
          label: "Coupling",
          min: -2,
          max: 2,
          resolution: 0.01,
          initialValue: {
            base: 0,
            delta: 0.2
          }
        }
      }),
      NEyeSliderConfig.create({
        id: 'v',
        label: 'v',
        showLabel: true,
        collapsible: true,
        symSlider: true,
        collapsed: true,
        defaultValues: {
          label: "Forward Speed",
          min: 0,
          max: 10,
          resolution: 0.1,
          initialValue: {
            base: 5,
            delta: 2
          }
        }
      }),
      NEyeSliderConfig.create({
        id: 'omega',
        label: 'Ω',
        showLabel: true,
        collapsible: true,
        symSlider: true,
        collapsed: true,
        defaultValues: {
          label: "Roll Speed",
          min: -5,
          max: 5,
          resolution: 0.01,
          initialValue: {
            base: 1,
            delta: 0.2
          }
        }
      }),
      NEyeSliderConfig.create({
        id: 'randomness',
        label: 'Randomness',
        showLabel: true,
        collapsible: true,
        symSlider: false,
        collapsed: true,
        defaultValues: {
          label: "Randomness",
          min: 0,
          max: 1,
          resolution: 0.01,
          initialValue: 0.15
        }
      })
    ]);
    super(conf);
  }

}

OneEyeConfigFields.create = (data) => {
  return new OneEyeConfigFields({ modelData: data });
}

export default OneEyeConfigFields;