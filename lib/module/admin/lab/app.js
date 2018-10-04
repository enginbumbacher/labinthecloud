import Application from 'core/app/application';
import HM from 'core/event/hook_manager';
import Globals from 'core/model/globals';
import Notifications from 'notifications/module';
import LabFormModule from 'admin/lab/form/module';

import "./style.scss";

export default class LabFormApp extends Application {
  constructor(domRoot, name = "LabEditForm") {
    super(domRoot);

    Globals.set('EditLabConfig', window.EditLabConfig);
  }

  moduleSet() {
    let set = super.moduleSet();
    set.add(Notifications);
    set.add(LabFormModule);
    return set;
  }

  destroy() {
    return super.destroy().then(() => {
      Globals.set('EditLabConfig', null);
    })
  }
}
