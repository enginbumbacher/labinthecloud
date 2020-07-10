import $ from 'jquery';
import Module from 'core/app/module';
import Globals from 'core/model/globals';
import Utils from "core/util/utils";

export default class WindowResize extends Module {
  constructor(ctx) {
    super(ctx);
    Utils.bindMethods(this, ['_onResize'])
  }
  init() {
    if (window) window.addEventListener('resize', this._onResize);
  }

  _onResize() {
    Globals.get('Relay').dispatchEvent('Window.Resize', {
      width: $(window).width(),
      height: $(window).height()
    });
  }

  destroy() {
    if (window) window.addEventListener('resize', this._onResize);
    return Promise.resolve(true);
  }
};
