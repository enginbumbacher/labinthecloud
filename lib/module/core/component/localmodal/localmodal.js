import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Component from 'core/component/component';
import Model from './model';
import View from './view';

import './style.scss';

class LocalModal extends Component {
  constructor(settings = {}) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
  }

  display(content) {
    this.clear();
    this.push(content);
    return this.show();
  }

  push(content) {
    this._model.push(content)
  }

  pop() {
    this._model.pop()
  }

  clear() {
    this._model.clear()
  }

  show() {
    return new Promise((resolve, reject) => {
      this.view().addEventListener('LocalModal.ShowComplete', () => {
        this.view().removeAllListeners('LocalModal.ShowComplete');
        resolve(true);
      })
      this._model.set('display', true)
    })
  }

  hide() {
    return new Promise((resolve, reject) => {
      this.view().addEventListener('LocalModal.HideComplete', () => {
        this.view().removeAllListeners('LocalModal.HideComplete');
        resolve(true);
      })
      this._model.set('display', false)
    })
  }
}

LocalModal.create = (data) => {
  return new LocalModal({ modelData: data })
}
export default LocalModal;
