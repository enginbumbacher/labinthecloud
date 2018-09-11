import MultiField from 'core/component/multifield/field';
import View from './view';
import LightRow from '../row/field';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';

const defaults = {
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
};

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
    this.view().updateTotals(total, Globals.get('AppConfig.experiment.maxDuration') - total);
  }
}

LightMatrixField.create = (data) => {
  return new LightMatrixField({
    modelData: data
  });
}
export default LightMatrixField;
