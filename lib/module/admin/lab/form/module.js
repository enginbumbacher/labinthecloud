import Module from "core/app/module";
import Globals from "core/model/globals";
import Utils from "core/util/utils";

import Form from "./form";

export default class LabFormModule extends Module {
  constructor() {
    super();
    Utils.bindMethods(this, ['_onSubmit'])
  }

  init() {
    this._form = Form.create();
    this._form.view().addEventListener('LabEdit.Submit', this._onSubmit);
  }

  run() {
    Globals.get('App.view').addChild(this._form.view());
  }

  _onSubmit(evt) {
    console.log(this._form.export());
  }
}