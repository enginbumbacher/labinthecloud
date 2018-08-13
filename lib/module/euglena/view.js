import AppView from 'core/app/view';
import Template from './app.html';
import './style.scss';

export default class EuglenaView extends AppView {
  constructor(tmpl) {
    tmpl = tmpl || Template;
    super(tmpl);
  }
}
