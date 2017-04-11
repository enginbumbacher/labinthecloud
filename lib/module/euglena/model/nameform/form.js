define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const Form = require('core/component/form/form'),
    Button = require('core/component/button/field'),
    TextField = require('core/component/textfield/field');

  class ModelNameForm extends Form {
    constructor(settings = {}) {
      settings.modelData.title = settings.modelData.title || "Give your model a name";
      settings.modelData.classes = (settings.modelData.classes || []).concat(['form__model__name']);
      settings.modelData.fields = (settings.modelData.fields || []).concat([TextField.create({
        id: 'name',
        label: 'Name',
        required: true
      })])
      settings.modelData.buttons = (settings.modelData.buttons || []).concat([Button.create({
        id: 'cancel',
        eventName: 'ModelSave.Cancel',
        label: 'Cancel',
        classes: ['form__model__name__cancel']
      }), Button.create({
        id: 'submit',
        eventName: 'ModelSave.Submit',
        label: 'Save',
        classes: ['form__model__name__submit']
      })])
      super(settings);
    }
  }

  ModelNameForm.create = (data = {}) => {
    return new ModelNameForm({ modelData: data });
  }

  return ModelNameForm;
})