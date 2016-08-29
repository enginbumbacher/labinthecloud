define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils');

  return class DropSite extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
    }

    id() {
      return this._model.get('id');
    }

    accepts(dropItem) {
      return true;
    }

    receive(dropItems, position) {
      if (!Utils.isArray(dropItems)) {
        dropItems = [dropItems];
      }
      let workItems = dropItems;
      if (!this._model.get('sortable')) {
        workItems = dropItems.filter((item) => !this.contains(item));
      }
      this._model.receive(workItems, position);
      for (let item of dropItems) {
        item.handleReception(this);
      }
      this._view.clearCursor();
    }

    remove(dropItem) {
      this._model.remove(dropItem);
    }

    empty() {
      this._model.empty()
    }

    checkOverlap(proxy, mousePos) {
      if (this._view.checkOverlap(proxy, mousePos, this._model)) {
        let position = this._view.sortPosition(proxy, mousePos, this._model)
        this.dispatchEvent('DropSite.NominateDropCandidate', {
          position: position
        });
      } else {
        this.dispatchEvent('DropSite.RevokeDropCandidacy', {});
      }
    }

    handleCandidacy(position) {
      this._view.handleCandidacy(position);
    }

    handleLostCandidacy() {
      this._view.clearCursor();
    }

    count() {
      return this._model.get('items').length;
    }
    
    items() {
      return this._model.get('items');
    }

    export() {
      return this._model.export();
    }

    contains(dragItem) {
      return this._model.contains(dragItem);
    }
  };
});