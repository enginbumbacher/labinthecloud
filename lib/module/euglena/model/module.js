import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Module from 'core/app/module';
import ModelTab from './tab/tab';
import ThreeView from './threeview';
import './style.scss';

export default class ModelModule extends Module {
  constructor(ctx) {
    super(ctx);
    Utils.bindMethods(this, [
      '_hookInteractiveTabs',
      '_hook3dView',
      '_onExperimentCountChange',
      '_onAutomaticSimulate',
      '_hookTriggerModelSave',
      '_hookCurrentModel'
    ]);
    this._tabs = [];
    this.threeView = new ThreeView();
  }

  init() {
    if (Globals.get('AppConfig.model') && Globals.get('AppConfig.model.tabs.length')) {
      Globals.get('AppConfig.model.tabs').forEach((tabConf, ind) => {
        tabConf.id = String.fromCharCode(97 + ind);
        tabConf.euglenaCount = Globals.get('AppConfig.model.euglenaCount');
        tabConf.euglenaInit = Globals.get('AppConfig.model.euglenaInit');
        tabConf.simulationFps = Globals.get('AppConfig.model.simulationFps');
        let tab = ModelTab.create(tabConf)
        this._tabs.push(tab);
        Globals.set(`ModelTab.${tab.id()}`, tab);
      })
      HM.hook('InteractiveTabs.ListTabs', this._hookInteractiveTabs, 1);
      HM.hook(`${this.context.app}.CurrentModel`, this._hookCurrentModel);
      HM.hook(`${this.context.app}.TriggerModelSave`, this._hookTriggerModelSave);
      Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange);
      Globals.get('Relay').addEventListener('Model.AutomaticSimulate', this._onAutomaticSimulate);
    }
    return super.init();
  }

  _hookInteractiveTabs(list, meta) {
    this._tabs.forEach((tab, ind) => {
      list.push({
        id: `model_${tab.id()}`,
        type: tab.type(),
        title: `Model ${this._tabs.length > 1 ? tab.id().toUpperCase() : ''}`,
        content: tab.view(),
        app: this.context.app
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

  _hookCurrentModel(subj, meta) {
    return Globals.get(`ModelTab.${meta.tabId}`).currModel();
  }

  _hookTriggerModelSave(subj, meta) {
    return Globals.get(`ModelTab.${meta.tabId}`).triggerSave();
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

  destroy() {
    HM.unhook('InteractiveTabs.ListTabs', this._hookInteractiveTabs);
    HM.unhook(`${this.context.app}.CurrentModel`, this._hookCurrentModel);
    Globals.get('Relay').removeEventListener('ExperimentCount.Change', this._onExperimentCountChange);
    Globals.get('Relay').removeEventListener('Model.AutomaticSimulate', this._onAutomaticSimulate);
    Globals.set('ModelTab', null);
    return Promise.all(this._tabs.map((t) => t.destroy()).concat(super.destroy()))
  }
}
