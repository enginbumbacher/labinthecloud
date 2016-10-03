define((require) => {
  const Action = require('modules/action/action');

  return class FormAction extends Action {
    constructor() {
      super();
    }

    getButton() {}
  };
});