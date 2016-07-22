define((require) => {
  const AppView = require('core/app/view'),
    Template = require('text!./app.html');
  require('link!./style.css');

  return class EuglenaView extends AppView {
    constructor(tmpl) {
      tmpl = tmpl || Template;
      super(tmpl);
    }
  }
});