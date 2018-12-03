import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import DomView from 'core/view/dom_view';
import Template from './results.html';
import CircleHistogram from 'euglena/component/circlegraph/circlegraph';
import Histogram from 'euglena/component/histogramgraph/histogramgraph';
import TimeSeries from 'euglena/component/timeseriesgraph/timeseriesgraph';
import ComponentSpeed from 'euglena/component/componentspeedgraph/componentspeedgraph';
import OrientationChange from 'euglena/component/orientationchangegraph/orientationchangegraph';
import VisualResult from 'euglena/component/visualresult/visualresult';
import SelectField from 'core/component/selectfield/field';
import './style.scss';

const vismap = {
  circle: CircleHistogram,
  histogram: Histogram,
  timeseries: TimeSeries,
  componentspeed: ComponentSpeed,
  orientationchange: OrientationChange
};

export default class ResultsView extends DomView {
  constructor(tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onTick', '_onVisualizationChange', '_onModelChange', 'activateModelComparison', '_moveTabs','_resetModelSelect']);

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

    this.lightConfig = null;

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
      initialValue: 'none',
      description: 'Turn models on or off.'
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
      options: visOpts,
      description: 'Each visualization shows different aspects of how the Euglena or models behave.'
    });

    if(Object.keys(visOpts).length) {
      this.addChild(this._visSelect.view(), '.results__controls__visualization');
      this._visSelect.addEventListener('Field.Change', this._onVisualizationChange);
      this._onVisualizationChange({ currentTarget: this._visSelect });
    } else {
      this.$el.find('.results__visualization').hide();
    }

    this.$el.find('#moveTabs').click(this._moveTabs);


    Globals.get('Relay').addEventListener('EuglenaModel.directComparison', this.activateModelComparison);
    Globals.get('Relay').addEventListener('Model.Changed', this._resetModelSelect)

  }

  _resetModelSelect() {
    if (this._modelSelect) {
      this._modelSelect.setValue('none');
    }
  }

  _moveTabs() {
    if (this.$el.find('#moveTabs').hasClass('notflippedX')) {
      var hideTab = true;
      this.$el.find('#moveTabs').removeClass('notflippedX');
      this.$el.find('#moveTabs').addClass('flippedX');
    } else {
      var hideTab = false;
      this.$el.find('#moveTabs').removeClass('flippedX');
      this.$el.find('#moveTabs').addClass('notflippedX');
    }

    Globals.get('Relay').dispatchEvent('InteractiveTabs.Toggle',{hideTab: hideTab});

  }

  _onTick(evt) {
    if (this._graphs) {
      this._graphs.forEach((graph) => {
        graph.update(evt.data.time, evt.data.lights);
      });
    }
  }

  handleExperimentResults(exp, res, modelComparison = false) {
    this.lightConfig = exp.configuration;
    this.$el.find('.results__controls__experiment').html(`<label>Experiment:</label><span class="">${(new Date(exp.date_created)).toLocaleString()}</span>`)
    if (this.$el.find('.results__visualization').is(':visible')) {
      this._graphs.forEach((graph) => {
        graph.reset();
        graph.handleData(res, 'live', this.lightConfig);
        graph.handleData(null, 'model', this.lightConfig);
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
    if (!model & tabId != 'none') {
      this._modelSelect.setValue('none')
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        id: 'no-model',
        type: 'error',
        expireLabel: 'Got it.',
        message: 'You first have to create a model.',
        autoExpire: 5
      });
    } else {
      if (!modelComparison) {
        var color = 0;
        if (tabId != 'none') {
          if (model.sensorConfigJSON) {
            var numSensors = 0;
            Object.keys(JSON.parse(model.sensorConfigJSON)).forEach(key => { if (key.toLowerCase().match('sensor')) numSensors += 1; })
            if (numSensors == 2) {
              color = Globals.get('AppConfig.system.testMaterial') ? Globals.get(`ModelTab.${tabId}`).color() : 0x099B2F; //parseInt(0x00B141,16); //0x00B141;
            } else {
              color = Globals.get(`ModelTab.${tabId}`).color();
            }
          } else {
            color = Globals.get(`ModelTab.${tabId}`).color();
          }
        }
        this._graphs.forEach((graph) => {
          if (Globals.get('AppConfig.system.expModelModality') === 'sequential') {
            if (tabId == 'none') {
              graph.setLive(true);
              graph.handleData(null, 'model', this.lightConfig);
            } else {
              graph.setLive(false);
              graph.handleData(res, 'model', this.lightConfig, color);
            }
          } else if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') {
            if (tabId == 'none') {
              graph.setLive(false);
              graph.handleData(null, 'model', this.lightConfig);
            } else {
              graph.setLive(false);
              graph.handleData(res, 'model', this.lightConfig, color);
            }
          } else {
            graph.handleData(res, 'model', this.lightConfig, color);
          }

        })
        this._visualResult.handleModelData(res, model, color); // Activate the euglena mini models for the corresponding Model
        Globals.get('Relay').dispatchEvent('VisualResult.ResetRequest',{});
        if (tabId != this._modelSelect.value()) {
          this._silenceModelSelect = true;
          this._modelSelect.setValue(tabId).then(() => {
            this._silenceModelSelect = false;
          })
        }
      } else { // If model comparison is activated
        this._graphs.forEach((graph) => {
          graph.handleData(null,'model', this.lightConfig);
        })

        let color = Globals.get(`ModelTab.${tabId}`).color();

        if (tabId == 'a') {this._visualResult.handleModelData(res, model, color)}
        else if (tabId == 'b') {this._visualResult_2.handleModelData(res, model, color)}

      }
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
