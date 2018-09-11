import TabFormView from "core/component/form/tab_form_view";

export default class BootstrapTabFormView extends TabFormView {
  constructor(model, tmpl) {
    super(model, tmpl);
  }

  _renderHeader(model) {
    super._renderHeader(model);
    this.$dom().find(".form__header").addClass('h1');
  }
}