import Field from 'core/component/form/field/field';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';
// # FieldGroup
//
// A field that encapsulates multiple subfields of varying types.
class FieldGroup extends Field {
  constructor(settings = {}) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
    Utils.bindMethods(this, ['_onSubFieldChange', '_onCollapseToggleRequest']);

    for (let field of this._model.get('fields')) {
      field.addEventListener('Field.Change', this._onSubFieldChange);
    }
    this.view().addEventListener('FieldGroup.CollapseToggle', this._onCollapseToggleRequest);
    if (settings.modelData.value) {
      this.setValue(settings.modelData.value);
    }
  }

  _onSubFieldChange(evt) {
    this.dispatchEvent('Field.Change', {
      value: this.value()
    });
  }

  getSubField(id) {
    return this._model.getSubField(id);
  }

  addField(field) {
    this._model.addField(field);
    field.addEventListener('Field.Change', this._onSubFieldChange);
  }

  removeField(id) {
    if (this.getSubField(id)) {
      this.getSubField(id).removeEventListener('Field.Change', this._onSubFieldChange);
    }
    this._model.removeField(id);
  }

  _onCollapseToggleRequest(evt) {
    this._model.set('collapsed', !this._model.get('collapsed'));
  }

  destroy() {
    return Promise.all(this._model.get('fields').map((f) => f.destroy()).concat(super.destroy()));
  }
}

FieldGroup.create = (data = {}) => {
  return new FieldGroup({ modelData: data })
}

export default FieldGroup;