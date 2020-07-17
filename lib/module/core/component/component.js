import Controller from 'core/controller/controller';

export default class Component extends Controller {
  constructor(settings) {
    super(settings);
    this._active = true;
  }

  enable() {
    this._active = true;
    this.dispatchEvent('Component.Enabled', {});
  }
  disable() {
    this._active = false;
    this.dispatchEvent('Component.Disabled', {});
  }
  hide() {
    this._active = false;
    this.dispatchEvent('Component.Hidden',{});
  }
  isActive() {
    return this._active;
  }
}
