import Module from "core/app/module";
import Globals from "core/model/globals";
import Utils from "core/util/utils";

import Form from "./form";
import LocalModal from 'core/component/localmodal/localmodal';
import DomView from 'core/view/dom_view';
import LabApp from "euglena/app";
import $ from "jquery";
import PreviewContainer from "./preview/container"

export default class LabFormModule extends Module {
  constructor(ctx) {
    super(ctx);
    Utils.bindMethods(this, ['_onSubmit', '_onDelete', '_onPreview', '_onPreviewCloseRequest', '_onSandbox',
      '_onSaveExperimentRequest', '_onSaveModelARequest', '_onSaveModelBRequest'])
  }

  init() {
    this._form = Form.create();
    this._form.view().addEventListener('LabEdit.Submit', this._onSubmit);
    this._form.view().addEventListener('LabEdit.Delete', this._onDelete);
    this._form.view().addEventListener('LabEdit.Preview', this._onPreview);
    Globals.get('Relay').addEventListener('LabEdit.Sandbox', this._onSandbox);

    this._modal = LocalModal.create({})
    this._previewContainer = new PreviewContainer();
    this._previewContainer.addEventListener('Preview.CloseRequest', this._onPreviewCloseRequest)
    this._previewContainer.addEventListener('Preview.SaveExperimentRequest', this._onSaveExperimentRequest);
    this._previewContainer.addEventListener('Preview.SaveModelARequest', this._onSaveModelARequest);
    this._previewContainer.addEventListener('Preview.SaveModelBRequest', this._onSaveModelBRequest);
  }

  _onPreviewCloseRequest(evt) {
    console.log('close request', evt);
    this._modal.hide().then(() => {
      this._preview.destroy();
      delete this._preview;
      if (Globals.get('EditLabConfig.data.uuid')) {
        Utils.promiseAjax(`/api/v1/Labs/clearTemporaryData`, {
          method: 'POST',
          data: JSON.stringify({
            uuid: Globals.get('EditLabConfig.data.uuid')
          }),
          contentType: 'application/json'
        })
      }
    });
  }

  run() {
    Globals.get(`${this.context.app}.App.view`).addChild(this._form.view());
    let savedData = Globals.get('EditLabConfig.data')
    if (savedData.id) {
      let parsed = Utils.ensureDefaults(savedData.config, {});
      parsed.base = {
        id: savedData.id,
        uuid: savedData.uuid,
        title: savedData.title,
        path: savedData.path,
        useExperiment: Utils.exists(parsed.experiment),
        useModel: Utils.exists(parsed.model),
        useVisualization: Utils.exists(parsed.visualization),
        useAggregate: Utils.exists(parsed.aggregate)
      }
      this._form.import(parsed);
    } else if (savedData.uuid) {
      this._form.update({
        base: {
          uuid: savedData.uuid
        }
      });
    }
    $('body').append(this._modal.view().$dom());
  }

