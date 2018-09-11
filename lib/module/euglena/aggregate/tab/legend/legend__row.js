import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import DomView from 'core/view/dom_view';
import Template from './legend__row.html';
import Button from 'core/component/button/field';

export default class LegendRow extends DomView {
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
