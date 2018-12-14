import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Form from 'core/component/form/form';
import Button from 'core/component/button/field';
import SelectField from 'core/component/selectfield/field';
import SymSelectField from 'core/component/symselectfield/field';
import SliderField from 'core/component/sliderfield/field';
import SymSliderField from 'core/component/symsliderfield/field';

class ModelForm extends Form {
  constructor(settings = {}) {
    var fields = []

    if (settings.modelData.config.signalThreshPosNeg) {
      if (settings.modelData.parameterForm === 'qualitative') {
        fields.push(SelectField.create({
          id: "signalThreshPosNeg",
          standardizeFormat: true,
          label: settings.modelData.config.signalThreshPosNeg.label,
          color: settings.modelData.config.signalThreshPosNeg.color ? settings.modelData.config.signalThreshPosNeg.color : null,
          value: settings.modelData.config.signalThreshPosNeg.initialValue,
          min_width: settings.modelData.config.signalThreshPosNeg.min_width,
          description: settings.modelData.config.signalThreshPosNeg.description,
          region: settings.modelData.config.signalThreshPosNeg.region ? settings.modelData.config.signalThreshPosNeg.region : null,
          options: settings.modelData.config.signalThreshPosNeg.options
        }))
      } else if (settings.modelData.parameterForm === 'quantitative') {
        fields = fields.concat([SymSliderField.create({
          id: "signalThreshPosNeg",
          label: settings.modelData.config.signalThreshPosNeg.label,
          color: settings.modelData.config.signalThreshPosNeg.color ? settings.modelData.config.signalThreshPosNeg.color : null,
          value: settings.modelData.config.signalThreshPosNeg.initialValue,
          description: settings.modelData.config.signalThreshPosNeg.description,
          region: settings.modelData.config.signalThreshPosNeg.region ? settings.modelData.config.signalThreshPosNeg.region : null,
          min: settings.modelData.config.signalThreshPosNeg.min,
          max: settings.modelData.config.signalThreshPosNeg.max,
          steps: settings.modelData.config.signalThreshPosNeg.steps,
        })])
      }
    }

    if (settings.modelData.config.signalThreshAllNone) {
      if (settings.modelData.parameterForm === 'qualitative') {
        fields.push(SelectField.create({
          id: "signalThreshAllNone",
          standardizeFormat: true,
          label: settings.modelData.config.signalThreshAllNone.label,
          color: settings.modelData.config.signalThreshAllNone.color ? settings.modelData.config.signalThreshAllNone.color : null,
          value: settings.modelData.config.signalThreshAllNone.initialValue,
          min_width: settings.modelData.config.signalThreshAllNone.min_width,
          description: settings.modelData.config.signalThreshAllNone.description,
          region: settings.modelData.config.signalThreshAllNone.region ? settings.modelData.config.signalThreshAllNone.region : null,
          options: settings.modelData.config.signalThreshAllNone.options
        }))
      } else if (settings.modelData.parameterForm === 'quantitative') {
        if (!settings.modelData.variationLimitation) {
          fields = fields.concat([SymSliderField.create({
            id: "signalThreshAllNone",
            label: settings.modelData.config.signalThreshAllNone.label,
            color: settings.modelData.config.signalThreshAllNone.color ? settings.modelData.config.signalThreshAllNone.color : null,
            value: settings.modelData.config.signalThreshAllNone.initialValue,
            description: settings.modelData.config.signalThreshAllNone.description,
            region: settings.modelData.config.signalThreshAllNone.region ? settings.modelData.config.signalThreshAllNone.region : null,
            min: settings.modelData.config.signalThreshAllNone.min,
            max: settings.modelData.config.signalThreshAllNone.max,
            steps: settings.modelData.config.signalThreshAllNone.steps,
          })])
        } else if (settings.modelData.variationLimitation.match('fixVar')) {
          fields = fields.concat([SliderField.create({
            id: "signalThreshAllNone",
            label: settings.modelData.config.signalThreshAllNone.label,
            color: settings.modelData.config.signalThreshAllNone.color ? settings.modelData.config.signalThreshAllNone.color : null,
            value: settings.modelData.config.signalThreshAllNone.initialValue,
            description: settings.modelData.config.signalThreshAllNone.description,
            region: settings.modelData.config.signalThreshAllNone.region ? settings.modelData.config.signalThreshAllNone.region : null,
            min: settings.modelData.config.signalThreshAllNone.min,
            max: settings.modelData.config.signalThreshAllNone.max,
            steps: settings.modelData.config.signalThreshAllNone.steps,
          })])
        }
      }
    }

    if (settings.modelData.config.signalThresh) {
      if (settings.modelData.parameterForm === 'qualitative') {
        fields.push(SymSelectField.create({
          id: "signalThresh",
          inverse_order: true,
          varOptions: settings.modelData.config.signalThresh.varOptions,
          label: settings.modelData.config.signalThresh.label,
          color: settings.modelData.config.signalThresh.color ? settings.modelData.config.signalThresh.color : null,
          value: settings.modelData.config.signalThresh.initialValue,
          maxValue: settings.modelData.config.signalThresh.maxValue,
          description: settings.modelData.config.signalThresh.description,
          region: settings.modelData.config.signalThresh.region ? settings.modelData.config.signalThresh.region : null,
          options: settings.modelData.config.signalThresh.options
        }))
      } else if (settings.modelData.parameterForm === 'quantitative') {
        if (!settings.modelData.variationLimitation) {
          fields = fields.concat([SymSliderField.create({
            id: "signalThresh",
            label: settings.modelData.config.signalThresh.label,
            color: settings.modelData.config.signalThresh.color ? settings.modelData.config.signalThresh.color : null,
            value: settings.modelData.config.signalThresh.initialValue,
            description: settings.modelData.config.signalThresh.description,
            region: settings.modelData.config.signalThresh.region ? settings.modelData.config.signalThresh.region : null,
            min: settings.modelData.config.signalThresh.min,
            max: settings.modelData.config.signalThresh.max,
            steps: settings.modelData.config.signalThresh.steps,
          })])
        } else if (settings.modelData.variationLimitation.match('fixVar')) {
          fields = fields.concat([SliderField.create({
            id: "signalThresh",
            label: settings.modelData.config.signalThresh.label,
            color: settings.modelData.config.signalThresh.color ? settings.modelData.config.signalThresh.color : null,
            value: settings.modelData.config.signalThresh.initialValue,
            description: settings.modelData.config.signalThresh.description,
            region: settings.modelData.config.signalThresh.region ? settings.modelData.config.signalThresh.region : null,
            min: settings.modelData.config.signalThresh.min,
            max: settings.modelData.config.signalThresh.max,
            steps: settings.modelData.config.signalThresh.steps,
          })])
        }
      }
    }

    if (settings.modelData.config.signalRelease) {
      fields.push(SelectField.create({
        id: "signalRelease",
        inverse_order: true,
        standardizeFormat: true,
        color: settings.modelData.config.signalRelease.color ? settings.modelData.config.signalRelease.color : null,
        label: settings.modelData.config.signalRelease.label,
        value: settings.modelData.config.signalRelease.initialValue,
        min_width: settings.modelData.config.signalRelease.min_width,
        description: settings.modelData.config.signalRelease.description,
        region: settings.modelData.config.signalRelease.region ? settings.modelData.config.signalRelease.region : null,
        options: settings.modelData.config.signalRelease.options
      }))
    }

    if (settings.modelData.config.signalAdapt) {
      fields.push(SelectField.create({
        id: "signalAdapt",
        inverse_order: true,
        standardizeFormat: true,
        color: settings.modelData.config.signalAdapt.color ? settings.modelData.config.signalAdapt.color : null,
        label: settings.modelData.config.signalAdapt.label,
        value: settings.modelData.config.signalAdapt.initialValue,
        min_width: settings.modelData.config.signalAdapt.min_width,
        description: settings.modelData.config.signalAdapt.description,
        region: settings.modelData.config.signalAdapt.region ? settings.modelData.config.signalAdapt.region : null,
        options: settings.modelData.config.signalAdapt.options
      }))
    }

    if (settings.modelData.config.signalShockThresh) {
      if (settings.modelData.parameterForm === 'qualitative') {
        fields.push(SymSelectField.create({
          id: "signalShockThresh",
          inverse_order: true,
          varOptions: settings.modelData.config.signalShockThresh.varOptions,
          label: settings.modelData.config.signalShockThresh.label,
          color: settings.modelData.config.signalShockThresh.color ? settings.modelData.config.signalShockThresh.color : null,
          value: settings.modelData.config.signalShockThresh.initialValue,
          maxValue: settings.modelData.config.signalShockThresh.maxValue,
          description: settings.modelData.config.signalShockThresh.description,
          region: settings.modelData.config.signalShockThresh.region ? settings.modelData.config.signalShockThresh.region : null,
          options: settings.modelData.config.signalShockThresh.options
        }))
      } else if (settings.modelData.parameterForm === 'quantitative') {
        if (!settings.modelData.variationLimitation) {
          fields = fields.concat([SymSliderField.create({
            id: "signalShockThresh",
            label: settings.modelData.config.signalShockThresh.label,
            color: settings.modelData.config.signalShockThresh.color ? settings.modelData.config.signalShockThresh.color : null,
            value: settings.modelData.config.signalShockThresh.initialValue,
            description: settings.modelData.config.signalShockThresh.description,
            region: settings.modelData.config.signalShockThresh.region ? settings.modelData.config.signalShockThresh.region : null,
            min: settings.modelData.config.signalShockThresh.min,
            max: settings.modelData.config.signalShockThresh.max,
            steps: settings.modelData.config.signalShockThresh.steps,
          })])
        } else if (settings.modelData.variationLimitation.match('fixVar')) {
          fields = fields.concat([SliderField.create({
            id: "signalShockThresh",
            label: settings.modelData.config.signalShockThresh.label,
            color: settings.modelData.config.signalShockThresh.color ? settings.modelData.config.signalShockThresh.color : null,
            value: settings.modelData.config.signalShockThresh.initialValue,
            description: settings.modelData.config.signalShockThresh.description,
            region: settings.modelData.config.signalShockThresh.region ? settings.modelData.config.signalShockThresh.region : null,
            min: settings.modelData.config.signalShockThresh.min,
            max: settings.modelData.config.signalShockThresh.max,
            steps: settings.modelData.config.signalShockThresh.steps,
          })])
        }
      }
    }

    if (settings.modelData.config.signalAdaptSpeed) {
      if (settings.modelData.parameterForm === 'qualitative') {
        fields.push(SymSelectField.create({
          id: "signalAdaptSpeed",
          inverse_order: true,
          varOptions: settings.modelData.config.signalAdaptSpeed.varOptions,
          label: settings.modelData.config.signalAdaptSpeed.label,
          color: settings.modelData.config.signalAdaptSpeed.color ? settings.modelData.config.signalAdaptSpeed.color : null,
          value: settings.modelData.config.signalAdaptSpeed.initialValue,
          maxValue: settings.modelData.config.signalAdaptSpeed.maxValue,
          description: settings.modelData.config.signalAdaptSpeed.description,
          region: settings.modelData.config.signalAdaptSpeed.region ? settings.modelData.config.signalAdaptSpeed.region : null,
          options: settings.modelData.config.signalAdaptSpeed.options
        }))
      } else if (settings.modelData.parameterForm === 'quantitative') {
        if (!settings.modelData.variationLimitation) {
          fields = fields.concat([SymSliderField.create({
            id: "signalAdaptSpeed",
            label: settings.modelData.config.signalAdaptSpeed.label,
            color: settings.modelData.config.signalAdaptSpeed.color ? settings.modelData.config.signalAdaptSpeed.color : null,
            value: settings.modelData.config.signalAdaptSpeed.initialValue,
            description: settings.modelData.config.signalAdaptSpeed.description,
            region: settings.modelData.config.signalAdaptSpeed.region ? settings.modelData.config.signalAdaptSpeed.region : null,
            min: settings.modelData.config.signalAdaptSpeed.min,
            max: settings.modelData.config.signalAdaptSpeed.max,
            steps: settings.modelData.config.signalAdaptSpeed.steps,
          })])
        } else if (settings.modelData.variationLimitation.match('fixVar')) {
          fields = fields.concat([SliderField.create({
            id: "signalAdaptSpeed",
            label: settings.modelData.config.signalAdaptSpeed.label,
            color: settings.modelData.config.signalAdaptSpeed.color ? settings.modelData.config.signalAdaptSpeed.color : null,
            value: settings.modelData.config.signalAdaptSpeed.initialValue,
            description: settings.modelData.config.signalAdaptSpeed.description,
            region: settings.modelData.config.signalAdaptSpeed.region ? settings.modelData.config.signalAdaptSpeed.region : null,
            min: settings.modelData.config.signalAdaptSpeed.min,
            max: settings.modelData.config.signalAdaptSpeed.max,
            steps: settings.modelData.config.signalAdaptSpeed.steps,
          })])
        }
      }
    }

    if (settings.modelData.config.channelOpeningAmount) {
      fields.push(SelectField.create({
        id: "channelOpeningAmount",
        inverse_order: true,
        standardizeFormat: true,
        color: settings.modelData.config.channelOpeningAmount.color ? settings.modelData.config.channelOpeningAmount.color : null,
        label: settings.modelData.config.channelOpeningAmount.label,
        value: settings.modelData.config.channelOpeningAmount.initialValue,
        min_width: settings.modelData.config.channelOpeningAmount.min_width,
        description: settings.modelData.config.channelOpeningAmount.description,
        region: settings.modelData.config.channelOpeningAmount.region ? settings.modelData.config.channelOpeningAmount.region : null,
        options: settings.modelData.config.channelOpeningAmount.options
      }))
    }

    if (settings.modelData.config.signalRandom) {
      fields.push(SelectField.create({
        id: "signalRandom",
        inverse_order: true,
        standardizeFormat: true,
        color: settings.modelData.config.signalRandom.color ? settings.modelData.config.signalRandom.color : null,
        label: settings.modelData.config.signalRandom.label,
        value: settings.modelData.config.signalRandom.initialValue,
        min_width: settings.modelData.config.signalRandom.min_width,
        description: settings.modelData.config.signalRandom.description,
        region: settings.modelData.config.signalRandom.region ? settings.modelData.config.signalRandom.region : null,
        options: settings.modelData.config.signalRandom.options
      }))
    }

    if (settings.modelData.config.reactionStrength) {
      if (settings.modelData.parameterForm === 'qualitative') {
        fields.push(SymSelectField.create({
          id: "reactionStrength",
          inverse_order: true,
          varOptions: settings.modelData.config.reactionStrength.varOptions,
          label: settings.modelData.config.reactionStrength.label,
          color: settings.modelData.config.reactionStrength.color ? settings.modelData.config.reactionStrength.color : null,
          value: settings.modelData.config.reactionStrength.initialValue,
          maxValue: settings.modelData.config.reactionStrength.maxValue,
          description: settings.modelData.config.reactionStrength.description,
          region: settings.modelData.config.reactionStrength.region ? settings.modelData.config.reactionStrength.region : null,
          options: settings.modelData.config.reactionStrength.options
        }))
      } else if (settings.modelData.parameterForm === 'quantitative') {
        if (!settings.modelData.variationLimitation) {
          fields = fields.concat([SymSliderField.create({
            id: "reactionStrength",
            label: settings.modelData.config.reactionStrength.label,
            color: settings.modelData.config.reactionStrength.color ? settings.modelData.config.reactionStrength.color : null,
            value: settings.modelData.config.reactionStrength.initialValue,
            description: settings.modelData.config.reactionStrength.description,
            region: settings.modelData.config.reactionStrength.region ? settings.modelData.config.reactionStrength.region : null,
            min: settings.modelData.config.reactionStrength.min,
            max: settings.modelData.config.reactionStrength.max,
            steps: settings.modelData.config.reactionStrength.steps,
          })])
        } else if (settings.modelData.variationLimitation.match('fixVar')) {
          fields = fields.concat([SliderField.create({
            id: "reactionStrength",
            label: settings.modelData.config.reactionStrength.label,
            color: settings.modelData.config.reactionStrength.color ? settings.modelData.config.reactionStrength.color : null,
            value: settings.modelData.config.reactionStrength.initialValue,
            description: settings.modelData.config.reactionStrength.description,
            region: settings.modelData.config.reactionStrength.region ? settings.modelData.config.reactionStrength.region : null,
            min: settings.modelData.config.reactionStrength.min,
            max: settings.modelData.config.reactionStrength.max,
            steps: settings.modelData.config.reactionStrength.steps,
          })])
        }
      }
    }

    if (settings.modelData.config.turnForward) {
      fields.push(SelectField.create({
        id: "turnForward",
        inverse_order: true,
        standardizeFormat: true,
        color: settings.modelData.config.turnForward.color ? settings.modelData.config.turnForward.color : null,
        label: settings.modelData.config.turnForward.label,
        value: settings.modelData.config.turnForward.initialValue,
        min_width: settings.modelData.config.turnForward.min_width,
        description: settings.modelData.config.turnForward.description,
        region: settings.modelData.config.turnForward.region ? settings.modelData.config.turnForward.region : null,
        options: settings.modelData.config.turnForward.options
      }))
    }

    if (settings.modelData.config.turnStrength) {
      if (settings.modelData.parameterForm === 'qualitative') {
        fields.push(SymSelectField.create({
          id: "turnStrength",
          inverse_order: true,
          varOptions: settings.modelData.config.turnStrength.varOptions,
          label: settings.modelData.config.turnStrength.label,
          color: settings.modelData.config.turnStrength.color ? settings.modelData.config.turnStrength.color : null,
          value: settings.modelData.config.turnStrength.initialValue,
          maxValue: settings.modelData.config.turnStrength.maxValue,
          description: settings.modelData.config.turnStrength.description,
          region: settings.modelData.config.turnStrength.region ? settings.modelData.config.turnStrength.region : null,
          options: settings.modelData.config.turnStrength.options
        }))
      } else if (settings.modelData.parameterForm === 'quantitative') {
        if (!settings.modelData.variationLimitation) {
          fields = fields.concat([SymSliderField.create({
            id: "turnStrength",
            label: settings.modelData.config.turnStrength.label,
            color: settings.modelData.config.turnStrength.color ? settings.modelData.config.turnStrength.color : null,
            value: settings.modelData.config.turnStrength.initialValue,
            description: settings.modelData.config.turnStrength.description,
            region: settings.modelData.config.turnStrength.region ? settings.modelData.config.turnStrength.region : null,
            min: settings.modelData.config.turnStrength.min,
            max: settings.modelData.config.turnStrength.max,
            steps: settings.modelData.config.turnStrength.steps,
          })])
        } else if (settings.modelData.variationLimitation.match('fixVar')) {
          fields = fields.concat([SliderField.create({
            id: "turnStrength",
            label: settings.modelData.config.turnStrength.label,
            color: settings.modelData.config.turnStrength.color ? settings.modelData.config.turnStrength.color : null,
            value: settings.modelData.config.turnStrength.initialValue,
            description: settings.modelData.config.turnStrength.description,
            region: settings.modelData.config.turnStrength.region ? settings.modelData.config.turnStrength.region : null,
            min: settings.modelData.config.turnStrength.min,
            max: settings.modelData.config.turnStrength.max,
            steps: settings.modelData.config.turnStrength.steps,
          })])
        }
      }
    }

    if (settings.modelData.config.turnDirection) {
      fields.push(SelectField.create({
        id: "turnDirection",
        inverse_order: true,
        standardizeFormat: true,
        color: settings.modelData.config.turnDirection.color ? settings.modelData.config.turnDirection.color : null,
        label: settings.modelData.config.turnDirection.label,
        value: settings.modelData.config.turnDirection.initialValue,
        min_width: settings.modelData.config.turnDirection.min_width,
        description: settings.modelData.config.turnDirection.description,
        region: settings.modelData.config.turnDirection.region ? settings.modelData.config.turnDirection.region : null,
        options: settings.modelData.config.turnDirection.options
      }))
    }

    settings.modelData.fields = fields;
    settings.modelData.classes = ["form__model"];
    super(settings);

    Utils.bindMethods(this, ['export', 'import'])
    this.parameterForm = settings.modelData.parameterForm ? settings.modelData.parameterForm : null;

    this.variationLimitation = null;
    if (settings.modelData.variationLimitation) {
      var variation = parseInt(settings.modelData.variationLimitation.split('_')[1])
      this.variationLimitation = Number.isInteger(variation) ? variation : null;
    }

  }

