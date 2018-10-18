import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Module from 'core/app/module';
import AggregateDataTab from './tab/tab';

class AggregateDataModule extends Module {
  constructor(ctx) {
    super(ctx);
    if (Globals.get('AppConfig.aggregate')) {
      Utils.bindMethods(this, ['_onPhaseChange', '_onExperimentCountChange'])
      this.tab = new AggregateDataTab();
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
      Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange)
    }
  }

  run() {
    if (this.tab) Globals.get(`${ this.context.app }.Layout`).getPanel('result').addContent(this.tab.view())
  }

  _onPhaseChange(evt) {
    if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
      this.tab.hide();
    }
  }

  _onExperimentCountChange(evt) {
    if (evt.data.count && !evt.data.old) {
      this.tab.show();
    } else if (!evt.data.count) {
      this.tab.hide();
    }
  }

  destroy() {
    if (this.tab) {
      // Globals.get(`${this.context.app}.Layout`).getPanel('result').removeContent(this.tab.view());
      this.tab.destroy();
      Globals.get('Relay').removeEventListener('AppPhase.Change', this._onPhaseChange)
      Globals.get('Relay').removeEventListener('ExperimentCount.Change', this._onExperimentCountChange)
    }
    return super.destroy();
  }
}

export default AggregateDataModule;
