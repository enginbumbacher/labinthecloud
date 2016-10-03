define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

  return class DragItem extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_passEvent'])

      this._view.addEventListener('DragItem.RequestSelect', this._passEvent);
      this._view.addEventListener('DragItem.RequestMultiSelect', this._passEvent);
      this._view.addEventListener('DragItem.RequestDrag', this._passEvent);
    }

    id() {
      return this._model.get('id')
    }

    select() {
      this._model.set('selected', true);
    }

    deselect() {
      this._model.set('selected', false);
    }

    _passEvent(evt) {
      this.dispatchEvent(evt);
    }

    handleReception(dropSite) {
      this._model.set('container', dropSite);
    }

    handleDrag() {
      this._view.handleDrag();
    }

    endDrag() {
      this._view.endDrag();
    }

    container() {
      return this._model.get('container');
    }

    export() {
      return this._model.get('id');
    }
  };  
});