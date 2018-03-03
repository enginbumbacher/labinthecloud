define((require) => {
  const Controller = require('core/controller/controller'),
    Model = require('./model'),
    View = require('./view'),
    Globals = require('core/model/globals')
    ;

  return class HelpComponent extends Controller {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);

      Globals.get('Relay').addEventListener('Help.Show', this._onShowRequest.bind(this));
      Globals.get('Relay').addEventListener('Help.Hide', this._onHideRequest.bind(this));
      this.view().addEventListener('Help.ToggleOpen', this._onToggleRequest.bind(this));
    }

    _onShowRequest(evt) {
      this._model.show();
    }
    _onHideRequest(evt) {
      this._model.hide();
    }
    _onToggleRequest(evt) {
      this._model.toggle();
      this._view.toggle(this._model.get('open'))
    }
  }
});
