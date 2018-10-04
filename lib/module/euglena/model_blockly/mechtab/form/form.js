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
        fields = fields.concat([SliderField.create({
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
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
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
      }
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
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
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
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
      }
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
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
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
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
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
    }

    if (settings.modelData.config.turnAmount) {
      fields.push(SelectField.create({
        id: "turnAmount",
        inverse_order: true,
        standardizeFormat: true,
        color: settings.modelData.config.turnAmount.color ? settings.modelData.config.turnAmount.color : null,
        label: settings.modelData.config.turnAmount.label,
        value: settings.modelData.config.turnAmount.initialValue,
        min_width: settings.modelData.config.turnAmount.min_width,
        description: settings.modelData.config.turnAmount.description,
        region: settings.modelData.config.turnAmount.region ? settings.modelData.config.turnAmount.region : null,
        options: settings.modelData.config.turnAmount.options
      }))
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
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

      }
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
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
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
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
    } else {
      console.log('not needed')
      // Decide on what information to present here. Instead of passing a symselectfield, pass a
      // field that contains the information, but one cannot interact with.
    }

    settings.modelData.fields = fields;
    settings.modelData.classes = ["form__model"];
    super(settings);

    Utils.bindMethods(this, ['export', 'import'])
    this.parameterForm = settings.modelData.parameterForm;

  }

  export() {
    // REWRITE THIS FUNCTION
    //return HM.invoke('ModelForm.ModifyExport', super.export(), { type: this._model.get('modelType') });
    let expData = super.export();

    if (this.parameterForm === 'qualitative') {
      ['signalThresh','signalAdaptSpeed','reactionStrength'].forEach((key) => {
        if (Object.keys(expData).indexOf(key) > -1) {
          expData[`${key}_numeric`] = expData[key].numericValue;
          expData[`${key}_variation`] = expData[key].variation;
          expData[key] = expData[key].qualitativeValue;
        }
      })
    } else if (this.parameterForm === 'quantitative') {
      ['signalThresh','signalAdaptSpeed','reactionStrength'].forEach((key) => {
        if (Object.keys(expData).indexOf(key) > -1) {
          expData[`${key}_numeric`] = expData[key].base;
          expData[`${key}_variation`] = expData[key].delta;
          expData[key] = expData[key];
        }
      })
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
