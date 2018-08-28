import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Form from 'core/component/form/form';
import Button from 'core/component/button/field';
import TextField from 'core/component/textfield/field';

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

export default ModelNameForm;
