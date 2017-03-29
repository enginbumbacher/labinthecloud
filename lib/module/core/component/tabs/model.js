define((require) => {
  const BaseModel = require('core/model/model'),
    Utils = require('core/util/utils'),

    defaults = {
      currentIndex: null,
      tabs: []
    };

  return class TabsModel extends BaseModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    addTab(tab) {
      const tabs = this.get('tabs');
      tabs.push(tab);
      this.set('tabs', tabs);

      if (tabs.length == 1) {
        this.selectTab(tab.id());
      }
    }

    removeTab(id) {
      const tabs = this.get('tabs');
      const tab = tabs.filter((tab) => { return tab.id == id; })
      if (tab.length == 0) throw new Error(`Cannot remove tab with ID ${id}; tab not found.`);
      let ind = tabs.indexOf(tab[0]);
      tabs.splice(ind, 1);
      this.set('tabs', tabs);

      if (tabs.length == 0) {
        this.set('currentIndex', 0);
        return;
      }
      if (this.get('currentIndex') >= ind) {
        if (ind >= tabs.length) ind -= 1;
        this.selectTab(tabs[ind].id());
      }
    }

    selectTab(id) {
      let currTabInd = 0
      this.get('tabs').forEach((tab, ind) => {
        tab.select(tab.id() == id);
        if (tab.id() == id) currTabInd = ind;
      });
      this.set('currentIndex', currTabInd)
    }

    currentTab() {
      if (this.get('currentIndex') < this.get('tabs').length) {
        return this.get('tabs')[this.get('currentIndex')];
      } else {
        return null;
      }
    }
  }
})