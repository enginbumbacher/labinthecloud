import $ from 'jquery';
import Module from 'core/app/module';
import Globals from 'core/model/globals';
import Event from 'core/event/event';

export default class WindowResize extends Module {
  init() {
    if (window) window.addEventListener('resize', this._onResize.bind(this));
  }

  _onResize() {
    Globals.get('Relay').dispatchEvent(new Event('Window.Resize', {
      width: $(window).width(),
      height: $(window).height()
    }));
  }
};
