import Module from "core/app/module";
import Globals from "core/model/globals";
import Utils from "core/util/utils";

import Form from "./form";

export default class LabFormModule extends Module {
  constructor() {
    super();
    Utils.bindMethods(this, ['_onSubmit'])
  }

  init() {
    this._form = Form.create();
    this._form.view().addEventListener('LabEdit.Submit', this._onSubmit);
  }

  run() {
    Globals.get('App.view').addChild(this._form.view());
    let savedData = Globals.get('AppConfig.data')
    if (savedData) {
      let parsed = Utils.ensureDefaults(savedData.config, {});
      parsed.base = {
        id: savedData.id,
        title: savedData.title,
        path: savedData.path,
        useExperiment: Utils.exists(parsed.experiment),
        useModel: Utils.exists(parsed.model),
        useVisualization: Utils.exists(parsed.visualization),
        useAggregate: Utils.exists(parsed.aggregate)
      }
      this._form.import(parsed);
    }
  }

  _onSubmit(evt) {
    let formData = this._form.export();
    this._form.disable();
    let saveData = Utils.ensureDefaults(formData.base, {});
    delete formData.base;
    if (!saveData.useExperiment) {
      delete formData.experiment;
    }
    if (!saveData.useModel) {
      delete formData.model;
    }
    if (!saveData.useVisualization) {
      delete formData.visualization;
    }
    if (!saveData.useAggregate) {
      delete formData.aggregate;
    }
    delete saveData.useExperiment;
    delete saveData.useModel;
    delete saveData.useVisualization;
    delete saveData.useAggregate;
    saveData.config = formData;

    let prom = null;
    if (saveData.id) {
      prom = Utils.promiseAjax(`/api/v1/Labs/${saveData.id}`, {
        method: 'PATCH',
        data: JSON.stringify(saveData),
        contentType: 'application/json'
      })
    } else {
      delete saveData.id;
      prom = Utils.promiseAjax('/api/v1/Labs', {
        method: 'POST',
        data: JSON.stringify(saveData),
        contentType: 'application/json'
      })
    }
    prom.then((data) => {
      if (saveData.id) {
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: 'lab_save_success',
          type: 'success',
          message: 'Lab Saved',
          autoExpire: 10
        });
        this._form.enable();
      } else {
        window.location = '/admin/labs';
      }
    }, (err) => {
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: 'lab_save_success',
          type: 'error',
          message: `There was an error trying to save the lab:<pre>${err}</pre>`
        });
    })
  }
}