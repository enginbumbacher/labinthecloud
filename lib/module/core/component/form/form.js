define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view');

  class Form extends Component {
    constructor(settings) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      this._onFieldChanged = this._onFieldChanged.bind(this);
      this._onSubmitRequest = this._onSubmitRequest.bind(this);

      this._model.addEventListener('Form.FieldChanged', this._onFieldChanged);
      this._view.addEventListener('Form.SubmitRequest', this._onSubmitRequest);
      // this.view().addEventListener("*", this._onEvent);
    }

    validate() {
      return this._model.validate();
    }

    export() {
      let exp = {};
      for (let field of this._model.getFields()) {
        exp[field.id()] = field.value();
      }
      return exp;
    }

    import(data) {
      return this.clear().then(() => {
        for (let field of this._model.getFields()) {
          if (data[field.id()] !== undefined) {
            field.setValue(data[field.id()]);
          }
        }
      })
    }

    getField(fieldId) {
      for (let field of this._model.getFields()) {
        if (field.id() == fieldId) {
          return field;
        }
      }
      return null;
    }

    addField(field, destination) {
      this._model.addField(field, destination);
    }

    removeField(field) {
      this._model.removeField(field);
    }

    addButton(button) {
      this._model.addButton(button);
    }

    removeButton(buttonId) {
      this._model.removeButton(buttonId);
    }

    getButton(buttonId) {
      return this._model.getButton(buttonId);
    }

    setTitle(title) {
      this._model.set('title', title);
    }

    focus(fieldId) {
      this.getField(fieldId).focus()
    }

    setErrors(errors, fieldId) {
      if (fieldId) {
        this.getField(fieldId).setErrors(errors)
      } else {
        this._model.set('errors', errors);
      }
    }

    clear() {
      return this._model.clear();
    }

    _onFieldChanged(evt) {
      this.dispatchEvent(evt);
    }

    _onSubmitRequest(evt) {
      let btn;
      if (btn = this._model.getButton('submit')) {
        btn.trigger();
      }
    }

    disable() {
      this._model.disable();
      super.disable();
    }

    enable() {
      this._model.enable();
      super.enable();
    }

    hide() {
      this._model.hide();
      super.hide();
    }

    hideFields() {
      this._model.hideFields();
      super.hide();
    }

    disableFields() {
      this._model.disableFields();
      super.disable();
    }

  }

  Form.create = (data) => {
    return new Form({ modelData: data });
  };

  return Form;
});
