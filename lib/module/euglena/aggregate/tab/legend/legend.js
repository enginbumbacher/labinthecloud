define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');
  
  const DomView = require('core/view/dom_view'),
    Template = require('text!./legend.html'),
    LegendRow = require('./legend__row');

  return class LegendView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onModelChange', '_onDataSetRemoved', '_onDataSetAdded'])
      this._rows = [];

      this.$el.find('.aggregate__legend__experiment__label').html(`Experiment: ${(new Date(model.get('experiment.date_created'))).toLocaleString()}`)
      model.get('results').forEach((res) => {
        this._addResult(res);
      });
      model.addEventListener('Model.Change', this._onModelChange);
      model.addEventListener('ResultGroup.ResultAdded', this._onDataSetAdded);
      model.addEventListener('ResultGroup.ResultRemoved', this._onDataSetRemoved);
    }

    _onModelChange(evt) {
      const model = evt.currentTarget;

      if (evt.data.path == 'experiment') {
        this.$el.find('.aggregate__legend__experiment__label').html(`Experiment: ${(new Date(model.get('experiment.date_created'))).toLocaleString()}`)
      }
    }

    _onDataSetAdded(evt) {
      this._addResult(evt.data.dataset);
    }

    _addResult(res) {
      const row = new LegendRow(res);
      this._rows.push(row);
      this.addChild(row, '.aggregate__legend__experiment__list tbody');
    }

    _onDataSetRemoved(evt) {

    }
  }  
})