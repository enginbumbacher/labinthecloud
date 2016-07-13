define((require) => {
  const Controller = require('core/controller/controller'),
    Model = require('./model'),
    View = require('./view');

  class Form extends Controller {
    constructor(settings) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);

      this.view().addEventListener("*", this._onEvent);
    }

    _onEvent(evt) {
      if (evt.name.match(/^Form\./)) this.bubbleEvent(evt);
    }

    value() {
      return this._model.getValue();
    }
  }

  Form.create = (data) => {
    return new Form({ modelData: data });
  };

  return Form;
});