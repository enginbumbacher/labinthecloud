define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');
  
  const DomView = require('core/view/dom_view'),
    Template = require('text!./tab.html'),
    ResultGroupLegend = require('./legend/legend');

  require('link!./style.css');

  return class AggregateTabView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onDataSetAdded', '_onDataSetRemoved', '_onDataSetsCleared', '_onTabClick', '_onModelChange'])
      this._legends = {};
      model.addEventListener('Model.Change', this._onModelChange)
      model.addEventListener('AggregateData.DataSetAdded', this._onDataSetAdded)
      model.addEventListener('AggregateData.DataSetRemoved', this._onDataSetRemoved)
      model.addEventListener('AggregateData.DataSetsCleared', this._onDataSetsCleared)

      this.$el.find('.aggregate__tab').click(this._onTabClick)
    }

    _onModelChange(evt) {
      if (evt.data.path == "open") {
        this.$el.toggleClass('aggregate__open', evt.data.value)
      }
    }

    _onDataSetAdded(evt) {
      this.$el.find('.aggregate__legend__empty').hide();
      const ds = evt.data.dataset;
      const expId = ds.get('experimentId')
      if (!this._legends[expId]) {
        this._legends[expId] = new ResultGroupLegend(evt.currentTarget.get(`datasets.${expId}`));
        this.addChild(this._legends[expId], '.aggregate__legend__results');
      }
    }

    _onDataSetRemoved(evt) {
      if (Object.values(evt.currentTarget.get('datasets')).length == 0) {
        this.$el.find('.aggregate__legend__empty').show();
      }
    }

    _onDataSetsCleared(evt) {
      this.$el.find('.aggregate__legend__empty').show();
    }

    _onTabClick(jqevt) {
      this.dispatchEvent('AggregateTab.ToggleRequest', {}, true);
    }
  }
})