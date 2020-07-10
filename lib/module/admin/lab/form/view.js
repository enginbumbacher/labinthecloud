import TabFormView from "core/component/form/tab_form_view";
import Utils from "core/util/utils";

export default class BootstrapTabFormView extends TabFormView {
  constructor(model, tmpl) {
    super(model, tmpl);
    Utils.bindMethods(this, ['_onTabChange']);
    this.tabs.addEventListener('Tab.Change', this._onTabChange);
    model.addEventListener('Form.FieldChanged', this._onTabChange);
  }

  _onTabChange(evt) {
    this.$dom().find('select').addClass('form-control');
    this.$dom().find('input[type="number"],input[type="text"],textarea').addClass('form-control');
    this.$dom().find('input[type="checkbox"],input[type="radio"]').addClass('form-check');
    this.$dom().find('.component__textfield .field__wrap').addClass('input-group');
    this.$dom().find('.textfield__prefix').addClass('input-group-prepend');
    this.$dom().find('.textfield__suffix').addClass('input-group-append');
    this.$dom().find('.textfield__meta').addClass('input-group-text');
  }

  render(model) {
    super.render(model);
    this.$dom().find(".form__header").addClass('h1');
    this._onTabChange();
  }
}