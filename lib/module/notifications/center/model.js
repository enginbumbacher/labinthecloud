define((require) => {
  const Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils');
  
  const BaseModel = require('core/model/model'),
    defaults = {
      notes: []
    };

  return class NotificationCenterModel extends BaseModel {
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
      for (let n in this.get('notes')) {
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
})