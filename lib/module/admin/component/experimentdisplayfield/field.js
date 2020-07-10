import DisplayField from 'admin/component/displayfield/field';
import Utils from 'core/util/utils'

class ExperimentDisplayField extends DisplayField {
  constructor(conf) {
    super(conf);
    Utils.bindMethods(this, ['_buildLabel'])
    this._model.set('labelFn', this._buildLabel);
    this.view()._render(this._model);
  }

  _buildLabel(val) {
    return Utils.promiseAjax(`/api/v1/Experiments/${val}`).then((exp) => {
      return exp.name ? exp.name : (new Date(exp.date_created)).toLocaleString();
    })
  }
}

ExperimentDisplayField.create = (data = {}) => {
  return new ExperimentDisplayField({ modelData: data })
}

export default ExperimentDisplayField;