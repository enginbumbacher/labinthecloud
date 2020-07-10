import FieldGroup from "core/component/fieldgroup/fieldgroup";
import Utils from "core/util/utils";

import TextField from "core/component/textfield/field";
import BooleanField from "core/component/booleanfield/field";
import ProxyField from "core/component/proxyfield/field";

class BlocklyParameterFields extends FieldGroup {
  constructor(conf) {
    let visControl = BooleanField.create({
      id: 'visible',
      label: 'Visible to Students',
      defaultValue: true
    });
    let editControl = ProxyField.create({
      id: 'changeable',
      proxyControl: visControl,
      fields: [
        BooleanField.create({
          id: true,
          label: 'Changable by Students',
          defaultValue: true
        })
      ]
    })
    conf.modelData.valueField.setId('configurable');
    conf.modelData.valueField.setLabel('Set Value');
    conf.modelData.fields = (conf.modelData.fields || []).concat([
      TextField.create({
        id: 'label',
        label: 'Label'
      }),
      visControl,
      editControl,
      ProxyField.create({
        id: 'initialValue',
        fields: [conf.modelData.valueField]
      }),
      ProxyField.create({
        id: 'variation',
        proxyControl: editControl,
        fields: [
          BooleanField.create({
            id: true,
            label: 'Allow Variation',
            defaultValue: true
          })
        ]
      })
    ]);
    conf.modelData.showLabel = Utils.exists(conf.modelData.showLabel) ? conf.modelData.showLabel : true;
    conf.modelData.collapsible = Utils.exists(conf.modelData.collapsible) ? conf.modelData.collapsible : true;
    conf.modelData.collapsed = Utils.exists(conf.modelData.collapsed) ? conf.modelData.collapsed : true;
    super(conf);
    Utils.bindMethods(this, ['_onProxyControlChange']);
    this.getSubField('visible').addEventListener('Field.Change', this._onProxyControlChange);
    this.getSubField('changeable').addEventListener('Field.Change', this._onProxyControlChange);
    this._onProxyControlChange();
  }

  _onProxyControlChange(evt) {
    let oldVal = this.value();
    this.getSubField('initialValue').setCurrentFieldId(!(this.getSubField('visible').value() && this.getSubField('changeable').value()) ? 'configurable' : null)
    this.dispatchEvent('Field.Change', {
      oldValue: oldVal,
      value: this.value()
    })
  }
}

BlocklyParameterFields.create = (data = {}) => {
  return new BlocklyParameterFields({ modelData: data });
}

export default BlocklyParameterFields;