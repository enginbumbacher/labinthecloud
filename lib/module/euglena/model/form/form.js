import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Form from 'core/component/form/form';
import Button from 'core/component/button/field';
import SelectField from 'core/component/selectfield/field';

class ModelForm extends Form {
  constructor(settings = {}) {
    settings.modelData.fields = HM.invoke('ModelForm.Fields', [], {
      type: settings.modelData.modelType,
      config: settings.modelData.fieldConfig
    });
    settings.modelData.fields.push(SelectField.create({
      id: 'count',
      label: "Number of Euglena:",
      value: settings.modelData.euglenaCountConfig.initialValue || null,
      classes: [],
      options: settings.modelData.euglenaCountConfig.options,
      description: 'Set the number of models to be simulated.'
    }))
    settings.modelData.fields.push(SelectField.create({
      id: 'initialization',
      label: "Initial Orientation of Euglena:",
      value: settings.modelData.euglenaInitConfig.initialValue,
      classes: [],
      options: settings.modelData.euglenaInitConfig.options,
      description: 'Set the initial orientation of models to be simulated.'
    }))
    settings.modelData.buttons = [Button.create({
      id: 'simulate',
      label: 'Run Model',
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

  modelType() {
    return this._model.get('modelType');
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
        switch (Globals.get('AppConfig.system.modelModality').toLowerCase()) {
          case "observe":
            this.getButton('submit').view().hide();
            this.getButton('simulate').view().show();
            this.getButton('aggregate').view().hide();
            this.getButton('new').view().hide();
          break;
          case "explore":
            this.getButton('submit').view().hide();
            this.getButton('simulate').view().show();
            this.getButton('aggregate').view().hide();
            this.getButton('new').view().hide();
          break;
          default:
            this.getButton('submit').view().hide();
            this.getButton('simulate').view().hide();
            if (Globals.get('AppConfig.aggregate')) {
              this.getButton('aggregate').view().show();
            } else {
              this.getButton('aggregate').view().hide();
            }
            this.getButton('new').view().show();
          break;
        }
      break;
      case "new":
        switch (Globals.get('AppConfig.system.modelModality').toLowerCase()) {
          case "observe":
            this.getButton('submit').view().hide();
            this.getButton('simulate').view().show();
            this.getButton('aggregate').view().hide();
            this.getButton('new').view().hide();

          break;
          case "explore":
            this.getButton('submit').view().hide();
            this.getButton('simulate').view().show();
            this.getButton('aggregate').view().hide();
            this.getButton('new').view().hide();
          break;
          default:
            this.getButton('submit').view().show();
            this.getButton('simulate').view().show();
            this.getButton('aggregate').view().hide();
            this.getButton('new').view().hide();
          break;
        }

        HM.invoke('ModelForm.StartCreate', this, {
          modality: Globals.get('AppConfig.system.modelModality'),
          fieldConfig: this._model.get('fieldConfig')
        });
        break;
    }
  }
}

ModelForm.create = (data) => {
  return new ModelForm({ modelData: data });
}

export default ModelForm;
