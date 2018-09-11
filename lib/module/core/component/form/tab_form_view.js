import FormView from "core/component/form/view";
import Tabs from "core/component/tabs/tabs";
import FieldGroup from "core/component/fieldgroup/fieldgroup";

export default class TabFormView extends FormView {
  constructor(model, tmpl) {
    super(model, tmpl, true);
    this._tabs = Tabs.create({});
    this._tabIds = [];
    this.addChild(this._tabs.view(), '.form__fields');
    this.render(model);
  }

  _renderFields(model) {
    while (this._fieldViews.length)
      this.removeChild(this._fieldViews.pop());
    while (this._tabIds.length)
      this._tabs.removeTab(this._tabIds.pop());

    for (let regionId in model.get('regions')) {
      let destination = this._mapRegion(regionId);
      for (let field of model.get('regions')[regionId]) {
        if (field instanceof FieldGroup) {
          this._tabIds.push(field.id());
          this._tabs.buildTab({
            id: field.id(),
            title: field.label(),
            content: field.view()
          })
        } else {
          this._fieldViews.push(field.view());
          this.addChild(field.view(), destination);
        }
      }
    }
  }
}