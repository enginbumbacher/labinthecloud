import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import Component from 'core/component/component';
import Model from './model';
import View from './view';

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

export default NotificationCenter;
