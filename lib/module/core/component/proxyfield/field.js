import Field from "core/component/form/field/field";
import Utils from "core/util/utils"
import Model from "./model";
import View from "./view";

class ProxyField extends Field {
  constructor(conf = {}) {
    conf.modelClass = conf.modelClass || Model;
    conf.viewClass = conf.viewClass || View;
    super(conf);
    Utils.bindMethods(this, ['_onProxyControlChange', '_onSubFieldChange']);
    if (this._model.get('proxyControl')) {
      this._model.get('proxyControl').addEventListener('Field.Change', this._onProxyControlChange);
      this._setFieldIdFromProxy();
    }
    this._model.get('fields').forEach((field) => {
      field.addEventListener('Field.Change', this._onSubFieldChange);
    })
  }

  setProxyControl(field) {
    if (this._model.get('proxyControl')) {
      this._model.get('proxyControl').removeEventListener('Field.Change', this._onProxyControlChange);
    }
    this._model.set('proxyControl', field);
    this._model.get('proxyControl').addEventListener('Field.Change', this._onProxyControlChange);
  }

  setCurrentFieldId(id) {
    this._model.set('currentFieldId', id);
  }

  value() {
    return this._model.getCurrentField() ? this._model.getCurrentField().value() : null;
  }

  setValue(val) {
    if (this._model.getCurrentField()) {
      this._model.getCurrentField().setValue(val);
    }
  }

  _onProxyControlChange(evt) {
    this._setFieldIdFromProxy();
  }

  _setFieldIdFromProxy() {
    let fieldId = this._model.get('proxyControl').value();
    if (fieldId != this._model.get('currentFieldId')) {
      let oldVal = this.value()
      this._model.set('currentFieldId', fieldId);
      this.dispatchEvent('Field.Change', {
        oldValue: oldVal,
        value: this.value()
      })
    }
  }

  _onSubFieldChange(evt) {
    // console.log(this.id(), "changed");
    this.dispatchEvent('Field.Change', {
      value: this.value()
    });
  }
}

ProxyField.create = (data = {}) => {
  return new ProxyField({ modelData: data })
}

export default ProxyField