define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const Form = require('core/component/form/form'),
    Button = require('core/component/button/field'),
    SliderField = require('core/component/sliderfield/field');

  class ModelForm extends Form {
    constructor(settings = {}) {
      settings.modelData.fields = HM.invoke('ModelForm.Fields', [], {
        type: settings.modelData.modelType,
        config: settings.modelData.fieldConfig
      });
      settings.modelData.fields.push(SliderField.create({
        id: 'count',
        label: "Number of Euglena",
        min: settings.modelData.euglenaCountConfig.range[0],
        max: settings.modelData.euglenaCountConfig.range[1],
        steps: settings.modelData.euglenaCountConfig.range[1] - settings.modelData.euglenaCountConfig.range[0],
        defaultValue: settings.modelData.euglenaCountConfig.initialValue
      }))
      settings.modelData.buttons = [Button.create({
        id: 'simulate',
        label: 'Run Simulation',
        classes: ['form__model__simulate'],
        eventName: 'ModelForm.Simulate'
      }), Button.create({
        id: 'submit',
        label: 'Save',
        classes: ['form__model__submit'],
        eventName: 'ModelForm.Save'
      }), Button.create({
        id: 'new',
        label: 'New Model',
        classes: ['form__model__new'],
        eventName: 'ModelForm.NewRequest'
      }), Button.create({
        id: 'aggregate',
        label: 'Add Results to Aggregate',
        classes: ['form__model__aggregate'],
        eventName: 'ModelForm.AddToAggregate'
      })]
      settings.modelData.classes = ["form__model"]
      super(settings);
    }

    export() {
      return HM.invoke('ModelForm.ModifyExport', super.export(), { type: this._model.get('modelType') });
    }

    import(data) {
      return super.import(HM.invoke('ModelForm.ModifyImport', data, { type: this._model.get('modelType') }));
    }

    setState(state) {
      switch (state) {
        case "historical":
          this.getButton('submit').view().hide();
          this.getButton('simulate').view().hide();
          this.getButton('aggregate').view().show();
          this.getButton('new').view().show();
        break;
        case "new":
          this.getButton('submit').view().show();
          this.getButton('simulate').view().show();
          this.getButton('aggregate').view().hide();
          this.getButton('new').view().hide();
        break;
      }
    }
  }

  ModelForm.create = (data) => {
    return new ModelForm({ modelData: data });
  }

  return ModelForm;
})