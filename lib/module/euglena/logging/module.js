import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import Module from 'core/app/module';
import Logger from './logger';

export default class LoggingModule extends Module {
  constructor() {
    super();
    this.logger = new Logger();
    Globals.set('Logger', this.logger);
  }
}
