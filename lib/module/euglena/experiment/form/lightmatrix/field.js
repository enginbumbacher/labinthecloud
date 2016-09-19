define((require) => {
  const MultiField = require('core/component/multifield/field'),
    View = require('./view'),
    LightRow = require('../row/field'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),

    defaults = {
      childClass: LightRow,
      childSettings: {
        value: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          duration: 5
        }
      },
      min: 1,
      sortable: false,
      addButtonLabel: "+"
    }
  ;

  class LightMatrixField extends MultiField {
    constructor(config) {
      config.modelData = Utils.ensureDefaults(config.modelData, defaults);
      config.viewClass = config.viewClass || View;
      super(config);
      Utils.bindMethods(this, ['_onModelChange']);
    }

    _onModelChange(evt) {
      super._onModelChange(evt);
      var total = this.value().map((field) => field.duration ? field.duration : 0).reduce((prev, curr, currInd, arr) => prev + curr, 0);
      this.view().updateTotals(total, Globals.get('AppConfig.experimentLength') - total);
    }
  }

  LightMatrixField.create = (data) => {
    return new LightMatrixField({
      modelData: data
    });
  }
  return LightMatrixField;
})