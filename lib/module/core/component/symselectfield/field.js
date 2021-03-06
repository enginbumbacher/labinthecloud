import BaseField from 'core/component/form/field/field';
import Model from './model';
import View from './view';
import Utils from 'core/util/utils';

class SymSelectField extends BaseField {
  constructor(settings = {}) {
    settings.viewClass = settings.viewClass || View;
    settings.modelClass = settings.modelClass || Model;
    super(settings);

    Utils.bindMethods(this, ['_onVariationChange'])
    this.checked = false;

    if (Utils.isString(this._model.get('value'))) {
      let proportion = (this._model.get('value').split('_').length === 2) ? parseFloat(this._model.get('value').split('_')[1])/100 : parseFloat(this._model.get('value').split('_').slice(-1).pop())/100;
      let initialValue = {
        'qualitativeValue': this._model.get('value'),
        'numericValue': proportion * parseFloat(this._model.get('maxValue')),
        'variation': 0
      }
      this._model.set('value', initialValue)
    }

    this._view.addEventListener('Field.ValueChange', this._onFieldChange);
    this._view.addEventListener('SymSelectField.ChangeRequest', this._onVariationChange);
    if (!this._model.get('changeable')) {
      this.disable();
    }
  }

  _onVariationChange(evt) {
    if (evt.bubbles) evt.stopPropagation();
    let oldVal = this._model.value();

    let varPercentage = (evt.data.value.split('_').length === 2)? parseFloat(evt.data.value.split('_')[1])/100 : parseFloat(evt.data.value.split('_').slice(-1).pop())/100;

    this._model.updateValue('variation',varPercentage);

    this.dispatchEvent('Field.Change', {
      oldValue: oldVal,
      value: this._model.value().qualitativeValue
    })
  }

  _onFieldChange(evt) {
    if (evt.bubbles) evt.stopPropagation();
    let oldVal = this._model.value();

    // Always grab the number at the end
    let proportion = (evt.data.value.split('_').length === 2)? parseFloat(evt.data.value.split('_')[1])/100 : parseFloat(evt.data.value.split('_').slice(-1).pop())/100;

    this._model.set('value', {
      variation: this._model.get('value').variation,
      qualitativeValue: evt.data.value,
      numericValue: proportion * parseFloat(this._model.get('maxValue'))
    });

    this.dispatchEvent('Field.Change', {
      oldValue: oldVal,
      value: this._model.value().qualitativeValue
    })
  }

  addOption(opt) {
    this._model.addOption(opt);
  }

  removeOption(id) {
    this._model.removeOption(id);
  }

  clearOptions() {
    this._model.clearOptions();
  }

  getOptions() {
    return this._model.get('options');
  }

  getAbleOptions() {
    return this._model.listAbleOptions()
  }

  disableOption(id) {
    this._model.disableOption(id);
  }

  enableOption(id) {
    this._model.enableOption(id);
  }

  selectFirstAble() {
    const able = this._model.listAbleOptions();
    if (!able.includes(this.value())) {
      this.setValue(able[0]);
    }
  }

  enable() {
    if (this._model.get('changeable')) {
      super.enable();
    }
  }

  setValue(val) {
    if (val) {
      let oldVal = this._model.value();
      let changed = false
      Object.keys(oldVal).forEach((key) => {
        if (oldVal[key] !== val[key]) changed = true;
      })
      if (changed) {
        this._model.updateValue('qualitativeValue',val.qualitativeValue);
        this._model.updateValue('numericValue', val.numericValue);
        this._model.updateValue('variation',val.variation);

        this.view()._render(this._model);

        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value()
        })
      }
    }
  }
}

SymSelectField.create = (data) => {
  return new SymSelectField({ modelData: data });
}

export default SymSelectField;
