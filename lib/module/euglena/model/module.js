define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const Module = require('core/app/module'),
    ModelTab = require('./tab/tab');

  require('link!./style.css');

  return class ModelModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, [
        '_hookInteractiveTabs'
      ]);
      this._tabs = [];
    }

    init() {
      if (Globals.get('AppConfig.model') && Globals.get('AppConfig.model.tabs.length')) {
        Globals.get('AppConfig.model.tabs').forEach((tabConf, ind) => {
          tabConf.id = String.fromCharCode(97 + ind);
          tabConf.euglenaCount = Globals.get('AppConfig.model.euglenaCount');
          tabConf.simulationFps = Globals.get('AppConfig.model.simulationFps');
          let tab = ModelTab.create(tabConf)
          this._tabs.push(tab);
        })
        HM.hook('InteractiveTabs.ListTabs', this._hookInteractiveTabs, 10);
      }
    }

    _hookInteractiveTabs(list, meta) {
      this._tabs.forEach((tab, ind) => {
        list.push({
          id: `model_${tab.id()}`,
          title: `Model ${tab.id().toUpperCase()}`,
          content: tab.view()
        });
      })
      return list;
    }
  }
})