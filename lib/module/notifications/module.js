define((require) => {
  const Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils');

  const Module = require('core/app/module'),
    NotificationCenter = require('./center/notificationcenter'),
    Note = require('./note/note');

  require('link!./style.css');

  return class NotificationsModule extends Module {
    constructor() {
      super()
      Utils.bindMethods(this, ['_onAddRequest', '_onRemoveRequest', '_onClearRequest'])
      this._center = NotificationCenter.create({});
    }

    init() {
      Globals.get('Relay').addEventListener('Notifications.Add', this._onAddRequest);
      Globals.get('Relay').addEventListener('Notifications.Remove', this._onRemoveRequest);
      Globals.get('Relay').addEventListener('Notifications.Clear', this._onClearRequest);
    }

    run() {
      Globals.get('App.view').addChild(this._center.view());
    }

    _onAddRequest(evt) {
      this._center.addNote(Note.create(evt.data));
    }

    _onRemoveRequest(evt) {
      this._center.removeNote(evt.data.noteId);
    }

    _onClearRequest(evt) {
      this._center.clear();
    }
  };
})