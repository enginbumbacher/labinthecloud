define((require) => {
  const HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals');

  const Module = require('core/app/module'),
    Logger = require('./logger');

  return class LoggingModule extends Module {
    constructor() {
      this.logger = new Logger();
      Globals.set('Logger', this.logger);
    }
  }
}