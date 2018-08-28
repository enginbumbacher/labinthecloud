import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import DomView from 'core/view/dom_view';
import Template from './legend.html';
import LegendRow from './legend__row';
import Button from 'core/component/button/field';

export default class LegendView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onDataSetRemoved', '_onDataSetAdded'])
    this._rows = [];

    this._clear = Button.create({
      id: 'clear_all',
      label: 'Clear All',
      style: 'link',
      eventName: 'Legend.ClearAllRequest',
      eventData: {
        experimentId: model.get('experimentId')
      }
    })
    this.addChild(this._clear.view(), 'thead th:last-child')
    this.$el.find('.aggregate__legend__experiment__label').html(`Experiment: ${(new Date(model.get('experiment.date_created'))).toLocaleString()}`)
    this.render(model);
    model.addEventListener('ResultGroup.ResultAdded', this._onDataSetAdded);
    model.addEventListener('ResultGroup.ResultRemoved', this._onDataSetRemoved);
  }

  _onDataSetAdded(evt) {
    this.render(evt.currentTarget)
  }

  _onDataSetRemoved(evt) {
    this.render(evt.currentTarget);
  }

  render(model) {
    while (this._rows.length) {
      this.removeChild(this._rows.pop());
    }

    model.get('results').forEach((res) => {
      const row = new LegendRow(res)
      this._rows.push(row);
      this.addChild(row, '.aggregate__legend__experiment__list tbody')
    })
  }
}  
