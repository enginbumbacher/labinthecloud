import Application from 'core/app/application';
import HM from 'core/event/hook_manager';
import Globals from 'core/model/globals';
import Notifications from 'notifications/module';
import Euglena from 'euglena/module';
import Layout from 'layout/module';
import EuPanelResult from 'euglena/panel_result/module';
import EuPanelInteractive from 'euglena/panel_interactive/module';
import EuHelp from 'euglena/help/module';
import EuLogin from 'euglena/login/module';
import EuInteractiveTabs from 'euglena/ip_tabs/module';
import EuExperiment from 'euglena/experiment/module';
import EuResults from 'euglena/result/module';
import EuLogging from 'euglena/logging/module';
import EuModel from 'euglena/model/module';
import EuModelOneEye from 'euglena/model_oneeye/module';
import EuModelTwoEye from 'euglena/model_twoeye/module';
import EuModelBlockly from 'euglena/model_blockly/module';
import EuAggregate from 'euglena/aggregate/module';
import EuComponentManager from 'euglena/euglenacontroller/component/module';
import View from 'euglena/view';

import "./style.scss";

export default class Main extends Application {
  constructor(domRoot) {
    super(domRoot);
    Globals.set('AppConfig', window.EuglenaConfig);
    // HM.hook('Application.ViewClass', () => {
    //   return "euglena/view";
    // });
    HM.hook('Application.Modules', (set) => {
      set.add(Notifications);
      set.add(Layout);
      set.add(EuLogging);
      set.add(EuPanelInteractive);
      set.add(EuPanelResult);
      set.add(EuLogin);
      set.add(EuHelp);
      set.add(EuInteractiveTabs);
      set.add(EuExperiment);
      set.add(EuResults);
      set.add(EuModel);
      set.add(EuModelOneEye);
      set.add(EuModelTwoEye);
      set.add(EuModelBlockly);
      set.add(EuAggregate);
      // set.add(EuComponentManager);
      set.add(Euglena);
      return set;
    });
  }

  viewClass() {
    return View;
  }
}
