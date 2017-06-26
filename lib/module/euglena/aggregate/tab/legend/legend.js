define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');
  
  const DomView = require('core/view/dom_view'),
    Template = require('text!./legend.html'),
    LegendRow = require('./legend__row'),
    Button = require('core/component/button/field');

  return class LegendView extends DomView {
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
})