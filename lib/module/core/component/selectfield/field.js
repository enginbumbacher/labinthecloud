define((require) => {
  const BaseField = require('core/component/form/field/field'),
    Model = require('./model'),
    View = require('./view');

  class SelectField extends BaseField {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);
    }
  }

  SelectField.create = (data) => {
    return new SelectField({ modelData: data });
  }
  
  return SelectField;
});