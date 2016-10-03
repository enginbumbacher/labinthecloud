define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    defaults = {
      bounds: 'body',
      dragItems: {},
      dropSites: {},
      proxyView: null,
      allowMultiSelect: false,
      selected: null
    };

  return class DragDropManagerModel extends Model {
    constructor(config = {}) {
      config.data = config.data || {};
      config.data.selected = config.data.selected || new Set();
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    addDropSite(drop) {
      this.set(`dropSites.${drop.id()}`, drop);
    }

    removeDropsite(drop) {
      if (this.get('selected').has(drag)) {
        this._deselect(drag);
      }
      this.set(`dropSites.${drop.id()}`, null);
    }

    addDragItem(drag) {
      this.set(`dragItems.${drag.id()}`, drag);
    }

    removeDragItem(drag) {
      this.set(`dragItems.${drag.id()}`, null);
    }

    select(drag) {
      this.clearSelection();
      this._select(drag);
    }

    _select(drag) {
      this.get('selected').add(drag);
      drag.select();
    }

    _deselect(drag) {
      this.get('selected').remove(drag);
      drag.deselect()
    }

    multiselect(drag) {
      if (this.get('allowMultiSelect')) {
        if (this.get('selected').contains(drag)) {
          this._deselect(drag);
        } else {
          this._select(drag);
        }
      } else {
        this.select(drag);
      }
    }

    clearSelection() {
      this.get('selected').forEach((item) => {
        item.deselect();
      })
      this.get('selected').clear();
    }
  };
});