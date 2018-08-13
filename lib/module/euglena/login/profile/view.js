import DomView from 'core/view/dom_view';
import Globals from 'core/model/globals';
import Template from './profile.html';
import Utils from 'core/util/utils';

export default class ProfileView extends DomView {
  constructor() {
    super(Template);
    this._onPhaseChange = this._onPhaseChange.bind(this);
    this._onLogoutClick = this._onLogoutClick.bind(this);

    Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
    this.$dom().find('.logout').on('click', this._onLogoutClick)

    if (Utils.urlParam('uid')) {
      this.$dom().find('.logout').hide();
    }
  }

  _onPhaseChange(evt) {
    if (Globals.get('user')) {

      this.$dom().find('.user').html(Globals.get('user'));
      this.$dom().addClass('profile__open');
    } else {

      this.$dom().find('.user').html('');
      this.$dom().removeClass('profile__open');
    }
  }

  _onLogoutClick(jqevt) {
    this.dispatchEvent('Login.Logout', {});
    jqevt.preventDefault();
    return false;
  }
}
