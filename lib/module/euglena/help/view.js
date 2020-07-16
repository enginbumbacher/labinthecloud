import DomView from 'core/view/dom_view';
import Template from './help.html';
//import Remarkable from 'remarkable';
const { Remarkable } = require('remarkable');
import './style.scss';

export default class HelpView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    model.addEventListener('Model.Change', this._onModelChange.bind(this));
    if (this.$dom().find('.help__markdown').length) {
      let mkdn = this.$dom().find('.help__markdown').html()
      let md = new Remarkable();
      this.$dom().find('.help__content').html(md.render(mkdn));
    }

    this.$dom().find('.help__tab').click(this._onTabClick.bind(this));
  }

  _onModelChange(evt) {
    switch (evt.data.path) {
      case "open":
        this.$dom().toggleClass('help__open', evt.data.value);
      break;
    }
  }

  _onTabClick(evt) {
    this.dispatchEvent("Help.ToggleOpen", {});
  }

  toggle(tabOpen) {
    if (tabOpen) {
      this.$el.find('#selectHelp').removeClass('notflippedY');
      this.$el.find('#selectHelp').addClass('flippedY');
    } else {
      this.$el.find('#selectHelp').removeClass('flippedY');
      this.$el.find('#selectHelp').addClass('notflippedY');
    }
  }

}
