define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');
  
  const DomView = require('core/view/dom_view'),
    Template = require('text!./legend__row.html'),
    Button = require('core/component/button/field');

  return class LegendRow extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onModelChange', '_onShownClick'])
      this._resultId = model.get('id')
      this._clear = Button.create({
        id: 'clear',
        label: 'Clear',
        style: 'link',
        eventName: 'LegendRow.ClearRequest',
        eventData: {
          resultId: this._resultId
        }
      })
      this.addChild(this._clear.view(), '.aggregate__legend__clear');

      model.addEventListener('Model.Change', this._onModelChange)
      this._render(model);
      this.$dom().find('.aggregate__legend__show').click(this._onShownClick)
    }

    _onModelChange(evt) {
      this._render(evt.currentTarget)
    }

    _onShownClick(jqevt) {
      this.dispatchEvent('LegendRow.ShowToggleRequest', {
        resultId: this._resultId
      }, true)
    }

    _render(model) {
      if (model.get('name')) this.$dom().find('.aggregate__legend__name').html(model.get('name'))
      if (model.get('color')) this.$dom().find('.aggregate__legend__color').css({ background: model.get('color') })
      this.$dom().find('.aggregate__legend__show').prop('checked', model.get('shown'))
    }

    id() {
      return this._resultId;
    }
  }
})