// Application View
// ================
// 
// Provides a default template for an application.

import DomView from 'core/view/dom_view';
import Template from './app.html';

export default class AppView extends DomView {
  constructor(tmpl) {
    tmpl = tmpl || Template;
    super(tmpl);
  }
}