  export() {
    // REWRITE THIS FUNCTION
    //return HM.invoke('ModelForm.ModifyExport', super.export(), { type: this._model.get('modelType') });
    let expData = super.export();

    if (this.parameterForm === 'qualitative') {
      ['signalThresh','signalAdaptSpeed','reactionStrength','turnStrength','signalShockThresh'].forEach((key) => {
        if (Object.keys(expData).indexOf(key) > -1) {
          expData[`${key}_numeric`] = expData[key].numericValue;
          expData[`${key}_variation`] = expData[key].variation;
          expData[key] = expData[key].qualitativeValue;
        }
      })
    } else if (this.parameterForm === 'quantitative') {
      if (!Number.isInteger(this.variationLimitation)) {
        ['signalThresh','signalThreshAllNone','signalAdaptSpeed','reactionStrength','turnStrength','signalShockThresh'].forEach((key) => {
          if (Object.keys(expData).indexOf(key) > -1) {
            expData[`${key}_numeric`] = expData[key].base;
            expData[`${key}_variation`] = expData[key].delta;
            expData[key] = expData[key];
          }
        })
      } else {
        ['signalThresh','signalThreshAllNone','signalAdaptSpeed','reactionStrength','turnStrength','signalShockThresh'].forEach((key) => {
          if (Object.keys(expData).indexOf(key) > -1) {
            expData[`${key}_numeric`] = expData[key];
            expData[`${key}_variation`] = expData[key] * this.variationLimitation / 100;
            expData[key] = {'base': expData[key], 'delta': expData[key] * this.variationLimitation / 100};
          }
        })
      }
    }

    return expData;
  }

