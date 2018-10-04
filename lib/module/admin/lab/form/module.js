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
    Utils.bindMethods(this, ['_onSubmit', '_onDelete', '_onPreview', '_onPreviewCloseRequest'])
  }

  init() {
    this._form = Form.create();
    this._form.view().addEventListener('LabEdit.Submit', this._onSubmit);
    this._form.view().addEventListener('LabEdit.Delete', this._onDelete);
    this._form.view().addEventListener('LabEdit.Preview', this._onPreview);

    this._modal = LocalModal.create({})
    this._previewContainer = new PreviewContainer();
    this._previewContainer.addEventListener('Preview.CloseRequest', this._onPreviewCloseRequest)
  }

  _onPreviewCloseRequest(evt) {
    this._modal.hide().then(() => {
      this._preview.destroy();
      delete this._preview;
    });
  }

  run() {
    Globals.get(`${this.context.app}.App.view`).addChild(this._form.view());
    let savedData = Globals.get('EditLabConfig.data')
    if (savedData.id) {
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
    let saveData = this._prepareFormExport(formData);
    this._form.disable();

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

  _onPreview(evt) {
    let cleanup = Promise.resolve(true);
    let first = true;
    if (this._preview) {
      first = false;
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
}