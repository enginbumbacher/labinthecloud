import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import BaseModel from 'core/model/model';
const defaults = {
  notes: []
};

export default class NotificationCenterModel extends BaseModel {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
    Utils.bindMethods(this, ['_onNoteExpiration'])
  }

  addNote(note) {
    note.addEventListener('Note.Expired', this._onNoteExpiration);
    const notes = this.get('notes');
    notes.push(note);
    this.set('notes', notes);
    this.dispatchEvent('NotificationCenter.NoteAdded', {
      note: note
    })
    setTimeout(() => {
      note.live();
    }, 1)
  }

  removeNote(noteId) {
    let note;
    for (let n of this.get('notes')) {
      if (n.id() == noteId) {
        note = n;
        break;
      }
    }
    if (note) {
      note.expire();
    }
  }

  clear() {
    this.get('notes').forEach((note) => {
      note.expire();
    })
  }

  _onNoteExpiration(evt) {
    const note = evt.currentTarget;
    note.removeEventListener('Note.Expired', this._onNoteExpiration);
    const notes = this.get('notes');
    notes.splice(notes.indexOf(note), 1);
    this.set('notes', notes);
    this.dispatchEvent('NotificationCenter.NoteExpired', {
      note: note
    })
  }
}  