  import(data, symFields = null) {
    if (symFields) {
      symFields.forEach((key) => {
        if (this.parameterForm === 'qualitative') {
          if (Object.keys(data).indexOf(key) > -1) {
            if (!(data[key].qualitativeValue)) {
              data[key] = {
                qualitativeValue: data[key],
                numericValue: data[`${key}_numeric`],
                variation: data[`${key}_variation`]
              };
              delete data[`${key}_numeric`];
              delete data[`${key}_variation`];
            }
          }
        } else if (this.parameterForm === 'quantitative') {
          if (!Number.isInteger(this.variationLimitation)) {
            if (Object.keys(data).indexOf(key) > -1) {
              if (!(data[key].delta)) {
                data[key] = {
                  base: data[`${key}_numeric`],
                  delta: data[`${key}_variation`]
                };
                delete data[`${key}_numeric`];
                delete data[`${key}_variation`];
              }
            }
          } else {
            if (Object.keys(data).indexOf(key) > -1) {
              data[key] = data[`${key}_numeric`],
              delete data[`${key}_numeric`];
              delete data[`${key}_variation`];
            }
          }
        }
      })

    }

    return super.import(data)
  }

}

ModelForm.create = (data) => {
  return new ModelForm({ modelData: data });
}

export default ModelForm;
