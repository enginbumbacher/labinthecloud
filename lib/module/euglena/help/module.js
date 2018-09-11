import Module from 'core/app/module';
import Help from './help';
import Globals from 'core/model/globals';

export default class HelpModule extends Module {
  constructor() {
    super();
    this.help = new Help();
  }

  run() {
    Globals.get('Layout').getPanel('result').addContent(this.help.view());
  }
};
