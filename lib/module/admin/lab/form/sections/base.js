import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Globals from "core/model/globals";

import TextField from "core/component/textfield/field";
import BooleanField from "core/component/booleanfield/field";
import HiddenField from "core/component/hiddenfield/field";

class BaseFields extends FieldGroup {
  constructor(conf) {
    let owner = Globals.get('AppConfig.user');
    let urlBase = `${window.location.origin}/lab/${owner.domain ? owner.domain : owner.uuid}/`;

    super({
      modelData: {
        id: "base",
        label: "Base",
        fields: [
          HiddenField.create({
            id: 'id'
          }),
          TextField.create({
            id: 'title',
            label: 'Title'
          }),
          TextField.create({
            id: 'path',
            label: "URL",
            prefix: urlBase,
            help: `<small>You can change the base URL for all of your labs in your <a href="/admin/account/change-domain">Account settings</a>.</small>`
          }),
          BooleanField.create({
            id: 'useExperiment',
            label: 'Use Experiments',
            defaultValue: true
          }),
          BooleanField.create({
            id: 'useModel',
            label: 'Use Modeling',
            defaultValue: true
          }),
          BooleanField.create({
            id: 'useVisualization',
            label: 'Use Data Visualizations',
            defaultValue: true
          }),
          BooleanField.create({
            id: 'useAggregate',
            label: 'Use Aggregate Tab',
            defaultValue: true
          })
        ]
      }
    })
  }
}

BaseFields.create = (data = {}) => {
  return new BaseFields({ modelData: data })
}

export default BaseFields;