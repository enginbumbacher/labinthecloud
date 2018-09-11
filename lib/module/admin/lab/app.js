import Application from 'core/app/application';
import HM from 'core/event/hook_manager';
import Globals from 'core/model/globals';
import Notifications from 'notifications/module';
import LabFormModule from 'admin/lab/form/module';

import "./style.scss";

export default class LabFormApp extends Application {
  constructor(domRoot) {
    super(domRoot);

    Globals.set('AppConfig', window.AppConfig);
    HM.hook('Application.Modules', (set) => {
      set.add(Notifications);
      set.add(LabFormModule);
      return set;
    });
  }
}
