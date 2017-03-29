define((require) => {
  const Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils');

  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view');
  
  class NotificationCenter extends Component {
    constructor(settings) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
    }

    addNote(note) {
      this._model.addNote(note);
    }

    removeNote(noteId) {
      this._model.removeNote(noteId);
    }

    clear() {
      this._model.clear();
    }
  }

  NotificationCenter.create = (data) => {
    return new NotificationCenter({ modelData: data });
  }

  return NotificationCenter;
})