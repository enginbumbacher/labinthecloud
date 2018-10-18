import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import Module from 'core/app/module';
import Logger from './logger';

export default class LoggingModule extends Module {
  constructor(ctx) {
    super(ctx);
    this.logger = new Logger();
    if (Globals.get('AppConfig.system.loggingDisabled')) this.logger.disable();
    Globals.set('Logger', this.logger);
  }

  destroy() {
    Globals.set('Logger', null);
    return super.destroy();
  }
}
