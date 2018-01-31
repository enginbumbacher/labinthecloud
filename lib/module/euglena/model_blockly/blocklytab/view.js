define((require) => {
  const $ = require('jquery');

  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const DomView = require('core/view/dom_view'),
    Template = require('text!./tab.html');

  require('link!./style.css');

  return class ModelingTabView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, [
        '_onTabClick', '_onModelChange'])

      model.addEventListener('Model.Change', this._onModelChange)

      this.$el.find('.modeling__tab').click(this._onTabClick)
      this.disableFields();
    }

    _onModelChange(evt) {
      if (evt.data.path == "open") {
        this.$el.toggleClass('modeling__open', evt.data.value)
        this.updateFieldStatus(evt.currentTarget);
      }
   }

    updateFieldStatus(model) {
      if (model.get('open')) {
        this.enableFields();
      } else {
        this.disableFields();
      }
    }

    enableFields() {
      //this._graphSelect.enable();
      this.$el.find('input, button').removeProp('disabled');
    }

    disableFields() {
      //this._graphSelect.disable();
      this.$el.find('input, button').prop('disabled', true);
    }

    _onTabClick(jqevt) {
      Globals.get('Relay').dispatchEvent('ModelingTab.ToggleRequest', {tabType: 'blockly'}, true);
    }
  }
})
