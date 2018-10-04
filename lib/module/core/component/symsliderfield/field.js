import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Field from 'core/component/form/field/field';
import Model from './model';
import View from './view';

class SymmetricSliderField extends Field {
  constructor(settings) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
    Utils.bindMethods(this, ['_onChangeRequest', '_onUnitChangeRequest'])
  
    this.view().addEventListener('SymSliderField.UnitChangeRequest', this._onUnitChangeRequest);
    this.view().addEventListener('SymSliderField.ChangeRequest', this._onChangeRequest);
  }

  _onUnitChangeRequest(evt) {
    if (!this._model.get('disabled')) {
      let oldVal = this._model.get('value');
      switch (evt.data.property) {
        case 'delta':
          if (evt.data.value) {
            this._model.setDeltaUnitValue(evt.data.value);
          } else {
            this._model.setDeltaUnitValue(Math.abs(this._model.get('unitValue') - evt.data.offset));
          }
        break;
        case 'base':
          this._model.setUnitValue(evt.data.value);
        break;
      }
      this.dispatchEvent('Field.Change', {
        oldValue: oldVal,
        value: this._model.value()
      });
    }
  }
  _onChangeRequest(evt) {
    if (!this._model.get('disabled')) {
      let oldVal = this._model.get('value');
      switch (evt.data.property) {
        case 'delta':
          this._model.setDeltaValue(evt.data.value);
        break;
        case 'base':
          this._model.setBaseValue(evt.data.value);
        break;
      }
      this.dispatchEvent('Field.Change', {
        oldValue: oldVal,
        value: this._model.value()
      });
    }
  }

  setValue(val) {
    let oldVal = this._model.get('value');
    this._model.setBaseValue(val.base);
    this._model.setDeltaValue(val.delta);
    this.dispatchEvent('Field.Change', {
      oldValue: oldVal,
      value: this._model.value()
    })
  }
}

SymmetricSliderField.create = (data) => {
  return new SymmetricSliderField({ modelData: data });
}

export default SymmetricSliderField;
