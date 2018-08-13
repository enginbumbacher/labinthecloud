import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import DomView from 'core/view/dom_view';
const Template = '<div class="notification__center"></div>';

export default class NotificationCenterView extends DomView {
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
