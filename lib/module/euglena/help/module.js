import Module from 'core/app/module';
import Help from './help';
import Globals from 'core/model/globals';

export default class HelpModule extends Module {
  constructor(ctx) {
    super(ctx);
    this.help = new Help();
  }

  run() {
    Globals.get(`${this.context.app}.Layout`).getPanel('result').addContent(this.help.view());
  }

  destroy() {
    return Promise.all([this.help.destroy(), super.destroy()])
  }
};
