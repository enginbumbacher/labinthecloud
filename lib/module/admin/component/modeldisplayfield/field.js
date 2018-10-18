import DisplayField from 'admin/component/displayfield/field';
import Utils from 'core/util/utils'

class ModelDisplayField extends DisplayField {
  constructor(conf) {
    super(conf);
    Utils.bindMethods(this, ['_buildLabel'])
    this._model.set('labelFn', this._buildLabel);
    this.view()._render(this._model);
  }

  _buildLabel(val) {
    return Utils.promiseAjax(`/api/v1/EuglenaModels/${val}`).then((m) => {
      return m.name;
    })
  }
}

ModelDisplayField.create = (data = {}) => {
  return new ModelDisplayField({ modelData: data })
}

export default ModelDisplayField;