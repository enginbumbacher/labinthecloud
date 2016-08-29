define((require) => {
  const Field = require('core/component/form/field/field'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils')
  ;

  return class MultiField extends Field {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings)
      Utils.bindMethods(this, ['_onAddRequest', '_onRemoveRequest', '_onOrderChange', '_onModelChange'])

      this.view().addEventListener('MultiField.AddFieldRequest', this._onAddRequest);
      this.view().addEventListener('MultiField.RemoveFieldRequest', this._onRemoveRequest);
      this.view().addEventListener('MultiField.OrderChangeRequest', this._onOrderChange);
      this._model.addEventListener('Model.Change', this._onModelChange);
    }

    _onAddRequest(evt) {
      evt.stopPropagation();
      this._model.createField();
    }

    _onRemoveRequest(evt) {
      evt.stopPropagation();
      this._model.removeField(evt.data.id);
    }

    _onOrderChange(evt) {
      evt.stopPropagation();
      this._model.updateOrder(evt.data.order);
    }

    _onModelChange(evt) {
      if (evt.data.path == "value") {
        this.dispatchEvent('Field.Change', {
          value: this.value()
        })
      }
    }

    setChildMeta(cls, init) {
      this._model.setChildMeta(cls, init);
    }

    lockField(ind) {
      this._model.lockField(ind);
    }

    unlockField(ind) {
      this._model.unlockField(ind);
    }

    getFields() {
      this._model.get('fields');
    }
  }
})