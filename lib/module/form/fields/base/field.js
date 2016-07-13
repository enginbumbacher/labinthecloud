define((require) => {
  const Controller = require('core/controller/controller'),
    Model = require('./model'),
    View = require('./view');

  return class Field extends Controller {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      super(settings);
    }

    value() {
      return this._model.get('value');
    }

    id() {
      return this._model.get('id');
    }

    setValue(val) {
      if (this.isValidValue(val))
        this._model.set('value', val);
    }

    validate() {
      return this.isValidValue(this.value());
    }

    isValidValue(val) {
      return true
    }

    enable() {
      this._model.set('disabled', false);
    }

    disable() {
      this._model.set('disabled', true);
    }

    isActive() {
      return !this._model.get('disabled');
    }
  };
});