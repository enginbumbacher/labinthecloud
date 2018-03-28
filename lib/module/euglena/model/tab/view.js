define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const DomView = require('core/view/dom_view'),
    Template = require('text!./tab.html');

  return class ModelTabView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
    }
  }
})
