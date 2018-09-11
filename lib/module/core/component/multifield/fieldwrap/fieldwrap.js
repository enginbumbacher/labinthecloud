import DragItem from 'core/component/dragdrop/dragitem/dragitem';
import ContentView from './view';

export default class FieldWrap extends DragItem {
  constructor(settings = {}) {
    settings.modelData = settings.modelData || {};
    settings.modelData.contents = new ContentView({
      field: settings.modelData.field,
      classes: settings.modelData.classes
    });
    settings.modelData.id = settings.modelData.id || settings.modelData.field.id();
    super(settings);
  }

  id() {
    this._model.get('field').id()
  }

  lock() {
    this._model.get('contents').lock()
  }

  unlock() {
    this._model.get('contents').unlock()
  }

  fieldView() {
    this._model.get('contents').subview
  }

  hideRemoveButton() {
    this._model.get('contents').hideRemoveButton()
  }

  showRemoveButton() {
    this._model.get('contents').showRemoveButton()
  }
};
