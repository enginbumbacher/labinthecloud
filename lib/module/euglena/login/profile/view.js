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

    if (Utils.urlParam('uid') || Globals.get('AppConfig.system.userId')) {
      this.$dom().find('.logout').hide();
    }
  }

  _onPhaseChange(evt) {
    let user = Globals.get('user');
    if (user) {
      this.$dom().find('.user').html(user.replace(Globals.get('AppConfig.studentGroup.uuid'), Globals.get('AppConfig.studentGroup.name')));
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

  destroy() {
    Globals.get('Relay').removeEventListener('AppPhase.Change', this._onPhaseChange);
    return Promise.resolve(true);
  }
}
