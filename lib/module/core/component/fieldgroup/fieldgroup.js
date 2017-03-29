define((require) => {
  const Field = require('core/component/form/field/field'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;
// # FieldGroup
//
// A field that encapsulates multiple subfields of varying types.
  return class FieldGroup extends Field {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_onSubFieldChange']);

      for (let field of this._model.get('fields')) {
        field.addEventListener('Field.Change', this._onSubFieldChange);
      }
    }

    _onSubFieldChange(evt) {
      this.dispatchEvent('Field.Change', {
        value: this.value()
      });
    }

    getSubField(id) {
      this._model.getSubField(id);
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
  }
});