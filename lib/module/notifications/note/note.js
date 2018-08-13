import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import Component from 'core/component/component';
import Model from './model';
import View from './view';

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

export default NotificationNote;
