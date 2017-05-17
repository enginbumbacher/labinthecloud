define((require) => {
  const HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals');

  return class Logger extends EventDispatcher {
    constructor() {
      super();
    }

    log(conf) {
      if (!conf.type) return Promise.reject("Logs require a type property");
      
      return Utils.promiseAjax('/api/v1/Log', {
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