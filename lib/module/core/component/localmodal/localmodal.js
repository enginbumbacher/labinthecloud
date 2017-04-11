define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view');

  require('link!./style.css');

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
  return LocalModal;
})