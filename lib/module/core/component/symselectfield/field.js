define((require) => {
  const BaseField = require('core/component/form/field/field'),
    Model = require('./model'),
    View = require('./view'),
    Utils = require('core/util/utils');

  class SymSelectField extends BaseField {
    constructor(settings = {}) {
      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      super(settings);

      Utils.bindMethods(this, ['_onCheckboxChange'])
      this.checked = false;

      let proportion = parseFloat(this._model.get('value').substr(this._model.get('value').indexOf('_')+1)) / 100;
      let initialValue = {
        'qualitativeValue': this._model.get('value'),
        'numericValue': proportion * parseFloat(this._model.get('maxValue')),
        'variation': this.checked
      }
      this._model.set('value', initialValue)

      this._view.addEventListener('Field.ValueChange', this._onFieldChange);
      this._view.addEventListener('SymSelectField.ChangeRequest', this._onCheckboxChange);

    }

    _onCheckboxChange(evt) {
      this.checked = evt.data.value;
      let oldVal = this._model.value();
      this._model.updateValue('variation',this.checked);
      this.dispatchEvent('Field.Change', {
        oldValue: oldVal,
        value: this._model.value().qualitativeValue
      })
    }

    _onFieldChange(evt) {
      if (evt.bubbles) evt.stopPropagation();
      let oldVal = this._model.value();

      let proportion = parseFloat(evt.data.value.substr(evt.data.value.indexOf('_')+1)) / 100;

      this._model.set('value', {
        variation: this.checked,
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

    setValue(val) {
      if (val) {
        let oldVal = this._model.value();
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

  SymSelectField.create = (data) => {
    return new SymSelectField({ modelData: data });
  }

  return SymSelectField;
});
