define((require) => {
  const DomView = require('core/view/dom_view'),
    Globals = require('core/model/globals'),
    Template = require('text!./profile.html'),
    Utils = require('core/util/utils');

  return class ProfileView extends DomView {
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
})
