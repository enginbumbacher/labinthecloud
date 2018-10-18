import DomView from 'core/view/dom_view';
import Utils from 'core/util/utils';
import Template from './container.html';

import Button from 'core/component/button/field'

export default class PreviewContainer extends DomView {
  constructor(tmpl) {
    super(Template);

    this._buttons = {
      close: Button.create({
        id: 'preview__close',
        label: 'Close',
        eventName: 'Preview.CloseRequest'
      }),
      cancel: Button.create({
        id: 'preview__cancel',
        label: 'Cancel',
        eventName: 'Preview.CloseRequest'
      }),
      save_experiments: Button.create({
        id: 'preview__save__experiments',
        label: 'Add Current Experiment to Presets',
        eventName: 'Preview.SaveExperimentRequest'
      }),
      save_model_a: Button.create({
        id: 'preview__save__model__a',
        label: 'Add Current Model A to Presets',
        eventName: 'Preview.SaveModelARequest'
      }),
      save_model_b: Button.create({
        id: 'preview__save__model__b',
        label: 'Add Current Model B to Presets',
        eventName: 'Preview.SaveModelBRequest'
      })
    }
  }

  clearButtons() {
    Object.values(this._buttons).forEach((btn) => {
      this.removeChild(btn.view());
    })
  }

  addButton(key) {
    this.addChild(this._buttons[key].view(), '.litc__modal__button-bar');
  }
}