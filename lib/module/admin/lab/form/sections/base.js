import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Globals from "core/model/globals";
import Utils from "core/util/utils";

import TextField from "core/component/textfield/field";
import BooleanField from "core/component/booleanfield/field";
import HiddenField from "core/component/hiddenfield/field";

class BaseFields extends FieldGroup {
  constructor(conf) {
    let owner = Globals.get('EditLabConfig.user');
    let urlBase = `${window.location.origin}/lab/${owner.domain ? owner.domain : owner.uuid}/`;

    super({
      modelData: {
        id: "base",
        label: "Base",
        fields: [
          HiddenField.create({
            id: 'id'
          }),
          HiddenField.create({
            id: 'uuid'
          }),
          TextField.create({
            id: 'title',
            label: 'Title',
            required: true
          }),
          TextField.create({
            id: 'path',
            label: "URL",
            prefix: urlBase,
            help: `<small>You can change the base URL for all of your labs in your <a href="/admin/account/change-domain">Account settings</a>.</small>`,
            required: true,
            validation: {
              custom: {
                errorMessage: 'You have already used this URL',
                fn: (val, spec) => {
                  return Utils.promiseAjax(`/admin/lab/check-path`, {
                    data: {
                      path: val
                    },
                    dataType: 'json'
                  }).then((d) => {
                    console.log(d, d.isAvailable, this.value().id);
                    return d.isAvailable || d.usedBy == this.value().id;
                  })
                }
              }
            }
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