  _onSubmit(evt) {
    let saveData = this._prepareFormExport();
    this._form.disable();

    this._form.validate().then((validation) => {
      console.log(validation);
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
            app: this.context.app,
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
            app: this.context.app,
            id: 'lab_save_success',
            type: 'error',
            message: `There was an error trying to save the lab:<pre>${err}</pre>`
          });
      })
    }, (err) => {
      console.log(err);
      this._form.enable();
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        app: this.context.app,
        id: "lab_form_error",
        type: "error",
        message: err.validation.errors.join('<br/>'),
        autoExpire: 10,
        expireLabel: "Got it"
      })
    })
  }

  _prepareFormExport() {
    let formData = this._form.export();
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
    return saveData;
  }

  _onDelete(evt) {
    window.location = `/admin/lab/${Globals.get('EditLabConfig.data.id')}/delete`
  }

  _onSandbox(evt) {
    // console.log('SANDBOX', evt);
    // console.trace();
    let cleanup = Promise.resolve(true);
    if (this._preview) {
      cleanup = this._preview.destroy().then(() => {
        delete this._preview;
      });
    }
    cleanup.then(() => {
      let data = this._prepareFormExport();
      let conf = data.config;
      conf.system.userId = '_editor';
      conf.system.loggingDisabled = true;
      conf.lab = data.uuid;
      conf.system.experimentModality = "create";
      conf.system.modelModality = "create";
      if (conf.experiment.experimentHistory) {
        delete conf.experiment.experimentHistory;
      }
      window.EuglenaConfig = conf;
      this._previewContainer.clearButtons();
      this._previewContainer.addButton('close');
      if (conf.experiment) {
        this._previewContainer.addButton('save_experiments');
      }
      if (conf.model && conf.model.tabs) {
        conf.model.tabs.forEach((tab, ind) => {
          let char = String.fromCharCode(97 + ind);
          this._previewContainer.addButton(`save_model_${char}`);
        });
      }
      this._modal.display(this._previewContainer).then(() => {
        $('.lab-preview__container .loader').show()
        this._preview = new LabApp($('.lab-preview__container'));
        this._preview.load()
        .then( () => this._preview.init() )
        .then( () => this._preview.run() )
        .then( () => $('.lab-preview__container .loader').hide() );
      })
    })
  }

  _onPreview(evt) {
    let cleanup = Promise.resolve(true);
    if (this._preview) {
      cleanup = this._preview.destroy().then(() => {
        delete this._preview;
      });
    }
    cleanup.then(() => {
      let data = this._prepareFormExport();
      let conf = data.config;
      conf.system.userId = '_student';
      conf.system.loggingDisabled = true;
      conf.lab = data.uuid;
      window.EuglenaConfig = conf;
      this._previewContainer.clearButtons();
      this._previewContainer.addButton('close');
      this._modal.display(this._previewContainer).then(() => {
        $('.lab-preview__container .loader').show()
        this._preview = new LabApp($('.lab-preview__container'));
        this._preview.load()
        .then( () => this._preview.init() )
        .then( () => this._preview.run() )
        .then( () => $('.lab-preview__container .loader').hide() );
      })
    })
  }

  _onSaveExperimentRequest(evt) {
    let exp = this._preview.getExperiment();
    this._form.getField('experiment').addToHistory(exp);
    Globals.get('Relay').dispatchEvent('Notifications.Add', {
      app: this._preview.name(),
      id: 'experiment_preset_save',
      message: `Added experiment (${(new Date(exp.date_created)).toLocaleString()}) to experiment presets`,
      autoExpire: 10
    })
  }
  _onSaveModelARequest(evt) {
    let modelData = this._preview.getModel('a');
    if (!modelData) {
      return;
    }
    if (modelData.simulated) {
      this._preview.triggerModelSave('a').then(() => {
        let m = this._preview.getModel('a');
        this._form.getField('model').addToHistory(m, 0);
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          app: this._preview.name(),
          id: 'model_a_preset_save',
          message: `Added model (${m.name}) to Model A presets`,
          autoExpire: 10
        })
      }, (err) => {
        console.log(err);
      });
    } else {
      this._form.getField('model').addToHistory(modelData, 0);
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        app: this._preview.name(),
        id: 'model_a_preset_save',
        message: `Added model (${modelData.name}) to Model A presets`,
        autoExpire: 10
      })
    }
  }
  _onSaveModelBRequest(evt) {
    let modelData = this._preview.getModel('b');
    if (!modelData) {
      return;
    }
    if (modelData.simulated) {
      this._preview.triggerModelSave('b').then(() => {
        let m = this._preview.getModel('b');
        this._form.getField('model').addToHistory(m, 1);
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          app: this._preview.name(),
          id: 'model_b_preset_save',
          message: `Added model (${m.name}) to Model B presets`,
          autoExpire: 10
        })
      });
    } else {
      this._form.getField('model').addToHistory(modelData, 1);
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        app: this._preview.name(),
        id: 'model_b_preset_save',
        message: `Added model (${modelData.name}) to Model B presets`,
        autoExpire: 10
      })
    }
  }
}