define((require) => {
  const BaseField = require('core/component/form/field/field'),
    Model = require('./model'),
    View = require('./view');

  class TextField extends BaseField {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);
    }
  }

  TextField.create = (data) => {
    return new TextField({ modelData: data });
  }
  
  return TextField;
});