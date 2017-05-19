define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');
  
  const DomView = require('core/view/dom_view'),
    Template = require('text!./tab.html'),
    ResultGroupLegend = require('./legend/legend'),

    AvgOrientation = require('euglena/aggregate/graph/orientation_time/graph'),
    AvgVelocity = require('euglena/aggregate/graph/velocity_time/graph'),
    OrientationIntensity = require('euglena/aggregate/graph/orientation_intensity/graph'),
    OrientationDirection = require('euglena/aggregate/graph/orientation_direction/graph'),
    SelectField = require('core/component/selectfield/field')
    ;

  require('link!./style.css');

  return class AggregateTabView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, [
        '_onDataSetAdded', '_onDataSetRemoved', '_onDataSetsCleared', '_onTabClick', 
        '_onModelChange', '_onResultGroupRemoved', '_onGraphSelectionChange', '_onResultToggle',
        '_onGraphDisableRequest', '_onGraphEnableRequest'])
      this._legends = {};
      this._graphs = {
        orientation_time: AvgOrientation.create({}),
        velocity_time: AvgVelocity.create({}),
        orientation_intensity: OrientationIntensity.create({}),
        orientation_direction: OrientationDirection.create({})
      };

      Object.values(this._graphs).forEach((graph) => {
        this.addChild(graph.view(), ".aggregate__graphs")
        graph.addEventListener('AggregateGraph.DisableRequest', this._onGraphDisableRequest);
        graph.addEventListener('AggregateGraph.EnableRequest', this._onGraphEnableRequest);
      })

      let selectOpts = {};
      for (let key in this._graphs) {
        selectOpts[key] = this._graphs[key].label()
      }
      this._graphSelect = SelectField.create({
        label: 'Visualization',
        id: 'visualization',
        options: selectOpts,
        value: 'orientation_time'
      })

      this.addChild(this._graphSelect.view(), '.aggregate__legend__visualization');
      this._graphSelect.addEventListener('Field.Change', this._onGraphSelectionChange)
      this._onGraphSelectionChange()

      model.addEventListener('Model.Change', this._onModelChange)
      model.addEventListener('AggregateData.DataSetAdded', this._onDataSetAdded)
      model.addEventListener('AggregateData.DataSetRemoved', this._onDataSetRemoved)
      model.addEventListener('AggregateData.DataSetsCleared', this._onDataSetsCleared)
      model.addEventListener('AggregateData.ResultGroupRemoved', this._onResultGroupRemoved)
      model.addEventListener('AggregateData.ResultToggle', this._onResultToggle)

      this.$el.find('.aggregate__tab').click(this._onTabClick)
    }

    updateGraphs(model) {
      Object.values(this._graphs).forEach((graph) => {
        graph.update(model.get('datasets'));
      })
    }

    _onGraphSelectionChange(evt) {
      for (let key in this._graphs) {
        if (key == this._graphSelect.value()) {
          this._graphs[key].view().show()
        } else {
          this._graphs[key].view().hide()
        }
      }
      this.dispatchEvent('AggregateTab.GraphSelectionChange', {})
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
      this.updateGraphs(evt.currentTarget);
    }

    _onDataSetRemoved(evt) {
      if (Object.values(evt.currentTarget.get('datasets')).length == 0) {
        this.$el.find('.aggregate__legend__empty').show();
      }
      this.updateGraphs(evt.currentTarget);
    }

    _onDataSetsCleared(evt) {
      this.$el.find('.aggregate__legend__empty').show();
      this.updateGraphs(evt.currentTarget);
    }

    _onTabClick(jqevt) {
      this.dispatchEvent('AggregateTab.ToggleRequest', {}, true);
    }

    _onResultGroupRemoved(evt) {
      const expId = evt.data.group.get('experimentId');
      this.removeChild(this._legends[expId]);
      delete this._legends[expId];
      this._onDataSetRemoved(evt);
    }

    _onResultToggle(evt) {
      Object.values(this._graphs).forEach((graph) => {
        graph.toggleResult(evt.data.resultId, evt.data.shown)
      })
    }

    _onGraphEnableRequest(evt) {
      this._graphSelect.enableOption(evt.data.id)
    }

    _onGraphDisableRequest(evt) {
      this._graphSelect.disableOption(evt.data.id)
      this._graphSelect.selectFirstAble();
    }

    getCurrentVisualization() {
      return this._graphs[this._graphSelect.value()].label()
    }
  }
})