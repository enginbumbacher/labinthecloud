import Module from 'core/app/module';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Manager from './manager';

export default class ComponentEuglenaControllerModule extends Module {
  constructor() {
    super();

    HM.hook('Euglena.Manager', (spec) => {
      Manager.setModelData(Globals.get('AppConfig.managers.component'));
      spec.candidates.push(Manager);
      spec.manager = Manager;
      return spec;
    });
  }
}
