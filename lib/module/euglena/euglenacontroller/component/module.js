import Module from 'core/app/module';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Manager from './manager';

export default class ComponentEuglenaControllerModule extends Module {
  constructor(ctx) {
    super(ctx);
    Utils.bindMethods(this, ['_hookEuglenaManager']);

    HM.hook('Euglena.Manager', this._hookEuglenaManager);
  }

  _hookEuglenaManager(spec) {
    Manager.setModelData(Globals.get('AppConfig.managers.component'));
    spec.candidates.push(Manager);
    spec.manager = Manager;
    return spec;
  }

  destroy() {
    HM.unhook('Euglena.Manager', this._hookEuglenaManager);
    return super.destroy();
  }
}
