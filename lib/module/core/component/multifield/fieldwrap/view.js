import DomView from 'core/view/dom_view';
import Template from './fieldwrap.html';
import Button from 'core/component/button/field';

export default class FieldWrapView extends DomView {
  constructor(settings) {
    super(Template);
    this._btnContainer = this.$el.find(".multifield__field__remove");
    this.subfield = settings.field;
    this.subview = this.subfield.view();
    this.addChild(this.subview, ".multifield__field");
    if (settings.classes) this.$el.addClass(settings.classes.join(' '));

    this.closeBtn = Button.create({
      id: "field__close",
      label: "&times;",
      eventName: "MultiField.RemoveFieldRequest",
      eventData: {
        id: this.subfield.id()
      }
    });

    this.addChild(this.closeBtn.view(), this._btnContainer);
  }

  lock() {
    this.removeChild(this.closeBtn.view());
    this.subfield.disable();
  }

  unlock() {
    this.addChild(this.closeBtn.view(), this._btnContainer);
    this.subfield.enable();
  }

  hideRemoveButton() {
    this.closeBtn.view().hide();
  }

  showRemoveButton() {
    this.closeBtn.view().show();
  }
};
