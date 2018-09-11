import Form from "core/component/form/form";
import Globals from "core/model/globals";

import Button from "core/component/button/field";
import FieldGroup from "core/component/fieldgroup/fieldgroup";
import NumberField from "core/component/numberfield/field";
import SelectField from "core/component/selectfield/field";
import BooleanField from "core/component/booleanfield/field";

import View from "./view";

class EditLabForm extends Form {
  constructor(conf) {
    conf.viewClass = conf.viewClass || View;
    conf.modelData = conf.modelData || {};
    conf.modelData.id = "edit-lab-form";
    conf.modelData.title = Globals.get('AppConfig.title');
    conf.modelData.fields = [
      FieldGroup.create({
        id: 'system',
        label: 'System',
        fields: [
          NumberField.create({
            id: 'maxLoginTime',
            label: 'Maximum Login Time',
            defaultValue: 0,
            help: 'Automatically logs a student out after this number of seconds. Set to 0 for no limit'
          }),
          SelectField.create({
            id: 'experimentModality',
            label: 'Experiment Modality',
            options: {
              create: 'Create',
              createAndHistory: 'Create & History',
              observe: 'Observe',
              explore: 'Explore'
            },
            defaultValue: 'explore'
          }),
          SelectField.create({
            id: 'modelModality',
            label: 'Model Modality',
            options: {
              observe: 'Observe',
              explore: 'Explore',
              create: 'Create'
            },
            defaultValue: 'explore'
          }),
          BooleanField.create({
            id: 'enableDirectComparison',
            label: 'Enable Direct Comparison',
            defaultValue: false,
            help: 'Check to allow direct comparison between models'
          })
        ]
      }),
      FieldGroup.create({
        id: 'experiment',
        label: 'Experimenting',
        fields: []
      }),
      FieldGroup.create({
        id: 'model',
        label: 'Modeling',
        fields: []
      }),
      FieldGroup.create({
        id: 'visualization',
        label: 'Data Visualization',
        fields: []
      })
    ];
    conf.modelData.buttons = [
      Button.create({
        id: 'submit',
        label: 'Submit',
        eventName: 'LabEdit.Submit'
      })
    ];
    super(conf);
    console.log(this._model._data);
  }
}

EditLabForm.create = (data = {}) => {
  return new EditLabForm({ modelData: data })
}

export default EditLabForm;