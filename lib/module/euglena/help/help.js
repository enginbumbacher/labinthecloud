import Component from 'core/component/component';
import Model from './model';
import View from './view';
import Globals from 'core/model/globals';
import Utils from 'core/util/utils';

export default class HelpComponent extends Component {
  constructor(settings = {}) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
    Utils.bindMethods(this, ['_onShowRequest', '_onHideRequest', '_onToggleRequest'])

    Globals.get('Relay').addEventListener('Help.Show', this._onShowRequest);
    Globals.get('Relay').addEventListener('Help.Hide', this._onHideRequest);
    this.view().addEventListener('Help.ToggleOpen', this._onToggleRequest);
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

  destroy() {
    Globals.get('Relay').removeEventListener('Help.Show', this._onShowRequest);
    Globals.get('Relay').removeEventListener('Help.Hide', this._onHideRequest);
    return super.destroy();
  }
}
