define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    defaults = {
      id: 0,
      items: [],
      sortable: true,
      overlapType: "mouse",
      style: "list"
    };

  return class DropSiteModel extends Model {
    constructor(config = {}) {
      config.data = Utils.ensureDefaults(config.data, { id: Utils.guid4() })
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    receive(dragItems, index) {
      let items = this.get('items');
      for (let item of dragItems) {
        if (item.container()) {
          if (Utils.exists(index) && this.get('items').indexOf(item) < index) {
            index = Math.max(0, index - 1);
          }
          item.container().remove(item);
        }
      }

      if (Utils.exists(index) && this.get('sortable')) {
        let args = dragItems.slice(0);
        args.unshift(index, 0);
        Array.prototype.splice.apply(items, args);
      } else {
        items = items.concat(dragItems);
      }
      this.set('items', items);
      this.dispatchEvent('DropSite.ItemAdded', {
        items: dragItems,
        index: index
      });
    }

    remove(dragItem) {
      let items = this.get('items');
      if (items.indexOf(dragItem) != -1) {
        items.splice(items.indexOf(dragItem), 1)
        this.set('items', items)
        this.dispatchEvent('DropSite.ItemRemoved', {
          item: dragItem
        });
      }
    }

    empty() {
      while (this.get('items').length) {
        this.remove(this.get('items')[0])
      }
    }

    count() {
      return this.get('items').length;
    }

    export() {
      return this.get('items').map((item) => item.export());
    }

    contains(dragItem) {
      return this.get('items').includes(dragItem);
    }
  };
});