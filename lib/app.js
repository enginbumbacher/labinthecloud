define((require) => {
  const Application = require('core/app/application'),
    HM = require('core/event/hook_manager'),
    Globals = require('core/model/globals'),
    Euglena = require('module/euglena/module'),
    EuLayout = require('module/euglena/layout/module'),
    EuLogin = require('module/euglena/login/module'),
    EuHelp = require('module/euglena/help/module'),
    EuExperiment = require('module/euglena/experiment/module')
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
        // set.add(module);
        return set;
      });
    }
  }
});