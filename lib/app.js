define((require) => {
  const Application = require('core/app/application'),
    HM = require('core/event/hook_manager'),
    Globals = require('core/model/globals'),
    Euglena = require('euglena/module'),
    EuLayout = require('euglena/layout/module'),
    EuLogin = require('euglena/login/module'),
    EuHelp = require('euglena/help/module'),
    EuExperiment = require('euglena/experiment/module'),
    EuResult = require('euglena/result/module'),
    EuServer = require('euglena/serverinterface/module')
    ;
  require('link!./style.css');

  return class Main extends Application {
    constructor(domRoot) {
      super(domRoot);
      HM.hook('Application.ViewClass', () => {
        return "module/euglena/view";
      });
      HM.hook('Application.Modules', (set) => {
        set.add(Euglena);
        set.add(EuLayout);
        set.add(EuLogin);
        set.add(EuHelp);
        set.add(EuExperiment);
        set.add(EuResult);
        set.add(EuServer);
        // set.add(module);
        return set;
      });
    }
  }
});