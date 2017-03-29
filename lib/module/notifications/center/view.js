define((require) => {
  const Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils');

  const DomView = require('core/view/dom_view'),
    Template = '<div class="notification__center"></div>';

  return class NotificationCenterView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onNoteAdded', '_onNoteExpired'])

      model.addEventListener('NotificationCenter.NoteAdded', this._onNoteAdded);
      model.addEventListener('NotificationCenter.NoteExpired', this._onNoteExpired);
    }

    _onNoteAdded(evt) {
      this.addChild(evt.data.note.view(), null, 0);
    }

    _onNoteExpired(evt) {
      this.removeChild(evt.data.note.view());
    }
  }
  
})