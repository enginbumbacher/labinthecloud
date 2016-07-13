// Application View
// ================
// 
// Provides a default template for an application.

define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./app.html');

  return class AppView extends DomView {
    constructor(tmpl) {
      tmpl = tmpl || Template;
      super(tmpl);
    }
  }
});
