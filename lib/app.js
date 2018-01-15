define((require) => {
  const Application = require('core/app/application'),
    HM = require('core/event/hook_manager'),
    Globals = require('core/model/globals'),
    Notifications = require('module/notifications/module'),
    Euglena = require('euglena/module'),
    Layout = require('module/layout/module'),
    EuPanelResult = require('euglena/panel_result/module'),
    EuPanelInteractive = require('euglena/panel_interactive/module'),

    EuHelp = require('euglena/help/module'),
    EuLogin = require('euglena/login/module'),
    EuInteractiveTabs = require('euglena/ip_tabs/module'),

    EuExperiment = require('euglena/experiment/module'),

    EuResults = require('euglena/result/module'),
    EuLogging = require('euglena/logging/module'),

    EuModel = require('euglena/model/module'),
    EuModelOneEye = require('euglena/model_oneeye/module'),
    EuModelTwoEye = require('euglena/model_twoeye/module'),

    EuModelBlockly = require('euglena/model_blockly/module'),

    EuAggregate = require('euglena/aggregate/module'),

    EuComponentManager = require('euglena/euglenacontroller/component/module')
    ;
  require('link!./style.css');

  return class Main extends Application {
    constructor(domRoot) {
      super(domRoot);
      Globals.set('AppConfig', window.EuglenaConfig);
      HM.hook('Application.ViewClass', () => {
        return "module/euglena/view";
      });
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
  }
});
