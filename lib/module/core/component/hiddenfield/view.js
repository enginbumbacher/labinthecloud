import FieldView from 'core/component/form/field/view';

export default class HiddenFieldView extends FieldView {
  constructor(model, tmpl) {
    super(model, tmpl || `<div class="component__hiddenfield"></div>`);
  }
}