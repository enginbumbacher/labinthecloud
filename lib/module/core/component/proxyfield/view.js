import FieldView from "core/component/form/field/view";

import Template from "./proxyfield.html";

export default class ProxyFieldView extends FieldView {
  constructor(model, tmpl) {
    super(model, tmpl || Template);
    this.render(model);
  }

  _onModelChange(evt) {
    super._onModelChange(evt);
    if (evt.data.path == "currentFieldId") {
      this.render(evt.currentTarget);
    }
  }

  render(model) {
    if (this._displayedFieldId) {
      this.removeChild(model.getFieldById(this._displayedFieldId).view());
    }
    let currField = model.getCurrentField();
    if (currField) {
      this.addChild(currField.view(), ".proxyfield__field");
      this._displayedFieldId = currField.id();
    } else {
      this._displayedFieldId = null;
    }
  }
}