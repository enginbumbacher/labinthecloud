define((require) => {
  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view');

  return class Field extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      super(settings);
      this._onFieldChange = this._onFieldChange.bind(this);

      this._view.$dom().addClass(this._model.get('classes').join(' '));
      this._view.addEventListener('Field.ValueChange', this._onFieldChange);
    }

    _onFieldChange(evt) {
      if (evt.bubbles) evt.stopPropagation();
      let oldVal = this._model.value();
      this._model.set('value', evt.data.value);
      this.dispatchEvent('Field.Change', {
        oldValue: oldVal,
        value: this._model.value()
      })
    }

    updateValidation(newValidation) {
      this._model._updateValidation(newValidation);
    }

    id() {
      return this._model.get('id');
    }

    setId(id) {
      this._model.set('id', id);
    }

    label() {
      return this._model.get('label');
    }

    enable() {
      this._model.enable();
      super.enable();
    }

    disable() {
      this._model.disable();
      super.disable();
    }

    show() {
      this._view.show();
    }

    hide() {
      this._view.hide();
    }

    validate() {
      return this._model.validate();
    }

    value() {
      return this._model.value();
    }

    setValue(val) {
      const oldVal = this._model.value();
      this._model.set('value', val);
      this.dispatchEvent('Field.Change', {
        oldValue: oldVal,
        value: this._model.value()
      })
      return Promise.resolve(val);
    }

    clear(useDefault = true) {
      if (useDefault) {
        return this.setValue(this._model.get('defaultValue'));
      } else {
        return this.setValue(null);
      }
    }

    setDefault() {
        this._model.set('value', this._model.get('defaultValue'));
    }

    require() {
      this._model.set('required', true);
    }

    unrequire() {
      this._model.set('required', false);
    }

    focus() {
      this.view().focus();
    }

    setErrors(errors) {
      this._model.set('errors', errors);
      this._model.set('isValid', errors.length);
    }
  };
});
