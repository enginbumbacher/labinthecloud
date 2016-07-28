define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./field.html');

  return class FieldView extends DomView {
    constructor(model, tmpl) {
      super(tmpl ? tmpl : Template);
      this._onModelChange = this._onModelChange.bind(this);

      model.addEventListener('Model.Change', this._onModelChange);
    }

    _onModelChange(evt) {
      switch (evt.data.path) {
        case "disabled":
          if (evt.data.value) {
            this.disable()
          } else {
            this.enable()
          }
          break;
      }
    }

    focus() {}

    disable() {}

    enable() {}
  }
});