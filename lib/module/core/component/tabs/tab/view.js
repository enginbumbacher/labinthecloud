define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),

    Template = require('text!./tab_page.html');

  return class TabPageView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      this.addChild(model.get('content'));
    }
  }
})