import HM from 'core/event/hook_manager';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import EventDispatcher from 'core/event/dispatcher';

export default class Logger extends EventDispatcher {
  constructor() {
    super();
    this._active = true;
  }

  enable() {
    this._active = true;
  }

  disable() {
    this._active = false;
  }

  log(conf) {
    if (!this._active) return Promise.resolve(false);
    if (!conf.type) return Promise.reject("Logs require a type property");
    if (!(conf.studentId || Globals.get('student_id'))) return Promise.resolve(true) // let it go, but don't save the log

    return Utils.promiseAjax('/api/v1/Logs', {
      method: 'POST',
      data: JSON.stringify({
        type: conf.type,
        category: conf.category,
        data: conf.data,
        studentId: conf.studentId ? conf.studentId : Globals.get('student_id'),
        lab: Globals.get('AppConfig.lab')
      }),
      contentType: 'application/json'
    })
  }
}
