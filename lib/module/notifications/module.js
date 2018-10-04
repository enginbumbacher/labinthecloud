import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import Module from 'core/app/module';
import NotificationCenter from './center/notificationcenter';
import Note from './note/note';

import './style.scss';

export default class NotificationsModule extends Module {
  constructor(context) {
    super(context)
    Utils.bindMethods(this, ['_onAddRequest', '_onRemoveRequest', '_onClearRequest'])
    this._center = NotificationCenter.create({});
  }

  init() {
    Globals.get('Relay').addEventListener('Notifications.Add', this._onAddRequest);
    Globals.get('Relay').addEventListener('Notifications.Remove', this._onRemoveRequest);
    Globals.get('Relay').addEventListener('Notifications.Clear', this._onClearRequest);
  }

  run() {
    Globals.get(`${this.context.app}.App.view`).addChild(this._center.view());
  }

  _onAddRequest(evt) {
    if (evt.data.app == this.context.app)
      this._center.addNote(Note.create(evt.data));
  }

  _onRemoveRequest(evt) {
    if (evt.data.app == this.context.app)
      this._center.removeNote(evt.data.noteId);
  }

  _onClearRequest(evt) {
    if (evt.data.app == this.context.app)
      this._center.clear();
  }

  destroy() {
    Globals.get('Relay').removeEventListener('Notifications.Add', this._onAddRequest);
    Globals.get('Relay').removeEventListener('Notifications.Remove', this._onRemoveRequest);
    Globals.get('Relay').removeEventListener('Notifications.Clear', this._onClearRequest);
    return this._center.destroy();
  }
};
