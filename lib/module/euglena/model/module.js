define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const Module = require('core/app/module'),
    ModelTab = require('./tab/tab'),
    ThreeView = require('./threeview');

  require('link!./style.css');

  return class ModelModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, [
        '_hookInteractiveTabs',
        '_hook3dView',
        '_onExperimentCountChange',
        '_onAutomaticSimulate'
      ]);
      this._tabs = [];
      this.threeView = new ThreeView();
    }

    init() {
      if (Globals.get('AppConfig.model') && Globals.get('AppConfig.model.tabs.length')) {
        Globals.get('AppConfig.model.tabs').forEach((tabConf, ind) => {
          tabConf.id = Globals.get('AppConfig.model.tabs.length')==1 ? '' : String.fromCharCode(97 + ind);
          tabConf.euglenaCount = Globals.get('AppConfig.model.euglenaCount');
          tabConf.euglenaInit = Globals.get('AppConfig.model.euglenaInit');
          tabConf.simulationFps = Globals.get('AppConfig.model.simulationFps');
          let tab = ModelTab.create(tabConf)
          this._tabs.push(tab);
          Globals.set(`ModelTab.${tab.id()}`, tab);
        })
        HM.hook('InteractiveTabs.ListTabs', this._hookInteractiveTabs, 1);
        Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange);
        Globals.get('Relay').addEventListener('Model.AutomaticSimulate', this._onAutomaticSimulate);

      }
      return super.init();
    }

    _hookInteractiveTabs(list, meta) {
      this._tabs.forEach((tab, ind) => {
        list.push({
          id: `model_${tab.id()}`,
          tabType:tab._model._data.modelType,
          title: `Model ${tab.id().toUpperCase()}`,
          content: tab.view()
        });
      })
      return list;
    }

    _hook3dView(view, meta) {
      if (!view) {
        return this.threeView.clone();
      }
      return view;
    }

    _onExperimentCountChange(evt) {
      if (evt.data.count && !evt.data.old) {
        this._tabs.forEach((tab) => {
          Globals.get('Relay').dispatchEvent('InteractiveTabs.EnableRequest', {
            tabId: `model_${tab.id()}`
          })
        })
      } else if (!evt.data.count) {
        this._tabs.forEach((tab) => {
          Globals.get('Relay').dispatchEvent('InteractiveTabs.DisableRequest', {
            tabId: `model_${tab.id()}`
          })
        })
      }
    }

    _onAutomaticSimulate(evt) {
      this._tabs.find(x => x.id() == evt.data.tabId)._onSimulateRequest(evt)
    }
  }
})
