define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./help.html'),
    Remarkable = require('remarkable');

  require('link!./style.css');

  return class HelpView extends DomView {
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
  }
})