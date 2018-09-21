import Form from "core/component/form/form";
import Globals from "core/model/globals";

import Button from "core/component/button/field";
import FieldGroup from "core/component/fieldgroup/fieldgroup";
import NumberField from "core/component/numberfield/field";
import SelectField from "core/component/selectfield/field";
import BooleanField from "core/component/booleanfield/field";

import BaseFields from "./sections/base";
import SystemFields from "./sections/system";
import ExperimentFields from "./sections/experiment";
import ModelFields from "./sections/model";
import VisualizationFields from "./sections/visualization";
import AggregateFields from "./sections/aggregate";

import View from "./view";

class EditLabForm extends Form {
  constructor(conf) {
    conf.viewClass = conf.viewClass || View;
    conf.modelData = conf.modelData || {};
    conf.modelData.id = "edit-lab-form";
    conf.modelData.title = Globals.get('AppConfig.title');
    conf.modelData.fields = [
      BaseFields.create(),
      SystemFields.create(),
      ExperimentFields.create(),
      ModelFields.create(),
      VisualizationFields.create(),
      AggregateFields.create()
    ];
    conf.modelData.buttons = [
      Button.create({
        id: 'submit',
        label: 'Submit',
        eventName: 'LabEdit.Submit'
      })
    ];
    super(conf);
  }

  _onFieldChanged(evt) {
    super._onFieldChanged(evt);
    let data = this.export();
    if (!data.base.useExperiment) {
      this.view().tabs.disableTab('experiment')
    } else {
      this.view().tabs.enableTab('experiment')
    }
    if (!data.base.useModel) {
      this.view().tabs.disableTab('model')
    } else {
      this.view().tabs.enableTab('model')
    }
    if (!data.base.useVisualization) {
      this.view().tabs.disableTab('visualization')
    } else {
      this.view().tabs.enableTab('visualization')
    }
    if (!data.base.useAggregate) {
      this.view().tabs.disableTab('aggregate')
    } else {
      this.view().tabs.enableTab('aggregate')
    }
  }
}

EditLabForm.create = (data = {}) => {
  return new EditLabForm({ modelData: data })
}

export default EditLabForm;