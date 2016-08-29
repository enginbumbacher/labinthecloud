define((require) => {
  const MultiField = require('core/component/multifield/field'),
    View = require('./view'),
    LightRow = require('../row/field'),
    Utils = require('core/util/utils'),

    defaults = {
      childClass: LightRow,
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
      this.view().updateTotals(total, window.EuglenaConfig.experimentLength - total);
    }
  }

  LightMatrixField.create = (data) => {
    return new LightMatrixField({
      modelData: data
    });
  }
  return LightMatrixField;
})