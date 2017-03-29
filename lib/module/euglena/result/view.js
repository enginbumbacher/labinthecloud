define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const DomView = require('core/view/dom_view'),
    Template = require('text!./results.html'),
    CircleHistogram = require('euglena/component/circlegraph/circlegraph'),
    Histogram = require('euglena/component/histogramgraph/histogramgraph'),
    TimeSeries = require('euglena/component/timeseriesgraph/timeseriesgraph'),
    VisualResult = require('euglena/component/visualresult/visualresult'),
    SelectField = require('core/component/selectfield/field')
  ;

  const vismap = {
    circle: CircleHistogram,
    histogram: Histogram,
    timeseries: TimeSeries
  }

  require('link!./style.css');

  return class ResultsView extends DomView {
    constructor(tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onTick', '_onVisualizationChange']);

      this._visualResult = VisualResult.create();
      this._visualResult.addEventListener('VisualResult.Tick', this._onTick);
      this._graphs = Globals.get('AppConfig.visualization.visualizationTypes').map((visConf) => {
        visConf.settings.id = visConf.id;
        return vismap[visConf.id].create(visConf.settings);
      });

      this.addChild(this._visualResult.view(), '.results__euglena');
      this._graphs.forEach((graph) => {
        this.addChild(graph.view(), '.results__visualization');
      });

      const visOpts = {};
      Globals.get('AppConfig.visualization.visualizationTypes').forEach((visConf) => {
        visOpts[visConf.id] = visConf.label;
      })

      this._visSelect = SelectField.create({
        id: "visualization",
        label: 'Visualization',
        options: visOpts
      });
      this.addChild(this._visSelect.view(), '.results__controls__visualization');
      this._visSelect.addEventListener('Field.Change', this._onVisualizationChange);
      this._onVisualizationChange({ currentTarget: this._visSelect });
    }

    _onTick(evt) {
      this._graphs.forEach((graph) => {
        graph.update(evt.data.time, evt.data.lights);
      });
    }

    handleResults(exp, res) {
      this.$el.find('.results__controls__experiment').html(`<label>Experiment:</label><span class="">${(new Date(exp.date_created)).toLocaleString()}</span>`)
      this._graphs.forEach((graph) => { 
        graph.reset();
        graph.handleData(res);
      });
      this._visualResult.handleLightData(exp.configuration);
      this._visualResult.play(res);
    }

    clear() {
      this.$el.find('.results__controls__experiment').html(`<label>Experiment:</label><span class="">(New Experiment)</span>`)
      this._visualResult.clear();
      this._graphs.forEach((graph) => {
        graph.reset();
      });
    }

    _onVisualizationChange(evt) {
      this._graphs.forEach((graph) => {
        if (graph.id() == evt.currentTarget.value()) {
          graph.view().show();
        } else {
          graph.view().hide();
        }
      })
    }
  }
})