import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Field from 'core/component/form/field/field';
import Model from './model';
import View from './view';

class SliderField extends Field {
  constructor(settings = {}) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
    Utils.bindMethods(this, ['_onUnitChangeRequest', '_onChangeRequest','_onStopDrag'])

    this.view().addEventListener('SliderField.UnitChangeRequest', this._onUnitChangeRequest)
    this.view().addEventListener('SliderField.ChangeRequest', this._onChangeRequest)
    this.view().addEventListener('SliderField.StopDrag', this._onStopDrag)
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

  _onStopDrag(evt) {
    this.dispatchEvent('Field.StopDrag')
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

export default SliderField;
