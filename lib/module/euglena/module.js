import Module from 'core/app/module';
import Globals from 'core/model/globals';

export default class EuglenaModule extends Module {
  constructor(ctx) {
    super(ctx);
  }

  run() {
    Globals.get('Relay').dispatchEvent('AppPhase.Change', { phase: "login" });
  }
}
