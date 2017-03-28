define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');
  
  const Form = require('core/component/form/form');

  class OneEyeForm extends Form {
    constructor(settings = {}, config) {
      settings.fields = [
      ]
      super(settings);
    }
  }

  OneEyeForm.create = (data = {}, config) => {
    return new OneEyeForm(data, config);
  }

  return OneEyeForm
})