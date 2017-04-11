define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');
  
  const Field = require('core/component/form/field/field'),
    Model = require('./model'),
    View = require('./view');

  class SliderField extends Field {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_onUnitChangeRequest', '_onChangeRequest'])

      this.view().addEventListener('SliderField.UnitChangeRequest', this._onUnitChangeRequest)
      this.view().addEventListener('SliderField.ChangeRequest', this._onChangeRequest)
    }

    _onUnitChangeRequest(evt) {
      if (!this._model.get('disabled')) {
        let oldVal = this._model.value();
        this._model.setUnitValue(evt.data.value);
        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value()
        })
      }
    }

    _onChangeRequest(evt) {
      if (!this._model.get('disabled')) {
        let oldVal = this._model.value();
        this._model.setValue(evt.data.value);
        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value()
        })
      }
    }

    setValue(val) {
      let oldVal = this._model.value();
      this._model.setValue(val);
      this.dispatchEvent('Field.Change', {
        oldValue: oldVal,
        value: this._model.value()
      })
    }
  }

  SliderField.create = (data) => {
    return new SliderField({ modelData: data })
  }

  return SliderField;
})