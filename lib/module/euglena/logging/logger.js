define((require) => {
  const HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals');

  const EventDispatcher = require('core/event/dispatcher');

  return class Logger extends EventDispatcher {
    constructor() {
      super();
    }

    log(conf) {
      if (!conf.type) return Promise.reject("Logs require a type property");
      if (!Globals.get('student_id')) return Promise.resolve(true) // let it go, but don't save the log

      return Utils.promiseAjax('/api/v1/Logs', {
        method: 'POST',
        data: JSON.stringify({
          type: conf.type,
          category: conf.category,
          data: conf.data,
          studentId: Globals.get('student_id')
        }),
        contentType: 'application/json'
      })
    }
  }
})