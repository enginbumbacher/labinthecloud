define((require) => {
  const BaseField = require('core/component/form/field/field'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils');

  class NumberField extends BaseField {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);
    }
  }

  NumberField.create = (data) => {
    return new NumberField({ modelData: data });
  };

  return NumberField;
});