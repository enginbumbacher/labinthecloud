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
      Utils.bindMethods(this, ['_onTick', '_onVisualizationChange', '_onModelChange', 'activateModelComparison']);

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

      var modelOpts = {};
      if (Globals.get('AppConfig.system.enableDirectComparison') && Globals.get('AppConfig.model.tabs').length == 2) {
        modelOpts = {
         'none': 'No Model',
         'both': 'Both Models'
        };
      } else {
        modelOpts = {
         'none': 'No Model'
        };
      }

      Globals.get('AppConfig.model.tabs').forEach((tabConf, ind) => {
        let id = Globals.get('AppConfig.model.tabs.length')==1 ? '' : String.fromCharCode(97 + ind)
        modelOpts[id] = `Model ${id.toUpperCase()}`;
      });
      this._modelSelect = SelectField.create({
        id: 'model',
        label: 'Model',
        options: modelOpts,
        initialValue: 'none'
      });
      this._modelSelect.setValue('none')

      if (Globals.get('AppConfig.model.tabs').length) {
        this.addChild(this._modelSelect.view(), '.results__controls__model');
        this._modelSelect.addEventListener('Field.Change', this._onModelChange);
      }

      if (Globals.get('AppConfig.system.enableDirectComparison')) {
        this._visualResult_2 = VisualResult.create();
        this._visualResult_2.hideControls();
        this.$el.find('.results__visuals').append(`<div class="results__euglena_2">
        <h2 class="results__title">View of Microscope and Model B</h2></div>`);
        this.addChild(this._visualResult_2.view(), '.results__euglena_2');
        this.$el.find('.results__euglena_2').hide();
      }

      const visOpts = {};
      Globals.get('AppConfig.visualization.visualizationTypes').forEach((visConf) => {
        visOpts[visConf.id] = visConf.label;
      })

      this._visSelect = SelectField.create({
        id: "visualization",
        label: 'Visualization',
        options: visOpts
      });

      if(Object.keys(visOpts).length) {
        this.addChild(this._visSelect.view(), '.results__controls__visualization');
        this._visSelect.addEventListener('Field.Change', this._onVisualizationChange);
        this._onVisualizationChange({ currentTarget: this._visSelect });
      } else {
        this.$el.find('.results__visualization').hide();
      }


      Globals.get('Relay').addEventListener('EuglenaModel.directComparison', this.activateModelComparison);

    }

    _onTick(evt) {
      this._graphs.forEach((graph) => {
        graph.update(evt.data.time, evt.data.lights);
      });
    }

    handleExperimentResults(exp, res, modelComparison = false) {
      this.$el.find('.results__controls__experiment').html(`<label>Experiment:</label><span class="">${(new Date(exp.date_created)).toLocaleString()}</span>`)
      if (this.$el.find('.results__visualization').is(':visible')) {
        this._graphs.forEach((graph) => {
          graph.reset();
          graph.handleData(res, 'live');
          graph.handleData(null, 'model');
        });
      }

      this._visualResult.handleLightData(exp.configuration);
      this._visualResult.play(res);

      if(Globals.get('AppConfig.system.enableDirectComparison')) {
        this._visualResult_2.handleLightData(exp.configuration);
        this._visualResult_2.play(res);
      }
    }

    handleModelResults(model, res, tabId, modelComparison = false) {

      if (!modelComparison) {

        let color = 0;
        if (tabId != 'none') {
          color = Globals.get(`ModelTab.${tabId}`).color();
        }
        this._graphs.forEach((graph) => {
          if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {
            if (tabId == 'none') {
              graph.setLive(true);
              graph.handleData(null, 'model');
            } else {
              graph.setLive(false);
              graph.handleData(res, 'model', color);
            }
          } else {
            graph.handleData(res, 'model', color);
          }

        })
        this._visualResult.handleModelData(res, model, color); // Activate the euglena mini models for the corresponding Model
        if (tabId != this._modelSelect.value()) {
          this._silenceModelSelect = true;
          this._modelSelect.setValue(tabId).then(() => {
            this._silenceModelSelect = false;
          })
        }
      } else { // If model comparison is activated
        this._graphs.forEach((graph) => {
          graph.handleData(null,'model');
        })

        let color = Globals.get(`ModelTab.${tabId}`).color();

        if (tabId == 'a') {this._visualResult.handleModelData(res, model, color)}
        else if (tabId == 'b') {this._visualResult_2.handleModelData(res, model, color)}

      }
    }

    clear() {
      this.$el.find('.results__controls__experiment').html(`<label>Experiment:</label><span class="">(New Experiment)</span>`)
      this._visualResult.clear();
      this._graphs.forEach((graph) => {
        graph.reset();
      });
    }

    showVideo(activeVideo) {
      //this._visualResult.showVideo(activeVideo);
      this._visualResult.dispatchEvent('VideoResult.ShowVideo', {showVideo: activeVideo});
      if (Globals.get('AppConfig.system.enableDirectComparison')) {
        this._visualResult_2.dispatchEvent('VideoResult.ShowVideo', {showVideo: activeVideo});
      }
    }

    _onVisualizationChange(evt) {
      this._graphs.forEach((graph) => {
        if (graph.id() == evt.currentTarget.value()) {
          graph.view().show();
        } else {
          graph.view().hide();
        }
      })
      Globals.get('Logger').log({
        type: "visualization_change",
        category: "results",
        data: {
          visualization: evt.currentTarget.value()
        }
      })
    }

    _onModelChange(evt) {
      if (this._silenceModelSelect) return;
      this.dispatchEvent('ResultsView.RequestModelData', {
        tabId: evt.currentTarget.value()
      })
    }

    activateModelComparison() {
      if (Globals.get('directModelComparison')) {
        this.$el.find('.results__visualization').hide();
        this._visSelect.hide();

        this.$el.find('.results__euglena').children('.results__title').html("View of Microscope and Model A");
        this.$el.find('.results__euglena_2').show();

      } else { // hide the div for visualResult_2

        this.$el.find('.results__euglena').children('.results__title').html("View of Microscope");
        this.$el.find('.results__euglena_2').hide();

        if(Object.keys(this._visSelect._model._data.options).length) {
          this.$el.find('.results__visualization').show();
          this._visSelect.show();
        }

      }

    }

    reset() {
      this.clear();
      this._modelSelect.setValue('none');
      this._visSelect.setValue(this._visSelect.getAbleOptions()[0])
    }
  }
})
