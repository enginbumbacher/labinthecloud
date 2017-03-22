define((require) => {
  const Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils');

  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view');
  
  class NotificationNote extends Component {
    constructor(settings) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_onExpirationRequest', '_onExpired']);

      this.view().addEventListener('Note.ExpirationRequest', this._onExpirationRequest);
      this.view().addEventListener('Note.Expired', this._onExpired);
    }

    id() {
      return this._model.get('id');
    }

    live() {
      this._model.set('alive', true);
    }

    expire() {
      this.view().expire();
    }

    _onExpirationRequest(evt) {
      this._model.set('alive', false);
    }

    _onExpired(evt) {
      this.dispatchEvent(evt);
    }
  }

  NotificationNote.create = (data) => {
    return new NotificationNote({ modelData: data })
  }

  return NotificationNote;
})